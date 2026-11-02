"""Millionaire x AI Video 12 (Version 1, COMPLETE MIX) - subtle original music bed, a few very restrained SFX, and the mix.

Narration: RAM GOLD.m4a.mp4 (byte copy in 01_AUDIO/Original), decoded once to float32. Its samples are written unchanged to
narration_stem.wav and added to the mix at unity gain: no trim, fade, EQ, compression, normalisation, gain or time change.
Only the ADDED layers are shaped:
  - music and SFX are ducked under the voice (envelope follower on the narration),
  - an anti-clip gain on the added layers keeps |voice + added| <= max(0.97, |voice|) at every sample.
All music and SFX are original synthesis (numpy + the shared library _BRAND_SYSTEM/tools/sfxlib.py): no samples, no
third-party recordings, so there is nothing to license. Cue times use 02_TIMING/words.json (same anchors as the picture).
Outputs (44.1 kHz float32): narration_stem.wav, music_stem.wav, sfx_stem.wav, final_mix.wav, mix_report.json
Run:  python -I audio_design.py"""
import json, os, subprocess, sys
import numpy as np
import soundfile as sf
from scipy import ndimage
sys.path.insert(0, r'D:/Content/_BRAND_SYSTEM/tools')
from sfxlib import *  # noqa: F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))               # 12_How_tobe_millionare_with_ai
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
FPS, VIDEO_FRAMES = 30, 1467
VO_SRC = os.path.join(ROOT, '01_AUDIO', 'Original', 'How to be millionaire with Ai.m4a.mp4')
MUSIC_BELOW_LU = 25.0                                       # brief: bed ~22-28 dB under the voice -> 25 LU

raw = subprocess.run([FF, '-nostdin', '-v', 'error', '-i', VO_SRC, '-f', 'f32le', '-c:a', 'pcm_f32le', '-'], capture_output=True, check=True).stdout
voice32 = np.frombuffer(raw, np.float32).reshape(-1, 2)
N = int(round(VIDEO_FRAMES / FPS * SR))
assert len(voice32) <= N, (len(voice32), N)
VO = np.zeros((N, 2), np.float64); VO[:len(voice32)] = voice32

WD = json.load(open(os.path.join(ROOT, '02_TIMING', 'words.json'), encoding='utf-8'))['words']
ws = lambda i: WD[i]['s']

# ---------------- SFX cue sheet: (time s, sound, peak dBFS, pan) - few, quiet, purposeful ----------------
def low_hit():                      # restrained low impact
    d = 1.6; t = t_(d); f = 52 * np.exp(-t / 1.2) + 34
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * expd(d, 0.45) + 0.15 * lp(noise(d), 300) * expd(d, 0.12))
def pulse(f0=1760):                 # gentle electronic pulse
    d = 0.18; t = t_(d); return norm(np.sin(2 * np.pi * f0 * t) * expd(d, 0.035))
def shimmer(d=1.2):                 # soft airy rise
    t = t_(d); x = sum(np.sin(2 * np.pi * f * t * (1 + 0.02 * t)) for f in (2093, 2637, 3136))
    return norm(x * np.sin(np.pi * t / d) ** 2)
def coin():                         # soft metallic "deposit" tick (two partials, fast decay)
    d = 0.22; t = t_(d); return norm((np.sin(2 * np.pi * 2637 * t) + 0.6 * np.sin(2 * np.pi * 3951 * t)) * expd(d, 0.05))
