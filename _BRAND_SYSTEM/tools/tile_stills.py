"""Tile out/stills/<name>_<frame>.png into out/stills/sheet_<name>.jpg. Usage: python -I tools/tile_stills.py <name> f1 f2 ..."""
import sys
from PIL import Image, ImageDraw
name, frames = sys.argv[1], sys.argv[2:]
ims = []
for fr in frames:
    try: ims.append((fr, Image.open(f'out/stills/{name}_{fr}.png').convert('RGB').resize((360, 640))))
    except Exception: pass
cols = min(6, len(ims)); rows = (len(ims) + cols - 1) // cols
s = Image.new('RGB', (cols * 360, rows * 660), 'white'); d = ImageDraw.Draw(s)
for k, (fr, im) in enumerate(ims):
    x, y = (k % cols) * 360, (k // cols) * 660
    s.paste(im, (x, y + 20)); d.text((x + 4, y + 4), f'frame {fr}  t={int(fr)/30:.2f}s', fill='red')
s.save(f'out/stills/sheet_{name}.jpg', quality=86)
