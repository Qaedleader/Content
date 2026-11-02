"""How to do any website (video 6): narration-locked timeline, captions and scenes.

Same Paper Workshop toolkit as Videos 4-5 (brand.py copied unchanged). Times are narration seconds from
02_TIMING/words_display.json; the m4a edit list skips the priming samples, so narration starts at
presentation 0:  t = f / 30.  One example project carries the whole episode: the café site «سُكّر»
(repo sukkar-coffee). It is an explanatory example, labelled as such - not a real deployment."""
import os, json, functools, glob, math
import skia
from brand import *

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(os.path.dirname(HERE))
FR = os.path.join(PROJ, '03_MEDIA', 'frames')
RAW = os.path.join(PROJ, '03_MEDIA', 'raw')

AUDIO_PTS = 0.0
N_FRAMES = 900           # exactly 30.000 s; narration (29.629 s) plays from t = 0, picture holds to frame 899

WORDS = json.load(open(os.path.join(PROJ, '02_TIMING', 'words_display.json'), encoding='utf-8'))
WD = WORDS['tokens']
CHUNKS = WORDS['chunks']


def tw(i): return WD[i]['s']


REPO = 'sukkar-coffee'
URL = 'sukkar-coffee.vercel.app'
VSCODE = os.path.join(RAW, 'vscode_product-screenshot.png')
VSTERM = os.path.join(RAW, 'vscode_integrated-terminal.png')
GH_NEW = os.path.join(RAW, 'github_repo-create-nav.png')
VC_IMPORT = os.path.join(RAW, 'vercel_repo-list-dark.png')


@functools.lru_cache(16)
def _frame_files(key): return sorted(glob.glob(os.path.join(FR, key, '*.*')))


@functools.lru_cache(40)
def _frame(key, i): return load_image(_frame_files(key)[i], 3000)


def clip(key, tl, loop=False):
    files = _frame_files(key); n = len(files)
    i = int(max(0.0, tl) * FPS + 1e-6)
    return _frame(key, i % n if loop else min(i, n - 1))


# ---------------------------------------------------------------- captions (Video 4/5 system)
def caption_track(c, t):
    lead = 1 / FPS
    active = None
    for k, (a, b) in enumerate(CHUNKS):
        start = WD[a]['s'] - lead
        nxt = WD[CHUNKS[k + 1][0]]['s'] - lead - 1 / FPS if k + 1 < len(CHUNKS) else 1e9
        end = min(nxt, WD[b]['e'] + 14 / FPS)
        if k + 1 == len(CHUNKS): end = 1e9
        if start <= t <= end: active = (a, b)
    if not active: return
    a, b = active
    idx = list(range(a, b + 1))
    chars = sum(len(WD[i]['w']) for i in idx) + len(idx)
    size = 58 if chars > 22 else 64 if chars > 16 else 70
    gap = 12
    widths = [word_w(WD[i]['w'], size) for i in idx]
    total = sum(widths) + gap * (len(idx) - 1)
    x = W / 2 + total / 2
    for i, w in zip(idx, widths):
        cx = x - w / 2; x -= w + gap
        at = WD[i]['s'] - lead
        if t < at: continue
        p = pop(t, at)
        r = (rand(i * 7 + 3) - 0.5) * 6; dy = (rand(i * 13 + 5) - 0.5) * 14
        hi = WD[i].get('hi', False)
        paper_word(c, cx, SAFE_CAPTION_Y + dy + (1 - p) * 24, WD[i]['w'], size, YELLOW if hi else PAPER, CHARCOAL,
                   seed=i + 11, scale=0.55 + 0.45 * p, rot=r + (1 - p) * 8)


# ---------------------------------------------------------------- shared props
def phone(c, cx, cy, h, screen=None, rot=0.0, alpha=1.0, glow=0.0):
    if alpha <= 0: return None
    w = h * 0.49
    c.save(); c.translate(cx, cy); c.rotate(rot)
    if alpha < 1: c.saveLayerAlpha(None, int(alpha * 255))
    if glow > 0:
        c.drawRRect(rrect(-w / 2 - 14, -h / 2 - 14, w + 28, h + 28, h * 0.1), paint(YELLOW, 0.55 * glow, blur=26))
    body = rrect(-w / 2, -h / 2, w, h, h * 0.085)
    shadow(c, body, dy=16, blur=16, a=0.38)
    c.drawRRect(body, paint(CHARCOAL))
    inset = h * 0.028
    sr = skia.Rect.MakeXYWH(-w / 2 + inset, -h / 2 + inset, w - 2 * inset, h - 2 * inset)
    c.save(); c.clipRRect(skia.RRect.MakeRectXY(sr, h * 0.06, h * 0.06), doAntiAlias=True)
    c.drawRect(sr, paint(PAPER_WHITE))
    if screen: screen(c, sr)
    c.restore()
    c.drawRRect(rrect(-w * 0.13, -h / 2 + inset + 8, w * 0.26, h * 0.028, h * 0.014), paint(CHARCOAL))
    if alpha < 1: c.restore()
    c.restore()


