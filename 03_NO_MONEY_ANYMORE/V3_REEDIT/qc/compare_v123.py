"""V1 / V2 / V3 comparison sheets (same frame numbers, one row per version)."""
import subprocess, io
from PIL import Image, ImageDraw, ImageFont
V = [('V1', '05_OUTPUT/NO_MONEY_ANYMORE_FINAL.mp4'), ('V2', 'V2_REEDIT/FINAL_V2_REEDIT.mp4'), ('V3', 'V3_REEDIT/FINAL_V3_REEDIT.mp4')]
SETS = {
 '01_opening_A_B': ('Shots 01–02 · 0.00–4.37 s · «اصرف مصاريك… ليش»', [0, 10, 40, 60, 78, 100, 125]),
 '02_world_99_9': ('Shot 03 · 4.40–9.17 s · «تخيّل… 99.9% من كل إشي»', [140, 160, 190, 220, 245, 265]),
 '03_car_map': ('Shot 04 · 9.20–19.27 s · car production chain', [285, 330, 370, 410, 440, 475, 530, 575]),
 '04_robots_energy': ('Shots 05–06 · 19.30–27.53 s · robots make robots · energy', [590, 640, 700, 730, 770, 815]),
 '05_chain_industries': ('Shots 07–08 · 27.57–36.03 s · ground→home · food/houses/clothes/medicine', [840, 900, 975, 1015, 1032, 1050, 1070]),
 '06_costs_kept_finale': ('Shot 09 · 36.07 s · shots 10–11 KEPT · shot 12 finale', [1100, 1150, 1195, 1300, 1550, 1640, 1700, 1784]),
}
def frame(p, n):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vf', f"select=eq(n\,{n}),scale=240:427", '-vsync', '0', '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True, check=True).stdout
    return Image.open(io.BytesIO(out)).convert('RGB')
try: font = ImageFont.truetype('arial.ttf', 18); big = ImageFont.truetype('arialbd.ttf', 24)
except Exception: font = big = ImageFont.load_default()
for name, (title, frames) in SETS.items():
    W = 80 + len(frames) * 248; H = 56 + 3 * (427 + 30)
    s = Image.new('RGB', (W, H), (250, 248, 242)); d = ImageDraw.Draw(s); d.text((12, 14), title, fill=(30, 30, 30), font=big)
    for r, (lab, p) in enumerate(V):
        y = 56 + r * (427 + 30)
        d.text((16, y + 200), lab, fill=(198, 90, 62) if lab == 'V3' else (60, 60, 60), font=big)
        for k, n in enumerate(frames):
            x = 80 + k * 248; s.paste(frame(p, n), (x, y + 24)); d.text((x, y + 2), f'f{n}  {n/30:.2f}s', fill=(40, 40, 40), font=font)
    s.save(f'V3_REEDIT/comparison/{name}.jpg', quality=86); print(name)
