#!/usr/bin/env bash
# Render QC stills at given frames and tile them: [COMP=<composition>] tools/stills.sh <name> f1 f2 ...
cd "$(dirname "$0")/.." || exit 1
name=$1; shift
mkdir -p out/stills
npx remotion bundle src/index.ts --out-dir=out/bundle --log=error >/dev/null 2>&1 || echo BUNDLE_FAILED
for fr in "$@"; do npx remotion still out/bundle "${COMP:-NoMoneyAnymore}" "out/stills/${name}_$fr.png" --frame="$fr" --log=error >/dev/null 2>&1 || echo "FAILED frame $fr"; done
"/d/Content/02_NEURALINK/07_PROJECT/.venv/Scripts/python.exe" -I - "$name" "$@" <<'PY'
import sys
from PIL import Image, ImageDraw
name, frames = sys.argv[1], sys.argv[2:]
ims = []
for fr in frames:
    try: ims.append((fr, Image.open(f'out/stills/{name}_{fr}.png').convert('RGB').resize((432, 768))))
    except Exception: pass
cols = min(5, len(ims)); rows = (len(ims) + cols - 1) // cols
s = Image.new('RGB', (cols * 432, rows * 790), 'white'); d = ImageDraw.Draw(s)
for k, (fr, im) in enumerate(ims):
    x, y = (k % cols) * 432, (k // cols) * 790
    s.paste(im, (x, y + 22)); d.text((x + 4, y + 4), f'frame {fr}  t={int(fr)/30:.2f}s', fill='red')
s.save(f'out/stills/sheet_{name}.jpg', quality=86)
PY
