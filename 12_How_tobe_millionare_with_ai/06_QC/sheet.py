"""Contact sheet of frames a..b every `step` of a video, labelled with absolute frame number. Usage: sheet.py video out.jpg a b step [cols] [w]"""
import subprocess, sys
import numpy as np
from PIL import Image, ImageDraw
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
src, out, a, b, step = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
cols = int(sys.argv[6]) if len(sys.argv) > 6 else 8; tw = int(sys.argv[7]) if len(sys.argv) > 7 else 250; th = tw * 16 // 9
sel = f"select='between(n\,{a}\,{b})*not(mod(n-{a}\,{step}))',scale={tw}:{th}"
raw = subprocess.run([FF, '-nostdin', '-v', 'error', '-i', src, '-vf', sel, '-vsync', 'vfr', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
n = len(raw) // (tw * th * 3); fr = np.frombuffer(raw[:n * tw * th * 3], np.uint8).reshape(n, th, tw, 3)
rows = (n + cols - 1) // cols
sh = Image.new('RGB', (cols * tw, rows * th), 'black'); d = ImageDraw.Draw(sh)
for k in range(n):
    x, y = (k % cols) * tw, (k // cols) * th
    sh.paste(Image.fromarray(fr[k]), (x, y)); d.rectangle([x, y, x + 40, y + 13], fill='black'); d.text((x + 2, y + 1), str(a + k * step), fill='yellow')
sh.save(out, quality=85); print(out, n)
