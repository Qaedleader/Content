"""Overlays drawn ON TOP of real footage: titles, tracked-style callouts, readouts, subtitles, credits."""
import math, json, os, numpy as np, skia
from gfx import *
from scenes import sim_badge, label_callout, trim_card

def credit(c, txt, a=1.0):
    """Small source credit, top-left inside the safe area."""
    if a <= 0: return
    draw_text(c, txt, 60, 268, 26, 'med', WHITE, 0.78 * a, anchor='l', rtl=False, shadow=4)

def tag_label(c, txt, a=1.0, color=CYAN):
    """Top-right pill, e.g. 'لقطة توضيحية — ليست رودستر'."""
    sim_badge(c, a, txt)

def brackets(c, x, y, w, h, a, color=WHITE, L=60, width=4):
    if a <= 0: return
    p = paint(color, a, width)
    for sx, sy in ((x, y), (x + w, y), (x, y + h), (x + w, y + h)):
        dx = L if sx == x else -L; dy = L if sy == y else -L
        c.drawLine(sx, sy, sx + dx, sy, p); c.drawLine(sx, sy, sx, sy + dy, p)

def blueprint_grid(c, a):
    if a <= 0: return
    for x in range(0, W, 90): c.drawLine(x, 0, x, H, paint(CYAN, 0.10 * a, 1))
    for y in range(0, H, 90): c.drawLine(0, y, W, y, paint(CYAN, 0.10 * a, 1))

# ---------------- hook ----------------
def ov_hook(c, t):
    # Title wipe-in (RTL: reveal from right)
    a = env(t, 0.50, 2.05, 0.35, 0.35)
    if a > 0:
        img = text_image('تسلا رودستر', 140, 'bold', WHITE, True, 0, 10)
        rev = ease_out(lin(t, 0.5, 1.0))
        x0 = W / 2 - img.width() / 2; y0 = 430 - img.height() / 2
        c.save(); c.clipRect(skia.Rect.MakeLTRB(x0 + img.width() * (1 - rev), 0, W, H))
        p = skia.Paint(AntiAlias=True); p.setAlphaf(a); c.drawImage(img, x0, y0, skia.SamplingOptions(skia.FilterMode.kLinear), p)
        c.restore()
        ln = ease_out(lin(t, 0.75, 1.3))
        c.drawLine(W / 2 + 200 - 400 * ln, 535, W / 2 + 200, 535, paint(RED, a, 5))
        draw_text(c, 'الجيل الجديد · عرض ١٥ تشرين الأول ٢٠٢٦', W / 2, 600, 36, 'med', STEEL, a * ease_out(lin(t, 0.9, 1.3)), shadow=6)

def ov_freeze_how(c, t):
    """4.32-5.84 freeze frame: engineering language takes over."""
    g = ease_out(lin(t, 4.4, 5.0))
    c.drawRect(skia.Rect.MakeWH(W, H), paint(BG, 0.35 * g))
    blueprint_grid(c, g)
    a = ease_out(lin(t, 4.48, 4.72))
    s = lerp(1.35, 1.0, ease_expo(lin(t, 4.48, 4.8)))
    draw_text(c, 'كيف؟!', W / 2, 760, 230, 'bold', WHITE, a, scale=s, shadow=14)
    b = ease_out(lin(t, 4.95, 5.25))
    c.drawLine(W / 2 - 180 * b, 920, W / 2 + 180 * b, 920, paint(RED, b, 6))

def ov_inverted_hold(c, t):
    a = env(t, 5.9, 7.32, 0.3, 0.12)
    brackets(c, 150, 700, W - 300, 520, a, WHITE)
    draw_text(c, 'مقلوبة ١٨٠°', W / 2, 1270, 44, 'semi', CYAN, a, shadow=6)
    draw_text(c, 'كيف ظلّت ماسكة؟', W / 2, 470, 92, 'bold', WHITE, a, shadow=10)

