"""Scene library for NEURALINK — THE FUTURE OF THE HUMAN MIND.
Each scene draws one full 1080x1920 frame: draw(c, lt, T) with lt = scene-local time, T = master time.
Badges distinguish real material from illustration / speculation; credits sit in the lower safe zone."""
import math, functools, os
import numpy as np, skia, cv2
from .gfx import *
from . import media as M
from .timeline import SCENES

DUR = {s: e - b for s, b, e in SCENES}
START = {s: b for s, b, e in SCENES}

# ---------- shared elements ----------
BADGES = {
    'real_demo': ('تجربة حقيقية', AMBER), 'real_photo': ('صورة حقيقية', AMBER), 'archive': ('صورة أرشيفية', BONE),
    'micro': ('صورة مجهرية حقيقية', AMBER), 'mri': ('رنين مغناطيسي حقيقي', AMBER), 'sim': ('محاكاة توضيحية', ICE),
    'research': ('تقنية قيد البحث', ICE), 'future': ('تصوّر مستقبلي', VIOLET),
}

def badge(c, kind, a=1.0):
    if not kind or a <= 0: return
    txt, col = BADGES[kind]
    tw, th = text_size(txt, 30, 'display', 500)
    x1 = W - 64; y = 262; h = 58; w = tw + 76
    r = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(x1 - w, y - h / 2, w, h), h / 2, h / 2)
    c.drawRRect(r, paint(INK, 0.62 * a))
    c.drawRRect(r, paint(col, 0.55 * a, 1.6))
    c.drawCircle(x1 - 30, y, 7, paint(col, a))
    c.drawCircle(x1 - 30, y, 14, paint(col, 0.25 * a, blur=6))
    draw_text(c, txt, x1 - 50, y + 1, 30, 'display', 500, PAPER, a, anchor='r')

def credit(c, txt, a=1.0):
    if txt and a > 0: draw_text(c, txt, 64, 1548, 21, 'mono', 400, SILVER, 0.62 * a, anchor='l', shadow=4)

def caption(c, txt, x, y, size=26, a=1.0, color=PAPER, anchor='c', family='mono', weight=500):
    draw_text(c, txt, x, y, size, family, weight, color, a, anchor=anchor, shadow=5)

def kinetic(c, txt, x, y, size, lt, t0, color=PAPER, family='display', weight=800, dur=0.45, out=None, rise=40, glow=0):
    """Word reveal: rises + unblurs + fades in from t0; optional fade-out at 'out'."""
    x_ = ease_out5(lin(lt, t0, t0 + dur))
    if x_ <= 0: return
    a = x_ if out is None else x_ * (1 - ease_io(lin(lt, out, out + 0.3)))
    draw_text(c, txt, x, y + rise * (1 - x_), size, family, weight, color, a, blur=10 * (1 - x_), shadow=14, glow=glow)

def V(name, key, tc, lt, speed=1.0, width=1440):
    return M.clip(name, key, tc_in=tc, speed=speed, width=width).get(lt)

def amber_thread(c, pts, a=1.0, width=3.2, color=AMBER, glow=8):
    poly_line(c, pts, color, a, width, glow)

def scanline(c, y, a=1.0, color=AMBER):
    c.drawRect(skia.Rect.MakeXYWH(0, y - 1, W, 2), paint(color, 0.8 * a))
    c.drawRect(skia.Rect.MakeXYWH(0, y - 30, W, 60), paint(color, 0.10 * a, blur=20))

def reticle(c, x, y, r, a, lt, color=AMBER, label=None):
    """thin measuring reticle — circle draws on, ticks, optional mono label"""
    if a <= 0: return
    sweep = 360 * ease_out5(clamp(a * 1.4))
    c.drawArc(skia.Rect.MakeXYWH(x - r, y - r, 2 * r, 2 * r), -90, sweep, False, paint(color, 0.9 * a, 2.2))
    c.drawArc(skia.Rect.MakeXYWH(x - r * 1.25, y - r * 1.25, 2.5 * r, 2.5 * r), -90 + lt * 40, 50, False, paint(color, 0.5 * a, 1.4))
    for k in range(4):
        ang = k * math.pi / 2; c.drawLine(x + math.cos(ang) * r * 0.82, y + math.sin(ang) * r * 0.82,
                                          x + math.cos(ang) * r * 1.08, y + math.sin(ang) * r * 1.08, paint(color, a, 2))
    if label:
        c.drawLine(x + r * 0.72, y - r * 0.72, x + r * 1.5, y - r * 1.5, paint(color, 0.8 * a, 1.6))
        c.drawLine(x + r * 1.5, y - r * 1.5, x + r * 1.5 + 30, y - r * 1.5, paint(color, 0.8 * a, 1.6))
        caption(c, label, x + r * 1.5 + 38, y - r * 1.5, 24, a, color, anchor='l')

def paper_backdrop(c, tone=PAPER, a=1.0):
    fill(c, tone, a)
    radial(c, W * 0.5, H * 0.45, H * 0.7, '#FFFFFF', 0.25 * a)
    vignette(c, 0.28 * a)

def ink_backdrop(c, glow=INK3, gy=0.42):
    backdrop(c, 0, INK, glow, 0.5, gy)

@functools.lru_cache(16)
def still_from_clip(key, tc, width=1080):
    cl = M.Clip(key, tc_in=tc, width=width); img = cl.get(0); cl.close(); return img

def ghost_plate(c, key, a=0.10, cx=0.5, cy=0.5, zoom=1.0, rect=None):
    """archival engraving as a faint light-on-dark texture layer"""
    draw_cover(c, M.photo(key), rect or skia.Rect.MakeWH(W, H), cx, cy, zoom, a, cf=cf_invert_mono((0.82, 0.86, 1.0)),
               blend=skia.BlendMode.kScreen)

def seq(c, shot, lt, n, flip=False, alpha=1.0, zoom=1.0, cy=0.5, dy=0.0):
    f = int(clamp(lt * FPS + 1, 1, n))
    img = M.seq_frame(shot, f)
    if img is None:
        for g in range(f, 0, -1):
            img = M.seq_frame(shot, g)
            if img is not None: break
    if img is None:
        caption(c, f'[3D {shot} pending]', W / 2, H / 2, 40, 1, EMBER); return
    rect = skia.Rect.MakeXYWH(0, dy, W, H)
    draw_cover(c, img, rect, 0.5, cy, zoom, alpha, flip=flip)

def cover_point(img, rect, cx, cy, zoom, px, py):
    """screen position of image point (px, py) (normalised) under draw_cover(img, rect, cx, cy, zoom)"""
    iw, ih = img.width(), img.height()
    s = max(rect.width() / iw, rect.height() / ih) * zoom
    vw, vh = rect.width() / s, rect.height() / s
    x0 = clamp(cx * iw - vw / 2, 0, max(0, iw - vw)); y0 = clamp(cy * ih - vh / 2, 0, max(0, ih - vh))
    return rect.left() + (px * iw - x0) * s, rect.top() + (py * ih - y0) * s

@functools.lru_cache(1)
def brain_3d():
    """last frame of 3D shot D: the anatomical brain with the implant (BodyParts3D)"""
    return M.seq_frame('D', 45)

# ============================================================== SCENES
def hook_eye(c, lt, T):
    img = V('eye', 'pv_eye_closeup', 0.6, lt)
    z = 1.16 + 0.10 * ease_io(lt / 1.3)
    draw_cover(c, img, None, 0.5, 0.5, z, 1.0, cf=cf_grade(0.92, 1.06, -0.02, 0.4))
    vignette(c, 0.55)
    # amber reticle locks onto the iris (iris measured at (0.605, 0.49) of the source frame)
    a = ease_out(lin(lt, 0.25, 0.9))
    reticle(c, W / 2 + 0.105 * W * z, H / 2 - 0.01 * H * z, 125 * z / 1.16, a * (1 - lin(lt, 1.15, 1.3)), lt, AMBER)

