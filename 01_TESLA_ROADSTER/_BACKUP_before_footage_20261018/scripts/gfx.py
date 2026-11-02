"""Core graphics toolkit: colors, easing, Arabic text (Pillow+raqm), skia drawing,
a tiny perspective 3D engine and a procedural Roadster-*inspired* illustration model.
The 3D model is a generic sports-car volume for explanation only; it is NOT Tesla geometry."""
import math, functools, os
import numpy as np, skia
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_DIR = os.path.join(ROOT, 'fonts')

def hexc(h, a=1.0):
    h = h.lstrip('#'); r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return skia.Color4f(r / 255, g / 255, b / 255, a)
BG = '#080B10'; RED = '#E82127'; WHITE = '#F5F6F8'; CYAN = '#5CD6EE'; BLUE = '#2F7DFF'; GREY = '#8A93A0'; STEEL = '#B9C0CA'

# ---------- easing ----------
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def lin(t, t0, t1): return clamp((t - t0) / max(1e-6, t1 - t0))
def ease_io(x): x = clamp(x); return x * x * (3 - 2 * x)
def ease_out(x): x = clamp(x); return 1 - (1 - x) ** 3
def ease_in(x): x = clamp(x); return x ** 3
def ease_expo(x): x = clamp(x); return 1 - 2 ** (-10 * x) if x < 1 else 1.0
def lerp(a, b, x): return a + (b - a) * x
def env(t, t0, t1, fin=0.25, fout=0.25):
    """0..1 visibility envelope for an element shown from t0 to t1."""
    if t < t0 or t > t1: return 0.0
    return min(ease_out(lin(t, t0, t0 + fin)), 1 - ease_in(lin(t, t1 - fout, t1)) if fout > 0 else 1.0)

# ---------- text ----------
FONTS = {'thin': 'IBMPlexSansArabic-Thin.ttf', 'light': 'IBMPlexSansArabic-Light.ttf', 'reg': 'IBMPlexSansArabic-Regular.ttf',
         'med': 'IBMPlexSansArabic-Medium.ttf', 'semi': 'IBMPlexSansArabic-SemiBold.ttf', 'bold': 'IBMPlexSansArabic-Bold.ttf'}
@functools.lru_cache(64)
def _font(weight, size): return ImageFont.truetype(os.path.join(FONT_DIR, FONTS[weight]), size)

@functools.lru_cache(512)
def text_image(txt, size, weight='bold', color=WHITE, rtl=True, tracking=0, shadow=0):
    """Render a single line of (Arabic/mixed) text to a skia.Image. RTL shaping via raqm."""
    f = _font(weight, size)
    kw = dict(direction='rtl', language='ar') if rtl else dict(direction='ltr', language='en')
    l, t, r, b = f.getbbox(txt, **kw)
    pad = int(size * 0.35) + shadow * 2
    w, h = r - l + 2 * pad, int(size * 1.6) + 2 * pad
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    c = tuple(int(color.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))
    d.text((pad - l, pad + int(size * 0.1)), txt, font=f, fill=c + (255,), **kw)
    if shadow:
        from PIL import ImageFilter
        sh = Image.new('RGBA', (w, h), (0, 0, 0, 0)); ImageDraw.Draw(sh).text((pad - l, pad + int(size * 0.1)), txt, font=f, fill=(0, 0, 0, 200), **kw)
        sh = sh.filter(ImageFilter.GaussianBlur(shadow)); sh.alpha_composite(im); im = sh
    arr = np.ascontiguousarray(np.array(im))
    return skia.Image.fromarray(arr, colorType=skia.kRGBA_8888_ColorType)

