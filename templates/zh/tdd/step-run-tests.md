# 步骤：run_tests

## 目标

运行当前 Prompt 相关测试，并按阶段分类结果。

## 阶段处理

Pipeline runtime 必须向本步骤传入以下阶段之一：

- `RED`
- `GREEN`
- `GENERAL`

## 指令

1. 运行宿主项目最相关的测试命令。
2. 记录：
   - 通过数量
   - 失败数量
   - 错误数量
   - 使用的命令
3. 按阶段解释结果：
   - `RED`：新写测试预期失败。如果大量测试意外通过，记录 warning。
   - `GREEN`：所有必需测试预期通过。剩余失败必须报告。
   - `GENERAL`：根据当前 Prompt 目标测试是否通过来判断。
4. 如果该运行步骤配置了 `strict=true` 且结果不符合预期，建议停止 Pipeline。

## 输出备注

记录到 state 和 log：

- 阶段
- 命令
- 通过/失败/错误数量
- warning
- strict 模式下是否应阻塞
