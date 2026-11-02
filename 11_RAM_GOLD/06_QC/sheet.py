"""Contact sheet: every `step`-th frame of a video, labelled with the absolute frame number. Usage: sheet.py video out.jpg step offset [cols] [w]"""
import subprocess, sys
import numpy as np
from PIL import Image, ImageDraw
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
src, out, step, off = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
cols = int(sys.argv[5]) if len(sys.argv) > 5 else 10; tw = int(sys.argv[6]) if len(sys.argv) > 6 else 216; th = tw * 16 // 9
raw = subprocess.run([FF, '-nostdin', '-v', 'error', '-i', src, '-vf', f"select='not(mod(n\,{step}))',scale={tw}:{th}", '-vsync', 'vfr', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
n = len(raw) // (tw * th * 3); fr = np.frombuffer(raw[:n * tw * th * 3], np.uint8).reshape(n, th, tw, 3)
rows = (n + cols - 1) // cols
sh = Image.new('RGB', (cols * tw, rows * th), 'black'); d = ImageDraw.Draw(sh)
for k in range(n):
    x, y = (k % cols) * tw, (k // cols) * th
    sh.paste(Image.fromarray(fr[k]), (x, y)); d.rectangle([x, y, x + 46, y + 14], fill='black'); d.text((x + 2, y + 1), str(off + k * step), fill='yellow')
sh.save(out, quality=85); print(out, n)
