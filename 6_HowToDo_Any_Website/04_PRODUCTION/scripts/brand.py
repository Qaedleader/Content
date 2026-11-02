"""Paper Workshop brand toolkit (Python / skia port of D:/Content/_BRAND_SYSTEM/src/brand).

Same tokens, fonts, textures and component rules as the approved Remotion system (No Money V3),
re-implemented with skia + Pillow/raqm so the episode renders without local Node.js."""
import os, math, functools
import numpy as np, skia
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
BRAND = r'D:/Content/_BRAND_SYSTEM/public/brand'
FONT_DIR = BRAND + '/fonts'
TEX_DIR = BRAND + '/textures'

# ---------- tokens (copied from _BRAND_SYSTEM/src/brand/tokens.ts) ----------
YELLOW = '#F2B630'; YELLOW_SHADE = '#C98F12'; YELLOW_LIGHT = '#F8D27A'
PAPER = '#F4ECDD'; PAPER_SHADE = '#E6DAC4'; PAPER_WHITE = '#FBF8F1'
KRAFT = '#A57C52'; KRAFT_DARK = '#7A5A3A'
CHARCOAL = '#262321'; CHARCOAL_SOFT = '#3A3532'
NAVY = '#1F2C3F'; NAVY_DEEP = '#141E2D'; NAVY_LIGHT = '#2E4260'
TEAL = '#2F7C78'; TERRACOTTA = '#C65A3E'; SAGE = '#9FB08B'
STEEL = '#9AA5AE'; STEEL_DARK = '#5D6871'; WHITE = '#FFFFFF'; BLACK = '#000000'

SAFE_TITLE_Y = 205; SAFE_CAPTION_Y = 1395


def rgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def col(h, a=1.0):
    r, g, b = rgb(h); return skia.Color4f(r / 255, g / 255, b / 255, max(0.0, min(1.0, a)))


# ---------- time / easing ----------
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def lin(t, t0, t1): return clamp((t - t0) / max(1e-6, t1 - t0))
def lerp(a, b, x): return a + (b - a) * x
def ease_io(x): x = clamp(x); return x * x * (3 - 2 * x)
def ease_out(x): x = clamp(x); return 1 - (1 - x) ** 3
def ease_out5(x): x = clamp(x); return 1 - (1 - x) ** 5
def ease_in(x): x = clamp(x); return x ** 3
def ease_back(x, s=1.7): x = clamp(x); return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2


def spring(t, at, damping=11.0, stiffness=190.0, mass=0.7):
    """Remotion-style spring 0->1 (seconds), analytic damped oscillator, overshoots when under-damped."""
    if t < at: return 0.0
    x = t - at
    w0 = math.sqrt(stiffness / mass); z = damping / (2 * math.sqrt(stiffness * mass))
    if z < 1:
        wd = w0 * math.sqrt(1 - z * z)
        return 1 - math.exp(-z * w0 * x) * (math.cos(wd * x) + (z * w0 / wd) * math.sin(wd * x))
    return 1 - math.exp(-w0 * x) * (1 + w0 * x)


def pop(t, at, **kw): return spring(t, at, **{'damping': 12, 'stiffness': 320, 'mass': 0.55, **kw})


def env(t, t0, t1, fin=0.2, fout=0.2):
    if t < t0 or t > t1: return 0.0
    a = 1.0
    if fin > 0: a = min(a, ease_io((t - t0) / fin))
    if fout > 0: a = min(a, ease_io((t1 - t) / fout))
    return a


def rand(seed):
    """Deterministic hash -> [0,1)."""
    x = math.sin(seed * 12.9898 + 78.233) * 43758.5453
    return x - math.floor(x)


def boil(t, seed, amp, step=4):
    f = int(t * FPS) // step
    return (rand(f * 31 + seed) - 0.5) * 2 * amp