PRINT_POOL = [  # (kind, key, tc or None, cx, cy)
    ('photo', 'px_old_family_photos', None, 0.62, 0.62), ('clip', 'pv_elderly_photo', 1.0, 0.5, 0.6),
    ('clip', 'pv_family_photos_box', 6.0, 0.45, 0.55), ('clip', 'pv_alley_pov', 3.0, 0.5, 0.6),
    ('photo', 'px_eye_macro', None, 0.5, 0.5), ('clip', 'pv_city_night', 6.0, 0.5, 0.6),
    ('photo', 'px_old_family_photos', None, 0.30, 0.35), ('clip', 'pv_clouds_golden', 5.0, 0.5, 0.5),
    ('photo', 'cajal_lab', None, 0.45, 0.5), ('photo', 'eniac', None, 0.55, 0.5), ('photo', 'cajal_purkinje', None, 0.5, 0.4),
    ('photo', 'skull_nara', None, 0.5, 0.45), ('photo', 'galvani_setup', None, 0.5, 0.5), ('clip', 'pv_typing', 3.0, 0.5, 0.5),
    ('photo', 'brainbow', None, 0.5, 0.5), ('photo', 'pyramidal_40x', None, 0.5, 0.5), ('photo', 'berger_photo', None, 0.6, 0.4),
    ('photo', 'nl_monkey_matrix', None, 0.3, 0.4), ('photo', 'vesalius_brain', None, 0.5, 0.3), ('clip', 'pv_ear_closeup', 2.0, 0.5, 0.5),
    ('photo', 'nih_neural_comm', None, 0.5, 0.5), ('photo', 'cortical_neurons', None, 0.5, 0.5), ('photo', 'bci_eeg_cap', None, 0.62, 0.45),
    ('photo', 'dti_sagittal', None, 0.5, 0.45),
]   # 2026-10-18 refinement: stock-portrait slots replaced in place by subject-relevant imagery (other slots unchanged)
def pool_img(i):
    k, key, tc, cx, cy = PRINT_POOL[i % len(PRINT_POOL)]
    return (M.thumb(key) if k == 'photo' else still_from_clip(key, tc, 720)), cx, cy

def hook_prints(c, lt, T):
    ink_backdrop(c)
    ghost_plate(c, 'cajal_cortex', 0.07, 0.5, 0.5, 1.2)
    # the eye shot becomes a photograph and drifts away among other memories
    x = ease_out5(lin(lt, 0.0, 0.5))
    drift = ease_in(lin(lt, 0.55, 1.38))
    rng = np.random.default_rng(5)
    for i in range(9):
        ang = rng.uniform(0, 2 * math.pi); rad = rng.uniform(380, 640)
        px, py = W / 2 + math.cos(ang) * rad * (0.5 + 0.5 * x), H * 0.44 + math.sin(ang) * rad * 1.1 * (0.5 + 0.5 * x)
        px += math.cos(ang) * 700 * drift; py += math.sin(ang) * 700 * drift
        img, cx, cy = pool_img(i)
        a = ease_out(lin(lt, 0.05 + i * 0.03, 0.35 + i * 0.03)) * (1 - drift)
        print_card(c, img, px, py, 300, 380, rng.uniform(-12, 12) + lt * rng.uniform(-6, 6), a, cx=cx, cy=cy,
                   blur=drift * 10, cf=cf_grade(0.75, 1.0, 0.0, 0.6))
    eye = M.clip('eye', 'pv_eye_closeup', tc_in=0.6).get(1.24 + lt * 0.4)
    ww = lerp(W, 640, x); hh = lerp(H, 820, x)
    print_card(c, eye, W / 2 + 200 * drift, H * 0.44 - 300 * drift, ww, hh, lerp(0, -4, x) - 8 * drift, 1 - drift * 0.85,
               border=0.045 * x, cx=0.53, cy=0.5, zoom=1.0 + 0.2 * (1 - x), blur=drift * 12, shadow=x)
    # "تنسى" — the word itself fades like a memory
    xa = ease_out5(lin(lt, 0.02, 0.35)); fo = ease_in(lin(lt, 0.6, 1.3))
    draw_text(c, 'تنسى', W / 2, H * 0.44 + 10, 300 + 40 * lt, 'serif', 700, PAPER, xa * (1 - fo), blur=fo * 26 + (1 - xa) * 12, shadow=30)

def portrait(c, lt, T):
    # real DTI tractography of a human brain; the camera pushes in on the motor cortex, where the implant goes
    ink_backdrop(c, '#151B38', 0.40)
    img = M.photo('dti_sagittal')
    MC = (0.52, 0.09)   # top of the corticospinal tract (motor cortex) in the source image
    z = keys(lt, [(0, 1.0), (0.88, 1.6)], ease_in)
    rect = skia.Rect.MakeXYWH(-80, 330, 1240, 1156)
    fy = 0.42 - 0.30 * lin(z, 1.0, 1.6)
    draw_cover(c, img, rect, MC[0], fy, z, 1.0, cf=cf_grade(1.0, 1.1, 0.02, 0.0),
               blur=lin(lt, 0.55, 0.88) * 14, blend=skia.BlendMode.kScreen)
    gradient_v(c, [(0, INK, 0.0), (0.64, INK, 0.0), (0.78, INK, 0.85), (1.0, INK, 0.85)])
    vignette(c, 0.5)
    a = ease_out(lin(lt, 0.18, 0.6)) * (1 - lin(lt, 0.6, 0.88))
    rx, ry = cover_point(img, rect, MC[0], fy, z, *MC)
    reticle(c, rx, ry, 90, a, lt, AMBER)
    if a > 0:   # leader + label straight below the reticle (keeps clear of the badge and the frame edges)
        c.drawLine(rx, ry + 90 * 1.08, rx, ry + 150, paint(AMBER, 0.8 * a, 1.6))
        caption(c, 'القشرة الحركية · MOTOR CORTEX', rx, ry + 178, 24, a, AMBER)
    caption(c, 'دماغ إنسان حقيقي — تصوير الألياف العصبية بالرنين (DTI)', W / 2, 1335, 23, ease_out(lin(lt, 0.1, 0.4)), SILVER)

def anat_bg(c, lt, a=0.10):
    ink_backdrop(c, '#1B2140', 0.38)
    ghost_plate(c, 'vesalius_brain', a, 0.5, 0.18, 1.35)
    radial(c, W * 0.5, H * 0.42, 700, VIOLET, 0.10)

def anat_A(c, lt, T):
    anat_bg(c, lt)
    seq(c, 'A', lt, 51, flip=True)
    # implant lands ~ frame 44-51 -> scale callout
    a = ease_out(lin(lt, 1.30, 1.62))
    if a > 0:
        x, y = W * 0.50, H * 0.52   # implant position in the last frames of shot A (flipped render)
        c.drawLine(x + 95, y - 60, x + 200, y - 230, paint(PAPER, 0.85 * a, 1.8))
        c.drawLine(x + 200, y - 230, x + 250, y - 230, paint(PAPER, 0.85 * a, 1.8))
        caption(c, '≈ ٢٣ مم', x + 260, y - 232, 36, a, PAPER, anchor='l', family='display', weight=600)
        caption(c, 'قطر الجهاز المعلن', x + 260, y - 188, 22, a * 0.85, SILVER, anchor='l')

def anat_B(c, lt, T):
    anat_bg(c, lt, 0.07)
    seq(c, 'B', lt, 38, flip=True)
    kinetic(c, '٦٤ خيطاً', W / 2, 1225, 76, lt, 0.25, PAPER, weight=700)
    a = ease_out(lin(lt, 0.45, 0.8))
    caption(c, 'فيها ١٬٠٢٤ قطباً كهربائياً', W / 2, 1300, 28, a, AMBER, family='display', weight=500)

def micro(c, lt, T):
    ink_backdrop(c, '#20263F', 0.36)
    img = M.photo('pyramidal_electrode')
    z = 1.05 + 0.12 * ease_io(lt / 1.8)
    x = ease_out5(lin(lt, 0.0, 0.5))
    print_card(c, img, W / 2, 640 - 30 * (1 - x), 880, 640, -1.5 + 1.5 * (1 - x), x, cx=0.46, cy=0.48, zoom=z,
               cf=cf_grade(0.0, 1.15, 0.0, 0.8), caption='خلية عصبية حقيقية تحت المجهر · القطب مرسوم للتوضيح')
    # scale comparison: hair vs thread (published thread thickness 4-6 µm; human hair ~ 70 µm)
    a = ease_out(lin(lt, 0.44, 0.9))
    if a > 0:
        wbar = 820 * ease_out5(lin(lt, 0.44, 1.0)); x0 = W / 2 + 410
        c.drawRect(skia.Rect.MakeLTRB(x0 - wbar, 1165, x0, 1235), paint(BONE, 0.95 * a))
        caption(c, 'شعرة إنسان  ≈ ٧٠ ميكرون', x0, 1128, 28, a, PAPER, anchor='r', family='display', weight=500)
        b = ease_out(lin(lt, 0.75, 1.2)); wthr = 820 * ease_out5(lin(lt, 0.75, 1.3))
        c.drawRect(skia.Rect.MakeLTRB(x0 - wthr, 1288, x0, 1293), paint(AMBER, b))
        c.drawRect(skia.Rect.MakeLTRB(x0 - wthr, 1280, x0, 1301), paint(AMBER, 0.25 * b, blur=8))
        caption(c, 'خيط الشريحة  ≈ ٤–٦ ميكرون', x0, 1250, 28, b, AMBER, anchor='r', family='display', weight=500)