# ---------------- vacuum ----------------
def ov_vacuum(c, t):
    a = env(t, 13.6, 15.47, 0.3, 0.0)
    for i in range(5):
        x = 260 + i * 140
        ph = ((t * 1.4 + i * 0.2) % 1.0)
        arrow(c, x, 1150 - 40 * ph, x, 1060 - 40 * ph, CYAN, a * (0.4 + 0.6 * (1 - ph)), 5, 20)
    draw_text(c, 'شفط = ضغط أقل تحت الفوهة', W / 2, 470, 56, 'bold', WHITE, a, shadow=8)
    o = ease_out(lin(t, 15.05, 15.45))
    if o > 0:
        rr = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(W / 2 - 380, 1000, 760, 170), 70, 70)
        c.drawRRect(rr, paint(CYAN, o, 4)); c.drawRRect(rr, paint(CYAN, 0.35 * o, 14, blur=10))

# ---------------- ramp return / kickflip ----------------
def ov_full_car(c, t):
    a = env(t, 16.8, 18.2, 0.3, 0.2)
    draw_text(c, 'بقوة بتكفّي سيارة كاملة', W / 2, 470, 64, 'bold', WHITE, a, shadow=10)

def ov_takeoff(c, t):
    a = ease_out(lin(t, 19.55, 19.95))
    c.drawRect(skia.Rect.MakeWH(W, H), paint(BG, 0.25 * a)); blueprint_grid(c, a)
    brackets(c, 160, 760, W - 320, 420, a, CYAN)

# ---------------- SpaceX ----------------
def ov_rcs(c, t):
    a = env(t, 25.15, 26.9, 0.3, 0.2)
    draw_text(c, 'دافعات التحكم', W / 2, 430, 84, 'bold', WHITE, a, shadow=10)
    draw_text(c, 'في المركبات الفضائية', W / 2, 525, 48, 'med', STEEL, a, shadow=8)

def ov_launch(c, t):
    a = env(t, 26.95, 28.3, 0.25, 0.2)
    draw_text(c, 'نفس المبدأ', W / 2, 430, 96, 'bold', WHITE, a, shadow=10)
    b = env(t, 27.45, 28.3, 0.25, 0.2)
    draw_text(c, 'مش نفس محركات الإطلاق', W / 2, 535, 54, 'semi', RED, b, shadow=8)
    draw_text(c, 'فعل وردّ فعل — بحجم وطاقة مختلفين تمامًا', W / 2, 610, 34, 'med', STEEL, b, shadow=6)

def ov_spacex(c, t):
    a = env(t, 28.4, 30.0, 0.3, 0.2)
    draw_text(c, 'Tesla × SpaceX', W / 2, 430, 92, 'bold', WHITE, a, rtl=False, shadow=10)
    draw_text(c, 'تطوير مشترك للدافعات', W / 2, 530, 48, 'med', STEEL, a, shadow=8)

# ---------------- track / accel ----------------
def ov_track(c, t):
    a = env(t, 31.55, 33.2, 0.3, 0.15)
    tag_label(c, 'لقطة توضيحية — ليست رودستر', a)
    for i, x in enumerate((300, 540, 780)):
        ph = (t * 1.6 + i * 0.3) % 1.0
        arrow(c, x, 820 + 60 * ph, x, 960 + 60 * ph, CYAN, a * (1 - ph), 6, 22)
    draw_text(c, 'الشفط = تماسك أكبر', W / 2, 470, 64, 'bold', WHITE, a, shadow=10)

def ov_thrust_launch(c, t):
    a = env(t, 35.5, 37.06, 0.3, 0.15)
    draw_text(c, 'دافعات خلفية', W / 2, 430, 84, 'bold', WHITE, a, shadow=10)
    draw_text(c, '= دفعة تسارع إضافية', W / 2, 525, 48, 'med', CYAN, a, shadow=8)

