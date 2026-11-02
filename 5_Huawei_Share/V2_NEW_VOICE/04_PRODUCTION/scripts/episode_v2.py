"""Huawei Share (video 5) - NEW VOICE re-edit: narration-locked timeline, captions and scenes.

Same Paper Workshop toolkit and caption system as Video 4 / Video 5 (brand.py copied unchanged). Paper props are
carried over from the V1 composition (04_PRODUCTION/scripts/episode.py); scenes are rebuilt for the new recording
«Huawei share New Vid.m4a». All times are narration seconds from 02_TIMING/words_display.json. The m4a's edit list
skips the 2112 priming samples, so the narration starts at presentation 0:  t = f / 30.

Footage frames are the V1 extractions in 5_Huawei_Share/03_MEDIA/frames (official Huawei product-page films, see
03_MEDIA/ASSET_SOURCES.md); they are read, never modified."""
import os, json, functools, glob, math
import skia
from brand import *

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(os.path.dirname(HERE))                         # V2_NEW_VOICE
FR = os.path.join(os.path.dirname(PROJ), '03_MEDIA', 'frames')        # V1 frame extractions (read-only use)

AUDIO_PTS = 0.0
N_FRAMES = 1380          # 46.000 s >= 45.997 s of decoded narration (last frame holds; audio untouched)

WORDS = json.load(open(os.path.join(PROJ, '02_TIMING', 'words_display.json'), encoding='utf-8'))
WD = WORDS['tokens']
CHUNKS = WORDS['chunks']


def tw(i): return WD[i]['s']


# ---------------------------------------------------------------- media access
@functools.lru_cache(16)
def _frame_files(key): return sorted(glob.glob(os.path.join(FR, key, '*.*')))


@functools.lru_cache(40)
def _frame(key, i): return load_image(_frame_files(key)[i], 3000)


def clip(key, tl):
    files = _frame_files(key)
    return _frame(key, max(0, min(len(files) - 1, int(max(0.0, tl) * FPS + 1e-6))))


def clip_len(key): return len(_frame_files(key)) / FPS


DINO = os.path.join(FR, 'dino_card.png')

SRC = {'pura': 'HUAWEI Pura 80 Ultra', 'm70': 'HUAWEI Mate 70', 'm80': 'HUAWEI Mate 80'}
PRINT = (40, 400, 1000, 750)          # Video 4 rev 2 print geometry
PRINT_BIG = (24, 372, 1032, 774)      # opening / hook print (inner 1000x742 < 1160x870 clip frames)


def sat_filter(s):
    """Saturation colour matrix (s = 1 unchanged, 0 grey)."""
    r, g, b = 0.2126, 0.7152, 0.0722
    m = [r * (1 - s) + s, g * (1 - s), b * (1 - s), 0, 0,
         r * (1 - s), g * (1 - s) + s, b * (1 - s), 0, 0,
         r * (1 - s), g * (1 - s), b * (1 - s) + s, 0, 0,
         0, 0, 0, 1, 0]
    return skia.ColorFilters.Matrix(m)


def media_draw(img, cx=0.5, cy=0.5, zoom=1.0, sat=1.0):
    def f(c, r):
        src, s = cover_src(img, r.width(), r.height(), cx, cy, zoom)
        p = skia.Paint(AntiAlias=True)
        if sat < 0.999: p.setColorFilter(sat_filter(sat))
        c.drawImageRect(img, src, r, SAMP_HQ, p)
    return f


def inner_of(rect, border=16):
    x, y, w, h = rect
    return skia.Rect.MakeXYWH(x + border, y + border, w - 2 * border, h - 2 * border)


def footage(c, t, key, tl, st, rect=PRINT, seed=3, rot=-0.8, credit_on=True, cx=0.5, cy=0.5, zoom=1.0, sat=1.0,
            shake=0.0, img=None):
    """Taped evidence print of official footage with a small 'thump' on each cut. Returns u,v -> canvas mapper."""
    x, y, w, h = rect
    thump = 1 + 0.02 * (1 - ease_out(lin(t, st, st + 0.18)))
    im = img or clip(key, tl)
    c.save()
    if shake: c.translate(boil(t, 7, shake, 1), boil(t, 9, shake, 1))
    c.translate(x + w / 2, y + h / 2); c.scale(thump, thump); c.translate(-(x + w / 2), -(y + h / 2))
    print_frame(c, x, y, w, h, media_draw(im, cx, cy, zoom, sat), rot=rot, seed=seed)
    c.restore()
    if credit_on:
        credit(c, x + w - 10, y + h + 28, 'فيديو رسمي', SRC[key.split('_')[0]])
    return cover_map(im, inner_of(rect), cx, cy, zoom)


# ---------------------------------------------------------------- captions (Video 4 system)
def caption_track(c, t):
    lead = 1 / FPS
    active = None
    for k, (a, b) in enumerate(CHUNKS):
        start = WD[a]['s'] - lead
        nxt = WD[CHUNKS[k + 1][0]]['s'] - lead - 1 / FPS if k + 1 < len(CHUNKS) else 1e9
        end = min(nxt, WD[b]['e'] + 14 / FPS)
        if k + 1 == len(CHUNKS): end = 1e9          # last line stays to the final frame
        if start <= t <= end: active = (a, b)
    if not active: return
    a, b = active
    idx = list(range(a, b + 1))
    chars = sum(len(WD[i]['w']) for i in idx) + len(idx)
    size = 58 if chars > 22 else 64 if chars > 16 else 70
    gap = 12
    widths = [word_w(WD[i]['w'], size) for i in idx]
    while sum(widths) + gap * (len(idx) - 1) > 1000:      # never wider than the safe zone
        size -= 4; widths = [word_w(WD[i]['w'], size) for i in idx]
    total = sum(widths) + gap * (len(idx) - 1)
    x = W / 2 + total / 2           # RTL: first word at the right
    for i, w in zip(idx, widths):
        cx = x - w / 2; x -= w + gap
        at = WD[i]['s'] - lead
        if t < at: continue
        p = pop(t, at)
        r = (rand(i * 7 + 3) - 0.5) * 6; dy = (rand(i * 13 + 5) - 0.5) * 14
        hi = WD[i].get('hi', False)
        paper_word(c, cx, SAFE_CAPTION_Y + dy + (1 - p) * 24, WD[i]['w'], size, YELLOW if hi else PAPER, CHARCOAL,
                   seed=i + 11, scale=0.55 + 0.45 * p, rot=r + (1 - p) * 8)


# ---------------------------------------------------------------- paper props (from the V1 composition)
def rr_path(x, y, w, h, r):
    p = skia.Path(); p.addRRect(rrect(x, y, w, h, r)); return p