# ---------- paints / primitives ----------
def paint(color, a=1.0, stroke=0, blur=0, blend=None):
    p = skia.Paint(AntiAlias=True, Color4f=col(color, a) if isinstance(color, str) else color)
    if stroke:
        p.setStyle(skia.Paint.kStroke_Style); p.setStrokeWidth(stroke)
        p.setStrokeCap(skia.Paint.kRound_Cap); p.setStrokeJoin(skia.Paint.kRound_Join)
    if blur: p.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, blur))
    if blend is not None: p.setBlendMode(blend)
    return p


def rrect(x, y, w, h, r): return skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(x, y, w, h), r, r)


def shadow(c, rect_or_rr, dy=10, blur=12, a=0.32, r=4):
    """Contact + lifted shadow (approximation of SHADOW.lifted)."""
    rr = rect_or_rr if isinstance(rect_or_rr, skia.RRect) else skia.RRect.MakeRectXY(rect_or_rr, r, r)
    for (oy, bl, al) in ((dy, blur, a), (max(2, dy * 0.2), max(1.5, blur * 0.15), a * 1.05)):
        c.save(); c.translate(0, oy)
        c.drawRRect(rr, paint('#140E08', al, blur=bl)); c.restore()


SAMP = skia.SamplingOptions(skia.FilterMode.kLinear, skia.MipmapMode.kLinear)
SAMP_HQ = skia.SamplingOptions(skia.CubicResampler.Mitchell())


def to_sk(arr):
    if arr.shape[2] == 3:
        arr = np.concatenate([arr, np.full(arr.shape[:2] + (1,), 255, np.uint8)], 2)
    return skia.Image.fromarray(np.ascontiguousarray(arr), colorType=skia.kRGBA_8888_ColorType)


@functools.lru_cache(64)
def load_image(path, max_dim=2400):
    from PIL import ImageOps
    im = Image.open(path)
    im = ImageOps.exif_transpose(im).convert('RGBA')
    if max(im.size) > max_dim:
        s = max_dim / max(im.size); im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    return to_sk(np.array(im))


@functools.lru_cache(8)
def load_svg(path, size):
    d = skia.SVGDOM.MakeFromStream(skia.Stream.MakeFromFile(path))
    cs = d.containerSize(); sc = size / max(cs.width(), cs.height())
    surf = skia.Surface(int(cs.width() * sc) + 2, int(cs.height() * sc) + 2)
    cv = surf.getCanvas(); cv.clear(skia.ColorTRANSPARENT); cv.scale(sc, sc); d.render(cv)
    return surf.makeImageSnapshot()


@functools.lru_cache(4)
def texture(name):
    im = Image.open(os.path.join(TEX_DIR, name)).convert('RGBA')
    return to_sk(np.array(im))


def tex_paint(name, alpha=1.0, blend=skia.BlendMode.kMultiply, scale=1.0, ox=0, oy=0):
    img = texture(name)
    m = skia.Matrix.Scale(scale, scale); m.postTranslate(ox, oy)
    sh = img.makeShader(skia.TileMode.kRepeat, skia.TileMode.kRepeat, SAMP, m)
    p = skia.Paint(AntiAlias=True); p.setShader(sh); p.setAlphaf(alpha); p.setBlendMode(blend)
    return p


def draw_image_rect(c, img, dst, src=None, alpha=1.0, hq=True):
    p = skia.Paint(AntiAlias=True); p.setAlphaf(clamp(alpha))
    if src is None: src = skia.Rect.MakeWH(img.width(), img.height())
    c.drawImageRect(img, src, dst, SAMP_HQ if hq else SAMP, p)


def cover_src(img, w, h, cx=0.5, cy=0.5, zoom=1.0):
    iw, ih = img.width(), img.height()
    s = max(w / iw, h / ih) * zoom
    vw, vh = w / s, h / s
    x0 = clamp(cx * iw - vw / 2, 0, max(0, iw - vw)); y0 = clamp(cy * ih - vh / 2, 0, max(0, ih - vh))
    return skia.Rect.MakeXYWH(x0, y0, vw, vh), s


def cover_map(img, rect, cx=0.5, cy=0.5, zoom=1.0):
    """Function mapping normalised image coords -> canvas coords for a cover-fit image in rect."""
    src, s = cover_src(img, rect.width(), rect.height(), cx, cy, zoom)
    return lambda u, v: (rect.left() + (u * img.width() - src.left()) * s, rect.top() + (v * img.height() - src.top()) * s)


