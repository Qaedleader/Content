"""NO MONEY ANYMORE — original sound design + music + final mix.

Everything here is synthesised (numpy/scipy): no third-party samples or music.
The narration is the ORIGINAL recording, decoded once and never edited, trimmed, time-stretched or pitch-shifted.
The only operation applied to it is ONE constant scalar master gain on the whole mix (to keep true peak below -1 dBTP),
which changes level only — not timing, wording, pauses or tone.

Cue times are anchored to the verified word timings (02_TIMING/words.json), the same anchors the Remotion edit uses.

Outputs (this folder, 44.1 kHz like the voice): sfx_stem.wav, music_stem.wav, final_mix.wav, mix_report.json
Usage: python audio_design.py
"""
import json, os, subprocess
import numpy as np
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
SR = 44100
FPS = 30
TAIL = 27 / FPS  # visual tail after the narration (matches the video)
rng = np.random.default_rng(2026)

# ---------------------------------------------------------------- voice (original, untouched)
VO_SRC = os.path.join(ROOT, '01_AUDIO', 'Original', 'narration_original.m4a')
VO_WAV = os.path.join(HERE, 'narration_decoded_f32.wav')
if not os.path.exists(VO_WAV):
    subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y', '-i', VO_SRC, '-c:a', 'pcm_f32le', VO_WAV], check=True)
voice, sr = sf.read(VO_WAV, dtype='float64', always_2d=True)
assert sr == SR, sr
N = int(round(1785 / FPS * SR))  # = video length (1785 frames @30 fps: narration 58.58 s + 0.9 s tail)
VO = np.zeros((N, 2)); VO[:len(voice)] = voice

WORDS = json.load(open(os.path.join(ROOT, '02_TIMING', 'words.json'), encoding='utf-8'))['words']
ws = lambda i: WORDS[i]['s']
we = lambda i: WORDS[i]['e']
fr = lambda frames: frames / FPS

# ---------------------------------------------------------------- dsp helpers
def t_(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR))
def bp(x, lo, hi, order=2): return signal.sosfilt(signal.butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f, order=2): return signal.sosfilt(signal.butter(order, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f, order=2): return signal.sosfilt(signal.butter(order, f, 'highpass', fs=SR, output='sos'), x)
def expd(d, tau): return np.exp(-t_(d) / tau)
def ar(d, a, r):
    t = t_(d); e = np.minimum(1, t / max(a, 1e-4)); return e * np.exp(-np.maximum(0, t - a) / r)
def norm(x, peak=1.0):
    m = np.max(np.abs(x)) + 1e-12; return x / m * peak
def sweep(f0, f1, d, curve=2.0):
    t = t_(d); f = f1 + (f0 - f1) * (1 - t / d) ** curve; return np.sin(2 * np.pi * np.cumsum(f) / SR)
def db(x): return 10 ** (x / 20)

# ---------------------------------------------------------------- sound library (original synthesis)
def impact(big=True):
    d = 1.1 if big else 0.45
    body = sweep(140 if big else 190, 38 if big else 60, d, 3) * expd(d, 0.32 if big else 0.12)
    crack = lp(noise(d), 1800) * expd(d, 0.05 if big else 0.03)
    click = hp(noise(d), 3000) * expd(d, 0.006)
    return norm(body * 1.0 + crack * 0.5 + click * 0.25)

def stamp():
    d = 0.4
    thud = sweep(170, 70, d, 2) * expd(d, 0.08)
    slap = bp(noise(d), 700, 4500) * expd(d, 0.025)
    return norm(thud + slap * 0.8)

def paper_slide(d=0.32):
    n = bp(noise(d), 1400, 7500)
    grain = 0.6 + 0.4 * lp(np.abs(noise(d)), 60)
    env = np.sin(np.pi * np.clip(t_(d) / d, 0, 1)) ** 1.5
    return norm(n * grain * env)

def paper_flick():
    d = 0.07; return norm(bp(noise(d), 2000, 9000) * expd(d, 0.012))

def tear(d=0.42):
    x = np.zeros(int(d * SR))
    for _ in range(140):
        p = int(rng.uniform(0, 0.92) * len(x)); L = int(SR * rng.uniform(0.002, 0.008))
        x[p:p + L] += rng.standard_normal(min(L, len(x) - p)) * rng.uniform(0.3, 1)
    x = bp(x, 900, 7000) * np.linspace(0.6, 1, len(x))
    return norm(x)

def scribble(d=0.38):
    n = bp(noise(d), 1800, 6000)
    am = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 14 * t_(d)))
    return norm(n * lp(am, 80) * np.sin(np.pi * t_(d) / d))

