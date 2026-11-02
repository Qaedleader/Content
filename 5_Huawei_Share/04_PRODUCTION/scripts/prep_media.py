"""Extract the used segments of the official Huawei product films into 30 fps frame sequences.

Every clip is cut from the original download in 03_MEDIA/raw (never modified). Sources are 25 fps;
fps=30 repeats one frame in five (no interpolation, no speed change). Crops keep both the hand and the
screen and leave out faces; they are documented in 03_MEDIA/ASSET_SOURCES.md.
Run with the Neuralink venv python:  python -I prep_media.py [keys...]
"""
import os, subprocess, json, glob
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(os.path.dirname(HERE))                     # 5_Huawei_Share
RAW = os.path.join(PROJ, '03_MEDIA', 'raw')
OUT = os.path.join(PROJ, '03_MEDIA', 'frames')
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'

PURA = 'huawei_pura80-ultra_video_system_system-feature-2-1.mp4'   # 1920x978
M70 = 'huawei_mate70_video_ai_ai-feature-2.mp4'                     # 2688x1400
M80 = 'huawei_mate80_video_system_system-feature-3-2.mp4'           # 1284x960

# key: (source file, start s, duration s, crop (x, y, w, h) in source pixels); all crops 4:3, scaled to 1160x870
CLIPS = {
    'pura_grab':    (PURA, 0.00, 2.70, (330, 0, 1304, 978)),     # open hand over phone -> fist -> PDF card lifts
    'pura_release': (PURA, 4.80, 2.90, (420, 0, 1304, 978)),     # open hand over the second phone -> receive ring
    'm70_grab':     (M70, 1.70, 1.56, (822, 0, 1866, 1400)),     # fist closes on the dinosaur picture
    'm70_receive':  (M70, 3.36, 2.64, (0, 0, 1866, 1400)),       # fist opens above the tablet -> picture arrives
    'm80_grab':     (M80, 1.30, 2.00, None),                     # fist closes in front of the phone
    'm80_release':  (M80, 3.70, 2.96, None),                     # hand opens over the second phone -> page arrives
}
STILLS = {   # key: (source, time, crop) single frames used as screen content in the explanation scenes
    'dino_card': (M70, 2.90, (978, 188, 684, 884)),
}


def extract(key, src, ss, dur, crop):
    d = os.path.join(OUT, key)
    os.makedirs(d, exist_ok=True)
    for f in glob.glob(os.path.join(d, '*')):
        os.remove(f)
    vf = []
    if crop:
        x, y, w, h = crop
        vf.append(f'crop={w}:{h}:{x}:{y}')
    vf += ['scale=1160:870:flags=lanczos', 'fps=30']
    cmd = [FF, '-v', 'error', '-y', '-ss', str(ss), '-t', str(dur), '-i', os.path.join(RAW, src),
           '-vf', ','.join(vf), '-q:v', '2', os.path.join(d, '%04d.jpg')]
    subprocess.run(cmd, check=True)
    files = sorted(glob.glob(os.path.join(d, '*')))
    return {'frames': len(files), 'size': Image.open(files[0]).size, 'src': src, 'ss': ss, 'dur': dur, 'crop': crop}


def still(key, src, ss, crop):
    x, y, w, h = crop
    out = os.path.join(OUT, key + '.png')
    subprocess.run([FF, '-v', 'error', '-y', '-ss', str(ss), '-i', os.path.join(RAW, src), '-frames:v', '1',
                    '-vf', f'crop={w}:{h}:{x}:{y}', out], check=True)
    return {'src': src, 'ss': ss, 'crop': crop}


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
    for k, v in STILLS.items():
        if only and k not in only: continue
        info[k] = still(k, *v); print(k)
    json.dump(info, open(idx, 'w'), indent=1)
