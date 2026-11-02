"""Edit decision list locked to the immutable narration (times in seconds on the voice-over master)."""
import scenes as S, overlays as O

# kind: 'real' = genuine footage slot, 'gfx' = original 3D/motion graphics, 'type' = standalone typography/graphic design
SHOTS = [
 # start, end, kind, slot/scene, overlays, slot description (Arabic), source hint
 (0.00, 1.52, 'real', 'A1a', [O.ov_hook], ['الرودستر تقترب من المنحدر'], 'Tesla Roadster Event 06:03–10:55 (Ramp)'),
 (1.52, 2.22, 'real', 'A1b', [O.ov_hook], ['الصعود على الجدار المنحني'], 'Tesla Roadster Event 06:03–10:55 (Ramp)'),
 (2.22, 2.94, 'real', 'A1c', [], ['اللحظة المقلوبة'], 'Tesla Roadster Event 06:03–10:55 (Ramp)'),
 (2.94, 4.32, 'real', 'A2a', [], ['القفزة فوق السيارات المصفوفة'], 'Tesla Roadster Event 10:56–12:43 (Kickflip)'),
 (4.32, 5.84, 'real', 'A2a_freeze', [O.ov_freeze_how], ['تجميد لقطة القفزة'], 'freeze of A2a'),
 (5.84, 7.32, 'real', 'A1d', [O.ov_inverted_hold], ['السيارة ماسكة بالسطح وهي مقلوبة'], 'Tesla Roadster Event 06:03–10:55 (Ramp)'),
 (7.32, 12.36, 'gfx', S.scene_suction, [], None, None),
 (12.36, 13.41, 'gfx', S.scene_suction_inverted, [], None, None),
 (13.41, 15.47, 'real', 'B1', [O.ov_vacuum], ['فوهة مكنسة ماسكة بسجادة', '(تصوير خاص بك)'], 'Your own phone footage'),
 (15.47, 16.75, 'gfx', S.scene_match_underside, [], None, None),
 (16.75, 18.21, 'real', 'A1e', [O.ov_full_car], ['السيارة على الجدار — لقطة كاملة'], 'Tesla Roadster Event 06:03–10:55 (Ramp)'),
 (18.21, 19.95, 'real', 'A2b', [O.ov_takeoff], ['انطلاق القفزة → تجميد بالهواء'], 'Tesla Roadster Event 10:56–12:43 (Kickflip)'),
 (19.95, 24.35, 'gfx', S.scene_thrusters, [], None, None),
 (24.35, 25.06, 'real', 'A2c', [], ['الهبوط بعد القفزة'], 'Tesla Roadster Event 10:56–12:43 (Kickflip)'),
 (25.06, 26.92, 'real', 'C1', [O.ov_rcs], ['دافعات تحكم مركبة فضائية (RCS)'], 'NASA public-domain video'),
 (26.92, 28.30, 'real', 'C2', [O.ov_launch], ['إطلاق صاروخ — للمقارنة'], 'NASA public-domain video (e.g. Artemis I)'),
 (28.30, 30.00, 'real', 'A6', [O.ov_spacex], ['موقع الحدث / لقطة واسعة للعرض'], 'Tesla Roadster Event (venue wide)'),
 (30.00, 31.52, 'type', S.scene_why, [], None, None),
 (31.52, 33.20, 'real', 'D1', [O.ov_track], ['سيارة على حلبة — منعطف', '(ليست رودستر)'], 'Pexels/Pixabay licensed clip'),
 (33.20, 35.42, 'gfx', S.scene_grip, [], None, None),
 (35.42, 37.08, 'real', 'A5a', [O.ov_thrust_launch], ['انطلاقة التسارع مع الدافعات'], 'Tesla Roadster Event 15:58–19:26 (0–60)'),
 (37.08, 41.56, 'real', 'A5b', [O.ov_accel], ['تجربة التسارع ٠–٦٠ ميل/س'], 'Tesla Roadster Event 15:58–19:26 (0–60)'),
 (41.56, 44.58, 'real', 'A2d', [O.ov_attitude], ['الدوران بالهواء (kickflip)'], 'Tesla Roadster Event 10:56–12:43 (Kickflip)'),
 (44.58, 46.52, 'real', 'A3a', [O.ov_buy], ['لقطة تصميم السيارة'], 'Tesla Roadster Event 12:47–14:38 (Design)'),
 (46.52, 49.42, 'real', 'A3b', [O.ov_trims], ['لقطة جانبية للسيارة'], 'Tesla Roadster Event 12:47–14:38 (Design)'),
 (49.42, 52.78, 'real', 'A5c', [O.ov_trims], ['خلفية السيارة / الدافعات'], 'Tesla Roadster Event 15:58–19:26'),
 (52.78, 57.46, 'real', 'A2e', [O.ov_trims], ['السيارة بالهواء'], 'Tesla Roadster Event 10:56–12:43'),
 (57.46, 66.44, 'type', S.scene_reservation, [], None, None),
 (66.44, 71.32, 'real', 'A4', [O.ov_not_price], ['لقطة الديناميكا الهوائية / التصميم'], 'Tesla Roadster Event 14:38–15:57 (Aero)'),
 (71.32, 73.98, 'real', 'A2f', [O.ov_future_real], ['القفزة — لقطة واسعة'], 'Tesla Roadster Event 10:56–12:43'),
 (73.98, 75.80, 'gfx', S.scene_future, [], None, None),
 (75.80, 79.11, 'real', 'A3c', [O.ov_closing], ['لقطة بطولية للسيارة'], 'Tesla Roadster Event 12:47–14:38 (Design)'),
]
DURATION = 79.11

def shot_at(t):
    for sh in SHOTS:
        if sh[0] <= t < sh[1]: return sh
    return SHOTS[-1]

def balance():
    tot = {'real': 0, 'gfx': 0, 'type': 0}
    for s in SHOTS: tot[s[2]] += s[1] - s[0]
    return tot