# ---------- typography (Pillow + raqm shaping -> skia image) ----------
FONTS = {'display': 'Alexandria.ttf', 'caption': 'BalooBhaijaan2.ttf', 'hero': 'Lalezar-Regular.ttf',
         'label': 'IBMPlexSansArabic-Bold.ttf', 'mono': 'JetBrainsMono.ttf'}
VARIABLE = {'display', 'caption', 'mono'}


@functools.lru_cache(128)
def _font(family, weight, size):
    f = ImageFont.truetype(os.path.join(FONT_DIR, FONTS[family]), size, layout_engine=ImageFont.Layout.RAQM)
    if family in VARIABLE: f.set_variation_by_axes([weight])
    return f


def is_rtl(txt): return any('\u0600' <= ch <= '\u06FF' for ch in txt)


@functools.lru_cache(2048)
def text_image(txt, size, family='display', weight=700, color=CHARCOAL):
    """Single line -> (skia.Image, ink_w, ink_h, pad). Arabic shaped RTL by raqm; Latin/digits LTR."""
    rtl = is_rtl(txt)
    f = _font(family, weight, int(size))
    kw = dict(direction='rtl', language='ar') if rtl else dict(direction='ltr', language='en')
    l, t, r, b = f.getbbox(txt, **kw)
    pad = int(size * 0.3)
    asc, desc = f.getmetrics()
    w = r - l + 2 * pad; h = asc + desc + 2 * pad
    im = Image.new('RGBA', (max(4, w), max(4, h)), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.text((pad - l, pad), txt, font=f, fill=rgb(color) + (255,), **kw)
    return to_sk(np.array(im)), r - l, asc + desc, pad


def text_w(txt, size, family='display', weight=700):
    return text_image(txt, size, family, weight, CHARCOAL)[1]


def draw_text(c, txt, x, y, size, family='display', weight=700, color=CHARCOAL, alpha=1.0, anchor='c', rot=0.0, scale=1.0):
    """y = vertical centre of the font box; anchor c / r (right edge at x) / l. Returns ink width."""
    if alpha <= 0.003 or not txt: return 0
    img, iw, ih, pad = text_image(txt, size, family, weight, color)
    w, h = img.width() * scale, img.height() * scale
    x0 = x - w / 2 if anchor == 'c' else (x - w + pad * scale if anchor == 'r' else x - pad * scale)
    c.save()
    if rot or scale != 1: c.rotate(rot, x, y)
    draw_image_rect(c, img, skia.Rect.MakeXYWH(x0, y - h / 2, w, h), alpha=alpha, hq=False)
    c.restore()
    return iw * scale


# ---------- brand components ----------
def paper_sheet(c, x, y, w, h, color=PAPER_WHITE, seed=1, r=4, shadow_a=0.3, dy=8, blur=10, fibre=0.55):
    rr = rrect(x, y, w, h, r)
    if shadow_a > 0: shadow(c, rr, dy=dy, blur=blur, a=shadow_a)
    c.drawRRect(rr, paint(color))
    c.save(); c.clipRRect(rr, doAntiAlias=True)
    c.drawRect(skia.Rect.MakeXYWH(x, y, w, h), tex_paint('paper_fibers.png', fibre, skia.BlendMode.kMultiply, 0.5, seed * 97 % 512, seed * 53 % 512))
    c.restore()


def bg_cream(c, t, grid=True):
    c.drawRect(skia.Rect.MakeWH(W, H), paint('#EFE7D8'))
    c.drawRect(skia.Rect.MakeWH(W, H), tex_paint('paper_grain.png', 0.55, skia.BlendMode.kMultiply))
    if grid:
        p = paint(NAVY_LIGHT, 0.075, stroke=2)
        for gx in range(0, W + 1, 45): c.drawLine(gx, 0, gx, H, p)
        for gy in range(0, H + 1, 45): c.drawLine(0, gy, W, gy, p)
    light = skia.GradientShader.MakeRadial(skia.Point(W / 2, H * 0.3), H * 0.6,
                                           [col('#FFF8E6', 0.35).toColor(), col('#FFF8E6', 0).toColor()])
    pp = skia.Paint(); pp.setShader(light); c.drawRect(skia.Rect.MakeWH(W, H), pp)


def bg_navy(c, t, grid=True):
    c.drawRect(skia.Rect.MakeWH(W, H), paint(NAVY))
    if grid:
        p = paint('#FFFFFF', 0.045, stroke=2)
        for gx in range(0, W + 1, 45): c.drawLine(gx, 0, gx, H, p)
        for gy in range(0, H + 1, 45): c.drawLine(0, gy, W, gy, p)
    light = skia.GradientShader.MakeRadial(skia.Point(W / 2, H * 0.3), H * 0.62,
                                           [col('#FFF8E6', 0.13).toColor(), col('#FFF8E6', 0).toColor()])
    pp = skia.Paint(); pp.setShader(light); c.drawRect(skia.Rect.MakeWH(W, H), pp)
    c.drawRect(skia.Rect.MakeWH(W, H), tex_paint('paper_grain.png', 0.35, skia.BlendMode.kMultiply))


def floor(c, y, color=KRAFT, edge=KRAFT_DARK):
    g = skia.GradientShader.MakeLinear([skia.Point(0, y - 30), skia.Point(0, y)], [col(BLACK, 0).toColor(), col(BLACK, 0.22).toColor()])
    p = skia.Paint(); p.setShader(g); c.drawRect(skia.Rect.MakeXYWH(0, y - 30, W, 30), p)
    c.drawRect(skia.Rect.MakeXYWH(0, y, W, H - y), paint(color))
    c.drawRect(skia.Rect.MakeXYWH(0, y, W, H - y), tex_paint('kraft.png', 0.9, skia.BlendMode.kMultiply, 0.75))
    c.drawRect(skia.Rect.MakeXYWH(0, y, W, 14), paint(edge, 0.85))


def grade(c, t):
    """PaperGrade: fine grain + soft vignette over everything."""
    c.drawRect(skia.Rect.MakeWH(W, H), tex_paint('paper_grain.png', 0.16, skia.BlendMode.kMultiply, 1.0,
                                                 (int(t * FPS) // 3 * 37) % 300, (int(t * FPS) // 3 * 61) % 300))
    g = skia.GradientShader.MakeRadial(skia.Point(W / 2, H * 0.47), H * 0.68, [col(BLACK, 0).toColor(), col(BLACK, 0.30).toColor()], [0.5, 1.0])
    p = skia.Paint(); p.setShader(g); c.drawRect(skia.Rect.MakeWH(W, H), p)


def title_card(c, t, at, text, out=None, y=SAFE_TITLE_Y, size=52, seed=5, accent=YELLOW):
    """Index-card headline: ruled card, red margin line, yellow binder clip; drops in on a spring."""
    if t < at - 0.05: return
    p = spring(t, at, 13, 210, 0.8)
    o = ease_in(lin(t, out, out + 0.2)) if out is not None else 0
    if o >= 1: return
    tw = text_w(text, size, 'display', 800)
    w = clamp(tw + 108, 520, 960); h = size * 1.3 + 48
    x = W / 2 - w / 2; yy = y - h / 2
    rot = (rand(seed) - 0.5) * 3.2 + (1 - p) * -6
    c.save()
    c.translate(0, (1 - p) * -260 - o * 260); c.rotate(rot, W / 2, y)
    paper_sheet(c, x, yy, w, h, PAPER_WHITE, seed, r=5, shadow_a=0.34, dy=18, blur=16, fibre=0.6)
    c.save(); c.clipRect(skia.Rect.MakeXYWH(x, yy, w, h))
    lp = paint(NAVY_LIGHT, 0.16, stroke=2)
    gy = yy + 14 + 33
    while gy < yy + h: c.drawLine(x, gy, x + w, gy, lp); gy += 35
    c.drawRect(skia.Rect.MakeXYWH(x, yy + 16, w, 3), paint(TERRACOTTA, 0.55))
    c.restore()
    draw_text(c, text, W / 2, y + 2, size, 'display', 800, CHARCOAL)
    # binder clip
    cx = x + w - 34 - 64
    c.drawRRect(rrect(cx + 10, yy - 42, 44, 30, 9), paint(STEEL_DARK, 1, stroke=5))
    shadow(c, rrect(cx, yy - 26, 64, 46, 5), dy=3, blur=4, a=0.3)
    c.drawRRect(rrect(cx, yy - 26, 64, 46, 5), paint(accent))
    c.restore()


def paper_word(c, cx, cy, text, size, bg=PAPER, fg=CHARCOAL, seed=1, scale=1.0, rot=0.0, family='caption', weight=800):
    """Caption unit: one word on its own strip of paper."""
    fam = family if is_rtl(text) or family != 'caption' else 'display'
    img, iw, ih, pad = text_image(text, size, fam, weight if fam != 'display' else 800, fg)
    padx, ptop, pbot = size * 0.36, size * 0.10, size * 0.16
    w = iw + 2 * padx; h = size * 1.25 + ptop + pbot
    c.save(); c.translate(cx, cy); c.rotate(rot); c.scale(scale, scale)
    r = 3 + rand(seed) * 4
    paper_sheet(c, -w / 2, -h / 2, w, h, bg, seed, r=r, shadow_a=0.36, dy=6, blur=6, fibre=0.5)
    th = img.height()
    draw_image_rect(c, img, skia.Rect.MakeXYWH(-img.width() / 2, -th / 2 + size * 0.02, img.width(), th), hq=False)
    c.restore()
    return w


def word_w(text, size, family='caption'):
    fam = family if is_rtl(text) or family != 'caption' else 'display'
    return text_w(text, size, fam, 800) + 2 * size * 0.36


def credit(c, x_right, y, kind, text, size=19, alpha=1.0):
    """Evidence credit: dark tag, yellow kind (Arabic) + source (Latin)."""
    if alpha <= 0: return
    kw = text_w(kind, size, 'label', 700); sw = text_w(text, size, 'display', 600)
    w = kw + sw + 8 + 20; h = size * 1.55
    x = x_right - w
    c.drawRRect(rrect(x, y - h / 2, w, h, 4), paint(CHARCOAL, 0.84 * alpha))
    draw_text(c, kind, x_right - 10, y, size, 'label', 700, YELLOW, alpha, 'r')
    draw_text(c, text, x + 10, y, size, 'display', 600, PAPER, alpha * 0.92, 'l')


def badge(c, cx, cy, text, color=TERRACOTTA, size=26, rot=-3, alpha=1.0, scale=1.0, bg='#FBF8F1'):
    """Rubber-stamp badge (e.g. «رسم توضيحي»)."""
    if alpha <= 0: return
    tw = text_w(text, size, 'label', 700)
    w = tw + size * 0.42 + 10 + 32; h = size * 1.3 + 14
    c.save(); c.translate(cx, cy); c.rotate(rot); c.scale(scale, scale)
    shadow(c, rrect(-w / 2, -h / 2, w, h, 8), dy=3, blur=4, a=0.3 * alpha)
    c.drawRRect(rrect(-w / 2, -h / 2, w, h, 8), paint(bg, 0.94 * alpha))
    c.drawRRect(rrect(-w / 2, -h / 2, w, h, 8), paint(color, alpha, stroke=3.5))
    c.drawCircle(w / 2 - 16 - size * 0.21, 0, size * 0.21, paint(color, alpha))
    draw_text(c, text, w / 2 - 16 - size * 0.42 - 10, 1, size, 'label', 700, color, alpha, 'r')
    c.restore()


def label(c, cx, cy, text, size=30, bg=PAPER_WHITE, fg=CHARCOAL, rot=0.0, seed=1, family='display', weight=700, alpha=1.0, scale=1.0):
    if alpha <= 0: return 0
    img, iw, ih, pad = text_image(text, size, family, weight, fg)
    w = iw + size * 0.84; h = size * 1.25 + size * 0.38
    c.save(); c.translate(cx, cy); c.rotate(rot); c.scale(scale, scale)
    if alpha < 1: c.saveLayerAlpha(None, int(alpha * 255))
    paper_sheet(c, -w / 2, -h / 2, w, h, bg, seed, r=3, shadow_a=0.28, dy=4, blur=4, fibre=0.45)
    draw_image_rect(c, img, skia.Rect.MakeXYWH(-img.width() / 2, -img.height() / 2 + size * 0.03, img.width(), img.height()), hq=False)
    if alpha < 1: c.restore()
    c.restore()
    return w


def torn_strip(c, x, y, w, h, color, seed=3, rot=0.0):
    """Paper strip with irregular torn top/bottom edges (behind hero words)."""
    path = skia.Path(); n = 18
    path.moveTo(x, y + (rand(seed) - 0.5) * 8)
    for i in range(1, n + 1):
        path.lineTo(x + w * i / n, y + (rand(seed + i) - 0.5) * 10)
    for i in range(n, -1, -1):
        path.lineTo(x + w * i / n, y + h + (rand(seed + 40 + i) - 0.5) * 10)
    path.close()
    c.save(); c.rotate(rot, x + w / 2, y + h / 2)
    c.save(); c.translate(0, 6); c.drawPath(path, paint('#140E08', 0.3, blur=6)); c.restore()
    c.drawPath(path, paint(color))
    c.save(); c.clipPath(path, doAntiAlias=True)
    c.drawRect(skia.Rect.MakeXYWH(x - 10, y - 10, w + 20, h + 20), tex_paint('paper_fibers.png', 0.5, skia.BlendMode.kMultiply, 0.5, seed * 31, seed * 17))
    c.restore(); c.restore()


def hero_word(c, cx, cy, text, size, face=YELLOW, back=CHARCOAL, depth=9, family='hero', weight=400, alpha=1.0, scale=1.0, rot=0.0, strip=None, seed=3):
    """Two-layer paper-cut hero word (+ optional torn strip behind)."""
    if alpha <= 0: return
    img_f, iw, ih, pad = text_image(text, size, family, weight, face)
    img_b = text_image(text, size, family, weight, back)[0] if back else None
    c.save(); c.translate(cx, cy); c.rotate(rot); c.scale(scale, scale)
    if alpha < 1: c.saveLayerAlpha(None, int(alpha * 255))
    if strip:
        sw = iw + size * 0.56; sh = size * 0.95
        torn_strip(c, -sw / 2, -sh / 2 + size * 0.06, sw, sh, strip, seed, (rand(seed) - 0.5) * 3)
    w, h = img_f.width(), img_f.height()
    if back:
        c.save(); c.translate(depth * 0.45, depth)
        draw_image_rect(c, img_b, skia.Rect.MakeXYWH(-w / 2, -h / 2, w, h), hq=False); c.restore()
    draw_image_rect(c, img_f, skia.Rect.MakeXYWH(-w / 2, -h / 2, w, h), hq=False)
    if alpha < 1: c.restore()
    c.restore()


def tape(c, x, y, rot, w=120):
    c.save(); c.rotate(rot, x, y)
    r = skia.Rect.MakeXYWH(x - w / 2, y - 18, w, 36)
    c.drawRect(r, paint('#ECDEBA', 0.78))
    c.save(); c.clipRect(r); c.drawRect(r, tex_paint('paper_fibers.png', 0.6, skia.BlendMode.kMultiply, 0.25)); c.restore()
    c.restore()


def print_frame(c, x, y, w, h, draw_content, rot=0.0, border=16, seed=1, tape_on=True, alpha=1.0):
    """Taped photo print. draw_content(c, inner_rect) draws the media clipped to the window."""
    if alpha <= 0: return
    c.save(); c.rotate(rot, x + w / 2, y + h / 2)
    if alpha < 1: c.saveLayerAlpha(None, int(alpha * 255))
    paper_sheet(c, x, y, w, h, PAPER_WHITE, seed, r=3, shadow_a=0.32, dy=20, blur=18, fibre=0.5)
    inner = skia.Rect.MakeXYWH(x + border, y + border, w - 2 * border, h - 2 * border)
    c.save(); c.clipRect(inner, doAntiAlias=True)
    c.drawRect(inner, paint('#111111'))
    draw_content(c, inner)
    g = skia.GradientShader.MakeLinear([skia.Point(inner.left(), inner.top()), skia.Point(inner.left() + inner.width() * 0.6, inner.top() + inner.height() * 0.5)],
                                       [col(WHITE, 0.10).toColor(), col(WHITE, 0).toColor()])
    p = skia.Paint(); p.setShader(g); c.drawRect(inner, p)
    for i in range(3):   # inner shadow
        c.drawRect(inner.makeInset(i * 2, i * 2), paint(BLACK, 0.12, stroke=6, blur=8))
    c.restore()
    if tape_on:
        tape(c, x + w * 0.22, y + 2, -7 + rand(seed) * 6)
        tape(c, x + w * 0.8, y + 4, 5 + rand(seed + 1) * 5)
    if alpha < 1: c.restore()
    c.restore()


def cover_draw(img, cx=0.5, cy=0.5, zoom=1.0):
    def f(c, r):
        src, s = cover_src(img, r.width(), r.height(), cx, cy, zoom)
        draw_image_rect(c, img, r, src)
    return f


def pixel_squares(c, x, y, n, cols, size, gap, filled, color=YELLOW, empty=NAVY_LIGHT, empty_a=0.6, rtl=True):
    for i in range(n):
        r, k = divmod(i, cols)
        px = x + ((cols - 1 - k) if rtl else k) * (size + gap); py = y + r * (size + gap)
        on = i < filled
        c.drawRect(skia.Rect.MakeXYWH(px, py, size, size), paint(color if on else empty, 1.0 if on else empty_a))
        if on: c.drawRect(skia.Rect.MakeXYWH(px, py + size - 5, size, 5), paint(YELLOW_SHADE))


def pixel_cursor(c, x, y, s=4, color=CHARCOAL, fill_c=PAPER_WHITE):
    """Y2K pixel arrow cursor (12x19 grid)."""
    rows = ['X', 'XX', 'XOX', 'XOOX', 'XOOOX', 'XOOOOX', 'XOOOOOX', 'XOOOOOOX', 'XOOOOOOOX', 'XOOOOOOOOX',
            'XOOOOOXXXXX', 'XOOXOOX', 'XOX XOOX', 'XX  XOOX', 'X    XOOX', '     XOOX', '      XX']
    for j, row in enumerate(rows):
        for i, ch in enumerate(row):
            if ch == 'X': c.drawRect(skia.Rect.MakeXYWH(x + i * s, y + j * s, s, s), paint(color))
            elif ch == 'O': c.drawRect(skia.Rect.MakeXYWH(x + i * s, y + j * s, s, s), paint(fill_c))


def corner_brackets(c, r, color=YELLOW, L=46, th=8, a=1.0):
    p = paint(color, a)
    x0, y0, x1, y1 = r.left(), r.top(), r.right(), r.bottom()
    for (x, y, dx, dy) in ((x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)):
        c.drawRect(skia.Rect.MakeLTRB(min(x, x + dx * L), min(y, y + dy * th), max(x, x + dx * L), max(y, y + dy * th)), p)
        c.drawRect(skia.Rect.MakeLTRB(min(x, x + dx * th), min(y, y + dy * L), max(x, x + dx * th), max(y, y + dy * L)), p)


def dashed_path(c, path, color, width, a=1.0, on=18, off=12, phase=0.0, trim=1.0):
    p = paint(color, a, stroke=width)
    if trim < 1.0:
        meas = skia.PathMeasure(path, False); L = meas.getLength()
        seg = skia.Path(); meas.getSegment(0, L * clamp(trim), seg, True); path = seg
    p.setPathEffect(skia.DashPathEffect.Make([on, off], phase))
    c.drawPath(path, p)
