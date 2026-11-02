"""Original explanatory graphics scenes. Every function draws onto a skia canvas for absolute timeline time t.
Internal mechanisms are conceptual illustrations (labelled 'محاكاة توضيحية'), not manufacturer schematics."""
import math, numpy as np, skia
from gfx import *

SIM_LABEL = 'محاكاة توضيحية'

def sim_badge(c, a=1.0, text=SIM_LABEL):
    if a <= 0: return
    w = text_width(text, 30, 'med') + 26
    x1 = W - 60; y = 268
    rr = skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(x1 - w, y - 26, x1, y + 26), 26, 26)
    c.drawRRect(rr, paint('#000000', 0.45 * a)); c.drawRRect(rr, paint(CYAN, 0.7 * a, 1.5))
    draw_text(c, text, x1 - w / 2, y, 30, 'med', CYAN, a)

def kicker(c, txt, a, y=330, color=GREY, size=34):
    draw_text(c, txt, W / 2, y, size, 'med', color, a)

def label_callout(c, txt, x, y, tx, ty, a, color=WHITE, size=46, weight='semi', dot=True, line_color=None):
    """Leader line from anchor (x,y) to label position (tx,ty). Label right-aligned for RTL if tx<x."""
    if a <= 0: return
    lc = line_color or color
    k = ease_out(a)
    mx, my = lerp(x, tx, k), lerp(y, ty, k)
    c.drawLine(x, y, mx, my, paint(lc, 0.85 * a, 2.2))
    if dot:
        c.drawCircle(x, y, 7, paint(lc, a)); c.drawCircle(x, y, 16, paint(lc, 0.35 * a, 1.5))
    if k > 0.6:
        ta = (k - 0.6) / 0.4
        w = text_width(txt, size, weight)
        anchor = 'r' if tx < x else 'l'
        bx0 = tx - w - 10 if anchor == 'r' else tx - 10
        rr = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(bx0, ty - size * 0.95, w + 20, size * 1.9), 14, 14)
        c.drawRRect(rr, paint('#05070A', 0.55 * ta * a))
        draw_text(c, txt, tx, ty, size, weight, color, ta * a, anchor=anchor)

# ------------------------------------------------------------------ SUCTION (7.32-13.41)
def _flow_point(fx, fy, sx, sy, u):
    """Air path: from skirt edge (sx,sy) along the floor to under fan, then up through the fan and out the rear."""
    if u < 0.62:
        k = ease_io(u / 0.62); return (lerp(sx, fx, k), lerp(sy, fy, k), 0.06 + 0.05 * k)
    k = (u - 0.62) / 0.38
    z = 0.11 + 0.75 * ease_out(k)
    x = fx + (-1.9 - fx) * ease_in(k) * 0.9
    return (x, fy * (1 - 0.3 * k), z)

def _skirt_rect():
    return [(1.85, 0.86), (1.85, -0.86), (-1.85, -0.86), (-1.85, 0.86)]

