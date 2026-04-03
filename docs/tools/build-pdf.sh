#!/bin/bash
# Generic PDF builder for any doc directory
# Usage: ./build-pdf.sh <input-dir> <output-name> [title]
#
# Example:
#   ./build-pdf.sh ../proposals/mopt-micitt-2026/propuesta-1-mDL propuesta-mDL "Propuesta de Arquitectura de Referencia"

set -e

TOOLS_DIR="$(cd "$(dirname "$0")" && pwd)"
INPUT_DIR="${1:?Usage: build-pdf.sh <input-dir> <output-name> [title]}"
OUTPUT_NAME="${2:?Usage: build-pdf.sh <input-dir> <output-name> [title]}"
TITLE="${3:-Attestto Open — Documento Técnico}"

# Resolve input dir
INPUT_DIR="$(cd "$INPUT_DIR" && pwd)"
OUT="$INPUT_DIR/output"
mkdir -p "$OUT"

# Concatenate .md files — use ORDER file if present, otherwise alphabetical
if [ -f "$INPUT_DIR/ORDER" ]; then
  > "$OUT/combined.md"
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    [[ "$file" =~ ^# ]] && continue
    cat "$INPUT_DIR/$file" >> "$OUT/combined.md"
  done < "$INPUT_DIR/ORDER"
else
  cat "$INPUT_DIR"/*.md > "$OUT/combined.md"
fi

# Generate standalone HTML with embedded CSS
pandoc "$OUT/combined.md" \
  --from=markdown \
  --to=html5 \
  --standalone \
  --metadata title="$TITLE" \
  --css="$TOOLS_DIR/pdf-style.css" \
  --embed-resources \
  --output="$OUT/$OUTPUT_NAME.html"

echo "HTML generated: $OUT/$OUTPUT_NAME.html"

# Generate PDF via puppeteer
HEADER="$TITLE" OUTPUT_HTML="$OUT/$OUTPUT_NAME.html" OUTPUT_PDF="$OUT/$OUTPUT_NAME.pdf" \
  node "$TOOLS_DIR/html-to-pdf.mjs"
