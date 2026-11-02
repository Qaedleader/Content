"""Microduck episode: narration-locked timeline, captions and scenes.

All times are narration seconds (Whisper word timings from 02_TIMING/whisper_words.json, corrected
spelling in 02_TIMING/words_display.json). The AAC stream starts at container pts 0.0479 s, so a video
frame f shows narration time  ta = f / 30 - AUDIO_PTS."""
import os, json, functools, glob, math
import skia
from brand import *

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(os.path.dirname(HERE))
RAW = os.path.join(PROJ, '03_MEDIA', 'raw')
FR = os.path.join(PROJ, '03_MEDIA', 'frames')
PK = os.path.join(RAW, 'presskit', 'microduck-press-kit')

AUDIO_PTS = 0.0      # verified: the source edit list skips 2112 priming samples, so narration starts at presentation 0
N_FRAMES = 1173          # 39.10 s >= 0.0479 + 38.9863 s of narration (held last frame, no audio stretch)

WORDS = json.load(open(os.path.join(PROJ, '02_TIMING', 'words_display.json'), encoding='utf-8'))
WD = WORDS['tokens']           # [{'w','s','e','hi'}]
CHUNKS = WORDS['chunks']       # [[from, to], ...]
CAPTIONS_OFF_FROM = 36.55      # closing question is shown as large type instead


# ---------------------------------------------------------------- media access
@functools.lru_cache(1)
def _index(): return json.load(open(os.path.join(FR, 'frames_index.json')))


@functools.lru_cache(48)
def _frame(key, i):
    files = _frame_files(key)
    return load_image(files[i], 3000)


@functools.lru_cache(16)
def _frame_files(key): return sorted(glob.glob(os.path.join(FR, key, '*.*')))


def clip(key, tl, loop=False, rate=1.0):
    files = _frame_files(key); n = len(files)
    i = int(max(0.0, tl) * rate * FPS + 1e-6)
    i = i % n if loop else min(i, n - 1)
    return _frame(key, i)


def img(name): return load_image(os.path.join(RAW, name) if not os.path.isabs(name) else name)


CLOSEUP = os.path.join(PK, 'PHOTOS', 'microduck-closeup.jpg')
MORNING = os.path.join(PK, 'PHOTOS', 'microduck-morning.jpg')
WORDMARK = os.path.join(PK, 'BRAND', 'microduck-wordmark.png')
SQUAD = os.path.join(RAW, 'microduck_squad.webp')
POLLEN = os.path.join(RAW, 'pollen-mark.png')
HF_SVG = os.path.join(RAW, 'hf-logo.svg')


def cutout(c, key, tl, cx, feet_y, height, alpha=1.0, loop=True, shadow_on=True):
    """Draw an alpha move clip standing on a floor line (feet at feet_y)."""
    im = clip(key, tl, loop=loop)
    s = height / im.height(); w = im.width() * s
    r = skia.Rect.MakeXYWH(cx - w / 2, feet_y - height, w, height)
    if shadow_on:
        c.drawOval(skia.Rect.MakeXYWH(cx - w * 0.42, feet_y - 14, w * 0.84, 26), paint('#140E08', 0.35 * alpha, blur=9))
    draw_image_rect(c, im, r, alpha=alpha)
    return r


# ---------------------------------------------------------------- captions
def caption_track(c, t):
    if t >= CAPTIONS_OFF_FROM: return
    lead = 1 / FPS
    active = None
    for k, (a, b) in enumerate(CHUNKS):
        start = WD[a]['s'] - lead
        nxt = WD[CHUNKS[k + 1][0]]['s'] - lead - 1 / FPS if k + 1 < len(CHUNKS) else 1e9
        end = min(nxt, WD[b]['e'] + 14 / FPS)
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


def tw(i): return WD[i]['s']      # word onset helper


# ---------------------------------------------------------------- scenes
def s_hook(c, t):
    """A. Sim twin -> real robot, matched timecode wipe on «وبعدين ينفّذ»."""
    bg_navy(c, t)
    x, y, w, h = 70, 345, 940, 928
    wipe0, wipe1 = tw(9) - 0.04, tw(9) + 0.36
    zoom = 1.0 + 0.07 * ease_io(lin(t, tw(13) - 0.1, tw(13) + 0.6))
    tl = max(0.0, t)

    def content(cv, r):
        sim = clip('hook_sim', tl); real = clip('hook_real', tl)
        src, s = cover_src(sim, r.width(), r.height(), 0.5, 0.45, zoom)
        draw_image_rect(cv, sim, r, src)
        k = ease_io(lin(t, wipe0, wipe1))
        if k > 0:
            ly = r.top() + r.height() * k
            cv.save(); cv.clipRect(skia.Rect.MakeLTRB(r.left(), r.top(), r.right(), ly))
            draw_image_rect(cv, real, r, src); cv.restore()
            if k < 1:   # yellow scan bar with pixel trail (Y2K detail)
                cv.drawRect(skia.Rect.MakeLTRB(r.left(), ly - 7, r.right(), ly + 7), paint(YELLOW))
                for j in range(14):
                    px = r.left() + rand(j * 5 + int(t * 30)) * r.width()
                    ps = 14 + 10 * rand(j * 3)
                    cv.drawRect(skia.Rect.MakeXYWH(px, ly + 9 + rand(j) * 30, ps, ps), paint(YELLOW, 0.8))
        corner_brackets(cv, r.makeInset(26, 26), YELLOW if k >= 0.5 else '#9FD6E8', 44, 7, 0.9)
    print_frame(c, x, y, w, h, content, rot=-1.2, seed=3)
    real_on = t >= (wipe0 + wipe1) / 2
    lab_p = pop(t, wipe0 + 0.15) if real_on else pop(t, -0.4)
    if real_on:
        label(c, 780, 420, 'الروبوت الحقيقي', 36, YELLOW, CHARCOAL, rot=2, seed=4, scale=0.6 + 0.4 * lab_p)
    else:
        label(c, 815, 420, 'نسخة افتراضية', 36, TEAL, PAPER_WHITE, rot=2, seed=4, scale=0.6 + 0.4 * lab_p)
    credit(c, 990, 1302, 'لقطات رسمية', 'Pollen Robotics · sim2real')
    title_card(c, t, -0.3, 'من عالم افتراضي… لقدّامك')


