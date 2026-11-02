"""Shared, original sound-synthesis library for Content Studio episodes (numpy/scipy, no samples).
Extracted from 03_NO_MONEY_ANYMORE/04_SFX_MUSIC/audio_design.py so later episodes reuse the same sonic identity."""
import numpy as np
from scipy import signal
SR = 44100
rng = np.random.default_rng(2026)

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

