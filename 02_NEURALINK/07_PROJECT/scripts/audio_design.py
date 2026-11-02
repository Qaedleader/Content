"""Original score + sound design for the Neuralink reel, built around the untouched narration.
Everything here is synthesised from scratch (no samples, no third-party music).
- Mix runs at the narration's native 44.1 kHz so the voice is never resampled.
- The voice is added sample-for-sample; the only thing applied to the final mix is ONE uniform linear master gain
  (a scalar) chosen so the true peak stays below -1 dBTP. No EQ, compression, limiting or edits touch the voice.
Outputs: 06_MUSIC_AND_SFX/{music_stem,sfx_stem}.wav, 07_PROJECT/audio/{final_mix.wav, mix_report.json}
Usage: python audio_design.py"""
import os, json, math
import numpy as np, soundfile as sf
from scipy.signal import lfilter, fftconvolve, butter, sosfilt, resample_poly

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NL = os.path.dirname(ROOT)
SR = 44100
VO_PATH = os.path.join(ROOT, 'timing', 'vo_decoded_f32.wav')
vo, sr = sf.read(VO_PATH, dtype='float32', always_2d=True)
assert sr == SR, sr
N = vo.shape[0]; DUR = N / SR
rng = np.random.default_rng(2026)
t_all = np.arange(N) / SR

def buf(): return np.zeros((N, 2), np.float32)
def at(t): return int(round(t * SR))
def place(dst, sig, t, gain=1.0, pan=0.0):
    """add mono/stereo sig at time t with constant-power pan (-1..1)"""
    i = at(t)
    if i >= N: return
    if sig.ndim == 1:
        l, r = math.cos((pan + 1) * math.pi / 4), math.sin((pan + 1) * math.pi / 4)
        sig = np.stack([sig * l, sig * r], 1)
    j = min(N, i + len(sig)); s0 = max(0, -i)
    dst[max(0, i):j] += (sig[s0:j - i] * gain).astype(np.float32)

def env_adsr(n, a, d, s, r, sus_level=0.7):
    a, d, r = int(a * SR), int(d * SR), int(r * SR); s_n = max(0, n - a - d - r)
    e = np.concatenate([np.linspace(0, 1, max(1, a)), np.linspace(1, sus_level, max(1, d)),
                        np.full(s_n, sus_level), np.linspace(sus_level, 0, max(1, r))])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))

def lp(x, fc, order=2):
    sos = butter(order, min(fc, SR * 0.45) / (SR / 2), 'low', output='sos'); return sosfilt(sos, x, axis=0)
def hp(x, fc, order=2):
    sos = butter(order, fc / (SR / 2), 'high', output='sos'); return sosfilt(sos, x, axis=0)
def bp(x, lo, hi, order=2):
    sos = butter(order, [lo / (SR / 2), min(hi, SR * 0.45) / (SR / 2)], 'band', output='sos'); return sosfilt(sos, x, axis=0)

def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
NOTE = {n: i for i, n in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}
def m_(name):  # 'A3' -> midi
    return NOTE[name[:-1]] + 12 * (int(name[-1]) + 1)

# ---------------- instruments ----------------
def saw(f, n, detune=0.0, phase=0.0):
    t = np.arange(n) / SR
    ph = (t * f * (1 + detune) + phase) % 1.0
    return 2 * ph - 1

def pad(notes, dur, bright=1800, attack=1.2, release=1.6, voices=3, level=0.12):
    n = int(dur * SR); out = np.zeros((n, 2))
    for k, m in enumerate(notes):
        f = midi(m)
        for v in range(voices):
            det = (v - (voices - 1) / 2) * 0.006
            for ch in (0, 1):
                out[:, ch] += saw(f, n, det + (0.002 if ch else -0.002), rng.random())
    out = lp(out, bright, 2) * env_adsr(n, attack, 0.5, 0, release, 0.85)[:, None]
    return (out / (len(notes) * voices) * level * 3).astype(np.float32)

def pluck(f, dur=0.9, bright=4000, level=0.2):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum((0.6 ** h) * np.sin(2 * np.pi * f * (h + 1) * t) for h in range(5))
    s *= np.exp(-t * 6.5) * np.minimum(1, t * 400)
    return lp(s, bright, 1).astype(np.float32) * level

def bell(f, dur=3.0, level=0.18, ratio=3.5, index=2.2):
    n = int(dur * SR); t = np.arange(n) / SR
    mod = np.sin(2 * np.pi * f * ratio * t) * index * np.exp(-t * 3.0)
    s = np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 1.6) * np.minimum(1, t * 600)
    return (s * level).astype(np.float32)

