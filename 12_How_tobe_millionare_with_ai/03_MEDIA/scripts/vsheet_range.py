import subprocess, sys, io
from PIL import Image, ImageDraw
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
src, out, a, b, step = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
ts = []; t = a
while t < b: ts.append(t); t += step
tw, th = 256, 144; cols = 10
sheet = Image.new('RGB', (cols * tw, ((len(ts) + cols - 1) // cols) * (th + 16)), 'white'); dr = ImageDraw.Draw(sheet)
for k, t in enumerate(ts):
    r = subprocess.run([FF, '-nostdin', '-v', 'error', '-ss', str(t), '-i', src, '-frames:v', '1', '-vf', f'scale={tw}:{th}', '-f', 'image2pipe', '-c:v', 'png', '-'], capture_output=True)
    x, y = (k % cols) * tw, (k // cols) * (th + 16)
    try: sheet.paste(Image.open(io.BytesIO(r.stdout)), (x, y + 16))
    except Exception: pass
    dr.text((x + 2, y + 2), f'{t:.1f}s', fill='red')
sheet.save(out, quality=80); print(out)