def whoosh(d=0.42, up=True):
    n = noise(d); u = t_(d) / d
    low, mid, high = bp(n, 150, 700), bp(n, 700, 2500), bp(n, 2500, 9000)
    w_mid = np.sin(np.pi * u) if up else (1 - u)
    w_high = np.sin(np.pi * u) ** 3 if up else (1 - u) ** 2
    x = low * (1 - u if up else u) * 0.6 + mid * w_mid + high * w_high * 0.7
    return norm(x * np.sin(np.pi * u) ** 2)

def riser(d=0.7):
    return norm(bp(noise(d), 400, 8000) * (t_(d) / d) ** 2 + 0.4 * sweep(200, 900, d, 0.5) * (t_(d) / d) ** 2)

def pop():
    d = 0.12; return norm(sweep(900, 320, d, 2) * expd(d, 0.035) + hp(noise(d), 2500) * expd(d, 0.004) * 0.4)

def tick():
    d = 0.03; return norm(bp(noise(d), 2000, 6000) * expd(d, 0.003) + np.sin(2 * np.pi * 2600 * t_(d)) * expd(d, 0.006) * 0.5)

def blip(f1=880, f2=1320):
    d = 0.16; t = t_(d)
    return norm(np.sin(2 * np.pi * f1 * t) * (t < 0.07) * expd(d, 0.03) + np.sin(2 * np.pi * f2 * t) * (t >= 0.07) * expd(d, 0.05))

def digital(d=0.45):
    t = t_(d); car = np.sin(2 * np.pi * (700 + 500 * np.sign(np.sin(2 * np.pi * 18 * t))) * t + 3 * np.sin(2 * np.pi * 90 * t))
    return norm(car * ar(d, 0.01, 0.2) * 0.8)

