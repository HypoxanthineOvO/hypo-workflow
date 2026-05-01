import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

test("showcase report refresh requires dedicated docs source, git packaging, and vendor submodule", async () => {
  const gitignore = await readFile(".gitignore", "utf8");
  const prompt = await readFile(
    ".pipeline/prompts/19-book-report-slides-imagegen-and-showcase-packaging.md",
    "utf8",
  );

  assert.ok(
    existsSync("docs/showcase/c2-report"),
    "expected docs/showcase/c2-report to exist as the canonical showcase source directory",
  );
  assert.ok(existsSync(".gitmodules"), "expected .gitmodules to exist for vendor submodule management");

  const gitmodules = await readFile(".gitmodules", "utf8");
  assert.match(gitmodules, /\[submodule "vendor\/Hypoxanthine-LaTeX"\]/);
  assert.match(gitmodules, /path = vendor\/Hypoxanthine-LaTeX/);
  assert.match(gitmodules, /url = git@github\.com:HypoxanthineOvO\/Hypoxanthine-LaTeX\.git/);

  assert.match(gitignore, /^docs\/showcase\/c2-report\/build\/$/m);
  assert.match(gitignore, /^docs\/showcase\/c2-report\/vendor\/$/m);
  assert.match(gitignore, /^\*\.aux$/m);
  assert.match(gitignore, /^\*\.fdb_latexmk$/m);
  assert.match(gitignore, /^\*\.fls$/m);
  assert.match(gitignore, /^\*\.xdv$/m);

  assert.match(prompt, /docs\/showcase\/c2-report/);
  assert.match(prompt, /vendor\/Hypoxanthine-LaTeX/);
});

test("report source expands the narrative spine and key lived examples", async () => {
  const report = await readFile("docs/showcase/c2-report/report.tex", "utf8");

  assert.match(report, /Copilot 连续被封 3 个账号/);
  assert.match(report, /Hypo-LaTeX/);
  assert.match(report, /Bill/);
  assert.match(report, /Agent/);
  assert.match(report, /Research/);
  assert.match(report, /Info/);
  assert.match(report, /Superpowers/);
  assert.match(report, /早期 Harness/);
  assert.match(report, /案例插框|case box|Case Box/i);
  assert.match(report, /这个功能解决了怎样的问题/);
  assert.match(report, /用户反馈|作者主动设计/);
});

test("slides source requires GPT Image 2 visual system plus real technical evidence", async () => {
  const slides = await readFile("docs/showcase/c2-report/slides.tex", "utf8");

  assert.match(slides, /GPT Image 2|Image Gen/i);
  assert.match(slides, /封面|分节页|背景图/);
  assert.match(slides, /真实代码|真实 YAML|真实命令|真实 repo 树|真实 .*pipeline/i);
  assert.match(slides, /问题.*经历.*机制.*系统.*证据.*结论/s);
});
