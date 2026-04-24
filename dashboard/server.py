from __future__ import annotations

import asyncio
import json
import os
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

import markdown
import uvicorn
import yaml
from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from watchfiles import Change, awatch


ROOT = Path(__file__).resolve().parent
STATIC_DIR = ROOT / "static"
TEMPLATES_DIR = ROOT / "templates"


def load_yaml(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    if not isinstance(data, dict):
        return {}
    return data


def load_text(path: Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")


def markdown_to_html(text: str) -> str:
    return markdown.markdown(
        text,
        extensions=["fenced_code", "tables", "toc"],
    )


def status_label(status: str) -> str:
    mapping = {
        "done": "完成",
        "completed": "完成",
        "in_progress": "进行中",
        "running": "进行中",
        "deferred": "Deferred",
        "failed": "失败",
        "blocked": "阻塞",
        "skipped": "跳过",
        "pending": "待执行",
        "idle": "待执行",
    }
    return mapping.get(status, status or "未知")


def status_icon(status: str) -> str:
    mapping = {
        "done": "✅",
        "completed": "✅",
        "in_progress": "🔄",
        "running": "🔄",
        "deferred": "⚠️",
        "failed": "❌",
        "blocked": "❌",
        "skipped": "⏭️",
        "pending": "⏳",
        "idle": "⏳",
    }
    return mapping.get(status, "•")


def list_reports(reports_dir: Path) -> list[str]:
    if not reports_dir.exists():
        return []
    return sorted(path.name for path in reports_dir.glob("*.md"))


def derive_milestones(state: dict[str, Any], pipeline_dir: Path) -> list[dict[str, Any]]:
    milestones = state.get("milestones")
    if isinstance(milestones, list) and milestones:
        normalized = []
        for index, item in enumerate(milestones):
            if not isinstance(item, dict):
                continue
            normalized.append(
                {
                    "id": f"M{index}",
                    "name": item.get("name", f"Milestone {index}"),
                    "status": item.get("status", "pending"),
                    "summary": item.get("deferred_reason") or "",
                }
            )
        return normalized

    prompts_dir = pipeline_dir / "prompts"
    prompt_files = sorted(path.name for path in prompts_dir.glob("*.md")) if prompts_dir.exists() else []
    current_file = state.get("current", {}).get("prompt_file")
    completed = {entry.get("prompt_file") for entry in state.get("history", {}).get("completed_prompts", []) if isinstance(entry, dict)}

    derived: list[dict[str, Any]] = []
    for index, prompt_file in enumerate(prompt_files):
        status = "pending"
        if prompt_file in completed:
            status = "done"
        elif current_file == prompt_file:
            status = "in_progress"
        derived.append(
            {
                "id": f"M{index}",
                "name": prompt_file.removesuffix(".md"),
                "status": status,
                "summary": "",
            }
        )
    return derived


def recent_activity(progress_text: str, log_data: dict[str, Any]) -> list[str]:
    if "## 最近活动" in progress_text:
        section = progress_text.split("## 最近活动", 1)[1]
        if "## " in section:
            section = section.split("## ", 1)[0]
        lines = [line.strip() for line in section.splitlines() if line.strip().startswith("- ")]
        if lines:
            return lines[:8]

    entries = log_data.get("entries", [])
    if not isinstance(entries, list):
        return []
    rendered: list[str] = []
    for entry in entries[-8:][::-1]:
        if not isinstance(entry, dict):
            continue
        timestamp = entry.get("timestamp", "")
        summary = entry.get("summary", "")
        rendered.append(f"- **{timestamp}** {summary}")
    return rendered


def progress_summary(progress_text: str, state: dict[str, Any], pipeline_dir: Path) -> dict[str, Any]:
    milestones = derive_milestones(state, pipeline_dir)
    total = len(milestones)
    done = sum(1 for item in milestones if item["status"] == "done")
    percent = int((done / total) * 100) if total else 0
    pipeline = state.get("pipeline", {})
    current = state.get("current", {})
    return {
        "project_name": pipeline.get("name", "Hypo-Workflow"),
        "status": pipeline.get("status", "idle"),
        "phase": current.get("phase", "idle"),
        "current_step": current.get("step", "—"),
        "current_prompt": current.get("prompt_file", "—"),
        "done": done,
        "total": total,
        "percent": percent,
        "progress_text": progress_text,
    }


@dataclass
class DashboardContext:
    pipeline_dir: Path
    shutdown_delay: int


class ConnectionManager:
    def __init__(self, shutdown_delay: int) -> None:
        self.active_connections: list[WebSocket] = []
        self.last_disconnect_time: float | None = None
        self.shutdown_delay = shutdown_delay

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)
        self.last_disconnect_time = None
        await self.broadcast(
            {
                "type": "connected",
                "timestamp": datetime.now().isoformat(),
            }
        )

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if not self.active_connections:
            self.last_disconnect_time = time.time()

    async def broadcast(self, payload: dict[str, Any]) -> None:
        if not self.active_connections:
            return
        dead: list[WebSocket] = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(payload))
            except Exception:
                dead.append(connection)
        for connection in dead:
            self.disconnect(connection)


