# Hypo-Workflow C2 — Showcase Package

This directory is the canonical source root for the Cycle C2 book report, Beamer
slide deck, and GPT Image 2 / Image Gen visual assets. Runtime state, milestone
reports, and historical build artifacts still live under `.pipeline/`; the source
files that should be edited and reviewed live here.

## Layout

```
docs/showcase/c2-report/
├── report.tex                           # Book-style technical report
├── slides.tex                           # Beamer deck
├── assets/                              # Cover/background/generated visual assets
├── figures/                             # Strict technical diagrams and graph sources
├── theme/                               # Local Beamer theme glue
├── build/                               # LaTeX build products (ignored)
├── Makefile                             # Local report/slides build commands
└── README.md                            # This file
```

## Prerequisites

1. A working LaTeX distribution with `latexmk` and `xelatex`.
2. Git submodule initialized. The shared Book/Slide template dependency is the
   repository-root submodule `vendor/Hypoxanthine-LaTeX`:

   ```bash
   git submodule update --init --recursive
   ```

   Or when cloning fresh:

   ```bash
   git clone --recurse-submodules https://github.com/HypoxanthineOvO/Hypo-Workflow.git
   ```

   The submodule points at `git@github.com:HypoxanthineOvO/Hypoxanthine-LaTeX.git`.
   Treat files inside the submodule as read-only from this repository.

## Build — Report

```bash
cd docs/showcase/c2-report
make report
```

## Build — Slides

```bash
cd docs/showcase/c2-report
make slides
```

If the build fails with `Hypo-Note.cls` or `Hypo-Slide.cls` not found, initialize the
`vendor/Hypoxanthine-LaTeX` submodule and rerun `make`.

## Refresh GPT-Image-2 illustrations

The slide visual system is designed around GPT Image 2 / Image Gen assets. Generated
or refreshed images should be stored under `assets/gpt-image/` and referenced from
`slides.tex`. To regenerate one through the local GPT Image 2 wrapper:

```bash
gpt_image_cli generate \
  --model gpt-image-2 \
  --prompt "<prompt>" \
  --size 1536x1024 \
  --quality high \
  --out docs/showcase/c2-report/assets/gpt-image/<name>.png
```

Keep image prompts close to the slide frames they support, so cover images, section
backgrounds, narrative diagrams, and polished architecture diagrams can be refreshed
without reverse-engineering the deck.
