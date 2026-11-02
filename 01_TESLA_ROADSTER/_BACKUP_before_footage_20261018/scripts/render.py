"""Frame renderer: footage (or slot cards in preview mode) + original graphics + overlays + subtitles.
Usage: python3 render.py <out.mp4> <frame_start> <frame_end> [--no-subs]
Raw RGB frames are piped to ffmpeg/libx264 (video only; audio is muxed in a separate step)."""
import sys, os, json, subprocess, numpy as np, skia, cv2
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gfx import *
import scenes as S, overlays as O, timeline as TL

FMAP_PATH = os.path.join(ROOT, 'footage_map.json')
FMAP = json.load(open(FMAP_PATH)) if os.path.exists(FMAP_PATH) else {}

# ----- cinematic grade for real footage (gentle S-curve, cool shadows, warm highlights, slight desat) -----
_x = np.arange(256) / 255.0
_s = np.clip(0.5 + (_x - 0.5) * 1.06 + 0.06 * np.sin(2 * np.pi * _x - np.pi) * -1, 0, 1)
LUT_R = np.clip(255 * (_s * 1.00 + 0.012 * _x), 0, 255).astype(np.uint8)
LUT_G = np.clip(255 * (_s * 0.995), 0, 255).astype(np.uint8)
LUT_B = np.clip(255 * (_s * 0.97 + 0.035 * (1 - _x) ** 2), 0, 255).astype(np.uint8)
def grade(rgb):
    out = np.empty_like(rgb)
    out[..., 0] = LUT_R[rgb[..., 0]]; out[..., 1] = LUT_G[rgb[..., 1]]; out[..., 2] = LUT_B[rgb[..., 2]]
    g = out.mean(2, keepdims=True)
    return np.clip(g + (out - g) * 0.92, 0, 255).astype(np.uint8)

class Footage:
    def __init__(self): self.caps = {}
    def frame(self, slot, t_rel):
        m = FMAP.get(slot)
        if m is None: return None
        path = os.path.join(ROOT, m['file'])
        if 'freeze' in m: fi = int(round(m['freeze'] * FPS))
        else: fi = int(round((m.get('in', 0.0) + t_rel * m.get('speed', 1.0)) * FPS))
        cap, last = self.caps.get(path, (None, -10))
        if cap is None: cap = cv2.VideoCapture(path); last = -10
        n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)); fi = max(0, min(fi, n - 1))
        if fi != last + 1: cap.set(cv2.CAP_PROP_POS_FRAMES, fi)
        ok, bgr = cap.read()
        self.caps[path] = (cap, fi)
        if not ok: raise RuntimeError(f'cannot read {path} frame {fi}')
        if bgr.shape[:2] != (H, W): raise RuntimeError(f'{path} must be pre-reframed to 1080x1920')
        rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
        return grade(rgb) if m.get('grade', True) else rgb

FOOT = Footage()

def bottom_band(c):
    sh = skia.GradientShader.MakeLinear([skia.Point(0, 1300), skia.Point(0, 1560)], [hexc('#000000', 0.0), hexc('#000000', 0.42)])
    p = skia.Paint(); p.setShader(sh); c.drawRect(skia.Rect.MakeLTRB(0, 1300, W, 1600), p)
    sh = skia.GradientShader.MakeLinear([skia.Point(0, 1560), skia.Point(0, H)], [hexc('#000000', 0.42), hexc('#000000', 0.2)])
    p = skia.Paint(); p.setShader(sh); c.drawRect(skia.Rect.MakeLTRB(0, 1560, W, H), p)

def render_frame(t, subs=True):
    sh = TL.shot_at(t)
    start, end, kind, what, ovs, desc, src = sh
    surf = new_surface(); c = surf.getCanvas()
    if kind == 'real':
        slot = what.replace('_freeze', '')
        fr = FOOT.frame(what if what in FMAP else slot, t - start) if (what in FMAP or slot in FMAP) else None
        if fr is not None:
            img = skia.Image.fromarray(np.ascontiguousarray(np.dstack([fr, np.full(fr.shape[:2], 255, np.uint8)])), colorType=skia.kRGBA_8888_ColorType)
            c.drawImage(img, 0, 0)
            vignette(c, 0.35)
            m = FMAP.get(what, FMAP.get(slot, {}))
            if m.get('credit'): O.credit(c, m['credit'])
        else:
            S.slot_card(c, t, what, desc, src)
    else:
        what(c, t)
    for ov in ovs: ov(c, t)
    if subs:
        bottom_band(c); O.draw_subtitles(c, t)
    # 4-frame cross-dissolve hint at hard cuts is avoided on purpose: cuts are timed to speech.
    return to_array(surf)[..., :3]

def main():
    out, f0, f1 = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    subs = '--no-subs' not in sys.argv
    cmd = ['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
           '-c:v', 'libx264', '-preset', os.environ.get('X264_PRESET', 'medium'), '-crf', os.environ.get('X264_CRF', '15'), '-pix_fmt', 'yuv420p', '-tune', 'film', '-x264-params', 'keyint=30', out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(f0, f1):
        t = i / FPS
        fr = render_frame(t, subs)
        fr = film_grain(fr.copy(), float(os.environ.get('GRAIN', '1.2')), seed=i) if float(os.environ.get('GRAIN', '1.2')) > 0 else fr
        p.stdin.write(np.ascontiguousarray(fr).tobytes())
        if i % 150 == 0: print(f'{out}: frame {i}', flush=True)
    p.stdin.close(); p.wait()

if __name__ == '__main__':
    main()