def think_face(c, lt, T):
    # Hans Berger (1873-1941), who first recorded the electrical activity of the human brain
    ink_backdrop(c, '#1A2045', 0.40)
    x = ease_out5(lin(lt, 0.0, 0.5))
    print_card(c, M.photo('berger_photo'), W / 2, 600 - 30 * (1 - x), 800, 600, -1.5 + 1.5 * (1 - x), x, cx=0.5, cy=0.45,
               zoom=1.03 + 0.06 * ease_io(lt / 1.5), cf=cf_mono((1.0, 0.95, 0.86)), caption='هانز بيرغر (١٨٧٣–١٩٤١)')
    # Hans Berger's first human EEG trace (1924), drawn on as a living amber line
    a = ease_out(lin(lt, 0.30, 0.6))
    if a > 0:
        trace = M.photo('berger_eeg')
        rev = ease_io5(lin(lt, 0.35, 1.45))
        rect = skia.Rect.MakeXYWH(-40, 1010, W + 80, (W + 80) * trace.height() / trace.width() * 1.7)
        c.save(); c.clipRect(skia.Rect.MakeLTRB(30, 1000, 30 + (W - 60) * rev, 1400))
        p = skia.Paint(AntiAlias=True); p.setAlphaf(a)
        p.setColorFilter(skia.ColorFilters.Compose(cf_invert_mono((1.0, 0.70, 0.37)), cf_grade(1.0, 2.6, -0.55))); p.setBlendMode(skia.BlendMode.kScreen)
        c.drawImageRect(trace, rect, SAMP_CUBIC, p); c.restore()
        caption(c, 'أول تخطيط كهربائي لدماغ إنسان — هانز بيرغر، ١٩٢٤', W / 2, 1290, 23, a * 0.9, BONE)

def neurons_C(c, lt, T):
    ink_backdrop(c, '#171C3A', 0.5)
    radial(c, W * 0.55, H * 0.45, 900, VIOLET, 0.16)
    seq(c, 'C', lt, 60)
    kinetic(c, 'إشارات كهربائية', W / 2, 380, 84, lt, 0.5, PAPER, weight=800, glow=0)

def decode(c, lt, T):
    ink_backdrop(c, '#151B38', 0.30)
    # real BCI research photo as a print (EEG-cap participant steering a cursor)
    a0 = ease_out5(lin(lt, 0.0, 0.45))
    print_card(c, M.photo('bci_krol_cursor'), W / 2 + 40, 520, 860, 560, 1.2, a0, cx=0.42, cy=0.5, zoom=1.05,
               cf=cf_grade(1.0, 1.15, 0.06, 0.0), caption='تجربة حقيقية: مشارك يحرّك مؤشراً بإشارات الدماغ (EEG)')
    # spike raster: channels flowing right -> left into the decoder
    yb, rows = 930, 18
    rng = np.random.default_rng(1)
    rate = rng.uniform(0.6, 3.2, rows)
    dec_x = 400
    ain = ease_out(lin(lt, 0.15, 0.5))
    for r in range(rows):
        y = yb + r * 14
        c.drawLine(dec_x + 30, y, W - 60, y, paint(SILVER, 0.08 * ain, 1))
        g = np.random.default_rng(100 + r)
        spikes = g.uniform(0, 30, int(rate[r] * 30))
        for s in spikes:
            x = W - 60 - ((s * 70 + lt * 420) % (W - 60 - dec_x - 30))
            c.drawLine(x, y - 5, x, y + 5, paint(AMBER, 0.85 * ain, 2))
    caption(c, '١٬٠٢٤ قناة  ·  الشريحة تقرأ', W - 60, yb - 36, 22, ain, AMBER, anchor='r')
    # decoder block
    ad = ease_out(lin(lt, 1.1, 1.5))
    rr = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(dec_x - 150, yb - 20, 180, 280), 22, 22)
    c.drawRRect(rr, paint(INK2, 0.9 * ad)); c.drawRRect(rr, paint(ICE, 0.8 * ad, 2))
    draw_text(c, 'AI', dec_x - 60, yb + 100, 64, 'display', 800, ICE, ad)
    caption(c, 'فكّ الترميز', dec_x - 60, yb + 170, 24, ad, SILVER, family='display', weight=500)
    # output: cursor moves to target on a minimal screen
    ao = ease_out(lin(lt, 1.45, 1.9))
    scr = skia.Rect.MakeXYWH(90, 1235, 230, 140)
    c.drawRoundRect(scr, 14, 14, paint(SILVER, 0.6 * ao, 2))
    k = ease_io5(lin(lt, 1.8, 2.8))
    tx, ty = scr.left() + 180, scr.top() + 40
    cx_, cy_ = lerp(scr.left() + 40, tx, k), lerp(scr.bottom() - 30, ty, k)
    c.drawCircle(tx, ty, 16, paint(AMBER, 0.9 * ao, 2))
    if k > 0.98: c.drawCircle(tx, ty, 16, paint(AMBER, 0.5 * ao))
    path = skia.Path(); path.moveTo(cx_, cy_); path.lineTo(cx_ + 9, cy_ + 26); path.lineTo(cx_ + 14, cy_ + 15)
    path.lineTo(cx_ + 26, cy_ + 13); path.close(); c.drawPath(path, paint(PAPER, ao))
    c.drawLine(dec_x - 150, yb + 260, scr.centerX(), scr.top(), paint(ICE, 0.5 * ao, 1.5))
    caption(c, 'اليوم: تُفكّ نيّة الحركة — لا الأفكار نفسها', W - 60, 1300, 25, ease_out(lin(lt, 2.0, 2.4)), PAPER, anchor='r', family='display', weight=500)

def anat_D(c, lt, T):
    anat_bg(c, lt, 0.08)
    radial(c, W * 0.5, H * 0.45, 800, ICE, 0.10 * ease_io(lin(lt, 0, 1.5)))
    seq(c, 'D', lt, 45)
    kinetic(c, 'إرجاع المعلومات للدماغ', W / 2, 430, 66, lt, 0.2, ICE, weight=700)

def galvani(c, lt, T):
    paper_backdrop(c, '#E9E1D1')
    img = M.photo('galvani_wellcome')
    x = ease_out5(lin(lt, 0, 0.5))
    print_card(c, img, W / 2, 780, 780, 1060, 1.0 - 1.0 * x, 1.0, border=0.03, paper='#F6F1E6', cx=0.5, cy=0.42,
               zoom=1.04 + 0.08 * lt / 1.6, cf=cf_grade(0.9, 1.05, 0.0, 0.3), shadow=0.6, lift=0.6)
    # a spark of current crossing the plate
    k = lin(lt, 0.4, 1.4)
    if 0 < k < 1:
        pts = [(260 + 560 * u, 560 + 120 * math.sin(u * 9 + lt * 8) * (1 - u) + 220 * u) for u in np.linspace(0, k, 40)]
        amber_thread(c, pts, 0.9, 3, ICE, 10)
    caption(c, 'غالفاني ١٧٩١: الكهرباء تحرّك الأعصاب — أصل فكرة التحفيز', W / 2, 1370, 25, ease_out(lin(lt, 0.3, 0.7)), INK)

