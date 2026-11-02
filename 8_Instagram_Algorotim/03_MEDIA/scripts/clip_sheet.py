"""Contact sheet of downloaded clips: 8 frames per clip at evenly spaced times (labelled). Usage: python -I clip_sheet.py out.jpg file1 file2 ..."""
import sys, os, re, subprocess, io
from PIL import Image, ImageDraw
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
out, files = sys.argv[1], sys.argv[2:]
N, tw, th = 8, 270, 152
sheet = Image.new('RGB', (N * tw, len(files) * (th + 18)), 'white'); dr = ImageDraw.Draw(sheet)
for row, f in enumerate(files):
    info = subprocess.run([FF, '-hide_banner', '-i', f], capture_output=True, text=True, errors='ignore').stderr
    h, m, s = re.search(r'Duration: (\d+):(\d+):([\d.]+)', info).groups(); dur = int(h) * 3600 + int(m) * 60 + float(s)
    y = row * (th + 18)
    dr.text((3, y + 2), f'{os.path.basename(f)[:70]}  {dur:.1f}s', fill='red')
    for k in range(N):
        t = dur * (k + 0.5) / N
        png = subprocess.run([FF, '-nostdin', '-v', 'error', '-ss', f'{t:.2f}', '-i', f, '-frames:v', '1', '-vf', f'scale={tw}:-2', '-f', 'image2pipe', '-c:v', 'png', '-'], capture_output=True).stdout
        try:
            im = Image.open(io.BytesIO(png)).convert('RGB'); im.thumbnail((tw - 2, th)); sheet.paste(im, (k * tw + 1, y + 16))
        except Exception: pass
        dr.text((k * tw + 4, y + 18), f'{t:.1f}', fill='yellow')
sheet.save(out, quality=78); print(out)
