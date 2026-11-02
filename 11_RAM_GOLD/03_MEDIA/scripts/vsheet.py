"""Contact sheet of a video: one frame every `step` s, labelled with its timestamp. Usage: python vsheet.py video out.jpg [step]"""
import subprocess, sys, io, json
from PIL import Image, ImageDraw
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
src, out = sys.argv[1], sys.argv[2]; step = float(sys.argv[3]) if len(sys.argv) > 3 else 4
p = subprocess.run([FF, '-hide_banner', '-i', src], capture_output=True, text=True, encoding='utf-8', errors='ignore').stderr
d = p.split('Duration: ')[1].split(',')[0]; h, m, s = d.split(':'); dur = int(h) * 3600 + int(m) * 60 + float(s)
ts = [t * step for t in range(int(dur // step))]
tw, th = 256, 144; cols = 10
sheet = Image.new('RGB', (cols * tw, ((len(ts) + cols - 1) // cols) * (th + 16)), 'white'); dr = ImageDraw.Draw(sheet)
for k, t in enumerate(ts):
    r = subprocess.run([FF, '-nostdin', '-v', 'error', '-ss', str(t), '-i', src, '-frames:v', '1', '-vf', f'scale={tw}:{th}', '-f', 'image2pipe', '-c:v', 'png', '-'], capture_output=True)
    x, y = (k % cols) * tw, (k // cols) * (th + 16)
    try: sheet.paste(Image.open(io.BytesIO(r.stdout)), (x, y + 16))
    except Exception: pass
    dr.text((x + 2, y + 2), f'{t:.0f}s', fill='red')
sheet.save(out, quality=80); print(out, dur, len(ts))
