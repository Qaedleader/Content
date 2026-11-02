// Millionaire × AI episode kit. Reuses the cinematic layer of Video 7 (Shot, PixelCut, PixelMask, PixelRow, TechTag), the stage /
// stream parts of Video 10 and the editorial pieces of Video 11 (EdTag, Brackets, Sweep, Note, GoldDust). Adds the finance + AI layer:
// extruded money typography, product-style UI panels, the projection chart, a flip calendar, a pixel neural network and glyphs.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, rand} from '../../brand/anim';
import {C, FONT, SHADOW, W} from '../../brand/tokens';
import {PROJ} from './ep';

export {Shot, PixelCut, PixelMask, PixelRow, TechTag, appear} from '../asml/kit';
export {Stage, Stream, Ring, Cam, rise} from '../binance/kit';
export {EdTag, Brackets, Sweep, Note, Packets, GoldDust, G, fadeOut} from '../ramgold/kit';

export const K = {
	green: '#3FBF7F',
	greenGlow: 'rgba(63,191,127,0.45)',
	red: '#E5484D',
	ai: '#7FD6FF', // AI accent (cool cyan) — used only from the AI reveal onwards
	aiGlow: 'rgba(127,214,255,0.5)',
	ink: '#07090C',
	panel: 'rgba(14,18,26,0.92)',
	panelLine: 'rgba(154,165,174,0.28)',
	goldHot: '#FFE7A3',
	goldDeep: '#7A4E10',
} as const;

export const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

