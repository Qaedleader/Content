"""Extract the used segments of the official Microduck media into 30 fps frame sequences.

Every clip is cut from the original download in 03_MEDIA/raw (never modified). Crops exclude
burned-in captions/stickers and bystanders; they are documented in 03_MEDIA/ASSET_SOURCES.md.
Run with the Neuralink venv python:  python -I prep_media.py
"""
import os, subprocess, json, glob
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(os.path.dirname(HERE))                     # 4_MicroDuck_Robot
RAW = os.path.join(PROJ, '03_MEDIA', 'raw')
OUT = os.path.join(PROJ, '03_MEDIA', 'frames')
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'

# key: (source file, start s, duration s, crop (x, y, w, h) in source pixels, alpha)
CLIPS = {
    # sim2real.mp4 is a side-by-side film: left half = simulation, right half = real robot.
    # Rows below y=790 hold the burned-in subtitle, so they are cropped away.
    'hook_sim':  ('blog_introducing-microduck_sim2real.mp4', 4.3, 5.1, (0, 0, 800, 790), False),
    'hook_real': ('blog_introducing-microduck_sim2real.mp4', 4.3, 5.1, (800, 0, 800, 790), False),
    'tr_sim':    ('blog_introducing-microduck_sim2real.mp4', 10.7, 4.6, (0, 0, 800, 790), False),
    'tr_real':   ('blog_introducing-microduck_sim2real.mp4', 10.7, 4.6, (800, 0, 800, 790), False),
    # skills (all real footage)
    'sk_walk':   ('gh_microduck_rl_hero_montage.mov', 0.9, 1.0, (600, 200, 640, 480), False),
    'sk_sit':    ('microduck_gallery_squad-standup.mp4', 10.85, 1.1, (60, 120, 720, 540), False),
    'sk_getup':  ('microduck_launch-film.mp4', 8.25, 1.8, (740, 380, 960, 720), False),
    'sk_skate':  ('gh_microduck_it_rolls.mp4', 16.9, 1.6, (940, 0, 960, 720), False),
    'sk_wheels': ('microduck_microduck-hero.mp4', 10.95, 0.9, (240, 0, 1440, 1080), False),
    # revision 2 (2026-10-24): real action clips for shots 1-2
    'r2_walk':   ('gh_microduck_rl_hero_montage.mov', 16.0, 5.2, (160, 0, 960, 720), False),
    'r2_skate':  ('gh_microduck_it_rolls.mp4', 15.3, 5.95, None, False),   # full frame; tracking crop done in episode.py
    # official transparent move clips (rendered) - used as labelled cut-outs
    'cut_walk':  ('microduck_moves-portrait-alpha_walk.webm', 0.0, 8.0, None, True),
}


def extract(key, src, ss, dur, crop, alpha):
    d = os.path.join(OUT, key)
    os.makedirs(d, exist_ok=True)
    for f in glob.glob(os.path.join(d, '*')):
        os.remove(f)
    vf = []
    if crop:
        x, y, w, h = crop
        vf.append(f'crop={w}:{h}:{x}:{y}')
    vf.append('fps=30')
    cmd = [FF, '-v', 'error', '-y']
    if alpha:
        cmd += ['-c:v', 'libvpx-vp9']
    cmd += ['-ss', str(ss), '-t', str(dur), '-i', os.path.join(RAW, src)]
    if alpha:
        cmd += ['-vf', ','.join(vf + ['format=rgba']), os.path.join(d, '%04d.png')]
    else:
        cmd += ['-vf', ','.join(vf), '-q:v', '2', os.path.join(d, '%04d.jpg')]
    subprocess.run(cmd, check=True)
    files = sorted(glob.glob(os.path.join(d, '*')))
    if alpha:   # crop all frames to the union bounding box of the opaque pixels
        box = None
        for f in files:
            b = Image.open(f).getbbox()
            if b:
                box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
        pad = 6
        box = (max(0, box[0] - pad), max(0, box[1] - pad), box[2] + pad, box[3] + pad)
        for f in files:
            Image.open(f).crop(box).save(f)
    size = Image.open(files[0]).size
    return {'frames': len(files), 'size': size, 'src': src, 'ss': ss, 'dur': dur, 'crop': crop}


if __name__ == '__main__':
    import sys
    os.makedirs(OUT, exist_ok=True)
    idx = os.path.join(OUT, 'frames_index.json')
    info = json.load(open(idx)) if os.path.exists(idx) else {}
    only = set(sys.argv[1:])
    for k, v in CLIPS.items():
        if only and k not in only: continue
        info[k] = extract(k, *v)
        print(k, info[k]['frames'], info[k]['size'])
    json.dump(info, open(os.path.join(OUT, 'frames_index.json'), 'w'), indent=1)