def scene_suction(c, t):
    T0 = 7.32
    background(c, t)
    # camera: high 3/4 → low under-floor reveal
    k = ease_io(lin(t, T0, T0 + 1.6))
    eye = np.array([lerp(6.8, 3.9, k), lerp(5.4, 3.0, k), lerp(3.2, -2.9, k)])
    eye += np.array([0.25 * math.sin(t * 0.4), 0.2 * math.cos(t * 0.33), 0])
    cam = Camera(eye, (0.05, 0, lerp(0.5, 0.25, k)), lerp(36, 46, k), cy=H * 0.47)
    floor_a = 1.0
    surface_grid(c, cam, z=0.0, extent=6.5, alpha=floor_a)
    # low pressure region (blooms at 10.5)
    lp = ease_out(lin(t, 10.35, 11.0))
    if lp > 0:
        rect = [(x, y, 0.08) for x, y in _skirt_rect()]
        s2, _ = cam.project(np.array(rect))
        pts = [skia.Point(*p) for p in s2]
        path = skia.Path(); path.addPoly(pts, True)
        ctr = s2.mean(0)
        sh = skia.GradientShader.MakeRadial(skia.Point(*ctr), 420, [hexc(BLUE, 0.55 * lp), hexc(CYAN, 0.10 * lp)], [0, 1])
        p = skia.Paint(AntiAlias=True); p.setShader(sh); c.drawPath(path, p)
        c.drawPath(path, paint(CYAN, 0.8 * lp, 2.5))
        pulse = 0.5 + 0.5 * math.sin((t - 10.35) * 6)
        c.drawPath(path, paint(CYAN, 0.25 * lp * pulse, 10, blur=8))
    draw_wheels(c, cam, spin=0.0)
    power = ease_io(lin(t, 8.3, 9.2))
    for i, (x, y) in enumerate(FANS):
        ang = (t - 8.3) * (2 + 26 * power) * (1 if i % 2 else -1) if t > 8.3 else 0.4 * i
        draw_fan(c, cam, x, y, 0.17, FAN_R, ang, power)
    # air streamlines (start 9.4)
    fa = ease_out(lin(t, 9.35, 9.9))
    if fa > 0:
        rng = np.random.default_rng(7)
        for n in range(64):
            fi = n % 4; fx, fy = FANS[fi]
            side = rng.integers(0, 4); r = rng.uniform(-1, 1)
            if side == 0: sx, sy = 1.85, r * 0.86
            elif side == 1: sx, sy = -1.85, r * 0.86
            elif side == 2: sx, sy = r * 1.85, 0.86
            else: sx, sy = r * 1.85, -0.86
            # bias start toward the fan's own quadrant
            sx = lerp(sx, fx * 2.2, 0.35); sy = lerp(sy, fy * 1.8, 0.35)
            period = rng.uniform(1.1, 1.6); ph = rng.uniform(0, 1)
            u = ((t - 9.35) / period + ph) % 1.0
            trail = [_flow_point(fx, fy, sx, sy, max(0, u - k2 * 0.035)) for k2 in range(8)]
            s2, _ = cam.project(np.array(trail))
            for k2 in range(len(s2) - 1):
                a = fa * (1 - k2 / 8) * 0.85 * min(1, u * 6) * min(1, (1 - u) * 5)
                c.drawLine(*s2[k2], *s2[k2 + 1], paint(CYAN, a, 3.0))
    draw_car(c, cam, xray=1.0)
    # high-pressure arrows from above, pushing the car toward the surface (11.34+)
    hp = ease_out(lin(t, 11.5, 12.0))
    if hp > 0:
        for ax in (-1.3, -0.2, 0.9):
            for ay in (-0.5, 0.5):
                top = np.array([[ax, ay, 2.6 - 0.25 * hp + 0.06 * math.sin(t * 5 + ax)], [ax, ay, 1.45]])
                s2, _ = cam.project(top)
                arrow(c, *s2[0], *s2[1], RED, hp * 0.95, 6, 24, glow=6)
    # labels
    sim_badge(c, ease_out(lin(t, T0 + 0.2, T0 + 0.7)))
    a1 = lin(t, 7.85, 8.35) * (1 - lin(t, 10.2, 10.5))
    if a1 > 0:
        s2, _ = cam.project(np.array([[FANS[0][0], FANS[0][1], 0.17]]))
        label_callout(c, '٤ مراوح شفط', s2[0][0], s2[0][1], 640, 1180, a1, WHITE, 64, 'bold', line_color=CYAN)
    a2 = lin(t, 10.45, 10.95) * (1 - lin(t, 12.2, 12.4))
    if a2 > 0:
        s2, _ = cam.project(np.array([[0.0, 0.0, 0.08]]))
        label_callout(c, 'ضغط أقل', s2[0][0], s2[0][1], 330, 1230, a2, CYAN, 66, 'bold', line_color=CYAN)
    a3 = lin(t, 11.7, 12.15) * (1 - lin(t, 12.2, 12.4))
    if a3 > 0:
        draw_text(c, 'ضغط أعلى', W / 2, 360, 70, 'bold', RED, a3)
        draw_text(c, 'من برّا', W / 2, 445, 40, 'med', GREY, a3)
    # whip into inverted side view at 12.36
    if t >= 12.3:
        wa = ease_io(lin(t, 12.3, 12.48))
        c.drawRect(skia.Rect.MakeWH(W, H), paint(BG, wa))

