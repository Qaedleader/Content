"""Contact sheet of preview stills: python -I sheet.py <out.jpg> <frame> ..."""
import sys, os
from PIL import Image, ImageDraw
D = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '05_PREVIEW', 'stills')
out, fs = sys.argv[1], [int(x) for x in sys.argv[2:]]
TW, TH, cols = 360, 640, 6
rows = (len(fs) + cols - 1) // cols
s = Image.new('RGB', (cols * TW, rows * TH)); d = ImageDraw.Draw(s)
for k, f in enumerate(fs):
    x, y = (k % cols) * TW, (k // cols) * TH
    s.paste(Image.open(os.path.join(D, f'f{f:04d}.jpg')).resize((TW, TH)), (x, y))
    d.rectangle([x, y, x + 90, y + 16], fill=(0, 0, 0)); d.text((x + 3, y + 2), f'{f} {f/30:.2f}s', fill=(255, 255, 0))
s.save(out, quality=88); print(out)
