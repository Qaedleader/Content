"""Render driver.
  python -I render.py stills <f1> <f2> ...       -> 05_PREVIEW/stills/f####.jpg
  python -I render.py chunk <first> <last> <out>  -> muted H.264 chunk (CRF 14, yuv420p, bt709 tv range)
One process at a time (8 GB RAM)."""
import os, sys, subprocess, time
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from episode import render_frame, N_FRAMES, PROJ
from PIL import Image

FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'


def frame_rgb(f):
    surf = render_frame(f)
    arr = surf.makeImageSnapshot().toarray()     # BGRA on Windows (N32)
    return arr


def stills(frames):
    out = os.path.join(PROJ, '05_PREVIEW', 'stills'); os.makedirs(out, exist_ok=True)
    for f in frames:
        a = frame_rgb(f)
        Image.fromarray(a[..., [2, 1, 0]]).save(os.path.join(out, f'f{f:04d}.jpg'), quality=92)
        print('still', f, flush=True)


def chunk(a, b, path):
    b = min(b, N_FRAMES - 1)
    cmd = [FF, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgra', '-s', '1080x1920', '-r', '30', '-i', '-',
           '-vf', 'scale=in_range=pc:out_range=tv:in_color_matrix=bt709:out_color_matrix=bt709,format=yuv420p',
           '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-x264-params', 'keyint=60:min-keyint=30',
           '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', path]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    t0 = time.time()
    for f in range(a, b + 1):
        arr = frame_rgb(f)
        p.stdin.write(np.ascontiguousarray(arr).tobytes())
        if (f - a) % 30 == 0: print(f'frame {f} ({time.time() - t0:.0f}s)', flush=True)
    p.stdin.close(); p.wait()
    print('done', a, b, path, f'{time.time() - t0:.0f}s')


if __name__ == '__main__':
    if sys.argv[1] == 'stills':
        stills([int(x) for x in sys.argv[2:]])
    elif sys.argv[1] == 'chunk':
        chunk(int(sys.argv[2]), int(sys.argv[3]), sys.argv[4])
