# Prompt 03: Mixed Mode and Integration

## 需求

完成混合模式、文档与 Notion 报告收尾：

- mixed mode 独立配置
- README 与 SKILL 文档更新
- 尝试写入 V2 Report 页面与更新 Hypo-Workflow 主页状态

## 预期测试

- `source: local + output: notion` 语义明确
- `source: notion + output: local` 语义明确
- 回归 `s01-s18` 全绿
- Notion API 不可写时记录错误但不中断

## 预期产出

- README / SKILL 更新
- integration tests
- 最终实现报告