def window(c, x, y, w, h, content, title='', dark=False, rot=0.0, seed=1, alpha=1.0, address=None, bar=58):
    """Paper app window: title bar (3 squares, optional address pill), content(c, rect) clipped below it."""
    if alpha <= 0: return
    c.save(); c.rotate(rot, x + w / 2, y + h / 2)
    if alpha < 1: c.saveLayerAlpha(None, int(alpha * 255))
    paper_sheet(c, x, y, w, h, '#1B1F24' if dark else PAPER_WHITE, seed, r=10, shadow_a=0.38, dy=16, blur=16, fibre=0.12 if dark else 0.45)
    c.save(); c.clipRRect(rrect(x, y, w, h, 10), doAntiAlias=True)
    c.drawRect(skia.Rect.MakeXYWH(x, y, w, bar), paint(CHARCOAL if not dark else '#0F1216'))
    for i, cc in enumerate((TERRACOTTA, YELLOW, SAGE)):
        c.drawRect(skia.Rect.MakeXYWH(x + 22 + i * 30, y + bar / 2 - 10, 20, 20), paint(cc))
    if address:
        aw = min(w - 200, text_w(address, 26, 'mono', 600) + 90)
        ax = x + w / 2 - aw / 2 + 40
        c.drawRRect(rrect(ax, y + 11, aw, bar - 22, (bar - 22) / 2), paint('#3A3532'))
        c.drawCircle(ax + 26, y + bar / 2, 7, paint(SAGE))
        draw_text(c, address, ax + 44, y + bar / 2, 26, 'mono', 600, PAPER, anchor='l')
    elif title:
        draw_text(c, title, x + w - 22, y + bar / 2, 28, 'display' if not is_rtl(title) else 'label', 700, PAPER, anchor='r')
    inner = skia.Rect.MakeXYWH(x, y + bar, w, h - bar)
    c.save(); c.clipRect(inner); content(c, inner); c.restore()
    c.restore()
    if alpha < 1: c.restore()
    c.restore()


def shot(c, img, x, y, w, h, cx=0.5, cy=0.5, zoom=1.0, rot=0.0, seed=1, kind='لقطة رسمية', src='', alpha=1.0, credit_y=None):
    """Real interface screenshot / footage as a taped evidence print with a credit tag."""
    print_frame(c, x, y, w, h, cover_draw(img, cx, cy, zoom), rot=rot, seed=seed, alpha=alpha)
    if src and alpha > 0.5:
        credit(c, x + w - 10, credit_y or (y + h + 28), kind, src)


def step_tag(c, t, at, n, text):
    """Step marker under the title: yellow number square + label (Video 4 skill-tag style)."""
    if t < at - 0.02: return
    p = pop(t, at)
    tw_ = text_w(text, 36, 'display', 800)
    bw = tw_ + 40 + 60
    c.save(); c.translate(1040 - bw / 2, 318); c.rotate(-1.5); c.scale(0.7 + 0.3 * p, 0.7 + 0.3 * p)
    paper_sheet(c, -bw / 2, -34, bw, 68, PAPER_WHITE, 51 + n, r=4, shadow_a=0.3, dy=6, blur=6)
    c.drawRect(skia.Rect.MakeXYWH(bw / 2 - 54, -27, 46, 54), paint(YELLOW))
    draw_text(c, '١٢٣٤٥٦'[n - 1], bw / 2 - 31, 0, 34, 'display', 800, CHARCOAL)
    draw_text(c, text, bw / 2 - 66, 0, 36, 'display', 800, CHARCOAL, anchor='r')
    c.restore()
    pixel_squares(c, 40, 300, 6, 6, 26, 8, n, YELLOW, NAVY_LIGHT, 0.45, rtl=True)


# ---------------------------------------------------------------- the example website «سُكّر»
def cup(c, cx, cy, s, t=0.0):
    """Coffee cup illustration on a yellow disc (paper cut-out)."""
    c.drawCircle(cx, cy, s * 0.62, paint(YELLOW))
    c.drawCircle(cx, cy, s * 0.62, tex_paint('paper_fibers.png', 0.4, skia.BlendMode.kMultiply, 0.4))
    c.drawOval(skia.Rect.MakeLTRB(cx - s * 0.5, cy + s * 0.22, cx + s * 0.5, cy + s * 0.40), paint(PAPER_WHITE))
    c.drawOval(skia.Rect.MakeLTRB(cx - s * 0.5, cy + s * 0.22, cx + s * 0.5, cy + s * 0.40), paint(CHARCOAL, 1, stroke=s * 0.03))
    body = skia.Path(); body.moveTo(cx - s * 0.34, cy - s * 0.18); body.lineTo(cx + s * 0.34, cy - s * 0.18)
    body.cubicTo(cx + s * 0.33, cy + s * 0.12, cx + s * 0.22, cy + s * 0.30, cx, cy + s * 0.30)
    body.cubicTo(cx - s * 0.22, cy + s * 0.30, cx - s * 0.33, cy + s * 0.12, cx - s * 0.34, cy - s * 0.18); body.close()
    c.drawCircle(cx + s * 0.38, cy - s * 0.02, s * 0.11, paint(CHARCOAL, 1, stroke=s * 0.05))
    c.drawPath(body, paint(PAPER_WHITE)); c.drawPath(body, paint(CHARCOAL, 1, stroke=s * 0.03))
    c.drawOval(skia.Rect.MakeLTRB(cx - s * 0.30, cy - s * 0.23, cx + s * 0.30, cy - s * 0.13), paint(KRAFT_DARK))
    c.drawRect(skia.Rect.MakeXYWH(cx - s * 0.33, cy - s * 0.02, s * 0.66, s * 0.07), paint(TERRACOTTA, 0.85))
    for j in range(3):
        ph = math.sin(t * 2.4 + j * 1.3) * s * 0.03
        p = skia.Path(); x0 = cx - s * 0.14 + j * s * 0.14
        p.moveTo(x0, cy - s * 0.28); p.cubicTo(x0 - s * 0.06 + ph, cy - s * 0.38, x0 + s * 0.06 + ph, cy - s * 0.46, x0, cy - s * 0.56)
        c.drawPath(p, paint(CHARCOAL, 0.55, stroke=s * 0.025))


