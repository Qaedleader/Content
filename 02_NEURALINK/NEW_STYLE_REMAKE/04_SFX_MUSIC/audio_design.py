"""NEURALINK remake — original sound design, music bed and final mix.

- Narration: the APPROVED master (01_AUDIO/narration_original.m4a, a byte copy of 02_NEURALINK/01_AUDIO/Original),
  decoded once. It is never edited, trimmed, stretched or pitch-shifted. The only operation is ONE constant scalar
  master gain on the whole mix, to keep the true peak at or below -1 dBTP.
- All SFX and music are synthesised with the shared Content Studio library (_BRAND_SYSTEM/tools/sfxlib.py).
- Cue times are anchored to the verified word timings (02_TIMING/words.json), the same anchors the Remotion edit uses.
Outputs here (44.1 kHz): sfx_stem.wav, music_stem.wav, final_mix.wav, mix_report.json
"""
import json, os, subprocess, sys
import numpy as np
import soundfile as sf
sys.path.insert(0, r'D:/Content/_BRAND_SYSTEM/tools')
from sfxlib import *  # noqa: F401,F403  (SR, rng, dsp helpers and the sound library)
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
FPS = 30
VIDEO_FRAMES = 2160

VO_SRC = os.path.join(ROOT, '01_AUDIO', 'narration_original.m4a')
VO_WAV = os.path.join(HERE, 'narration_decoded_f32.wav')
if not os.path.exists(VO_WAV):
    subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y', '-i', VO_SRC, '-c:a', 'pcm_f32le', VO_WAV], check=True)
voice, sr = sf.read(VO_WAV, dtype='float64', always_2d=True)
assert sr == SR
N = int(round(VIDEO_FRAMES / FPS * SR))
VO = np.zeros((N, 2)); VO[:min(N, len(voice))] = voice[:N]

WORDS = json.load(open(os.path.join(ROOT, '02_TIMING', 'words.json'), encoding='utf-8'))['words']
ws = lambda i: WORDS[i]['s']
we = lambda i: WORDS[i]['e']
fr = lambda frames: frames / FPS

# ---------------- episode-specific sounds (original synthesis) ----------------
def drawer():
    d = 0.22
    slide = bp(noise(d), 300, 2200) * np.sin(np.pi * np.clip(t_(d) / 0.16, 0, 1)) * 0.6
    thunk = np.zeros(int(d * SR)); k = sweep(220, 90, 0.08, 2) * expd(0.08, 0.02); thunk[int(0.14 * SR):int(0.14 * SR) + len(k)] += k
    return norm(slide + thunk)

def tape_stop(d=0.5):
    t = t_(d); f = 420 * (1 - t / d) ** 2 + 30
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * (1 - t / d) + 0.3 * lp(noise(d), 400) * (1 - t / d))

def record_scratch():
    d = 0.35; t = t_(d); f = 600 + 500 * np.sin(2 * np.pi * 7 * t)
    return norm(bp(noise(d), 700, 4000) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 7 * t))) + 0.4 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * expd(d, 0.2)

def data_blips(n=10, gap=0.06):
    x = np.zeros(int((n * gap + 0.2) * SR))
    for k in range(n):
        f = [880, 1175, 1320, 990, 1480][k % 5]; d = 0.05; t = t_(d)
        b = np.sin(2 * np.pi * f * t) * expd(d, 0.015); p = int(k * gap * SR); x[p:p + len(b)] += b
    return norm(x)

def beeps(n=3, f=1400, gap=0.16):
    x = np.zeros(int((n * gap + 0.1) * SR))
    for k in range(n):
        d = 0.1; t = t_(d); b = np.sign(np.sin(2 * np.pi * f * t)) * 0.4 * np.minimum(1, (d - t) / 0.01); p = int(k * gap * SR); x[p:p + len(b)] += b
    return norm(lp(x, 5000))

def glint():
    d = 0.8; t = t_(d)
    return norm(sum(a * np.sin(2 * np.pi * f * t) * expd(d, 0.25 / (k + 1)) for k, (f, a) in enumerate([(2637, 1), (3951, 0.5), (5274, 0.25)])))

