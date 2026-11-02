import sys, os, glob
from PIL import Image, ImageDraw
Image.MAX_IMAGE_PIXELS = None
root, out = sys.argv[1], sys.argv[2]
fs = sorted(f for f in glob.glob(os.path.join(root, '**', '*'), recursive=True) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')) and '_frames' not in f)
tw, th = 300, 220
cols = 6; rows = (len(fs) + cols - 1) // cols
s = Image.new('RGB', (cols * tw, rows * (th + 30)), 'white'); d = ImageDraw.Draw(s)
for k, f in enumerate(fs):
    try:
        im = Image.open(f); size = im.size; im = im.convert('RGB'); im.thumbnail((tw, th))
    except Exception as e:
        continue
    x, y = (k % cols) * tw, (k // cols) * (th + 30)
    s.paste(im, (x, y)); d.text((x + 2, y + th + 2), f'{k} {os.path.basename(f)[:34]}', fill='black'); d.text((x + 2, y + th + 14), f'{size[0]}x{size[1]}', fill='red')
s.save(out, quality=85); print(len(fs))