def soft_whoosh(d=0.4): return lp(whoosh(d), 2500)
SFX_TRIM = 0.0
CUES = []
def cue(t, snd, g, pan=0.0): CUES.append((t, snd, g, pan))
cue(0.00, low_hit(), -40)                          # frame 0: the million
cue(ws(2), shimmer(0.9), -46)                      # «مليونير؟» shine
cue(ws(6), pulse(990), -46)                        # 99%
cue(ws(10) - 0.15, soft_whoosh(), -45, 0.2)        # → dashboard
cue(ws(16), pulse(1320), -46)                      # $500
for k in range(6): cue(ws(18) + k * 0.2, coin(), -50, 0.3 - k * 0.1)   # monthly deposits
cue(ws(20) - 0.15, soft_whoosh(), -45, -0.2)       # → NYSE
cue(ws(23), low_hit(), -42)                        # S&P 500
cue(ws(25) - 0.15, soft_whoosh(), -45)             # → projection
cue(ws(33) + 0.2, shimmer(1.0), -46)               # crosses $1M
cue(ws(40), pulse(880), -47)                       # ≈10 %
cue(ws(44), low_hit(), -41)                        # «مشكلة» (the drop)
cue(ws(50), low_hit(), -43)                        # «30 سنة؟»
cue(ws(56), soft_whoosh(0.5), -45, 0.2)            # the shortcut path
cue(ws(61) - 0.05, shimmer(1.4), -45)              # AI pixel reveal
cue(ws(64), low_hit(), -41)                        # «الذكاء الاصطناعي»
cue(ws(66) - 0.15, soft_whoosh(), -45, -0.2)       # → masters
cue(ws(75), low_hit(), -43)                        # «أسياد المستقبل»
for k in (77, 78, 79, 80, 81, 83, 85): cue(ws(k) - 0.04, tick(), -48, (k % 3 - 1) * 0.3)   # seven fields
cue(ws(88), pulse(660), -46)                       # «أي إشي» mosaic
cue(ws(93), pulse(1320), -47)                      # «لحالك»
cue(ws(96), low_hit(), -42)                        # «شركة كاملة»
cue(ws(98) - 0.15, soft_whoosh(), -45)             # → the secret (paper)
cue(ws(100) + 0.1, tick(), -47)                    # cross
cue(ws(106), pulse(1760), -47)                     # check
cue(ws(114) + 0.4, pulse(1320), -46)               # follow tap
cue(ws(117), shimmer(1.0), -46)                    # the series
cue(ws(127) - 0.15, soft_whoosh(), -45, 0.2)       # → comment
SFX = np.zeros((N, 2))
for t0, snd, g, pan in CUES:
    p0 = int(max(0, t0) * SR); x = norm(snd) * db(g + SFX_TRIM); L = min(len(x), N - p0)
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    SFX[p0:p0 + L, 0] += x[:L] * l * 1.414; SFX[p0:p0 + L, 1] += x[:L] * r * 1.414

# ---------------- original music bed: calm, modern, warm (F - Am - Dm - C), soft pluck pulse; darker during the 30-year problem,
# a cool arpeggio layer from the AI reveal on. No drums, no vocals, no samples.
def note_hz(m): return 440 * 2 ** ((m - 69) / 12)
MUS = np.zeros(N)
def put(x, t0, g=1.0):
    p = int(t0 * SR); L = min(len(x), N - p)
    if L > 0: MUS[p:p + L] += x[:L] * g
def pad(midis, d):
    t = t_(d); x = sum(np.sin(2 * np.pi * note_hz(m) * (1 + det) * t) for m in midis for det in (-0.004, 0, 0.004))
    return lp(x, 1100, 2) * np.minimum(1, np.minimum(t / 1.5, (d - t) / 1.5))
def pluck(m, d=0.6):
    t = t_(d); return np.sin(2 * np.pi * note_hz(m) * t) * expd(d, 0.12) * (1 + 0.3 * np.sin(2 * np.pi * note_hz(m) * 2 * t))
total = N / SR
T_PROB, T_AI = ws(42), ws(61)
chords = [[41, 53, 57, 60, 64], [45, 52, 57, 60, 67], [38, 50, 57, 60, 65], [36, 48, 55, 60, 64]]   # Fmaj7 Am7 Dm9 Cadd9
dark = [[38, 50, 53, 57], [34, 46, 53, 58]]                                                          # Dm  Bb (the problem)
seg = 4.0; t = 0.0; k = 0
while t < total:
    ch = dark[k % 2] if T_PROB - 0.5 <= t < T_AI - 2 else chords[k % 4]
    put(pad(ch, seg + 2.0), t, 0.055); t += seg; k += 1
