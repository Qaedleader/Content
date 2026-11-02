"""Original score (4 phases) + synthesized SFX, ducked under the untouched narration.
Everything here is generated from scratch with numpy (no third-party samples) -> no licensing encumbrance.
Outputs: audio/music_stem.wav, audio/sfx_stem.wav, audio/vo_mix_copy.wav, audio/final_mix.wav (48 kHz stereo float)."""
import os, sys, json, subprocess, numpy as np, soundfile as sf
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, 'audio')
SR = 48000; DUR = 79.11; N = int(round(DUR * SR))
rng = np.random.default_rng(2026)

# ---------- narration: decode a mixing copy (original file is never modified) ----------
vo_copy = os.path.join(A, 'vo_mix_copy.wav')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(A, 'voiceover_ORIGINAL.m4a'), '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_f32le', vo_copy], check=True)
vo, _ = sf.read(vo_copy, dtype='float32')
vo = np.pad(vo, ((0, max(0, N - len(vo))), (0, 0)))[:N]

def t_axis(n): return np.arange(n) / SR
def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    # vectorised via lfilter-like recursion in chunks
    from scipy.signal import lfilter
    return lfilter([1 - a], [1, -a], x, axis=0)
def lp(x, fc, order=2):
    from scipy.signal import butter, sosfilt
    return sosfilt(butter(order, fc, 'low', fs=SR, output='sos'), x, axis=0)
def hp(x, fc, order=2):
    from scipy.signal import butter, sosfilt
    return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x, axis=0)
def bp(x, lo, hi, order=2):
    from scipy.signal import butter, sosfilt
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x, axis=0)
def adsr(n, a, d, s, r, sus_len=None):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    sl = max(0, n - a - d - r) if sus_len is None else int(sus_len * SR)
    e = np.concatenate([np.linspace(0, 1, max(a, 1)), np.linspace(1, s, max(d, 1)), np.full(sl, s), np.linspace(s, 0, max(r, 1))])
    return np.pad(e, (0, max(0, n - len(e))))[:n]
def place(buf, sig, t0, gain=1.0, pan=0.0):
    i = int(round(t0 * SR))
    if i >= len(buf): return
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l * 1.414, sig * r * 1.414], 1)
    j = min(len(buf), i + len(sig)); s0 = max(0, -i)
    buf[max(i, 0):j] += sig[s0:j - i] * gain
def hz(midi): return 440.0 * 2 ** ((midi - 69) / 12)

def reverb(x, secs=2.6, mix=0.25, pre=0.02):
    from scipy.signal import fftconvolve
    n = int(secs * SR); t = t_axis(n)
    ir = np.stack([rng.normal(0, 1, n), rng.normal(0, 1, n)], 1) * np.exp(-t * 6.9 / secs)[:, None]
    ir = lp(ir, 6000); ir[:int(pre * SR)] = 0; ir /= np.sqrt((ir ** 2).sum(0))
    wet = np.stack([fftconvolve(x[:, k], ir[:, k])[:len(x)] for k in range(2)], 1)
    return x * (1 - mix) + wet * mix * 2.0

# ---------- instruments ----------
def saw_pad(freqs, dur, bright=1800, attack=1.2, release=1.4):
    n = int(dur * SR); t = t_axis(n); out = np.zeros((n, 2))
    for f in freqs:
        for k, det in enumerate((-0.11, 0.0, 0.13)):
            ff = f * 2 ** (det / 12); ph = rng.uniform(0, 1)
            s = 2 * ((t * ff + ph) % 1.0) - 1
            pan = (-0.6, 0.0, 0.6)[k]
            out[:, 0] += s * np.cos((pan + 1) * np.pi / 4); out[:, 1] += s * np.sin((pan + 1) * np.pi / 4)
    out = lp(out, bright, 2) * adsr(n, attack, 0.5, 0.85, release)[:, None]
    return out / (len(freqs) * 3)

def pluck(f, dur=0.6, bright=1.0):
    n = int(dur * SR); t = t_axis(n)
    s = sum((0.6 ** k) * np.sin(2 * np.pi * f * (k + 1) * t) * np.exp(-t * (6 + 5 * k) / bright) for k in range(5))
    return s * np.minimum(1, t / 0.003)

def piano(f, dur=2.5):
    n = int(dur * SR); t = t_axis(n)
    s = np.zeros(n)
    for k in range(1, 8):
        fk = f * k * np.sqrt(1 + 0.0004 * k * k)
        s += (0.55 ** (k - 1)) * np.sin(2 * np.pi * fk * t) * np.exp(-t * (1.4 + 0.9 * k))
    return s * np.minimum(1, t / 0.004) * 0.6