/** Extruded "3D" money / number typography (stacked offset layers + gold face + specular band). */
export const Money3D: React.FC<{text: string; size: number; depth?: number; face?: string; side?: string; glow?: number; shine?: number; style?: React.CSSProperties}> = ({
	text,
	size,
	depth = 14,
	face = 'linear-gradient(180deg, #FFF3C4 0%, #FFD35A 38%, #E9A21F 62%, #B9770F 100%)',
	side = K.goldDeep,
	glow = 0.6,
	shine = -1,
	style,
}) => {
	const base: React.CSSProperties = {fontFamily: FONT.mono, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: -size * 0.04, whiteSpace: 'nowrap'};
	return (
		<div dir="ltr" style={{position: 'relative', display: 'inline-block', ...style}}>
			{Array.from({length: depth}).map((_, i) => (
				<span key={i} style={{...base, position: 'absolute', left: (i + 1) * 0.55, top: (i + 1) * 0.9, color: i === depth - 1 ? '#2a1a05' : side}}>
					{text}
				</span>
			))}
			<span
				style={{
					...base,
					position: 'relative',
					display: 'block',
					backgroundImage: face,
					WebkitBackgroundClip: 'text',
					backgroundClip: 'text',
					color: 'transparent',
					filter: glow > 0 ? `drop-shadow(0 0 ${30 * glow}px rgba(242,182,48,${0.55 * glow}))` : undefined,
				}}
			>
				{text}
			</span>
			{shine >= 0 ? (
				<span
					style={{
						...base,
						position: 'absolute',
						left: 0,
						top: 0,
						backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${shine * 160 - 40}%, rgba(255,255,255,0.95) ${shine * 160 - 25}%, rgba(255,255,255,0) ${shine * 160 - 10}%)`,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						color: 'transparent',
					}}
				>
					{text}
				</span>
			) : null}
		</div>
	);
};

/** Product-style UI panel (dark, thin border, header with window dots + title + optional live tag). */
export const Panel: React.FC<{w: number; h?: number; title?: string; tag?: string; accent?: string; style?: React.CSSProperties; children?: React.ReactNode; dirTitle?: 'rtl' | 'ltr'}> = ({
	w,
	h,
	title,
	tag,
	accent = C.yellow,
	style,
	children,
	dirTitle = 'ltr',
}) => (
	<div style={{width: w, height: h, background: K.panel, border: `2px solid ${K.panelLine}`, borderRadius: 18, boxShadow: '0 30px 60px rgba(0,0,0,0.55)', overflow: 'hidden', position: 'relative', ...style}}>
		{title !== undefined ? (
			<div style={{height: 54, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', borderBottom: `2px solid ${K.panelLine}`, direction: 'ltr'}}>
				{['#E5484D', '#F2B630', '#3FBF7F'].map((c) => (
					<span key={c} style={{width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.85}} />
				))}
				<span dir={dirTitle} style={{flex: 1, textAlign: dirTitle === 'rtl' ? 'right' : 'left', marginLeft: 12, fontFamily: dirTitle === 'rtl' ? FONT.label : FONT.mono, fontWeight: 700, fontSize: 22, color: 'rgba(244,236,221,0.82)', whiteSpace: 'nowrap'}}>
					{title}
				</span>
				{tag ? <span style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 18, color: K.ink, background: accent, padding: '2px 10px', borderRadius: 4}}>{tag}</span> : null}
			</div>
		) : null}
		{children}
	</div>
);

/** Projection chart: value curve (gold area) vs money paid in (cream line), years 0→30. `t` 0..1 draws the years. */
export const GrowthChart: React.FC<{w: number; h: number; t: number; f: number; showPaid?: number; marker?: boolean}> = ({w, h, t, f, showPaid = 1, marker = true}) => {
	const ys = PROJ.years;
	const max = 1100000;
	const padL = 20;
	const padR = 20;
	const X = (yr: number) => padL + ((w - padL - padR) * yr) / 30;
	const Y = (v: number) => h - (v / max) * h;
	const yrNow = 30 * t;
	const valAt = (yr: number) => {
		const i = Math.floor(yr);
		const fr = yr - i;
		return i >= 30 ? ys[30] : ys[i] + (ys[i + 1] - ys[i]) * fr;
	};
	const steps = Math.max(1, Math.ceil(yrNow * 4));
	const pts: [number, number][] = [];
	for (let k = 0; k <= steps; k++) {
		const yr = (yrNow * k) / steps;
		pts.push([X(yr), Y(valAt(yr))]);
	}
	const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
	const area = `${line} L${X(yrNow).toFixed(1)} ${h} L${X(0)} ${h} Z`;
	const paidLine = `M${X(0)} ${Y(0)} L${X(yrNow)} ${Y(6000 * yrNow)}`;
	const head = pts[pts.length - 1];
	return (
		<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id="gcArea" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="rgba(242,182,48,0.55)" />
					<stop offset="1" stopColor="rgba(242,182,48,0.02)" />
				</linearGradient>
			</defs>
			{/* grid: $250k steps */}
			{[250000, 500000, 750000, 1000000].map((v) => (
				<g key={v}>
					<line x1={padL} x2={w - padR} y1={Y(v)} y2={Y(v)} stroke="rgba(244,236,221,0.12)" strokeWidth={2} strokeDasharray={v === 1000000 ? '0' : '6 8'} />
					<text x={w - padR} y={Y(v) - 10} textAnchor="end" fontFamily={FONT.mono} fontWeight={700} fontSize={22} fill={v === 1000000 ? C.yellow : 'rgba(244,236,221,0.5)'}>
						{v === 1000000 ? '$1M' : `$${v / 1000}k`}
					</text>
				</g>
			))}
			{/* year ticks */}
			{[0, 5, 10, 15, 20, 25, 30].map((yr) => (
				<g key={yr} opacity={yr <= yrNow + 0.01 ? 1 : 0.35}>
					<line x1={X(yr)} x2={X(yr)} y1={h} y2={h + 12} stroke="rgba(244,236,221,0.6)" strokeWidth={2} />
					<text x={X(yr)} y={h + 42} textAnchor="middle" fontFamily={FONT.mono} fontWeight={700} fontSize={24} fill="rgba(244,236,221,0.8)">
						{yr}
					</text>
				</g>
			))}
			<line x1={padL} x2={w - padR} y1={h} y2={h} stroke="rgba(244,236,221,0.6)" strokeWidth={3} />
			<path d={area} fill="url(#gcArea)" />
			<path d={line} fill="none" stroke={C.yellow} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" style={{filter: 'drop-shadow(0 0 10px rgba(242,182,48,0.7))'}} />
			<path d={paidLine} fill="none" stroke={C.paper} strokeWidth={4} strokeDasharray="10 8" opacity={showPaid} />
			{marker && t > 0.01 ? (
				<g>
					<circle cx={head[0]} cy={head[1]} r={14 + 3 * Math.sin(f / 3)} fill="rgba(242,182,48,0.35)" />
					<circle cx={head[0]} cy={head[1]} r={9} fill={K.goldHot} />
				</g>
			) : null}
		</svg>
	);
};

/** Tear-off calendar block showing a year (flip progress `flip` 0..1 tears the current page down). */
export const CalendarBlock: React.FC<{year: number; flip?: number; w?: number; tone?: number}> = ({year, flip = 0, w = 420, tone = 0}) => {
	const h = w * 1.08;
	const page = (y: number, extra: React.CSSProperties = {}) => (
		<div style={{position: 'absolute', left: 0, top: h * 0.16, width: w, height: h * 0.84, background: C.paperWhite, borderRadius: '0 0 14px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...extra}}>
			<div style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: w * 0.34, color: tone > 0.5 ? C.terracotta : C.charcoal, lineHeight: 1}}>{y}</div>
			<div style={{marginTop: 18, display: 'flex', gap: 8}}>
				{Array.from({length: 12}).map((_, i) => (
					<div key={i} style={{width: w * 0.045, height: w * 0.045, background: i < 12 ? 'rgba(38,35,33,0.22)' : 'transparent'}} />
				))}
			</div>
		</div>
	);
	return (
		<div style={{position: 'relative', width: w, height: h, filter: SHADOW.lifted}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: w, height: h * 0.2, background: tone > 0.5 ? C.terracotta : C.yellow, borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<span dir="rtl" style={{fontFamily: FONT.display, fontWeight: 800, fontSize: w * 0.075, color: C.charcoal}}>
					السنة
				</span>
			</div>
			{[0.3, 0.7].map((x) => (
				<div key={x} style={{position: 'absolute', left: w * x - 10, top: -18, width: 20, height: 46, borderRadius: 10, background: C.steelDark, zIndex: 3}} />
			))}
			{page(year + 1)}
			{page(year, {transformOrigin: '50% 0%', transform: `perspective(1200px) rotateX(${flip * 100}deg)`, opacity: 1 - prog(flip, 0.6, 1, EASE.linear), boxShadow: '0 4px 0 rgba(0,0,0,0.08)'})}
		</div>
	);
};

/** Pixel neural network: layered nodes; `draw` 0..1 builds edges left→right; pulses travel along edges. */
export const NeuralNet: React.FC<{f: number; draw: number; w: number; h: number; layers?: number[]; color?: string; seed?: number; pulse?: number}> = ({
	f,
	draw,
	w,
	h,
	layers = [4, 7, 7, 5, 3],
	color = K.ai,
	seed = 3,
	pulse = 1,
}) => {
	const L = layers.length;
	const pos = layers.map((n, li) => Array.from({length: n}).map((_, k) => [((li + 0.5) / L) * w, ((k + 0.5) / n) * h + (rand(seed * 31 + li * 7 + k) - 0.5) * 20] as [number, number]));
	const edges: {a: [number, number]; b: [number, number]; li: number; k: number}[] = [];
	for (let li = 0; li < L - 1; li++)
		pos[li].forEach((a, i) =>
			pos[li + 1].forEach((b, j) => {
				if (rand(seed * 97 + li * 53 + i * 11 + j) < 0.62) edges.push({a, b, li, k: i * 13 + j});
			}),
		);
	return (
		<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible'}}>
			{edges.map((e, i) => {
				const p = Math.max(0, Math.min(1, draw * L - e.li - 0.2));
				if (p <= 0) return null;
				const x2 = e.a[0] + (e.b[0] - e.a[0]) * p;
				const y2 = e.a[1] + (e.b[1] - e.a[1]) * p;
				const ph = ((f * 0.04 + rand(e.k + i) * 7) % 1 + 1) % 1;
				return (
					<g key={i}>
						<line x1={e.a[0]} y1={e.a[1]} x2={x2} y2={y2} stroke={color} strokeOpacity={0.28} strokeWidth={2} />
						{pulse > 0 && p >= 1 && rand(i * 3 + seed) < 0.35 ? (
							<rect x={e.a[0] + (e.b[0] - e.a[0]) * ph - 5} y={e.a[1] + (e.b[1] - e.a[1]) * ph - 5} width={10} height={10} fill={rand(i) < 0.25 ? C.yellow : color} opacity={pulse * 0.95} />
						) : null}
					</g>
				);
			})}
			{pos.map((col, li) =>
				col.map(([x, y], k) => {
					const p = Math.max(0, Math.min(1, draw * L * 1.1 - li));
					const s = 22 * p;
					const lit = 0.55 + 0.45 * Math.abs(Math.sin((f + li * 9 + k * 5) / 9));
					return <rect key={`${li}-${k}`} x={x - s / 2} y={y - s / 2} width={s} height={s} fill={li === L - 1 ? C.yellow : color} opacity={lit} style={{filter: `drop-shadow(0 0 8px ${li === L - 1 ? 'rgba(242,182,48,0.8)' : K.aiGlow})`}} />;
				}),
			)}
		</svg>
	);
};

/** Vector glyphs (no font dependency — ✓ is missing from the brand fonts). */
export const Ico = {
	check: (s = 56, c: string = K.green) => (
		<svg width={s} height={s} viewBox="0 0 56 56">
			<circle cx="28" cy="28" r="25" fill="none" stroke={c} strokeWidth="5" />
			<path d="M16 29 L25 38 L41 19" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	cross: (s = 56, c: string = K.red) => (
		<svg width={s} height={s} viewBox="0 0 56 56">
			<circle cx="28" cy="28" r="25" fill="none" stroke={c} strokeWidth="5" />
			<path d="M19 19 L37 37 M37 19 L19 37" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" />
		</svg>
	),
	person: (s = 120, c: string = C.paper) => (
		<svg width={s} height={s} viewBox="0 0 120 120">
			<circle cx="60" cy="36" r="22" fill={c} />
			<path d="M18 116 C18 82 36 68 60 68 C84 68 102 82 102 116 Z" fill={c} />
		</svg>
	),
	plus: (s = 40, c: string = C.charcoal) => (
		<svg width={s} height={s} viewBox="0 0 40 40">
			<path d="M20 6 V34 M6 20 H34" stroke={c} strokeWidth="7" strokeLinecap="round" />
		</svg>
	),
	bell: (s = 44, c: string = C.charcoal) => (
		<svg width={s} height={s} viewBox="0 0 44 44">
			<path d="M22 5 C14 5 10 11 10 18 V27 L6 33 H38 L34 27 V18 C34 11 30 5 22 5 Z" fill={c} />
			<circle cx="22" cy="38" r="4.5" fill={c} />
		</svg>
	),
	chat: (s = 44, c: string = C.charcoal) => (
		<svg width={s} height={s} viewBox="0 0 44 44">
			<path d="M6 8 H38 Q40 8 40 10 V30 Q40 32 38 32 H18 L9 40 V32 H6 Q4 32 4 30 V10 Q4 8 6 8 Z" fill={c} />
		</svg>
	),
	cart: (s = 44, c: string = C.charcoal) => (
		<svg width={s} height={s} viewBox="0 0 44 44">
			<path d="M3 6 H10 L15 28 H36 L40 12 H12" fill="none" stroke={c} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
			<circle cx="18" cy="36" r="3.6" fill={c} />
			<circle cx="33" cy="36" r="3.6" fill={c} />
		</svg>
	),
};

/** Coin-like pixel deposit square ($). */
export const Coin: React.FC<{s?: number; label?: string}> = ({s = 64, label = '$'}) => (
	<div style={{width: s, height: s, background: C.yellow, border: `${Math.max(3, s * 0.07)}px solid ${K.goldDeep}`, boxShadow: `inset -${s * 0.1}px -${s * 0.1}px 0 rgba(122,78,16,0.45), 0 0 18px rgba(242,182,48,0.5)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.mono, fontWeight: 800, fontSize: s * 0.52, color: K.goldDeep}}>
		{label}
	</div>
);

/** Thin horizontal light scan line (UI "live" feel). */
export const Scan: React.FC<{f: number; h: number; speed?: number; color?: string}> = ({f, h, speed = 9, color = 'rgba(127,214,255,0.10)'}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: (f * speed) % h, height: 40, background: `linear-gradient(180deg, rgba(0,0,0,0), ${color}, rgba(0,0,0,0))`, pointerEvents: 'none'}} />
);

/** Dark tech stage with a faint pixel grid (AI chapters). */
export const GridStage: React.FC<{f: number; tint?: string; o?: number}> = ({f, tint = 'rgba(127,214,255,0.10)', o = 1}) => (
	<AbsoluteFill style={{background: `radial-gradient(ellipse 90% 60% at 50% 40%, #15202F 0%, #0B1119 60%, ${K.ink} 100%)`, opacity: o}}>
		<AbsoluteFill style={{backgroundImage: `linear-gradient(${tint} 2px, transparent 2px), linear-gradient(90deg, ${tint} 2px, transparent 2px)`, backgroundSize: '60px 60px', backgroundPosition: `0 ${(f * 0.6) % 60}px`, WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 100%)', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 100%)'}} />
	</AbsoluteFill>
);

export const ease = kf;
export const _k = {pop, W};
