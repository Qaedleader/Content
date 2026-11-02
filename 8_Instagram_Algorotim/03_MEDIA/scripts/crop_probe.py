"""Frames with 10 % x-grid to choose 9:16 crop centres. Usage: python -I crop_probe.py out.jpg file@t ..."""
import sys, io, subprocess
from PIL import Image, ImageDraw
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
out, items = sys.argv[1], sys.argv[2:]
tw, th, cols = 480, 270, 4
sheet = Image.new('RGB', (cols * tw, ((len(items) + cols - 1) // cols) * (th + 16)), 'white'); dr = ImageDraw.Draw(sheet)
for k, it in enumerate(items):
    f, t = it.rsplit('@', 1)
    png = subprocess.run([FF, '-nostdin', '-v', 'error', '-ss', t, '-i', f, '-frames:v', '1', '-vf', f'scale={tw}:{th}', '-f', 'image2pipe', '-c:v', 'png', '-'], capture_output=True).stdout
    x, y = (k % cols) * tw, (k // cols) * (th + 16)
    im = Image.open(io.BytesIO(png)).convert('RGB'); d = ImageDraw.Draw(im)
    for g in range(1, 10): d.line([(g * tw / 10, 0), (g * tw / 10, th)], fill=(255, 255, 0) if g != 5 else (255, 0, 0), width=1); d.text((g * tw / 10 + 2, 2), str(g), fill='yellow')
    sheet.paste(im, (x, y + 16)); dr.text((x + 2, y + 2), f'{k} {f.split("/")[-1][:48]} @{t}', fill='black')
sheet.save(out, quality=80)
