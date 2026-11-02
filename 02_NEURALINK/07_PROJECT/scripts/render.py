"""NEURALINK reel renderer (single process, sequential frames -> ffmpeg/libx264).
Usage:
  python render.py video <out.mp4> [f0 f1]        render frames [f0, f1) to an H.264 video (no audio)
  python render.py stills <out_dir> t1 t2 ...     render single frames at master times (seconds) to JPG
Frame n is at master time n/30 s on the original voice-over."""
import sys, os, subprocess, time
import numpy as np, skia
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from nl.gfx import *
from nl import media as M, scenes as S
from nl.timeline import SCENES, SUBS, FRAMES

SURF = {k: new_surface() for k in ('main', 'a', 'b')}

def draw_scene(c, sid, T, overlays=True):
    lt = T - S.START[sid]
    c.save()
    if sid == 'callback':
        S.callback(c, lt, T, render_scene=lambda cc, tt: compose(cc, tt, overlays=False, subs=False))
    else:
        S.DRAW[sid](c, lt, T)
    c.restore()
    if overlays:
        S.badge(c, S.BADGE.get(sid))
        S.credit(c, S.CREDIT.get(sid))

def active(T):
    return [(s, b, e) for s, b, e in SCENES if b <= T < e]

def blit(c, img, alpha=1.0, scale=1.0, dy=0.0, blur=0.0):
    p = skia.Paint(AntiAlias=True); p.setAlphaf(clamp(alpha))
    if blur > 0.3: p.setImageFilter(skia.ImageFilters.Blur(blur, blur))
    c.save(); c.translate(W / 2, H / 2 + dy); c.scale(scale, scale); c.translate(-W / 2, -H / 2)
    c.drawImage(img, 0, 0, SAMP, p); c.restore()

def compose(c, T, overlays=True, subs=True):
    act = active(T)
    if not act:
        fill(c, INK); return
    if len(act) == 1:
        draw_scene(c, act[0][0], T, overlays)
    else:
        (sa, ba, ea), (sb, bb, eb) = act[-2], act[-1]
        x = clamp((T - bb) / max(1e-6, ea - bb))
        kind = S.TRANS.get(sb, 'fade')
        if kind == 'cut':
            draw_scene(c, sa if x < 0.5 else sb, T, overlays)
        else:
            ca = SURF['a'].getCanvas(); ca.clear(skia.ColorBLACK); draw_scene(ca, sa, T, overlays)
            cb = SURF['b'].getCanvas(); cb.clear(skia.ColorBLACK); draw_scene(cb, sb, T, overlays)
            ia, ib = SURF['a'].makeImageSnapshot(), SURF['b'].makeImageSnapshot()
            e = ease_io(x)
            if kind == 'fade':
                blit(c, ia); blit(c, ib, e)
            elif kind == 'blurfade':
                blit(c, ia, 1.0, 1.0 + 0.04 * e, blur=18 * e); blit(c, ib, e, 1.04 - 0.04 * e, blur=18 * (1 - e))
            elif kind == 'zoomthrough':
                blit(c, ia, 1.0, 1.0 + 0.35 * ease_in(x), blur=10 * x); blit(c, ib, e, 0.86 + 0.14 * ease_out(x))
            elif kind == 'rise':
                blit(c, ia, 1.0, 1.0, -260 * e); blit(c, ib, 1.0, 1.0, H * (1 - ease_out5(x)))
            elif kind == 'flash':
                blit(c, ia if x < 0.5 else ib)
                fill(c, PAPER, 0.85 * (1 - abs(x - 0.5) * 2) ** 1.5)
            else:
                blit(c, ia); blit(c, ib, e)
    if subs: draw_subs(c, T)

def draw_subs(c, T):
    for i, (b, e, txt, emph) in enumerate(SUBS):
        nb = SUBS[i + 1][0] if i + 1 < len(SUBS) else 1e9
        # fade-out must finish before the next chunk fades in (no overlapping lines)
        o0 = min(e, nb - 0.16); o1 = min(e + 0.14, nb - 0.06)
        if not (b - 0.06 <= T < o1): continue
        a = ease_out(lin(T, b - 0.06, b + 0.10)) * (1 - ease_in(lin(T, o0, o1)))
        if a <= 0: continue
        size = 50; words = txt.split(' '); sp = size * 0.30
        ws = [text_size(w, size, 'display', 600)[0] for w in words]
        total = sum(ws) + sp * (len(words) - 1)
        y = 1440 + 12 * (1 - ease_out(lin(T, b - 0.06, b + 0.16)))
        plate = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(W / 2 - total / 2 - 40, y - 46, total + 80, 92), 46, 46)
        c.drawRRect(plate, paint(INK, 0.40 * a, blur=18))
        x = W / 2 + total / 2
        for w, wd in zip(words, ws):
            col = AMBER if w in emph else PAPER
            draw_text(c, w, x, y, size, 'display', 600, col, a, anchor='r', shadow=8)
            x -= wd + sp

def frame_array(n):
    T = n / FPS
    M.gc(n)
    c = SURF['main'].getCanvas(); c.clear(skia.ColorBLACK)
    compose(c, T)
    arr = surface_array(SURF['main'])
    return grain(arr, 4.2, n)

def main():
    mode = sys.argv[1]
    if mode == 'video':
        out = sys.argv[2]; f0 = int(sys.argv[3]) if len(sys.argv) > 3 else 0; f1 = int(sys.argv[4]) if len(sys.argv) > 4 else FRAMES
        cmd = [M.FFMPEG, '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
               '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
               '-g', '60', '-movflags', '+faststart', out]
        enc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        t0 = time.time()
        for n in range(f0, f1):
            enc.stdin.write(frame_array(n).tobytes())
            if n % 30 == 0:
                el = time.time() - t0; done = n - f0 + 1
                print(f'frame {n}/{f1}  {el / done:.2f}s/f  eta {(f1 - n) * el / done / 60:.1f} min', flush=True)
        enc.stdin.close(); rc = enc.wait()
        M.close_clips()
        if rc: raise SystemExit(f'ffmpeg failed {rc}')
        print('done', out, f'{time.time() - t0:.0f}s')
    elif mode == 'stills':
        from PIL import Image
        out = sys.argv[2]; os.makedirs(out, exist_ok=True)
        for t in sys.argv[3:]:
            n = int(round(float(t) * FPS))
            Image.fromarray(frame_array(n)[..., :3]).save(os.path.join(out, f'f_{n:05d}.jpg'), quality=90)
            print('still', t, flush=True)
        M.close_clips()

if __name__ == '__main__':
    main()
