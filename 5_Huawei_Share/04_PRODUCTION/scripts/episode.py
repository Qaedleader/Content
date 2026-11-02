"""Huawei Share (video 5): narration-locked timeline, captions and scenes.

Same Paper Workshop toolkit and caption system as Video 4 (brand.py is copied unchanged from
4_MicroDuck_Robot). All times are narration seconds from 02_TIMING/words_display.json. The source m4a's
edit list skips the 2112 priming samples, so the narration starts at presentation 0:  t = f / 30."""
import os, json, functools, glob, math
import skia
from brand import *

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(os.path.dirname(HERE))
FR = os.path.join(PROJ, '03_MEDIA', 'frames')

AUDIO_PTS = 0.0
N_FRAMES = 1284          # 42.80 s >= 0.0479 + 42.7247 s of narration (last frame held, audio untouched)

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
    return _frame(key, min(len(files) - 1, int(max(0.0, tl) * FPS + 1e-6)))


DINO = os.path.join(FR, 'dino_card.png')

SRC = {'pura': 'HUAWEI Pura 80 Ultra', 'm70': 'HUAWEI Mate 70', 'm80': 'HUAWEI Mate 80'}
PRINT = (40, 400, 1000, 750)        # 4:3 taped print (Video 4 rev 2 geometry); inner 968x718 < 1160x870 clips


def footage(c, t, key, tl, st, seed=3, rot=-0.8, credit_on=True):
    """Taped evidence print of official footage with a small 'thump' on each cut."""
    x, y, w, h = PRINT
    thump = 1 + 0.02 * (1 - ease_out(lin(t, st, st + 0.18)))
    c.save(); c.translate(W / 2, y + h / 2); c.scale(thump, thump); c.translate(-W / 2, -(y + h / 2))
    print_frame(c, x, y, w, h, cover_draw(clip(key, tl)), rot=rot, seed=seed)
    c.restore()
    if credit_on:
        credit(c, 1030, 1178, 'فيديو رسمي', SRC[key.split('_')[0]])


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


# ---------------------------------------------------------------- paper props
def rr_path(x, y, w, h, r):
    p = skia.Path(); p.addRRect(rrect(x, y, w, h, r)); return p


def hand(c, cx, cy, s, k=0.0, rot=0.0, fill=PAPER_WHITE, ink=CHARCOAL, cuff=NAVY_LIGHT, alpha=1.0, shadow_on=True):
    """Paper cut-out hand seen from the back. k = 0 open palm ... 1 closed fist. (cx, cy) = palm centre."""
    if alpha <= 0: return
    k = clamp(k)
    parts = []
    # wrist / cuff
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
    if k > 0.6:          # knuckle creases on the fist
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
    """Neutral home screen: grid of paper app tiles (no brand UI imitation)."""
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
    """Send (arrow out of a tray) / receive (arrow into a tray) icon."""
    p = paint(color, 1, stroke=s * 0.13)
    tray = skia.Path(); tray.moveTo(cx - s * 0.45, cy + s * 0.05); tray.lineTo(cx - s * 0.45, cy + s * 0.42)
    tray.lineTo(cx + s * 0.45, cy + s * 0.42); tray.lineTo(cx + s * 0.45, cy + s * 0.05)
    c.drawPath(tray, p)
    c.drawLine(cx, cy - s * 0.5, cx, cy + s * 0.18, p)
    hy, d = (cy - s * 0.5, 1) if up else (cy + s * 0.18, -1)
    ar = skia.Path(); ar.moveTo(cx - s * 0.26, hy + d * s * 0.26); ar.lineTo(cx, hy); ar.lineTo(cx + s * 0.26, hy + d * s * 0.26)
    c.drawPath(ar, p)


