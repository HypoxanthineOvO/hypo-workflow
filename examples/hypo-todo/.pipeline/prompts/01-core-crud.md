# M1: Core CRUD

## 需求
实现 add / list / done / delete 四个 CLI 命令
数据持久化到 SQLite (~/.hypo-todo/todos.db)

## 预期测试
- test_add_creates_todo
- test_list_empty
- test_list_shows_all
- test_done_marks_complete
- test_done_nonexistent_raises
- test_delete_removes
- test_delete_nonexistent_raises
- test_persistence_across_restart

## 预期产出
- src/hypo_todo/cli.py — 4 个命令
- src/hypo_todo/db.py — SQLite 操作层
- tests/test_crud.py — 8 个测试
- 所有测试通过
