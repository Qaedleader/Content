"""Frame renderer: footage (or slot cards in preview mode) + original graphics + overlays + subtitles.
Usage: python3 render.py <out.mp4> <frame_start> <frame_end> [--no-subs]
Raw RGB frames are piped to ffmpeg/libx264 (video only; audio is muxed in a separate step).

Footage slots come from footage_map.json (written by prep_footage.py from footage_plan.json):
 - video slots: pre-reframed 1080x1920 intermediates in renders/footage/
 - still slots ("type": "still"): photographs framed live here with an eased virtual camera
   (keyframes [t, cx, cy, zoom, rot_deg] in shot-relative seconds; cx/cy = normalised image centre,
   zoom 1 = the largest 9:16 crop that fits the image), optional whip-in and flash accents."""
import sys, os, json, math, functools, subprocess, numpy as np, skia, cv2
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gfx import *
import scenes as S, overlays as O, timeline as TL

FMAP_PATH = os.path.join(ROOT, 'footage_map.json')
FMAP = json.load(open(FMAP_PATH, encoding='utf-8')) if os.path.exists(FMAP_PATH) else {}

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

# ----- photographs: eased virtual camera -----
EASES = {'io': ease_io, 'out': ease_out, 'in': ease_in, 'lin': lambda x: clamp(x), 'expo': ease_expo}

@functools.lru_cache(2)   # small: 4K stills are ~30 MB each and several render processes run at once
def _still(path):
    bgr = cv2.imread(path, cv2.IMREAD_COLOR)
    if bgr is None: raise RuntimeError(f'cannot read {path}')
    return cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)

@functools.lru_cache(3)
def _still_level(path, f):
    img = _still(path)
    if f >= 0.999: return img
    return cv2.resize(img, (int(img.shape[1] * f), int(img.shape[0] * f)), interpolation=cv2.INTER_AREA)

def still_cam(m, tr):
    """Interpolated (cx, cy, zoom, rot) at shot-relative time tr."""
    kf = m['kf']; ease = EASES[m.get('ease', 'io')]
    if tr <= kf[0][0]: return kf[0][1:]
    for a, b in zip(kf[:-1], kf[1:]):
        if tr <= b[0]:
            k = ease((tr - a[0]) / max(1e-6, b[0] - a[0]))
            return [lerp(a[i], b[i], k) for i in range(1, 5)]
    return kf[-1][1:]