def hand(c, cx, cy, s, k=0.0, rot=0.0, fill=PAPER_WHITE, ink=CHARCOAL, cuff=NAVY_LIGHT, alpha=1.0, shadow_on=True):
    """Paper cut-out hand seen from the back. k = 0 open palm ... 1 closed fist. (cx, cy) = palm centre."""
    if alpha <= 0: return
    k = clamp(k)
    parts = []
    parts.append(('w', rr_path(-0.30, 0.50, 0.60, 0.55, 0.06)))
    parts.append(('p', rr_path(-0.50, -0.20 + 0.10 * k, 1.00, 0.80 - 0.10 * k, 0.24)))
    L = [0.46, 0.60, 0.56, 0.44]
    for j, xc in enumerate((-0.36, -0.12, 0.12, 0.36)):
        top = -0.12 - L[j] * (1 - k) - 0.10 * k + 0.10 * k * k
        parts.append(('f', rr_path(xc - 0.105, top, 0.21, 0.18 - top, 0.105)))
    th = skia.Path()
    if k < 0.5:
        th.addRRect(rrect(-0.11, -0.42 * (1 - k), 0.22, 0.48 * (1 - k) + 0.12, 0.11))
        m = skia.Matrix.RotateDeg(-48 + 40 * k); m.postTranslate(-0.50, 0.30)
        th.transform(m)
    else:
        th.addRRect(rrect(-0.46, 0.06, 0.56, 0.22, 0.11))
    parts.append(('t', th))
    c.save(); c.translate(cx, cy); c.rotate(rot); c.scale(s, s)
    if alpha < 1: c.saveLayerAlpha(None, int(alpha * 255))
    ow = 7 / s
    if shadow_on:
        c.save(); c.translate(0.03, 0.06)
        for _, p in parts: c.drawPath(p, paint('#140E08', 0.28, blur=10 / s))
        c.restore()
    for _, p in parts: c.drawPath(p, paint(ink, 1, stroke=2 * ow))
    for kind, p in parts:
        c.drawPath(p, paint(cuff if kind == 'w' else fill))
    if k > 0.6:
        a = (k - 0.6) / 0.4
        for xc in (-0.24, 0.0, 0.24):
            c.drawLine(xc, -0.05, xc, 0.08, paint(ink, 0.5 * a, stroke=ow * 0.6))
    c.drawRect(skia.Rect.MakeLTRB(-0.30, 0.56, 0.30, 0.62), paint(ink, 0.25))
    if alpha < 1: c.restore()
    c.restore()


def phone(c, cx, cy, h, screen=None, rot=0.0, alpha=1.0, glow=0.0, cam_glow=0.0):
    """Paper cut-out phone. screen(c, rect) draws the screen content (clipped)."""
    if alpha <= 0: return None
    w = h * 0.49
    c.save(); c.translate(cx, cy); c.rotate(rot)
    if alpha < 1: c.saveLayerAlpha(None, int(alpha * 255))
    if glow > 0:
        c.drawRRect(rrect(-w / 2 - 14, -h / 2 - 14, w + 28, h + 28, h * 0.1), paint(YELLOW, 0.55 * glow, blur=26))
    body = rrect(-w / 2, -h / 2, w, h, h * 0.085)
    shadow(c, body, dy=16, blur=16, a=0.38)
    c.drawRRect(body, paint(CHARCOAL))
    c.drawRRect(rrect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, h * 0.08), paint(CHARCOAL_SOFT, 1, stroke=3))
    inset = h * 0.03
    sr = skia.Rect.MakeXYWH(-w / 2 + inset, -h / 2 + inset, w - 2 * inset, h - 2 * inset)
    srr = skia.RRect.MakeRectXY(sr, h * 0.06, h * 0.06)
    c.save(); c.clipRRect(srr, doAntiAlias=True)
    c.drawRect(sr, paint(NAVY_DEEP))
    if screen: screen(c, sr)
    c.restore()
    cam = (0, -h / 2 + inset + h * 0.035)
    c.drawCircle(*cam, h * 0.014, paint('#0B0F16'))
    if cam_glow > 0:
        c.drawCircle(*cam, h * 0.03 + 6 * cam_glow, paint(YELLOW, 0.9 * cam_glow, stroke=4))
    if alpha < 1: c.restore()
    c.restore()
    return sr


def phone_cam(cx, cy, h): return (cx, cy - h / 2 + h * 0.03 + h * 0.035)


def screen_home(c, r, a=1.0):
    g = skia.GradientShader.MakeLinear([skia.Point(r.left(), r.top()), skia.Point(r.right(), r.bottom())],
                                       [col(NAVY_LIGHT).toColor(), col(NAVY_DEEP).toColor()])
    p = skia.Paint(); p.setShader(g); c.drawRect(r, p)
    s = r.width() / 4.6
    for i in range(12):
        row, k = divmod(i, 4)
        x = r.left() + s * 0.35 + k * s * 1.07; y = r.top() + r.height() * 0.42 + row * s * 1.12
        c.drawRRect(rrect(x, y, s * 0.78, s * 0.78, s * 0.2), paint([STEEL, SAGE, TEAL, PAPER_SHADE][(i * 7) % 4], 0.55 * a))


def screen_dino(c, r, k=1.0, lift=0.0):
    """The dinosaur picture from the official Mate 70 film, as the shared file on screen."""
    screen_home(c, r, 0.5)
    if k <= 0: return
    img = load_image(DINO, 900)
    w = r.width() * (0.86 - 0.14 * lift) * (0.6 + 0.4 * k); h = w * img.height() / img.width()
    x = r.centerX() - w / 2; y = r.centerY() - h / 2 - lift * r.height() * 0.06
    rr_ = rrect(x, y, w, h, w * 0.08)
    if lift > 0:
        c.drawRRect(rrect(x - 6, y - 6, w + 12, h + 12, w * 0.09), paint(YELLOW, 0.9 * lift, blur=14))
    c.save(); c.clipRRect(rr_, doAntiAlias=True)
    draw_image_rect(c, img, skia.Rect.MakeXYWH(x, y, w, h), alpha=k)
    c.restore()


def file_card(c, cx, cy, w, rot=0.0, alpha=1.0, glow=0.0, ghost=False):
    """The picture as a file card in flight (same dinosaur image)."""
    if alpha <= 0: return
    img = load_image(DINO, 900)
    h = w * img.height() / img.width()
    c.save(); c.translate(cx, cy); c.rotate(rot)
    if alpha < 1: c.saveLayerAlpha(None, int(alpha * 255))
    if glow > 0: c.drawCircle(0, 0, w * 0.9, paint(YELLOW, 0.35 * glow, blur=30))
    if ghost:
        rr_ = rrect(-w / 2, -h / 2, w, h, w * 0.08)
        c.save(); c.clipRRect(rr_, doAntiAlias=True)
        draw_image_rect(c, img, skia.Rect.MakeXYWH(-w / 2, -h / 2, w, h), alpha=0.35)
        c.restore()
        p = paint(CHARCOAL, 0.8, stroke=5); p.setPathEffect(skia.DashPathEffect.Make([14, 10], 0))
        c.drawRRect(rr_, p)
    else:
        shadow(c, rrect(-w / 2 - 8, -h / 2 - 8, w + 16, h + 16, w * 0.09), dy=10, blur=10, a=0.35)
        c.drawRRect(rrect(-w / 2 - 8, -h / 2 - 8, w + 16, h + 16, w * 0.09), paint(PAPER_WHITE))
        rr_ = rrect(-w / 2, -h / 2, w, h, w * 0.07)
        c.save(); c.clipRRect(rr_, doAntiAlias=True)
        draw_image_rect(c, img, skia.Rect.MakeXYWH(-w / 2, -h / 2, w, h)); c.restore()
    if alpha < 1: c.restore()
    c.restore()