def action_button(c, cx, cy, text, up=True, press=0.0, scale=1.0, alpha=1.0, color=YELLOW, shade=YELLOW_SHADE, size=50):
    """Chunky paper push-button «إرسال» / «استقبال»: face drops onto its base when pressed."""
    if alpha <= 0 or scale <= 0.01: return
    tw_ = text_w(text, size, 'display', 800)
    w = tw_ + size * 1.25 + 70; h = size * 1.9; depth = 14
    c.save(); c.translate(cx, cy); c.scale(scale, scale)
    if alpha < 1: c.saveLayerAlpha(None, int(alpha * 255))
    shadow(c, rrect(-w / 2, -h / 2 + depth, w, h, h / 2), dy=8, blur=10, a=0.35)
    c.drawRRect(rrect(-w / 2, -h / 2 + depth, w, h, h / 2), paint(shade))
    dy = depth * clamp(press)
    c.drawRRect(rrect(-w / 2, -h / 2 + dy, w, h, h / 2), paint(color))
    c.save(); c.clipRRect(rrect(-w / 2, -h / 2 + dy, w, h, h / 2), doAntiAlias=True)
    c.drawRect(skia.Rect.MakeXYWH(-w / 2, -h / 2 + dy, w, h), tex_paint('paper_fibers.png', 0.5, skia.BlendMode.kMultiply, 0.5))
    c.restore()
    c.drawRRect(rrect(-w / 2, -h / 2 + dy, w, h, h / 2), paint(CHARCOAL, 0.9, stroke=4))
    # RTL: label on the right, icon on the left
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


def bt_glyph(c, cx, cy, s, color=YELLOW, a=1.0):
    p = skia.Path()
    pts = [(-0.26, -0.24), (0.26, 0.24), (0.0, 0.48), (0.0, -0.48), (0.26, -0.24), (-0.26, 0.24)]
    p.moveTo(cx + pts[0][0] * s, cy + pts[0][1] * s)
    for x, y in pts[1:]: p.lineTo(cx + x * s, cy + y * s)
    c.drawPath(p, paint(color, a, stroke=s * 0.11))


def chip(c, cx, cy, text, size=30, bg=PAPER_WHITE, fg=CHARCOAL, rot=0.0, seed=1, t=None, at=None, family='display'):
    if t is not None and at is not None:
        if t < at - 0.02: return
        q = pop(t, at)
        return label(c, cx, cy, text, size, bg, fg, rot=rot, seed=seed, scale=0.5 + 0.5 * q, alpha=min(1, q * 2), family=family)
    return label(c, cx, cy, text, size, bg, fg, rot=rot, seed=seed, family=family)


def wireless_arc(c, a, b, lift, t, k=1.0, color=YELLOW, width=7, alpha=1.0):
    path = skia.Path(); path.moveTo(*a)
    mx = (a[0] + b[0]) / 2; my = min(a[1], b[1]) - lift
    path.quadTo(mx, my, *b)
    dashed_path(c, path, color, width, alpha, 18, 14, -(t * 70) % 32, trim=k)
    return path


def along(path, u):
    meas = skia.PathMeasure(path, False); pos, _ = meas.getPosTan(meas.getLength() * clamp(u)); return pos.x(), pos.y()


# ---------------------------------------------------------------- scenes
OPEN_SHOTS = [  # (start, end, clip, clip time at start)
    (-1.0, 2.10, 'pura_grab', 1.0),       # starts at clip t=0 when t=0
    (2.10, 3.50, 'm70_grab', -2.10 + 0.05),
    (3.50, 6.10, 'm70_receive', -3.50 + 0.04),
    (6.10, 8.10, 'm80_release', -6.10 + 0.30),
]


def s_open(c, t):
    """A. Three real demonstrations from Huawei's official films, action from frame 0."""
    bg_navy(c, t)
    for st, en, key, off in OPEN_SHOTS:
        if st <= t < en:
            tl = t if key == 'pura_grab' else t + off
            footage(c, t, key, tl, max(st, 0.0) if st > 0 else -1, seed=3 + int(st))
    title_card(c, t, tw(4), 'صورة بتنتقل بحركة إيد', out=tw(17) - 0.35)
    title_card(c, t, tw(17) - 0.05, 'بس… كيف؟')