def site_desktop(c, r, t=0.0, k=1.0):
    """Landing page of the example café site, desktop layout. k < 1 builds it section by section."""
    x, y, w, h = r.left(), r.top(), r.width(), r.height()
    s = w / 900
    c.drawRect(r, paint('#FBF6EC'))
    if k <= 0: return
    # nav (RTL: logo right, links left)
    c.drawRect(skia.Rect.MakeXYWH(x, y, w, 64 * s), paint(PAPER_WHITE))
    draw_text(c, 'سُكّر', x + w - 30 * s, y + 32 * s, 40 * s, 'hero', 400, CHARCOAL, anchor='r')
    c.drawCircle(x + w - 128 * s, y + 30 * s, 7 * s, paint(YELLOW))
    for i, lk in enumerate(('المنيو', 'من نحن', 'تواصل')):
        draw_text(c, lk, x + 290 * s - i * 110 * s, y + 32 * s, 22 * s, 'label', 700, CHARCOAL_SOFT, anchor='r')
    if k < 0.25: return
    # hero
    cup(c, x + 230 * s, y + 250 * s, 260 * s, t)
    draw_text(c, 'قهوتك…', x + w - 40 * s, y + 160 * s, 64 * s, 'display', 800, CHARCOAL, anchor='r')
    draw_text(c, 'على مزاجك', x + w - 40 * s, y + 240 * s, 64 * s, 'display', 800, CHARCOAL, anchor='r')
    draw_text(c, 'محمصة ومقهى صغير في قلب المدينة', x + w - 40 * s, y + 305 * s, 24 * s, 'label', 700, STEEL_DARK, anchor='r')
    bw = 200 * s
    c.drawRRect(rrect(x + w - 40 * s - bw, y + 345 * s, bw, 58 * s, 29 * s), paint(YELLOW))
    c.drawRRect(rrect(x + w - 40 * s - bw, y + 345 * s, bw, 58 * s, 29 * s), paint(CHARCOAL, 1, stroke=3 * s))
    draw_text(c, 'اطلب الآن', x + w - 40 * s - bw / 2, y + 374 * s, 26 * s, 'display', 800, CHARCOAL)
    if k < 0.6: return
    # menu cards
    items = (('لاتيه', TEAL), ('إسبريسو', KRAFT_DARK), ('كرواسون', TERRACOTTA))
    cw = (w - 100 * s) / 3
    for i, (name, cc) in enumerate(items):
        cx = x + w - 30 * s - cw * (i + 1) - 20 * s * i
        cy = y + 432 * s
        if cy > y + h: break
        c.drawRRect(rrect(cx, cy, cw, 92 * s, 14 * s), paint(PAPER_WHITE))
        c.drawRRect(rrect(cx, cy, cw, 92 * s, 14 * s), paint(PAPER_SHADE, 1, stroke=2 * s))
        c.drawCircle(cx + 46 * s, cy + 46 * s, 24 * s, paint(cc))
        draw_text(c, name, cx + cw - 22 * s, cy + 46 * s, 28 * s, 'display', 800, CHARCOAL, anchor='r')


def site_mobile(c, r, t=0.0):
    x, y, w, h = r.left(), r.top(), r.width(), r.height()
    s = w / 300
    c.drawRect(r, paint('#FBF6EC'))
    c.drawRect(skia.Rect.MakeXYWH(x, y, w, 70 * s), paint(PAPER_WHITE))
    draw_text(c, 'سُكّر', x + w - 18 * s, y + 42 * s, 30 * s, 'hero', 400, CHARCOAL, anchor='r')
    for j in range(3):
        c.drawRect(skia.Rect.MakeXYWH(x + 20 * s, y + (30 + j * 8) * s, 26 * s, 3.5 * s), paint(CHARCOAL))
    cup(c, x + w / 2, y + 195 * s, 170 * s, t)
    draw_text(c, 'قهوتك…', x + w / 2, y + 330 * s, 40 * s, 'display', 800, CHARCOAL)
    draw_text(c, 'على مزاجك', x + w / 2, y + 380 * s, 40 * s, 'display', 800, CHARCOAL)
    c.drawRRect(rrect(x + w / 2 - 80 * s, y + 420 * s, 160 * s, 46 * s, 23 * s), paint(YELLOW))
    c.drawRRect(rrect(x + w / 2 - 80 * s, y + 420 * s, 160 * s, 46 * s, 23 * s), paint(CHARCOAL, 1, stroke=2.5 * s))
    draw_text(c, 'اطلب الآن', x + w / 2, y + 443 * s, 21 * s, 'display', 800, CHARCOAL)
    for i, (name, cc) in enumerate((('لاتيه', TEAL), ('إسبريسو', KRAFT_DARK))):
        cx = x + w - 16 * s - (i + 1) * 128 * s - i * 12 * s
        c.drawRRect(rrect(cx, y + 492 * s, 128 * s, 96 * s, 10 * s), paint(PAPER_WHITE))
        c.drawCircle(cx + 100 * s, y + 524 * s, 16 * s, paint(cc))
        draw_text(c, name, cx + 116 * s, y + 568 * s, 20 * s, 'display', 800, CHARCOAL, anchor='r')