def scene_suction_inverted(c, t):
    """12.36-13.41: car held UNDER a surface — pressure difference pushes it toward the surface."""
    background(c, t)
    k = ease_out(lin(t, 12.36, 13.4))
    cam = Camera((lerp(5.2, 4.4, k), lerp(12.6, 12.0, k), lerp(-2.6, -2.2, k)), (0.0, 0, 1.0), 40, cy=H * 0.47)
    M = rot_x(math.pi)  # flip 180° about the long axis: car hangs under the ceiling
    piv = (0, 0, 0.9)    # ceiling at z = 1.8
    surface_grid(c, cam, z=0.0, extent=6.0, M=M, pivot=piv, alpha=1.2)
    # ceiling slab edge
    s2, _ = cam.project(np.array([[-6, 0, 1.8], [6, 0, 1.8]]))
    c.drawLine(*s2[0], *s2[1], paint(STEEL, 0.7, 3))
    draw_text(c, 'السطح', 900, s2[0][1] - 40, 40, 'med', GREY, ease_out(lin(t, 12.4, 12.7)))
    # low pressure gap
    rect = transform(np.array([(x, y, 0.08) for x, y in _skirt_rect()]), M, piv)
    s3, _ = cam.project(rect)
    path = skia.Path(); path.addPoly([skia.Point(*p) for p in s3], True)
    c.drawPath(path, paint(CYAN, 0.35, 0)); c.drawPath(path, paint(CYAN, 0.9, 2.5))
    draw_wheels(c, cam, M=M, pivot=piv)
    for i, (x, y) in enumerate(FANS):
        draw_fan(c, cam, x, y, 0.17, FAN_R, t * 28 * (1 if i % 2 else -1), 1.0, M=M, pivot=piv)
    draw_car(c, cam, M=M, pivot=piv, xray=1.0)
    # pressure arrows from below → up
    hp = ease_out(lin(t, 12.4, 12.8))
    for ax in (-1.6, -0.55, 0.55, 1.6):
        p0 = np.array([[ax, 0.9, -1.0 - 0.12 * math.sin(t * 6 + ax)], [ax, 0.9, 0.25]])
        q, _ = cam.project(p0); arrow(c, *q[0], *q[1], RED, hp * 0.85, 6, 24, glow=6)
    draw_text(c, 'ضغط أعلى', W / 2, 1290, 52, 'semi', RED, hp)
    # net hold force (toward the surface) vs weight
    na = ease_out(lin(t, 12.6, 13.0))
    q, _ = cam.project(np.array([[0.2, 0, 0.55], [0.2, 0, 1.72]]))
    arrow(c, *q[0], *q[1], WHITE, na, 14, 46, glow=14)
    draw_text(c, 'قوة التماسك', W / 2, 470, 80, 'bold', WHITE, na)
    draw_text(c, 'أكبر من وزن السيارة', W / 2, 560, 44, 'med', CYAN, na)
    wa = ease_out(lin(t, 12.85, 13.2))
    q, _ = cam.project(np.array([[-1.3, 0, 1.25], [-1.3, 0, 0.75]]))
    arrow(c, *q[0], *q[1], GREY, wa * 0.9, 6, 22)
    draw_text(c, 'الوزن', q[1][0], q[1][1] + 45, 38, 'med', GREY, wa)
    sim_badge(c, 1.0)

# ------------------------------------------------------------------ VACUUM → CAR MATCH (15.47-16.7)
def scene_match_underside(c, t, t0=15.47, t1=16.75):
    """Top-down: vacuum-nozzle outline morphs into the car's sealed underside with 4 fans."""
    background(c, t)
    k = ease_io(lin(t, t0, t0 + 0.75))
    cx, cy = W / 2, H * 0.47
    # nozzle rect (wide, short) → car underside (long, narrow) seen from below, long axis vertical
    w = lerp(760, 470, k); h = lerp(170, 1000, k); r = lerp(70, 120, k)
    rr = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(cx - w / 2, cy - h / 2, w, h), r, r)
    c.drawRRect(rr, paint(BLUE, 0.10 + 0.18 * k))
    c.drawRRect(rr, paint(CYAN, 0.95, 4))
    c.drawRRect(rr, paint(CYAN, 0.35, 14, blur=10))
    # inward suction arrows around perimeter
    n = 10
    for i in range(n):
        u = (i + 0.5) / n
        for side in (-1, 1):
            if k < 0.5:
                x = cx - w / 2 + u * w; y = cy + side * (h / 2 + 90)
                arrow(c, x, y, x, y - side * 60, CYAN, 0.8 * (1 - k * 2), 4, 16)
            else:
                y = cy - h / 2 + u * h; x = cx + side * (w / 2 + 90)
                arrow(c, x, y, x - side * 60, y, CYAN, 0.8 * (k - 0.5) * 2, 4, 16)
    fa = ease_out(lin(t, t0 + 0.5, t0 + 0.9))
    for (fx, fy) in FANS:
        px = cx + fy * 300; py = cy - fx * 330
        c.drawCircle(px, py, 95 * fa, paint('#0B1016', 0.9 * fa)); c.drawCircle(px, py, 95 * fa, paint(CYAN, fa, 3))
        for b in range(7):
            ang = t * 20 + b * 2 * math.pi / 7
            c.drawLine(px + 20 * math.cos(ang), py + 20 * math.sin(ang), px + 88 * math.cos(ang + 0.5) * fa, py + 88 * math.sin(ang + 0.5) * fa, paint(WHITE, 0.6 * fa, 3))
    draw_text(c, 'نفس المبدأ', W / 2, 330, 84, 'bold', WHITE, ease_out(lin(t, t0, t0 + 0.3)))
    draw_text(c, 'فوهة المكنسة', W / 2, 430, 40, 'med', GREY, 1 - k)
    draw_text(c, 'أرضية السيارة المحكمة', W / 2, 430, 40, 'med', CYAN, k)
    vignette(c)