def kick(dur=0.45):
    n = int(dur * SR); t = t_axis(n)
    f = 45 + 95 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7.5) + 0.15 * rng.normal(0, 1, n) * np.exp(-t * 90)

def hat(dur=0.07):
    n = int(dur * SR); return hp(rng.normal(0, 1, n), 7000, 2) * np.exp(-t_axis(n) * 70)

def sub_boom(dur=2.2, f0=52):
    n = int(dur * SR); t = t_axis(n)
    f = f0 + 40 * np.exp(-t * 6); ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 2.2)
    crack = lp(rng.normal(0, 1, n), 1800) * np.exp(-t * 18) * 0.5
    return body + crack

def whoosh(dur=0.9, up=True, peak=0.6):
    n = int(dur * SR); t = t_axis(n); x = rng.normal(0, 1, n)
    out = np.zeros(n); seg = 2400
    for i in range(0, n, seg):
        u = i / n; fc = 300 + 4500 * (u if up else 1 - u) ** 1.5
        out[i:i + seg] = bp(x[i:i + seg + 0], max(80, fc * 0.6), min(18000, fc * 1.6), 1)[:len(out[i:i + seg])]
    env = np.where(t < dur * peak, (t / (dur * peak)) ** 2, np.exp(-(t - dur * peak) * 9))
    return lp(out * env, 9000)

def riser(dur=1.0):
    n = int(dur * SR); t = t_axis(n)
    f = 200 * 2 ** (3 * t / dur); ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph) * 0.3 + bp(rng.normal(0, 1, n), 1500, 9000) * (t / dur) * 0.7
    return tone * (t / dur) ** 2

def gas_hiss(dur=1.0, bright=1.0):
    n = int(dur * SR); t = t_axis(n)
    x = bp(rng.normal(0, 1, n), 1800 * bright, 14000, 2) + 0.4 * lp(rng.normal(0, 1, n), 500)
    return x * adsr(n, 0.015, 0.12, 0.75, 0.25)

def fan_whirr(dur, spin_up=0.9, blade_hz=210):
    n = int(dur * SR); t = t_axis(n)
    ramp = np.clip(t / spin_up, 0, 1) ** 1.5
    f = blade_hz * ramp + 20; ph = 2 * np.pi * np.cumsum(f) / SR
    tone = 0.35 * np.sin(ph) + 0.15 * np.sin(2 * ph)
    air = bp(rng.normal(0, 1, n), 300, 4000) * (0.5 + 0.5 * np.sin(ph / 7) ** 2)
    return (tone + air) * ramp * adsr(n, 0.2, 0.1, 1.0, 0.3)

def suction(dur):
    n = int(dur * SR); t = t_axis(n)
    x = bp(rng.normal(0, 1, n), 600, 5000, 2) * (0.8 + 0.2 * np.sin(2 * np.pi * 3.1 * t))
    hum = 0.2 * np.sin(2 * np.pi * 118 * t) + 0.1 * np.sin(2 * np.pi * 236 * t)
    return (x + hum) * adsr(n, 0.25, 0.1, 1.0, 0.35)

def tick(f=2400, dur=0.035):
    n = int(dur * SR); t = t_axis(n); return np.sin(2 * np.pi * f * t) * np.exp(-t * 160)

# ================== MUSIC ==================
music = np.zeros((N, 2))
BAR = 2.4  # 100 bpm, 4/4
Dm, Bb, F, C, Gm, A7 = [62, 65, 69], [58, 62, 65], [57, 60, 65], [55, 60, 64], [55, 58, 62], [57, 61, 64]

# PHASE A (0-5.84): immediate impact, tense, then silence on the freeze
place(music, sub_boom(2.6, 46) * 0.55, 0.00)
tension = saw_pad([hz(50), hz(62), hz(69), hz(74)], 4.4, bright=1400, attack=0.25, release=0.3)
place(music, tension * 0.30, 0.02)
for tt, g in ((1.52, 0.33), (2.22, 0.33), (2.94, 0.45)):
    place(music, kick() * g, tt); place(music, sub_boom(1.2, 55) * g * 0.6, tt)
place(music, riser(0.5)[::-1] * 0.0 + whoosh(0.5, True, 0.95) * 0.18, 3.98)
place(music, sub_boom(2.4, 41) * 0.62, 4.48)  # "كيف؟!" hit, then air
# PHASE B (5.84-30.0): minimal technical underscore
prog_B = [Dm, Bb, F, C]
tb = 5.84; i = 0
while tb < 30.0:
    ch = prog_B[i % 4]; dur = min(BAR, 30.0 - tb) + 1.0
    place(music, saw_pad([hz(n - 12) for n in ch] + [hz(ch[0] - 24)], dur, bright=900, attack=0.8, release=1.0) * 0.32, tb)
    # 8th-note pluck arpeggio, very soft
    arp = [ch[0], ch[1], ch[2], ch[1] + 12, ch[2], ch[1], ch[0] + 12, ch[2]]
    for k, note in enumerate(arp):
        tt = tb + k * BAR / 8
        if tt < 30.0: place(music, pluck(hz(note), 0.5) * 0.085, tt, pan=0.35 * float(np.sin(k)))
    if i % 2 == 0: place(music, sub_boom(1.0, 37) * 0.12, tb)
    tb += BAR; i += 1