def draw_text(c, txt, x, y, size, weight='bold', color=WHITE, alpha=1.0, anchor='c', rtl=True, scale=1.0, shadow=0, blur=0.0):
    """anchor: 'c' centre, 'r' right edge at x, 'l' left edge at x. y is vertical centre."""
    if alpha <= 0.003: return 0
    img = text_image(txt, size, weight, color, rtl, 0, shadow)
    w, h = img.width() * scale, img.height() * scale
    if anchor == 'c': x0 = x - w / 2
    elif anchor == 'r': x0 = x - w
    else: x0 = x
    p = skia.Paint(AntiAlias=True); p.setAlphaf(clamp(alpha))
    if blur > 0.2: p.setImageFilter(skia.ImageFilters.Blur(blur, blur))
    c.drawImageRect(img, skia.Rect.MakeXYWH(x0, y - h / 2, w, h), skia.SamplingOptions(skia.FilterMode.kLinear), p)
    return w

def text_width(txt, size, weight='bold', rtl=True):
    return text_image(txt, size, weight, WHITE, rtl).width()

# ---------- paints ----------
def paint(color, a=1.0, stroke=0, aa=True, cap=skia.Paint.kRound_Cap, blur=0):
    p = skia.Paint(AntiAlias=aa, Color4f=hexc(color, a) if isinstance(color, str) else color)
    if stroke: p.setStyle(skia.Paint.kStroke_Style); p.setStrokeWidth(stroke); p.setStrokeCap(cap); p.setStrokeJoin(skia.Paint.kRound_Join)
    if blur: p.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, blur))
    return p

def arrow(c, x0, y0, x1, y1, color=WHITE, a=1.0, width=6, head=26, glow=0):
    dx, dy = x1 - x0, y1 - y0; L = math.hypot(dx, dy)
    if L < 2 or a <= 0: return
    ux, uy = dx / L, dy / L
    bx, by = x1 - ux * head, y1 - uy * head
    if glow: c.drawLine(x0, y0, bx, by, paint(color, a * 0.45, width * 2.4, blur=glow))
    c.drawLine(x0, y0, bx, by, paint(color, a, width))
    path = skia.Path(); path.moveTo(x1, y1)
    path.lineTo(bx - uy * head * 0.55, by + ux * head * 0.55); path.lineTo(bx + uy * head * 0.55, by - ux * head * 0.55); path.close()
    c.drawPath(path, paint(color, a))

def vignette(c, strength=0.55):
    sh = skia.GradientShader.MakeRadial(skia.Point(W / 2, H * 0.48), H * 0.62,
                                        [hexc('#000000', 0.0), hexc('#000000', strength)], [0.45, 1.0])
    p = skia.Paint(); p.setShader(sh); c.drawRect(skia.Rect.MakeWH(W, H), p)

def background(c, t, tone=0.0):
    c.clear(hexc(BG))
    sh = skia.GradientShader.MakeRadial(skia.Point(W * 0.5, H * 0.42), H * 0.55,
                                        [hexc('#16202C', 1.0), hexc(BG, 1.0)], [0.0, 1.0])
    p = skia.Paint(); p.setShader(sh); c.drawRect(skia.Rect.MakeWH(W, H), p)

def film_grain(arr, amount=5.0, seed=0):
    rng = np.random.default_rng(seed)
    n = rng.normal(0, amount, (H // 2, W // 2, 1)).astype(np.float32)
    n = np.repeat(np.repeat(n, 2, 0), 2, 1)
    out = arr[..., :3].astype(np.float32) + n
    arr[..., :3] = np.clip(out, 0, 255).astype(np.uint8)
    return arr

# ---------- 3D ----------
def rot_x(a):
    c, s = math.cos(a), math.sin(a); return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])
def rot_y(a):
    c, s = math.cos(a), math.sin(a); return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])
def rot_z(a):
    c, s = math.cos(a), math.sin(a); return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])