def s_detect(c, t):
    """B. Step 1: the device recognises the hand (restrained viewfinder)."""
    bg_cream(c, t)
    FLOOR = 1190
    floor(c, FLOOR)
    title_card(c, t, 8.12, 'الجهاز بيتعرّف على الإيد')
    badge(c, 180, 330, 'رسم توضيحي', TERRACOTTA, 24, -4, alpha=clamp((t - 8.3) * 4))
    PX, PY, PH = 330, 780, 560
    pe = spring(t, 8.10, 14, 170, 0.8)
    det = t >= tw(23)
    phone(c, PX - (1 - pe) * 600, PY, PH, lambda cv, r: screen_dino(cv, r), rot=-2,
          cam_glow=(0.6 + 0.4 * math.sin(t * 10)) if det else 0)
    he = spring(t, 8.25, 13, 150, 0.85)
    hx = 770 + (1 - he) * 500 + 10 * math.sin(t * 3.2); hy = 690 + 8 * math.sin(t * 2.3)
    hand(c, hx, hy, 300, 0.0, rot=-8)
    if det:
        k = ease_out(lin(t, tw(23), tw(23) + 0.35))
        cx_, cy_ = phone_cam(PX, PY, PH)
        bx = skia.Rect.MakeLTRB(hx - 200, hy - 260, hx + 200, hy + 230)
        # sensing cone from the front camera to the hand frame
        for (ex, ey) in ((bx.left(), bx.top()), (bx.left(), bx.bottom())):
            c.drawLine(cx_, cy_, lerp(cx_, ex, k), lerp(cy_, ey, k), paint(YELLOW, 0.75, stroke=3))
        corner_brackets(c, bx, YELLOW, 52 * k, 8, k)
        if k >= 1:
            sy = bx.top() + (bx.height()) * ((t - tw(23)) * 0.9 % 1)
            c.drawRect(skia.Rect.MakeLTRB(bx.left() + 10, sy - 3, bx.right() - 10, sy + 3), paint(YELLOW, 0.7))
    # gesture vocabulary
    if t >= tw(25) - 0.05:
        for j, (kk, txt, at) in enumerate(((0.0, 'كف مفتوح', tw(25) - 0.05), (1.0, 'قبضة', tw(26)))):
            if t < at: continue
            q = pop(t, at)
            x = 800 - j * 370; y = 1132
            c.save(); c.translate(x, y); c.scale(0.5 + 0.5 * q, 0.5 + 0.5 * q)
            paper_sheet(c, -175, -70, 350, 140, PAPER_WHITE, 40 + j, r=6, shadow_a=0.3, dy=6, blur=6)
            hand(c, -120, -4, 74, kk, shadow_on=False)
            draw_text(c, txt, 155, 0, 32, 'display', 800, CHARCOAL, anchor='r')
            c.restore()


def equation(c, t, y, k_hand, word, up, at, press_times=(), dim=0.0, eq_at=None):
    """[hand icon] = [button]  - the core analogy row."""
    if t < at - 0.02: return
    q = spring(t, at, 12, 240, 0.7)
    a = 1 - 0.55 * dim; sc = 1 - 0.25 * dim
    c.save(); c.translate(540, y); c.scale(sc, sc); c.translate(-540, -y)
    if a < 1: c.saveLayerAlpha(None, int(a * 255))
    # RTL reading: hand (right) = button (left)
    c.save(); c.translate(840, y); c.scale(0.4 + 0.6 * q, 0.4 + 0.6 * q)
    paper_sheet(c, -110, -110, 220, 220, PAPER_WHITE, 70 + up, r=10, shadow_a=0.35, dy=10, blur=10)
    hand(c, 0, -14, 140, k_hand, shadow_on=False)
    c.restore()
    e = pop(t, (eq_at or at) + 0.12)
    if t >= (eq_at or at) + 0.12:
        draw_text(c, '=', 680, y - 4, 110 * (0.5 + 0.5 * e), 'display', 800, YELLOW if not dim else PAPER_SHADE)
    bt = (eq_at or at) + 0.24
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