def create_app(pipeline_dir: str, shutdown_delay: int = 30) -> FastAPI:
    app = FastAPI(title="Hypo-Workflow Dashboard")
    app.state.ctx = DashboardContext(pipeline_dir=Path(pipeline_dir).resolve(), shutdown_delay=shutdown_delay)
    app.state.templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
    app.state.manager = ConnectionManager(shutdown_delay=shutdown_delay)
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

    async def watch_pipeline() -> None:
        watch_target = app.state.ctx.pipeline_dir
        if not watch_target.exists():
            return
        async for changes in awatch(str(watch_target)):
            for change_type, changed_path in changes:
                event = {
                    "type": "file_changed",
                    "file": os.path.basename(changed_path),
                    "path": changed_path,
                    "change": change_type.name.lower() if isinstance(change_type, Change) else str(change_type),
                    "timestamp": datetime.now().isoformat(),
                }
                await app.state.manager.broadcast(event)

    async def watch_shutdown() -> None:
        while True:
            await asyncio.sleep(5)
            last_disconnect = app.state.manager.last_disconnect_time
            if last_disconnect and not app.state.manager.active_connections:
                if time.time() - last_disconnect > app.state.manager.shutdown_delay:
                    os._exit(0)

    @app.on_event("startup")
    async def startup() -> None:
        app.state.watch_task = asyncio.create_task(watch_pipeline())
        app.state.shutdown_task = asyncio.create_task(watch_shutdown())

    @app.on_event("shutdown")
    async def shutdown() -> None:
        for task_name in ("watch_task", "shutdown_task"):
            task = getattr(app.state, task_name, None)
            if task:
                task.cancel()

    def build_view_model() -> dict[str, Any]:
        pipeline_dir_path = app.state.ctx.pipeline_dir
        state = load_yaml(pipeline_dir_path / "state.yaml")
        config = load_yaml(pipeline_dir_path / "config.yaml")
        log_data = load_yaml(pipeline_dir_path / "log.yaml")
        progress_text = load_text(pipeline_dir_path / "PROGRESS.md")
        milestones = derive_milestones(state, pipeline_dir_path)
        reports_dir = Path(config.get("pipeline", {}).get("reports_dir", pipeline_dir_path / "reports"))
        if not reports_dir.is_absolute():
            reports_dir = pipeline_dir_path.parent / reports_dir
        summary = progress_summary(progress_text, state, pipeline_dir_path)
        return {
            "state": state,
            "config": config,
            "progress_text": progress_text,
            "milestones": milestones,
            "reports": list_reports(reports_dir),
            "reports_dir": reports_dir,
            "recent_activity": recent_activity(progress_text, log_data),
            "summary": summary,
            "status_label": status_label,
            "status_icon": status_icon,
        }

    @app.get("/", response_class=HTMLResponse)
    async def root() -> RedirectResponse:
        return RedirectResponse(url="/dashboard", status_code=307)

    @app.get("/dashboard", response_class=HTMLResponse)
    async def dashboard(request: Request) -> HTMLResponse:
        context = build_view_model()
        return app.state.templates.TemplateResponse(
            "index.html",
            {
                "request": request,
                **context,
            },
        )

    @app.get("/health")
    async def health() -> JSONResponse:
        return JSONResponse({"status": "ok"})

    @app.get("/api/state")
    async def api_state() -> JSONResponse:
        state = load_yaml(app.state.ctx.pipeline_dir / "state.yaml")
        if not state.get("milestones"):
            state["milestones"] = derive_milestones(state, app.state.ctx.pipeline_dir)
        return JSONResponse(state)

    @app.get("/api/config")
    async def api_config() -> JSONResponse:
        return JSONResponse(load_yaml(app.state.ctx.pipeline_dir / "config.yaml"))

    @app.get("/api/progress")
    async def api_progress() -> PlainTextResponse:
        return PlainTextResponse(load_text(app.state.ctx.pipeline_dir / "PROGRESS.md"))

    @app.get("/api/reports")
    async def api_reports() -> JSONResponse:
        context = build_view_model()
        return JSONResponse({"reports": context["reports"]})

    @app.get("/api/reports/{name}")
    async def api_report(name: str) -> HTMLResponse:
        context = build_view_model()
        reports_dir: Path = context["reports_dir"]
        report_path = (reports_dir / name).resolve()
        if reports_dir.resolve() not in report_path.parents or not report_path.exists():
            raise HTTPException(status_code=404, detail="Report not found")
        html = markdown_to_html(report_path.read_text(encoding="utf-8"))
        return HTMLResponse(html)

    @app.websocket("/ws")
    async def websocket_endpoint(websocket: WebSocket) -> None:
        await app.state.manager.connect(websocket)
        try:
            while True:
                await websocket.receive_text()
        except WebSocketDisconnect:
            app.state.manager.disconnect(websocket)
        except Exception:
            app.state.manager.disconnect(websocket)

    return app


def run_server(directory: str, port: int, host: str = "0.0.0.0", shutdown_delay: int = 30) -> None:
    app = create_app(directory, shutdown_delay=shutdown_delay)
    uvicorn.run(app, host=host, port=port)