def sub_hit(dur=2.2, f0=72, f1=34, level=0.55, click=0.25):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 9)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 2.2)
    cl = lp(rng.standard_normal(n) * np.exp(-t * 60), 2500) * click
    return ((s + cl) * level).astype(np.float32)

def noise_sweep(dur, f_from, f_to, level=0.12, rev=False, width=1.0):
    n = int(dur * SR); x = rng.standard_normal((n, 2))
    # moving band-pass via short blocks
    out = np.zeros_like(x); blk = 1024
    for i in range(0, n, blk):
        u = i / n; fc = f_from * (f_to / f_from) ** u
        seg = x[i:i + blk]
        out[i:i + blk] = bp(seg, max(40, fc * 0.6), fc * 1.6, 1)
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    out = out * e[:, None] * level
    if rev: out = out[::-1]
    return out.astype(np.float32)

def tick(level=0.15, f=3200, dur=0.03):
    n = int(dur * SR); t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * t) + 0.5 * rng.standard_normal(n)) * np.exp(-t * 180)
    return bp(s, f * 0.5, f * 2.0, 1).astype(np.float32) * level

def crackle(dur, density=60, level=0.12):
    n = int(dur * SR); s = np.zeros(n)
    for _ in range(int(density * dur)):
        i = rng.integers(0, n - 400); L = rng.integers(60, 380)
        s[i:i + L] += rng.standard_normal(L) * np.exp(-np.arange(L) / (L / 5)) * rng.uniform(0.3, 1)
    return hp(s, 1800).astype(np.float32) * level

def shimmer(dur, f_base=1760, level=0.06, rise=True):
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros((n, 2))
    for k in range(40):
        st = rng.uniform(0, dur * 0.9); L = int(rng.uniform(0.08, 0.35) * SR); i = int(st * SR)
        f = f_base * 2 ** (rng.integers(0, 24) / 12) * (1 + (st / dur if rise else 0) * 0.5)
        tt = np.arange(min(L, n - i)) / SR
        g = np.sin(2 * np.pi * f * tt) * np.sin(np.pi * np.arange(len(tt)) / max(1, len(tt))) ** 2
        p = rng.uniform(-1, 1); out[i:i + len(tt), 0] += g * (1 - p) / 2; out[i:i + len(tt), 1] += g * (1 + p) / 2
    return (out * level).astype(np.float32)

def tape_stop(src, t0, dur=0.35):
    """pitch-down 'stop' of the music bed (music only) starting at t0"""
    i = at(t0); n = int(dur * SR)
    seg = src[i:i + n].copy()
    rate = np.linspace(1.0, 0.0, n); pos = np.cumsum(rate); pos = np.clip(pos, 0, n - 1)
    for ch in range(2):
        src[i:i + n, ch] = np.interp(pos, np.arange(n), seg[:, ch]) * np.linspace(1, 0, n)

def reverb_ir(seconds=2.6, damp=3.2):
    n = int(seconds * SR); t = np.arange(n) / SR
    ir = rng.standard_normal((n, 2)) * np.exp(-t * damp)[:, None]
    ir = lp(ir, 6000, 1); ir[:int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))[:, None]
    return (ir / np.sqrt((ir ** 2).sum(0))).astype(np.float32)

def add_reverb(x, wet=0.28, seconds=2.6):
    ir = reverb_ir(seconds)
    y = np.stack([fftconvolve(x[:, ch], ir[:, ch])[:N] for ch in range(2)], 1)
    return (x * (1 - wet * 0.3) + y * wet).astype(np.float32)

# ---------------- score ----------------
music = buf()
BPM = 96; BEAT = 60 / BPM
Am, F, C, G = ['A2', 'E3', 'A3', 'C4'], ['F2', 'C3', 'A3', 'C4'], ['C3', 'G3', 'C4', 'E4'], ['G2', 'D3', 'G3', 'B3']
Fmaj7, Am9, Gsus, Dm9 = ['F2', 'C3', 'E4', 'A4'], ['A2', 'E3', 'B3', 'C4', 'G4'], ['G2', 'D3', 'C4', 'D4'], ['D3', 'A3', 'C4', 'E4', 'F4']
def chord(names): return [m_(x) for x in names]
MOTIF = ['A5', 'E5', 'C6', 'B5']   # the "memory" motif

# A — hook (0 - 2.52): air, a held breath, motif on bells
place(music, pad(chord(Am9), 3.2, 1400, 0.25, 1.0, level=0.10), 0.0)
for k, nm in enumerate(MOTIF): place(music, bell(midi(m_(nm)), 2.2, 0.08), 0.15 + k * 0.28, pan=-0.3 + 0.2 * k)
place(music, noise_sweep(2.4, 300, 5000, 0.05), 0.1)

