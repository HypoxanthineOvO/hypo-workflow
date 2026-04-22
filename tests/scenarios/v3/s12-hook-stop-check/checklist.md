# Scenario: s12 — Hook Stop-Check

## 测试步骤

不需要跑完整 Pipeline。直接用 bash 测试 Hook 脚本的各种情况：

### Case A：无 Pipeline 目录
```
cd /tmp && bash /path/to/prompt-pipeline/hooks/stop-check.sh
```
- [ ] 输出 `{}` （空 JSON，允许停止）
- [ ] 退出码 0

### Case B：Pipeline 状态 = completed
```
cd tests/scenarios/v3/s12-hook-stop-check/

# 创建一个 completed 状态的 state.yaml

mkdir -p .pipeline

cat > .pipeline/state.yaml << 'EOF'
pipeline:
  name: s12-hook-stop-check
  status: completed
EOF

bash /path/to/prompt-pipeline/hooks/stop-check.sh
```
- [ ] 输出 `{}` （允许停止）
- [ ] 退出码 0

### Case C：Pipeline 状态 = running + state 超过 60 秒未更新
```
# 创建一个 running 状态的 state.yaml，修改文件时间为 2 分钟前

cat > .pipeline/state.yaml << 'EOF'
pipeline:
  name: s12-hook-stop-check
  status: running
current:
  step: implement
EOF

touch -t $(date -d '2 minutes ago' '+%Y%m%d%H%M.%S') .pipeline/state.yaml 2>/dev/null || \
touch -A -0200 .pipeline/state.yaml

bash /path/to/prompt-pipeline/hooks/stop-check.sh
```
- [ ] 输出包含 `"decision": "block"`
- [ ] 输出包含 `"reason"` 字段
- [ ] JSON 格式合法（`python3 -m json.tool` 通过）

### Case D：Pipeline 状态 = running + state 刚刚更新（< 60 秒）
```
cat > .pipeline/state.yaml << 'EOF'
pipeline:
  name: s12-hook-stop-check
  status: running
current:
  step: implement
EOF

# state.yaml 刚刚写入，mtime 就是现在

bash /path/to/prompt-pipeline/hooks/stop-check.sh
```
- [ ] 输出包含 `"decision": "block"`（Pipeline 运行中就应该阻止停止）
- [ ] 退出码 0

### JSON 校验
- [ ] 所有 Case 的输出都通过 `python3 -m json.tool`

## 结果
- 测试日期：____
- 总体结果：PASS / FAIL
- 备注：____