def s_send(c, t):
    """C. Closing the hand = pressing «إرسال»."""
    bg_navy(c, t)
    B = tw(33)                       # «الجهاز بفهم» - footage gives way to the explanation
    title_card(c, t, 9.98, 'تسكير الإيد = إرسال')
    if t < B:
        footage(c, t, 'm80_grab', t - 9.96, 9.96, seed=11)
        return
    PX, PY, PH = 330, 760, 600
    pe = spring(t, B, 14, 170, 0.8)
    lift = ease_io(lin(t, tw(40), tw(41) + 0.2))
    phone(c, PX, PY + (1 - pe) * 900, PH, lambda cv, r: screen_dino(cv, r, 1.0, lift), rot=-2,
          glow=0.5 * ease_io(lin(t, tw(36), tw(36) + 0.3)) * (1 - ease_io(lin(t, tw(42), tw(42) + 0.3))))
    he = spring(t, B + 0.1, 13, 160, 0.8)
    bob = lin(t, tw(46) - 0.15, tw(46)) * 14 * math.sin((t - tw(46)) * 7)
    hand(c, 780 + (1 - he) * 400, 650 + bob, 280, ease_io(lin(t, B + 0.15, B + 0.55)), rot=-6)
    if t >= tw(46):                  # «الإرسال»: the picture is sent off the screen
        u = ease_in(lin(t, tw(46), tw(46) + 0.6))
        path = skia.Path(); path.moveTo(PX, PY); path.quadTo(PX + 60, 300, 1180, 260)
        dashed_path(c, path, YELLOW, 6, 0.9, 16, 12, -(t * 60) % 28, trim=min(1, u * 1.3))
        x, y = along(path, u)
        file_card(c, x, y, 170 * (1 - 0.35 * u), rot=-8 + 20 * u, glow=1.0)
    if t >= tw(36) - 0.05:
        q = pop(t, tw(36) - 0.05)
        # dashed "intent" link from the fist to the phone
        k = ease_out(lin(t, tw(36), tw(36) + 0.35))
        path = skia.Path(); path.moveTo(660, 600); path.quadTo(560, 480, PX + 130, PY - 240)
        dashed_path(c, path, YELLOW, 6, 1, 16, 12, -(t * 60) % 28, trim=k)
    chip(c, 760, 900, 'هذا الملف', 34, PAPER_WHITE, CHARCOAL, rot=2, seed=51, t=t, at=tw(37))
    chip(c, 700, 980, 'هاي الصورة', 34, YELLOW, CHARCOAL, rot=-2, seed=52, t=t, at=tw(40))
    equation(c, t, 1170, 1.0, 'إرسال', True, tw(42), press_times=(tw(44), tw(45)))


def s_recv(c, t):
    """D. Opening the hand at the other device = pressing «استقبال»."""
    bg_navy(c, t)
    B = tw(53)
    title_card(c, t, 16.74, 'فتح الإيد = استقبال')
    if t < B:
        footage(c, t, 'pura_release', t - 16.72, 16.72, seed=12, rot=0.8)
        return
    PX, PY, PH = 330, 680, 520
    pe = spring(t, B, 14, 170, 0.8)
    land = ease_out(lin(t, tw(55), tw(55) + 0.5))
    phone(c, PX, PY + (1 - pe) * 900, PH, lambda cv, r: screen_dino(cv, r, land), rot=2,
          glow=0.6 * land * (1 - lin(t, tw(56) + 0.3, tw(57))))
    he = spring(t, B + 0.1, 13, 160, 0.8)
    bob = lin(t, tw(59) - 0.2, tw(59) + 0.1) * 14 * math.sin((t - tw(59)) * 6)
    hand(c, 780 + (1 - he) * 400, 560 + bob, 260, 1 - ease_io(lin(t, B + 0.2, B + 0.6)), rot=6 + bob * 0.2)
    if tw(55) - 0.2 <= t < tw(55) + 0.5:   # picture drops onto the screen
        u = ease_in(lin(t, tw(55) - 0.2, tw(55) + 0.05))
        file_card(c, lerp(560, PX, u), lerp(420, PY, u), 150 * (1 - 0.3 * u), rot=8 * (1 - u), alpha=1 - lin(t, tw(55) + 0.05, tw(55) + 0.35))
    equation(c, t, 975, 1.0, 'إرسال', True, B + 0.05, dim=1.0)
    equation(c, t, 1195, 0.0, 'استقبال', False, tw(57) - 0.05, press_times=(tw(58),))
    if t >= tw(59) + 0.1:            # «الاستقبال»: receive pulse keeps the beat alive
        for j in range(2):
            u = ((t - tw(59) - 0.1) / 0.7 + j * 0.5) % 1
            c.drawCircle(345, 1195, 110 + 170 * u, paint(YELLOW, 0.7 * (1 - u), stroke=5))


