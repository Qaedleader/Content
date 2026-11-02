"""Neuralink reel — core graphics toolkit.
Palette, easing, Arabic typography (Pillow + raqm shaping -> skia images), photo/print drawing, light & texture.
Visual identity "Paper & Signal": warm archival paper and real photographs (human memory) against a deep ink-navy
field; thin amber signal lines (the neural 'thread'), violet for the speculative future, ice-blue for machine/data."""
import os, math, functools
import numpy as np, skia
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS = 1080, 1920, 30
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))   # 07_PROJECT
NL = os.path.dirname(ROOT)                                                             # 02_NEURALINK
FONT_DIR = os.path.join(NL, '05_3D_AND_GRAPHICS', 'fonts')

# ---------- palette ----------
INK = '#0A0D1A'; INK2 = '#121833'; INK3 = '#1C2447'
PAPER = '#EFE8DC'; BONE = '#D9CBB4'; SEPIA = '#B89B74'
AMBER = '#FFB25E'; EMBER = '#FF7A45'
VIOLET = '#8B6CFF'; LILAC = '#C6B8FF'
ICE = '#7FD6FF'; SILVER = '#E6EBF3'; WHITE = '#FFFFFF'; BLACK = '#000000'

def hexc(h, a=1.0):
    h = h.lstrip('#'); return skia.Color4f(int(h[0:2], 16) / 255, int(h[2:4], 16) / 255, int(h[4:6], 16) / 255, a)
def rgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def mix_hex(a, b, x):
    ra, rb = rgb(a), rgb(b); return '#%02X%02X%02X' % tuple(int(ra[i] + (rb[i] - ra[i]) * clamp(x)) for i in range(3))

# ---------- time / easing ----------
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def lin(t, t0, t1): return clamp((t - t0) / max(1e-6, t1 - t0))
def lerp(a, b, x): return a + (b - a) * x
def ease_io(x): x = clamp(x); return x * x * (3 - 2 * x)
def ease_io5(x): x = clamp(x); return x * x * x * (x * (6 * x - 15) + 10)
def ease_out(x): x = clamp(x); return 1 - (1 - x) ** 3
def ease_out5(x): x = clamp(x); return 1 - (1 - x) ** 5
def ease_in(x): x = clamp(x); return x ** 3
def ease_expo(x): x = clamp(x); return 1 - 2 ** (-10 * x) if x < 1 else 1.0
def ease_back(x, s=1.4): x = clamp(x); return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2
def env(t, t0, t1, fin=0.25, fout=0.25):
    """0->1->0 envelope over [t0,t1] with fade-in/out durations."""
    if t < t0 or t > t1: return 0.0
    a = 1.0
    if fin > 0: a = min(a, ease_io((t - t0) / fin))
    if fout > 0: a = min(a, ease_io((t1 - t) / fout))
    return a
def keys(t, kf, ease=ease_io):
    """piecewise interpolation of [(t, value_or_tuple), ...]"""
    if t <= kf[0][0]: return kf[0][1]
    for (t0, v0), (t1, v1) in zip(kf[:-1], kf[1:]):
        if t <= t1:
            x = ease((t - t0) / max(1e-6, t1 - t0))
            if isinstance(v0, (tuple, list)): return tuple(lerp(a, b, x) for a, b in zip(v0, v1))
            return lerp(v0, v1, x)
    return kf[-1][1]

# ---------- typography ----------
FONTS = {'display': 'Alexandria[wght].ttf', 'serif': 'Amiri-Bold.ttf', 'serif_reg': 'Amiri-Regular.ttf',
         'naskh': 'NotoNaskhArabic[wght].ttf', 'mono': 'JetBrainsMono[wght].ttf'}
VARIABLE = {'display', 'naskh', 'mono'}

@functools.lru_cache(96)
def _font(family, weight, size):
    f = ImageFont.truetype(os.path.join(FONT_DIR, FONTS[family]), size, layout_engine=ImageFont.Layout.RAQM)
    if family in VARIABLE: f.set_variation_by_axes([weight])
    return f

def _is_rtl(txt): return any('؀' <= ch <= 'ۿ' for ch in txt)