def tray_icon(c, cx, cy, s, up=True, color=CHARCOAL):
    p = paint(color, 1, stroke=s * 0.13)
    tray = skia.Path(); tray.moveTo(cx - s * 0.45, cy + s * 0.05); tray.lineTo(cx - s * 0.45, cy + s * 0.42)
    tray.lineTo(cx + s * 0.45, cy + s * 0.42); tray.lineTo(cx + s * 0.45, cy + s * 0.05)
    c.drawPath(tray, p)
    c.drawLine(cx, cy - s * 0.5, cx, cy + s * 0.18, p)
    hy, d = (cy - s * 0.5, 1) if up else (cy + s * 0.18, -1)
    ar = skia.Path(); ar.moveTo(cx - s * 0.26, hy + d * s * 0.26); ar.lineTo(cx, hy); ar.lineTo(cx + s * 0.26, hy + d * s * 0.26)
    c.drawPath(ar, p)


def action_button(c, cx, cy, text, up=True, press=0.0, scale=1.0, alpha=1.0, color=YELLOW, shade=YELLOW_SHADE, size=50, sx=1.0):
    """Chunky paper push-button «إرسال» / «استقبال»: face drops onto its base when pressed. sx = flip width."""
    if alpha <= 0 or scale <= 0.01 or sx <= 0.01: return
    tw_ = text_w(text, size, 'display', 800)
    w = tw_ + size * 1.25 + 70; h = size * 1.9; depth = 14
    c.save(); c.translate(cx, cy); c.scale(scale * sx, scale)
    if alpha < 1: c.saveLayerAlpha(None, int(alpha * 255))
    shadow(c, rrect(-w / 2, -h / 2 + depth, w, h, h / 2), dy=8, blur=10, a=0.35)
    c.drawRRect(rrect(-w / 2, -h / 2 + depth, w, h, h / 2), paint(shade))
    dy = depth * clamp(press)
    c.drawRRect(rrect(-w / 2, -h / 2 + dy, w, h, h / 2), paint(color))
    c.save(); c.clipRRect(rrect(-w / 2, -h / 2 + dy, w, h, h / 2), doAntiAlias=True)
    c.drawRect(skia.Rect.MakeXYWH(-w / 2, -h / 2 + dy, w, h), tex_paint('paper_fibers.png', 0.5, skia.BlendMode.kMultiply, 0.5))
    c.restore()
    c.drawRRect(rrect(-w / 2, -h / 2 + dy, w, h, h / 2), paint(CHARCOAL, 0.9, stroke=4))
    draw_text(c, text, w / 2 - 34, dy + 2, size, 'display', 800, CHARCOAL, anchor='r')
    tray_icon(c, -w / 2 + 34 + size * 0.5, dy, size * 0.95, up)
    if alpha < 1: c.restore()
    c.restore()
    return w


def wifi_glyph(c, cx, cy, s, color=YELLOW, k=1.0, a=1.0):
    c.drawCircle(cx, cy, s * 0.09, paint(color, a))
    for j in range(3):
        if k < (j + 1) / 3 - 0.2: break
        r = s * (0.33 + 0.3 * j)
        c.drawArc(skia.Rect.MakeLTRB(cx - r, cy - r, cx + r, cy + r), -135, 90, False, paint(color, a, stroke=s * 0.12))


def chip(c, cx, cy, text, size=30, bg=PAPER_WHITE, fg=CHARCOAL, rot=0.0, seed=1, t=None, at=None, family='display', out=None):
    if t is not None and at is not None:
        if t < at - 0.02: return
        q = pop(t, at)
        o = 1 - ease_in(lin(t, out, out + 0.18)) if out is not None else 1
        if o <= 0: return
        return label(c, cx, cy, text, size, bg, fg, rot=rot, seed=seed, scale=(0.5 + 0.5 * q) * (0.6 + 0.4 * o), alpha=min(1, q * 2) * o, family=family)
    return label(c, cx, cy, text, size, bg, fg, rot=rot, seed=seed, family=family)


def wireless_arc(c, a, b, lift, t, k=1.0, color=YELLOW, width=7, alpha=1.0):
    path = skia.Path(); path.moveTo(*a)
    mx = (a[0] + b[0]) / 2; my = min(a[1], b[1]) - lift
    path.quadTo(mx, my, *b)
    dashed_path(c, path, color, width, alpha, 18, 14, -(t * 70) % 32, trim=k)
    return path


def along(path, u):
    meas = skia.PathMeasure(path, False); pos, _ = meas.getPosTan(meas.getLength() * clamp(u)); return pos.x(), pos.y()


def cross(c, cx, cy, L, q, a=1.0, color=TERRACOTTA, width=22):
    L = L * (0.5 + 0.5 * q)
    c.drawLine(cx - L, cy - L, cx + L, cy + L, paint(color, a, stroke=width))
    c.drawLine(cx + L, cy - L, cx - L, cy + L, paint(color, a, stroke=width))


# ---------------------------------------------------------------- new V2 props
def gesture_tag(c, t, at, x, y, text, k_hand, bg=PAPER_WHITE, out=None, rot=-3, seed=60):
    """Small paper tag with a hand icon: names the gesture the viewer just saw («قبضة» / «كف مفتوح»)."""
    if t < at - 0.02: return
    o = 1 - ease_in(lin(t, out, out + 0.18)) if out is not None else 1
    if o <= 0: return
    q = pop(t, at) * (0.6 + 0.4 * o)
    tw_ = text_w(text, 34, 'display', 800)
    w = tw_ + 150; h = 96
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(0.5 + 0.5 * q, 0.5 + 0.5 * q)
    if o < 1 or q < 0.5: c.saveLayerAlpha(None, int(255 * min(1, q * 2) * o))
    paper_sheet(c, -w / 2, -h / 2, w, h, bg, seed, r=6, shadow_a=0.35, dy=6, blur=6)
    hand(c, w / 2 - 52, -2, 56, k_hand, shadow_on=False)
    draw_text(c, text, w / 2 - 100, 0, 34, 'display', 800, CHARCOAL, anchor='r')
    if o < 1 or q < 0.5: c.restore()
    c.restore()