# ------------------------------------------------------------------ THRUSTERS (19.95-24.30)
TANKS = [(-1.05, 0.55, 0.20), (-1.40, 0.55, 0.20), (0.95, 0.50, 0.17)]  # (x, z, r) cylinders across the width — conceptual
REAR_N = [(-2.12, y, 0.48) for y in (-0.55, -0.2, 0.2, 0.55)]
CORNER_N = [(1.55, 0.78, 0.18), (1.55, -0.78, 0.18), (-1.55, 0.80, 0.18), (-1.55, -0.80, 0.18)]
FRONT_N = [(1.95, 0.62, 0.45), (1.95, -0.62, 0.45)]

def draw_tank(c, cam, x, z, r, a, glow, M, piv, off):
    for yy in (-0.62, 0.62):
        ring = circle_pts((x, yy, z), r, 'x', 30, M, piv, off); s2, _ = cam.project(ring)
        poly(c, s2, paint(WHITE, 0.6 * a, 2.0))
    for ang in np.linspace(0, 2 * np.pi, 6, endpoint=False):
        p = transform(np.array([[x, -0.62, z + r * math.sin(ang)], [x, 0.62, z + r * math.sin(ang)]]) + np.array([r * math.cos(ang), 0, 0]), M, piv, off)
        s2, _ = cam.project(p); c.drawLine(*s2[0], *s2[1], paint(WHITE, 0.35 * a, 1.5))
    p = transform(np.array([[x, -0.62, z], [x, 0.62, z]]), M, piv, off); s2, _ = cam.project(p)
    c.drawLine(*s2[0], *s2[1], paint(WHITE, 0.25 * glow * a, r * 160, blur=20))

def plume(c, cam, P, d, strength, t, M, piv, off, seed=0, length=1.6):
    if strength <= 0.01: return
    rng = np.random.default_rng(seed)
    for k in range(22):
        s = ((k / 22) + (t * 2.2 + rng.uniform(0, 1)) % 1.0 / 22) * length * strength
        jit = rng.normal(0, 0.03, 3) * (1 + 4 * s)
        q = transform(np.array([np.array(P) + np.array(d) * s + jit]), M, piv, off)
        s2, dep = cam.project(q)
        rad = (14 + 120 * s / length) * (cam.fpx / 1600) * (6.5 / max(dep[0], 1))
        a = strength * 0.24 * (1 - s / (length + 1e-6))
        c.drawCircle(*s2[0], rad, paint('#DDF6FF', a, blur=max(2, rad * 0.5)))
    q = transform(np.array([P]), M, piv, off); s2, _ = cam.project(q)
    c.drawCircle(*s2[0], 9, paint(WHITE, strength))

