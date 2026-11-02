// RAM_GOLD episode kit. Reuses the cinematic layer of Video 7 (Shot, PixelCut, PixelMask, PixelRow, TechTag) and the stage /
// stream parts of Video 10; adds the memory-specific pieces: RAM hero cut-out with gold transformation, logo cards, target brackets.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EASE, kf, pop, prog, rand} from '../../brand/anim';
import {C, FONT, SHADOW, W} from '../../brand/tokens';
import {M} from './ep';

export {Shot, PixelCut, PixelMask, PixelRow, TechTag, appear} from '../asml/kit';
export {Stage, Stream, Ring, Source, Cam, rise} from '../binance/kit';

export const G = {
	gold: '#E9B949',
	goldHot: '#FFE7A3',
	goldDeep: '#7A4E10',
	goldGlow: 'rgba(242,182,48,0.55)',
	ink: '#07090C',
	red: '#E5484D',
	panel: 'rgba(12,15,20,0.86)',
} as const;

/** Editorial top tag (series marker): pixel square + «حرب الذاكرة» + dateline. */
export const EdTag: React.FC<{f: number; at: number; text: string; date: string; y?: number; out?: number}> = ({f, at, text, date, y = 92, out}) => {
	const p = pop(f, at, {damping: 14, stiffness: 240, mass: 0.6});
	const o = out !== undefined ? 1 - prog(f, out, out + 6) : 1;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: p * o, transform: `translateY(${(1 - p) * -30}px)`}}>
			<div dir="rtl" style={{display: 'flex', alignItems: 'stretch', filter: SHADOW.soft}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, background: C.yellow, color: C.charcoal, fontFamily: FONT.display, fontWeight: 800, fontSize: 30, padding: '6px 18px 8px', borderRadius: '0 6px 6px 0'}}>
					<span style={{width: 12, height: 12, background: C.charcoal, opacity: Math.floor(f / 12) % 2 === 0 ? 1 : 0.35}} />
					{text}
				</div>
				<div style={{display: 'flex', alignItems: 'center', background: 'rgba(251,248,241,0.94)', color: C.charcoal, fontFamily: FONT.label, fontWeight: 700, fontSize: 26, padding: '6px 18px 8px', borderRadius: '6px 0 0 6px'}}>
					{date}
				</div>
			</div>
		</div>
	);
};

/** Official logo (Wikimedia Commons SVG) on a paper card. */
export const LogoCard: React.FC<{src: string; w: number; pad?: number; bg?: string; rot?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({src, w, pad = 26, bg = C.paperWhite, rot = 0, style, children}) => (
	<div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: bg, padding: `${pad}px ${pad * 1.4}px`, borderRadius: 8, filter: SHADOW.lifted, transform: `rotate(${rot}deg)`, ...style}}>
		<Img src={staticFile(M(src))} style={{width: w, display: 'block'}} />
		{children}
	</div>
);

/** Yellow corner brackets that close in on a target rectangle (camera "lock"). */
export const Brackets: React.FC<{f: number; at: number; x: number; y: number; w: number; h: number; color?: string; len?: number; thick?: number}> = ({f, at, x, y, w, h, color = C.yellow, len = 56, thick = 8}) => {
	if (f < at) return null;
	const p = pop(f, at, {damping: 15, stiffness: 200, mass: 0.7});
	const spread = (1 - p) * 120;
	const o = Math.min(1, (f - at) / 4);
	const corner = (cx: number, cy: number, sx: number, sy: number, k: number) => (
		<div key={k} style={{position: 'absolute', left: cx + sx * spread - (sx > 0 ? 0 : len), top: cy + sy * spread - (sy > 0 ? 0 : len), width: len, height: len, opacity: o}}>
			<div style={{position: 'absolute', [sy > 0 ? 'top' : 'bottom']: 0, left: 0, right: 0, height: thick, background: color, boxShadow: `0 0 14px ${G.goldGlow}`}} />
			<div style={{position: 'absolute', [sx > 0 ? 'left' : 'right']: 0, top: 0, bottom: 0, width: thick, background: color, boxShadow: `0 0 14px ${G.goldGlow}`}} />
		</div>
	);
	return (
		<>
			{corner(x, y, -1, -1, 0)}
			{corner(x + w, y, 1, -1, 1)}
			{corner(x, y + h, -1, 1, 2)}
			{corner(x + w, y + h, 1, 1, 3)}
		</>
	);
};

