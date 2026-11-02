"""Huawei Share NEW VOICE - quiet original music bed, a few restrained SFX, and the mix.

Narration: «Huawei share New Vid.m4a» (byte copy in 01_AUDIO/Original), decoded once to float32. Its samples are
written unchanged to narration_stem.wav and added to the mix at unity gain: no trim, fade, EQ, compression,
normalisation, gain or time change. Only the ADDED layers are shaped:
  - music and SFX are ducked under the voice (envelope follower on the narration),
  - an anti-clip gain on the added layers keeps |voice + added| <= max(0.97, |voice|) at every sample.
All music and SFX are original synthesis from the shared library _BRAND_SYSTEM/tools/sfxlib.py (no samples, no vocals).
Cue times are anchored to 02_TIMING/words_display.json - the same anchors the picture uses.
Outputs (44.1 kHz float32): narration_stem.wav, music_stem.wav, sfx_stem.wav, final_mix.wav, mix_report.json
Run:  python -I audio_design.py"""
import json, os, subprocess, sys
import numpy as np
import soundfile as sf
from scipy import ndimage
sys.path.insert(0, r'D:/Content/_BRAND_SYSTEM/tools')
from sfxlib import *  # noqa: F401,F403
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))               # V2_NEW_VOICE
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
FPS, VIDEO_FRAMES = 30, 1380
VO_SRC = os.path.join(ROOT, '01_AUDIO', 'Original', 'Huawei_share_New_Vid.m4a.mp4')

raw = subprocess.run([FF, '-nostdin', '-v', 'error', '-i', VO_SRC, '-f', 'f32le', '-c:a', 'pcm_f32le', '-'], capture_output=True, check=True).stdout
voice32 = np.frombuffer(raw, np.float32).reshape(-1, 2)
N = int(round(VIDEO_FRAMES / FPS * SR))
assert len(voice32) <= N, (len(voice32), N)
VO = np.zeros((N, 2), np.float64); VO[:len(voice32)] = voice32

WD = json.load(open(os.path.join(ROOT, '02_TIMING', 'words_display.json'), encoding='utf-8'))['tokens']
ws = lambda i: WD[i]['s']

# ---------------- SFX cue sheet: (time s, sound, peak dBFS, pan) - few, quiet, only on key beats ----------------
def rewind(d=0.36):
    t = t_(d); f = 300 + 1500 * (t / d) ** 1.5
    return norm(bp(noise(d), 600, 5000) * 0.6 + 0.4 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.sin(np.pi * t / d)

def soft_ping(f=1318.5):
    d = 0.7; t = t_(d); return norm(np.sin(2 * np.pi * f * t) * expd(d, 0.18) + 0.3 * np.sin(4 * np.pi * f * t) * expd(d, 0.08))

SFX_TRIM = 4.0                                  # global SFX trim (dB) on top of the per-cue levels
C = []
def cue(t, snd, g, pan=0.0): C.append((t, snd, g, pan))
cue(0.64, paper_flick(), -34, 0.3)                 # first fist
cue(4.84, soft_ping(), -36, -0.3)                  # picture arrives («وبتوصل»)
cue(ws(13), rewind(), -31)                         # «لكن لحظة» rewind
cue(ws(13) + 0.52, tick(), -29)                    # freeze
cue(ws(24) - 0.06, paper_slide(0.3), -32)          # into the explanation
cue(ws(30) - 0.05, blip(1175, 1568), -35, -0.3)    # «بيشوفه» viewfinder
cue(ws(38), blip(880, 1318), -33, 0.3)             # gesture recognised
cue(ws(50), pop(), -30, -0.4)                      # «كبس» button
cue(ws(52), whoosh(0.4), -34, 0.4)                 # picture sent
cue(ws(64), pop(), -30, -0.4)                      # «كبسة استقبال»
cue(ws(67) - 0.05, stamp(), -32)                   # system approvals stamp
cue(ws(70), whoosh(0.5), -35)                      # wireless transfer
cue(ws(80) - 0.05, stamp(), -31)                   # ✗ not through the hand
cue(ws(84), whoosh(0.45), -35)                     # wireless again
cue(ws(90), paper_flick(), -31, -0.4); cue(ws(90) + 0.18, paper_flick(), -31, 0.4)   # buttons flip to gestures
cue(ws(93) - 0.06, paper_slide(0.32), -33)         # back to the demo
cue(ws(103), soft_ping(1760), -37)                 # «ماسك الصورة»

SFX = np.zeros((N, 2))
for t0, snd, g, pan in C:
    p0 = int(max(0, t0) * SR); x = norm(snd) * db(g + SFX_TRIM); L = min(len(x), N - p0)
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    SFX[p0:p0 + L, 0] += x[:L] * l * 1.414; SFX[p0:p0 + L, 1] += x[:L] * r * 1.414

# ---------------- original music: light, curious, D major / B minor, 96 BPM, no drums, no vocals ----------------
BPM = 96; beat = 60 / BPM
def note_hz(m): return 440 * 2 ** ((m - 69) / 12)
def pad_tone(midi, d):
    t = t_(d); x = sum(np.sin(2 * np.pi * note_hz(midi) * (1 + det) * t) + 0.25 * np.sin(4 * np.pi * note_hz(midi) * (1 + det) * t)
                       for det in (-0.003, 0, 0.0035))
    return lp(x, 1400, 2) * np.minimum(1, np.minimum(t / 0.8, (d - t) / 0.9))
def pluck(midi, d=0.6):
    t = t_(d); f = note_hz(midi)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) + 0.08 * np.sin(6 * np.pi * f * t)) * expd(d, 0.16)
