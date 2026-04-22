# Scenario: s13 — Hook Session-Start

## 测试步骤

直接用 bash 测试 session-start.sh 的各种 matcher：

### Case A：startup（无 state.yaml）
```
cd /tmp/empty-dir

bash /path/to/prompt-pipeline/hooks/session-start.sh startup
```
- [ ] 输出合法 JSON
- [ ] 输出 `{}` 或包含空 additionalContext（无 Pipeline 可注入）

### Case B：startup（有 state.yaml，status=idle）
```
cd tests/scenarios/v3/s13-hook-session-start/

mkdir -p .pipeline

cat > .pipeline/state.yaml << 'EOF'
pipeline:
  name: s13-test
  status: idle
EOF

bash /path/to/prompt-pipeline/hooks/session-start.sh startup
```
- [ ] 输出包含 `additionalContext`
- [ ] additionalContext 包含 Pipeline 名称

### Case C：resume（有 state.yaml，status=running）
```
cat > .pipeline/state.yaml << 'EOF'
pipeline:
  name: s13-test
  status: running
current:
  prompt_file: 01-feature.md
  step: implement
  step_index: 3
EOF

bash /path/to/prompt-pipeline/hooks/session-start.sh resume
```
- [ ] 输出包含 `additionalContext`
- [ ] additionalContext 包含当前 prompt 和 step 信息
- [ ] additionalContext 包含"从中断处继续"类似提示

### Case D：compact
```
bash /path/to/prompt-pipeline/hooks/session-start.sh compact
```
- [ ] 输出包含 `additionalContext`
- [ ] additionalContext 包含"上下文已压缩"类似警告

### Case E：clear
```
bash /path/to/prompt-pipeline/hooks/session-start.sh clear
```
- [ ] 输出合法 JSON

### JSON 校验
- [ ] 所有 Case 的输出都通过 `python3 -m json.tool`

## 结果
- 测试日期：____
- 总体结果：PASS / FAIL
- 备注：____