def scene_thrusters(c, t):
    background(c, t)
    T0 = 19.95
    k = ease_io(lin(t, T0, T0 + 4.3))
    eye = (lerp(-2.6, -0.8, k), lerp(13.0, 12.4, k), lerp(3.6, 2.8, k))
    # forward push (22.45+) and roll (23.79+)
    push = ease_io(lin(t, 22.6, 23.6)) * 0.55
    pitch = ease_io(lin(t, 23.85, 24.35)) * math.radians(-16)
    M = rot_y(pitch); off = (push, 0, 0.6); piv = (0, 0, 0.55)
    cam = Camera(eye, (-0.4 + push * 0.6, 0, 0.8), 42, cy=H * 0.52)
    surface_grid(c, cam, z=-0.6, extent=8, alpha=0.6)
    draw_wheels(c, cam, M=M, pivot=piv, offset=off, alpha=0.8)
    draw_car(c, cam, M=M, pivot=piv, offset=off, xray=1.0, alpha=0.9)
    ta = ease_out(lin(t, T0 + 0.15, T0 + 0.8))
    glow = ease_out(lin(t, 21.1, 21.5))
    for (x, z, r) in TANKS: draw_tank(c, cam, x, z, r, ta, glow, M, piv, off)
    # supply lines with flowing dashes
    la = ease_out(lin(t, 20.6, 21.1))
    if la > 0:
        dash = skia.DashPathEffect.Make([18, 14], -(t * 90) % 32)
        for n in REAR_N + CORNER_N + FRONT_N:
            src = (-1.05 if n[0] < 0 else 0.95, n[1] * 0.6, 0.55)
            mid = (n[0] * 0.8, n[1], 0.55)
            pts = transform(np.array([src, mid, n]), M, piv, off); s2, _ = cam.project(pts)
            p = paint(CYAN, 0.75 * la, 2.6); p.setPathEffect(dash)
            path = skia.Path(); path.moveTo(*s2[0]); path.quadTo(*s2[1], *s2[2]); c.drawPath(path, p)
    # nozzle markers
    for n in REAR_N + CORNER_N + FRONT_N:
        q = transform(np.array([n]), M, piv, off); s2, _ = cam.project(q)
        c.drawCircle(*s2[0], 8, paint(CYAN, ta)); c.drawCircle(*s2[0], 15, paint(CYAN, 0.4 * ta, 1.5))
    # firing
    rear_s = ease_out(lin(t, 21.3, 21.6)) * (1 - 0.7 * ease_in(lin(t, 23.5, 23.9)))
    for i, n in enumerate(REAR_N):
        plume(c, cam, n, (-1, 0, 0), rear_s, t, M, piv, off, seed=i)
    corner_s = ease_out(lin(t, 23.79, 23.95)) * (1 - ease_in(lin(t, 24.15, 24.3)))
    for i, n in enumerate(CORNER_N[0:2]):  # front corners fire down → nose pitches up
        plume(c, cam, n, (0, 0, -1), corner_s, t, M, piv, off, seed=10 + i, length=1.1)
    # labels & physics arrows
    sim_badge(c, ease_out(lin(t, T0, T0 + 0.4)))
    a_gas = env(t, 21.1, 22.45, 0.3, 0.2)
    q = transform(np.array([[TANKS[0][0], 0.62, TANKS[0][1]]]), M, piv, off); s2, _ = cam.project(q)
    label_callout(c, 'غاز مضغوط', s2[0][0], s2[0][1], 560, 560, a_gas, WHITE, 64, 'bold', line_color=CYAN)
    a_jet = env(t, 22.45, 23.75, 0.3, 0.25)
    if a_jet > 0:
        q, _ = cam.project(transform(np.array([[-2.5, 0, -0.2], [-3.4, 0, -0.2], [0.6, 0, 1.75], [1.9, 0, 1.75]]), M, piv, off))
        arrow(c, *q[0], *q[1], CYAN, a_jet, 8, 30, glow=8)
        arrow(c, *q[2], *q[3], RED, a_jet, 12, 40, glow=10)
        draw_text(c, 'الغاز للخلف', clamp((q[0][0] + q[1][0]) / 2, 200, W - 200), q[1][1] + 70, 46, 'semi', CYAN, a_jet)
        draw_text(c, 'السيارة للأمام', clamp((q[2][0] + q[3][0]) / 2, 240, W - 240), q[3][1] - 75, 52, 'bold', WHITE, a_jet)
        draw_text(c, 'فعل وردّ فعل', W / 2, 470, 70, 'bold', WHITE, a_jet)
    a_rot = env(t, 23.79, 24.3, 0.15, 0.0)
    if a_rot > 0:
        ctr = cam.project(transform(np.array([[0, 0, 0.55]]), M, piv, off))[0][0]
        rect = skia.Rect.MakeXYWH(ctr[0] - 420, ctr[1] - 420, 840, 840)
        path = skia.Path(); path.addArc(rect, 168, 70 * a_rot)
        c.drawPath(path, paint(RED, a_rot, 9)); c.drawPath(path, paint(RED, 0.4 * a_rot, 22, blur=12))
        draw_text(c, 'تغيير الاتجاه', W / 2, 470, 70, 'bold', WHITE, a_rot)
    vignette(c, 0.45)

# ------------------------------------------------------------------ "شو الفايدة؟" typography (30.00-31.48)
def scene_why(c, t):
    background(c, t)
    a = ease_out(lin(t, 30.0, 30.35))
    s = lerp(1.08, 1.0, ease_out(lin(t, 30.0, 30.6)))
    draw_text(c, 'طيب', W / 2, 640, 60, 'light', GREY, a)
    draw_text(c, 'شو الفايدة', W / 2, 800, 150, 'bold', WHITE, a, scale=s)
    b = ease_out(lin(t, 30.75, 31.05))
    draw_text(c, 'غير الاستعراض؟', W / 2, 980, 104, 'bold', RED, b, scale=lerp(0.9, 1, b))
    # thin rule animation
    ln = ease_io(lin(t, 30.1, 30.9))
    c.drawLine(W / 2 - 260 * ln, 1100, W / 2 + 260 * ln, 1100, paint(STEEL, 0.6, 2))
    vignette(c)

