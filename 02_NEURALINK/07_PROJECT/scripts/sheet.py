"""Tile JPG stills into a review sheet. Usage: sheet.py <dir> <out.jpg> [cols] [thumb_w]"""
import sys, os, glob
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 5; tw = int(sys.argv[4]) if len(sys.argv) > 4 else 360
fs = sorted(glob.glob(os.path.join(d, '*.jpg'))); th = int(tw * 16 / 9)
s = Image.new('RGB', (cols * tw, ((len(fs) + cols - 1) // cols) * (th + 20)), (40, 40, 40)); dr = ImageDraw.Draw(s)
for i, f in enumerate(fs):
    im = Image.open(f).resize((tw, th)); x, y = (i % cols) * tw, (i // cols) * (th + 20)
    s.paste(im, (x, y + 20)); dr.text((x + 4, y + 4), f'{os.path.basename(f)}  t={int(os.path.basename(f)[2:7]) / 30:.2f}', fill=(255, 255, 0))
s.save(out, quality=88)