# B — technology (2.52 - 17.45): precise pulse, arpeggiated plucks + soft pulse kick
prog_B = [Am, F, C, G, Am, F, Dm9, G]
t = 2.52; bar = 4 * BEAT; i = 0
while t < 17.40:
    ch = chord(prog_B[i % len(prog_B)])
    place(music, pad(ch, bar + 0.6, 1300 + 120 * i, 0.4, 0.7, level=0.085), t)
    arp = ch[1:] + [ch[2] + 12]
    for s in range(16):
        ts = t + s * BEAT / 4
        if ts >= 17.40: break
        if t < 4.95 and s % 2: continue         # sparser while the chip is introduced
        f = midi(arp[s % len(arp)] + (12 if s % 8 >= 6 else 0))
        place(music, pluck(f, 0.6, 2600 + 1800 * (t > 9.3), 0.07 if s % 4 else 0.10), ts, pan=(-0.5 if s % 2 else 0.5))
    if t >= 4.95:
        for b in range(4):
            tb = t + b * BEAT
            if tb < 17.4: place(music, sub_hit(0.5, 90, 45, 0.18 if b % 2 == 0 else 0.10, 0.05), tb)
    t += bar; i += 1
place(music, sub_hit(3.0, 70, 30, 0.45), 2.52)                    # "أول إشي" — the film opens up

# C — imagine (17.45 - 24.3): wide, weightless; data shimmer rising into the cloud
place(music, pad(chord(Fmaj7), 3.4, 2600, 1.0, 1.2, voices=4, level=0.12), 17.45)
place(music, pad(chord(['C3', 'G3', 'E4', 'B4']), 3.6, 3000, 0.8, 1.4, voices=4, level=0.12), 20.45)
place(music, shimmer(2.6, 1760, 0.05), 21.6)
for k in range(12):
    place(music, pluck(midi(m_(['E5', 'G5', 'B5', 'D6'][k % 4])), 1.2, 6000, 0.05), 17.8 + k * BEAT / 2, pan=math.sin(k))

# D — seven years (24.3 - 29.7): clock-like ticks building to "لحظة!", then a stopped beat
for k in range(int((27.24 - 24.33) / (BEAT / 2))):
    place(music, tick(0.10 if k % 2 == 0 else 0.06, 2600 if k % 2 else 1900, 0.04), 24.33 + k * BEAT / 2, pan=0.3 if k % 2 else -0.3)
place(music, pad(chord(Am), 3.0, 1600, 0.6, 0.3, level=0.10), 24.33)
tape_stop(music, 27.10, 0.18)
music[at(27.28):at(27.62)] *= 0.0                                   # held silence on "لحظة!"
place(music, pad(chord(Dm9), 2.3, 1200, 0.5, 0.9, level=0.08), 27.62)