class Camera:
    """World: x forward (car nose), y left, z up. Screen centre (cx, cy)."""
    def __init__(self, eye, target, fov=32, cx=W / 2, cy=H / 2, roll=0.0):
        self.eye = np.array(eye, float); self.target = np.array(target, float)
        f = self.target - self.eye; f /= np.linalg.norm(f)
        up = np.array([0, 0, 1.0])
        if abs(np.dot(f, up)) > 0.98: up = np.array([1.0, 0, 0])
        r = np.cross(f, up); r /= np.linalg.norm(r); u = np.cross(r, f)
        if roll:
            cr, sr = math.cos(roll), math.sin(roll); r, u = r * cr + u * sr, -r * sr + u * cr
        self.R = np.stack([r, u, f]); self.fpx = (H * 0.5) / math.tan(math.radians(fov) / 2); self.cx, self.cy = cx, cy
    def project(self, P):
        P = np.asarray(P, float); q = (P - self.eye) @ self.R.T
        z = np.maximum(q[..., 2], 1e-3)
        x = self.cx + self.fpx * q[..., 0] / z; y = self.cy - self.fpx * q[..., 1] / z
        return np.stack([x, y], -1), q[..., 2]
    def view_dir(self, P):
        d = np.asarray(P, float) - self.eye; return d / np.linalg.norm(d, axis=-1, keepdims=True)

# ---------- procedural Roadster-inspired illustration body ----------
L_CAR, W_CAR = 4.3, 2.0
def _profiles(s):
    """s: 0 rear .. 1 nose. returns z_top, half_width, z_bot"""
    ks = np.array([0.0, 0.04, 0.12, 0.30, 0.44, 0.55, 0.66, 0.80, 0.93, 1.0])
    zt = np.array([0.62, 0.86, 0.93, 0.98, 1.12, 1.10, 0.86, 0.74, 0.60, 0.40])
    hw = np.array([0.70, 0.90, 0.98, 0.99, 0.97, 0.96, 0.96, 0.93, 0.80, 0.55])
    z_top = np.interp(s, ks, zt); half = np.interp(s, ks, hw)
    z_bot = np.full_like(s, 0.16)
    end = np.clip(np.minimum(s / 0.03, (1 - s) / 0.025), 0, 1)
    half = half * (0.35 + 0.65 * np.sqrt(end))
    return z_top, half, z_bot

def car_mesh(nu=64, nv=36):
    s = np.linspace(0, 1, nu); zt, hw, zb = _profiles(s)
    x = (s - 0.5) * L_CAR
    v = np.linspace(0, 2 * np.pi, nv, endpoint=False)
    P = np.zeros((nu, nv, 3))
    for i in range(nu):
        zc = zb[i] + 0.30; up = zt[i] - zc; dn = zc - zb[i]
        cabin = np.exp(-((s[i] - 0.48) / 0.13) ** 2)  # greenhouse narrows the upper half
        for j, a in enumerate(v):
            ca, sa = math.cos(a), math.sin(a)
            e = 0.32 if sa < 0 else 0.55
            yy = math.copysign(abs(ca) ** e, ca)
            zz = math.copysign(abs(sa) ** (0.40 if sa < 0 else 0.85), sa)
            wfac = 1.0 - (0.30 * cabin) * max(0, zz) ** 1.5
            P[i, j] = (x[i], hw[i] * yy * wfac, zc + (up if sa >= 0 else dn) * zz)
    return P

CAR = car_mesh()
WHEELS = [(1.36, 0.87), (1.36, -0.87), (-1.30, 0.89), (-1.30, -0.89)]
FANS = [(0.72, 0.42), (0.72, -0.42), (-0.62, 0.42), (-0.62, -0.42)]   # conceptual placement
FAN_R = 0.25

def transform(P, M, pivot=(0, 0, 0.5), offset=(0, 0, 0)):
    pv = np.array(pivot); return (np.asarray(P) - pv) @ M.T + pv + np.array(offset)

