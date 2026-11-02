#!/usr/bin/env bash
# Renders the anatomy shots sequentially (one Blender process at a time — 8 GB RAM machine).
# Usage: bash render_all.sh [scale%] [shots...]
cd "$(dirname "$0")"
B=../../07_PROJECT/tools/blender/blender-4.2.23-windows-x64/blender.exe
SCALE=${1:-80}; shift; SHOTS=${@:-A B D}
for s in $SHOTS; do
  "$B" -b anatomy.blend -P shots.py -- $s "$(cygpath -w "$PWD/../renders/$s")" 0 0 $SCALE 2>&1 | grep -E 'FRAME|rror' || true
done
