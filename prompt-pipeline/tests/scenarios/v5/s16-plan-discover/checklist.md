# System Test Checklist: s16-plan-discover

## Metadata
- Scenario: `s16-plan-discover`
- Version: `V5`
- Goal: 验证 `/hw:plan` 与 `/hw:plan:discover` 的入口与 Discover 产物

## Execution Checks
- [ ] `/hw:plan` 会加载 `plan/PLAN-SKILL.md`
- [ ] `/hw:plan:discover` 已注册
- [ ] 能生成 `.pipeline/design-spec.md`
- [ ] `.plan-state/discover.yaml` 语义明确

## Exit Criteria
- [ ] 未识别 `/hw:plan:xxx` 返回明确错误
- [ ] 旧的自然语言入口不受影响
