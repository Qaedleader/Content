import glob, os, subprocess, io
from PIL import Image, ImageDraw
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
M = r'D:/Content/_BRAND_SYSTEM/public/episodes/ramgold/media'
clips = sorted(glob.glob(M + '/v_*.mp4'))
tw, th = 320, 180
sheet = Image.new('RGB', (4 * tw, len(clips) * (th + 4)), 'white'); dr = ImageDraw.Draw(sheet)
for r, c in enumerate(clips):
    dur = float(subprocess.run([FF, '-i', c], capture_output=True, text=True).stderr.split('Duration: ')[1].split(',')[0].split(':')[-1])
    for k, t in enumerate([0.05, dur * 0.33, dur * 0.66, dur - 0.1]):
        o = subprocess.run([FF, '-nostdin', '-v', 'error', '-ss', str(t), '-i', c, '-frames:v', '1', '-vf', f'scale={tw}:{th}', '-f', 'image2pipe', '-c:v', 'png', '-'], capture_output=True).stdout
        sheet.paste(Image.open(io.BytesIO(o)), (k * tw, r * (th + 4)))
    dr.text((4, r * (th + 4) + 4), os.path.basename(c), fill='yellow')
sheet.save('review/clips_qc.jpg', quality=80)
g = Image.open(M + '/ram_hero_gold.png'); bg = Image.new('RGBA', g.size, (20, 30, 45, 255)); bg.alpha_composite(g); bg.convert('RGB').resize((1600, 389)).save('review/gold_test.jpg')