def pulse(c, x, y, t, at, r0=60, r1=170, dur=0.6, color=YELLOW, n=1, width=6):
    for j in range(n):
        a0 = at + j * 0.22
        if a0 <= t < a0 + dur:
            u = (t - a0) / dur
            c.drawCircle(x, y, r0 + (r1 - r0) * ease_out(u), paint(color, 0.9 * (1 - u), stroke=width))


def dashed_ring(c, x, y, r, t, a=1.0, color=YELLOW, width=8):
    p = paint(color, a, stroke=width); p.setPathEffect(skia.DashPathEffect.Make([26, 16], -(t * 60) % 42))
    c.drawCircle(x, y, r, p)


def rewind_mark(c, x, y, s, a=1.0):
    for dx in (0, s * 0.62):
        p = skia.Path(); p.moveTo(x - dx, y); p.lineTo(x - dx + s * 0.62, y - s * 0.45); p.lineTo(x - dx + s * 0.62, y + s * 0.45); p.close()
        c.drawPath(p, paint(YELLOW, a)); c.drawPath(p, paint(CHARCOAL, a, stroke=4))


def hand_card(c, cx, cy, k, scale=1.0, sx=1.0, text=None, seed=70):
    """Paper card holding a hand icon (the gesture as a 'button')."""
    if scale <= 0.01 or sx <= 0.01: return
    c.save(); c.translate(cx, cy); c.scale(scale * sx, scale)
    paper_sheet(c, -105, -105, 210, 210, PAPER_WHITE, seed, r=12, shadow_a=0.35, dy=10, blur=10)
    c.drawRRect(rrect(-105, -105, 210, 210, 12), paint(YELLOW, 1, stroke=6))
    hand(c, 0, -24, 112, k, shadow_on=False)
    c.restore()
    if text: label(c, cx, cy + 150 * scale, text, 28, YELLOW, CHARCOAL, rot=-2, seed=seed, alpha=clamp(sx * 2 - 1) if sx < 1 else 1)


# ---------------------------------------------------------------- scenes
# A. Opening: three real demonstrations from frame 0 (official Huawei films)
OPEN_SHOTS = [  # (start, end, clip key, clip time at shot start)
    (0.00, 1.72, 'pura_grab', 0.00),
    (1.72, 3.06, 'm70_grab', 0.10),
    (3.06, 5.58, 'm70_receive', 0.00),
]


def s_open(c, t):
    bg_navy(c, t)
    for st, en, key, off in OPEN_SHOTS:
        if st <= t < en:
            # slow push-in inside each shot keeps the frame alive
            z = 1.0 + 0.06 * lin(t, st, en)
            m = footage(c, t, key, t - st + off, st if st > 0 else -1, PRINT_BIG, seed=3 + int(st), rot=-0.6 + 0.5 * (st > 1),
                        zoom=z, cx=0.55, cy=0.5)
            if key == 'pura_grab':
                pulse(c, *m(0.68, 0.62), t, 0.62, n=2)
                gesture_tag(c, t, 0.66, 300, 1035, 'قبضة', 1.0, seed=61)
            elif key == 'm70_grab':
                pulse(c, *m(0.66, 0.58), t, 2.24, n=2)
                gesture_tag(c, t, 2.26, 300, 1035, 'قبضة', 1.0, seed=62)
            else:
                pulse(c, *m(0.62, 0.20), t, 3.98, n=2)
                gesture_tag(c, t, 4.0, 300, 1035, 'كف مفتوح', 0.0, seed=63, out=4.78)
                pulse(c, *m(0.22, 0.62), t, 4.84, r0=90, r1=260, n=2)
                if t >= 4.86:
                    chip(c, 800, 1035, 'وصلت!', 40, YELLOW, CHARCOAL, rot=3, seed=64, t=t, at=4.86)
    title_card(c, t, 1.10, 'صورة بتنتقل بحركة إيد', out=5.52)


# B. «لكن لحظة»: rewind to the grab, freeze, close-up on the fist - is the picture stored in the hand?
REW_A, REW_B, FREEZE = tw(13), tw(13) + 0.36, tw(13) + 0.52
FREEZE_CLIP = 0.90                          # m70_grab: fist closed, picture lifted off the screen
SPLIT = tw(20)                              # «وشو بصير بين هالحركتين؟»


def s_question(c, t):
    bg_navy(c, t)
    title_card(c, t, tw(13) + 0.10, 'لحظة…', out=tw(16) - 0.25)
    title_card(c, t, tw(16), 'الصورة بتتخزّن بالإيد؟', out=SPLIT - 0.2, seed=6)
    title_card(c, t, SPLIT, 'شو بصير بين الحركتين؟', seed=7)
    if t < REW_A + 0.001 or t < FREEZE:
        # fast reverse scrub: receive -> grab
        if t < REW_B:
            key, tl = 'm70_receive', lerp(2.5, 0.0, lin(t, REW_A, REW_B))
        else:
            key, tl = 'm70_grab', lerp(1.5, FREEZE_CLIP, lin(t, REW_B, FREEZE))
        footage(c, t, key, tl, -1, PRINT_BIG, seed=5, rot=-0.6, shake=4)
        rewind_mark(c, 110, 450, 46, 1.0)
        return
    sp = ease_io(lin(t, SPLIT - 0.05, SPLIT + 0.45))        # 0 = full freeze, 1 = two-step split
    # freeze frame: desaturate, push in on the fist
    zin = ease_io(lin(t, FREEZE, tw(18)))
    zf = ease_io(lin(t, tw(18), tw(19) + 0.1))
    zoom = lerp(lerp(1.0, 1.2, zin), 1.42, zf) * (1 - sp) + 1.0 * sp
    cx = lerp(0.5, 0.6, zf) * (1 - sp) + 0.5 * sp
    cy = lerp(0.5, 0.56, zf) * (1 - sp) + 0.5 * sp
    sat = lerp(1.0, 0.35, ease_io(lin(t, FREEZE, FREEZE + 0.3)))
    x0, y0, w0, h0 = PRINT_BIG
    x1, y1, w1, h1 = 548, 560, 500, 375                    # right print: step 1 (closing)
    rect = (lerp(x0, x1, sp), lerp(y0, y1, sp), lerp(w0, w1, sp), lerp(h0, h1, sp))
    flash = 1 - lin(t, FREEZE, FREEZE + 0.12)
    m = footage(c, t, 'm70_grab', FREEZE_CLIP, FREEZE, rect, seed=5, rot=lerp(-0.6, 2.0, sp), zoom=zoom, cx=cx, cy=cy,
                sat=sat, credit_on=sp < 0.5)
    if flash > 0: c.drawRect(inner_of(rect), paint(WHITE, 0.5 * flash))
    if sp < 1:
        a = 1 - sp
        if t >= tw(17):            # «الصورة»: the lifted picture
            q = pop(t, tw(17))
            px, py = m(0.22, 0.42)
            c.drawCircle(px, py, 150 * zoom / 1.25 * (0.6 + 0.4 * q), paint(PAPER_WHITE, 0.85 * a * (1 - zf), stroke=6))
        if t >= tw(18) - 0.05:     # «بتتخزّن بإيده»: ring on the fist
            hx, hy = m(0.68, 0.58)
            q = pop(t, tw(18) - 0.05)
            dashed_ring(c, hx, hy, (150 + 110 * zf) * (0.6 + 0.4 * q), t, a)
        if t >= tw(19) - 0.05:
            q = spring(t, tw(19) - 0.05, 11, 260, 0.6)
            hero_word(c, 210, 640, '؟', 260, YELLOW, CHARCOAL, scale=(0.4 + 0.6 * q) * a, rot=-8, alpha=a)
    if sp > 0:
        # step 2 print (opening, receive side) + the unknown in between
        x2, y2, w2, h2 = 32, 860, 500, 375
        q = spring(t, SPLIT + 0.1, 13, 200, 0.8)
        c.save(); c.translate(-(1 - q) * 600, 0)
        m2 = footage(c, t, 'm70_receive', 1.05 + 0.25 * lin(t, SPLIT, SPLIT + 1.5), SPLIT + 0.1, (x2, y2, w2, h2), seed=8, rot=-2.0,
                     credit_on=False, sat=0.6)
        c.restore()
        draw_text(c, '١ · تسكير', x1 + w1 - 20, y1 - 40, 36, 'display', 800, YELLOW, anchor='r', alpha=sp)
        draw_text(c, '٢ · فتح', x2 + w2 - 20, y2 + h2 + 44, 36, 'display', 800, YELLOW, anchor='r', alpha=q)
        if t >= SPLIT + 0.3:
            k = ease_out(lin(t, SPLIT + 0.3, SPLIT + 0.8))
            path = skia.Path(); path.moveTo(x1 + 120, y1 + h1 - 20); path.quadTo(560, 1010, x2 + w2 - 60, y2 + 40)
            dashed_path(c, path, PAPER, 7, 0.9, 18, 14, -(t * 70) % 32, trim=k)
            qq = spring(t, tw(23), 11, 260, 0.6)
            if t >= tw(23):
                hero_word(c, 650, 920, '؟', 170, YELLOW, CHARCOAL, scale=0.4 + 0.6 * qq, rot=6)
        credit(c, 1030, 1270, 'فيديو رسمي', SRC['m70'], alpha=sp)


