# M12 / F005 — Beamer Slides, Demo Script, and Cycle Validation

## 实施计划

1. 从 M11 技术报告派生 LaTeX Beamer slides，目标 25-35 页。
2. 使用简约科技风：浅灰背景、深灰文字、淡蓝/淡黄强调，内容密度按课堂技术报告处理。
3. 每 3-4 页形成一个 topic block，覆盖：
   - personal motivation；
   - AI Coding constraints；
   - Harness Engineering；
   - architecture/file protocol；
   - execution loop/layering/behavior solidification/automatic maintenance；
   - V9 Case Study；
   - C2 new design；
   - Chat Mode / Progressive Discover / Test Profiles；
   - demo route；
   - limitations/future work。
4. 加入真实代码/config 片段、文件结构、Mermaid/TikZ/Graphviz 技术图、必要截图。
5. 写 demo script：`/hw:plan` 或 `/hw:plan --batch` -> Progressive Discover / Test Profile -> Feature Queue -> `/hw:chat` 与 OpenCode sidebar/footer -> `/hw:release` README update。
6. 运行最终验证：core tests、readme-freshness、skill-quality、batch queue fixtures、OpenCode artifact checks、chat/discover/profile coverage、report/slides build。

## 依赖

- M11 technical report。
- M02 README freshness。
- M04 skill-quality。
- M05-M07 batch/metrics。
- M08-M09 OpenCode TUI。
- M13-M19 chat/discover/test-profile 实现。
- LaTeX Beamer 工具链。

## 验证点

- Slides 包含详细 V9 Case Study，不怕内容多。
- Slides 是技术报告风格，不是商业 pitch。
- Demo route 与实际命令和 UI surface 一致。
- Final validation 覆盖 C2 所有 Feature。
- 新增三组需求在 slides 中有可视化展示，而不是只被一句话带过。

## 约束

- 不用图片替代技术说明；图像只做辅助。
- 如需 GPT Image，生成内容必须服务于报告/Slides 叙事，技术图优先用 Mermaid/TikZ/Graphviz。
- 若某个最终检查依赖外部 OpenCode runtime，记录手动 smoke 结果或 blocker。

## 需求

- 创建 Beamer `.tex` source。
- 编译 slides PDF。
- 创建 demo script。
- 完成 C2 全链路验证报告。

## 预期测试

- Beamer build。
- Slides 必需 topic blocks 检查。
- `node --test core/test/*.test.js`
- README freshness check。
- Skill-quality check。
- Batch queue/metrics fixture check。
- OpenCode artifact/TUI smoke check。
- chat / discover / test-profile 相关检查。

## 预期产出

- Beamer `.tex` source。
- Slides PDF，如果环境支持。
- Demo script。
- Final validation report。