def imagine_see(c, lt, T):
    eye = V('eye_move', 'pv_eye_move', 0.4, lt * 0.8)
    z = 1.1 + 0.25 * ease_in(lin(lt, 0, 1.65))
    draw_cover(c, eye, None, 0.48, 0.53, z, 1.0, cf=cf_grade(0.95, 1.05, 0.0, -0.1))
    vignette(c, 0.45)
    # what the eye sees opens out of the pupil
    k = ease_in(lin(lt, 1.6, 2.2))
    if k > 0:
        world = V('alley', 'pv_alley_pov', 2.0, lt - 1.6)
        r = lerp(70, 1200, k)
        cx_, cy_ = W / 2 + (W * 0.48 - W / 2) * (1 - k), H * 0.53
        c.save(); path = skia.Path(); path.addCircle(cx_, cy_, r); c.clipPath(path, doAntiAlias=True)
        draw_cover(c, world, None, 0.5, 0.55, 1.15 - 0.1 * k, 1.0, cf=cf_grade(0.95, 1.05, 0.0, 0.2))
        c.restore()
        c.drawCircle(cx_, cy_, r, paint(AMBER, 0.6 * (1 - k), 3))
    kinetic(c, 'تخيّل', W / 2, 420, 150, lt, 0.45, PAPER, family='serif', weight=700, out=1.45)

_VO = None
def vo_wave():
    global _VO
    if _VO is None:
        import soundfile as sf
        x, sr = sf.read(os.path.join(ROOT, 'timing', 'vo_16k_analysis.wav'), dtype='float32')
        _VO = (x if x.ndim == 1 else x.mean(1), sr)
    return _VO

def imagine_hear(c, lt, T):
    img = V('ear', 'pv_ear_closeup', 1.0, lt)
    draw_cover(c, img, None, 0.42, 0.42, 1.12 + 0.06 * lt, 1.0, cf=cf_grade(0.95, 1.05, -0.03, 0.1))
    vignette(c, 0.5)
    # the narrator's actual voice (this very recording) drawn as a waveform flowing into the ear
    x, sr = vo_wave(); n = 900
    t0 = max(0, int((T - 0.6) * sr)); seg = x[t0:t0 + int(0.6 * sr)]
    if len(seg) > 10:
        idx = np.linspace(0, len(seg) - 1, n).astype(int); v = seg[idx]
        a = ease_out(lin(lt, 0, 0.25))
        pts = [(W + 10 - i * (W - 330) / n, H * 0.60 + v[i] * 1500 * (0.35 + 0.65 * i / n)) for i in range(n)]
        amber_thread(c, pts, a, 2.4, AMBER, 6)
    kinetic(c, 'بتسمعه', W / 2, 400, 110, lt, 0.05, PAPER, family='serif', weight=700)