def servo(d=0.38, f0=260, f1=420):
    t = t_(d); f = np.linspace(f0, f1, len(t)) + 6 * np.sin(2 * np.pi * 30 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.2 * np.sin(3 * ph)
    return norm(bp(x, 150, 2400) * np.sin(np.pi * t / d))

def clank(light=False):
    d = 0.7; t = t_(d)
    parts = [(233, 1), (587, 0.6), (1123, 0.45), (1789, 0.3), (2711, 0.2)]
    x = sum(a * np.sin(2 * np.pi * f * (1.6 if light else 1) * t) * expd(d, 0.18 / (1 + k * 0.4)) for k, (f, a) in enumerate(parts))
    x += bp(noise(d), 1500, 7000) * expd(d, 0.01) * 0.8
    return norm(x)

def weld(d=1.2):
    x = np.zeros(int(d * SR))
    for _ in range(int(d * 260)):
        p = int(rng.uniform(0, 0.97) * len(x)); L = int(SR * 0.003)
        x[p:p + L] += rng.standard_normal(min(L, len(x) - p)) * rng.uniform(0.2, 1)
    hum = 0.15 * np.sin(2 * np.pi * 100 * t_(d)) * (1 + 0.5 * np.sin(2 * np.pi * 7 * t_(d)))
    return norm(bp(x, 2000, 9000) + hum * 0.4) * np.minimum(1, np.minimum(t_(d) / 0.05, (d - t_(d)) / 0.12))

def fire(d=1.0):
    n = lp(noise(d), 900) + 0.3 * bp(noise(d), 1500, 5000) * (np.abs(lp(noise(d), 30)) * 3)
    return norm(n * ar(d, 0.25, 0.5))

def rumble(d=1.4):
    return norm(lp(noise(d), 140, 3) * np.sin(np.pi * t_(d) / d))

def conveyor(d):
    t = t_(d); hum = np.sin(2 * np.pi * 72 * t) * 0.5 + 0.25 * np.sin(2 * np.pi * 144 * t)
    rattle = bp(noise(d), 800, 3000) * (0.5 + 0.5 * (np.sin(2 * np.pi * 9 * t) > 0.6))
    return norm((hum + rattle * 0.5) * np.minimum(1, np.minimum(t / 0.2, (d - t) / 0.3)))

def ping():
    d = 0.4; t = t_(d); return norm(np.sin(2 * np.pi * 1760 * t) * expd(d, 0.08) + 0.4 * np.sin(2 * np.pi * 2640 * t) * expd(d, 0.05))

def door():
    d = 0.6; t = t_(d)
    creak = np.sin(2 * np.pi * np.cumsum(300 + 120 * np.sin(2 * np.pi * 9 * t)) / SR) * bp(noise(d), 200, 2000)
    knock = np.zeros(len(t)); st = stamp(); knock[:len(st)] = st
    return norm(knock * 0.6 + norm(creak * np.sin(np.pi * t / d)) * 0.4)

def zap(d=0.45):
    t = t_(d); buzz = sum(np.sin(2 * np.pi * 50 * k * t) / k for k in range(1, 12))
    crack = hp(noise(d), 2500) * (np.abs(lp(noise(d), 40)) > 0.6)
    return norm((buzz * 0.4 + crack) * ar(d, 0.01, 0.18))

def wind(d=1.3):
    n = bp(noise(d), 200, 1600); m = 0.5 + 0.5 * np.sin(2 * np.pi * 0.8 * t_(d) + 1)
    return norm(n * m * np.sin(np.pi * t_(d) / d))

def brush(d=0.65):
    return norm(bp(noise(d), 3000, 9500) * (0.5 + 0.5 * np.sin(2 * np.pi * 7 * t_(d))) * np.sin(np.pi * t_(d) / d))

def crash():
    d = 1.0; x = impact(True)[:int(d * SR)] + 0.6 * sweep(420, 60, d, 1.4) * expd(d, 0.3) + 0.5 * tear(d) * expd(d, 0.25)
    return norm(x)

def ding():
    d = 1.2; t = t_(d)
    return norm(sum(a * np.sin(2 * np.pi * f * t) * expd(d, 0.35 / (k + 1)) for k, (f, a) in enumerate([(1568, 1), (3136, 0.4), (4704, 0.2), (2093, 0.3)])))

def ratchet(n=6, gap=0.045):
    x = np.zeros(int((n * gap + 0.1) * SR))
    for k in range(n):
        p = int(k * gap * SR); c = tick(); x[p:p + len(c)] += c * (0.6 + 0.4 * k / n)
    return norm(x)

def tick_roll(times):
    d = times[-1] + 0.05; x = np.zeros(int(d * SR))
    for tt in times:
        p = int(tt * SR); c = tick(); x[p:p + len(c)] += c
    return norm(x)

# ---------------------------------------------------------------- cue sheet (time [s], sound, gain dB, pan -1..1)
C = []
def cue(t, snd, g, pan=0.0): C.append((t, snd, g, pan))

# A — hook
cue(fr(5), impact(True), -10)
cue(ws(1) - 0.1, paper_slide(0.3), -15, 0.4); cue(ws(1) + 0.1, paper_slide(0.3), -15, -0.4)
cue(ws(3) - 0.06, stamp(), -13)
cue(ws(4), scribble(0.38), -16, 0.2)
cue(ws(7) - 0.08, pop(), -22, 0.5)
cue(we(7) + 0.02, tear(0.45), -15)
cue(fr(82), whoosh(0.4), -17)
# B
cue(ws(8), blip(660, 990), -20, 0.3)
cue(ws(11) - 0.05, stamp(), -15)
# C — world unfolds
for k in range(4): cue(fr(133 + k * 4), paper_slide(0.25), -18, (k - 1.5) * 0.4)
cue(ws(14) - 0.05, digital(0.5), -21)
for k in range(4): cue(ws(16) - 0.05 + k * 0.1, servo(0.3, 240 + k * 30, 380 + k * 30), -24, (k - 1.5) * 0.5)
cue(ws(19), tick_roll(np.cumsum(np.linspace(0.025, 0.09, 18)) - 0.025), -16)
cue(ws(19) + 1.0, stamp(), -12)
for k in range(6): cue(ws(20) - 0.03 + k * 0.067, pop(), -27, (k - 2.5) * 0.3)
# D — the car journey
cue(fr(278), pop(), -16)
cue(ws(25), blip(), -20, -0.3)
cue(ws(25) + 0.1, scribble(1.0), -25, 0.2)
pans = [ws(28) - 8 / FPS, ws(33) - 9 / FPS, ws(34) - 8 / FPS, ws(36) - 8 / FPS, ws(38) - 7 / FPS]
for p in pans: cue(p, whoosh(0.4), -16)
cue(ws(28), rumble(1.4), -21); cue(ws(28) + 0.1, servo(0.45, 180, 260), -22, -0.4)
cue(ws(28) + 0.2, conveyor(2.6), -24)
cue(ws(33) - 0.15, fire(1.0), -14)
for k in range(3): cue(ws(34) + k * 8 / FPS, clank(), -14, (k - 1) * 0.3)
cue(ws(36), weld(1.25), -19)
cue(ws(37), ding(), -17)
cue(ws(38) - 0.1, conveyor(2.3) * 0.6, -26)
for k in range(5): cue(ws(38) + 0.1 + k * 0.53, ping(), -27, 0.3)
cue(we(43) + 0.02, door(), -17, 0.4)
# E — robots making robots
cue(ws(45) - 0.05, pop(), -16, 0.4)
cue(ws(49) - 0.1, whoosh(0.5, up=False), -15)
cue(ws(49) + 0.05, riser(0.7), -21)
cue(ws(49) + 0.1, weld(0.8), -23)
for k in range(5): cue(ws(49) + 0.3 + k * 0.1, servo(0.25, 300 + k * 40, 460 + k * 40), -27, (k - 2) * 0.4)
cue(ws(51) - 0.05, paper_slide(0.4), -15)
cue(ws(52) + 0.13, blip(880, 1175), -20); cue(ws(53) + 0.13, blip(988, 1480), -19)
cue(ws(53), digital(0.55), -19)
# F — energy
cue(ws(55), wind(1.3), -22)
cue(ws(57) - 0.1, paper_slide(0.35), -16)
for k in range(3): cue(ws(58) - 0.07 + k * 0.3, clank(True), -20, -0.3 + k * 0.3)
cue(ws(58) + 0.1, servo(0.6, 200, 330), -24)
cue(ws(60), brush(0.7), -19, -0.3)
cue(ws(60) + 0.2, zap(0.45), -21, 0.4)
cue(ws(61) - 0.03, stamp(), -12)
# G — chain overview
cue(fr(831), scribble(0.8), -24)
for k in range(6): cue(ws(63) + k * (ws(70) - ws(63)) / 5, tick(), -16, (-1) ** k * 0.4)
cue(ws(71) - 0.1, whoosh(0.4), -17)
for k in range(4): cue(ws(72) - 0.13 + k * 0.1, paper_flick(), -18, (k - 1.5) * 0.5)
cue(ws(73) - 0.03, pop(), -13)
# H — everything
for k, w in enumerate([76, 77, 78, 79]): cue(ws(w) - 0.1, impact(False), -13, (-1) ** k * 0.35)
# I — production up, cost down
for k in range(15): cue(ws(80) + 0.08 + k * 2.2 / FPS, impact(False), -22 - (k % 3), ((k % 3) - 1) * 0.4)
cue(ws(80) + 0.1, riser(0.9), -23)
cue(ws(84) - 0.05, crash(), -14)
cue(ws(85) - 0.1, paper_slide(0.35), -15)
cue(ws(89) - 0.03, pop(), -15)
# J/K — what keeps value
cue(ws(90) - 0.05, stamp(), -12)
cue(fr(1206), impact(False), -16)
cue(ws(94) - 0.05, paper_slide(0.3), -15)
cue(ws(96) + 0.07, clank(True), -20)
cue(ws(96) + 0.2, paper_slide(0.4), -18)
cue(ws(98) - 0.03, pop(), -16)
cue(ws(107) - 0.12, clank(), -18, 0.3)
cue(ws(108) - 0.05, zap(0.4), -16, 0.3)
cue(ws(109) - 0.05, ratchet(5), -15, 0.3); cue(ws(109) - 0.03, impact(False), -17, 0.3)
# L — examples
cue(fr(1451), impact(False), -16, -0.3)
for k in range(4): cue(ws(119) - 0.03 + k * 4 / FPS, pop(), -19, 0.4)
cue(ws(122) - 0.25, whoosh(0.45), -15)
cue(ws(122) + 0.2, zap(0.5), -18)
for k, w in enumerate([123, 124, 125]): cue(ws(w), servo(0.3, 280 + k * 60, 420 + k * 80), -27, 0)
cue(ws(125), tick_roll(np.cumsum(np.linspace(0.03, 0.06, 12)) - 0.03), -17)
# M — finale
cue(fr(1599), whoosh(0.6, up=False), -15)
cue(ws(129) - 0.1, paper_slide(0.4), -15)
cue(ws(130), scribble(0.45), -13)
cue(ws(133) - 0.12, whoosh(0.5, up=False), -16)
cue(ws(134) - 0.07, riser(0.6)[::-1], -17)
cue(ws(135) - 0.07, impact(True), -12); cue(ws(135) - 0.02, clank(), -16)
cue(ws(137) - 0.03, stamp(), -12); cue(ws(138) - 0.03, stamp(), -14)
cue(58.75, ratchet(7, 0.05), -20)

# ---------------------------------------------------------------- render SFX stem
SFX = np.zeros((N, 2))
for t0, snd, g, pan in C:
    p0 = int(max(0, t0) * SR); x = snd * db(g)
    L = min(len(x), N - p0)
    if L <= 0: continue
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    SFX[p0:p0 + L, 0] += x[:L] * l * 1.414; SFX[p0:p0 + L, 1] += x[:L] * r * 1.414

# ---------------------------------------------------------------- original music bed
BPM = 100; beat = 60 / BPM
def note_hz(m): return 440 * 2 ** ((m - 69) / 12)
def pad_tone(midi, d):
    t = t_(d); x = sum(signal.sawtooth(2 * np.pi * note_hz(midi) * (1 + det) * t) for det in (-0.004, 0, 0.0045))
    return lp(x, 1100, 2) * np.minimum(1, np.minimum(t / 0.6, (d - t) / 0.8))
def pluck(midi, d=0.5):
    t = t_(d); f = note_hz(midi)
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)) * expd(d, 0.13)
def kick():
    d = 0.35; return sweep(110, 45, d, 3) * expd(d, 0.12)