def site_pair(c, t, cx, cy, sc=1.0, address=URL, k=1.0, glow=0.0, rot=0.0):
    """Desktop browser + phone in front: the website reveal (same composition at the start and the end)."""
    c.save(); c.translate(cx, cy); c.scale(sc, sc); c.rotate(rot)
    window(c, -470, -330, 900, 600, lambda cv, r: site_desktop(cv, r, t, k), address=address, seed=7)
    phone(c, -385, 175, 500, lambda cv, r: site_mobile(cv, r, t), rot=-4, glow=glow)
    c.restore()


# ---------------------------------------------------------------- ChatGPT (explanatory card, our style)
def chat_window(c, t, x, y, w, h, msgs, seed=3):
    """msgs: [(at, role, [lines])]; role 'user' = right bubble, 'ai' = left text with bullets."""
    def content(cv, r):
        cv.drawRect(r, paint(PAPER_WHITE))
        yy = r.top() + 30
        for at, role, lines in msgs:
            if t < at - 0.02: continue
            q = pop(t, at)
            n = len(lines)
            if role == 'user':
                bw = max(text_w(l, 34, 'label', 700) for l in lines) + 60
                bh = 50 * n + 30
                cv.save(); cv.translate(0, (1 - q) * 30)
                cv.saveLayerAlpha(None, int(min(1, q * 2) * 255))
                cv.drawRRect(rrect(r.right() - 30 - bw, yy, bw, bh, 26), paint('#ECE4D3'))
                for j, l in enumerate(lines):
                    draw_text(cv, l, r.right() - 60, yy + 40 + 50 * j, 34, 'label', 700, CHARCOAL, anchor='r')
                cv.restore(); cv.restore()
                yy += bh + 26
            else:
                for j, l in enumerate(lines):
                    a_l = at + j * 0.30
                    if t < a_l - 0.02: continue
                    qq = pop(t, a_l)
                    cv.save(); cv.translate((1 - qq) * 40, 0)
                    cv.saveLayerAlpha(None, int(min(1, qq * 2) * 255))
                    if l.startswith('•'):
                        cv.drawRect(skia.Rect.MakeXYWH(r.right() - 58, yy + 14, 18, 18), paint(YELLOW))
                        draw_text(cv, l[1:].strip(), r.right() - 76, yy + 24, 34, 'label', 700, CHARCOAL, anchor='r')
                    else:
                        draw_text(cv, l, r.right() - 40, yy + 24, 34, 'label', 700, TEAL, anchor='r')
                    cv.restore(); cv.restore()
                    yy += 58
                yy += 16
    window(c, x, y, w, h, content, title='ChatGPT', seed=seed)


# ---------------------------------------------------------------- terminal (explanatory card, VS Code dark style)
def terminal(c, t, x, y, w, h, lines, title='TERMINAL', seed=9, size=27, cps=45):
    """lines: [(at, text, color)]; each line types in at ~45 chars/s."""
    def content(cv, r):
        cv.drawRect(r, paint('#1E1E1E'))
        yy = r.top() + 40
        for at, text, colr in lines:
            if t < at - 0.02: continue
            n = len(text) if not text.startswith('$') else int(clamp((t - at) * cps / len(text)) * len(text))
            shown = text[:max(1, n)]
            if text.startswith('$'):
                draw_text(cv, '$', r.left() + 28, yy, size, 'mono', 700, YELLOW, anchor='l')
                draw_text(cv, shown[1:].strip(), r.left() + 28 + size * 0.95, yy, size, 'mono', 600, PAPER, anchor='l')
                if n < len(text) and int(t * 4) % 2 == 0:
                    pass
            else:
                draw_text(cv, shown, r.left() + 28, yy, size, 'mono' if not is_rtl(shown) else 'label', 600, colr, anchor='l')
            yy += size * 1.75
        if int(t * 2.5) % 2 == 0:
            cv.drawRect(skia.Rect.MakeXYWH(r.left() + 28, yy - size * 0.55, size * 0.55, size * 1.05), paint(PAPER, 0.85))
    window(c, x, y, w, h, content, title=title, dark=True, seed=seed)


def file_tree(c, t, x, y, files, at0, step=0.22):
    paper_sheet(c, x, y, 380, 66 + 50 * len(files), PAPER_WHITE, 61, r=8, shadow_a=0.35, dy=10, blur=10)
    draw_text(c, REPO + '/', x + 24, y + 38, 26, 'mono', 700, CHARCOAL, anchor='l')
    for i, f in enumerate(files):
        at = at0 + i * step
        if t < at - 0.02: continue
        q = pop(t, at)
        yy = y + 90 + i * 50
        c.save(); c.translate(x + 40, yy); c.scale(0.6 + 0.4 * q, 0.6 + 0.4 * q)
        c.drawRect(skia.Rect.MakeXYWH(0, -16, 26, 32), paint(YELLOW if f.endswith('.html') else TEAL))
        draw_text(c, f, 42, 0, 26, 'mono', 600, CHARCOAL, anchor='l', alpha=min(1, q * 2))
        c.drawCircle(300, 0, 15, paint(SAGE)); ck = skia.Path(); ck.moveTo(292, 0); ck.lineTo(298, 6); ck.lineTo(308, -6)
        c.drawPath(ck, paint(PAPER_WHITE, 1, stroke=4))
        c.restore()


