# Legacy Milestone 报告：{milestone_name}

> 语言：{output_language} | 时区：{output_timezone}

## 概要

- Milestone：{milestone_name}
- 时间跨度：{started_at} -> {finished_at}
- Commit 数：{commit_count}
- 变更文件数：{changed_files_count}
- 行数变化：+{added_lines} / -{removed_lines}
- 导入方法：{import_method}

## 主要改动

{main_changes}

请根据 commit message 和 diff stat 总结 3-5 条简洁要点。

## Commit 列表

| Hash | 时间 | Message |
|------|------|---------|
| {commit_hash} | {commit_time} | {commit_message} |

如果一个 Milestone 超过 50 个 commit，只列出 first-parent 顺序下的前 50 个，然后补充：

`... 以及另外 {remaining_commit_count} 个 commit`

## 变更文件

| 文件 | 新增行 | 删除行 |
|------|--------|--------|
| {file_path} | {file_added_lines} | {file_deleted_lines} |

只列出总变更行数最高的前 15 个文件。
