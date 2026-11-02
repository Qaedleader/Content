"""Extract the used segments of the official Claude Code demo (anthropics/claude-code README demo.gif) into
30 fps frame sequences. The GIF is 10 fps: fps=30 repeats each frame three times (no interpolation, no speed
change). Originals in 03_MEDIA/raw are never modified.  python -I prep_media.py [keys...]"""
import os, subprocess, json, glob
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(os.path.dirname(HERE))
RAW = os.path.join(PROJ, '03_MEDIA', 'raw')
OUT = os.path.join(PROJ, '03_MEDIA', 'frames')
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
GIF = 'claudecode_demo.gif'      # 1552x992; terminal window spans (44, 50)-(1504, 950)
CLIPS = {   # key: (source, start s, duration s, crop (x, y, w, h))
    'cc_start': (GIF, 0.0, 3.0, (44, 50, 1460, 900)),     # welcome header + typed prompt
    'cc_work':  (GIF, 8.0, 10.0, (44, 50, 1460, 900)),    # Claude Code reading files and planning
}


def extract(key, src, ss, dur, crop):
    d = os.path.join(OUT, key); os.makedirs(d, exist_ok=True)
    for f in glob.glob(os.path.join(d, '*')): os.remove(f)
    x, y, w, h = crop
    subprocess.run([FF, '-v', 'error', '-y', '-ss', str(ss), '-t', str(dur), '-i', os.path.join(RAW, src),
                    '-vf', f'crop={w}:{h}:{x}:{y},fps=30', '-q:v', '2', os.path.join(d, '%04d.jpg')], check=True)
    files = sorted(glob.glob(os.path.join(d, '*')))
    return {'frames': len(files), 'size': Image.open(files[0]).size, 'src': src, 'ss': ss, 'dur': dur, 'crop': crop}


if __name__ == '__main__':
    import sys
    os.makedirs(OUT, exist_ok=True)
    idx = os.path.join(OUT, 'frames_index.json')
    info = json.load(open(idx)) if os.path.exists(idx) else {}
    only = set(sys.argv[1:])
    for k, v in CLIPS.items():
        if only and k not in only: continue
        info[k] = extract(k, *v); print(k, info[k]['frames'], info[k]['size'])
    json.dump(info, open(idx, 'w'), indent=1)
