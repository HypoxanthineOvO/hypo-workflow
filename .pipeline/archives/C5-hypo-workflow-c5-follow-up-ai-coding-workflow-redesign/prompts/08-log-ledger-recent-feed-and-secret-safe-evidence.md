# M08 - Log Ledger, Recent Feed, and Secret-Safe Evidence

## 需求

- Make `.pipeline/log.yaml` a complete lifecycle audit ledger with a schema that covers real event families.
- Make status/dashboard Recent Events a filtered user activity feed.
- Fix Recent ordering so readers sort by timestamp instead of relying on file order.
- Add a shared conservative secret-safe evidence pipeline across debug, audit, report, log, status, dashboard, and Knowledge surfaces.

## 设计输入

- D-20260503-12 log/recent decision.
- D-20260503-13 secret-safe evidence decision.
- Audit findings H-07, H-08, and H-09.

## 执行计划

1. Inventory actual log event types/statuses and readers.
2. Expand log schema for cycle, plan, feature, milestone, step, patch, acceptance, sync, recovery, handoff, derived refresh, and platform events.
3. Add a shared log writer and schema validator.
4. Update Recent readers to sort by timestamp and filter user-relevant lifecycle events.
5. Keep helper refreshes, hook heartbeats, and platform noise available through `/hw:log` or debug views but out of status first screen.
6. Implement shared deterministic redaction helper and scan/write gate.
7. Apply redaction to debug/audit/report/log/status/dashboard/Knowledge durable evidence paths.
8. Add fixtures for log ordering and secret redaction.

## 预期测试

- Current and fixture logs have no unknown type/status under the new schema.
- Newest-first and oldest-first logs produce the same correct Recent Events.
- Status/dashboard Recent excludes internal noise unless it affects user action.
- API keys, tokens, Authorization headers, passwords, cookies, and private keys are redacted or blocked.
- Reports cannot be marked successful if secret validation fails.

## 预期产出

- Updated log spec, log writer, validator, and readers.
- Secret-safe evidence helper and tests.
- Updated debug/audit/report/log/status skill contracts.
- OpenCode Recent reader fix.

## 约束

- Prefer false-positive redaction over leaks.
- Do not store raw secrets in reports, logs, status/dashboard, compact context, or Knowledge records.
- Do not hide complete audit history; filter only the user-facing Recent feed.
