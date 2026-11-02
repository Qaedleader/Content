"""Instagram Algorithm Video 8 - very quiet original ambient bed, a few restrained SFX, and the mix.

Narration: "Instagram algorithm.m4a.mp4" (byte copy in 01_AUDIO/Original), decoded once to float32. Its samples are written
unchanged to narration_stem.wav and added to the mix at unity gain: no trim, fade, EQ, compression, normalisation, gain or
time change. Only the ADDED layers are shaped:
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
ROOT = os.path.dirname(os.path.dirname(HERE))               # 8_Instagram_Algorotim
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
FPS, VIDEO_FRAMES = 30, 1442
VO_SRC = os.path.join(ROOT, '01_AUDIO', 'Original', 'Instagram algorithm.m4a.mp4')
MUSIC_BELOW_LU = 32.0                                       # brief: music ~30-35 dB under the narration
SFX_BELOW_LU_MIN = 34.0                                     # SFX layer kept at least this far under the voice

raw = subprocess.run([FF, '-nostdin', '-v', 'error', '-i', VO_SRC, '-f', 'f32le', '-c:a', 'pcm_f32le', '-'], capture_output=True, check=True).stdout
voice32 = np.frombuffer(raw, np.float32).reshape(-1, 2)
N = int(round(VIDEO_FRAMES / FPS * SR))
assert len(voice32) <= N, (len(voice32), N)
VO = np.zeros((N, 2), np.float64); VO[:len(voice32)] = voice32

WD = json.load(open(os.path.join(ROOT, '02_TIMING', 'words.json'), encoding='utf-8'))['words']
ws = lambda i: WD[i]['s']

# ---------------- SFX cue sheet: (time s, sound, peak dBFS, pan) - few, very quiet, purposeful ----------------
def soft_low(d=1.8):                # restrained low swell (no impact transient)
    t = t_(d); x = np.sin(2 * np.pi * (46 + 6 * np.exp(-t)) * t) * np.sin(np.pi * np.minimum(t / d, 1)) ** 1.5
    return norm(x + 0.1 * lp(noise(d), 220) * np.sin(np.pi * t / d))
def pulse(f0=1760):                 # gentle data pulse
    d = 0.16; t = t_(d); return norm(np.sin(2 * np.pi * f0 * t) * expd(d, 0.03))
def shimmer(d=1.2, base=(1568, 2093, 2637)):
    t = t_(d); x = sum(np.sin(2 * np.pi * f * t * (1 + 0.015 * t)) for f in base)
    return norm(x * np.sin(np.pi * t / d) ** 2)
def rain(d):                        # soft rain bed for the café (filtered noise with sparse drops)
    x = bp(noise(d), 900, 6500) * 0.5 + hp(noise(d), 5000) * 0.2
    drops = np.zeros(len(x)); n = int(0.007 * SR)
    for i in rng.integers(0, len(x) - n, int(d * 28)):
        drops[i:i + n] += np.sin(2 * np.pi * rng.uniform(2500, 4500) * t_(n / SR)) * expd(n / SR, 0.002) * rng.uniform(0.3, 1)
    tt = t_(d); env = np.minimum(1, np.minimum(tt / 0.4, (d - tt) / 0.6))
    return norm((x + drops * 0.6) * env)
def keys(n=5, gap=0.11):            # light key taps (search box)
    out = np.zeros(int((n * gap + 0.1) * SR))
    for k in range(n):
        p = int(k * gap * SR); x = hp(noise(0.03), 2500) * expd(0.03, 0.006); out[p:p + len(x)] += x * (0.7 + 0.3 * rng.random())
    return norm(out)

CUES = []
def cue(t, snd, g, pan=0.0): CUES.append((t, snd, g, pan))
cue(ws(3) - 0.03, tick(), -44)                     # «بقرأ»: scroll freezes
cue(ws(11) - 0.15, paper_flick(), -42)             # calendar page flips to «بكرا»
cue(ws(18), rain(ws(25) - ws(18) + 0.6), -44)      # night rain (café scene)
cue(ws(22) + 0.2, paper_slide(0.3), -46)           # café becomes a feed card
cue(ws(25) + 0.33, pulse(1318), -46, 0.4)          # slot 1 filled
cue(ws(28) + 0.33, pulse(1568), -46, 0.0)          # slot 2 filled
cue(ws(30) + 0.55, pulse(1760), -46, -0.4)         # slot 3 filled
cue(ws(35) - 0.15, keys(5, 0.09), -46)             # typing «السفر» (empty history)
cue(ws(36), shimmer(1.0, (1318, 1760, 2093)), -45)  # night → morning
cue(ws(40) + 0.05, shimmer(1.3), -42)              # the recommended reel
cue(ws(47) + 0.2, pulse(1046), -45)                # last night's videos connect
for k, i in enumerate((52, 56, 59)):               # pause / replay / skip signals
    cue(ws(i) - 0.03, pulse((1175, 1397, 1661)[k]), -45, (-0.3, 0.0, 0.3)[k])
cue(ws(63) - 0.05, shimmer(0.9, (2093, 2637, 3136)), -46)   # «إشارات»
cue(ws(69) + 0.2, pulse(880), -46)                 # wired into the model
cue(ws(72) - 0.12, shimmer(1.6, (1046, 1568, 2093)), -45)   # zoom out into millions of patterns
cue(ws(77) - 0.03, pulse(1568), -46)               # similar patterns light up
cue(ws(89) - 0.07, tick(), -45)                    # re-rank: Europe to #1
for i in (96, 97, 98):                             # montage labels
    cue(ws(i) - 0.04, tick(), -47)
cue(ws(104) - 0.2, soft_low(1.8), -40)             # «الأخطر»
cue(ws(114) - 0.1, soft_low(2.0), -38)             # the loop closes

SFX = np.zeros((N, 2))
for t0, snd, g, pan in CUES:
    p0 = int(max(0, t0) * SR); x = norm(snd) * db(g); L = min(len(x), N - p0)
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    SFX[p0:p0 + L, 0] += x[:L] * l * 1.414; SFX[p0:p0 + L, 1] += x[:L] * r * 1.414

# ---------------- original ambient bed: A-minor mystery drones, slow airy layer; no drums, no beats ----------------
def note_hz(m): return 440 * 2 ** ((m - 69) / 12)
MUS = np.zeros(N)
def put(x, t0, g=1.0):
    p = int(t0 * SR); L = min(len(x), N - p)
    if L > 0: MUS[p:p + L] += x[:L] * g
def pad(midis, d):
    t = t_(d); x = sum(np.sin(2 * np.pi * note_hz(m) * (1 + det) * t) for m in midis for det in (-0.004, 0, 0.004))
    return lp(x, 850, 2) * np.minimum(1, np.minimum(t / 2.2, (d - t) / 2.2))
total = N / SR
chords = [[45, 57, 64, 72], [41, 53, 60, 69], [43, 55, 62, 71], [40, 52, 59, 67]]   # Am  F  G  Em
seg = 6.0; t = 0.0; k = 0
while t < total:
    put(pad(chords[k % 4], seg + 2.5), t, 0.06); t += seg; k += 1
tt = 1.5                                                   # soft high bell motif every 3 s (the "signal" idea)
while tt < total - 1:
    d = 1.4; x = np.sin(2 * np.pi * note_hz(81 + (0, 3, 7, 5)[int(tt / 3) % 4]) * t_(d)) * expd(d, 0.5); put(x, tt, 0.012); tt += 3.0
air = bp(noise(total), 4000, 9000) * 0.015
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
music *= db((vI - (MUSIC_BELOW_LU - 4)) - mI)
vmono = np.abs(VO).mean(axis=1)
env = lp(vmono, 5, 2); env = np.clip(env / (np.percentile(env[env > 1e-4], 90) + 1e-9), 0, 1)
env = ndimage.maximum_filter1d(env, int(0.25 * SR))
music *= (1 - 0.5 * env)[:, None]; SFX *= (1 - 0.35 * env)[:, None]
fade = np.ones(N); fl = int(1.0 * SR); fade[-fl:] = np.linspace(1, 0, fl); music *= fade[:, None]
fi = int(0.4 * SR); music[:fi] *= np.linspace(0, 1, fi)[:, None]
mI1, _ = lufs(music); music *= db((vI - MUSIC_BELOW_LU) - mI1)
sI1, _ = lufs(SFX)
if vI - sI1 < SFX_BELOW_LU_MIN: SFX *= db((vI - SFX_BELOW_LU_MIN) - sI1)

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