MUS = np.zeros(N)
def put(x, t0, g=1.0):
    p = int(t0 * SR); L = min(len(x), N - p)
    if L > 0: MUS[p:p + L] += x[:L] * g

# chord plan: (start, end, root-chord midi notes)
Am = [57, 60, 64]; F = [53, 57, 60]; Cm = [48, 55, 60, 64]; G_ = [55, 59, 62]; Dm = [50, 57, 62, 65]; E_ = [52, 56, 59, 64]
plan = [(0.0, 4.4, Am), (4.4, 9.2, F), (9.2, 14.0, Am), (14.0, 19.3, F), (19.3, 21.0, E_), (21.0, 24.0, Am), (24.0, 27.5, F),
        (27.5, 30.5, Cm), (30.5, 33.0, G_), (33.0, 36.05, Am), (36.05, 40.1, Dm), (40.1, 44.8, Am), (44.8, 48.3, E_),
        (48.3, 53.3, F), (53.3, 56.1, G_), (56.1, N / SR, Cm)]
for a, b, ch in plan:
    for m in ch: put(pad_tone(m, b - a + 0.6), a, 0.05)
# plucked arpeggio from the world scene on (thinned during the question beats)
for a, b, ch in plan:
    if a < 4.4 or (19.3 <= a < 21.0) or a >= 56.1: continue
    t = a
    k = 0
    while t < b - 0.05:
        put(pluck(ch[k % len(ch)] + 12 * (k % 4 == 3)), t, 0.09)
        t += beat / 2; k += 1