def s_wireless(c, t):
    """E. After the system checks, the file moves wirelessly between the two devices."""
    bg_cream(c, t)
    FLOOR = 1120
    floor(c, FLOOR)
    title_card(c, t, 22.18, 'الملف بينتقل بين الجهازين')
    A = (250, 830); Bp = (830, 830); PH = 520
    pa = spring(t, 22.16, 14, 170, 0.8)
    mv = ease_io(lin(t, tw(64), tw(65) + 0.5))
    arrived = t >= tw(65) + 0.5
    both = ease_io(lin(t, tw(67), tw(67) + 0.3))
    phone(c, A[0] - (1 - pa) * 600, A[1], PH, lambda cv, r: screen_dino(cv, r, 1.0, 0.5 * (mv > 0 and not arrived)), rot=-3, glow=both * 0.7)
    phone(c, Bp[0] + (1 - pa) * 600, Bp[1], PH, lambda cv, r: screen_dino(cv, r, 1.0 if arrived else 0.0), rot=3, glow=both * 0.7)
    # system checks: one stamp, no invented dialog
    if t >= tw(61) - 0.05:
        q = spring(t, tw(61) - 0.05, 14, 330, 0.8)
        badge(c, 540, 470, 'موافقات النظام ✓', TEAL, 32, -4, scale=1.5 - 0.5 * q, alpha=min(1, q * 2))
    if t >= tw(63) - 0.1:
        k = ease_out(lin(t, tw(63) - 0.1, tw(64)))
        path = wireless_arc(c, (A[0] + 110, A[1] - 120), (Bp[0] - 110, Bp[1] - 120), 240, t, k)
        wifi_glyph(c, 540, 660, 90, YELLOW, k=lin(t, tw(63), tw(64) + 0.3) * 1.2)
        if 0 < mv < 1:
            x, y = along(path, mv)
            file_card(c, x, y, 130, rot=-6 + 12 * mv, glow=1.0)
    if t >= tw(65) - 0.05:
        q = spring(t, tw(65) - 0.05, 11, 260, 0.6)
        hero_word(c, 540, 1225, 'لاسلكياً', 120, CHARCOAL, None, strip=YELLOW, seed=33, scale=0.4 + 0.6 * q, rot=-3)


def s_airdrop(c, t):
    """F. Comparison with the AirDrop idea: Bluetooth to discover, Wi-Fi Direct to transfer (general principle)."""
    bg_navy(c, t)
    title_card(c, t, tw(68) + 0.02, 'فكرة شبيهة بـ AirDrop')
    if t >= tw(70):
        q = pop(t, tw(70))
        label(c, 540, 350, 'AirDrop: ميزة مشاركة من Apple', 30, PAPER_WHITE, CHARCOAL, rot=1.5, seed=81, scale=0.6 + 0.4 * q, alpha=min(1, q * 2), family='label')
    A = (215, 760); Bp = (865, 760); PH = 300
    pa = spring(t, tw(68), 14, 170, 0.8)
    found = t >= tw(75)
    moved = ease_io(lin(t, tw(78), tw(79) + 0.3))
    phone(c, A[0] - (1 - pa) * 500, A[1], PH, lambda cv, r: screen_dino(cv, r, 1.0), rot=-3)
    phone(c, Bp[0] + (1 - pa) * 500, Bp[1], PH, lambda cv, r: screen_dino(cv, r, 1.0 if moved >= 1 else 0.0), rot=3,
          glow=0.7 if found and t < tw(76) else 0)
    # step 1: Bluetooth discovery (radar rings from the sender)
    if t >= tw(73) - 0.05:
        q = pop(t, tw(73) - 0.05)
        c.save(); c.translate(540, 560); c.scale(0.5 + 0.5 * q, 0.5 + 0.5 * q)
        paper_sheet(c, -230, -62, 460, 124, PAPER_WHITE, 82, r=6, shadow_a=0.35, dy=8, blur=8)
        c.drawRect(skia.Rect.MakeXYWH(150, -62, 80, 124), paint(NAVY_LIGHT))
        bt_glyph(c, 190, 0, 70, YELLOW)
        draw_text(c, 'بلوتوث', 130, -22, 40, 'display', 800, CHARCOAL, anchor='r')
        draw_text(c, '١ · اكتشاف الأجهزة', 130, 28, 28, 'label', 700, TEAL, anchor='r', alpha=clamp((t - tw(74)) * 4))
        c.restore()
        if t < tw(76) + 0.2:
            fade = 1 - lin(t, tw(76) - 0.1, tw(76) + 0.2)
            for j in range(3):
                u = ((t - tw(73)) * 0.8 + j / 3) % 1
                r = 60 + 600 * u
                c.save(); c.clipRect(skia.Rect.MakeLTRB(A[0], 600, 1080, 940))
                c.drawCircle(A[0], A[1], r, paint(PAPER, 0.6 * (1 - u) * fade, stroke=5))
                c.restore()
    # step 2: Wi-Fi Direct carries the file
    if t >= tw(76) - 0.05:
        q = pop(t, tw(76) - 0.05)
        c.save(); c.translate(540, 1000); c.scale(0.5 + 0.5 * q, 0.5 + 0.5 * q)
        paper_sheet(c, -260, -62, 520, 124, YELLOW, 83, r=6, shadow_a=0.35, dy=8, blur=8)
        c.drawRect(skia.Rect.MakeXYWH(180, -62, 80, 124), paint(CHARCOAL))
        wifi_glyph(c, 220, 22, 74, YELLOW)
        draw_text(c, 'واي فاي مباشر', 160, -22, 40, 'display', 800, CHARCOAL, anchor='r')
        draw_text(c, '٢ · نقل الملف (Wi‑Fi Direct)', 160, 28, 26, 'label', 700, CHARCOAL, anchor='r', alpha=clamp((t - tw(77)) * 4))
        c.restore()
        k = ease_out(lin(t, tw(76), tw(77)))
        a0, b0 = (A[0] + 80, A[1]), (Bp[0] - 80, Bp[1])
        c.drawLine(a0[0], a0[1], lerp(a0[0], b0[0], k), a0[1], paint(YELLOW, 0.35, stroke=26))
        path = skia.Path(); path.moveTo(*a0); path.lineTo(*b0)
        dashed_path(c, path, YELLOW, 8, 1, 22, 14, -(t * 90) % 36, trim=k)
        if 0 < moved < 1:
            file_card(c, lerp(a0[0], b0[0], moved), a0[1], 90, rot=-4, glow=1)
    draw_text(c, 'مقارنة بالمبدأ العام · التفاصيل التقنية تختلف حسب الجهاز والإصدار', W / 2, 1140, 25, 'label', 700, PAPER,
              alpha=0.85 * clamp((t - tw(73)) * 2))