def s_name(c, t):
    """B + C(size). Product card, maker, then the 25 cm ruler."""
    bg_cream(c, t)
    FLOOR = 1190
    floor(c, FLOOR)
    t0 = 5.02
    size_on = tw(23) - 0.08                        # «طوله»
    title_card(c, t, t0 + 0.02, 'بطاقة تعريف', out=size_on - 0.25)
    title_card(c, t, size_on, 'قدّ إيش طوله؟')
    # robot cut-out (official render)
    enter = spring(t, t0, 14, 160, 0.8)
    glide = ease_io(lin(t, size_on, size_on + 0.45))
    rx = lerp(1250, 760, enter) + (650 - 760) * glide
    RH = 640
    r = cutout(c, 'cut_walk', t - t0, rx, FLOOR + 6, RH)
    credit(c, 1000, 1236, 'تصيير رسمي', 'Pollen Robotics')
    # hero name + official wordmark
    out_k = ease_in(lin(t, size_on - 0.2, size_on + 0.1))
    hp = spring(t, tw(15), 12, 260, 0.6)
    if t >= tw(15) and out_k < 1:
        hero_word(c, 540, 420 - out_k * 500, 'مايكرو دك', 150, CHARCOAL, None, strip=YELLOW, seed=7,
                  scale=0.5 + 0.5 * hp, rot=-2 + (1 - hp) * 8)
    if t >= tw(16) and out_k < 1:
        sp = spring(t, tw(16), 13, 300, 0.7)
        wm = load_image(WORDMARK, 1200)
        ww = 330 * (1.4 - 0.4 * sp); wh = ww * wm.height() / wm.width()
        c.save(); c.translate(275, 620 + out_k * 900); c.rotate(-7 + (1 - sp) * 12)
        draw_image_rect(c, wm, skia.Rect.MakeXYWH(-ww / 2, -wh / 2, ww, wh), alpha=min(1, sp * 3))
        c.restore()
    # maker cards
    cards_out = ease_in(lin(t, size_on - 0.25, size_on + 0.05))
    if t >= tw(18) - 0.05 and cards_out < 1:
        dy = cards_out * 900
        p1 = spring(t, tw(18) - 0.05, 13, 220, 0.7)
        c.save(); c.translate(0, dy + (1 - p1) * 60)
        if p1 > 0.01:
            c.saveLayerAlpha(None, int(min(1, p1 * 2) * 255))
            paper_sheet(c, 70, 760, 420, 130, PAPER_WHITE, 21, r=5, shadow_a=0.3, dy=10, blur=10)
            draw_text(c, 'الشركة المصنّعة', 470, 790, 24, 'label', 700, TERRACOTTA, anchor='r')
            pm = load_image(POLLEN, 400)
            draw_image_rect(c, pm, skia.Rect.MakeXYWH(92, 800, 72, 72))
            draw_text(c, 'Pollen Robotics', 178, 840, 40, 'display', 700, CHARCOAL, anchor='l')
            c.restore()
        if t >= tw(20):
            p2 = spring(t, tw(20), 13, 220, 0.7)
            c.saveLayerAlpha(None, int(min(1, p2 * 2) * 255))
            k = ease_out(lin(t, tw(20), tw(20) + 0.35))
            c.drawLine(280, 890, 280, 890 + 92 * k, paint(YELLOW, 1, stroke=7))
            c.drawCircle(280, 890, 9, paint(STEEL_DARK))
            c.translate(0, (1 - p2) * 60)
            paper_sheet(c, 70, 980, 420, 130, PAPER_WHITE, 22, r=5, shadow_a=0.3, dy=10, blur=10)
            draw_text(c, 'تابعة لـ', 470, 1010, 24, 'label', 700, TERRACOTTA, anchor='r')
            hf = load_svg(HF_SVG, 220)
            draw_image_rect(c, hf, skia.Rect.MakeXYWH(90, 1022, 76, 70))
            draw_text(c, 'Hugging Face', 178, 1060, 40, 'display', 700, CHARCOAL, anchor='l')
            c.restore()
        c.restore()
    # 25 cm ruler
    if t >= tw(23):
        top = FLOOR + 6 - RH + 14
        k = ease_out(lin(t, tw(23), tw(24) + 0.1))
        rxl = r.left() - 46
        yy = FLOOR - (FLOOR - top) * k
        c.drawRect(skia.Rect.MakeLTRB(rxl - 22, yy, rxl + 22, FLOOR), paint(YELLOW))
        c.drawRect(skia.Rect.MakeLTRB(rxl + 14, yy, rxl + 22, FLOOR), paint(YELLOW_SHADE))
        n = 25
        for i in range(n + 1):
            ty = FLOOR - (FLOOR - top) * i / n
            if ty < yy: break
            L = 30 if i % 5 == 0 else 16
            c.drawRect(skia.Rect.MakeXYWH(rxl - 22, ty - 2, L, 4), paint(CHARCOAL))
        if k >= 1:
            c.drawLine(rxl - 30, top, r.right() - 70, top, paint(CHARCOAL, 0.7, stroke=3))
        if t >= tw(24):
            p = spring(t, tw(24), 11, 300, 0.6)
            hero_word(c, 205, 560, '25 سم', 128, CHARCOAL, None, strip=YELLOW, seed=12, scale=0.4 + 0.6 * p, rot=-4)
            if t >= tw(25):
                q = pop(t, tw(25))
                label(c, 205, 690, 'طول الروبوت كامل', 30, PAPER_WHITE, CHARCOAL, rot=2, seed=9, scale=0.5 + 0.5 * q, alpha=min(1, q * 2))