# soft pluck pulse on eighths (0.375 s) except during the problem
tt = 0.0; i = 0
while tt < total - 0.5:
    if not (T_PROB <= tt < T_AI - 1.0):
        bar = int(tt // seg) % 4; root = [65, 69, 62, 60][bar]
        put(pluck(root + [0, 7, 12, 7][i % 4]), tt, 0.035)
    tt += 0.375; i += 1
# AI layer: cool high arpeggio from the reveal on
tt = T_AI; i = 0
while tt < total - 0.5:
    put(pluck([84, 88, 91, 93][i % 4], 0.4), tt, 0.018 * min(1, (tt - T_AI) / 2)); tt += 0.1875; i += 1
music = np.stack([MUS, np.roll(MUS, int(0.012 * SR))], axis=1)

# ---------------- levels ----------------
def lufs(x):
    p = subprocess.run([FF, '-hide_banner', '-nostdin', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True)
    txt = p.stderr.decode('utf-8', 'ignore').split('Summary:')[-1]
    return float(txt.split('I:')[1].split('LUFS')[0]), float(txt.split('Peak:')[1].split('dBFS')[0])

vI, vTP = lufs(VO)
mI, _ = lufs(music)
music *= db((vI - (MUSIC_BELOW_LU - 4)) - mI)        # pre-duck level; ducking brings the integrated gap to ~target
vmono = np.abs(VO).mean(axis=1)
env = lp(vmono, 5, 2); env = np.clip(env / (np.percentile(env[env > 1e-4], 90) + 1e-9), 0, 1)
env = ndimage.maximum_filter1d(env, int(0.25 * SR))
music *= (1 - 0.5 * env)[:, None]; SFX *= (1 - 0.35 * env)[:, None]
fade = np.ones(N); fl = int(1.0 * SR); fade[-fl:] = np.linspace(1, 0, fl); music *= fade[:, None]
fi = int(0.4 * SR); music[:fi] *= np.linspace(0, 1, fi)[:, None]
# final trim so the measured gap equals the target
mI1, _ = lufs(music); music *= db((vI - MUSIC_BELOW_LU) - mI1)

added = music + SFX
head = np.clip(0.97 - np.abs(VO), 0, None)
g = np.where(np.abs(added) > 1e-12, np.minimum(1.0, head / np.maximum(np.abs(added), 1e-12)), 1.0).min(axis=1)
g = ndimage.minimum_filter1d(g, int(0.01 * SR))
g = np.minimum(g, ndimage.uniform_filter1d(g, int(0.004 * SR)))
music *= g[:, None]; SFX *= g[:, None]

narr = VO.astype(np.float32)
music32 = music.astype(np.float32); sfx32 = SFX.astype(np.float32)
mix32 = narr + music32 + sfx32
over = np.abs(mix32) > np.maximum(0.97, np.abs(narr)) + 1e-6
fI, fTP = lufs(mix32); mI2, _ = lufs(music32); sI2, sTP = lufs(sfx32)

sf.write(os.path.join(HERE, 'narration_stem.wav'), narr, SR, subtype='FLOAT')
sf.write(os.path.join(HERE, 'music_stem.wav'), music32, SR, subtype='FLOAT')
sf.write(os.path.join(HERE, 'sfx_stem.wav'), sfx32, SR, subtype='FLOAT')
sf.write(os.path.join(HERE, 'final_mix.wav'), mix32, SR, subtype='FLOAT')
rep = {'voice_integrated_LUFS': vI, 'voice_true_peak_dBTP': vTP, 'music_integrated_LUFS': mI2, 'sfx_integrated_LUFS': sI2,
       'sfx_true_peak_dBTP': sTP, 'mix_integrated_LUFS': fI, 'mix_true_peak_dBTP': fTP,
       'music_below_voice_LU': vI - mI2, 'sfx_below_voice_LU': vI - sI2, 'voice_sample_peak': float(np.abs(narr).max()),
       'mix_sample_peak': float(np.abs(mix32).max()), 'samples_where_added_layers_exceed_ceiling': int(over.sum()),
       'anticlip_min_gain': float(g.min()), 'sfx_cues': len(CUES), 'seconds': N / SR, 'voice_samples': int(len(voice32)),
       'note': 'narration samples = original decode at unity gain; only music/SFX are ducked and gain-limited'}
json.dump(rep, open(os.path.join(HERE, 'mix_report.json'), 'w'), indent=1)
print(json.dumps(rep, indent=1))
