# M20 / F009 — Book Report Expansion, GPT-Image Slides Refresh, and Showcase Packaging

- **Cycle**: C2
- **Feature**: F009
- **Prompt**: `.pipeline/prompts/19-book-report-slides-imagegen-and-showcase-packaging.md`
- **Status**: pass
- **Completed**: 2026-05-01T23:09:02+08:00

## Summary

M20 was recovered from a false completion state and finished against the actual
workspace. The canonical showcase sources now live under
`docs/showcase/c2-report/`, with the report/slides source, copied figure/theme
assets, build instructions, generated GPT Image / Image Gen assets, and a root
`vendor/Hypoxanthine-LaTeX` submodule declaration.

The report was expanded from a short technical draft into a 30-page book-style
technical report. The new narrative spine covers Hypo-LaTeX, Copilot repeated
prompt feeding, Copilot being banned across three accounts, Bill, Agent,
Superpowers as an early Harness form, and the Research/Info Notion AI + Codex
prompt-courier phase. The technical middle now explains features by the problem
each one solves instead of listing C2 modules mechanically.

The slide deck was refreshed to 37 pages with a clearer talk structure, a visual
and evidence-system frame, a real-project case frame, generated cover/background
assets, and a generated architecture visual used alongside deterministic TikZ
diagrams.

## Delivered Files

- `docs/showcase/c2-report/report.tex`
- `docs/showcase/c2-report/slides.tex`
- `docs/showcase/c2-report/README.md`
- `docs/showcase/c2-report/Makefile`
- `docs/showcase/c2-report/asset-plan.md`
- `docs/showcase/c2-report/assets/gpt-image/cover-harness-engineering.png`
- `docs/showcase/c2-report/assets/gpt-image/tool-evolution-diary.png`
- `docs/showcase/c2-report/assets/gpt-image/file-first-architecture.png`
- `docs/showcase/c2-report/build/report.pdf` (ignored build output, 30 pages)
- `docs/showcase/c2-report/build/slides.pdf` (ignored build output, 37 pages)
- `.gitmodules`
- `vendor/Hypoxanthine-LaTeX` submodule working tree
- `.gitignore` LaTeX/showcase build ignores
- `core/test/showcase-report-refresh.test.js`

## Image Generation

The user-provided `https://aimoniker.top` endpoint was tested with temporary
per-process credentials only. It responded, but image generation returned
`PermissionDenied: request was blocked`, and model listing returned 403. No API
key was written into the repository.

The final three images were generated through the built-in Image Gen path and
copied into the workspace under `docs/showcase/c2-report/assets/gpt-image/`.

## Validation

- `node --test core/test/showcase-report-refresh.test.js` -> 3/3 pass.
- `node --test core/test/*.test.js` -> 73/73 pass.
- `git diff --check` -> pass.
- `make report` from `docs/showcase/c2-report` -> pass, `build/report.pdf`, 30 pages.
- `make slides` from `docs/showcase/c2-report` -> pass, `build/slides.pdf`, 37 pages.

## Evaluation

| Dimension          | Score |
| ------------------ | :---: |
| diff_score         |   2   |
| code_quality       |   4   |
| test_coverage      |   4   |
| complexity         |   2   |
| architecture_drift |   1   |
| **overall**        | **1** |

Decision: **PASS**.

## Notes

- LaTeX still reports ordinary overfull/underfull hbox warnings in dense tables and
  footline boxes, but report/slides compile successfully and the earlier figure
  height overflow was fixed by constraining generated/TikZ figure frames.
- Git branch deletion/history cleanup was intentionally not performed; this
  milestone only prepares the local repository structure, ignore rules, and
  submodule dependency.
