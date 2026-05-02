# Architecture — C2 Showcase Package

## Project Type

LaTeX showcase package — book-style technical report (Hypo-Note) and Beamer slide deck (Hypo-Slide) for the Hypo-Workflow C2 milestone presentation.

## Source Root

`docs/showcase/c2-report/`

All source files, planning docs, assets, and build configuration live here. The parent Hypo-Workflow repository provides the shared LaTeX template submodule (`vendor/Hypoxanthine-LaTeX`) and the `.pipeline/` runtime for the main project.

## Directory Layout

```
c2-report/
├── .pipeline/                  # Pipeline runtime (this directory)
│   ├── config.yaml             # Project-specific pipeline config
│   ├── architecture.md         # This file
│   ├── rules.yaml              # Rule configuration
│   ├── state.yaml              # Pipeline state
│   ├── prompts/                # Step prompts
│   ├── reports/                # Step reports
│   ├── rules/custom/           # Custom rules
│   └── archives/               # Cycle archives
├── report.tex                  # Book-style technical report (Hypo-Note, ~657 lines)
├── slides.tex                  # Beamer slide deck (Hypo-Slide, ~638 lines)
├── report-outline.md           # Report structure outline
├── demo-script.md              # Live demo route and talking points
├── asset-plan.md               # Visual asset planning (diagrams + GPT images)
├── evidence-inventory.md       # Evidence source mapping (C1/C2 artifacts)
├── README.md                   # Project README
├── Makefile                    # Build targets: report, slides, clean
├── assets/                     # Visual assets
│   ├── cover-hero.png
│   ├── opencode-observability.png
│   ├── tool-evolution.png
│   └── gpt-image/              # GPT Image 2 generated illustrations
│       ├── cover-harness-engineering.png
│       ├── file-first-architecture.png
│       └── tool-evolution-diary.png
├── figures/                    # TikZ/Graphviz technical diagrams
│   ├── execution-loop.tex
│   ├── hierarchy.tex
│   ├── opencode-adapter.tex
│   ├── pipeline-protocol.tex
│   ├── progressive-discover.tex
│   ├── test-profile-matrix.tex
│   ├── v9-timeline.dot
│   └── v9-timeline.pdf
├── theme/                      # Local Beamer theme
│   └── hypo-slide-theme-workflow.sty
└── build/                      # LaTeX build products (PDFs, aux, logs)
```

## Key Artifacts

| Artifact | Type | Description |
|---|---|---|
| `report.tex` | LaTeX source | 10-chapter book-style report using Hypo-Note class |
| `slides.tex` | LaTeX source | Beamer deck using Hypo-Slide class with workflow theme |
| `figures/*.tex` | TikZ diagrams | 6 deterministic technical diagrams |
| `figures/v9-timeline.dot` | Graphviz | V9 development timeline |
| `assets/gpt-image/*.png` | Generated images | 3 GPT Image 2 narrative illustrations |
| `Makefile` | Build config | `make report`, `make slides`, `make clean` |

## Build System

- **Engine**: `latexmk` with `xelatex`
- **Template dependency**: `vendor/Hypoxanthine-LaTeX` (git submodule)
- **TEXINPUTS**: `theme//` + `../../../vendor/Hypoxanthine-LaTeX/sty//`
- **Output**: `build/report.pdf`, `build/slides.pdf`

## Dependencies

- LaTeX distribution with `xelatex` and `latexmk`
- Git submodule `vendor/Hypoxanthine-LaTeX` providing `Hypo-Note.cls` and `Hypo-Slide.cls`
- GPT Image 2 / Image Gen for narrative illustration refresh (optional)

## Evidence Sources

The report references artifacts from the parent Hypo-Workflow project:
- C1 archive: `.pipeline/archives/C1-v9-opencode-native-adapter/`
- C2 reports: `.pipeline/reports/12-18` (chat mode, progressive discover, test profiles)
- Core modules: `core/src/chat/`, `core/src/progressive-discover/`, `core/src/test-profile/`
- Specs: `references/progressive-discover-spec.md`, `references/test-profile-spec.md`

## Constraints

- All LaTeX source files must compile with `xelatex` via `latexmk`
- Figures in `figures/` use TikZ/Graphviz — no raster dependencies for technical diagrams
- GPT Image 2 assets in `assets/gpt-image/` are narrative illustrations only
- The submodule files are read-only from this repository's perspective