def s_parts(c, t):
    """C. 15 motors + camera + motion/distance sensors, one fact at a time."""
    bg_navy(c, t)
    title_card(c, t, 10.80, 'شو جواته؟')
    ph = load_image(CLOSEUP, 2400)
    x, y, w, h = 330, 360, 640, 900
    inner = skia.Rect.MakeXYWH(x + 16, y + 16, w - 32, h - 32)
    zoom = 1.0 + 0.05 * lin(t, 10.8, 14.7)
    mp = cover_map(ph, inner, 0.5, 0.45, zoom)
    pe = spring(t, 10.78, 13, 170, 0.85)
    c.save(); c.translate((1 - pe) * 700, 0)
    print_frame(c, x, y, w, h, cover_draw(ph, 0.5, 0.45, zoom), rot=1.4, seed=8)
    credit(c, 960, 1290, 'صورة رسمية', 'Pollen Robotics press kit')
    c.restore()
    phase_b = tw(29) - 0.05         # «وكاميرا»
    # motors: big counter + 15 pixel squares
    shrink = ease_io(lin(t, phase_b - 0.1, phase_b + 0.25))
    if t >= tw(27):
        p = spring(t, tw(27) - 0.05, 11, 280, 0.6)
        n = int(clamp((t - tw(27)) / 0.5) * 15) if t >= tw(27) else 0
        cx = lerp(175, 120, shrink); cy = lerp(520, 420, shrink); sc = lerp(1.0, 0.55, shrink)
        hero_word(c, cx, cy, str(max(n, 0)) if n < 15 else '15', 190 * sc, YELLOW, CHARCOAL_SOFT if False else NAVY_DEEP, 9 * sc,
                  family='hero', scale=0.5 + 0.5 * p if t >= tw(28) - 0.05 else 0.5, alpha=1 if t >= tw(27) - 0.05 else 0)
        draw_text(c, 'محرّك', cx, cy + 120 * sc, 56 * sc, 'display', 800, PAPER, alpha=min(1, p * 2) if t >= tw(27) - 0.05 else 0)
        if shrink < 1:
            pixel_squares(c, 40 + 0 * shrink, 720, 15, 5, 44, 10, n, YELLOW, NAVY_LIGHT, 0.8 * (1 - shrink))
            if n > 0:
                draw_text(c, '15 درجة حرية', 175, 900, 26, 'label', 700, PAPER, alpha=0.8 * (1 - shrink) * clamp((t - tw(27)) * 3))
    # sensor callouts (one main fact at a time)
    items = [(tw(29), 'كاميرا', 'أمامية', (0.317, 0.333)),
             (tw(30), 'حساسات حركة', 'IMU ×2', None),
             (tw(32), 'حساس مسافة', 'LiDAR 8×8', None)]
    for k, (at, main, sub, pt) in enumerate(items):
        if t < at - 0.05: continue
        nxt = items[k + 1][0] if k + 1 < len(items) else 99
        dim = ease_io(lin(t, nxt - 0.05, nxt + 0.2))
        p = spring(t, at - 0.05, 12, 260, 0.6)
        cy = 640 + k * 190
        a = 1 - 0.5 * dim
        if pt:
            px, py = mp(*pt)
            px, py = px + 0, py + 0   # print rotation is small (1.4°); marker on the lens
            c.drawLine(40 + max(text_w(main, 40, 'display', 800), text_w(sub, 28, 'display', 600)) + 84, cy, px, py, paint(YELLOW, a * min(1, p * 2), stroke=5))
            ring = 26 + 6 * math.sin((t - at) * 8) * (1 - dim)
            c.drawCircle(px, py, ring, paint(YELLOW, a, stroke=6))
        c.save(); c.translate(0, (1 - p) * 40)
        sc = (0.6 + 0.4 * p) * (1 - 0.1 * dim)
        cw = max(text_w(main, 40, 'display', 800), text_w(sub, 28, 'display', 600)) + 84
        c.save(); c.translate(40 + cw / 2, cy); c.scale(sc, sc); c.rotate(-2 + k * 1.5)
        if a < 1: c.saveLayerAlpha(None, int(a * 255))
        paper_sheet(c, -cw / 2, -64, cw, 128, PAPER_WHITE, 30 + k, r=5, shadow_a=0.35, dy=8, blur=8)
        c.drawRect(skia.Rect.MakeXYWH(cw / 2 - 30, -64, 30, 128), paint(YELLOW))
        draw_text(c, main, cw / 2 - 46, -18, 40, 'display', 800, CHARCOAL, anchor='r')
        draw_text(c, sub, cw / 2 - 46, 32, 28, 'display' if not is_rtl(sub) else 'label', 600, TEAL, anchor='r')
        if a < 1: c.restore()
        c.restore(); c.restore()


def chip_icon(c, cx, cy, s, t, label_txt='RK3566'):
    """Stylised processor (explanatory illustration, not a photo of the real board)."""
    shadow(c, rrect(cx - s / 2, cy - s / 2, s, s, 14), dy=10, blur=12, a=0.4)
    for i in range(6):
        o = -s / 2 + s * (i + 0.5) / 6
        for (dx, dy, ww, hh) in ((o - 6, -s / 2 - 22, 12, 22), (o - 6, s / 2, 12, 22), (-s / 2 - 22, o - 6, 22, 12), (s / 2, o - 6, 22, 12)):
            c.drawRect(skia.Rect.MakeXYWH(cx + dx, cy + dy, ww, hh), paint(STEEL))
    c.drawRRect(rrect(cx - s / 2, cy - s / 2, s, s, 14), paint(CHARCOAL))
    c.drawRRect(rrect(cx - s / 2 + 18, cy - s / 2 + 18, s - 36, s - 36, 8), paint(CHARCOAL_SOFT))
    c.drawCircle(cx - s / 2 + 34, cy - s / 2 + 34, 7, paint(YELLOW))
    draw_text(c, label_txt, cx, cy, s * 0.17, 'mono', 700, YELLOW)