def big_button(c, cx, cy, text, press=0.0, scale=1.0, fg=PAPER_WHITE, bg=CHARCOAL, base='#000000', size=46):
    if scale <= 0.01: return
    tw_ = text_w(text, size, 'display', 800)
    w = tw_ + 120; h = size * 1.9; depth = 12
    c.save(); c.translate(cx, cy); c.scale(scale, scale)
    shadow(c, rrect(-w / 2, -h / 2 + depth, w, h, 16), dy=8, blur=10, a=0.35)
    c.drawRRect(rrect(-w / 2, -h / 2 + depth, w, h, 16), paint(base))
    dy = depth * clamp(press)
    c.drawRRect(rrect(-w / 2, -h / 2 + dy, w, h, 16), paint(bg))
    c.drawRRect(rrect(-w / 2, -h / 2 + dy, w, h, 16), paint(YELLOW, 1, stroke=4))
    draw_text(c, text, 0, dy + 2, size, 'display', 800, fg)
    c.restore()


# ---------------------------------------------------------------- scenes
def s_hook(c, t):
    """A. The finished site first: browser + phone, then «Live»."""
    bg_navy(c, t)
    title_card(c, t, 0.05, 'من فكرة… لموقع Live')
    e = spring(t, -0.25, 14, 140, 0.9)
    site_pair(c, t, 540, 820 + (1 - e) * 200, 0.98 + 0.03 * lin(t, 0, 3.5), glow=0.6 * (t >= tw(10)))
    badge(c, 880, 1110, 'مثال توضيحي', TERRACOTTA, 26, 3, alpha=clamp((t - 0.6) * 4))
    # 30-second pixel timer
    secs = int(clamp(t / 3.4) * 30)
    if t >= 0.2:
        q = pop(t, 0.2)
        c.save(); c.translate(150, 420); c.scale(0.5 + 0.5 * q, 0.5 + 0.5 * q)
        paper_sheet(c, -100, -60, 200, 120, NAVY_DEEP, 12, r=8, shadow_a=0.35, fibre=0.15)
        draw_text(c, f'{secs:02d}', 0, -8, 64, 'mono', 800, YELLOW)
        draw_text(c, 'ثانية', 0, 38, 24, 'label', 700, PAPER)
        c.restore()
    if t >= tw(10) - 0.05:
        q = spring(t, tw(10) - 0.05, 11, 300, 0.6)
        hero_word(c, 790, 1205, 'Live', 120, CHARCOAL, None, strip=YELLOW, seed=21, scale=0.4 + 0.6 * q, rot=-4)
        c.drawCircle(640, 1200, 14 * q, paint(SAGE))


def s_plan(c, t):
    """B. Step 1: plan the idea with ChatGPT."""
    bg_cream(c, t)
    title_card(c, t, tw(11) - 0.08, 'خطّط فكرتك أولاً')
    step_tag(c, t, tw(13), 1, 'التخطيط')
    e = spring(t, tw(11) - 0.06, 13, 170, 0.85)
    c.save(); c.translate(0, (1 - e) * 900)
    chat_window(c, t, 60, 410, 960, 640, [
        (tw(13), 'user', ['بدي موقع لمقهى «سُكّر»']),
        (tw(17), 'ai', ['خطة الموقع:', '• صفحة رئيسية جذابة', '• المنيو والأسعار', '• الموقع وطرق التواصل']),
    ])
    c.restore()
    badge(c, 860, 1245, 'توضيح', TEAL, 26, 3, alpha=clamp((t - tw(11)) * 3))