# ------------------------------------------------------------------ GRIP top-down (33.20-35.40)
def scene_grip(c, t):
    background(c, t)
    t0 = 33.2
    # track: large arc centred off-screen left
    cx, cy, R = -150, 1000, 900
    for rr, a in ((R - 170, 0.5), (R + 170, 0.5)):
        c.drawCircle(cx, cy, rr, paint(STEEL, a, 3))
    path = skia.Path(); path.addCircle(cx, cy, R)
    p = paint(STEEL, 0.25, 2); p.setPathEffect(skia.DashPathEffect.Make([30, 30], 0)); c.drawPath(path, p)
    u = lerp(-0.55, 0.45, ease_io(lin(t, t0, 35.4)))
    ang = u
    px, py = cx + R * math.cos(ang), cy + R * math.sin(ang)
    heading = ang + math.pi / 2
    c.save(); c.translate(px, py); c.rotate(math.degrees(heading) + 90)
    # car top-down silhouette (illustrative)
    body = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(-95, -210, 190, 420), 80, 80)
    c.drawRRect(body, paint('#141B24', 0.95)); c.drawRRect(body, paint(STEEL, 0.9, 3))
    cab = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(-70, -60, 140, 150), 50, 50)
    c.drawRRect(cab, paint('#0A0E13', 0.95)); c.drawRRect(cab, paint(STEEL, 0.5, 2))
    dfa = ease_out(lin(t, 33.5, 33.9))
    grip = 1 + 0.6 * dfa
    for (wx, wy) in ((-100, -140), (100, -140), (-100, 140), (100, 140)):
        c.drawRoundRect(skia.Rect.MakeXYWH(wx - 18, wy - 40, 36, 80), 8, 8, paint('#05070A', 1))
        c.drawCircle(wx, wy, 48 * grip, paint(CYAN, 0.12 * grip, 0)); c.drawCircle(wx, wy, 48 * grip, paint(CYAN, 0.9, 2.5))
    for (fx, fy) in FANS:
        c.drawCircle(fy * 110, -fx * 120, 34, paint(CYAN, 0.25 + 0.5 * dfa, 2.5))
    c.restore()
    # lateral (cornering) force arrow toward curve centre
    la = ease_out(lin(t, 33.84, 34.2))
    dx, dy = cx - px, cy - py; L = math.hypot(dx, dy)
    arrow(c, px, py, px + dx / L * 300, py + dy / L * 300, RED, la, 10, 36, glow=10)
    draw_text(c, 'قوة الانعطاف', px + dx / L * 260 + 40, py + dy / L * 260 - 70, 46, 'semi', WHITE, la)
    draw_text(c, 'تماسك أعلى = انعطاف أسرع', W / 2 + 40, 330, 58, 'bold', WHITE, ease_out(lin(t, 33.4, 33.8)))
    draw_text(c, 'دوائر التماسك تكبر مع الشفط', W / 2 + 40, 410, 38, 'med', CYAN, dfa)
    sim_badge(c, 1.0, 'رسم توضيحي')
    vignette(c, 0.45)

# ------------------------------------------------------------------ CONFIGURATOR CARD (overlay on footage) 46.52-57.40
TRIMS = {
    'Performance': dict(t0=46.52, t1=49.40, tag='للطريق', bullets=['مقعدين', 'نظام شفط بالمراوح', 'بدون دافعات'], sys='fans', idx=1),
    'Thrust':      dict(t0=49.42, t1=52.76, tag='إصدار محدود', bullets=['مقعدين', 'دافعات خلفية', 'تسارع أقوى'], sys='rear', idx=2),
    'Rocket':      dict(t0=52.78, t1=57.42, tag='بالدعوة فقط', bullets=['مقعد واحد', '١٠ دافعات', 'قفز وتحكم بالهواء', 'غير معتمدة للطرق العامة'], sys='all', idx=3),
}

def draw_mini_car(c, t, sys, cx, cy, scale=1.0, a=1.0):
    """Small x-ray schematic in a card. Only systems are differentiated — not body shape."""
    cam = Camera((5.6, 6.2, 3.6), (0, 0, 0.45), 30, cx=cx, cy=cy)
    cam.fpx *= scale
    draw_wheels(c, cam, alpha=0.7 * a)
    pw = 1.0 if sys in ('fans', 'rear', 'all') else 0.0
    for i, (x, y) in enumerate(FANS):
        draw_fan(c, cam, x, y, 0.17, FAN_R, t * 20 * (1 if i % 2 else -1), pw * (1.0 if sys == 'fans' else 0.5), alpha=a)
    draw_car(c, cam, xray=1.0, alpha=0.9 * a)
    nozzles = []
    if sys == 'rear': nozzles = REAR_N
    if sys == 'all': nozzles = REAR_N + CORNER_N + FRONT_N
    for i, n in enumerate(nozzles):
        s2, _ = cam.project(np.array([n]))
        pulse = 0.6 + 0.4 * math.sin(t * 7 + i)
        c.drawCircle(*s2[0], 10, paint(RED, a)); c.drawCircle(*s2[0], 22 * pulse, paint(RED, 0.45 * a, 2))

