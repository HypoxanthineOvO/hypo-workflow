# M2: Rich UI

## 需求
用 Rich 库美化 CLI 输出：
- list 命令用 Rich Table 展示
- 已完成的 TODO 用删除线 + 绿色显示
- add / done / delete 操作后显示成功提示

## 预期测试
- test_list_table_format: 输出包含表格边框字符
- test_done_item_styling: 已完成项有特殊标记
- test_add_success_message: 添加后有确认消息

## 预期产出
- src/hypo_todo/display.py — Rich 渲染层
- cli.py 调用 display.py
- 原有 8 个测试不回退 + 3 个新测试通过