# C. «السر مش بالإيد، السر باللي الجهاز بيشوفه»
def s_secret(c, t):
    bg_cream(c, t)
    floor(c, 1190)
    title_card(c, t, tw(24), 'السر مش بالإيد', out=tw(27) - 0.2)
    title_card(c, t, tw(27), 'السر باللي الجهاز بيشوفه', seed=8)
    badge(c, 180, 330, 'رسم توضيحي', TERRACOTTA, 24, -4, alpha=clamp((t - tw(24) - 0.2) * 4))
    mv = ease_io(lin(t, tw(27) - 0.05, tw(28) + 0.25))
    he = spring(t, tw(24), 13, 170, 0.8)
    hx = lerp(540, 790, mv) + 10 * math.sin(t * 3.2); hy = lerp(760, 690, mv) + (1 - he) * 700 + 8 * math.sin(t * 2.3)
    hs = lerp(400, 290, mv)
    hand(c, hx, hy, hs, 0.25 * (1 - mv), rot=-6)
    if t >= tw(26) - 0.05:         # «بالإيد» -> crossed out
        q = spring(t, tw(26) - 0.05, 12, 300, 0.6)
        cross(c, hx, hy - 20, 150 * (1 - 0.3 * mv), q, a=1 - mv)
    PX, PY, PH = 330, 780, 560
    if t >= tw(27) - 0.1:
        pe = spring(t, tw(27) - 0.1, 14, 170, 0.8)
        sees = t >= tw(29)
        phone(c, PX - (1 - pe) * 700, PY, PH, lambda cv, r: screen_dino(cv, r), rot=-2,
              cam_glow=(0.6 + 0.4 * math.sin(t * 10)) if sees else 0)
        if t >= tw(30) - 0.1:      # «بيشوفه»: viewfinder on the hand
            k = ease_out(lin(t, tw(30) - 0.1, tw(30) + 0.25))
            cx_, cy_ = phone_cam(PX, PY, PH)
            bx = skia.Rect.MakeLTRB(hx - 200, hy - 260, hx + 200, hy + 230)
            for (ex, ey) in ((bx.left(), bx.top()), (bx.left(), bx.bottom())):
                c.drawLine(cx_, cy_, lerp(cx_, ex, k), lerp(cy_, ey, k), paint(YELLOW, 0.75, stroke=3))
            corner_brackets(c, bx, YELLOW, 52 * k, 8, k)
            if k >= 1:
                sy = bx.top() + bx.height() * ((t - tw(30)) * 0.9 % 1)
                c.drawRect(skia.Rect.MakeLTRB(bx.left() + 10, sy - 3, bx.right() - 10, sy + 3), paint(YELLOW, 0.7))
            chip(c, 790, 1060, 'الجهاز بيشوف الحركة', 32, YELLOW, CHARCOAL, rot=2, seed=31, t=t, at=tw(30) + 0.15)


# D. «لمّا الشخص يسكّر إيده» - real footage of the fist closing in front of the phone
def s_close_footage(c, t):
    bg_navy(c, t)
    st = tw(31)
    title_card(c, t, st + 0.02, 'لمّا يسكّر إيده…')
    m = footage(c, t, 'm80_grab', max(0.0, t - st - 0.12), st, PRINT, seed=11, zoom=1.0 + 0.05 * lin(t, st, tw(35)))
    if t >= tw(33):
        k = ease_out(lin(t, tw(33), tw(33) + 0.3))
        x0, y0 = m(0.30, 0.10); x1, y1 = m(0.72, 0.85)
        corner_brackets(c, skia.Rect.MakeLTRB(x0, y0, x1, y1), YELLOW, 56 * k, 9, k)
        gesture_tag(c, t, tw(33) + 0.1, 300, 1035, 'قبضة', 1.0, seed=65)
    badge(c, 820, 470, 'تمييز توضيحي', TERRACOTTA, 22, 4, alpha=clamp((t - tw(33)) * 4))