@functools.lru_cache(1024)
def text_image(txt, size, family='display', weight=600, color=PAPER, tracking=0):
    """Single line of text -> skia.Image (RGBA). Arabic is shaped RTL by raqm; Latin/mono LTR."""
    rtl = _is_rtl(txt)
    if rtl and family == 'mono':   # JetBrains Mono has no Arabic: fall back to the display face
        family, weight = 'display', min(weight, 500)
    f = _font(family, weight, int(size))
    kw = dict(direction='rtl', language='ar') if rtl else dict(direction='ltr', language='en')
    if tracking and not rtl:
        kw['features'] = ['-kern']
    l, t, r, b = f.getbbox(txt, **kw)
    pad = int(size * 0.4)
    extra = int(abs(tracking) * len(txt)) if (tracking and not rtl) else 0
    w, h = r - l + 2 * pad + extra, int(size * 1.75) + 2 * pad
    im = Image.new('RGBA', (max(4, w), h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    if tracking and not rtl:
        x = pad - l
        for ch in txt:
            d.text((x, pad + int(size * 0.12)), ch, font=f, fill=rgb(color) + (255,), **kw)
            x += f.getlength(ch, **kw) + tracking
    else:
        d.text((pad - l, pad + int(size * 0.12)), txt, font=f, fill=rgb(color) + (255,), **kw)
    bb = im.getbbox() or (0, 0, w, h)
    im = im.crop((0, max(0, bb[1] - pad // 2), w, min(h, bb[3] + pad // 2)))
    arr = np.ascontiguousarray(np.array(im))
    return skia.Image.fromarray(arr, colorType=skia.kRGBA_8888_ColorType)

def text_size(txt, size, family='display', weight=600, tracking=0):
    im = text_image(txt, size, family, weight, PAPER, tracking); pad = int(size * 0.4)
    return im.width() - 2 * pad, im.height()

def draw_text(c, txt, x, y, size, family='display', weight=600, color=PAPER, alpha=1.0, anchor='c', scale=1.0,
              blur=0.0, shadow=0.0, tracking=0, rot=0.0, glow=0.0):
    """anchor: c (centre) / r (right edge at x) / l (left edge at x); y = vertical centre. Returns drawn width."""
    if alpha <= 0.003 or not txt: return 0
    img = text_image(txt, size, family, weight, color, tracking)
    pad = int(size * 0.4) * scale
    w, h = img.width() * scale, img.height() * scale
    x0 = x - w / 2 if anchor == 'c' else (x - w + pad if anchor == 'r' else x - pad)
    rect = skia.Rect.MakeXYWH(x0, y - h / 2, w, h)
    c.save()
    if rot: c.rotate(rot, x, y)
    samp = skia.SamplingOptions(skia.FilterMode.kLinear)
    if shadow > 0:
        p = skia.Paint(AntiAlias=True); p.setAlphaf(clamp(alpha) * 0.75)
        p.setImageFilter(skia.ImageFilters.DropShadowOnly(0, size * 0.04, shadow, shadow, skia.ColorSetARGB(220, 0, 0, 0)))
        c.drawImageRect(img, rect, samp, p)
    if glow > 0:
        p = skia.Paint(AntiAlias=True); p.setAlphaf(clamp(alpha) * 0.55); p.setBlendMode(skia.BlendMode.kScreen)
        p.setImageFilter(skia.ImageFilters.Blur(glow, glow)); c.drawImageRect(img, rect, samp, p)
    p = skia.Paint(AntiAlias=True); p.setAlphaf(clamp(alpha))
    if blur > 0.2: p.setImageFilter(skia.ImageFilters.Blur(blur, blur))
    c.drawImageRect(img, rect, samp, p)
    c.restore()
    return w - 2 * pad

# ---------- paints ----------
def paint(color, a=1.0, stroke=0, blur=0, blend=None, cap=skia.Paint.kRound_Cap):
    p = skia.Paint(AntiAlias=True, Color4f=hexc(color, clamp(a)) if isinstance(color, str) else color)
    if stroke: p.setStyle(skia.Paint.kStroke_Style); p.setStrokeWidth(stroke); p.setStrokeCap(cap); p.setStrokeJoin(skia.Paint.kRound_Join)
    if blur: p.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, blur))
    if blend is not None: p.setBlendMode(blend)
    return p

def fill(c, color, a=1.0): c.drawRect(skia.Rect.MakeWH(W, H), paint(color, a))

def gradient_v(c, stops, rect=None, a=1.0):
    rect = rect or skia.Rect.MakeWH(W, H)
    cols = [hexc(s[1], a * (s[2] if len(s) > 2 else 1.0)) for s in stops]
    sh = skia.GradientShader.MakeLinear([skia.Point(rect.left(), rect.top()), skia.Point(rect.left(), rect.bottom())],
                                        [col.toColor() for col in cols], [s[0] for s in stops])
    p = skia.Paint(); p.setShader(sh); c.drawRect(rect, p)

def radial(c, x, y, r, color, a=1.0, blend=skia.BlendMode.kSrcOver, inner=0.0):
    sh = skia.GradientShader.MakeRadial(skia.Point(x, y), max(1, r), [hexc(color, a).toColor(), hexc(color, 0).toColor()], [inner, 1.0])
    p = skia.Paint(); p.setShader(sh); p.setBlendMode(blend); c.drawRect(skia.Rect.MakeWH(W, H), p)

def vignette(c, strength=0.55, cy=0.47):
    sh = skia.GradientShader.MakeRadial(skia.Point(W / 2, H * cy), H * 0.66,
                                        [hexc(BLACK, 0).toColor(), hexc(BLACK, strength).toColor()], [0.42, 1.0])
    p = skia.Paint(); p.setShader(sh); c.drawRect(skia.Rect.MakeWH(W, H), p)

def backdrop(c, t, tone=INK, glow=INK3, gx=0.5, gy=0.42):
    """Designed ink-navy field: deep base, soft lifted centre, faint paper fibre texture added in post."""
    fill(c, tone)
    radial(c, W * gx, H * gy, H * 0.62, glow, 0.85)

def line_path(pts):
    p = skia.Path(); p.moveTo(*pts[0])
    for q in pts[1:]: p.lineTo(*q)
    return p

def poly_line(c, pts, color, a=1.0, width=3.0, glow=0.0):
    if len(pts) < 2 or a <= 0: return
    path = line_path(pts)
    if glow: c.drawPath(path, paint(color, a * 0.5, width * 3, blur=glow, blend=skia.BlendMode.kScreen))
    c.drawPath(path, paint(color, a, width))

# ---------- images ----------
Image.MAX_IMAGE_PIXELS = None

@functools.lru_cache(6)
def load_image(path, max_dim=2600):
    from PIL import ImageOps
    im = Image.open(path)
    im.draft('RGB', (max_dim, max_dim))
    im = ImageOps.exif_transpose(im).convert('RGBA')   # phone photos carry EXIF rotation
    if max(im.size) > max_dim:
        s = max_dim / max(im.size); im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    return skia.Image.fromarray(np.ascontiguousarray(np.array(im)), colorType=skia.kRGBA_8888_ColorType)

def to_skimage(arr):
    """numpy HxWx3/4 uint8 RGB(A) -> skia.Image"""
    if arr.shape[2] == 3:
        arr = np.concatenate([arr, np.full(arr.shape[:2] + (1,), 255, np.uint8)], 2)
    return skia.Image.fromarray(np.ascontiguousarray(arr), colorType=skia.kRGBA_8888_ColorType)

SAMP = skia.SamplingOptions(skia.FilterMode.kLinear, skia.MipmapMode.kLinear)
SAMP_CUBIC = skia.SamplingOptions(skia.CubicResampler.Mitchell())

def draw_cover(c, img, rect=None, cx=0.5, cy=0.5, zoom=1.0, alpha=1.0, rot=0.0, cf=None, blur=0.0, blend=None, flip=False):
    """Fill rect with img (cover), focus point (cx,cy) in image-normalised coords, extra zoom >= 1."""
    rect = rect or skia.Rect.MakeWH(W, H)
    if alpha <= 0.003: return
    iw, ih = img.width(), img.height()
    s = max(rect.width() / iw, rect.height() / ih) * zoom
    vw, vh = rect.width() / s, rect.height() / s
    x0 = clamp(cx * iw - vw / 2, 0, max(0, iw - vw)); y0 = clamp(cy * ih - vh / 2, 0, max(0, ih - vh))
    src = skia.Rect.MakeXYWH(x0, y0, vw, vh)
    p = skia.Paint(AntiAlias=True); p.setAlphaf(clamp(alpha))
    if cf is not None: p.setColorFilter(cf)
    if blur > 0.3: p.setImageFilter(skia.ImageFilters.Blur(blur, blur))
    if blend is not None: p.setBlendMode(blend)
    c.save(); c.clipRect(rect, doAntiAlias=True)
    if rot: c.rotate(rot, rect.centerX(), rect.centerY())
    if flip: c.scale(-1, 1); c.translate(-2 * rect.centerX(), 0)
    c.drawImageRect(img, src, rect, SAMP_CUBIC if s > 1.2 else SAMP, p)
    c.restore()

def print_card(c, img, x, y, w, h, rot=0.0, alpha=1.0, border=0.045, paper=PAPER, shadow=1.0, cx=0.5, cy=0.5, zoom=1.0,
               cf=None, blur=0.0, caption=None, cap_color=INK, lift=1.0):
    """Photograph as a physical print: paper border, soft contact + cast shadow, slight rotation."""
    if alpha <= 0.003: return
    b = w * border
    c.save(); c.translate(x, y); c.rotate(rot)
    outer = skia.Rect.MakeXYWH(-w / 2 - b, -h / 2 - b, w + 2 * b, h + 2 * b + (b * 2.2 if caption else 0))
    if shadow > 0:
        c.drawRect(outer.makeOffset(10 * lift, 26 * lift), paint(BLACK, 0.55 * alpha * shadow, blur=26 * lift))
        c.drawRect(outer.makeOffset(2, 5), paint(BLACK, 0.35 * alpha * shadow, blur=5))
    if border > 0: c.drawRect(outer, paint(paper, alpha))
    draw_cover(c, img, skia.Rect.MakeXYWH(-w / 2, -h / 2, w, h), cx, cy, zoom, alpha, cf=cf, blur=blur)
    if caption:
        draw_text(c, caption, 0, h / 2 + b * 2.0, max(18, min(25, int(b * 0.62))), 'mono', 500, cap_color, alpha * 0.85)
    c.restore()

def cf_matrix(m): return skia.ColorFilters.Matrix(m)
def cf_mono(tint=(1.0, 0.95, 0.86), contrast=1.1, lift=0.0):
    """warm archival monochrome"""
    r, g, b = tint; k = contrast
    lum = [0.299 * k, 0.587 * k, 0.114 * k]
    off = (1 - k) * 0.5 + lift
    return cf_matrix([lum[0] * r, lum[1] * r, lum[2] * r, 0, off,
                      lum[0] * g, lum[1] * g, lum[2] * g, 0, off,
                      lum[0] * b, lum[1] * b, lum[2] * b, 0, off,
                      0, 0, 0, 1, 0])
def cf_grade(sat=1.0, contrast=1.0, bright=0.0, warm=0.0):
    """gentle documentary grade (keeps skin tones natural): saturation, contrast, brightness, warm/cool shift"""
    s = sat; lr, lg, lb = 0.2126, 0.7152, 0.0722
    m = np.array([[lr * (1 - s) + s, lg * (1 - s), lb * (1 - s)],
                  [lr * (1 - s), lg * (1 - s) + s, lb * (1 - s)],
                  [lr * (1 - s), lg * (1 - s), lb * (1 - s) + s]]) * contrast
    off = (1 - contrast) * 0.5 + bright
    return cf_matrix([m[0, 0], m[0, 1], m[0, 2], 0, off + warm * 0.03,
                      m[1, 0], m[1, 1], m[1, 2], 0, off,
                      m[2, 0], m[2, 1], m[2, 2], 0, off - warm * 0.03,
                      0, 0, 0, 1, 0])
def cf_invert_mono(tint=(0.93, 0.89, 0.82)):
    r, g, b = tint
    return cf_matrix([-0.299 * r, -0.587 * r, -0.114 * r, 0, r,
                      -0.299 * g, -0.587 * g, -0.114 * g, 0, g,
                      -0.299 * b, -0.587 * b, -0.114 * b, 0, b,
                      0, 0, 0, 1, 0])

# ---------- post (numpy) ----------
_GRAIN = None
def grain(arr, amount=5.0, frame=0):
    global _GRAIN
    if _GRAIN is None:
        rng = np.random.default_rng(3)
        _GRAIN = [rng.normal(0, 1, (H // 2, W // 2)).astype(np.float32) for _ in range(6)]
    n = _GRAIN[frame % 6]
    n = np.repeat(np.repeat(n * amount, 2, 0), 2, 1)[..., None]
    rgbv = arr[..., :3]
    np.clip(rgbv.astype(np.int16) + n.astype(np.int16), 0, 255, out=rgbv, casting='unsafe')
    return arr

def new_surface():
    return skia.Surface(W, H)

def surface_array(surf):
    """RGBA uint8 copy of a raster surface"""
    img = surf.makeImageSnapshot()
    return np.array(img.toarray(colorType=skia.kRGBA_8888_ColorType))