def rattle(n=12, gap=0.05):
    x = np.zeros(int((n * gap + 0.3) * SR))
    for k in range(n):
        c = drawer() * (0.5 + 0.5 * rng.random()); p = int((k * gap + rng.uniform(0, 0.02)) * SR); x[p:p + len(c)] += c[:len(x) - p]
    return norm(x)

def spikes(d=1.4, rate=14):
    x = np.zeros(int(d * SR))
    for _ in range(int(d * rate)):
        p = int(rng.uniform(0, 0.95) * len(x)); c = tick(); x[p:p + len(c)] += c * rng.uniform(0.4, 1)
    return norm(x)

# ---------------- cue sheet (time [s], sound, gain dB, pan) ----------------
C = []
def cue(t, snd, g, pan=0.0): C.append((t, snd, g, pan))

# N1 hook
cue(fr(2), impact(True), -11)
cue(fr(3), rattle(14, 0.045), -19)
for i in range(6): cue(ws(2) - 0.07 + i * 0.1, pop(), -24, (-1) ** i * 0.5)
cue(ws(5) - 0.1, riser(0.5)[::-1], -19)
for k in range(5): cue(ws(6) + k * 0.09, paper_flick(), -21, (-1) ** k * 0.5)
cue(ws(7), glint(), -24, -0.2)
# N2 implant
cue(fr(77), paper_slide(0.35), -16)
cue(ws(12), servo(0.45, 200, 320), -24, -0.3)
cue(ws(13) - 0.1, whoosh(0.4), -18)
cue(ws(15) - 0.13, clank(True), -16)
cue(ws(16) - 0.07, whoosh(0.35), -18)
cue(ws(16) + 0.1, servo(0.6, 300, 520), -25)
cue(ws(18), spikes(1.0, 10), -25)
cue(ws(19) - 0.07, paper_slide(0.3), -17)
cue(ws(20) - 0.05, pop(), -19)
# N3 signals
cue(ws(23) - 0.1, riser(0.6), -25)
cue(ws(26) - 0.07, paper_slide(0.4), -17, -0.4)
cue(ws(27), spikes(1.6, 16), -22)
cue(ws(29), digital(0.5), -21)
# N4 decode / write-back
cue(fr(378), impact(False), -18)
cue(ws(31) + 0.1, ratchet(6, 0.06), -22)
for k in range(3): cue(ws(33) + k * 5 / FPS, pop(), -20, 0.5)
cue(ws(35) - 0.07, whoosh(0.5, up=False), -17)
cue(ws(38), zap(0.45), -20)
cue(ws(37), paper_slide(0.3), -18, 0.5)
# N5 capture & backup
cue(ws(41) - 0.05, paper_slide(0.3), -17)
for w in (43, 46, 49): cue(ws(w) - 0.07, pop(), -18, -0.5)
for w in (43, 46, 49):
    for k in range(3): cue(ws(w) + k * 0.2 + 0.1, paper_flick(), -24, -0.3)
