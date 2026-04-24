# Prompt 02: Output Adapter

## 需求

实现将报告写回 Notion 的 output adapter：

- Markdown 结果转为 Notion blocks
- 支持创建或更新报告页面
- 支持 page parent 与 database parent

## 预期测试

- block 转换可验证
- upsert 逻辑可验证
- 缺少共享 parent 时优雅失败

## 预期产出

- output adapter helper scripts
- `adapters/output/notion.md`
- output tests