def shaker():
    d = 0.06; return hp(noise(d), 6000) * expd(d, 0.012)
MUS = np.zeros(N)
def put(x, t0, g=1.0):
    p = int(t0 * SR); L = min(len(x), N - p)
    if L > 0: MUS[p:p + L] += x[:L] * g
D = [50, 57, 62, 66]; Bm = [47, 54, 59, 62]; G = [43, 55, 59, 62]; A = [45, 57, 61, 64]; Em = [40, 55, 59, 64]
plan = [(0.0, ws(13), [D, A, Bm, G]),           # opening demo: bright loop
        (ws(13), ws(24), [Bm, Em]),             # «لحظة»: question, sparser
        (ws(24), ws(66), [G, D, A, Bm]),        # explanation
        (ws(66), ws(92), [D, G, A, D]),         # wireless + clarification
        (ws(92), N / SR, [G, A, D, D])]         # conclusion
bar = beat * 4
for a, b, prog in plan:
    t = a; k = 0
    while t < b - 0.05:
        ch = prog[k % len(prog)]; d = min(bar, b - t)
        for m in ch: put(pad_tone(m + 12, d + 0.6), t, 0.05)
        sparse = (a == ws(13))
        j = 0; tt = t
        while tt < t + d - 0.02:
            if not sparse or j % 2 == 0:
                put(pluck(ch[(j * 2 + k) % len(ch)] + 24, 0.7), tt, 0.07 if j % 4 else 0.09)
            if not sparse: put(shaker(), tt + beat / 2, 0.05)
            tt += beat / 2; j += 1
        t += d; k += 1
music = np.stack([MUS, np.roll(MUS, int(0.012 * SR))], axis=1)

# ---------------- levels: ducking under the voice, then anti-clip on the added layers only ----------------
def lufs(x):
    p = subprocess.run([FF, '-hide_banner', '-nostdin', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True)
    txt = p.stderr.decode('utf-8', 'ignore').split('Summary:')[-1]
    return float(txt.split('I:')[1].split('LUFS')[0]), float(txt.split('Peak:')[1].split('dBFS')[0])

vI, vTP = lufs(VO)
mI, _ = lufs(music)
music *= db((vI - 19) - mI)                                    # bed sits ~19 LU under the voice before ducking
vmono = np.abs(VO).mean(axis=1)
env = lp(vmono, 5, 2); env = np.clip(env / (np.percentile(env[env > 1e-4], 90) + 1e-9), 0, 1)
env = ndimage.maximum_filter1d(env, int(0.25 * SR))           # hold the duck through short gaps between words
duck_m = 1 - 0.5 * env                                         # up to -6 dB on the bed under speech
duck_s = 1 - 0.35 * env
music *= duck_m[:, None]; SFX *= duck_s[:, None]
fade = np.ones(N); fl = int(0.8 * SR); fade[-fl:] = np.linspace(1, 0, fl); music *= fade[:, None]
fi = int(0.25 * SR); music[:fi] *= np.linspace(0, 1, fi)[:, None]

added = music + SFX
head = np.clip(0.97 - np.abs(VO), 0, None)
g = np.where(np.abs(added) > 1e-12, np.minimum(1.0, head / np.maximum(np.abs(added), 1e-12)), 1.0).min(axis=1)
g = ndimage.minimum_filter1d(g, int(0.01 * SR))               # look-around so the gain moves smoothly
g = np.minimum(g, ndimage.uniform_filter1d(g, int(0.004 * SR)))
music *= g[:, None]; SFX *= g[:, None]

narr = VO.astype(np.float32)                                  # identical samples to the decode
music32 = music.astype(np.float32); sfx32 = SFX.astype(np.float32)
mix32 = narr + music32 + sfx32                                # float32 sum; narration carried at unity
over = np.abs(mix32) > np.maximum(0.97, np.abs(narr)) + 1e-6
fI, fTP = lufs(mix32); mI2, _ = lufs(music32); sI2, sTP = lufs(sfx32)

sf.write(os.path.join(HERE, 'narration_stem.wav'), narr, SR, subtype='FLOAT')
sf.write(os.path.join(HERE, 'music_stem.wav'), music32, SR, subtype='FLOAT')
sf.write(os.path.join(HERE, 'sfx_stem.wav'), sfx32, SR, subtype='FLOAT')
sf.write(os.path.join(HERE, 'final_mix.wav'), mix32, SR, subtype='FLOAT')
rep = {'voice_integrated_LUFS': vI, 'voice_true_peak_dBTP': vTP, 'music_integrated_LUFS': mI2, 'sfx_integrated_LUFS': sI2,
       'sfx_true_peak_dBTP': sTP, 'mix_integrated_LUFS': fI, 'mix_true_peak_dBTP': fTP,
       'music_below_voice_LU': vI - mI2, 'voice_sample_peak': float(np.abs(narr).max()), 'mix_sample_peak': float(np.abs(mix32).max()),
       'samples_where_added_layers_exceed_ceiling': int(over.sum()), 'anticlip_min_gain': float(g.min()),
       'sfx_cues': len(C), 'seconds': N / SR, 'voice_samples': int(len(voice32)),
       'note': 'narration samples = original decode at unity gain; only music/SFX are ducked and gain-limited'}
json.dump(rep, open(os.path.join(HERE, 'mix_report.json'), 'w'), indent=1)
print(json.dumps(rep, indent=1))