def ov_accel(c, t):
    """0→96 km/h readout. Count runs 0.81 s (Tesla's on-stage timing) ending as 'بأقل من ثانية' is spoken."""
    a = env(t, 37.15, 41.55, 0.3, 0.2)
    if a <= 0: return
    cx, cy = W / 2, 760
    c.drawCircle(cx, cy, 250, paint('#000000', 0.45 * a)); c.drawCircle(cx, cy, 250, paint(STEEL, 0.4 * a, 2))
    t0, t1 = 39.40, 40.21
    k = clamp((t - t0) / (t1 - t0))
    spd = int(round(96 * (1 - (1 - k) ** 1.6))) if t >= t0 else 0
    path = skia.Path(); path.addArc(skia.Rect.MakeXYWH(cx - 230, cy - 230, 460, 460), 135, 270 * spd / 96)
    c.drawPath(path, paint(RED, a, 14)); c.drawPath(path, paint(RED, 0.35 * a, 30, blur=14))
    draw_text(c, str(spd), cx, cy - 10, 170, 'bold', WHITE, a, rtl=False)
    draw_text(c, 'كم/س', cx, cy + 110, 44, 'med', STEEL, a)
    draw_text(c, 'من ٠ إلى ٩٦ كم/س', cx, 430, 56, 'bold', WHITE, a, shadow=8)
    b = ease_out(lin(t, 40.3, 40.6)) * a
    draw_text(c, 'أقل من ثانية', cx, 1100, 92, 'bold', RED, b, shadow=10, scale=lerp(1.2, 1, b))
    draw_text(c, '0.81 s', cx - 120, 1205, 50, 'semi', WHITE, b, rtl=False, shadow=6)
    draw_text(c, 'بحسب تجربة تسلا', cx + 110, 1205, 40, 'med', STEEL, b, shadow=6)

def ov_attitude(c, t):
    a = env(t, 41.6, 44.55, 0.3, 0.2)
    if a <= 0: return
    cx, cy = W / 2, 960
    c.drawCircle(cx, cy, 330, paint(CYAN, 0.5 * a, 2))
    ang = math.sin((t - 41.6) * 2.2) * 25
    c.save(); c.translate(cx, cy); c.rotate(ang)
    c.drawLine(-330, 0, -150, 0, paint(CYAN, a, 4)); c.drawLine(150, 0, 330, 0, paint(CYAN, a, 4))
    c.restore()
    for k in range(0, 360, 15):
        r0 = 330 if k % 45 else 300
        c.drawLine(cx + r0 * math.cos(math.radians(k)), cy + r0 * math.sin(math.radians(k)), cx + 345 * math.cos(math.radians(k)), cy + 345 * math.sin(math.radians(k)), paint(CYAN, 0.6 * a, 2))
    draw_text(c, 'تحكم بالحركة والتوازن', W / 2, 470, 64, 'bold', WHITE, a, shadow=10)

# ---------------- versions / reservation / closing ----------------
def ov_buy(c, t):
    a = env(t, 44.62, 46.5, 0.3, 0.15)
    draw_text(c, 'هل نقدر نشتريها؟', W / 2, 450, 96, 'bold', WHITE, a, shadow=12)
    b = ease_out(lin(t, 45.85, 46.2)) * a
    for i, n in enumerate(('ROCKET', 'THRUST', 'PERFORMANCE')):
        draw_text(c, n, W / 2, 610 + i * 70, 44, 'semi', RED if i == 0 else STEEL, b * ease_out(lin(t, 45.9 + i * 0.08, 46.2 + i * 0.08)), rtl=False, shadow=6)

def ov_trims(c, t):
    for n in ('Performance', 'Thrust', 'Rocket'): trim_card(c, t, n)

