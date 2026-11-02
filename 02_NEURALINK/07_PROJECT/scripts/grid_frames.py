"""Frames with a 10% coordinate grid for framing decisions. Usage: grid_frames.py out.jpg key@t [key@t ...]"""
import sys, os, subprocess, io, json
from PIL import Image, ImageDraw, ImageOps
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); NL = os.path.dirname(ROOT)
SRC = json.load(open(os.path.join(ROOT, 'media_sources.json'), encoding='utf-8'))
FF = os.path.join(ROOT, '.venv', 'bin', 'ffmpeg.exe')
tiles = []
for spec in sys.argv[2:]:
    k, t = spec.split('@'); p = os.path.join(NL, SRC[k]['dest'])
    if p.endswith(('.jpg', '.jpeg', '.png')): im = Image.open(p).convert('RGB')
    else:
        b = subprocess.run([FF, '-v', 'error', '-ss', t, '-i', p, '-frames:v', '1', '-vf', 'scale=720:-2', '-f', 'image2pipe', '-c:v', 'mjpeg', '-'], capture_output=True).stdout
        im = Image.open(io.BytesIO(b)).convert('RGB')
    im = ImageOps.contain(im, (360, 480)); d = ImageDraw.Draw(im)
    for i in range(1, 10):
        x = im.width * i / 10; y = im.height * i / 10
        d.line([(x, 0), (x, im.height)], fill=(0, 255, 255) if i == 5 else (255, 255, 0), width=1)
        d.line([(0, y), (im.width, y)], fill=(0, 255, 255) if i == 5 else (255, 255, 0), width=1)
    d.text((3, 3), spec, fill=(255, 0, 255)); tiles.append(im)
W = 360 * 5; rows = (len(tiles) + 4) // 5
s = Image.new('RGB', (W, rows * 480), (30, 30, 30))
for i, im in enumerate(tiles): s.paste(im, ((i % 5) * 360, (i // 5) * 480))
s.save(sys.argv[1], quality=88)
