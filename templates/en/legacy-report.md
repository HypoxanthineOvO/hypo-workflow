# Legacy Milestone Report: {milestone_name}

> Language: {output_language} | Timezone: {output_timezone}

## Summary

- Milestone: {milestone_name}
- Time span: {started_at} -> {finished_at}
- Commits: {commit_count}
- Files changed: {changed_files_count}
- Lines changed: +{added_lines} / -{removed_lines}
- Import method: {import_method}

## Main Changes

{main_changes}

Summarize 3-5 concise bullets from commit messages and diff stats.

## Commit List

| Hash | Time | Message |
|------|------|---------|
| {commit_hash} | {commit_time} | {commit_message} |

If a milestone contains more than 50 commits, list the first 50 by first-parent order and then add:

`... and {remaining_commit_count} other commits`

## Changed Files

| File | Added Lines | Deleted Lines |
|------|-------------|---------------|
| {file_path} | {file_added_lines} | {file_deleted_lines} |

List only the top 15 files by total line churn.
