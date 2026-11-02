"""Contact sheet of images (or first frame of videos) for visual review.
Usage: python contact_sheet.py <out.jpg> <file> [file ...]"""
import sys, os, subprocess, io
from PIL import Image, ImageDraw, ImageOps
Image.MAX_IMAGE_PIXELS = None
out, files = sys.argv[1], sys.argv[2:]
TW, TH, COLS = 300, 300, 5
rows = (len(files) + COLS - 1) // COLS
sheet = Image.new('RGB', (COLS * TW, rows * (TH + 34)), (20, 20, 24)); d = ImageDraw.Draw(sheet)
FF = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.venv', 'bin', 'ffmpeg.exe')
for i, f in enumerate(files):
    try:
        if f.lower().endswith(('.mp4', '.webm', '.ogv', '.mov')):
            b = subprocess.run([FF, '-v', 'error', '-ss', '1.5', '-i', f, '-frames:v', '1', '-vf', 'scale=600:-2', '-f', 'image2pipe', '-c:v', 'mjpeg', '-'], capture_output=True).stdout
            im = Image.open(io.BytesIO(b))
        else:
            im = Image.open(f); im.draft('RGB', (TW * 2, TH * 2))
        w0, h0 = im.size
        im = ImageOps.contain(im.convert('RGB'), (TW, TH))
        x, y = (i % COLS) * TW, (i // COLS) * (TH + 34)
        sheet.paste(im, (x + (TW - im.width) // 2, y + (TH - im.height) // 2))
        d.text((x + 4, y + TH + 2), os.path.basename(f)[:44], fill=(230, 230, 230))
        d.text((x + 4, y + TH + 16), f'{w0}x{h0}', fill=(150, 150, 160))
    except Exception as e:
        d.text(((i % COLS) * TW + 4, (i // COLS) * (TH + 34) + 10), 'ERR ' + str(e)[:40], fill=(255, 80, 80))
sheet.save(out, quality=85)
print(out, sheet.size)