cue(ws(51) - 0.05, tear(0.5), -18)
cue(ws(51) + 0.2, data_blips(14, 0.06), -24)
cue(ws(53), riser(1.0), -22)
cue(ws(57) + 0.45, ding(), -18)
# N6 seven years / wait
cue(ws(58) - 0.05, whoosh(0.4), -18)
for k in range(7): cue(ws(59) + k * 4 / FPS, paper_flick(), -19, (-1) ** k * 0.5)
cue(ws(62) - 0.05, paper_slide(0.35), -17); cue(ws(62) + 0.2, blip(), -21)
cue(ws(67) - 0.03, stamp(), -12); cue(ws(67), tape_stop(0.45), -20)
cue(ws(74) - 0.05, pop(), -17)
# N7 memory retrieval
cue(fr(892), whoosh(0.4), -17)
cue(fr(894), tick_roll(np.arange(0, 0.9, 0.045)), -25)
cue(fr(900), tick_roll(np.cumsum(np.concatenate([np.full(28, 0.035), np.linspace(0.04, 0.16, 10)]))), -21)
cue(fr(900), servo(1.5, 260, 300), -27)
cue(ws(80) - 0.05, clank(True), -17)
cue(ws(81) - 0.12, whoosh(0.4), -18)
cue(ws(83), paper_flick(), -15)
cue(ws(84) - 0.05, ding(), -15)
cue(ws(85), pop(), -18)
# N8 transfer
cue(fr(1080), rattle(18, 0.03), -17); cue(fr(1080), riser(0.8), -21)
cue(ws(95), data_blips(16, 0.07), -24)
cue(ws(99) - 0.05, zap(0.5), -17, 0.4)
cue(ws(101) - 0.07, whoosh(0.4), -18, -0.4)
# N9 clone / joke / copy ≠ transfer
for w in (106, 107): cue(ws(w) - 0.03, pop(), -20)
cue(ws(108) - 0.05, stamp(), -12)
cue(ws(109) - 0.05, record_scratch(), -14)
cue(ws(110) - 0.05, stamp(), -14)
cue(ws(111), scribble(0.6), -19)
cue(ws(114) - 0.07, pop(), -18, -0.4); cue(ws(117) - 0.05, pop(), -18, 0.4)
cue(ws(117) + 0.2, stamp(), -15)
# N10 reality: evidence board
cue(ws(121), tear(0.45), -16)
cue(ws(123) - 0.05, stamp(), -11)
for w in (127, 130, 132): cue(ws(w) - 0.12, impact(False), -17)
cue(ws(130) + 0.1, scribble(0.5), -25)
cue(ws(135) - 0.1, pop(), -18)
cue(ws(137) + 0.13, tick(), -14)
# N11 demonstration
cue(ws(139) - 0.32, impact(False), -21)
cue(ws(143), pop(), -20)
cue(ws(146) - 0.12, whoosh(0.45), -15)
cue(ws(150) - 0.07, stamp(), -11)
# N12 future + joke
cue(ws(153) - 0.05, paper_slide(0.35), -17)
cue(ws(158) - 0.07, stamp(), -14)
cue(ws(162) - 0.05, pop(), -17)
cue(ws(167) - 0.07, paper_slide(0.35), -16)
cue(ws(169) - 0.07, stamp(), -13)
cue(ws(170) - 0.05, data_blips(10, 0.06), -24)
cue(we(172) - 0.02, beeps(2, 1400, 0.12), -26)
# N13 outro
cue(ws(173) - 0.12, pop(), -25); cue(ws(174) - 0.03, pop(), -21)
cue(ws(177) - 0.07, stamp(), -11)
for k in range(8): cue(ws(181) + k * 0.12, drawer(), -30, (-1) ** k * 0.4)
cue(we(186) + 0.05, glint(), -19)
cue(71.25, impact(False), -19)

SFX = np.zeros((N, 2))
for t0, snd, g, pan in C:
    p0 = int(max(0, t0) * SR); x = snd * db(g); L = min(len(x), N - p0)
    if L <= 0: continue
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    SFX[p0:p0 + L, 0] += x[:L] * l * 1.414; SFX[p0:p0 + L, 1] += x[:L] * r * 1.414

# ---------------- original music: curious, minor; lifts to major for "reality"; playful for the joke ----------------
BPM = 92; beat = 60 / BPM
def note_hz(m): return 440 * 2 ** ((m - 69) / 12)
def pad_tone(midi, d):
    t = t_(d); x = sum(signal.sawtooth(2 * np.pi * note_hz(midi) * (1 + det) * t) for det in (-0.004, 0, 0.0045))
    return lp(x, 1000, 2) * np.minimum(1, np.minimum(t / 0.7, (d - t) / 0.9))
def pluck(midi, d=0.5):
    t = t_(d); f = note_hz(midi)
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)) * expd(d, 0.13)
def kick():
    d = 0.35; return sweep(110, 45, d, 3) * expd(d, 0.12)
