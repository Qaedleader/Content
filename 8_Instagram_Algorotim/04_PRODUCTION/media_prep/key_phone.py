"""Opening shot: key the green-screen phone clip (Mixkit #28300), track the phone screen, export RGBA frames + track JSON.
Output frames are 1080x1920 (crop of the 1920x1080 source scaled by S). The screen (incl. tracking marker) becomes transparent
except where skin (the finger) covers it, so the episode's own feed UI shows through underneath.
Usage: python -I key_phone.py"""
import json, os, subprocess
import numpy as np, cv2
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
SRC = r'D:/Content/8_Instagram_Algorotim/03_MEDIA/raw/mixkit/hands-using-a-cellphone-with-tracking-point-on-a-green-28300.mp4'
OUT = r'D:/Content/_BRAND_SYSTEM/public/episodes/igalgo/phone'
TRK = r'D:/Content/_BRAND_SYSTEM/src/episodes/igalgo/data/phone_track.json'
T0, NF, S = 0.45, 42, 1.85            # start (s), frames at 30 fps, scale
CX, CY = 905, 540                     # source crop centre
cw, ch = 1080 / S, 1920 / S
x0, y0 = int(round(CX - cw / 2)), int(round(CY - ch / 2))
y0 = max(0, min(1080 - int(ch), y0))
raw = subprocess.run([FF, '-nostdin', '-v', 'error', '-ss', str(T0), '-i', SRC, '-vf', 'fps=30', '-frames:v', str(NF), '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True, check=True).stdout
frames = np.frombuffer(raw, np.uint8).reshape(-1, 1080, 1920, 3)
track = []
for k, fr in enumerate(frames):
    hsv = cv2.cvtColor(fr, cv2.COLOR_BGR2HSV).astype(np.float32)
    H, Sat, V = hsv[..., 0], hsv[..., 1] / 255, hsv[..., 2] / 255
    b, g, r = [fr[..., i].astype(np.float32) for i in range(3)]
    green = np.clip((g - np.maximum(r, b)) / 60.0, 0, 1)            # 1 = pure screen green
    # phone body: largest dark component; screen = green pixels inside its filled convex hull
    dark = ((V < 0.28) & (Sat < 0.6)).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(dark, 8)
    big = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    pts = cv2.findNonZero((lab == big).astype(np.uint8))
    hull = cv2.convexHull(pts)
    body = np.zeros(dark.shape, np.uint8); cv2.fillConvexPoly(body, hull, 1)
    rect = cv2.minAreaRect(hull)                                       # outer phone rect
    scr = ((green > 0.5) & (body > 0)).astype(np.uint8)
    scr = cv2.morphologyEx(scr, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    spts = cv2.findNonZero(scr)
    srect = cv2.minAreaRect(cv2.convexHull(spts))                       # screen rect
    (sx, sy), (sw, sh), sa = srect
    if sw > sh: sw, sh, sa = sh, sw, sa - 90
    if sa < -45: sa += 90
    if sa > 45: sa -= 90
    track.append([sx, sy, sw, sh, sa, rect[0][0], rect[0][1]])
tr = np.array(track)
# temporal smoothing (handheld, small motion): 5-tap moving average on centre/size/angle
ker = np.ones(5) / 5
sm = np.vstack([np.convolve(np.pad(tr[:, i], 2, mode='edge'), ker, 'valid') for i in range(tr.shape[1])]).T
# screen size is physically constant: use the median size (finger occlusion only shrinks the measured rect)
sw_m, sh_m = np.median(tr[:, 2]), np.median(tr[:, 3])
out = []
for k, fr in enumerate(frames):
    sx, sy, _, _, sa = sm[k, :5]
    b, g, r = [fr[..., i].astype(np.float32) for i in range(3)]
    hsv = cv2.cvtColor(fr, cv2.COLOR_BGR2HSV).astype(np.float32)
    Hh, Sat = hsv[..., 0], hsv[..., 1] / 255
    green = np.clip((g - np.maximum(r, b)) / 50.0, 0, 1)
    alpha = 1 - green
    # inside the screen (shrunk 3 px): keep only skin (warm hue, saturated) -> marker/screen transparent
    box = cv2.boxPoints(((sx, sy), (sw_m - 6, sh_m - 6), sa)).astype(np.int32)
    inside = np.zeros(alpha.shape, np.uint8); cv2.fillConvexPoly(inside, box, 1)
    skin = np.clip((Sat - 0.18) / 0.15, 0, 1) * ((Hh < 25) | (Hh > 165)).astype(np.float32) * (1 - green)
    # keep only large skin blobs (the finger); marker remnants and edge speckles are small
    sk = (skin > 0.5).astype(np.uint8) * inside
    n, lab, st, _ = cv2.connectedComponentsWithStats(sk, 8)
    keep = np.zeros(sk.shape, np.float32)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] >= 2500: keep[lab == i] = 1
    keep = cv2.dilate(keep, np.ones((5, 5), np.uint8))
    alpha = np.where(inside > 0, skin * keep, alpha)
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    # despill: clamp green to max(r,b) where partially transparent / near edges
    g2 = np.minimum(g, np.maximum(r, b) * 1.05)
    rgb = np.dstack([r, g2, b])
    crop = rgb[y0:y0 + int(ch), x0:x0 + int(cw)]; a = alpha[y0:y0 + int(ch), x0:x0 + int(cw)]
    crop = cv2.resize(crop, (1080, 1920), interpolation=cv2.INTER_CUBIC); a = cv2.resize(a, (1080, 1920), interpolation=cv2.INTER_LINEAR)
    crop = cv2.addWeighted(crop, 1.35, cv2.GaussianBlur(crop, (0, 0), 2.0), -0.35, 0)   # mild unsharp after upscale
    rgba = np.dstack([np.clip(crop, 0, 255), np.clip(a * 255, 0, 255)]).astype(np.uint8)
    cv2.imwrite(os.path.join(OUT, f'{k:03d}.png'), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
    out.append({'x': round((sx - x0) * S, 1), 'y': round((sy - y0) * S, 1), 'w': round(sw_m * S, 1), 'h': round(sh_m * S, 1), 'a': round(float(sa), 2)})
json.dump({'source': 'Mixkit #28300 (Free License)', 't0': T0, 'scale': S, 'frames': out}, open(TRK, 'w'), indent=1)
print(len(out), out[0], out[-1], 'crop', x0, y0)
