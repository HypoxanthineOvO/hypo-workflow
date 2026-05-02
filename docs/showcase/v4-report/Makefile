# V4 Report Makefile — using Hypoxanthine-LaTeX build system
HYPO_PATH = ../../../vendor/Hypoxanthine-LaTeX
OUT_DIR   = build
TOOL      = latexmk
FLAGS     = -xelatex -synctex=1 -interaction=nonstopmode -file-line-error -outdir=$(OUT_DIR) -f

TEXINPUTS := theme//:$(HYPO_PATH)/sty//:
export TEXINPUTS

.PHONY: all report slides clean watch-report watch-slides help

all: report slides

report:
	@echo "📄 Building report..."
	@mkdir -p $(OUT_DIR)
	$(TOOL) $(FLAGS) report.tex
	@echo "✅ report.pdf → $(OUT_DIR)/report.pdf"

slides:
	@echo "📊 Building slides..."
	@mkdir -p $(OUT_DIR)
	$(TOOL) $(FLAGS) slides.tex
	@echo "✅ slides.pdf → $(OUT_DIR)/slides.pdf"

clean:
	@echo "🧹 Cleaning..."
	rm -rf $(OUT_DIR)

watch-report:
	@mkdir -p $(OUT_DIR)
	$(TOOL) $(FLAGS) -pvc report.tex

watch-slides:
	@mkdir -p $(OUT_DIR)
	$(TOOL) $(FLAGS) -pvc slides.tex

help:
	@echo "V4 Report Makefile"
	@echo "  make              - Build report + slides"
	@echo "  make report       - Build report only"
	@echo "  make slides       - Build slides only"
	@echo "  make clean        - Remove build directory"
	@echo "  make watch-report - Auto-recompile report on save"
	@echo "  make watch-slides - Auto-recompile slides on save"
