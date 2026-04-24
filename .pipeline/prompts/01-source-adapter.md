# Prompt 01: Source Adapter

## 需求

实现从 Notion 读取 Prompt 的 source adapter：

- 支持 database 和 page 两种来源
- 统一转成内部 prompt 结构
- 支持排序与标题提取

## 预期测试

- database 结果可解析成 prompt 列表
- page 子页面可解析成 prompt 列表
- 缺少共享页面时给出明确错误

## 预期产出

- source adapter helper scripts
- `adapters/source/notion.md`
- source tests