# E. Recognition -> «إرسال»
def s_send(c, t):
    bg_navy(c, t)
    B = tw(35)
    title_card(c, t, B + 0.02, 'الجهاز بيتعرّف على الحركة', out=tw(39) - 0.2)
    title_card(c, t, tw(39), 'تسكير الإيد = إرسال', seed=9)
    PX, PY, PH = 330, 760, 600
    sway = env(t, 18.05, 19.45, 0.3, 0.3)
    pe = spring(t, B, 14, 170, 0.8)
    lift = ease_io(lin(t, tw(43), tw(44) + 0.2))
    sent = t >= tw(52)
    phone(c, PX, PY + (1 - pe) * 900, PH, lambda cv, r: screen_dino(cv, r, 0.0 if sent and t > tw(52) + 0.15 else 1.0, lift), rot=-2 + 1.2 * sway * math.sin((t - 18.05) * 2.0),
          glow=0.5 * ease_io(lin(t, tw(42), tw(42) + 0.3)) * (1 - ease_io(lin(t, tw(52), tw(52) + 0.3))),
          cam_glow=(0.6 + 0.4 * math.sin(t * 10)) * (1 - lin(t, tw(39), tw(39) + 0.3)))
    he = spring(t, B + 0.08, 13, 160, 0.8)
    k_hand = ease_io(lin(t, B + 0.3, tw(38)))                # closes again inside the viewfinder
    bob = lin(t, tw(50) - 0.15, tw(50)) * 14 * math.sin((t - tw(50)) * 7)
    sway = env(t, 18.05, 19.45, 0.3, 0.3)          # idle breathing while the narration lists the file (no static hold)
    hx, hy = 780 + (1 - he) * 400 + 9 * sway * math.sin((t - 18.05) * 3.4), 620 + bob + 7 * sway * math.sin((t - 18.05) * 2.6)
    hand(c, hx, hy, 280, k_hand, rot=-6)
    vf = 1 - ease_io(lin(t, tw(39), tw(39) + 0.4))
    if vf > 0:
        k = ease_out(lin(t, B + 0.1, B + 0.4)) * vf
        bx = skia.Rect.MakeLTRB(hx - 190, hy - 250, hx + 190, hy + 220)
        corner_brackets(c, bx, YELLOW, 52 * k, 8, k)
        if t < tw(38):
            sy = bx.top() + bx.height() * ((t - B) * 1.1 % 1)
            c.drawRect(skia.Rect.MakeLTRB(bx.left() + 10, sy - 3, bx.right() - 10, sy + 3), paint(YELLOW, 0.7 * k))
        cx_, cy_ = phone_cam(PX, PY, PH)
        for (ex, ey) in ((bx.left(), bx.top()), (bx.left(), bx.bottom())):
            c.drawLine(cx_, cy_, lerp(cx_, ex, k), lerp(cy_, ey, k), paint(YELLOW, 0.6 * k, stroke=3))
    if t >= tw(38):                 # «الحركة»: recognised
        pulse(c, hx, hy, t, tw(38), 120, 260, n=2)
        gesture_tag(c, t, tw(38), 790, 980, 'قبضة', 1.0, bg=YELLOW, out=tw(42) - 0.1, seed=66)
    if t >= tw(41) - 0.05:          # dashed "intent" link from the fist to the phone
        k = ease_out(lin(t, tw(41), tw(42) + 0.1))
        path = skia.Path(); path.moveTo(660, 600); path.quadTo(560, 480, PX + 130, PY - 240)
        dashed_path(c, path, YELLOW, 6, 1, 16, 12, -(t * 60) % 28, trim=k)
    chip(c, 720, 945, 'هاي الصورة', 34, YELLOW, CHARCOAL, rot=-2, seed=52, t=t, at=tw(43))
    chip(c, 800, 1020, 'هذا الملف', 34, PAPER_WHITE, CHARCOAL, rot=2, seed=51, t=t, at=tw(46))
    if sent:                        # «الإرسال»: the picture leaves the screen
        u = ease_in(lin(t, tw(52), tw(52) + 0.6))
        path = skia.Path(); path.moveTo(PX, PY); path.quadTo(PX + 60, 300, 1180, 260)
        dashed_path(c, path, YELLOW, 6, 0.9, 16, 12, -(t * 60) % 28, trim=min(1, u * 1.3))
        if u < 1:
            x, y = along(path, u)
            file_card(c, x, y, 170 * (1 - 0.35 * u), rot=-8 + 20 * u, glow=1.0)
    equation(c, t, 1170, 1.0, 'إرسال', True, tw(48), press_times=(tw(50), tw(51)))


def equation(c, t, y, k_hand, word, up, at, press_times=(), dim=0.0):
    """[hand icon] = [button]  - the core analogy row (RTL: hand right, button left)."""
    if t < at - 0.02: return
    q = spring(t, at, 12, 240, 0.7)
    a = 1 - 0.55 * dim; sc = 1 - 0.25 * dim
    c.save(); c.translate(540, y); c.scale(sc, sc); c.translate(-540, -y)
    if a < 1: c.saveLayerAlpha(None, int(a * 255))
    c.save(); c.translate(840, y); c.scale(0.4 + 0.6 * q, 0.4 + 0.6 * q)
    paper_sheet(c, -110, -110, 220, 220, PAPER_WHITE, 70 + up, r=10, shadow_a=0.35, dy=10, blur=10)
    hand(c, 0, -14, 140, k_hand, shadow_on=False)
    c.restore()
    e = pop(t, at + 0.12)
    if t >= at + 0.12:
        draw_text(c, '=', 680, y - 4, 110 * (0.5 + 0.5 * e), 'display', 800, YELLOW if not dim else PAPER_SHADE)
    bt = at + 0.24
    if t >= bt:
        p = 0.0
        for pt in press_times:
            if pt <= t < pt + 0.32:
                p = max(p, math.sin(math.pi * (t - pt) / 0.32))
        action_button(c, 345, y, word, up, press=p, scale=0.5 + 0.5 * pop(t, bt))
        for pt in press_times:
            if pt <= t < pt + 0.5:
                rr_ = 120 + 200 * ease_out((t - pt) / 0.5)
                c.drawCircle(345, y, rr_, paint(YELLOW, 0.8 * (1 - (t - pt) / 0.5), stroke=6))
    if a < 1: c.restore()
    c.restore()


# F. «ولمّا يفتحها قدّام التلفون الثاني… زي كبسة استقبال»
RECV_FOOT_END = tw(58)