def _mosaic(c, img, k, lt, cell=36, cx=0.5, cy=0.48, zoom=1.15, rise=1.0, tint=ICE):
    """frame -> grid of colour cells that detach and rise as 'data'"""
    s = skia.Surface(W // cell, H // cell)
    draw_cover(s.getCanvas(), img, skia.Rect.MakeWH(W // cell, H // cell), cx, cy, zoom)
    arr = s.makeImageSnapshot().toarray(colorType=skia.kRGBA_8888_ColorType)
    rng = np.random.default_rng(9)
    gw, gh = W // cell, H // cell
    thr = rng.uniform(0, 1, (gh, gw)) * 0.75 + (1 - np.linspace(0, 1, gh))[:, None] * 0.25
    col = rgb(tint)
    for j in range(gh):
        for i in range(gw):
            r, g, b = int(arr[j, i, 0]), int(arr[j, i, 1]), int(arr[j, i, 2])
            if r + g + b < 40: continue
            p = clamp((k - thr[j, i]) / 0.25)
            y = j * cell - rise * 1600 * ease_in(p)
            mixc = (int(lerp(r, col[0], p * 0.8)), int(lerp(g, col[1], p * 0.8)), int(lerp(b, col[2], p * 0.8)))
            sz = cell - 3 - 10 * p
            a = 1 - ease_in(lin(p, 0.6, 1.0))
            if a <= 0: continue
            c.drawRect(skia.Rect.MakeXYWH(i * cell + (cell - sz) / 2, y + (cell - sz) / 2, sz, sz),
                       skia.Paint(AntiAlias=True, Color=skia.ColorSetARGB(int(255 * a), *mixc)))

def to_data(c, lt, T):
    ink_backdrop(c, '#1B2350', 0.35)
    img = brain_3d()   # the brain + implant (3D) dissolves into data
    k = lin(lt, 1.1, 2.75)   # cells are still rising when the cloud shot slides in (no empty frames)
    if k <= 0:
        draw_cover(c, img, None, 0.45, 0.5, 1.15 + 0.05 * lt, 1.0, cf=cf_grade(1.0, 1.1, 0.04))
    else:
        draw_cover(c, img, None, 0.45, 0.5, 1.15 + 0.05 * lt, 1 - ease_io(k * 3), cf=cf_grade(1.0, 1.1, 0.04))
        _mosaic(c, img, k * 1.3, lt, cx=0.45, cy=0.5, zoom=1.15 + 0.05 * lt, rise=0.9)
    vignette(c, 0.4)
    kinetic(c, 'بيانات', W / 2, 400, 120, lt, 1.12, ICE, weight=800)
    if k > 0:
        rng = np.random.default_rng(int(lt * 30))
        for i in range(10):
            caption(c, ''.join(rng.choice(list('01')) for _ in range(14)), rng.uniform(150, 930), rng.uniform(600, 1300), 20, 0.5 * k, ICE)

def to_cloud(c, lt, T):
    img = V('clouds', 'pv_clouds_blue', 1.0, lt)
    draw_cover(c, img, None, 0.5, 0.45, 1.05 + 0.04 * lt, 1.0, cf=cf_grade(1.0, 1.05, 0.0, -0.1))
    gradient_v(c, [(0, INK, 0.0), (0.7, INK, 0.0), (1.0, INK, 0.7)])
    # data cells rising into the cloud
    rng = np.random.default_rng(4)
    for i in range(150):
        x = rng.uniform(80, W - 80); sp = rng.uniform(500, 1300); y = H + 50 - ((lt * sp + rng.uniform(0, 2400)) % 2400)
        if y < 300: continue
        sz = rng.uniform(8, 22); a = clamp((y - 300) / 500)
        c.drawRect(skia.Rect.MakeXYWH(x, y, sz, sz), paint(ICE if i % 3 else PAPER, 0.75 * a))
    # backup progress card
    a = ease_out5(lin(lt, 0.05, 0.4)); p = ease_io(lin(lt, 0.2, 1.5))
    card = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(150, 1150 + 30 * (1 - a), 780, 150), 28, 28)
    c.drawRRect(card, paint(INK, 0.55 * a)); c.drawRRect(card, paint(SILVER, 0.35 * a, 1.5))
    caption(c, 'نسخة احتياطية للدماغ', 870, 1195 + 30 * (1 - a), 32, a, PAPER, anchor='r', family='display', weight=600)
    caption(c, f'{int(p * 100)}%', 190, 1195 + 30 * (1 - a), 30, a, ICE, anchor='l')
    c.drawRoundRect(skia.Rect.MakeXYWH(190, 1250 + 30 * (1 - a), 700, 12), 6, 6, paint(SILVER, 0.25 * a))
    c.drawRoundRect(skia.Rect.MakeXYWH(190, 1250 + 30 * (1 - a), 700 * p, 12), 6, 6, paint(ICE, a))

def seven_years(c, lt, T):
    fill(c, INK)
    city = V('city', 'pv_city_night', 4.0, lt, speed=0.8)
    k = lin(lt, 1.26, 1.5)
    draw_cover(c, city, None, 0.5, 0.5, 1.1, 0.75 * (1 - k), cf=cf_grade(0.8, 1.2, 0.03, -0.2))
    if k > 0:
        # "you hear about this technology": a phone showing the real Neuralink unveiling
        e = ease_io(k)
        radial(c, W / 2, PHONE_Y, 760, AMBER, 0.10 * e)
        phone_frame(c, W / 2, PHONE_Y + 90 * (1 - ease_out5(lin(lt, 1.26, 1.7))), 560, 960, news_screen(lt - 1.26), e, -3)
        vignette(c, 0.35)
    # year counter 2026 -> 2033
    yrs = int(round(lerp(2026, 2033, ease_io(lin(lt, 0.25, 1.05)))))
    a = ease_out(lin(lt, 0.0, 0.25)) * (1 - 0.65 * k)
    sz = lerp(260, 120, ease_io(k)); y = lerp(820, 330, ease_io(k))
    draw_text(c, str(yrs), W / 2, y, sz, 'display', 800, PAPER, a, shadow=20)
    caption(c, '+٧ سنين', W / 2, y + sz * 0.62, 40 * (sz / 260) + 10, a * ease_out(lin(lt, 0.9, 1.2)), AMBER, family='display', weight=600)

PHONE_Y = 900

@functools.lru_cache(4)
def _news(f):
    """phone screen: the real 2019 Neuralink unveiling photo with a slow push-in"""
    s = new_surface(); cc = s.getCanvas(); cc.clear(skia.ColorBLACK)
    draw_cover(cc, M.photo('nl_unveiling'), None, 0.42, 0.42, 1.05 + 0.0012 * f, 1.0, cf=cf_grade(1.0, 1.05, 0.0, 0.0))
    gradient_v(cc, [(0, INK, 0.0), (0.62, INK, 0.0), (1.0, INK, 0.9)])
    draw_text(cc, 'NEURALINK', W / 2, H * 0.80, 120, 'display', 300, PAPER, 1.0, shadow=20)
    return s.makeImageSnapshot()

def news_screen(t):
    return _news(int(clamp(t, 0, 3) * FPS))

def wait(c, lt, T):
    # the phone from the previous shot freezes on "لحظة!"
    punch = ease_out5(lin(lt, 0.44, 0.6))
    fill(c, INK)
    radial(c, W / 2, PHONE_Y, 760, AMBER, 0.10)
    c.save(); c.translate(W / 2, PHONE_Y); c.scale(1 + 0.08 * punch, 1 + 0.08 * punch); c.translate(-W / 2, -PHONE_Y)
    phone_frame(c, W / 2, PHONE_Y, 560, 960, news_screen(1.58 + min(lt, 0.44)), 1.0, -3)
    c.restore()
    fill(c, INK, 0.35 * punch)
    vignette(c, 0.45)
    if punch > 0:
        draw_text(c, 'لحظة!', W / 2, 1120, 230 * (1.25 - 0.25 * punch), 'serif', 700, AMBER, punch, shadow=24)
        fl = 1 - lin(lt, 0.44, 0.56)
        if fl > 0: fill(c, WHITE, 0.55 * fl)

def who_told(c, lt, T):
    # real NIH research image: electrical recordings of the human brain storing and retrieving memories
    ink_backdrop(c, '#1A2045', 0.45)
    x0 = ease_out5(lin(lt, 0.0, 0.5))
    print_card(c, M.photo('nih_memory_codes'), W / 2, 700 + 30 * (1 - x0), 560, 752, 1.5 * (1 - x0), x0, cx=0.5, cy=0.5,
               zoom=1.02 + 0.04 * lt / 2.16, cf=cf_grade(1.0, 1.05, 0.0, 0.0))
    vignette(c, 0.35)
    caption(c, 'صورة حقيقية: أبحاث NIH على تسجيلات الدماغ أثناء استرجاع الذكريات', W / 2, 1285, 22, ease_out(lin(lt, 0.3, 0.7)), SILVER)
    # half-remembered prints drifting around it, out of focus
    rng = np.random.default_rng(12)
    for i in range(5):
        img2, cx, cy = pool_img(i + 3)
        x = rng.choice([150, 930]) + rng.uniform(-60, 60); y = rng.uniform(250, 1200) - lt * rng.uniform(20, 60)
        print_card(c, img2, x, y, 210, 270, rng.uniform(-14, 14), 0.75 * ease_out(lin(lt, 0.1 + i * 0.1, 0.5 + i * 0.1)),
                   cx=cx, cy=cy, blur=rng.uniform(4, 12), cf=cf_grade(0.6, 1.0, 0.0, 0.5))
    kinetic(c, 'مين حكالي؟', W / 2, 1180, 120, lt, 1.32, PAPER, family='serif', weight=700)

@functools.lru_cache(1)
def opening_print():
    """frame of this very video's opening (eye + 'تنسى') — the memory the chip 'finds'"""
    s = new_surface(); cl = M.Clip('pv_eye_closeup', tc_in=0.6, width=1440)
    img = cl.get(1.0); cl.close()
    cc = s.getCanvas(); draw_cover(cc, img, None, 0.53, 0.5, 1.2, 1.0, cf=cf_grade(0.92, 1.06, -0.02, 0.4)); vignette(cc, 0.55)
    draw_text(cc, 'تنسى', W / 2, H * 0.44 + 10, 300, 'serif', 700, PAPER, 1.0, shadow=30)
    return s.makeImageSnapshot()

def search(c, lt, T):
    """camera travels through a corridor of floating memories; the scan line locks onto one."""
    ink_backdrop(c, '#1A2045', 0.45)
    ghost_plate(c, 'cajal_cortex', 0.05, 0.5, 0.5, 1.4)
    d = DUR['search']
    zc = 2600 * ease_io5(lin(lt, 0.0, 2.55))      # camera depth
    found_k = ease_out5(lin(lt, 2.5, 3.1))
    f = 900
    items = []
    rng = np.random.default_rng(21)
    for i in range(26):
        z = 300 + i * 115; x = rng.choice([-1, 1]) * rng.uniform(330, 560); y = rng.uniform(-520, 480)
        items.append((z, x, y, i))
    items.append((300 + 26 * 115 + 140, 0.0, -60.0, -1))   # the found memory, on axis at the end of the corridor
    for z, x, y, i in sorted(items, key=lambda q: -(q[0] - zc)):
        dz = z - zc
        if dz < 160: continue
        s = f / dz
        sx, sy = W / 2 + x * s, H * 0.45 + y * s
        w, h = 520 * s, 660 * s
        if w > 2400: continue
        fog = clamp(1 - (dz - 400) / 2600)
        if i == -1:
            img = opening_print(); a = fog
            print_card(c, img, sx, sy, w, h, 0, a, cx=0.5, cy=0.46, zoom=1.0, shadow=1.0)
            if found_k > 0:
                c.drawRect(skia.Rect.MakeXYWH(sx - w / 2 - 14, sy - h / 2 - 14, w + 28, h + 28), paint(AMBER, found_k, 4))
        else:
            img, cx, cy = pool_img(i)
            near = clamp((dz - 120) / 300)
            print_card(c, img, sx, sy, w, h, (i % 5 - 2) * 3, fog * near, cx=cx, cy=cy, blur=max(0, (600 - dz) / 50),
                       cf=cf_grade(0.7, 1.0, 0.0, 0.4), shadow=0.6)
    # scan line + HUD
    if lt < 2.6:
        scanline(c, 300 + (lt * 900) % 1150, 0.8)
    n = int(lerp(0, 12408, ease_out(lin(lt, 0.1, 2.5))))
    caption(c, f'بحث في الذكريات…  {n:,}', W / 2, 1290, 28, ease_out(lin(lt, 0.05, 0.3)) * (1 - found_k), ICE)
    caption(c, 'تمّ العثور على الجواب', W / 2, 1290, 30, found_k, AMBER, family='display', weight=600)

def phone_frame(c, x, y, w, h, screen, a=1.0, rot=0.0):
    c.save(); c.translate(x, y); c.rotate(rot)
    body = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(-w / 2, -h / 2, w, h), w * 0.13, w * 0.13)
    c.drawRRect(body.makeOffset(14, 34) if hasattr(body, 'makeOffset') else body, paint(BLACK, 0.5 * a, blur=40))
    c.drawRRect(body, paint('#0E0F14', a))
    c.drawRRect(body, paint('#3A3D48', a, 3))
    inner = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32), w * 0.10, w * 0.10)
    c.save(); c.clipRRect(inner, doAntiAlias=True)
    draw_cover(c, screen, skia.Rect.MakeXYWH(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32), 0.5, 0.5, 1.0, a)
    c.restore()
    c.drawRoundRect(skia.Rect.MakeXYWH(-w * 0.13, -h / 2 + 30, w * 0.26, 26), 13, 13, paint(BLACK, a))
    c.restore()

