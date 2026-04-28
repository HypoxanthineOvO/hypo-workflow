#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q 'keyword_patterns' config.schema.yaml
rg -Fq "'feat\\(M(\\d+)\\):'" config.schema.yaml
rg -Fq "'M(\\d+)-'" config.schema.yaml
rg -Fq "'milestone-(\\d+)'" config.schema.yaml
rg -q 'Keyword: commit message matches configured `keyword_patterns`' skills/init/SKILL.md
rg -q 'Keyword milestones are named' skills/init/SKILL.md

echo "s32-import-history-keyword: PASS"