# little lift at SpaceX
place(music, saw_pad([hz(74), hz(81)], 3.0, bright=2500, attack=0.9) * 0.10, 25.06)
# PHASE C (30.0-71.32): controlled rise
tb = 30.0; i = 0
prog_C = [Dm, Bb, F, C]
while tb < 71.32:
    ch = prog_C[i % 4]; dur = min(BAR, 71.32 - tb) + 0.8
    intensity = 0.75 if tb < 37 else (1.0 if tb < 57.46 else 0.7)
    place(music, saw_pad([hz(n - 12) for n in ch], dur, bright=1300 + 600 * intensity, attack=0.4, release=0.8) * 0.26 * intensity, tb)
    for b in range(4):
        tt = tb + b * BAR / 4
        if tt >= 71.32: break
        if not (39.3 < tt < 40.4):
            place(music, kick() * 0.30 * intensity, tt)
        place(music, hat() * 0.06 * intensity, tt + BAR / 8, pan=0.3)
        bass = np.sin(2 * np.pi * hz(ch[0] - 24) * t_axis(int(0.28 * SR))) * adsr(int(0.28 * SR), 0.005, 0.1, 0.6, 0.1)
        place(music, bass * 0.22 * intensity, tt); place(music, bass * 0.16 * intensity, tt + BAR / 8)
    for k in range(16):
        tt = tb + k * BAR / 16
        if tt < 71.32 and tb >= 37: place(music, pluck(hz(ch[k % 3] + 12), 0.25, 0.6) * 0.05 * intensity, tt, pan=(-0.4 if k % 2 else 0.4))
    tb += BAR; i += 1
place(music, riser(0.95) * 0.20, 39.40)                 # acceleration
place(music, sub_boom(2.2, 44) * 0.55, 40.34)          # "بأقل من ثانية"
place(music, sub_boom(1.6, 50) * 0.30, 46.52); place(music, sub_boom(1.6, 50) * 0.30, 49.42); place(music, sub_boom(1.6, 47) * 0.36, 52.78)
# PHASE D (71.32-79.11): inspiring resolution (lift to F major)
prog_D = [(Bb, 1.9), (F, 1.9), (C, 1.7), (F, 3.0)]
tb = 71.32
for ch, d in prog_D:
    place(music, saw_pad([hz(n) for n in ch] + [hz(ch[0] - 12), hz(ch[0] - 24)], d + 1.5, bright=2600, attack=0.5, release=1.2) * 0.30, tb)
    for k, note in enumerate([ch[0] + 12, ch[2] + 12, ch[1] + 24]):
        place(music, piano(hz(note), 2.4) * 0.11, tb + k * 0.32, pan=(-0.3, 0.3, 0.0)[k])
    place(music, kick() * 0.2, tb)
    tb += d
place(music, sub_boom(3.0, 43) * 0.35, 75.80)
music = reverb(music, 2.8, 0.30)
# phase balance automation (dB): keep the phase-C groove well under the voice, lift the finale
_kf = [(0, -3.5), (5.6, -3.5), (6.2, 0), (29.8, 0), (30.4, -6.0), (39.2, -6.0), (40.3, -3.5), (41.5, -6.5), (57.3, -6.5), (57.8, -4.5), (71.0, -4.5), (71.6, -1.0), (75.6, -1.0), (76.0, -3.0), (79.2, -3.0)]
_auto = np.interp(np.arange(N) / SR, [k[0] for k in _kf], [k[1] for k in _kf])
music *= (10 ** (_auto / 20))[:, None]
# end: hold until the last word ends (~78.53), then gentle tail to 79.11 (never before speech ends)
t_all = t_axis(N)
music *= np.where(t_all > 78.62, np.clip(1 - (t_all - 78.62) / 0.49, 0, 1), 1.0)[:, None]

# ================== SFX ==================
sfx = np.zeros((N, 2))
for tt, d in ((7.32, 0.7), (12.30, 0.5), (15.42, 0.6), (19.90, 0.7), (30.0, 0.6), (33.15, 0.6), (57.42, 0.7), (73.94, 0.8)):
    place(sfx, whoosh(d, True, 0.7) * 0.22, tt - d * 0.7)