_SUB = None
def callback(c, lt, T, render_scene=None):
    ink_backdrop(c, '#1A2045', 0.45)
    radial(c, W / 2, H * 0.45, 700, AMBER, 0.10)
    # the found print becomes a phone playing the opening of THIS video
    global _SUB
    if _SUB is None: _SUB = new_surface()
    tt = 0.25 + (lt * 0.85) % 2.2
    sc = _SUB.getCanvas(); sc.clear(skia.ColorBLACK)
    if render_scene: render_scene(sc, tt)
    screen = _SUB.makeImageSnapshot()
    k = ease_out5(lin(lt, 0.0, 0.6))
    w, h = lerp(640, 600, k), lerp(810, 1240, k)
    phone_frame(c, W / 2, 760, w, h, screen, 1.0, lerp(0, -3, k))
    kinetic(c, 'بهذا الفيديو', W / 2, 1245, 80, lt, 2.1, AMBER, weight=800)
    caption(c, 'الذاكرة: ١٨ أكتوبر ٢٠٢٦', W / 2, 150 + 120, 24, ease_out(lin(lt, 0.4, 0.8)) * 0, SILVER)

def robot(c, lt, T):
    img = V('robot', 'pv_humanoid_robot', 2.0, lt, speed=0.9)
    z = 1.05 + 0.12 * ease_io(lt / 4.1)
    draw_cover(c, img, None, 0.42, 0.25, z, 1.0, cf=cf_grade(0.9, 1.08, -0.02, 0.0))
    vignette(c, 0.45)
    # memories stream in an arc into the robot's head
    hx, hy = W * 0.36, H * 0.19
    for i in range(14):
        ph = lin(lt, 1.66 + i * 0.12, 1.66 + i * 0.12 + 1.1)
        if ph <= 0 or ph >= 1: continue
        u = ease_in(ph)
        sx, sy = W * (0.9 if i % 2 else 0.75), H * 1.05
        mx, my = W * 0.95, H * 0.55
        x = (1 - u) ** 2 * sx + 2 * (1 - u) * u * mx + u * u * hx
        y = (1 - u) ** 2 * sy + 2 * (1 - u) * u * my + u * u * hy
        img2, cx, cy = pool_img(i + 5)
        s = lerp(1.0, 0.08, u)
        print_card(c, img2, x, y, 260 * s, 330 * s, (i * 37) % 30 - 15, 1 - ease_in(lin(ph, 0.85, 1.0)), cx=cx, cy=cy,
                   cf=cf_grade(0.7, 1.0, 0.0, 0.4))
    a = ease_out(lin(lt, 3.3, 3.7))
    if a > 0:
        radial(c, hx, hy, 220, VIOLET, 0.4 * a, skia.BlendMode.kScreen)
    kinetic(c, 'روبوت', W / 2, 1150, 150, lt, 3.62, PAPER, family='serif', weight=700)

def other_body(c, lt, T):
    # "another body": the anatomical head from 3D shot A, where a brain materialises inside the skull (frames 6-19, before the implant)
    anat_bg(c, lt, 0.07)
    f = int(round(lerp(6, 19, ease_io(lin(lt, 0.0, 1.3)))))
    draw_cover(c, M.seq_frame('A', f), None, 0.5, 0.5, 1.02 + 0.04 * lt, 1.0, flip=True)
    # ghost of the robot double-exposed — the same memories in another 'body'
    rob = M.clip('robot', 'pv_humanoid_robot', tc_in=2.0, speed=0.9).get(4.1 + lt)
    draw_cover(c, rob, None, 0.42, 0.22, 1.2, 0.30 * ease_io(lin(lt, 0.1, 0.8)), blend=skia.BlendMode.kScreen, cf=cf_mono((0.75, 0.68, 1.0)))
    vignette(c, 0.45)
    kinetic(c, 'جسم تاني', W / 2, 1150, 130, lt, 0.3, LILAC, family='serif', weight=700)

def clone(c, lt, T):
    fill(c, INK)
    img = brain_3d()
    steps = [(0.0, 1), (0.35, 2), (0.70, 3), (1.05, 4), (1.3, 6)]
    n = 1
    for t0, k in steps:
        if lt >= t0: n = k
    cols, rows = n, int(math.ceil(n * 16 / 9 * 0.57)) if n > 1 else 1
    rows = max(1, rows)
    cw, ch = W / cols, H / rows
    for j in range(rows):
        for i in range(cols):
            r = skia.Rect.MakeXYWH(i * cw + 3, j * ch + 3, cw - 6, ch - 6)
            tint = 0.0 if (i + j) % 3 else 0.35
            draw_cover(c, img, r, 0.45, 0.48, 1.2, 1.0, cf=cf_grade(1.0 - tint, 1.1, 0.04, -tint))
    a = ease_out5(lin(lt, 1.1, 1.35))
    if a > 0:
        fill(c, INK, 0.35 * a)
        draw_text(c, 'استنساخ', W / 2, H * 0.45, 200 * (1.15 - 0.15 * a), 'display', 900, PAPER, a, shadow=30)

def not_simple(c, lt, T):
    ink_backdrop(c, '#1A2045', 0.45)
    img = brain_3d()
    # 0 - 0.7: grid collapses back into one face ("لا، بمزح!")
    k = ease_io5(lin(lt, 0.0, 0.55))
    if lt < 1.55:
        cols = max(1, int(round(lerp(6, 1, k))))
        rows = max(1, int(round(cols * 16 / 9 * 0.57))) if cols > 1 else 1
        cw, ch = W / cols, H / rows
        for j in range(rows):
            for i in range(cols):
                draw_cover(c, img, skia.Rect.MakeXYWH(i * cw + 3, j * ch + 3, cw - 6, ch - 6), 0.45, 0.48, 1.2,
                           1 - ease_in(lin(lt, 1.2, 1.55)), cf=cf_grade(1.0, 1.1, 0.04))
        kinetic(c, 'بمزح!', W / 2, 1160, 150, lt, 0.12, AMBER, family='serif', weight=700, out=1.25)
    # 1.55+: memories (copyable) ≠ consciousness (not transferable)
    a1 = ease_out5(lin(lt, 1.55, 2.0)); a2 = ease_out5(lin(lt, 2.72, 3.2))
    if a1 > 0:
        rng = np.random.default_rng(3)
        for i in range(5):
            im2, cx, cy = pool_img(i)
            print_card(c, im2, W / 2 - 200 + i * 100, 420 + 10 * i, 280, 350, (i - 2) * 6, a1, cx=cx, cy=cy, cf=cf_grade(0.7, 1.0, 0.0, 0.5))
        caption(c, 'نسخ الذكريات', W / 2, 690, 46, a1, PAPER, family='display', weight=700)
        caption(c, 'معلومات — يمكن نظرياً تخزينها', W / 2, 742, 24, a1 * 0.85, SILVER)
    if a2 > 0:
        draw_text(c, '≠', W / 2, 830, 110, 'display', 300, AMBER, a2)
        c.save(); path = skia.Path(); path.addCircle(W / 2, 1030, 140); c.clipPath(path, doAntiAlias=True)
        draw_cover(c, img, skia.Rect.MakeXYWH(W / 2 - 140, 890, 280, 280), 0.45, 0.48, 1.6, a2, cf=cf_mono((0.85, 0.8, 1.0)))
        c.restore(); c.drawCircle(W / 2, 1030, 140, paint(VIOLET, a2, 3))
        caption(c, 'نقل الوعي', W / 2, 1218, 46, a2, LILAC, family='display', weight=700)
        caption(c, 'لا يوجد أي دليل علمي على إمكانيته', W / 2, 1270, 24, a2 * 0.9, SILVER)

def reality(c, lt, T):
    fill(c, BLACK)
    mri = V('mri', 'mri_7t_axial', 24.0, lt, speed=2.5, width=1080)
    draw_cover(c, mri, skia.Rect.MakeXYWH(-60, 470, 1200, 1200), 0.5, 0.5, 1.0, ease_out(lin(lt, 0, 0.3)))
    kinetic(c, 'الجد.', W / 2, 455, 140, lt, 0.08, PAPER, weight=900)
    caption(c, 'دماغ إنسان حقيقي — رنين مغناطيسي ٧ تسلا بدقة ١٠٠ ميكرون', W / 2, 1335, 23, ease_out(lin(lt, 0.4, 0.8)), SILVER)