def trim_card(c, t, name):
    d = TRIMS[name]
    a = env(t, d['t0'], d['t1'], 0.3, 0.22)
    if a <= 0: return
    slide = (1 - ease_out(lin(t, d['t0'], d['t0'] + 0.45))) * 80
    x0, y0, w, h = 70, 760 + slide, W - 140, 600
    rr = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(x0, y0, w, h), 34, 34)
    p = skia.Paint(AntiAlias=True)
    p.setShader(skia.GradientShader.MakeLinear([skia.Point(0, y0), skia.Point(0, y0 + h)], [hexc('#0D131B', 0.86 * a), hexc('#06090D', 0.92 * a)]))
    c.drawRRect(rr, p); c.drawRRect(rr, paint(STEEL, 0.35 * a, 1.5))
    # index pips 1/3
    for i in range(3):
        on = (i + 1) == d['idx']
        c.drawRoundRect(skia.Rect.MakeXYWH(W - 140 - 30 - i * 54, y0 + 50, 40, 8), 4, 4, paint(RED if on else STEEL, (1 if on else 0.35) * a))
    draw_text(c, name.upper(), x0 + 52, y0 + 92, 78, 'bold', WHITE, a, anchor='l', rtl=False)
    draw_text(c, d['tag'], x0 + 52, y0 + 168, 40, 'med', RED, a, anchor='l')
    for i, b in enumerate(d['bullets']):
        ba = ease_out(lin(t, d['t0'] + 0.35 + i * 0.22, d['t0'] + 0.65 + i * 0.22)) * a
        yy = y0 + 255 + i * 78
        draw_text(c, b, x0 + w - 60, yy, 44, 'semi', WHITE, ba, anchor='r')
        c.drawCircle(x0 + w - 38, yy + 2, 7, paint(CYAN if name != 'Rocket' or i != 3 else RED, ba))
    draw_mini_car(c, t, d['sys'], x0 + 270, y0 + 380, 0.36, a)
    draw_text(c, 'مخطط الأنظمة — توضيحي', x0 + 250, y0 + h - 40, 26, 'reg', GREY, a)

# ------------------------------------------------------------------ RESERVATION infographic (57.46-66.40)
def money_row(c, t, t0, y, name, init, bal, total, color):
    a = ease_out(lin(t, t0, t0 + 0.35))
    if a <= 0: return
    dy = (1 - a) * 40
    draw_text(c, name, W - 110, y - 70 + dy, 44, 'bold', color, a, anchor='r', rtl=False)
    parts = [(init, 'دفعة أولى'), (bal, 'خلال ١٠ أيام')]
    # LTR equation laid out left→right for numerals: $5,000 + $45,000 = $50,000
    xs = [80, 345, 650]
    b = ease_out(lin(t, t0 + 0.25, t0 + 0.6))
    draw_text(c, init, xs[0], y + dy, 48, 'semi', WHITE, a, anchor='l', rtl=False)
    draw_text(c, '+', xs[1] - 38, y + dy, 48, 'light', GREY, b, rtl=False)
    draw_text(c, bal, xs[1], y + dy, 48, 'semi', WHITE, b, anchor='l', rtl=False)
    cc = ease_out(lin(t, t0 + 0.55, t0 + 0.9))
    draw_text(c, '=', xs[2] - 36, y + dy, 48, 'light', GREY, cc, rtl=False)
    draw_text(c, total, xs[2], y + dy, 60, 'bold', color, cc, anchor='l', rtl=False, scale=lerp(1.15, 1, cc))
    draw_text(c, 'دفعة أولى', xs[0] + 85, y + 58 + dy, 28, 'reg', GREY, a)
    draw_text(c, 'الباقي', xs[1] + 100, y + 58 + dy, 28, 'reg', GREY, b)
    draw_text(c, 'إجمالي الحجز', xs[2] + 130, y + 58 + dy, 28, 'reg', GREY, cc)