def ov_not_price(c, t):
    a = env(t, 66.48, 68.94, 0.3, 0.2)
    c.drawRect(skia.Rect.MakeWH(W, H), paint(BG, 0.45 * max(a, env(t, 68.96, 71.3, 0.2, 0.2))))
    draw_text(c, 'مبالغ حجز', W / 2, 760, 130, 'bold', WHITE, a, shadow=12)
    b = ease_out(lin(t, 67.5, 67.85)) * a
    draw_text(c, 'ليست أسعار البيع', W / 2, 900, 84, 'bold', RED, b, shadow=10)
    c.drawLine(W / 2 - 260 * b, 990, W / 2 + 260 * b, 990, paint(STEEL, 0.5 * b, 2))
    d = env(t, 68.98, 71.3, 0.3, 0.25)
    draw_text(c, 'الإنتاج المستهدف', W / 2, 720, 72, 'semi', WHITE, d, shadow=10)
    yr = int(round(lerp(2026, 2028, ease_out(lin(t, 69.6, 70.5)))))
    draw_text(c, '٢٠٢٨' if yr == 2028 else ('٢٠٢٦' if yr == 2026 else '٢٠٢٧'), W / 2, 880, 220, 'bold', RED, d, shadow=14)
    draw_text(c, 'هدف معلن — وليس موعد تسليم مضمون', W / 2, 1060, 40, 'med', STEEL, d, shadow=8)

def ov_future_real(c, t):
    a = env(t, 71.4, 73.98, 0.3, 0.1)
    draw_text(c, 'إذا اليوم بتنطّ…', W / 2, 470, 80, 'bold', WHITE, a, shadow=10)

def ov_closing(c, t):
    a = ease_out(lin(t, 75.85, 76.3))
    c.drawRect(skia.Rect.MakeLTRB(0, 0, W, H), paint(BG, 0.25 * a))
    draw_text(c, 'هذا مجرد', W / 2, 555, 96, 'light', WHITE, a, shadow=12)
    draw_text(c, 'البداية', W / 2, 800, 190, 'bold', WHITE, ease_out(lin(t, 76.0, 76.45)), shadow=14,
              scale=lerp(1.12, 1, ease_out(lin(t, 76.0, 76.6))))
    b = ease_out(lin(t, 76.5, 76.9))
    c.drawLine(W / 2 - 200 * b, 930, W / 2 + 200 * b, 930, paint(RED, b, 6))
    pill = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(W / 2 - 170, 1000, 340, 96), 48, 48)
    c.drawRRect(pill, paint(RED, 0.95 * b)); draw_text(c, 'تابعوني', W / 2, 1048, 56, 'bold', WHITE, b)

# ---------------- subtitles ----------------
_CUES = None
def cues():
    global _CUES
    if _CUES is None:
        _CUES = json.load(open(os.path.join(ROOT, 'timing', 'narration_map.json')))['cues']
    return _CUES

def split_two(txt, size, maxw=880):
    if text_width(txt, size, 'semi') <= maxw + 40: return [txt]
    words = txt.split(' '); best = None
    for i in range(1, len(words)):
        a, b = ' '.join(words[:i]), ' '.join(words[i:])
        m = max(text_width(a, size, 'semi'), text_width(b, size, 'semi'))
        if best is None or m < best[0]: best = (m, [a, b])
    return best[1]

SUB_MUTE = [(30.0, 31.5)]  # standalone typography already shows the exact words
def draw_subtitles(c, t):
    if any(a <= t < b for a, b in SUB_MUTE): return
    for cu in cues():
        if cu['start'] - 0.04 <= t < cu['end'] + 0.12:
            a = min(ease_out(lin(t, cu['start'] - 0.04, cu['start'] + 0.1)), 1 - ease_in(lin(t, cu['end'], cu['end'] + 0.12)))
            size = 50
            lines = split_two(cu['text'], size)
            y = 1452 if len(lines) == 1 else 1418
            for i, ln in enumerate(lines):
                draw_text(c, ln, 520, y + i * 70, size, 'semi', WHITE, a, shadow=6)
            break