def s_vscode(c, t):
    """C. Step 2: VS Code -> integrated terminal -> install, sign in, run Claude Code in the project folder."""
    bg_navy(c, t)
    T_TERM, T_INST, T_RUN = tw(26), tw(28), tw(32)
    title_card(c, t, tw(21), 'افتح VS Code', out=T_INST - 0.3)
    title_card(c, t, T_INST - 0.05, 'ثبّت Claude Code وشغّله')
    step_tag(c, t, tw(22), 2, 'المحرّر')
    if t < T_INST:
        if t < T_TERM:
            vs = load_image(VSCODE, 2000)
            z = 1.0 + 0.10 * ease_io(lin(t, tw(23), T_TERM))
            e = spring(t, tw(21) - 0.02, 13, 170, 0.85)
            c.save(); c.translate(0, (1 - e) * 900)
            shot(c, vs, 40, 420, 1000, 700, 0.5, 0.5, z, rot=-0.8, seed=31, src='Visual Studio Code · docs')
            c.restore()
            if t >= tw(25):     # «على جهازك»
                chip_ = pop(t, tw(25))
                label(c, 300, 1215, 'على جهازك', 36, YELLOW, CHARCOAL, rot=-3, seed=32, scale=0.6 + 0.4 * chip_)
        else:
            term = load_image(VSTERM, 1600)
            e = spring(t, T_TERM - 0.02, 14, 230, 0.8)
            shot(c, term, 40, 430, 1000, 560, 0.5, 0.55, 1.0 + 0.04 * lin(t, T_TERM, T_INST), rot=0.6, seed=33,
                 src='VS Code docs · Integrated Terminal', alpha=min(1, e * 2))
            if t >= tw(27):
                k = ease_out(lin(t, tw(27), tw(27) + 0.3))
                corner_brackets(c, skia.Rect.MakeXYWH(60, 450, 330 * k + 40, 90), YELLOW, 34, 7, k)
                label(c, 760, 1080, 'Terminal ← View', 32, PAPER_WHITE, CHARCOAL, rot=2, seed=34, alpha=k)
        return
    lines = [(T_INST, '$ npm install -g @anthropic-ai/claude-code', PAPER),
             (T_INST + 0.6, '+ @anthropic-ai/claude-code', SAGE),
             (tw(30), '$ claude', PAPER),
             (tw(31), '> /login', YELLOW),
             (T_RUN, '$ cd ' + REPO, PAPER),
             (tw(34) + 0.05, '$ claude', PAPER)]
    e = spring(t, T_INST - 0.03, 14, 200, 0.8)
    c.save(); c.translate(0, (1 - e) * 120)
    terminal(c, t, 40, 410, 1000, 470, lines, size=28)
    c.restore()
    if t >= tw(30):
        q = pop(t, tw(30) + 0.1)
        label(c, 820, 940, 'سجّل دخولك بحسابك', 34, YELLOW, CHARCOAL, rot=-2, seed=35, scale=0.6 + 0.4 * q, alpha=min(1, q * 2))
    if t >= tw(35) - 0.1:     # real Claude Code, running in the project folder
        q = spring(t, tw(35) - 0.1, 13, 220, 0.8)
        im = clip('cc_start', 0.25)
        c.save(); c.translate(540, 1040); c.scale(0.5 + 0.5 * q, 0.5 + 0.5 * q); c.translate(-540, -1040)
        shot(c, im, 140, 910, 860, 290, 0.32, 0.17, 1.0, rot=1.2, seed=36, src='Claude Code · anthropics/claude-code', credit_y=1230)
        c.restore()
        label(c, 230, 960, 'داخل مجلد المشروع', 30, PAPER_WHITE, CHARCOAL, rot=-4, seed=37, alpha=min(1, q * 2))


PROMPT_LINES = ['ابنِ موقع مقهى «سُكّر» كامل:', '• صفحة رئيسية + منيو + تواصل', '• ألوان دافئة: أصفر وكريمي',
                '• متجاوب مع الجوال', '• جاهز للنشر على Vercel']


def prompt_card(c, t, cx, cy, sc, at0, rot=-2.0, glow=0.0, n_lines=None):
    c.save(); c.translate(cx, cy); c.rotate(rot); c.scale(sc, sc)
    if glow > 0: c.drawRRect(rrect(-330, -210, 660, 420, 20), paint(YELLOW, 0.5 * glow, blur=30))
    paper_sheet(c, -310, -190, 620, 380, PAPER_WHITE, 71, r=8, shadow_a=0.4, dy=14, blur=14)
    c.drawRect(skia.Rect.MakeXYWH(-310, -190, 620, 62), paint(YELLOW))
    draw_text(c, 'PROMPT · Claude Code', 0, -159, 30, 'mono', 800, CHARCOAL)
    for j, l in enumerate(PROMPT_LINES[:n_lines or len(PROMPT_LINES)]):
        at = at0 + j * 0.45
        if t < at - 0.02: continue
        a = min(1, (t - at) * 5)
        draw_text(c, l, 285, -88 + j * 56, 31, 'label', 700, CHARCOAL if j else TEAL, alpha=a, anchor='r')
    c.restore()


def s_prompt(c, t):
    """D. Step 3: back to ChatGPT for a complete implementation prompt."""
    bg_cream(c, t)
    title_card(c, t, tw(36) - 0.06, 'ارجع لـ ChatGPT')
    step_tag(c, t, tw(38), 3, 'البرومبت')
    e = spring(t, tw(36) - 0.06, 13, 170, 0.85)
    up = ease_io(lin(t, tw(43) - 0.1, tw(43) + 0.4))
    c.save(); c.translate(0, (1 - e) * 900)
    chat_window(c, t, 60, 400, 960, 330, [(tw(41), 'user', ['اعمل لي برومبت شامل لـ Claude Code', 'ينفّذ الفكرة كاملة'])])
    c.restore()
    if t >= tw(43) - 0.05:
        q = spring(t, tw(43) - 0.05, 13, 220, 0.8)
        push = 1 + 0.05 * ease_io(lin(t, tw(50) - 0.1, 18.45))
        prompt_card(c, t, 540, 985, (0.5 + 0.5 * q) * push, tw(44), rot=-1.5 - 1.5 * lin(t, tw(50) - 0.1, 18.45))
        if t >= tw(50):           # «كاملة»: the prompt is complete
            qq = spring(t, tw(50), 14, 330, 0.8)
            badge(c, 820, 1175, 'جاهز', TEAL, 36, -8, scale=1.6 - 0.6 * qq, alpha=min(1, qq * 2))
    if t >= tw(44):
        q = spring(t, tw(44), 12, 300, 0.6)
        hero_word(c, 215, 1250, 'شامل', 96, CHARCOAL, None, strip=YELLOW, seed=41, scale=0.4 + 0.6 * q, rot=-6)