def scene_reservation(c, t):
    background(c, t)
    a = ease_out(lin(t, 57.46, 57.9))
    draw_text(c, 'الحجز', W / 2, 330, 96, 'bold', WHITE, a)
    draw_text(c, 'من موقع تسلا الرسمي', W / 2, 425, 44, 'med', GREY, a)
    # step 1: $5,000 now
    s1 = ease_out(lin(t, 59.35, 59.75))
    big = 1 - ease_io(lin(t, 61.9, 62.4))
    if s1 > 0 and big > 0:
        draw_text(c, '$5,000', W / 2, 700, 170, 'bold', WHITE, s1 * big, rtl=False, scale=lerp(1.2, 1, s1))
        draw_text(c, 'دفعة أولى', W / 2, 830, 50, 'semi', GREY, s1 * big)
    s2 = ease_out(lin(t, 60.75, 61.1))
    if s2 > 0 and big > 0:
        pill = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(W / 2 - 230, 920, 460, 104), 52, 52)
        c.drawRRect(pill, paint(RED, 0.95 * s2 * big))
        draw_text(c, 'خلال ١٠ أيام', W / 2, 972, 54, 'bold', WHITE, s2 * big)
        draw_text(c, 'بتكمّل باقي المبلغ', W / 2, 1100, 44, 'med', WHITE, s2 * big)
    # step 2: equations
    if t >= 61.9:
        money_row(c, t, 62.0, 720, 'PERFORMANCE', '$5,000', '$45,000', '$50,000', WHITE)
        c.drawLine(110, 840, W - 110, 840, paint(STEEL, 0.25 * ease_out(lin(t, 63.0, 63.5)), 1.5))
        money_row(c, t, 64.40, 1000, 'THRUST', '$5,000', '$245,000', '$250,000', RED)
        fa = ease_out(lin(t, 64.9, 65.3))
        draw_text(c, 'فئة Rocket بالدعوة فقط — بدون مبلغ حجز معلن', W / 2, 1170, 32, 'reg', GREY, fa)
    draw_text(c, 'شروط الحجز المنشورة في ١٥ تشرين الأول ٢٠٢٦ — قابلة للتغيير', W / 2, 1290, 26, 'reg', GREY, a * 0.85)
    vignette(c, 0.4)

# ------------------------------------------------------------------ FUTURE illustrative (73.98-75.75)
def scene_future(c, t):
    t0 = 73.98
    c.clear(hexc('#05070B'))
    k = ease_io(lin(t, t0, 75.8))
    # horizon glow
    sh = skia.GradientShader.MakeLinear([skia.Point(0, 900), skia.Point(0, 1500)], [hexc('#05070B', 1), hexc('#1A2A3A', 1), hexc('#05070B', 1)], [0, 0.55, 1])
    p = skia.Paint(); p.setShader(sh); c.drawRect(skia.Rect.MakeWH(W, H), p)
    cam = Camera((lerp(-7.0, -5.8, k), lerp(4.2, 2.8, k), lerp(0.8, 1.3, k)), (lerp(-0.3, 1.2, k), 0, lerp(1.9, 2.6, k)), 40, cy=H * 0.56)
    surface_grid(c, cam, z=-0.2, extent=14, step=1.0, alpha=0.9)
    hgt = 1.4 + 0.9 * k
    off = (lerp(-0.5, 1.5, k), 0, hgt)
    M = rot_y(-math.radians(6)) @ rot_x(math.radians(5 * math.sin(t * 1.5)))
    # light trail
    for i in range(30):
        u = i / 30
        pt = np.array([[-2.2 - u * 5, 0.0, 0.35 + hgt - u * 0.8]])
        s2, _ = cam.project(pt)
        c.drawCircle(*s2[0], 6 + 10 * u, paint(CYAN, 0.25 * (1 - u), blur=8))
    draw_car(c, cam, M=M, pivot=(0, 0, 0.5), offset=off, xray=1.0, alpha=0.95)
    draw_text(c, 'شو رح نشوف', W / 2, 470, 104, 'bold', WHITE, ease_out(lin(t, t0, t0 + 0.4)))
    draw_text(c, 'بالمستقبل؟', W / 2, 600, 104, 'bold', RED, ease_out(lin(t, t0 + 0.2, t0 + 0.6)))
    sim_badge(c, 1.0, 'تصوّر فني')
    vignette(c, 0.5)

# ------------------------------------------------------------------ fallback visual for footage slots (preview only)
def slot_card(c, t, slot, desc, src):
    c.clear(hexc('#0B0E13'))
    for i in range(-H, W + H, 60):
        c.drawLine(i, 0, i + H, H, paint('#141922', 1, 2))
    rr = skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(140, 1110, W - 280, 220), 24, 24)
    c.drawRRect(rr, paint('#0B0E13', 0.92)); c.drawRRect(rr, paint(RED, 0.9, 2.5))
    draw_text(c, 'REAL FOOTAGE SLOT ' + slot + ' — ' + ' / '.join(desc), W / 2, 1160, 30, 'semi', RED, 1)
    draw_text(c, src, W / 2, 1220, 26, 'reg', STEEL, 1, rtl=False)
    draw_text(c, 'لقطة حقيقية — بانتظار المادة (معاينة فقط)', W / 2, 1280, 28, 'med', GREY, 1)
