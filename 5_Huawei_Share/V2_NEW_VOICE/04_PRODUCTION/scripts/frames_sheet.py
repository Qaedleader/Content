"""Index sheet of extracted frame sequences: python -I frames_sheet.py <out.jpg> <key> [step=6]"""
import sys, os, glob
from PIL import Image, ImageDraw
FR = r'D:/Content/5_Huawei_Share/03_MEDIA/frames'
out, key = sys.argv[1], sys.argv[2]; step = int(sys.argv[3]) if len(sys.argv) > 3 else 6
files = sorted(glob.glob(os.path.join(FR, key, '*.jpg')))[::step]
TW, TH, cols = 290, 218, 6
rows = (len(files) + cols - 1) // cols
s = Image.new('RGB', (cols * TW, rows * TH)); d = ImageDraw.Draw(s)
for k, f in enumerate(files):
    x, y = (k % cols) * TW, (k // cols) * TH
    s.paste(Image.open(f).resize((TW, TH)), (x, y))
    # grid every 25% for locating hands
    for g in (1, 2, 3):
        d.line([x + TW * g / 4, y, x + TW * g / 4, y + TH], fill=(255, 0, 255)); d.line([x, y + TH * g / 4, x + TW, y + TH * g / 4], fill=(255, 0, 255))
    d.rectangle([x, y, x + 70, y + 14], fill=(0, 0, 0)); d.text((x + 3, y + 2), f'{key[:4]} {k*step}', fill=(255, 255, 0))
s.save(out, quality=85); print(out, len(files))