# soft pulse (kick) on beats 1 & 3
t = 4.4
while t < 56.0:
    if not (19.3 <= t < 21.0):
        put(kick(), t, 0.35)
    t += beat * 2
# finale: resolution swell + bell on «القدرة»
put(pad_tone(72, 3.0) * np.linspace(0.2, 1, int(3.0 * SR)), ws(137) - 0.4, 0.07)
for m in (72, 76, 79, 84):
    put(pluck(m, 2.0) * 0.9, ws(137) + (m - 72) * 0.012, 0.12)
music = np.stack([MUS, MUS], axis=1)
music[:, 1] = np.roll(MUS, int(0.011 * SR))  # tiny Haas width

# ---------------------------------------------------------------- ducking under the voice (sidechain)
vmono = np.abs(VO).mean(axis=1)
env = lp(vmono, 6, 2); env = env / (np.percentile(env[env > 1e-4], 95) + 1e-9)
duck = 1 - 0.55 * np.clip(env, 0, 1)
music *= duck[:, None]
SFX *= (1 - 0.45 * np.clip(env, 0, 1))[:, None]   # sfx dip gently under words (accents stay in the pauses)
fade = np.ones(N); fl = int(0.6 * SR); fade[-fl:] = np.linspace(1, 0, fl); music *= fade[:, None]; SFX *= fade[:, None]

