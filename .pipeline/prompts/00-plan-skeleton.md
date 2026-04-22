# Prompt 00: Plan Skeleton

## 需求

实现 V5 的 Plan Mode 骨架：

- 创建 `plan/PLAN-SKILL.md`
- 在主 `SKILL.md` 中注册 `/hw:plan`、`/hw:plan:*`、`/hw:review`
- 更新 `references/commands-spec.md`
- 明确未知 planning command 的错误返回

## 预期测试

- `/hw:plan` 触发时能加载 `plan/PLAN-SKILL.md`
- `/hw:plan:discover`、`/hw:plan:decompose`、`/hw:plan:generate`、`/hw:plan:confirm` 已注册
- `/hw:review` 已注册
- 未知 `/hw:plan:*` 返回明确错误提示

## 预期产出

- `plan/PLAN-SKILL.md`
- `SKILL.md`
- `references/commands-spec.md`
