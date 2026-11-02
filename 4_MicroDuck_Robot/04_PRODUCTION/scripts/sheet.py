"""Tile rendered stills into a labelled review sheet: python -I sheet.py out.jpg f1 f2 ..."""
import sys, os
from PIL import Image, ImageDraw
P = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '05_PREVIEW', 'stills')
out, fr = sys.argv[1], [int(x) for x in sys.argv[2:]]
cols = min(5, len(fr)); rows = (len(fr) + cols - 1) // cols; w, h = 432, 768
s = Image.new('RGB', (cols * w, rows * h), (0, 0, 0)); d = ImageDraw.Draw(s)
for k, f in enumerate(fr):
    im = Image.open(os.path.join(P, f'f{f:04d}.jpg')).resize((w, h), Image.LANCZOS)
    x, y = (k % cols) * w, (k // cols) * h; s.paste(im, (x, y))
    d.rectangle([x, y, x + 120, y + 22], fill=(0, 0, 0)); d.text((x + 4, y + 4), f'f{f} t={f/30-0.048:.2f}', fill=(255, 255, 0))
s.save(out, quality=90)
