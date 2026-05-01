TEXINPUTS := theme//:../../../vendor/Hypoxanthine-LaTeX/sty//:
LATEXMK := TEXINPUTS="$(TEXINPUTS):" latexmk -xelatex -interaction=nonstopmode -halt-on-error

.PHONY: all report slides clean

all: report slides

report:
	$(LATEXMK) -outdir=build report.tex

slides:
	$(LATEXMK) -outdir=build slides.tex

clean:
	latexmk -C -outdir=build report.tex
	latexmk -C -outdir=build slides.tex