def s_compute(c, t):
    """C(cont). Onboard computer runs the movement policy locally (illustration)."""
    bg_navy(c, t)
    FLOOR = 1200
    floor(c, FLOOR, KRAFT, KRAFT_DARK)
    title_card(c, t, 14.72, 'كمبيوتر صغير على متنه')
    badge(c, 190, 330, 'رسم توضيحي', TERRACOTTA, 24, -4, alpha=clamp((t - 14.85) * 4))
    r = cutout(c, 'cut_walk', t - 14.7 + 3.0, 760, FLOOR + 6, 620)
    credit(c, 1000, 1246, 'تصيير رسمي', 'Pollen Robotics')
    p = spring(t, tw(33), 12, 220, 0.7)
    cx, cy = 270, 620
    if t >= tw(33) - 0.05:
        c.save(); c.translate(cx, cy); c.scale(0.4 + 0.6 * p, 0.4 + 0.6 * p); c.translate(-cx, -cy)
        chip_icon(c, cx, cy, 210, t)
        c.restore()
        draw_text(c, 'Rockchip RK3566', cx, cy + 165, 28, 'mono', 700, PAPER, alpha=clamp((t - tw(34)) * 4))
    # link chip -> robot body with travelling pulses («بيشغّل ذكاء الحركة»)
    if t >= tw(35) - 0.05:
        k = ease_out(lin(t, tw(35) - 0.05, tw(35) + 0.3))
        bx, by = r.left() + r.width() * 0.45, r.top() + r.height() * 0.42
        path = skia.Path(); path.moveTo(cx + 125, cy); path.cubicTo(cx + 230, cy - 120, bx - 120, by - 60, bx, by)
        dashed_path(c, path, YELLOW, 6, 1, 16, 12, -(t * 60) % 28, trim=k)
        if k >= 1:
            meas = skia.PathMeasure(path, False); L = meas.getLength()
            for j in range(3):
                u = ((t - tw(35)) * 0.9 + j / 3) % 1
                pos, _ = meas.getPosTan(L * u)
                c.drawRect(skia.Rect.MakeXYWH(pos.x() - 9, pos.y() - 9, 18, 18), paint(YELLOW))
            ring = 30 + 10 * math.sin(t * 9)
            c.drawCircle(bx, by, ring, paint(YELLOW, 0.85, stroke=5))
    # policy loop: 50 Hz
    if t >= tw(37) - 0.05:
        q = pop(t, tw(37) - 0.05)
        c.save(); c.translate(270, 900); c.scale(0.5 + 0.5 * q, 0.5 + 0.5 * q)
        paper_sheet(c, -170, -72, 340, 144, NAVY_DEEP, 41, r=8, shadow_a=0.35, dy=8, blur=8, fibre=0.15)
        bars = 12
        for i in range(bars):
            hgt = 14 + 40 * (0.5 + 0.5 * math.sin(t * 14 + i * 0.9))
            c.drawRect(skia.Rect.MakeXYWH(-150 + i * 25, 20 - hgt, 16, hgt), paint(YELLOW, 0.9))
        draw_text(c, 'ذكاء الحركة · 50 مرة/ث', 0, 46, 24, 'label', 700, PAPER)
        c.restore()
    if t >= tw(38) - 0.05:
        q = spring(t, tw(38) - 0.05, 14, 320, 0.8)
        hero_word(c, 280, 1080, 'محلياً', 110, CHARCOAL, None, strip=YELLOW, seed=19, scale=1.5 - 0.5 * q, rot=-5, alpha=min(1, q * 2))


SKILLS = [  # (start, end, clip key, tag, digit, credit)
    (17.26, tw(40), 'sk_walk', 'يمشي', '١', 'microduck_rl · GitHub'),
    (tw(40), 18.62, 'sk_sit', 'يقعد', '٢', 'Pollen Robotics · gallery'),
    (18.62, 20.05, 'sk_getup', 'يقوم بعد الوقعة', '٣', 'Pollen Robotics · launch film'),
    (20.05, tw(48) - 0.02, 'sk_skate', 'يتزحلق', '٤', 'pollen-robotics/microduck'),
    (tw(48) - 0.02, 21.92, 'sk_wheels', 'بملحق عجلات', '٤', 'Pollen Robotics · film'),
]


def s_skills(c, t):
    """D. Real footage per spoken skill, hard cuts on the words."""
    bg_cream(c, t)
    title_card(c, t, 17.28, 'مهارات حقيقية')
    cur = SKILLS[0]
    for s in SKILLS:
        if t >= s[0] - 1 / 60: cur = s
    st, en, key, tag, dg, cr = cur
    thump = 1 + 0.02 * (1 - ease_out(lin(t, st, st + 0.18)))
    x, y, w, h = 50, 370, 980, 750
    c.save(); c.translate(W / 2, y + h / 2); c.scale(thump, thump); c.translate(-W / 2, -(y + h / 2))
    print_frame(c, x, y, w, h, cover_draw(clip(key, t - st)), rot=-0.8, seed=14)
    c.restore()
    credit(c, 1010, 1148, 'لقطات حقيقية', cr)
    # skill tag (V3 numbered label style)
    p = pop(t, st)
    tw_ = text_w(tag, 44, 'display', 800)
    bw = tw_ + 40 + 70
    c.save(); c.translate(1000 - bw / 2, 1215); c.rotate(-1.5); c.scale(0.7 + 0.3 * p, 0.7 + 0.3 * p)
    paper_sheet(c, -bw / 2, -40, bw, 80, PAPER_WHITE, 51, r=4, shadow_a=0.3, dy=6, blur=6)
    c.drawRect(skia.Rect.MakeXYWH(bw / 2 - 64, -32, 56, 64), paint(YELLOW))
    draw_text(c, dg, bw / 2 - 36, 0, 40, 'display', 800, CHARCOAL)
    draw_text(c, tag, bw / 2 - 80, 0, 44, 'display', 800, CHARCOAL, anchor='r')
    c.restore()
    done = sum(1 for s in SKILLS[:4] if t >= s[0])
    pixel_squares(c, 70, 1195, 4, 4, 38, 10, done, YELLOW, NAVY_LIGHT, 0.35, rtl=True)