def neuralink_stage(c, lt, T):
    img = M.photo('nl_master_plan', 2600)
    draw_cover(c, img, None, 0.40, keys(lt, [(0, 0.60), (2.1, 0.52)]), 1.02 + 0.05 * lt / 2.1, 1.0, cf=cf_grade(1.0, 1.05, 0.0, 0.0))
    vignette(c, 0.4)
    gradient_v(c, [(0, INK, 0.0), (0.72, INK, 0.0), (1.0, INK, 0.75)])
    kinetic(c, 'NEURALINK', W / 2, 1060, 88, lt, 0.2, PAPER, family='display', weight=300)
    caption(c, 'تأسست ٢٠١٦ · عرض «لماذا نيورالينك؟» ٢٠١٩', W / 2, 1125, 24, ease_out(lin(lt, 0.5, 0.9)), AMBER)

def neuralink_robot(c, lt, T):
    img = M.photo('nl_robot_2020', 2600)
    draw_cover(c, img, None, 0.42, 0.5, 1.05 + 0.08 * lt / 1.4, 1.0, cf=cf_grade(1.0, 1.08, 0.0, -0.1))
    vignette(c, 0.45)
    caption(c, 'روبوت الزرع الجراحي — عرض نيورالينك، أغسطس ٢٠٢٠', W / 2, 1290, 25, ease_out(lin(lt, 0.15, 0.5)), PAPER)

def noland(c, lt, T):
    ink_backdrop(c, '#1E2346', 0.40)
    radial(c, W / 2, 640, 600, AMBER, 0.12)
    # chessboard + cursor (he played chess with the cursor, March 2024 livestream)
    a = ease_out(lin(lt, 0.0, 0.4))
    bx, by, bs = 140, 1030, 26
    for j in range(8):
        for i in range(8):
            if (i + j) % 2: c.drawRect(skia.Rect.MakeXYWH(bx + i * bs, by + j * bs, bs, bs), paint(SILVER, 0.18 * a))
    c.drawRect(skia.Rect.MakeXYWH(bx, by, 8 * bs, 8 * bs), paint(SILVER, 0.5 * a, 1.5))
    k = ease_io5(lin(lt, 0.6, 1.8))
    px, py = lerp(bx + 2 * bs, bx + 5.5 * bs, k), lerp(by + 6 * bs, by + 2.5 * bs, k)
    path = skia.Path(); path.moveTo(px, py); path.lineTo(px + 9, py + 26); path.lineTo(px + 14, py + 15); path.lineTo(px + 26, py + 13); path.close()
    c.drawPath(path, paint(AMBER, a))
    img = M.photo('nl_noland_rop')
    x = ease_out5(lin(lt, 0.0, 0.5))
    print_card(c, img, W / 2 + 90, 600 + 40 * (1 - x), 560, 630, 2.0, x, cx=0.5, cy=0.45, zoom=1.0,
               cf=cf_grade(1.0, 1.03, 0.0, 0.0))
    caption(c, 'نولاند آربو', W - 90, 1060, 44, ease_out(lin(lt, 0.3, 0.7)), PAPER, anchor='r', family='display', weight=700)
    caption(c, 'أول مشارك تُزرع له شريحة نيورالينك', W - 90, 1115, 25, ease_out(lin(lt, 0.4, 0.8)), SILVER, anchor='r', family='display', weight=400)
    caption(c, 'يناير ٢٠٢٤ · لعب الشطرنج بالمؤشر', W - 90, 1160, 24, ease_out(lin(lt, 0.5, 0.9)), AMBER, anchor='r')

def ecog_panel(c, lt, key, name, tc, cx, cy, zoom, title):
    vid = V(name, key, tc, lt, width=1280)
    draw_cover(c, vid, None, cx, cy, 2.8, 1.0, blur=28, cf=cf_grade(0.6, 0.9, -0.25))
    fill(c, INK, 0.35)
    x = ease_out5(lin(lt, 0.0, 0.4))
    print_card(c, vid, W / 2, 815, 1000, 760, 0, 1.0, border=0.018, cx=cx, cy=cy, zoom=zoom,
               cf=cf_grade(1.0, 1.08, 0.02, 0.0), shadow=1.0)
    caption(c, title, W / 2, 370, 28, x, PAPER, family='display', weight=600)

def ecog_arm(c, lt, T):
    ecog_panel(c, lt, 'bci_ecog_s009', 'ecog9', 6.0, 0.6, 0.5, 1.15, 'جامعة بيتسبرغ · ٢٠١١ — ليست نيورالينك')
    caption(c, 'مشارك مصاب بالشلل يحرّك ذراعاً روبوتية بإشارات دماغه', W / 2, 1262, 26, ease_out(lin(lt, 0.3, 0.7)), SILVER, family='display', weight=500)

def ecog_highfive(c, lt, T):
    ecog_panel(c, lt, 'bci_ecog_s010', 'ecog10', 4.2, 0.42, 0.45, 1.0, 'جامعة بيتسبرغ · ٢٠١١ — ليست نيورالينك')
    caption(c, 'أول «هاي فايف» بذراع يحرّكها الدماغ مباشرة', W / 2, 1262, 26, ease_out(lin(lt, 0.2, 0.6)), SILVER, family='display', weight=500)
    s = ease_back(lin(lt, 2.52, 2.85))
    if s > 0:
        c.save(); c.translate(W - 210, 1010); c.rotate(-12); c.scale(1.4 - 0.4 * s, 1.4 - 0.4 * s)
        c.drawCircle(0, 0, 118, paint(AMBER, s, 5)); c.drawCircle(0, 0, 100, paint(AMBER, 0.6 * s, 2))
        draw_text(c, 'حقيقي', 0, -8, 62, 'display', 800, AMBER, s)
        caption(c, 'وصار فعلاً', 0, 46, 22, s, AMBER, family='display', weight=600)
        c.restore()

def future_memories(c, lt, T):
    img = V('elderly_photo', 'pv_elderly_photo', 0.5, lt)
    draw_cover(c, img, None, 0.45, 0.55, 1.08 + 0.06 * lt / 3.2, 1.0, cf=cf_grade(0.95, 1.04, 0.0, 0.25))
    vignette(c, 0.5)
    radial(c, W * 0.5, H * 0.3, 900, VIOLET, 0.18 * ease_io(lin(lt, 0, 1.5)), skia.BlendMode.kScreen)
    # the amber 'thread' links memories like a constellation
    rng = np.random.default_rng(31); pts = [(rng.uniform(150, 930), rng.uniform(350, 1250)) for _ in range(9)]
    k = ease_io(lin(lt, 0.3, 2.6)); m = int(k * (len(pts) - 1))
    for i in range(m):
        c.drawLine(*pts[i], *pts[i + 1], paint(AMBER, 0.55, 1.5))
    for i in range(m + 1):
        c.drawCircle(*pts[i], 6, paint(AMBER, 0.9)); c.drawCircle(*pts[i], 16, paint(AMBER, 0.25, blur=8))
    radial(c, W / 2, 400, 520, INK, 0.55 * ease_io(lin(lt, 1.8, 2.3)))
    kinetic(c, 'المستقبل', W / 2, 400, 150, lt, 1.98, PAPER, family='display', weight=300)

def cloud_storage(c, lt, T):
    img = V('clouds_g', 'pv_clouds_golden', 8.0, lt)
    draw_cover(c, img, None, 0.5, 0.5, 1.05, 1.0, cf=cf_grade(1.0, 1.02, 0.0, 0.1))
    fill(c, INK, 0.12)
    a = ease_out5(lin(lt, 0.05, 0.45))
    y0 = 560 + 40 * (1 - a)
    card = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(110, y0, 860, 560), 44, 44)
    c.drawRRect(card.makeOffset(0, 24) if hasattr(card, 'makeOffset') else card, paint(BLACK, 0.35 * a, blur=40))
    c.drawRRect(card, paint(INK, 0.72 * a)); c.drawRRect(card, paint(PAPER, 0.25 * a, 1.5))
    # cloud glyph
    for (dx, dy, r) in ((0, 0, 26), (26, -12, 30), (54, 2, 22)):
        c.drawCircle(860 + dx - 40, y0 + 80 + dy, r, paint(PAPER, 0.9 * a))
    caption(c, 'ذكرياتك على الكلاود', 760, y0 + 80, 40, a, PAPER, anchor='r', family='display', weight=700)
    p = lerp(0.82, 0.99, ease_io(lin(lt, 0.2, 2.2)))
    col = mix_hex(AMBER, EMBER, lin(p, 0.9, 0.99))
    c.drawRoundRect(skia.Rect.MakeXYWH(170, y0 + 170, 740, 22), 11, 11, paint(SILVER, 0.2 * a))
    c.drawRoundRect(skia.Rect.MakeXYWH(170, y0 + 170, 740 * p, 22), 11, 11, paint(col, a))
    caption(c, f'{int(p * 100)}٪ مستخدمة — المساحة شبه ممتلئة', 910, y0 + 235, 26, a, col, anchor='r', family='display', weight=500)
    for i in range(5):
        im2, cx, cy = pool_img(i)
        print_card(c, im2, 220 + i * 160, y0 + 350, 128, 128, 0, a, border=0, cx=cx, cy=cy, shadow=0.3)
    pul = 1 + 0.04 * math.sin(lt * 9) * ease_out(lin(lt, 1.4, 1.6))
    b = ease_out5(lin(lt, 1.3, 1.6))
    c.save(); c.translate(W / 2, y0 + 480); c.scale(pul, pul)
    c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(-230, -38, 460, 76), 38, 38), paint(AMBER, b))
    draw_text(c, 'جدّد الاشتراك', 0, 0, 32, 'display', 700, INK, b)
    c.restore()