def s_claude(c, t):
    """E. Step 4: copy the prompt, give it to Claude Code, let it write the project."""
    bg_navy(c, t)
    title_card(c, t, tw(51) - 0.08, 'أعطِه لـ Claude Code')
    step_tag(c, t, tw(52), 4, 'التنفيذ')
    T_GIVE, T_WRITE = tw(54), tw(56)
    # real Claude Code at work
    pe = spring(t, T_GIVE - 0.1, 13, 180, 0.85)
    if t >= T_GIVE - 0.12:
        im = clip('cc_work', t - T_GIVE)
        c.save(); c.translate(0, (1 - pe) * 900)
        shot(c, im, 40, 400, 1000, 616, 0.5, 0.5, 1.0, rot=-0.6, seed=43, src='Claude Code · anthropics/claude-code', credit_y=1042)
        c.restore()
    # the prompt: copy (Ctrl+C), then flies into the terminal
    fly = ease_in(lin(t, T_GIVE - 0.05, T_GIVE + 0.35))
    if fly < 1:
        cy = lerp(800, 560, fly); sc = lerp(0.82, 0.25, fly)
        prompt_card(c, t, 540, cy, sc, -10, rot=-1.5 + 4 * fly, glow=ease_io(lin(t, tw(52), tw(52) + 0.3)) * (1 - fly))
        if t >= tw(52) and fly <= 0:
            q = pop(t, tw(52))
            label(c, 840, 1060, 'Ctrl + C', 40, YELLOW, CHARCOAL, rot=-4, seed=44, family='mono', scale=0.6 + 0.4 * q)
    else:
        if t < T_GIVE + 0.9:
            rr = 40 + 220 * ease_out(lin(t, T_GIVE + 0.35, T_GIVE + 0.9))
            c.drawCircle(540, 560, rr, paint(YELLOW, 1 - lin(t, T_GIVE + 0.35, T_GIVE + 0.9), stroke=8))
    # it writes the project, then the site preview for review
    if t >= T_WRITE - 0.1:
        q = spring(t, T_WRITE - 0.1, 13, 220, 0.8)
        c.save(); c.translate(0, (1 - q) * 500)
        file_tree(c, t, 40, 1062, ['index.html', 'menu.html', 'styles.css', 'script.js'], T_WRITE + 0.15, 0.2)
        c.restore()
    if t >= tw(58) - 0.05:
        q = spring(t, tw(58) - 0.05, 13, 220, 0.8)
        c.save(); c.translate(825, 1195); c.scale(0.33 * (0.5 + 0.5 * q), 0.33 * (0.5 + 0.5 * q)); c.rotate(3)
        window(c, -450, -300, 900, 600, lambda cv, r: site_desktop(cv, r, t, 1.0), address='localhost:3000', seed=45)
        c.restore()
        label(c, 560, 1285, 'راجع النتيجة', 30, YELLOW, CHARCOAL, rot=2, seed=46, alpha=min(1, q * 2))


def s_github(c, t):
    """F. Step 5: upload the code to GitHub."""
    bg_cream(c, t)
    title_card(c, t, tw(59) - 0.06, 'ارفع الكود على GitHub')
    step_tag(c, t, tw(60), 5, 'GitHub')
    gh = load_image(GH_NEW, 1200)
    e = spring(t, tw(59) - 0.06, 13, 170, 0.85)
    c.save(); c.translate(0, (1 - e) * 900)
    shot(c, gh, 60, 420, 700, 494, 0.5, 0.5, 1.0, rot=-1.5, seed=51, src='GitHub Docs · New repository')
    c.restore()
    if t >= 22.20:
        lines = [(22.30, '$ git add . && git commit -m "init"', PAPER),
                 (22.85, '$ git push -u origin main', PAPER), (tw(63), '→ github.com/…/' + REPO, SAGE)]
        q = spring(t, 22.20, 14, 220, 0.8)
        c.save(); c.translate(0, (1 - q) * 600)
        terminal(c, t, 140, 960, 900, 300, lines, size=25, cps=75)
        c.restore()