def repo_window(c, x, y, w, h, title, lines, seed, rot):
    c.save(); c.rotate(rot, x + w / 2, y + h / 2)
    paper_sheet(c, x, y, w, h, PAPER_WHITE, seed, r=6, shadow_a=0.36, dy=14, blur=14)
    c.drawRect(skia.Rect.MakeXYWH(x, y, w, 56), paint(CHARCOAL))
    for i, cc in enumerate((TERRACOTTA, YELLOW, SAGE)):
        c.drawRect(skia.Rect.MakeXYWH(x + 20 + i * 30, y + 18, 20, 20), paint(cc))
    draw_text(c, title, x + w - 20, y + 28, 26, 'mono', 700, PAPER, anchor='r')
    for i, ln in enumerate(lines):
        draw_text(c, ln, x + 30, y + 100 + i * 50, 28, 'mono', 600, CHARCOAL, anchor='l')
    c.restore()


def s_open(c, t):
    """E1. Open-source software (the two real repositories)."""
    bg_navy(c, t)
    title_card(c, t, 21.92, 'برمجياته مفتوحة')
    dz = 1 + 0.035 * ease_io(lin(t, 21.9, 24.75))
    c.save(); c.translate(W / 2, 760); c.scale(dz, dz); c.rotate(0.6 * lin(t, 21.9, 24.75)); c.translate(-W / 2, -760)
    p1 = spring(t, 21.95, 13, 200, 0.8)
    if t >= 21.95:
        c.save(); c.translate((1 - p1) * -900, 0)
        repo_window(c, 70, 380, 760, 250, 'pollen-robotics/microduck', ['> SDK + runtime', '> 7 trained moves'], 61, -2)
        c.restore()
    p2 = spring(t, tw(50), 13, 200, 0.8)
    if t >= tw(50):
        c.save(); c.translate((1 - p2) * 900, 0)
        repo_window(c, 230, 600, 780, 300, 'pollen-robotics/microduck_rl', ['> MuJoCo + PPO training', '> sim2real recipe', '> export -> ONNX'], 62, 1.5)
        c.restore()
    if t >= tw(52):
        q = spring(t, tw(52), 14, 320, 0.8)
        badge(c, 840, 860, 'Apache 2.0', TERRACOTTA, 30, -8, scale=1.6 - 0.6 * q, alpha=min(1, q * 2))
    if t >= tw(51) - 0.05:
        q = spring(t, tw(51) - 0.05, 11, 260, 0.6)
        hero_word(c, 540, 1040, 'Open Source', 140, YELLOW, NAVY_DEEP, 10, scale=0.4 + 0.6 * q, rot=-3)
    if t >= tw(53):
        q = pop(t, tw(53))
        label(c, 540, 1175, 'مفتوحة المصدر · مجاناً على GitHub', 38, PAPER_WHITE, CHARCOAL, rot=1.5, seed=66, scale=0.6 + 0.4 * q, alpha=min(1, q * 2))
    pixel_cursor(c, 900 + boil(t, 3, 2), 520 + 120 * ease_io(lin(t, 22.5, 23.4)) + 40 * ease_io(lin(t, 24.0, 24.7)), 5)
    c.restore()