MUS = np.zeros(N)
def put(x, t0, g=1.0):
    p = int(t0 * SR); L = min(len(x), N - p)
    if L > 0: MUS[p:p + L] += x[:L] * g
Am = [57, 60, 64]; F = [53, 57, 60]; Dm = [50, 57, 62, 65]; E_ = [52, 56, 59, 64]; Cmaj = [48, 55, 60, 64]; G_ = [55, 59, 62]; Em = [52, 55, 59]
plan = [(0.0, 2.5, Am), (2.5, 8.3, F), (8.3, 12.5, Am), (12.5, 17.8, Dm), (17.8, 24.3, F), (24.3, 29.7, E_), (29.7, 35.9, Am),
        (35.9, 41.1, Dm), (41.1, 46.9, E_), (46.9, 54.3, Cmaj), (54.3, 60.2, G_), (60.2, 62.9, Em), (62.9, 66.5, F),
        (66.5, 70.7, G_), (70.7, N / SR, Cmaj)]
for a, b, ch in plan:
    for m in ch: put(pad_tone(m, b - a + 0.7), a, 0.05)
quiet = [(26.8, 27.62), (42.78, 43.5)]   # «لحظة!» and «بمزح!» land in near-silence
for a, b, ch in plan:
    if a < 2.5: continue
    t = a; k = 0
    while t < b - 0.05:
        if not any(q0 <= t < q1 for q0, q1 in quiet):
            put(pluck(ch[k % len(ch)] + 12 * (k % 4 == 3)), t, 0.085)
        t += beat / 2; k += 1
t = 2.5
while t < 70.5:
    if not any(q0 <= t < q1 for q0, q1 in quiet):
        put(kick(), t, 0.32)
    t += beat * 2
for m in (72, 76, 79, 84): put(pluck(m, 2.4), ws(184) + (m - 72) * 0.012, 0.11)
music = np.stack([MUS, np.roll(MUS, int(0.011 * SR))], axis=1)

# ---------------- ducking, levels, mix ----------------
vmono = np.abs(VO).mean(axis=1)
env = lp(vmono, 6, 2); env = env / (np.percentile(env[env > 1e-4], 95) + 1e-9)
music *= (1 - 0.55 * np.clip(env, 0, 1))[:, None]
SFX *= (1 - 0.45 * np.clip(env, 0, 1))[:, None]
fade = np.ones(N); fl = int(0.7 * SR); fade[-fl:] = np.linspace(1, 0, fl); music *= fade[:, None]; SFX *= fade[:, None]

def lufs(x):
    p = subprocess.run([FF, '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True)
    txt = p.stderr.decode('utf-8', 'ignore')
    return float(txt.split('I:')[-1].split('LUFS')[0]), float(txt.split('Peak:')[-1].split('dBFS')[0])

vI, vTP = lufs(VO); mI, _ = lufs(music); sI, _ = lufs(SFX)
music *= db((vI - 21) - mI)
SFX *= db((vI - 9) - sI)
mix = VO + music + SFX
_, tp = lufs(mix)
master = db(min(0.0, -1.0 - tp))
mix *= master
fI, fTP = lufs(mix)
sf.write(os.path.join(HERE, 'sfx_stem.wav'), (SFX * master).astype(np.float32), SR, subtype='FLOAT')
sf.write(os.path.join(HERE, 'music_stem.wav'), (music * master).astype(np.float32), SR, subtype='FLOAT')
sf.write(os.path.join(HERE, 'final_mix.wav'), mix.astype(np.float32), SR, subtype='FLOAT')
rep = {'voice_integrated_LUFS': vI, 'voice_true_peak_dBTP': vTP, 'master_gain_dB': 20 * np.log10(master), 'final_integrated_LUFS': fI,
       'final_true_peak_dBTP': fTP, 'cues': len(C), 'seconds': N / SR, 'voice_samples': len(voice),
       'note': 'voice samples are the original decode; only the constant master gain above is applied to the whole mix'}
json.dump(rep, open(os.path.join(HERE, 'mix_report.json'), 'w'), indent=1)
print(json.dumps(rep, indent=1))