# ---------------------------------------------------------------- levels & mix
def lufs(x):
    p = subprocess.run([FF, '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True)
    txt = p.stderr.decode('utf-8', 'ignore')
    I = float(txt.split('I:')[-1].split('LUFS')[0]); tp = float(txt.split('Peak:')[-1].split('dBFS')[0])
    return I, tp

vI, vTP = lufs(VO)
mI, _ = lufs(music); sI, _ = lufs(SFX)
music *= db((vI - 21) - mI)   # music bed ~21 LU under the voice
SFX *= db((vI - 9) - sI)      # sfx (sparse) integrated ~9 LU under the voice
mix = VO + music + SFX
_, tp = lufs(mix)
master = db(min(0.0, -1.0 - tp))   # ONE constant gain for the whole mix so true peak <= -1 dBTP
mix *= master
fI, fTP = lufs(mix)

sf.write(os.path.join(HERE, 'sfx_stem.wav'), (SFX * master).astype(np.float32), SR, subtype='FLOAT')
sf.write(os.path.join(HERE, 'music_stem.wav'), (music * master).astype(np.float32), SR, subtype='FLOAT')
sf.write(os.path.join(HERE, 'final_mix.wav'), mix.astype(np.float32), SR, subtype='FLOAT')
rep = {'voice_integrated_LUFS': vI, 'voice_true_peak_dBTP': vTP, 'master_gain_dB': 20 * np.log10(master),
       'final_integrated_LUFS': fI, 'final_true_peak_dBTP': fTP, 'cues': len(C), 'samples': N, 'seconds': N / SR,
       'voice_samples': len(voice), 'note': 'voice samples are the original decode; only the constant master gain above is applied to the whole mix'}
json.dump(rep, open(os.path.join(HERE, 'mix_report.json'), 'w'), indent=1)
print(json.dumps(rep, indent=1))