def s_train(c, t):
    """E2. Parallel practice in simulation (explanatory grid built from the official sim footage)."""
    bg_navy(c, t)
    title_card(c, t, 24.74, 'تدريب بالمحاكاة')
    n_on = int(clamp((t - tw(55)) / max(0.1, tw(58) - tw(55))) * 16) if t >= tw(55) else 0
    n_on = max(n_on, 1 if t >= tw(55) - 0.05 else 0)
    order = sorted(range(16), key=lambda i: (abs(i % 4 - 1.5) + abs(i // 4 - 1.5), i))
    S, G = 190, 14
    x0 = (W - (4 * S + 3 * G)) / 2; y0 = 360
    checks_from = tw(61)
    for rank, i in enumerate(order):
        if rank >= n_on: continue
        col_, row = i % 4, i // 4
        x = x0 + col_ * (S + G); y = y0 + row * (S + G)
        appear = tw(55) + rank * (tw(58) - tw(55)) / 16
        p = pop(t, appear)
        key = 'hook_sim' if i % 2 == 0 else 'tr_sim'
        frm = clip(key, (t - 24.7) + i * 0.37, loop=True)
        src = skia.Rect.MakeXYWH(250, 160, 560, 560) if key == 'hook_sim' else skia.Rect.MakeXYWH(130, 60, 560, 560)
        c.save(); c.translate(x + S / 2, y + S / 2); c.scale(0.3 + 0.7 * p, 0.3 + 0.7 * p)
        rr = rrect(-S / 2, -S / 2, S, S, 6)
        c.drawRRect(rr, paint(PAPER_WHITE))
        inner = skia.Rect.MakeXYWH(-S / 2 + 6, -S / 2 + 6, S - 12, S - 12)
        draw_image_rect(c, frm, inner, src, hq=False)
        done = t >= checks_from + rank * 0.05
        if done:
            q = pop(t, checks_from + rank * 0.05)
            c.drawRRect(rr, paint(YELLOW, 1, stroke=7))
            c.save(); c.translate(S / 2 - 30, -S / 2 + 30); c.scale(q, q)
            c.drawCircle(0, 0, 22, paint(YELLOW))
            ck = skia.Path(); ck.moveTo(-10, 0); ck.lineTo(-3, 8); ck.lineTo(11, -8)
            c.drawPath(ck, paint(CHARCOAL, 1, stroke=5))
            c.restore()
        c.restore()
    # training progress (pixel bar) + honesty notes
    if t >= tw(55):
        k = lin(t, tw(55), 27.6)
        bx, by, bw = x0, 1180, 4 * S + 3 * G
        draw_text(c, 'التدريب', bx + bw, by - 26, 26, 'label', 700, PAPER, anchor='r')
        cells = 28; cw = (bw - (cells - 1) * 4) / cells
        for j in range(cells):
            on = j < int(k * cells)
            c.drawRect(skia.Rect.MakeXYWH(bx + bw - (j + 1) * cw - j * 4, by, cw, 22), paint(YELLOW if on else NAVY_LIGHT, 1 if on else 0.6))
        badge(c, 170, 330, 'محاكاة', TEAL, 24, -4, bg='#FBF8F1')
        draw_text(c, 'توضيح: لقطة المحاكاة الرسمية مكرّرة · مثال المستودع يدرّب 4096 نسخة معاً', W / 2, 1248, 25, 'label', 700, PAPER, alpha=0.9)
    if t >= tw(61):
        q = spring(t, tw(61), 12, 280, 0.6)
        label(c, 540, 770, 'مهارات جديدة', 50, YELLOW, CHARCOAL, rot=-3, seed=77, scale=0.5 + 0.5 * q, alpha=min(1, q * 2))


def file_token(c, cx, cy, s=1.0, rot=0.0, glow=0.0):
    """policy.onnx file card (the exported movement model)."""
    c.save(); c.translate(cx, cy); c.rotate(rot); c.scale(s, s)
    if glow > 0: c.drawCircle(0, 0, 120, paint(YELLOW, 0.35 * glow, blur=30))
    path = skia.Path(); path.moveTo(-90, -110); path.lineTo(50, -110); path.lineTo(90, -70); path.lineTo(90, 110); path.lineTo(-90, 110); path.close()
    c.save(); c.translate(0, 8); c.drawPath(path, paint('#140E08', 0.35, blur=8)); c.restore()
    c.drawPath(path, paint(PAPER_WHITE))
    fold = skia.Path(); fold.moveTo(50, -110); fold.lineTo(50, -70); fold.lineTo(90, -70); fold.close()
    c.drawPath(fold, paint(PAPER_SHADE))
    c.drawRect(skia.Rect.MakeXYWH(-90, -10, 180, 56), paint(YELLOW))
    draw_text(c, 'ONNX', 0, 18, 34, 'mono', 800, CHARCOAL)
    draw_text(c, 'policy', 0, -50, 30, 'mono', 700, CHARCOAL)
    draw_text(c, 'النموذج', 0, 78, 26, 'label', 700, TEAL)
    c.restore()


def s_transfer(c, t):
    """E3. Trained policy file moves from the simulated twin to the real body (matched timecode)."""
    bg_cream(c, t)
    title_card(c, t, 27.80, 'من المحاكاة… للجسم الحقيقي')
    tl = t - 27.78
    def half(key):
        def f(cv, r):
            im = clip(key, tl)
            src, s = cover_src(im, r.width(), r.height(), 0.5, 0.42)
            draw_image_rect(cv, im, r, src)
        return f
    print_frame(c, 70, 350, 580, 430, half('tr_sim'), rot=-2, seed=81)
    print_frame(c, 430, 840, 580, 430, half('tr_real'), rot=1.6, seed=82)
    # role labels
    a1 = pop(t, 27.85)
    c.save(); c.translate(860, 520); c.scale(0.6 + 0.4 * a1, 0.6 + 0.4 * a1); c.rotate(2)
    paper_sheet(c, -170, -70, 340, 140, TEAL, 83, r=5, shadow_a=0.3)
    draw_text(c, 'التدريب', 150, -22, 40, 'display', 800, PAPER_WHITE, anchor='r')
    draw_text(c, 'على كمبيوتر خارجي', 150, 30, 28, 'label', 700, PAPER_WHITE, anchor='r')
    c.restore()
    a2 = pop(t, tw(66))
    c.save(); c.translate(225, 1060); c.scale(0.6 + 0.4 * a2, 0.6 + 0.4 * a2); c.rotate(-2)
    paper_sheet(c, -170, -70, 340, 140, YELLOW, 84, r=5, shadow_a=0.3)
    draw_text(c, 'التنفيذ', 150, -22, 40, 'display', 800, CHARCOAL, anchor='r')
    draw_text(c, 'على الروبوت نفسه', 150, 30, 28, 'label', 700, CHARCOAL, anchor='r')
    c.restore()
    credit(c, 1000, 1300, 'لقطات رسمية', 'Pollen Robotics · sim2real')
    # file travels on «النموذج» -> lands on «الحقيقي»
    path = skia.Path(); path.moveTo(360, 640); path.cubicTo(700, 700, 800, 760, 720, 1010)
    k = ease_io(lin(t, tw(65) - 0.05, tw(67)))
    if t >= 27.82:
        dashed_path(c, path, CHARCOAL, 5, 0.55, 14, 12, -(t * 50) % 26)
        meas = skia.PathMeasure(path, False); pos, _ = meas.getPosTan(meas.getLength() * k)
        sp = pop(t, 27.82)
        land = pop(t, tw(67)) if t >= tw(67) else 0
        file_token(c, pos.x(), pos.y(), 0.75 * sp * (1 - 0.15 * land), -6 + 12 * k, glow=land)
        if t >= tw(67):
            rr = 40 + 160 * ease_out(lin(t, tw(67), tw(67) + 0.5))
            c.drawCircle(720, 1010, rr, paint(YELLOW, 1 - lin(t, tw(67), tw(67) + 0.5), stroke=8))


def s_lab(c, t):
    """F. A small robotics lab: real robot, its simulated twin, the policy file and the real train command."""
    bg_cream(c, t)
    floor(c, 1250)
    title_card(c, t, tw(68) + 0.02, 'مختبر روبوتات صغير')
    ph = load_image(MORNING, 2400)
    pe = spring(t, tw(68), 13, 170, 0.85)
    c.save(); c.translate(0, (1 - pe) * 900)
    print_frame(c, 50, 430, 840, 560, cover_draw(ph, 0.42, 0.5, 1.0 + 0.04 * lin(t, 29.5, 32.6)), rot=-1.5, seed=91)
    credit(c, 880, 1010, 'صورة رسمية', 'Pollen Robotics press kit')
    c.restore()
    if t >= tw(70) - 0.05:
        q = spring(t, tw(70) - 0.05, 12, 240, 0.7)
        def sim(cv, r):
            im = clip('tr_sim', t - 29.0, loop=True)
            src, s = cover_src(im, r.width(), r.height(), 0.5, 0.4)
            draw_image_rect(cv, im, r, src)
        c.save(); c.translate(820, 420); c.scale(0.4 + 0.6 * q, 0.4 + 0.6 * q); c.translate(-820, -420)
        print_frame(c, 660, 300, 330, 300, sim, rot=5, seed=92, border=12)
        badge(c, 830, 620, 'التوأم الافتراضي', TEAL, 22, 3)
        c.restore()
    if t >= tw(71):
        q = spring(t, tw(71), 12, 240, 0.7)
        file_token(c, 170, 1120, 0.62 * q, -8)
    if t >= tw(72):
        q = spring(t, tw(72), 12, 240, 0.7)
        c.save(); c.translate(620, 1130); c.scale(0.5 + 0.5 * q, 0.5 + 0.5 * q); c.rotate(2)
        paper_sheet(c, -330, -80, 660, 160, CHARCOAL, 93, r=8, shadow_a=0.4, fibre=0.12)
        cmd = '$ uv run train Mjlab-Velocity-Flat-MicroDuck'
        n = int(clamp((t - tw(72)) * 40) * len(cmd)) if t < tw(72) + 1.5 else len(cmd)
        draw_text(c, cmd[:max(1, n)], -305, -28, 23, 'mono', 700, YELLOW, anchor='l')
        draw_text(c, '$ uv run scripts/infer_policy.py --walking walk.onnx', -305, 22, 19, 'mono', 600, PAPER, alpha=clamp((t - tw(74)) * 3), anchor='l')
        draw_text(c, 'أوامر من المستودع microduck_rl', 300, 62, 18, 'label', 700, STEEL, anchor='r')
        c.restore()
    if t >= tw(75) - 0.05:
        q = pop(t, tw(75) - 0.05)
        label(c, 860, 1000, 'طوّره بإيدك', 40, YELLOW, CHARCOAL, rot=-4, seed=95, scale=0.5 + 0.5 * q, alpha=min(1, q * 2))
        pixel_cursor(c, 930 + boil(t, 5, 2), 1030, 5)


def s_price(c, t):
    """G. Price reveal with the published 399 $ detail, pre-order, taxes & shipping excluded."""
    bg_navy(c, t)
    FLOOR = 1240
    floor(c, FLOOR)
    title_card(c, t, tw(76) + 0.02, 'كم سعره؟')
    sq = load_image(SQUAD, 2000)
    qs = spring(t, 32.64, 14, 160, 0.8)
    sw = 760; sh = sw * sq.height() / sq.width()
    draw_image_rect(c, sq, skia.Rect.MakeXYWH(W / 2 - sw / 2, FLOOR + 8 - sh + (1 - qs) * 400, sw, sh))
    credit(c, 1000, 1286, 'تصيير رسمي', 'Pollen Robotics · 4 colourways')
    # hanging price tag
    if t >= tw(77) - 0.1:
        pt = spring(t, tw(77) - 0.1, 9, 120, 0.9)
        swing = math.sin((t - tw(77)) * 5) * 6 * math.exp(-(t - tw(77)) * 1.4)
        tx, ty, twd, th = W / 2, 400, 600, 470
        c.save(); c.translate(0, (1 - pt) * -800); c.rotate(swing, tx, 300)
        c.drawLine(tx, 290, tx, ty + 30, paint(CHARCOAL, 1, stroke=4))
        tag = skia.Path(); x0 = tx - twd / 2
        tag.moveTo(x0 + 70, ty); tag.lineTo(x0 + twd - 70, ty); tag.lineTo(x0 + twd, ty + 70); tag.lineTo(x0 + twd, ty + th)
        tag.lineTo(x0, ty + th); tag.lineTo(x0, ty + 70); tag.close()
        c.save(); c.translate(0, 18); c.drawPath(tag, paint('#140E08', 0.4, blur=16)); c.restore()
        c.drawPath(tag, paint(PAPER_WHITE))
        c.save(); c.clipPath(tag, doAntiAlias=True)
        c.drawRect(skia.Rect.MakeXYWH(x0, ty, twd, th), tex_paint('paper_fibers.png', 0.55, skia.BlendMode.kMultiply, 0.5))
        c.restore()
        c.drawCircle(tx, ty + 40, 14, paint(NAVY)); c.drawCircle(tx, ty + 40, 14, paint(STEEL_DARK, 1, stroke=4))
        draw_text(c, 'حوالي', tx, ty + 105, 50, 'display', 800, CHARCOAL)
        if t >= tw(78) - 0.05:
            q = spring(t, tw(78) - 0.05, 10, 300, 0.6)
            hero_word(c, tx, ty + 235, '400$', 190, CHARCOAL, None, strip=YELLOW, seed=101, scale=0.4 + 0.6 * q, rot=-2)
        if t >= tw(79):
            q = pop(t, tw(79))
            wa = text_w('السعر المعلن:', 34, 'label', 700); wb = text_w('399$', 34, 'display', 700); x0_ = tx + (wa + wb + 12) / 2
            draw_text(c, 'السعر المعلن:', x0_, ty + 360, 34, 'label', 700, TEAL, alpha=min(1, q * 2), anchor='r')
            draw_text(c, '399$', x0_ - wa - 12, ty + 362, 34, 'display', 700, TEAL, alpha=min(1, q * 2), anchor='r')
        if t >= tw(82) - 0.05:
            q = pop(t, tw(82) - 0.05)
            c.save(); c.translate(tx, ty + 425); c.scale(0.6 + 0.4 * q, 0.6 + 0.4 * q)
            sw2 = text_w('لا يشمل الشحن والضرائب', 32, 'label', 700) + 50
            c.drawRect(skia.Rect.MakeXYWH(-sw2 / 2, -26, sw2, 52), paint(CHARCOAL))
            draw_text(c, 'لا يشمل الشحن والضرائب', 0, 0, 32, 'label', 700, PAPER)
            c.restore()
        c.restore()
    if t >= tw(80) - 0.05:
        q = spring(t, tw(80) - 0.05, 14, 330, 0.8)
        badge(c, 830, 440, 'حجز مسبق', TERRACOTTA, 40, -10, scale=1.7 - 0.7 * q, alpha=min(1, q * 2))
    if t >= tw(83):
        draw_text(c, 'الإطلاق في أمريكا الشمالية وأوروبا · التسليم غير فوري', W / 2, 940, 26, 'label', 700, PAPER, alpha=0.9 * clamp((t - tw(83)) * 3))


def s_close(c, t):
    """H. Closing question, large and calm, on Microduck."""
    bg_cream(c, t)
    FLOOR = 1290
    floor(c, FLOOR)
    drift = 1 + 0.025 * lin(t, 36.55, 39.1)
    c.save(); c.translate(W / 2, 1000); c.scale(drift, drift); c.translate(-W / 2, -1000)
    cutout(c, 'cut_walk', t - 36.55 + 1.2, 540, FLOOR + 6, 560)
    c.restore()
    credit(c, 1000, 1336, 'تصيير رسمي', 'Pollen Robotics')
    a = 36.58
    if t >= a:
        q = spring(t, a, 13, 210, 0.8)
        draw_text(c, 'انت لو عندك واحد…', W / 2, 300 + (1 - q) * -60, 64, 'display', 800, CHARCOAL, alpha=min(1, q * 2))
    if t >= tw(85 + 4) - 0.05:   # «شو»
        q = spring(t, tw(89) - 0.05, 11, 260, 0.6)
        hero_word(c, W / 2, 450, 'شو أوّل حركة', 140, CHARCOAL, None, strip=YELLOW, seed=121, scale=0.45 + 0.55 * q, rot=-2)
    if t >= tw(92) - 0.05:      # «بتعلّمه»
        q = spring(t, tw(92) - 0.05, 12, 240, 0.7)
        hero_word(c, W / 2, 610, 'بتعلّمه إياها؟', 118, CHARCOAL, None, scale=0.5 + 0.5 * q, rot=1.5, alpha=min(1, q * 2))


# ---------------------------------------------------------------- revision 2 (shots 1-2 only)
REV2_PRINT = (40, 400, 1000, 750)     # 4:3 taped print, inner 968x718 ~ native 960x720 crops (no upscaling)
SKATE_TRACK = [(0.0, 0.76), (0.7, 0.76), (1.7, 0.745), (2.2, 0.71), (2.7, 0.68), (3.2, 0.67), (3.7, 0.64),
               (4.2, 0.58), (4.7, 0.44), (5.2, 0.18), (5.8, 0.12)]   # measured robot x in it_rolls.mp4 from 15.3 s


def _track(tl, kf):
    for (t0, v0), (t1, v1) in zip(kf[:-1], kf[1:]):
        if tl <= t1: return lerp(v0, v1, ease_io(lin(tl, t0, t1)))
    return kf[-1][1]


def s_hook_r2(c, t):
    """Shot 1 (rev 2): real footage, two Microducks striding at the camera (microduck_rl montage)."""
    bg_navy(c, t)
    x, y, w, h = REV2_PRINT
    print_frame(c, x, y, w, h, cover_draw(clip('r2_walk', t)), rot=-0.8, seed=3)
    credit(c, 1030, 1178, 'لقطات حقيقية', 'pollen-robotics/microduck_rl')
    title_card(c, t, -1.0, 'من عالم افتراضي… لقدّامك')


def s_name_r2(c, t):
    """Shot 2 (rev 2): real footage, Microduck roller-skating toward camera (tracking crop, no upscale)."""
    bg_cream(c, t)
    tl = t - 5.02
    x, y, w, h = REV2_PRINT
    im = clip('r2_skate', tl)
    print_frame(c, x, y, w, h, cover_draw(im, _track(tl, SKATE_TRACK), 0.36, 1.5167), rot=-0.8, seed=14)
    credit(c, 1030, 1178, 'لقطات حقيقية', 'pollen-robotics/microduck')
    size_on = tw(23) - 0.08
    title_card(c, t, 5.04, 'اسمه مايكرو دك', out=size_on - 0.25)
    title_card(c, t, size_on, 'طوله 25 سم')


REVISION = os.environ.get('MD_REV', '1')

SCENES = [(-1.0, 5.02, s_hook), (5.02, 10.78, s_name), (10.78, 14.70, s_parts), (14.70, 17.26, s_compute),
          (17.26, 21.92, s_skills), (21.92, 24.72, s_open), (24.72, 27.78, s_train), (27.78, 29.47, s_transfer),
          (29.47, 32.64, s_lab), (32.64, 36.55, s_price), (36.55, 99.0, s_close)]
if REVISION == '2':
    SCENES = [(-1.0, 5.02, s_hook_r2), (5.02, 10.78, s_name_r2)] + SCENES[2:]


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