def s_recv(c, t):
    bg_navy(c, t)
    if t < RECV_FOOT_END:
        st = tw(53)
        title_card(c, t, st + 0.02, 'ولمّا يفتحها…')
        m = footage(c, t, 'pura_release', t - st + 0.40, st, PRINT, seed=12, rot=0.8)
        pulse(c, *m(0.30, 0.32), t, 21.72, n=2)
        gesture_tag(c, t, 21.74, 300, 1035, 'كف مفتوح', 0.0, seed=67)
        pulse(c, *m(0.50, 0.56), t, 22.30, r0=50, r1=150, n=2)
        return
    B = RECV_FOOT_END
    title_card(c, t, B + 0.02, 'فتح الإيد = استقبال')
    PX, PY, PH = 330, 680, 520
    pe = spring(t, B, 14, 170, 0.8)
    land = ease_out(lin(t, tw(61), tw(61) + 0.5))
    phone(c, PX, PY + (1 - pe) * 900, PH, lambda cv, r: screen_dino(cv, r, land), rot=2,
          glow=0.6 * land * (1 - lin(t, tw(62) + 0.3, tw(63))) + 0.6 * ease_io(lin(t, tw(65), tw(65) + 0.2)))
    he = spring(t, B + 0.1, 13, 160, 0.8)
    bob = lin(t, tw(64) - 0.2, tw(64) + 0.1) * 14 * math.sin((t - tw(64)) * 6)
    hx, hy = 780 + (1 - he) * 400, 560 + bob
    hand(c, hx, hy, 260, 1 - ease_io(lin(t, B + 0.2, B + 0.6)), rot=6 + bob * 0.2)
    if tw(61) - 0.2 <= t < tw(61) + 0.5:   # picture drops onto the screen
        u = ease_in(lin(t, tw(61) - 0.2, tw(61) + 0.05))
        file_card(c, lerp(560, PX, u), lerp(420, PY, u), 150 * (1 - 0.3 * u), rot=8 * (1 - u), alpha=1 - lin(t, tw(61) + 0.05, tw(61) + 0.35))
    equation(c, t, 975, 1.0, 'إرسال', True, B + 0.05, dim=1.0)
    equation(c, t, 1195, 0.0, 'استقبال', False, tw(63) - 0.05, press_times=(tw(64),))
    if t >= tw(65) + 0.1:            # receive pulse keeps the beat alive
        for j in range(2):
            u = ((t - tw(65) - 0.1) / 0.7 + j * 0.5) % 1
            c.drawCircle(345, 1195, 110 + 170 * u, paint(YELLOW, 0.7 * (1 - u), stroke=5))


# G. «وبعد موافقات النظام، الملف بينتقل لاسلكياً بين الجهازين، زي فكرة AirDrop»
def s_wireless(c, t):
    bg_cream(c, t)
    FLOOR = 1120
    floor(c, FLOOR)
    title_card(c, t, tw(66) + 0.02, 'الملف بينتقل بين الجهازين')
    A = (250, 830); Bp = (830, 830); PH = 520
    pa = spring(t, tw(66), 14, 170, 0.8)
    mv = ease_io(lin(t, tw(70), tw(71) + 0.5))
    arrived = t >= tw(71) + 0.5
    both = ease_io(lin(t, tw(73), tw(73) + 0.3))
    phone(c, A[0] - (1 - pa) * 600, A[1], PH, lambda cv, r: screen_dino(cv, r, 1.0, 0.5 * (mv > 0 and not arrived)), rot=-3, glow=both * 0.7)
    phone(c, Bp[0] + (1 - pa) * 600, Bp[1], PH, lambda cv, r: screen_dino(cv, r, 1.0 if arrived else 0.0), rot=3, glow=both * 0.7)
    if t >= tw(67) - 0.05:          # system approvals: one stamp, no invented dialog
        q = spring(t, tw(67) - 0.05, 14, 330, 0.8)
        badge(c, 540, 470, 'موافقات النظام', TEAL, 32, -4, scale=1.5 - 0.5 * q, alpha=min(1, q * 2))
    if t >= tw(69) - 0.1:
        k = ease_out(lin(t, tw(69) - 0.1, tw(70)))
        path = wireless_arc(c, (A[0] + 110, A[1] - 120), (Bp[0] - 110, Bp[1] - 120), 240, t, k)
        wifi_glyph(c, 540, 660, 90, YELLOW, k=lin(t, tw(69), tw(70) + 0.3) * 1.2)
        if 0 < mv < 1:
            x, y = along(path, mv)
            file_card(c, x, y, 130, rot=-6 + 12 * mv, glow=1.0)
    if t >= tw(71) - 0.05:
        q = spring(t, tw(71) - 0.05, 11, 260, 0.6)
        hero_word(c, 540, 1225, 'لاسلكياً', 120, CHARCOAL, None, strip=YELLOW, seed=33, scale=0.4 + 0.6 * q, rot=-3)
    if t >= tw(75) - 0.05:          # comparison of the idea only
        q = pop(t, tw(75) - 0.05)
        label(c, 540, 345, 'فكرة شبيهة بـ AirDrop', 34, YELLOW, CHARCOAL, rot=1.5, seed=81, scale=0.6 + 0.4 * q, alpha=min(1, q * 2))
        draw_text(c, 'AirDrop ميزة مشاركة من Apple · تشبيه للفكرة فقط', W / 2, 1012, 25, 'label', 700, CHARCOAL,
                  alpha=0.85 * clamp((t - tw(76)) * 3))