def draw_car(c, cam, M=np.eye(3), pivot=(0, 0, 0.5), offset=(0, 0, 0), xray=1.0, alpha=1.0, solid=0.0,
             edge_color=STEEL, tint='#9FB3C8', highlight=None):
    """Draw the body as glassy x-ray quads (+ optional solid metallic shading), painter-sorted."""
    P = transform(CAR.reshape(-1, 3), M, pivot, offset).reshape(CAR.shape)
    nu, nv, _ = P.shape
    scr, dep = cam.project(P.reshape(-1, 3)); scr = scr.reshape(nu, nv, 2); dep = dep.reshape(nu, nv)
    light = np.array([0.35, 0.55, 0.75]); light /= np.linalg.norm(light)
    quads = []
    for i in range(nu - 1):
        for j in range(nv):
            j2 = (j + 1) % nv
            a, b, cc, d = P[i, j], P[i + 1, j], P[i + 1, j2], P[i, j2]
            n = np.cross(b - a, d - a); nn = np.linalg.norm(n)
            if nn < 1e-9: continue
            n /= nn
            ctr = (a + b + cc + d) / 4
            vd = cam.view_dir(ctr)
            facing = -np.dot(n, vd)
            depth = (dep[i, j] + dep[i + 1, j] + dep[i + 1, j2] + dep[i, j2]) / 4
            quads.append((depth, i, j, j2, n, facing))
    quads.sort(key=lambda q: -q[0])
    tr = hexc(tint)
    for depth, i, j, j2, n, facing in quads:
        pts = [scr[i, j], scr[i + 1, j], scr[i + 1, j2], scr[i, j2]]
        path = skia.Path(); path.moveTo(*pts[0]); [path.lineTo(*p) for p in pts[1:]]; path.close()
        fres = (1 - abs(facing)) ** 2.2
        if solid > 0:
            dif = max(0.0, float(np.dot(n, light)))
            spec = max(0.0, float(np.dot(n, light))) ** 24
            base = 0.10 + 0.32 * dif + 0.55 * spec + 0.25 * fres
            col = skia.Color4f(min(1, base * 0.92), min(1, base * 0.96), min(1, base * 1.05), alpha * solid * (1.0 if facing > 0 else 0.0))
            if facing > 0:
                c.drawPath(path, skia.Paint(AntiAlias=True, Color4f=col))
        if xray > 0:
            a_fill = alpha * xray * (0.035 + 0.22 * fres) * (1.0 if facing > 0 else 0.55)
            c.drawPath(path, skia.Paint(AntiAlias=True, Color4f=skia.Color4f(tr.fR, tr.fG, tr.fB, a_fill)))
    # structural lines (sparse iso-curves) for a technical drawing feel
    if xray > 0 or solid > 0:
        la = alpha * (0.55 * xray + 0.25 * solid)
        for i in range(2, nu - 2, 6):
            path = skia.Path(); path.moveTo(*scr[i, 0]); [path.lineTo(*scr[i, j]) for j in range(1, nv)]; path.close()
            c.drawPath(path, paint(edge_color, la * 0.35, 1.2))
        for j in [0, nv // 4, nv // 2, 3 * nv // 4, nv // 8, 3 * nv // 8, 5 * nv // 8, 7 * nv // 8]:
            path = skia.Path(); path.moveTo(*scr[0, j]); [path.lineTo(*scr[i, j]) for i in range(1, nu)]
            c.drawPath(path, paint(edge_color, la * 0.5, 1.4))
    return P

def circle_pts(center, r, axis='z', n=48, M=np.eye(3), pivot=(0, 0, 0.5), offset=(0, 0, 0)):
    a = np.linspace(0, 2 * np.pi, n, endpoint=False)
    cx, cy, cz = center
    if axis == 'z': pts = np.stack([cx + r * np.cos(a), cy + r * np.sin(a), np.full(n, cz)], 1)
    elif axis == 'y': pts = np.stack([cx + r * np.cos(a), np.full(n, cy), cz + r * np.sin(a)], 1)
    else: pts = np.stack([np.full(n, cx), cy + r * np.cos(a), cz + r * np.sin(a)], 1)
    return transform(pts, M, pivot, offset)

def poly(c, pts2d, p, close=True):
    path = skia.Path(); path.moveTo(*pts2d[0]); [path.lineTo(*q) for q in pts2d[1:]]
    if close: path.close()
    c.drawPath(path, p)

def draw_wheels(c, cam, M=np.eye(3), pivot=(0, 0, 0.5), offset=(0, 0, 0), alpha=1.0, spin=0.0):
    for (x, y) in WHEELS:
        for side in (-0.13, 0.13):
            pts = circle_pts((x, y + side, 0.35), 0.35, 'y', 40, M, pivot, offset)
            s2, _ = cam.project(pts)
            poly(c, s2, paint('#0E1218', 0.85 * alpha)); poly(c, s2, paint(STEEL, 0.55 * alpha, 1.6))
        pts = circle_pts((x, y + 0.13 * np.sign(y), 0.35), 0.22, 'y', 40, M, pivot, offset)
        s2, _ = cam.project(pts); poly(c, s2, paint(STEEL, 0.45 * alpha, 1.4))
        for k in range(5):
            ang = spin + k * 2 * np.pi / 5
            p0 = transform([[x, y + 0.13 * np.sign(y), 0.35]], M, pivot, offset)
            p1 = transform([[x + 0.2 * math.cos(ang), y + 0.13 * np.sign(y), 0.35 + 0.2 * math.sin(ang)]], M, pivot, offset)
            a2, _ = cam.project(np.vstack([p0, p1])); c.drawLine(*a2[0], *a2[1], paint(STEEL, 0.4 * alpha, 2))

def draw_fan(c, cam, x, y, z, r, angle, power, M=np.eye(3), pivot=(0, 0, 0.5), offset=(0, 0, 0), alpha=1.0):
    ring = circle_pts((x, y, z), r, 'z', 48, M, pivot, offset); s2, _ = cam.project(ring)
    poly(c, s2, paint('#0B1016', 0.75 * alpha))
    if power > 0:
        poly(c, s2, paint(CYAN, 0.30 * power * alpha, 0, blur=10))
    poly(c, s2, paint(CYAN if power > 0.05 else STEEL, (0.5 + 0.5 * power) * alpha, 2.5))
    hub = circle_pts((x, y, z), r * 0.22, 'z', 20, M, pivot, offset); h2, _ = cam.project(hub)
    poly(c, h2, paint(STEEL, 0.8 * alpha))
    nb = 7
    for k in range(nb):
        a0 = angle + k * 2 * np.pi / nb
        arc = []
        for u in np.linspace(0, 1, 7):
            rr = lerp(r * 0.22, r * 0.94, u); aa = a0 + 0.55 * u
            arc.append((x + rr * math.cos(aa), y + rr * math.sin(aa), z))
        a2, _ = cam.project(transform(arc, M, pivot, offset))
        path = skia.Path(); path.moveTo(*a2[0]); [path.lineTo(*q) for q in a2[1:]]
        c.drawPath(path, paint(WHITE if power > 0.05 else STEEL, (0.35 + 0.45 * power) * alpha, 3.2))

def surface_grid(c, cam, z=0.0, extent=7.0, step=0.5, M=np.eye(3), pivot=(0, 0, 0.5), offset=(0, 0, 0), alpha=1.0, color=STEEL):
    xs = np.arange(-extent, extent + 1e-6, step)
    for xv in xs:
        for line in ([(xv, -extent, z), (xv, extent, z)], [(-extent, xv, z), (extent, xv, z)]):
            pts = transform(np.linspace(line[0], line[1], 40), M, pivot, offset)
            s2, d = cam.project(pts)
            fade = np.exp(-(np.linalg.norm(pts[:, :2] - np.array(offset[:2]), axis=1) / (extent * 0.6)) ** 2)
            for k in range(len(s2) - 1):
                if d[k] < 0.2 or d[k + 1] < 0.2: continue
                a = alpha * 0.28 * fade[k] * (1.6 if abs(xv) < 1e-6 else 1.0)
                if a > 0.01: c.drawLine(*s2[k], *s2[k + 1], paint(color, a, 1.2))

def to_array(surface):
    return surface.makeImageSnapshot().toarray(colorType=skia.kRGBA_8888_ColorType)  # RGBA uint8 (H, W, 4)

def new_surface():
    return skia.Surface(W, H)
