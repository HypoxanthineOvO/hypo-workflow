# M09 / F004 — Analysis Report and Evidence Templates

## 实施计划

1. 阅读现有 `templates/report.md`、`templates/zh/report.md`、`templates/en/report.md`、`templates/tdd/*` 和 plan prompt template。
2. 新增 analysis 专用模板目录或等价结构。
3. 添加 analysis step templates：
   - `step-define-question`
   - `step-gather-context`
   - `step-hypothesize`
   - `step-experiment`
   - `step-interpret`
   - `step-conclude`
4. 添加 analysis ledger template 和 report template。
5. Report 必须突出：
   - question
   - environment_snapshot
   - exploration chain
   - hypotheses and statuses
   - experiments and evidence refs
   - observations
   - metrics before/after/delta
   - ruled_out_alternatives
   - threats_to_validity
   - root cause or conclusion
   - confidence
   - next_actions
   - code_change_refs
6. 添加 zh/en fallback，保证输出语言规则可用。
7. 增加 template tests，避免 build report 被 analysis 字段污染。

## 依赖

- M06
- M07
- M08
- `templates/report.md`
- `templates/zh/report.md`
- `templates/en/report.md`
- `templates/tdd/`
- `plan/assets/prompt-template.md`

## 验证点

- analysis report 模板和 build report 模板分离。
- zh/en fallback 正常。
- ledger/report 模板包含 mandatory environment snapshot。
- 模板不使用 TDD-only step 字段。

## 约束

- 不删除 legacy/build templates。
- 不让 analysis report 退化成散文，没有证据链字段。

## 需求

- 新增 analysis step/report/ledger templates。
- 更新 template loading guidance。
- 增加 template coverage tests。

## 预期测试

- `node --test core/test/*.test.js`
- template existence/fallback tests。
- `git diff --check`

## 预期产出

- `templates/analysis/*`
- `templates/zh/analysis-*` 或等价结构
- `templates/en/analysis-*` 或等价结构
- tests/docs