def s_nothand(c, t):
    """G. The picture was never stored in the hand: the hand gives a command, the file travels between devices."""
    bg_cream(c, t)
    title_card(c, t, tw(80) + 0.02, 'الإيد ما حملت الصورة')
    C = tw(88)                                   # «هو بس أعطى أمر النقل»
    sh = ease_io(lin(t, C - 0.1, C + 0.4))
    hx, hy, hs = lerp(540, 540, sh), lerp(720, 440, sh), lerp(420, 210, sh)
    # ghost picture "inside" the fist + x-ray scan
    if t >= tw(81) - 0.05 and sh < 1:
        q = pop(t, tw(81) - 0.05)
        file_card(c, hx, hy + 10, 210 * (0.6 + 0.4 * q), rot=-4, alpha=(1 - sh) * min(1, q * 2), ghost=True)
    hand(c, hx, hy, hs, 1.0, rot=-4, alpha=1.0 if t < tw(81) else 0.82 if sh < 1 else 1.0)
    if tw(83) <= t < tw(84) + 0.2:
        u = lin(t, tw(83), tw(84) + 0.15)
        sy = hy - hs * 0.6 + hs * 1.3 * u
        c.drawRect(skia.Rect.MakeLTRB(hx - hs * 0.7, sy - 4, hx + hs * 0.7, sy + 4), paint(YELLOW))
    if t >= tw(84) and sh < 1:
        q = spring(t, tw(84), 12, 300, 0.6)
        a = 1 - sh
        L = 150 * (0.5 + 0.5 * q)
        c.drawLine(hx - L, hy - L * 1.2 + 10, hx + L, hy + L * 1.2 + 10, paint(TERRACOTTA, a, stroke=22))
        c.drawLine(hx + L, hy - L * 1.2 + 10, hx - L, hy + L * 1.2 + 10, paint(TERRACOTTA, a, stroke=22))
    if t >= tw(87) - 0.05 and sh < 1:
        q = spring(t, tw(87) - 0.05, 14, 330, 0.8)
        badge(c, 800, 1060, 'الإيد فاضية', TERRACOTTA, 40, -8, scale=(1.6 - 0.6 * q) * (1 - sh), alpha=min(1, q * 2) * (1 - sh))
    if t < C - 0.1: return
    # command lane (hand -> sender) and data lane (sender -> receiver)
    A = (250, 1000); Bp = (830, 1000); PH = 360
    pa = spring(t, C, 14, 170, 0.8)
    mv = ease_io(lin(t, tw(92), tw(93) + 0.3))
    phone(c, A[0] - (1 - pa) * 500, A[1], PH, lambda cv, r: screen_dino(cv, r, 1.0, 0.5 if 0 < mv < 1 else 0), rot=-3)
    phone(c, Bp[0] + (1 - pa) * 500, Bp[1], PH, lambda cv, r: screen_dino(cv, r, 1.0 if mv >= 1 else 0.0), rot=3,
          glow=0.6 if mv >= 1 else 0)
    if t >= tw(90) - 0.05:
        k = ease_out(lin(t, tw(90) - 0.05, tw(91)))
        path = skia.Path(); path.moveTo(hx - 30, hy + 140); path.quadTo(240, 640, A[0] + 20, A[1] - PH / 2 - 10)
        dashed_path(c, path, CHARCOAL, 4, 0.85, 10, 10, -(t * 50) % 20, trim=k)
        if k >= 1:
            u = (t - tw(91)) * 1.6 % 1
            x, y = along(path, u)
            c.drawRect(skia.Rect.MakeXYWH(x - 9, y - 9, 18, 18), paint(CHARCOAL))
        chip(c, 160, 640, 'أمر فقط', 32, PAPER_WHITE, CHARCOAL, rot=-4, seed=91, t=t, at=tw(91))
    if t >= tw(92) - 0.1:
        k = ease_out(lin(t, tw(92) - 0.1, tw(92) + 0.2))
        path = wireless_arc(c, (A[0] + 70, A[1] - 90), (Bp[0] - 70, Bp[1] - 90), 160, t, k)
        if 0 < mv < 1:
            x, y = along(path, mv); file_card(c, x, y, 100, glow=1)
        chip(c, 540, 1225, 'الملف: بين الجهازين', 34, YELLOW, CHARCOAL, rot=1.5, seed=92, t=t, at=tw(92) + 0.1)


