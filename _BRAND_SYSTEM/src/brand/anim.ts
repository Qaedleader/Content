import {Easing, interpolate, spring} from 'remotion';
import {FPS} from './tokens';

// ---- time ----
export const sf = (sec: number) => Math.round(sec * FPS);

// ---- easing / interpolation (all clamped) ----
export const EASE = {
	io: Easing.inOut(Easing.cubic),
	out: Easing.out(Easing.cubic),
	out5: Easing.out(Easing.poly(5)),
	in: Easing.in(Easing.cubic),
	back: Easing.out(Easing.back(1.7)),
	linear: Easing.linear,
};

/** 0→1 between frames a and b. */
export const prog = (f: number, a: number, b: number, ease: (x: number) => number = EASE.io) =>
	interpolate(f, [a, Math.max(a + 0.001, b)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

/** Piecewise keyframes: kf(f, [f0,f1,f2], [v0,v1,v2]). */
export const kf = (f: number, frames: number[], values: number[], ease: (x: number) => number = EASE.io) =>
	interpolate(f, frames, values, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Paper "pop": spring 0→1 starting at frame `at` (with overshoot). */
export const pop = (f: number, at: number, cfg: {damping?: number; stiffness?: number; mass?: number} = {}) =>
	f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping: cfg.damping ?? 11, stiffness: cfg.stiffness ?? 190, mass: cfg.mass ?? 0.7}});

/** Heavy drop with a little bounce (for slams / impacts). */
export const slam = (f: number, at: number) =>
	f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping: 14, stiffness: 260, mass: 0.9}});

/** Visibility envelope with in/out ramps (frames). */
export const env = (f: number, a: number, b: number, fin = 6, fout = 6) => {
	if (f < a || f > b) return 0;
	return Math.min(fin > 0 ? clamp01((f - a) / fin) : 1, fout > 0 ? clamp01((b - f) / fout) : 1);
};

// ---- deterministic randomness ----
export const rand = (seed: number) => {
	let t = (seed * 2654435761 + 0x6d2b79f5) | 0;
	t = Math.imul(t ^ (t >>> 15), t | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const randRange = (seed: number, a: number, b: number) => a + (b - a) * rand(seed);

/** Stop-motion "boil": a value that changes every `step` frames (paper jitter). */
export const boil = (f: number, seed: number, amp: number, step = 4) => (rand(Math.floor(f / step) * 31 + seed) - 0.5) * 2 * amp;

/** Camera shake that decays after an impact at frame `at`. */
export const shake = (f: number, at: number, amp = 10, dur = 10) => {
	if (f < at || f > at + dur) return {x: 0, y: 0};
	const k = 1 - (f - at) / dur;
	return {x: Math.sin((f - at) * 2.7) * amp * k, y: Math.cos((f - at) * 3.3) * amp * k * 0.7};
};
