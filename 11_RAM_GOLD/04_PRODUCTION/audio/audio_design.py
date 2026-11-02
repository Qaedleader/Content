"""RAM_GOLD Video 11 (version A, CINEMATIC) - barely audible original ambient bed, a few very restrained SFX, and the mix.

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
ROOT = os.path.dirname(os.path.dirname(HERE))               # 11_RAM_GOLD
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
FPS, VIDEO_FRAMES = 30, 1549
VO_SRC = os.path.join(ROOT, '01_AUDIO', 'Original', 'RAM GOLD.m4a.mp4')
MUSIC_BELOW_LU = 32.0                                       # target: bed barely audible, ~32 LU under the voice

raw = subprocess.run([FF, '-nostdin', '-v', 'error', '-i', VO_SRC, '-f', 'f32le', '-c:a', 'pcm_f32le', '-'], capture_output=True, check=True).stdout
voice32 = np.frombuffer(raw, np.float32).reshape(-1, 2)
N = int(round(VIDEO_FRAMES / FPS * SR))
assert len(voice32) <= N, (len(voice32), N)
VO = np.zeros((N, 2), np.float64); VO[:len(voice32)] = voice32

WD = json.load(open(os.path.join(ROOT, '02_TIMING', 'words.json'), encoding='utf-8'))['words']
ws = lambda i: WD[i]['s']

# ---------------- SFX cue sheet: (time s, sound, peak dBFS, pan) - few, quiet, purposeful ----------------
def low_hit():                      # restrained low impact (ASML reveal)
    d = 1.6; t = t_(d); f = 52 * np.exp(-t / 1.2) + 34
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * expd(d, 0.45) + 0.15 * lp(noise(d), 300) * expd(d, 0.12))
def pulse(f0=1760):                 # gentle electronic pulse
    d = 0.18; t = t_(d); return norm(np.sin(2 * np.pi * f0 * t) * expd(d, 0.035))
def shimmer(d=1.2):                 # soft airy rise for the EUV light
    t = t_(d); x = sum(np.sin(2 * np.pi * f * t * (1 + 0.02 * t)) for f in (2093, 2637, 3136))
    return norm(x * np.sin(np.pi * t / d) ** 2)
def mech(d=0.5):                    # soft mechanical move (stage motor)
    return servo(d, 180, 260)

SFX_TRIM = 0.0
CUES = []
def cue(t, snd, g, pan=0.0): CUES.append((t, snd, g, pan))
def soft_whoosh(d=0.4): return lp(whoosh(d), 2500)        # dull, airy transition (no bright hiss)
cue(0.00, low_hit(), -40)                          # frame 0: DRAM macro
cue(ws(3), low_hit(), -41)                         # «حرب عالمية»
cue(ws(9) - 0.15, soft_whoosh(), -45, 0.2)         # → your PC
cue(ws(13) - 0.15, soft_whoosh(), -45, -0.2)       # → Altman
cue(ws(21) - 0.15, soft_whoosh(), -45)             # → interpretation
cue(ws(37) - 0.03, shimmer(1.0), -46)              # «الرام» pixel reveal
cue(ws(42), pulse(880), -46)                       # data starts flowing
cue(ws(50) - 0.03, pulse(660), -46)                # DRAM set
cue(ws(56) - 0.03, pulse(990), -46)                # HBM set
cue(ws(62) - 0.15, soft_whoosh(), -45, 0.2)        # → demand
cue(ws(63), low_hit(), -41)                        # «انفجار»
cue(ws(70), tick(), -46)                           # 900,000 counter lands
cue(ws(72) - 0.15, soft_whoosh(), -45, -0.2)       # → fabs
cue(ws(86) - 0.03, pulse(660), -47)                # verbatim quote card
cue(ws(103) - 0.15, soft_whoosh(), -45)            # → prices
for k in (104, 105, 106, 107): cue(ws(k) - 0.06, tick(), -48)   # price bars
cue(ws(118) - 0.15, soft_whoosh(), -45, 0.2)       # → new fabs
cue(ws(127), low_hit(), -42)                       # «لسنوات»
cue(ws(134), shimmer(1.4), -45)                    # gold wipe begins
cue(ws(136) - 0.03, low_hit(), -41)                # «الذهب»
SFX = np.zeros((N, 2))
for t0, snd, g, pan in CUES:
    p0 = int(max(0, t0) * SR); x = norm(snd) * db(g + SFX_TRIM); L = min(len(x), N - p0)
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    SFX[p0:p0 + L, 0] += x[:L] * l * 1.414; SFX[p0:p0 + L, 1] += x[:L] * r * 1.414

# ---------------- original ambient bed (cinematic, low): A minor drones, slow pulse, airy high layer; no drums, no vocals ----------------
def note_hz(m): return 440 * 2 ** ((m - 69) / 12)
MUS = np.zeros(N)
def put(x, t0, g=1.0):
    p = int(t0 * SR); L = min(len(x), N - p)
    if L > 0: MUS[p:p + L] += x[:L] * g
def pad(midis, d):
    t = t_(d); x = sum(np.sin(2 * np.pi * note_hz(m) * (1 + det) * t) for m in midis for det in (-0.004, 0, 0.004))
    return lp(x, 900, 2) * np.minimum(1, np.minimum(t / 2.0, (d - t) / 2.0))
total = N / SR
chords = [[33, 45, 52, 60], [29, 41, 48, 57], [36, 48, 55, 64], [31, 43, 50, 59]]   # Am  F  C  G (cinematic, unresolved)
seg = 6.0; t = 0.0; k = 0
while t < total:
    put(pad(chords[k % 4], seg + 2.5), t, 0.06); t += seg; k += 1
# heartbeat-like sub pulse (very soft), every 1.5 s
tt = 0.6
while tt < total - 1:
    d = 0.5; x = np.sin(2 * np.pi * 49 * t_(d)) * expd(d, 0.12); put(x, tt, 0.18); tt += 1.5
# airy high shimmer layer
air = bp(noise(total), 4000, 9000) * 0.02
MUS[:len(air)] += air[:N]
music = np.stack([MUS, np.roll(MUS, int(0.015 * SR))], axis=1)

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
