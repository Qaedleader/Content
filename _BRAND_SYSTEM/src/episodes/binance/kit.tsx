// Binance episode kit: dark "vault" stage, money counters, illustrative system diagram parts, transaction streams.
// Brand language (paper labels, index cards, pixel cuts, badges) comes from src/brand; this file only adds the fintech layer.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EASE, kf, pop, prog, rand} from '../../brand/anim';
import {C, FONT, H, SHADOW, W} from '../../brand/tokens';
import {M} from './ep';

// Binance yellow is used only for Binance-owned objects; brand yellow stays the emphasis colour.
export const K = {
	bnb: '#F0B90B',
	bnbGlow: 'rgba(240,185,11,0.55)',
	red: '#E5484D', // attacker path / outflow
	redGlow: 'rgba(229,72,77,0.55)',
	ice: '#8FD8EE', // frozen funds
	iceDeep: '#2B6F86',
	ink: '#0B111B',
	panel: 'rgba(17,25,38,0.92)',
	line: 'rgba(154,165,174,0.35)',
} as const;

/** Deep navy stage: perspective floor grid, slow particles, soft light. `tone` tints the key light (0 = bnb, 1 = red). */
export const Stage: React.FC<{f: number; tone?: number; grid?: number; seed?: number}> = ({f, tone = 0, grid = 1, seed = 1}) => {
	const glow = tone > 0 ? `rgba(229,72,77,${0.28 * tone})` : 'rgba(240,185,11,0.16)';
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse 90% 60% at 50% 38%, #1B2940 0%, ${C.navyDeep} 55%, ${K.ink} 100%)`}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 70% 40% at 50% 34%, ${glow}, rgba(0,0,0,0) 70%)`}} />
			{/* perspective floor */}
			<div style={{position: 'absolute', left: -540, width: W * 2, top: 1100, height: 1400, transform: 'perspective(900px) rotateX(72deg)', transformOrigin: '50% 0%', opacity: 0.55 * grid}}>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						backgroundImage: 'linear-gradient(rgba(154,165,174,0.28) 2px, transparent 2px), linear-gradient(90deg, rgba(154,165,174,0.28) 2px, transparent 2px)',
						backgroundSize: '120px 120px',
						backgroundPosition: `0px ${(f * 2.2) % 120}px`,
						maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0))',
						WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0))',
					}}
				/>
			</div>
			{/* drifting dust */}
			{Array.from({length: 38}).map((_, i) => {
				const x = rand(seed * 101 + i) * W;
				const sp = 0.25 + rand(i * 7 + seed) * 0.8;
				const y = (rand(i * 13 + seed) * H - f * sp * 1.4 + H * 4) % H;
				const s = 2 + rand(i * 3) * 4;
				return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, background: i % 5 === 0 ? K.bnb : C.paper, opacity: 0.1 + rand(i * 5) * 0.25}} />;
			})}
		</AbsoluteFill>
	);
};

/** Camera wrapper: scales/translates its children around the frame centre. */
export const Cam: React.FC<{s: number; x?: number; y?: number; r?: number; children: React.ReactNode}> = ({s, x = 0, y = 0, r = 0, children}) => (
	<AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>
);

/** Official Binance logo (wordmark or icon) with an optional soft glow. */
export const BinanceLogo: React.FC<{w: number; icon?: boolean; glow?: number; style?: React.CSSProperties}> = ({w, icon = false, glow = 0.6, style}) => (
	<Img
		src={staticFile(M(icon ? 'binance_icon.svg' : 'binance_logo.svg'))}
		style={{width: w, display: 'block', filter: glow > 0 ? `drop-shadow(0 0 ${28 * glow}px ${K.bnbGlow}) drop-shadow(0 6px 10px rgba(0,0,0,0.5))` : undefined, ...style}}
	/>
);

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