place(sfx, fan_whirr(4.1, 0.9) * 0.11, 8.3)
place(sfx, fan_whirr(1.1, 0.05) * 0.08, 12.36)
place(sfx, suction(2.1) * 0.10, 13.41)           # replaced by real room sound if B1 footage audio is supplied
place(sfx, gas_hiss(2.3) * 0.13, 21.30, pan=0.2)
place(sfx, gas_hiss(0.5, 1.3) * 0.15, 23.82, pan=-0.2)
for k in range(9): place(sfx, tick(2200 + 60 * k) * 0.10, 39.40 + k * 0.09)
for tt in (59.42, 60.84, 62.10, 62.45, 62.70, 64.50, 64.85, 65.10):
    place(sfx, tick(1900) * 0.12, tt)
for tt in (7.88, 10.50, 11.72, 21.15, 22.45, 23.79):  # label pops
    place(sfx, tick(1400, 0.05) * 0.07, tt)
place(sfx, sub_boom(0.8, 70) * 0.15, 69.6)
sfx = reverb(sfx, 1.2, 0.15)

# ================== DUCKING (music & sfx follow the voice) ==================
mono = np.abs(vo.mean(1))
win = int(0.03 * SR)
rms = np.sqrt(np.convolve(mono ** 2, np.ones(win) / win, 'same'))
active = (20 * np.log10(rms + 1e-9) > -38).astype(float)
# attack 40 ms, release 350 ms smoothing
from scipy.signal import lfilter
def smooth(x, tc): a = np.exp(-1 / (tc * SR)); return lfilter([1 - a], [1, -a], x)
env_up = smooth(active, 0.04); env = np.maximum(env_up, smooth(active[::-1], 0.04)[::-1] * 0.0)
env = np.maximum(smooth(active, 0.04), 0)
env = np.maximum(env, smooth(env, 0.35))
duck_db = -9.0 * np.clip(env, 0, 1)
gain = 10 ** (duck_db / 20)
music_d = music * gain[:, None]
sfx_d = sfx * (10 ** ((-4.0 * np.clip(env, 0, 1)) / 20))[:, None]

def lufs(x):
    import pyloudnorm as pyln
    return pyln.Meter(SR).integrated_loudness(x)
# music bed level: target ~ -27 LUFS (≈10-11 LU under the voice)
mg = 10 ** ((-27.0 - lufs(music_d)) / 20); music_d *= mg
sg = 10 ** ((-29.5 - lufs(sfx_d)) / 20); sfx_d *= sg
mix = vo + music_d + sfx_d
L = lufs(mix)
from scipy.signal import resample_poly
target = -15.0
g_target = 10 ** ((target - L) / 20)
tp_pre = np.max(np.abs(resample_poly(mix, 4, 1, axis=0)))
g_max = 10 ** (-1.2 / 20) / tp_pre        # never limit/clip the voice: gain is capped by the true-peak ceiling
g = 10 ** ((-15.4 - L) / 20)
mix *= g
# transparent look-ahead peak limiter (5 ms look-ahead, 80 ms release) — only touches the few transients above the ceiling
from scipy.ndimage import minimum_filter1d
ceil = 10 ** (-1.3 / 20)
pk = np.abs(resample_poly(mix, 4, 1, axis=0)).max(1).reshape(-1, 4).max(1)[:len(mix)]
need = np.minimum(1.0, ceil / np.maximum(pk, 1e-9))
la = int(0.005 * SR)
need = minimum_filter1d(need, 2 * la + 1)
rel = np.exp(-1 / (0.08 * SR)); gr = np.empty_like(need); cur = 1.0
for i in range(len(need)):
    cur = need[i] if need[i] < cur else min(need[i], cur * rel + (1 - rel))
    gr[i] = cur
mix *= gr[:, None]
print('limiter max GR dB', round(20 * np.log10(gr.min()), 2), 'samples limited %', round(100 * (gr < 0.999).mean(), 3))
sf.write(os.path.join(A, 'music_stem.wav'), (music_d * g).astype(np.float32), SR, subtype='FLOAT')
sf.write(os.path.join(A, 'sfx_stem.wav'), (sfx_d * g).astype(np.float32), SR, subtype='FLOAT')
sf.write(os.path.join(A, 'final_mix.wav'), mix.astype(np.float32), SR, subtype='FLOAT')
tp2 = 20 * np.log10(np.max(np.abs(resample_poly(mix, 4, 1, axis=0))))
print(json.dumps({'vo_gain_applied_db': round(20 * np.log10(g), 2), 'mix_lufs': round(lufs(mix), 2), 'true_peak_dbtp_4x': round(tp2, 2),
                  'music_lufs_in_mix': round(lufs(music_d * g), 2), 'sfx_lufs_in_mix': round(lufs(sfx_d * g), 2)}))