def s_vercel(c, t):
    """G. Step 5b: connect the repository to Vercel and press Deploy."""
    bg_navy(c, t)
    title_card(c, t, tw(64) - 0.04, 'اربطه بـ Vercel')
    vc = load_image(VC_IMPORT, 1800)
    e = spring(t, tw(64) - 0.04, 13, 180, 0.85)
    c.save(); c.translate(0, (1 - e) * 900)
    shot(c, vc, 40, 400, 1000, 560, 0.5, 0.0, 1.0, rot=0.8, seed=61, src='Vercel Docs · Import Git Repository')
    c.restore()
    if t >= tw(65) - 0.1:      # our repo row (explanatory)
        q = spring(t, tw(65) - 0.1, 13, 240, 0.8)
        c.save(); c.translate(540, 1035); c.scale(0.5 + 0.5 * q, 0.5 + 0.5 * q); c.rotate(-1)
        paper_sheet(c, -420, -52, 840, 104, '#111111', 62, r=10, shadow_a=0.4, fibre=0.1)
        c.drawRRect(rrect(-420, -52, 840, 104, 10), paint(YELLOW, 1, stroke=4))
        draw_text(c, REPO, -380, 0, 36, 'mono', 700, PAPER_WHITE, anchor='l')
        c.drawRRect(rrect(220, -30, 170, 60, 10), paint('#2B6FE8'))
        draw_text(c, 'Import', 305, 0, 30, 'display', 700, PAPER_WHITE)
        c.restore()
    if t >= tw(66) - 0.05:
        q = spring(t, tw(66) - 0.05, 13, 260, 0.75)
        press = math.sin(math.pi * lin(t, tw(67), tw(67) + 0.3)) if tw(67) <= t <= tw(67) + 0.3 else 0
        big_button(c, 700, 1215, 'Deploy', press, scale=0.5 + 0.5 * q)
        if t >= tw(67):
            u = (t - tw(67)) / 0.45
            if u < 1: c.drawCircle(700, 1215, 120 + 180 * ease_out(u), paint(YELLOW, 1 - u, stroke=7))
    badge(c, 220, 1215, 'لقطة توثيق + رسم توضيحي', TEAL, 22, -3, alpha=clamp((t - tw(64)) * 3))


def s_live(c, t):
    """H. Step 6: the deployment succeeds -> a link to your site you can send to anyone. Ends on the site."""
    bg_cream(c, t)
    title_card(c, t, tw(68) - 0.05, 'موقعك صار Live')
    step_tag(c, t, tw(69), 6, 'النشر')
    # build progress -> ready
    if t < tw(73) - 0.1:
        k = ease_io(lin(t, tw(68), tw(69) + 0.25))
        c.save(); c.translate(540, 760)
        paper_sheet(c, -400, -120, 800, 240, '#111111', 72, r=12, shadow_a=0.4, fibre=0.1)
        draw_text(c, REPO, 360, -60, 34, 'mono', 700, PAPER_WHITE, anchor='r')
        bw = 700
        c.drawRRect(rrect(-350, 0, bw, 26, 13), paint('#333333'))
        c.drawRRect(rrect(-350, 0, bw * k, 26, 13), paint(YELLOW))
        if k >= 1:
            q = pop(t, tw(69) + 0.25)
            c.drawCircle(-320, -60, 14 * q, paint(SAGE))
            draw_text(c, 'Ready', -290, -60, 32, 'display', 700, SAGE, anchor='l', alpha=min(1, q * 2))
        else:
            draw_text(c, 'Building…', -350, -60, 30, 'display', 600, STEEL, anchor='l')
        c.restore()
        if t >= tw(70):
            q = spring(t, tw(70), 14, 330, 0.8)
            badge(c, 760, 960, 'تم النشر', TEAL, 40, -8, scale=1.6 - 0.6 * q, alpha=min(1, q * 2))
        return
    # the link and the reveal
    e = spring(t, tw(73) - 0.1, 13, 170, 0.85)
    hold = ease_io(lin(t, 28.9, 30.0))        # slow push-in through the final hold
    site_pair(c, t, 540, 810 + (1 - e) * 700 - 12 * hold, 0.9 * (1 + 0.045 * hold), glow=0.5 + 0.3 * math.sin(t * 3) * hold)
    q = spring(t, tw(73) - 0.05, 12, 260, 0.7)
    c.save(); c.translate(540, 1215); c.scale(0.5 + 0.5 * q, 0.5 + 0.5 * q); c.rotate(-1.5)
    lw = text_w(URL, 40, 'mono', 700) + 110
    paper_sheet(c, -lw / 2, -44, lw, 88, YELLOW, 81, r=44, shadow_a=0.4)
    c.drawRRect(rrect(-lw / 2, -44, lw, 88, 44), paint(CHARCOAL, 1, stroke=4))
    c.drawCircle(-lw / 2 + 46, 0, 12, paint(SAGE))
    draw_text(c, URL, -lw / 2 + 72, 2, 40, 'mono', 700, CHARCOAL, anchor='l')
    c.restore()
    # send it to anyone: the link travels to three chats
    if t >= tw(76) - 0.05:
        for j in range(3):
            at = tw(76) - 0.05 + j * 0.14
            if t < at: continue
            u = ease_out(lin(t, at, at + 0.45))
            tx, ty = 200 + j * 340, 440
            x, y = lerp(540, tx, u), lerp(1215, ty, u)
            c.save(); c.translate(x, y); s = 0.6 + 0.4 * u
            c.scale(s, s)
            paper_sheet(c, -90, -38, 180, 76, PAPER_WHITE, 90 + j, r=38, shadow_a=0.35, dy=6, blur=6)
            c.drawCircle(-50, 0, 20, paint([TEAL, TERRACOTTA, SAGE][j]))
            c.drawRect(skia.Rect.MakeXYWH(-18, -8, 80, 16), paint(YELLOW))
            c.restore()
    badge(c, 885, 1100, 'مثال توضيحي', TERRACOTTA, 24, 3, alpha=clamp((t - tw(73)) * 3))


SCENES = [(-1.0, 3.50, s_hook), (3.50, 7.20, s_plan), (7.20, 13.55, s_vscode), (13.55, 18.45, s_prompt),
          (18.45, 21.90, s_claude), (21.90, 23.45, s_github), (23.45, 25.58, s_vercel), (25.58, 99.0, s_live)]


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