/** Rolling dollar counter, mono digits on a dark plate. Value interpolates a→b between frames fa→fb. */
export const Counter: React.FC<{f: number; fa: number; fb: number; a: number; b: number; size?: number; color?: string; prefix?: string}> = ({f, fa, fb, a, b, size = 92, color = K.bnb, prefix = '$'}) => {
	const t = prog(f, fa, fb, EASE.out5);
	const v = a + (b - a) * t;
	const shown = fmt(v);
	return (
		<div dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: size, color, letterSpacing: -2, whiteSpace: 'nowrap', textShadow: `0 0 26px ${K.bnbGlow}`, lineHeight: 1}}>
			{prefix}
			{shown}
		</div>
	);
};

/** «عاجل» tag + dateline. */
export const NewsTag: React.FC<{f: number; at: number; date: string; x?: number; y?: number}> = ({f, at, date, x = 0, y = 92}) => {
	const p = pop(f, at, {damping: 14, stiffness: 240, mass: 0.6});
	const blink = Math.floor(f / 12) % 2 === 0 ? 1 : 0.35;
	return (
		<div style={{position: 'absolute', left: x, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * -30}px)`}}>
			<div dir="rtl" style={{display: 'flex', alignItems: 'stretch', filter: SHADOW.soft}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, background: K.red, color: C.white, fontFamily: FONT.display, fontWeight: 800, fontSize: 30, padding: '6px 18px 8px', borderRadius: '0 6px 6px 0'}}>
					<span style={{width: 12, height: 12, borderRadius: 6, background: C.white, opacity: blink}} />
					عاجل
				</div>
				<div style={{display: 'flex', alignItems: 'center', background: 'rgba(251,248,241,0.94)', color: C.charcoal, fontFamily: FONT.label, fontWeight: 700, fontSize: 26, padding: '6px 18px 8px', borderRadius: '6px 0 0 6px'}}>
					{date}
				</div>
			</div>
		</div>
	);
};

/** Small source line («المصدر: …») under a figure. */
export const Source: React.FC<{text: string; size?: number; style?: React.CSSProperties}> = ({text, size = 22, style}) => (
	<div dir="rtl" style={{fontFamily: FONT.label, fontWeight: 700, fontSize: size, color: 'rgba(244,236,221,0.78)', whiteSpace: 'nowrap', ...style}}>
		<span style={{color: C.yellow}}>المصدر: </span>
		{text}
	</div>
);

/** Illustrative laptop (vector). `hit` 0..1 turns the screen to a compromised state. */
export const Laptop: React.FC<{w?: number; hit?: number; f: number; label?: boolean}> = ({w = 360, hit = 0, f}) => {
	const h = w * 0.66;
	const scan = (f * 6) % 100;
	return (
		<svg width={w} height={h} viewBox="0 0 360 238" style={{overflow: 'visible', filter: SHADOW.lifted}}>
			<defs>
				<linearGradient id="lpScreen" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={hit > 0.5 ? '#3A1216' : '#14263B'} />
					<stop offset="1" stopColor={hit > 0.5 ? '#1E0A0D' : '#0D1828'} />
				</linearGradient>
			</defs>
			{/* lid */}
			<rect x="40" y="6" width="280" height="186" rx="12" fill="#2A3442" stroke="#4A5868" strokeWidth="3" />
			<rect x="52" y="18" width="256" height="160" rx="4" fill="url(#lpScreen)" />
			{/* code lines (abstract) */}
			{Array.from({length: 9}).map((_, i) => (
				<rect key={i} x={66 + (i % 3) * 10} y={32 + i * 15} width={60 + rand(i * 9) * 140} height="6" rx="3" fill={hit > 0.5 && i % 3 === 1 ? K.red : 'rgba(143,216,238,0.45)'} opacity={0.9} />
			))}
			{/* scanline */}
			<rect x="52" y={18 + (scan / 100) * 154} width="256" height="6" fill={hit > 0.5 ? 'rgba(229,72,77,0.35)' : 'rgba(143,216,238,0.12)'} />
			{/* compromised overlay */}
			{hit > 0 ? (
				<g opacity={hit}>
					<rect x="52" y="18" width="256" height="160" rx="4" fill="rgba(229,72,77,0.18)" />
					<circle cx="180" cy="98" r="34" fill="rgba(11,17,27,0.85)" stroke={K.red} strokeWidth="4" />
					{/* open padlock */}
					<rect x="164" y="96" width="32" height="24" rx="4" fill={K.red} />
					<path d="M170 96 v-10 a10 10 0 0 1 20 0" fill="none" stroke={K.red} strokeWidth="5" transform="translate(8 -4) rotate(-18 190 86)" />
				</g>
			) : null}
			{/* base */}
			<path d="M10 196 H350 L336 226 Q334 232 326 232 H34 Q26 232 24 226 Z" fill="#3A4656" stroke="#566577" strokeWidth="3" />
			<rect x="150" y="198" width="60" height="7" rx="3" fill="#232C38" />
		</svg>
	);
};

/** Diagram node: dark panel with an icon slot, Arabic title and a Latin tech tag. */
export const SysNode: React.FC<{title: string; tag?: string; icon?: React.ReactNode; w?: number; state?: 'idle' | 'hit'; glow?: number; style?: React.CSSProperties}> = ({title, tag, icon, w = 600, state = 'idle', glow = 0, style}) => {
	const hit = state === 'hit';
	return (
		<div
			style={{
				width: w,
				display: 'flex',
				alignItems: 'center',
				gap: 22,
				padding: '20px 26px',
				background: K.panel,
				border: `3px solid ${hit ? K.red : 'rgba(154,165,174,0.55)'}`,
				borderRadius: 14,
				boxShadow: hit ? `0 0 ${30 + 30 * glow}px ${K.redGlow}, inset 0 0 30px rgba(229,72,77,0.18)` : '0 18px 30px rgba(0,0,0,0.45)',
				direction: 'rtl',
				...style,
			}}
		>
			{icon ? <div style={{flex: '0 0 auto'}}>{icon}</div> : null}
			<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
				<div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: C.paper, lineHeight: 1.2, whiteSpace: 'nowrap'}}>{title}</div>
				{tag ? (
					<div dir="ltr" style={{alignSelf: 'flex-end', fontFamily: FONT.mono, fontWeight: 700, fontSize: 24, color: hit ? K.red : C.steel, whiteSpace: 'nowrap'}}>
						{tag}
					</div>
				) : null}
			</div>
		</div>
	);
};

/** Simple vector glyphs for nodes. */
export const Glyph = {
	container: (c: string = C.steel) => (
		<svg width="74" height="74" viewBox="0 0 74 74">
			<path d="M37 6 L66 21 V53 L37 68 L8 53 V21 Z" fill="none" stroke={c} strokeWidth="5" strokeLinejoin="round" />
			<path d="M8 21 L37 36 L66 21 M37 36 V68" fill="none" stroke={c} strokeWidth="5" strokeLinejoin="round" />
		</svg>
	),
	vault: (c: string = C.steel) => (
		<svg width="74" height="74" viewBox="0 0 74 74">
			<rect x="6" y="8" width="62" height="58" rx="8" fill="none" stroke={c} strokeWidth="5" />
			<circle cx="37" cy="37" r="14" fill="none" stroke={c} strokeWidth="5" />
			<path d="M37 23 V30 M37 44 V51 M23 37 H30 M44 37 H51" stroke={c} strokeWidth="5" />
		</svg>
	),
	wallet: (c: string = C.paper, s = 64) => (
		<svg width={s} height={s} viewBox="0 0 64 64">
			<rect x="4" y="14" width="54" height="40" rx="7" fill="none" stroke={c} strokeWidth="5" />
			<path d="M10 14 L44 4 L48 14" fill="none" stroke={c} strokeWidth="5" strokeLinejoin="round" />
			<rect x="38" y="28" width="22" height="13" rx="4" fill={c} />
		</svg>
	),
	shield: (c: string = C.yellow, s = 120) => (
		<svg width={s} height={s} viewBox="0 0 120 120">
			<path d="M60 6 L106 22 V56 C106 86 86 104 60 114 C34 104 14 86 14 56 V22 Z" fill="rgba(242,182,48,0.14)" stroke={c} strokeWidth="7" strokeLinejoin="round" />
			<path d="M38 60 L54 76 L84 44" fill="none" stroke={c} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	snow: (c: string = K.ice, s = 54) => (
		<svg width={s} height={s} viewBox="0 0 54 54">
			{[0, 60, 120].map((r) => (
				<g key={r} transform={`rotate(${r} 27 27)`}>
					<path d="M27 3 V51 M19 9 L27 16 L35 9 M19 45 L27 38 L35 45" fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" />
				</g>
			))}
		</svg>
	),
	user: (c: string = C.paper, s = 46) => (
		<svg width={s} height={s} viewBox="0 0 46 46">
			<circle cx="23" cy="15" r="9" fill={c} />
			<path d="M5 44 C5 31 13 26 23 26 C33 26 41 31 41 44 Z" fill={c} />
		</svg>
	),
};

/** Transaction tokens moving along a straight segment (p0→p1) between frames a and b. */
export const Stream: React.FC<{f: number; a: number; b: number; x0: number; y0: number; x1: number; y1: number; n?: number; color?: string; size?: number; seed?: number; speed?: number}> = ({
	f,
	a,
	b,
	x0,
	y0,
	x1,
	y1,
	n = 10,
	color = K.red,
	size = 16,
	seed = 1,
	speed = 1,
}) => {
	if (f < a || f > b) return null;
	const life = prog(f, a, a + 8) * (1 - prog(f, b - 8, b));
	const len = Math.hypot(x1 - x0, y1 - y0);
	const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
	return (
		<>
			<div style={{position: 'absolute', left: x0, top: y0 - 1.5, width: len, height: 3, background: `linear-gradient(90deg, ${color}00, ${color}88)`, transform: `rotate(${ang}deg)`, transformOrigin: '0 50%', opacity: life * 0.8}} />
			{Array.from({length: n}).map((_, i) => {
				const ph = ((f - a) * 0.035 * speed + i / n + rand(seed * 17 + i) * 0.05) % 1;
				const x = x0 + (x1 - x0) * ph;
				const y = y0 + (y1 - y0) * ph;
				const s = size * (0.7 + rand(seed + i * 3) * 0.6);
				return (
					<div
						key={i}
						style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, background: color, transform: `rotate(45deg)`, opacity: life * Math.min(1, ph * 6) * Math.min(1, (1 - ph) * 4), boxShadow: `0 0 12px ${color}`}}
					/>
				);
			})}
		</>
	);
};

/** Pulse ring (impact / alert). */
export const Ring: React.FC<{f: number; at: number; x: number; y: number; r?: number; color?: string; dur?: number}> = ({f, at, x, y, r = 220, color = K.red, dur = 22}) => {
	if (f < at || f > at + dur) return null;
	const t = (f - at) / dur;
	const rr = r * EASE.out(t);
	return <div style={{position: 'absolute', left: x - rr, top: y - rr, width: rr * 2, height: rr * 2, borderRadius: '50%', border: `${4 * (1 - t) + 1}px solid ${color}`, opacity: 1 - t}} />;
};

/** Grow-in helper for type blocks. */
export const rise = (f: number, at: number, dur = 9) => {
	const p = kf(f, [at, at + dur], [0, 1], EASE.out);
	return {opacity: p, transform: `translateY(${(1 - p) * 28}px)`};
};