# E — memory search (29.7 - 35.7): rising arpeggio, then the motif when the memory is found
for k in range(20):
    tt = 29.72 + k * 0.125
    if tt > 32.2: break
    place(music, pluck(midi(m_('A4') + [0, 3, 7, 10, 12, 15, 19][k % 7] + 12 * (k // 10)), 0.4, 5000, 0.06), tt, pan=(k % 3 - 1) * 0.5)
place(music, noise_sweep(2.5, 400, 7000, 0.05), 29.72)
for k, nm in enumerate(MOTIF): place(music, bell(midi(m_(nm)), 2.6, 0.11), 32.24 + k * 0.22, pan=-0.2 + 0.15 * k)
place(music, pad(chord(['F2', 'C3', 'A3', 'E4', 'G4']), 3.4, 2200, 0.3, 1.2, voices=4, level=0.11), 32.30)

# F — speculative (35.7 - 46.9): darker, mechanical, then the joke stop
place(music, pad(chord(['D2', 'A2', 'F3', 'C4']), 5.4, 900, 1.2, 1.0, level=0.12), 35.70)
for k in range(int((41.1 - 35.9) / (BEAT / 2))):
    place(music, tick(0.07, 900 + 300 * (k % 3), 0.06), 35.9 + k * BEAT / 2, pan=0.6 * math.sin(k * 1.3))
place(music, pad(chord(['A#1', 'F2', 'D3', 'A3']), 2.0, 1400, 0.4, 0.5, level=0.12), 41.18)
place(music, sub_hit(2.4, 80, 32, 0.6, 0.4), 42.26)                 # "استنساخ"
music[at(42.80):at(44.30)] *= np.linspace(0.15, 0.0, at(44.30) - at(42.80))[:, None]   # "لا، بمزح!" — the music falls away
for k, nm in enumerate(['E4', 'A4', 'B4', 'C5', 'B4', 'E4']):
    place(music, bell(midi(m_(nm)), 1.8, 0.05, 2.0, 0.8), 44.36 + k * 0.42, pan=-0.3 + 0.12 * k)

# G — reality (46.9 - 59.8): grounded documentary pulse that builds to "حقيقي"
place(music, sub_hit(3.0, 60, 28, 0.6, 0.3), 46.88)
prog_G = [Am, F, C, G, Am, F, C, G]
t = 47.66; i = 0
while t < 59.8:
    ch = chord(prog_G[i % len(prog_G)])
    lvl = 0.07 + 0.012 * i
    place(music, pad(ch, bar + 0.5, 1500 + 200 * i, 0.3, 0.6, voices=4, level=lvl), t)
    for s in range(8):
        ts = t + s * BEAT / 2
        if ts >= 59.8: break
        place(music, pluck(midi(ch[(s % 3) + 1] + 12), 0.7, 3500, 0.06 + 0.005 * i), ts, pan=(-0.4 if s % 2 else 0.4))
        if s % 2 == 0: place(music, sub_hit(0.45, 95, 48, 0.12 + 0.02 * i, 0.06), ts)
    t += bar; i += 1
place(music, pad(chord(['A2', 'E3', 'C#4', 'E4', 'A4']), 2.4, 3200, 0.05, 1.0, voices=4, level=0.16), 58.84)   # resolve to A major on "حقيقي"

# H — the future (59.8 - 66.5): wonder; then a lighter, playful figure for the subscription joke
place(music, pad(chord(['F2', 'C3', 'G3', 'A3', 'E4']), 3.4, 2800, 0.9, 1.2, voices=4, level=0.13), 59.78)
place(music, shimmer(3.0, 1320, 0.05, True), 60.0)
for k in range(14):
    place(music, pluck(midi(m_(['C5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5'][k % 7])), 0.5, 5000, 0.07), 62.96 + k * BEAT / 2, pan=(k % 2) * 0.8 - 0.4)
place(music, pad(chord(['C3', 'G3', 'E4']), 3.6, 2200, 0.2, 0.8, level=0.08), 62.96)

# I — outro (66.5 - end): the motif returns and resolves
place(music, pad(chord(Am9), DUR - 66.52 + 0.2, 2200, 0.6, 1.6, voices=4, level=0.12), 66.52)
for k, nm in enumerate(MOTIF + ['A5']):
    place(music, bell(midi(m_(nm)), 3.0, 0.10), 67.94 + k * 0.30, pan=-0.25 + 0.12 * k)
place(music, sub_hit(3.0, 66, 30, 0.40, 0.2), 69.95)
music = add_reverb(music, 0.32, 2.8)

# ---------------- sound design (synced to picture events) ----------------
sfx = buf()
place(sfx, shimmer(0.9, 2400, 0.05), 0.25)                                       # reticle locks on the iris
place(sfx, noise_sweep(1.2, 6000, 600, 0.06), 1.30)                               # prints drift away ("تنسى")
place(sfx, noise_sweep(0.9, 200, 2200, 0.05, rev=True), 2.6)                      # push into the head
place(sfx, noise_sweep(1.0, 3000, 300, 0.06), 3.3)                                # skull turns to glass
place(sfx, tick(0.22, 2400, 0.05), 4.72); place(sfx, sub_hit(0.6, 140, 70, 0.16, 0.5), 4.74)   # implant seats
place(sfx, shimmer(1.3, 3500, 0.05, True), 5.05)                                  # threads extend (silk)
place(sfx, noise_sweep(0.5, 800, 5000, 0.045), 9.25)                              # zoom into tissue
place(sfx, crackle(2.0, 70, 0.10), 9.4)                                           # action potentials
place(sfx, crackle(1.5, 120, 0.06), 11.4)                                         # raster
for k in range(10): place(sfx, tick(0.06, 4200, 0.02), 11.6 + k * 0.17, pan=0.6)
place(sfx, bell(midi(m_('E6')), 1.2, 0.07, 2.0, 1.0), 14.16)                      # cursor reaches target
place(sfx, noise_sweep(1.4, 5000, 300, 0.05, rev=True), 14.3)                     # write-back wave (reversed)
place(sfx, crackle(0.5, 200, 0.08), 16.3)                                         # Galvani spark
place(sfx, shimmer(0.7, 2000, 0.05), 19.10)                                       # world opens from the pupil
place(sfx, noise_sweep(1.0, 600, 6000, 0.05), 22.55)                              # data rises to the cloud
for k in range(8): place(sfx, tick(0.05, 5200, 0.02), 22.6 + k * 0.18)
place(sfx, sub_hit(0.9, 110, 50, 0.30, 0.6), 27.24)                               # "لحظة!" freeze
place(sfx, noise_sweep(0.6, 400, 4000, 0.05), 29.62)                              # into the archive
place(sfx, tick(0.18, 3000, 0.04), 32.24)                                         # found
place(sfx, tick(0.12, 2200, 0.03), 32.95)                                         # phone UI
for k in range(10): place(sfx, noise_sweep(0.25, 1500, 5000, 0.03), 37.4 + k * 0.19, pan=0.5 - 0.1 * k)   # prints flutter
for tt in (41.16, 41.51, 41.86, 42.21, 42.46): place(sfx, tick(0.16, 1600, 0.05), tt)  # grid multiplies
place(sfx, noise_sweep(0.6, 6000, 500, 0.06, rev=True), 42.6)                     # grid collapses
place(sfx, tick(0.10, 1400, 0.04), 45.12)                                         # '≠'
place(sfx, tick(0.20, 900, 0.05), 50.70); place(sfx, tick(0.15, 1100, 0.05), 52.06)     # documentary cuts (subtle)
place(sfx, sub_hit(0.7, 120, 55, 0.28, 0.9), 58.86)                               # stamp "حقيقي"
for k in range(10): place(sfx, tick(0.05, 3600, 0.02), 63.2 + k * 0.2)            # storage filling
place(sfx, bell(midi(m_('C6')), 0.8, 0.05, 1.5, 0.6), 64.45)                      # button
place(sfx, shimmer(1.4, 1760, 0.045, True), 68.4)                                 # the circle closes
sfx = add_reverb(sfx, 0.18, 1.6)

# ---------------- ducking (music & sfx sit under the voice) ----------------
vo_m = np.abs(vo.mean(1))
win = int(0.12 * SR); k = np.ones(win) / win
envv = np.convolve(vo_m, k, 'same'); envv = envv / (np.percentile(envv, 99) + 1e-9)
envv = np.clip(envv, 0, 1)
att = np.exp(-1 / (0.05 * SR)); rel = np.exp(-1 / (0.35 * SR))
sm = np.zeros_like(envv); y = 0.0
for i in range(0, N, 32):   # block-wise attack/release follower (fast enough in numpy)
    x = envv[i:i + 32].max()
    y = att * y + (1 - att) * x if x > y else rel * y + (1 - rel) * x
    sm[i:i + 32] = y
duck = (1 - 0.62 * sm)[:, None].astype(np.float32)
music_b = music * 0.85 * duck; sfx_b = sfx * 0.9 * (1 - 0.35 * sm)[:, None]
# end: everything fades with the last word; nothing after the narration
fade_n = at(0.35); music_b[-fade_n:] *= np.linspace(1, 0, fade_n)[:, None]; sfx_b[-fade_n:] *= np.linspace(1, 0, fade_n)[:, None]

mix = vo + music_b + sfx_b
# one scalar master gain so the 4x-oversampled true peak stays <= -1.0 dBTP (linear => narration waveform unchanged)
tp = max(np.abs(resample_poly(mix[:, ch], 4, 1)).max() for ch in range(2))
g = min(1.0, 10 ** (-1.0 / 20) / tp)
mix *= g
out_m = os.path.join(NL, '06_MUSIC_AND_SFX'); os.makedirs(out_m, exist_ok=True)
sf.write(os.path.join(out_m, 'music_stem.wav'), music_b, SR, subtype='PCM_24')
sf.write(os.path.join(out_m, 'sfx_stem.wav'), sfx_b, SR, subtype='PCM_24')
os.makedirs(os.path.join(ROOT, 'audio'), exist_ok=True)
sf.write(os.path.join(ROOT, 'audio', 'final_mix.wav'), mix.astype(np.float32), SR, subtype='FLOAT')
rep = {'sample_rate': SR, 'samples': N, 'duration_s': DUR, 'master_gain_linear': float(g), 'master_gain_db': float(20 * np.log10(g)),
       'mix_true_peak_dbtp_before_gain': float(20 * np.log10(tp)), 'vo_sample_peak_dbfs': float(20 * np.log10(np.abs(vo).max())),
       'note': 'final_mix = master_gain * (narration + music + sfx); narration samples unaltered before the scalar gain.'}
json.dump(rep, open(os.path.join(ROOT, 'audio', 'mix_report.json'), 'w'), indent=1)
print(json.dumps(rep, indent=1))
