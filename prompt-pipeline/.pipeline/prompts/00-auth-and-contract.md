# Prompt 00: Auth and Contract

## 需求

建立 V2 Notion Adapter 的配置和契约基础：

- 扩展 config schema 支持 Notion
- 增加 adapter 设计文档骨架
- 明确 token 读取策略与 graceful degradation

## 预期测试

- config schema 接受 `pipeline.source/output: notion`
- notion 配置段可校验
- auth smoke 能识别有效 token

## 预期产出

- `config.schema.yaml`
- `adapters/source/notion.md`
- `adapters/output/notion.md`