def still_frame(m, tr):
    if 'seq' in m:  # several photographs inside one slot: [{"t": start, "file": ..., "kf": ...}, ...]
        part = [p for p in m['seq'] if p['t'] <= tr + 1e-6][-1] if tr >= m['seq'][0]['t'] else m['seq'][0]
        m = {**{k: v for k, v in m.items() if k != 'seq'}, **part}; tr -= part['t']
    path = os.path.join(ROOT, m['file'])
    Hi, Wi = _still(path).shape[:2]
    cx, cy, zoom, rot = still_cam(m, tr)
    ch = min(Hi, Wi * 16 / 9) / zoom; cw = ch * 9 / 16
    px, py = cx * Wi, cy * Hi
    if m.get('clamp', True):
        px = clamp(px, min(cw / 2, Wi / 2), max(Wi - cw / 2, Wi / 2)); py = clamp(py, min(ch / 2, Hi / 2), max(Hi - ch / 2, Hi / 2))
    s = ch / H                                   # source pixels per output pixel
    f = 1.0 if s < 1.6 else (0.75 if s < 2.2 else 0.5)   # pre-filtered level so heavy downscales don't alias
    img = _still_level(path, f); s *= f; px *= f; py *= f
    a = math.radians(rot); ca, sa = math.cos(a) * s, math.sin(a) * s
    M = np.array([[ca, -sa, px - ca * W / 2 + sa * H / 2], [sa, ca, py - sa * W / 2 - ca * H / 2]], np.float32)
    border = cv2.BORDER_REFLECT_101 if m.get('border') == 'reflect' else cv2.BORDER_REPLICATE
    out = cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP, borderMode=border)
    # whip-in: directional motion blur that resolves over the first frames of the shot
    wd = m.get('whip')
    if wd and tr < 0.2:
        k = (1 - tr / 0.2) ** 2; L = int(90 * k)
        if L >= 3:
            ker = np.zeros((L, L), np.float32)
            if wd in ('left', 'right'): ker[L // 2, :] = 1.0 / L
            else: ker[:, L // 2] = 1.0 / L
            out = cv2.filter2D(out, -1, ker, borderType=cv2.BORDER_REPLICATE)
            sh = int(140 * k) * (1 if wd in ('right', 'down') else -1)
            out = np.roll(out, sh, axis=1 if wd in ('left', 'right') else 0)
    return out

class Footage:
    def __init__(self): self.caps = {}
    def frame(self, slot, t_rel):
        m = FMAP.get(slot)
        if m is None: return None
        if m.get('type') == 'still':
            rgb = still_frame(m, t_rel)
            return grade(rgb) if m.get('grade', True) else rgb
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

def track_at(m, tr):
    """Hand-keyed screen position of the subject ([t, x, y] rows) for overlays that follow it."""
    tk = m.get('track')
    if not tk: return None
    if tr <= tk[0][0]: return tuple(tk[0][1:])
    for a, b in zip(tk[:-1], tk[1:]):
        if tr <= b[0]:
            k = (tr - a[0]) / max(1e-6, b[0] - a[0]); return (lerp(a[1], b[1], k), lerp(a[2], b[2], k))
    return tuple(tk[-1][1:])

def compose(sh, t):
    """Picture for shot `sh` at time t (no subtitles). Returns an RGBA array."""
    start, end, kind, what, ovs, desc, src = sh
    surf = new_surface(); c = surf.getCanvas()
    O.TRACK = None
    if kind == 'real':
        slot = what.replace('_freeze', '')
        key = what if what in FMAP else slot
        fr = FOOT.frame(key, t - start) if key in FMAP else None
        if fr is not None:
            m = FMAP[key]
            img = skia.Image.fromarray(np.ascontiguousarray(np.dstack([fr, np.full(fr.shape[:2], 255, np.uint8)])), colorType=skia.kRGBA_8888_ColorType)
            c.drawImage(img, 0, 0)
            vignette(c, 0.35)
            O.TRACK = track_at(m, t - start)
            ca = ease_out(lin(t, start + 0.1, start + 0.45))
            if m.get('credit'): O.credit(c, m['credit'], ca, m.get('credit2'))
            if m.get('tag'): O.source_badge(c, m['tag'], ca, real=m.get('real', False))
            for fl in m.get('flash', []):  # bright accent decaying over ~0.3 s (camera-flash on freezes / impacts)
                k = t - start - fl
                if 0 <= k < 0.3: c.drawRect(skia.Rect.MakeWH(W, H), paint('#FFFFFF', 0.55 * (1 - k / 0.3) ** 2))
        else:
            S.slot_card(c, t, what, desc, src)
    else:
        what(c, t)
    for ov in ovs: ov(c, t)
    return to_array(surf)

# Soft crossfades where real footage meets the explanatory 3D (and around the typography card).
# Cuts between real shots stay hard: they are timed to the speech.
XFADE = [7.32, 13.41, 15.47, 16.75, 19.95, 24.35, 30.00, 31.52, 33.20, 35.42, 57.46, 66.44, 73.98, 75.80]
XF_HALF = 0.12

def render_frame(t, subs=True):
    sh = TL.shot_at(t)
    arr = compose(sh, t)
    for b in XFADE:
        if b - XF_HALF <= t < b + XF_HALF:
            k = ease_io((t - (b - XF_HALF)) / (2 * XF_HALF))       # weight of the incoming shot
            prev = TL.shot_at(b - 1e-3); nxt = TL.shot_at(b)
            other = compose(prev if sh is nxt else nxt, t)
            wa = k if sh is nxt else 1 - k
            arr = np.clip(arr.astype(np.float32) * wa + other.astype(np.float32) * (1 - wa), 0, 255).astype(np.uint8)
            break
    if subs:
        surf = skia.Surface(np.ascontiguousarray(arr), colorType=skia.kRGBA_8888_ColorType); c = surf.getCanvas()
        bottom_band(c); O.draw_subtitles(c, t)
        arr = to_array(surf)
    return arr[..., :3]

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
    if p.returncode: raise SystemExit(f'ffmpeg failed ({p.returncode}) for {out}')

if __name__ == '__main__':
    main()