# H. «يعني باختصار… استبدلوا كبسة الإرسال والاستقبال بحركة الإيد»
def s_clarify(c, t):
    bg_cream(c, t)
    T0 = tw(77)
    title_card(c, t, T0 + 0.02, 'باختصار', out=tw(86) - 0.2)
    title_card(c, t, tw(86), 'الحركة بدل الكبسة', seed=10)
    A = (240, 1040); Bp = (840, 1040); PH = 400
    pa = spring(t, T0, 14, 170, 0.8)
    wl = ease_io(lin(t, tw(84), tw(85) + 0.6))               # wireless transfer of the picture
    loop = (t - (tw(85) + 0.9)) / 1.3 % 1 if t >= tw(85) + 0.9 else -1
    rx_full = wl >= 1
    phone(c, A[0] - (1 - pa) * 500, A[1], PH, lambda cv, r: screen_dino(cv, r, 1.0, 0.5 if 0 < wl < 1 else 0), rot=-3)
    phone(c, Bp[0] + (1 - pa) * 500, Bp[1], PH, lambda cv, r: screen_dino(cv, r, 1.0 if rx_full else 0.0), rot=3,
          glow=0.6 if rx_full and t < tw(86) + 0.3 else 0)
    # 1) the "through the hand" route - crossed out
    sw = ease_io(lin(t, tw(86) - 0.1, tw(86) + 0.3))          # hand route leaves when the buttons come
    hx, hy = 540, 560 + 8 * math.sin(t * 2.4)
    if sw < 1:
        a = 1 - sw
        he = spring(t, T0 + 0.1, 13, 170, 0.8)
        hand(c, hx, hy, 200 * (0.3 + 0.7 * he), 0.6, rot=-4, alpha=a * min(1, he * 3))
        if t >= tw(79) - 0.1:
            k = ease_out(lin(t, tw(79) - 0.1, tw(79) + 0.35))
            path = skia.Path(); path.moveTo(A[0], A[1] - PH / 2 - 20); path.quadTo(300, 560, hx - 110, hy + 40)
            path.moveTo(hx + 110, hy + 40); path.quadTo(780, 560, Bp[0], Bp[1] - PH / 2 - 20)
            dashed_path(c, path, CHARCOAL, 6, 0.75 * a, 14, 12, 0, trim=k)
        if t >= tw(80) - 0.05:      # «ما انتقلت»
            q = spring(t, tw(80) - 0.05, 12, 300, 0.6)
            cross(c, hx, hy + 10, 130, q, a=a)
        if t >= tw(82) - 0.05:
            q = spring(t, tw(82) - 0.05, 14, 330, 0.8)
            badge(c, 540, 335, 'مش عن طريق الإيد', TERRACOTTA, 34, -4, scale=1.5 - 0.5 * q, alpha=min(1, q * 2) * a)
    # 2) the real route: wireless, phone to phone
    if t >= tw(83) - 0.1:
        k = ease_out(lin(t, tw(83) - 0.1, tw(84)))
        path = wireless_arc(c, (A[0] + 90, A[1] - 110), (Bp[0] - 90, Bp[1] - 110), 150, t, k)
        wifi_glyph(c, 540, A[1] - 95, 70, YELLOW, k=lin(t, tw(83), tw(84) + 0.3) * 1.2)
        if 0 < wl < 1:
            x, y = along(path, wl); file_card(c, x, y, 110, glow=1)
        elif loop >= 0:
            x, y = along(path, ease_io(loop)); file_card(c, x, y, 90, glow=0.7, alpha=min(1, 6 * (1 - loop), 6 * loop))
        chip(c, 540, 1290, 'الملف: لاسلكياً بين الجهازين', 34, YELLOW, CHARCOAL, rot=1.5, seed=92, t=t, at=tw(85))
    # 3) buttons «إرسال» / «استقبال» replaced by the gestures
    FL = tw(90)                                               # «بحركة»
    flip = lin(t, FL, FL + 0.36)
    sxb = 1 - ease_in(clamp(flip * 2)); sxh = ease_out(clamp(flip * 2 - 1))
    for j, (x, word, up, at, k) in enumerate(((A[0], 'إرسال', True, tw(87), 1.0), (Bp[0], 'استقبال', False, tw(89) - 0.05, 0.0))):
        if t < at - 0.02: continue
        q = pop(t, at)
        tap = at + 0.15
        p = math.sin(math.pi * clamp((t - tap) / 0.3)) if tap <= t < tap + 0.3 else 0.0
        if sxb > 0.01:
            action_button(c, x, 610, word, up, press=p, scale=0.9 * (0.5 + 0.5 * q), size=50, sx=sxb)
            if t < FL:
                pixel_cursor(c, x + 40, 610 + 24 - 26 * p, 6)
        if sxh > 0.01:
            hand_card(c, x, 610, k, scale=0.95, sx=sxh, text='قبضة' if up else 'كف مفتوح', seed=72 + j)
            if t >= FL + 0.36:
                pulse(c, x, 610, t, FL + 0.36 + 0.12 * j, 110, 220, n=1)
    if t >= tw(91) - 0.05:
        q = pop(t, tw(91) - 0.05)
        label(c, 540, 420, 'حركة الإيد = الأمر', 40, CHARCOAL, YELLOW, rot=-2, seed=93, scale=0.6 + 0.4 * q, alpha=min(1, q * 2))


# I. «بس وهون شطارة الماركتنج…» - back to the demo, now annotated
MKT_SHOTS = [(tw(92), 40.64, 'm70_grab', 0.0), (40.64, tw(98), 'm70_receive', 0.6), (tw(98), 99.0, 'm80_release', 0.6)]


def s_marketing(c, t):
    bg_navy(c, t)
    title_card(c, t, tw(93) + 0.02, 'وهون شطارة الماركتنج')
    for st, en, key, off in MKT_SHOTS:
        if st <= t < en:
            tl = t - st + off
            hold = max(0.0, tl - (clip_len(key) - 1 / FPS))
            m = footage(c, t, key, tl, st, PRINT, seed=21 + int(st), zoom=1.0 + 0.035 * hold, cx=0.45)
            if key == 'm70_grab':
                pulse(c, *m(0.66, 0.58), t, st + 0.56, n=1)
                chip(c, 790, 470, 'أمر: إرسال', 36, YELLOW, CHARCOAL, rot=-3, seed=94, t=t, at=st + 0.58)
            elif key == 'm70_receive':
                pulse(c, *m(0.62, 0.22), t, st + 0.42, n=1)
                chip(c, 790, 470, 'أمر: استقبال', 36, YELLOW, CHARCOAL, rot=-3, seed=95, t=t, at=st + 0.44)
                pulse(c, *m(0.22, 0.62), t, st + 1.22, r0=80, r1=220, n=1)
                chip(c, 300, 1080, 'الملف: لاسلكياً', 32, PAPER_WHITE, CHARCOAL, rot=3, seed=96, t=t, at=st + 1.24)
            else:
                pulse(c, *m(0.50, 0.45), t, st + 0.50, n=1)
                chip(c, 790, 470, 'أمر: استقبال', 36, YELLOW, CHARCOAL, rot=-3, seed=97, t=t, at=st + 0.52, out=tw(103) - 0.25)
    if t >= tw(96) - 0.05:          # the concept under the gesture
        draw_text(c, 'مشاركة ملفات =', 905, 1258, 34, 'display', 800, PAPER, anchor='r', alpha=clamp((t - tw(96)) * 4))
        q1 = pop(t, tw(96) + 0.1)
        action_button(c, 525, 1258, 'إرسال', True, scale=0.62 * (0.5 + 0.5 * q1), size=44)
        if t >= tw(97):
            q2 = pop(t, tw(97))
            action_button(c, 225, 1258, 'استقبال', False, scale=0.62 * (0.5 + 0.5 * q2), size=44)
    if t >= tw(100) - 0.05:
        q = spring(t, tw(100) - 0.05, 14, 330, 0.8)
        badge(c, 300, 470, 'تصميم تفاعل ذكي', TERRACOTTA, 36, -6, scale=1.6 - 0.6 * q, alpha=min(1, q * 2))
    if t >= tw(103) - 0.05:
        q = spring(t, tw(103) - 0.05, 12, 260, 0.6)
        hero_word(c, 700, 330, 'ماسك الصورة', 92, CHARCOAL, None, strip=YELLOW, seed=44, scale=0.4 + 0.6 * q, rot=-3)


SCENES = [(-1.0, tw(13), s_open), (tw(13), tw(24), s_question), (tw(24), tw(31), s_secret),
          (tw(31), tw(35), s_close_footage), (tw(35), tw(53), s_send), (tw(53), tw(66), s_recv),
          (tw(66), tw(77), s_wireless), (tw(77), tw(92), s_clarify), (tw(92), 99.0, s_marketing)]


def render_frame(f):
    t = f / FPS - AUDIO_PTS
    surf = skia.Surface(W, H)
    c = surf.getCanvas()
    for a, b, fn in SCENES:
        if a <= t < b:
            fn(c, t); break
    caption_track(c, t)
    grade(c, t)
    return surf
