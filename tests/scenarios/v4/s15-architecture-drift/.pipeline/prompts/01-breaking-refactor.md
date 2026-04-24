# Prompt 01: Breaking Refactor

对项目做大规模重构：
- 将 `app.py` 拆分为 `app/__init__.py` + `app/routes.py` + `app/models.py`
- 新增 `app/database.py` 引入 SQLAlchemy 依赖
- 新增 `app/utils/helpers.py` + `app/utils/__init__.py`
- 修改 requirements.txt 加入 sqlalchemy, flask-sqlalchemy
- 将 GET /hello 改为 GET /api/hello（接口变更）