def outro(c, lt, T):
    fill(c, INK)
    eye = V('eye_end', 'pv_eye_closeup', 6.0, lt * 0.7)
    k = ease_io5(lin(lt, 1.3, 2.2))
    w, h = lerp(W, 560, k), lerp(H, 560, k)
    if k < 1:
        draw_cover(c, eye, skia.Rect.MakeXYWH(W / 2 - w / 2, 760 - h / 2 + (H / 2 - 760) * (1 - k), w, h), 0.53, 0.5, 1.15, 1.0,
                   cf=cf_grade(0.92, 1.06, -0.02, 0.4))
    else:
        c.save(); path = skia.Path(); path.addCircle(W / 2, 760, 280); c.clipPath(path, doAntiAlias=True)
        draw_cover(c, eye, skia.Rect.MakeXYWH(W / 2 - 280, 480, 560, 560), 0.53, 0.5, 1.15, 1.0, cf=cf_grade(0.92, 1.06, -0.02, 0.4))
        c.restore()
    if k > 0:
        # the image becomes a circle — the implant's outline / the iris — traced by the amber thread
        rr = lerp(900, 280, k)
        c.save(); path = skia.Path(); path.addRect(skia.Rect.MakeWH(W, H)); path.addCircle(W / 2, 760, rr)
        path.setFillType(skia.PathFillType.kEvenOdd); c.clipPath(path, doAntiAlias=True); fill(c, INK, k); c.restore()
        sweep = 360 * ease_io5(lin(lt, 1.9, 3.2))
        c.drawArc(skia.Rect.MakeXYWH(W / 2 - 300, 460, 600, 600), -90, sweep, False, paint(AMBER, 1.0, 3.5))
        c.drawArc(skia.Rect.MakeXYWH(W / 2 - 300, 460, 600, 600), -90, sweep, False, paint(AMBER, 0.4, 10, blur=10))
    kinetic(c, 'تابعني', W / 2, 1175, 140, lt, 1.42, PAPER, weight=800)
    end = ease_in(lin(lt, 4.45, 4.62))
    if end > 0: fill(c, INK, end * 0.0)

DRAW = {name: globals()[name] for name, _, _ in SCENES}

BADGE = {'portrait': 'mri', 'think_face': 'archive', 'anat_A': 'sim', 'anat_B': 'sim', 'micro': 'micro', 'neurons_C': 'sim', 'decode': 'sim', 'anat_D': 'research',
         'galvani': 'archive', 'imagine_see': 'future', 'imagine_hear': 'future', 'to_data': 'future', 'to_cloud': 'future',
         'seven_years': 'future', 'wait': 'future', 'who_told': 'future', 'search': 'future', 'callback': 'future',
         'robot': 'future', 'other_body': 'future', 'clone': 'future', 'not_simple': 'future', 'reality': 'mri',
         'neuralink_stage': 'real_photo', 'neuralink_robot': 'real_photo', 'noland': 'real_photo', 'ecog_arm': 'real_demo',
         'ecog_highfive': 'real_demo', 'future_memories': 'future', 'cloud_storage': 'future'}

CREDIT = {
    'hook_eye': 'Video: Kindel Media / Pexels',
    'hook_prints': 'Pexels: dilara irem, SHVETS, fish socks, Cagatay Kozan · Cajal (PD)',
    'portrait': 'DTI: Thomas Schultz, Wikimedia Commons, CC BY-SA 3.0',
    'anat_A': '3D: BodyParts3D © DBCLS, CC BY 4.0 · Vesalius 1543, Wellcome Collection, CC BY 4.0',
    'anat_B': '3D: BodyParts3D © DBCLS, CC BY 4.0 · implant & threads: illustrative',
    'micro': 'Neuron: MethoxyRoxy & L. R. Krol, Wikimedia Commons, CC BY-SA 4.0',
    'think_face': 'Photo: Hans Berger, Univ. Jena (PD) · EEG: Hans Berger 1924 (PD)',
    'neurons_C': '3D: original illustrative simulation',
    'decode': 'Photo: Laurens R. Krol, Wikimedia Commons, CC BY 4.0',
    'anat_D': '3D: BodyParts3D © DBCLS, CC BY 4.0',
    'galvani': 'L. Galvani 1791 · Wellcome Collection, CC BY 4.0',
    'imagine_see': 'Video: Fotoarte en merida, Cagatay Kozan / Pexels',
    'imagine_hear': 'Video: Angela Roma / Pexels',
    'to_data': '3D: BodyParts3D © DBCLS, CC BY 4.0 · implant: illustrative', 'to_cloud': 'Video: Larkkid Dung / Pexels',
    'seven_years': 'Video: Altaf Shah / Pexels · Photo: Steve Jurvetson, CC BY 2.0', 'wait': 'Photo: Steve Jurvetson, CC BY 2.0',
    'who_told': 'Image: Zaghloul lab, NINDS / NIH (PD) · Pexels · Wikimedia Commons', 'search': 'Pexels · Wikimedia Commons (PD / CC)',
    'callback': '', 'robot': 'Video: Magda Ehlers / Pexels', 'other_body': 'Video: Magda Ehlers / Pexels · 3D: BodyParts3D © DBCLS, CC BY 4.0',
    'clone': '3D: BodyParts3D © DBCLS, CC BY 4.0', 'not_simple': '3D: BodyParts3D © DBCLS, CC BY 4.0 · Pexels · Wikimedia Commons',
    'reality': 'MRI: Edlow et al., MGH — Wikimedia Commons, CC0',
    'neuralink_stage': 'Photo: Steve Jurvetson, CC BY 2.0', 'neuralink_robot': 'Photo: Leijurv, Wikimedia Commons, CC BY-SA 4.0',
    'noland': 'Photo: Rational Optimist Society, Wikimedia Commons, CC BY 3.0',
    'ecog_arm': 'Video: Wang, Collinger et al., PLoS ONE 2013, CC BY 2.5',
    'ecog_highfive': 'Video: Wang, Collinger et al., PLoS ONE 2013, CC BY 2.5',
    'future_memories': 'Video: SHVETS production / Pexels', 'cloud_storage': 'Video: I Am Sorin / Pexels', 'outro': 'Video: Kindel Media / Pexels',
}

# transition INTO each scene over the overlap with the previous one
TRANS = {'hook_prints': 'cut', 'portrait': 'fade', 'anat_A': 'blurfade', 'anat_B': 'zoomthrough', 'micro': 'fade',
         'think_face': 'fade', 'neurons_C': 'zoomthrough', 'decode': 'fade', 'anat_D': 'fade', 'galvani': 'flash',
         'imagine_see': 'fade', 'imagine_hear': 'cut', 'to_data': 'fade', 'to_cloud': 'rise', 'seven_years': 'fade',
         'wait': 'flash', 'who_told': 'fade', 'search': 'zoomthrough', 'callback': 'cut', 'robot': 'fade',
         'other_body': 'fade', 'clone': 'cut', 'not_simple': 'cut', 'reality': 'cut', 'neuralink_stage': 'fade',
         'neuralink_robot': 'cut', 'noland': 'fade', 'ecog_arm': 'fade', 'ecog_highfive': 'cut', 'future_memories': 'fade',
         'cloud_storage': 'fade', 'outro': 'blurfade'}