/** Diagonal specular sweep (light passing over a glossy object). pos: 0..1 across the element. */
export const Sweep: React.FC<{pos: number; width?: number; strength?: number; color?: string; angle?: number}> = ({pos, width = 0.16, strength = 0.75, color = '255,246,220', angle = 112}) => {
	const c = pos * 160 - 30; // travel from -30% to 130%
	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(${angle}deg, rgba(${color},0) ${c - width * 100}%, rgba(${color},${strength}) ${c}%, rgba(${color},0) ${c + width * 100}%)`,
				mixBlendMode: 'screen',
				pointerEvents: 'none',
			}}
		/>
	);
};

/** The real Micron DDR5 RDIMM (cut-out) with optional gold transformation (wipe from right to left), sweep and glow. */
export const RamCut: React.FC<{w: number; gold?: number; sweep?: number; glow?: number; tilt?: number; shadow?: boolean}> = ({w, gold = 0, sweep = -1, glow = 0, tilt = 0, shadow = true}) => {
	const h = (w * 933) / 3840;
	const wipe = Math.max(0, Math.min(1, gold));
	const mask = `url(${staticFile(M('ram_hero.png'))})`;
	return (
		<div style={{position: 'relative', width: w, height: h, transform: `perspective(1600px) rotateX(${tilt}deg)`, filter: glow > 0 ? `drop-shadow(0 0 ${40 * glow}px rgba(242,182,48,${0.55 * glow}))` : shadow ? 'drop-shadow(0 30px 30px rgba(0,0,0,0.6))' : undefined}}>
			<Img src={staticFile(M('ram_hero.png'))} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
			{wipe > 0 ? (
				<div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${(1 - wipe) * 100}%)`}}>
					<Img src={staticFile(M('ram_hero_gold.png'))} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
				</div>
			) : null}
			{wipe > 0 && wipe < 1 ? (
				<div style={{position: 'absolute', top: -h * 0.12, bottom: -h * 0.12, left: `${(1 - wipe) * 100}%`, width: 10, marginLeft: -5, background: G.goldHot, boxShadow: `0 0 40px 14px ${G.goldGlow}`, opacity: 0.9}} />
			) : null}
			{sweep >= 0 ? (
				<div style={{position: 'absolute', inset: 0, WebkitMaskImage: mask, maskImage: mask, WebkitMaskSize: '100% 100%', maskSize: '100% 100%'}}>
					<Sweep pos={sweep} strength={0.55 + 0.35 * wipe} />
				</div>
			) : null}
		</div>
	);
};

/** Floating gold pixel motes (finale atmosphere). */
export const GoldDust: React.FC<{f: number; n?: number; seed?: number; o?: number}> = ({f, n = 46, seed = 4, o = 1}) => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		{Array.from({length: n}).map((_, i) => {
			const x = rand(seed * 37 + i) * W;
			const sp = 0.4 + rand(i * 11 + seed) * 1.1;
			const y = (rand(i * 17 + seed) * 1920 - f * sp * 1.2 + 1920 * 6) % 1920;
			const s = 4 + Math.round(rand(i * 5 + seed) * 3) * 4;
			const tw = 0.35 + 0.65 * Math.abs(Math.sin((f + i * 13) / (10 + rand(i) * 14)));
			return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, background: i % 4 === 0 ? G.goldHot : C.yellow, opacity: o * tw * 0.75, boxShadow: `0 0 ${s * 2}px ${G.goldGlow}`}} />;
		})}
	</AbsoluteFill>
);

/** Small factual footnote line on dark plate (sources / labels). */
export const Note: React.FC<{text: string; size?: number; color?: string; style?: React.CSSProperties; dir?: 'rtl' | 'ltr'}> = ({text, size = 22, color = 'rgba(244,236,221,0.86)', style, dir = 'rtl'}) => (
	<div dir={dir} style={{display: 'inline-block', fontFamily: FONT.label, fontWeight: 700, fontSize: size, color, background: 'rgba(12,15,20,0.72)', padding: '4px 12px 6px', borderRadius: 4, whiteSpace: 'nowrap', ...style}}>
		{text}
	</div>
);

/** Yellow pixel "packet" squares travelling left→right or along x0→x1 (data moving). */
export const Packets: React.FC<{f: number; a: number; b: number; x0: number; x1: number; y: number; n?: number; size?: number; speed?: number; color?: string; seed?: number; spread?: number}> = ({
	f,
	a,
	b,
	x0,
	x1,
	y,
	n = 12,
	size = 14,
	speed = 1,
	color = C.yellow,
	seed = 1,
	spread = 26,
}) => {
	if (f < a || f > b) return null;
	const life = prog(f, a, a + 6) * (1 - prog(f, b - 6, b));
	return (
		<>
			{Array.from({length: n}).map((_, i) => {
				const ph = ((f - a) * 0.03 * speed + i / n) % 1;
				const x = x0 + (x1 - x0) * ph;
				const yy = y + (rand(seed * 13 + i) - 0.5) * spread;
				return <div key={i} style={{position: 'absolute', left: x - size / 2, top: yy - size / 2, width: size, height: size, background: color, opacity: life * Math.min(1, ph * 5) * Math.min(1, (1 - ph) * 5), boxShadow: `0 0 10px ${G.goldGlow}`}} />;
			})}
		</>
	);
};

export const fadeOut = (f: number, at: number, dur = 6) => 1 - prog(f, at, at + dur, EASE.in);
export const ease = kf;
