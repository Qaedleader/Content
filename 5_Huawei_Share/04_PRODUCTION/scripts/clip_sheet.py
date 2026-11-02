"""Timestamped review sheet of a video:  python -I clip_sheet.py <video> <out.jpg> [fps=3] [start] [dur] [cols=6]"""
import sys, subprocess
import numpy as np
from PIL import Image, ImageDraw

FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
src, out = sys.argv[1], sys.argv[2]
fps = float(sys.argv[3]) if len(sys.argv) > 3 else 3
ss = float(sys.argv[4]) if len(sys.argv) > 4 else 0
dur = float(sys.argv[5]) if len(sys.argv) > 5 else 0
cols = int(sys.argv[6]) if len(sys.argv) > 6 else 6
TW = 320
cmd = [FF, '-v', 'error', '-ss', str(ss)] + (['-t', str(dur)] if dur else []) + ['-i', src, '-vf', f'fps={fps},scale={TW}:-2', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
probe = subprocess.run([FF, '-v', 'error', '-ss', str(ss), '-i', src, '-frames:v', '1', '-vf', f'scale={TW}:-2', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
th = len(probe) // (TW * 3)
raw = subprocess.run(cmd, capture_output=True).stdout
n = len(raw) // (TW * th * 3)
fr = np.frombuffer(raw[:n * TW * th * 3], np.uint8).reshape(n, th, TW, 3)
rows = (n + cols - 1) // cols
s = Image.new('RGB', (cols * TW, rows * th), (0, 0, 0)); d = ImageDraw.Draw(s)
for k in range(n):
    x, y = (k % cols) * TW, (k // cols) * th
    s.paste(Image.fromarray(fr[k]), (x, y))
    d.rectangle([x, y, x + 60, y + 14], fill=(0, 0, 0)); d.text((x + 3, y + 2), f'{ss + k / fps:.2f}', fill=(255, 255, 0))
s.save(out, quality=85)
print(out, n, 'frames')