MKT_SHOTS = [(36.42, 38.00, 'm70_grab', 0.0), (38.00, 40.64, 'm70_receive', 0.04), (40.64, 99.0, 'm80_release', 0.30)]


def s_marketing(c, t):
    """H. Echo of the opening demonstration, then the send / receive concept underneath it."""
    bg_navy(c, t)
    title_card(c, t, tw(95) + 0.02, 'وهون شطارة الماركتنج')
    for st, en, key, off in MKT_SHOTS:
        if st <= t < en:
            footage(c, t, key, t - st + off, st, seed=21 + int(st))
    # the concept under the gesture: two buttons under the print
    if t >= tw(98) - 0.05:
        draw_text(c, 'مشاركة ملفات =', 905, 1258, 34, 'display', 800, PAPER, anchor='r', alpha=clamp((t - tw(98)) * 4))
        q1 = pop(t, tw(98) + 0.1)
        action_button(c, 525, 1258, 'إرسال', True, scale=0.62 * (0.5 + 0.5 * q1), size=44)
        if t >= tw(99):
            q2 = pop(t, tw(99))
            action_button(c, 225, 1258, 'استقبال', False, scale=0.62 * (0.5 + 0.5 * q2), size=44)
    if t >= tw(101) - 0.05:
        q = spring(t, tw(101) - 0.05, 14, 330, 0.8)
        badge(c, 300, 455, 'تصميم تفاعل ذكي', TERRACOTTA, 36, -6, scale=1.6 - 0.6 * q, alpha=min(1, q * 2))
    if t >= tw(105) - 0.05:
        q = spring(t, tw(105) - 0.05, 12, 260, 0.6)
        hero_word(c, 700, 322, 'ماسك الصورة', 92, CHARCOAL, None, strip=YELLOW, seed=44, scale=0.4 + 0.6 * q, rot=-3)


SCENES = [(-1.0, 8.10, s_open), (8.10, 9.96, s_detect), (9.96, 16.72, s_send), (16.72, 22.16, s_recv),
          (22.16, 25.88, s_wireless), (25.88, 30.98, s_airdrop), (30.98, 36.42, s_nothand), (36.42, 99.0, s_marketing)]


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
