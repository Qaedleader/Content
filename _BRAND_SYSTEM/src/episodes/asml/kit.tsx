// ASML episode kit: cinematic full-bleed real media + pixel details, built on the brand parts.
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {EASE, kf, pop, prog, rand} from '../../brand/anim';
import {Credit} from '../../brand/media';
import {C, FONT, H, SHADOW, W} from '../../brand/tokens';

// scale + px offsets (clamped to the zoom margin so frame edges never show) + horizontal object-position pan in %
export type Move = {s0: number; s1: number; x0?: number; x1?: number; y0?: number; y1?: number; p0?: number; p1?: number};

/** Full-bleed real media (photo or footage) with a controlled camera move and a restrained documentary grade. */
export const Shot: React.FC<{
	f: number;
	a: number; // first frame
	b: number; // last frame
	src: string;
	credit?: string;
	kind?: string;
	move?: Move;
	trim?: number; // seconds skipped at clip start
	rate?: number;
	pos?: string; // object-position
	grade?: string;
	dim?: number; // extra darkening 0..1 (for typography over media)
	fadeIn?: number; // frames of fade-in (0 = hard cut)
	creditY?: number;
	ease?: (x: number) => number;
	fit?: 'cover' | 'contain';
	children?: React.ReactNode;
}> = ({f, a, b, src, credit, kind, move = {s0: 1.04, s1: 1.12}, trim = 0, rate = 1, pos = 'center', grade, dim = 0, fadeIn = 0, creditY = 1488, ease = EASE.linear, fit = 'cover', children}) => {
	if (f < a || f > b) return null;
	const t = prog(f, a, b, ease);
	const s = move.s0 + (move.s1 - move.s0) * t;
	const mx = Math.max(0, (s - 1) * 540);
	const my = Math.max(0, (s - 1) * 960);
	const x = Math.max(-mx, Math.min(mx, (move.x0 ?? 0) + ((move.x1 ?? 0) - (move.x0 ?? 0)) * t));
	const y = Math.max(-my, Math.min(my, (move.y0 ?? 0) + ((move.y1 ?? 0) - (move.y0 ?? 0)) * t));
	const objPos = move.p0 !== undefined ? `${move.p0 + ((move.p1 ?? move.p0) - move.p0) * t}% 50%` : pos;
	const video = src.endsWith('.mp4');
	const style: React.CSSProperties = {
		width: '100%',
		height: '100%',
		objectFit: fit,
		objectPosition: objPos,
		transform: `translate(${x}px, ${y}px) scale(${s})`,
		filter: grade ?? 'contrast(1.08) saturate(0.92) brightness(0.96)',
	};
	const o = fadeIn > 0 ? kf(f, [a, a + fadeIn], [0, 1]) : 1;
	return (
		<AbsoluteFill style={{opacity: o, overflow: 'hidden', background: '#07090c'}}>
			{video ? (
				<Sequence from={a} layout="none">
					<OffthreadVideo src={staticFile(src)} muted trimBefore={Math.round(trim * 30)} playbackRate={rate} style={style} />
				</Sequence>
			) : (
				<Img src={staticFile(src)} style={style} />
			)}
			{/* cinematic grade: top/bottom falloff for type, soft vignette, warm-cool split */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,10,14,0.55) 0%, rgba(8,10,14,0) 22%, rgba(8,10,14,0) 58%, rgba(8,10,14,0.72) 100%)'}} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 62% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)'}} />
			{dim > 0 ? <AbsoluteFill style={{background: `rgba(8,10,14,${dim})`}} /> : null}
			{children}
			{credit ? (
				<div style={{position: 'absolute', left: 44, top: creditY}}>
					<Credit kind={kind ?? (video ? 'لقطات حقيقية' : 'صورة حقيقية')} text={credit} size={20} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Pixel-block cut: brand-yellow / cream squares flick over the frame around a cut at frame `at`. */
export const PixelCut: React.FC<{f: number; at: number; cell?: number; density?: number; seed?: number; dur?: number}> = ({f, at, cell = 90, density = 0.55, seed = 3, dur = 5}) => {
	if (f < at - dur || f > at + dur) return null;
	const cols = Math.ceil(W / cell);
	const rows = Math.ceil(H / cell);
	const cells: React.ReactNode[] = [];
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const k = r * cols + c;
			const rr = rand(seed * 7919 + k);
			if (rr > density) continue;
			// each cell lives in a short window around the cut, staggered by a diagonal sweep
			const sweep = (c / cols + r / rows) / 2;
			const on = at - dur + Math.round(sweep * dur * 0.9 + rand(k + seed) * 2);
			const off = on + 2 + Math.round(rand(k * 3 + seed) * 3);
			if (f < on || f > off) continue;
			const col = rr < density * 0.22 ? C.yellow : rr < density * 0.3 ? C.paperWhite : 'rgba(10,12,16,0.92)';
			cells.push(<div key={k} style={{position: 'absolute', left: c * cell, top: r * cell, width: cell, height: cell, background: col}} />);
		}
	}
	return <AbsoluteFill style={{pointerEvents: 'none'}}>{cells}</AbsoluteFill>;
};

/** Row of pixel squares (progress / section marker), as in the brand's UI cards. */
export const PixelRow: React.FC<{n: number; lit: number; size?: number; gap?: number; color?: string; off?: string}> = ({n, lit, size = 16, gap = 6, color = C.yellow, off = 'rgba(251,248,241,0.28)'}) => (
	<div style={{display: 'flex', gap, direction: 'ltr'}}>
		{Array.from({length: n}).map((_, i) => (
			<div key={i} style={{width: size, height: size, background: i < lit ? color : off}} />
		))}
	</div>
);

/** Pixel mosaic that hides something until `reveal` (the cells dissolve out). */
export const PixelMask: React.FC<{f: number; reveal: number; w: number; h: number; cell?: number; seed?: number; dur?: number}> = ({f, reveal, w, h, cell = 28, seed = 2, dur = 9}) => {
	const cols = Math.ceil(w / cell);
	const rows = Math.ceil(h / cell);
	const out: React.ReactNode[] = [];
	for (let r = 0; r < rows; r++)
		for (let c = 0; c < cols; c++) {
			const k = r * cols + c;
			const gone = reveal + Math.round(rand(seed * 31 + k) * dur);
			if (f >= gone) continue;
			const shade = rand(seed * 17 + k + Math.floor(f / 3));
			out.push(
				<div
					key={k}
					style={{position: 'absolute', left: c * cell, top: r * cell, width: cell + 0.5, height: cell + 0.5, background: shade > 0.82 ? C.yellow : shade > 0.45 ? '#2a2f38' : '#171b22'}}
				/>,
			);
		}
	return <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>{out}</div>;
};

/** Flag (official SVG from Wikimedia Commons) on a small paper mount. */
export const Flag: React.FC<{src: string; w?: number; rot?: number}> = ({src, w = 120, rot = -3}) => (
	<div style={{display: 'inline-block', padding: 6, background: C.paperWhite, borderRadius: 4, transform: `rotate(${rot}deg)`, filter: SHADOW.contact}}>
		<Img src={staticFile(src)} style={{width: w, height: (w * 2) / 3, objectFit: 'cover', display: 'block'}} />
	</div>
);

/** Company identity plate: logo on a white card + flag + country label. */
export const IdentityPlate: React.FC<{f: number; at: number; logo: string; logoW: number; flag: string; country: string; role?: string; x: number; y: number; s?: number; rot?: number}> = ({
	f,
	at,
	logo,
	logoW,
	flag,
	country,
	role,
	x,
	y,
	s = 1,
	rot = -2,
}) => {
	if (f < at) return null;
	const p = pop(f, at, {damping: 12, stiffness: 220, mass: 0.7});
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s * (0.5 + 0.5 * p)}) rotate(${rot + (1 - p) * 8}deg)`, opacity: Math.min(1, p * 2)}}>
			<div style={{position: 'relative', background: C.paperWhite, padding: '30px 44px 24px', borderRadius: 8, filter: SHADOW.lifted, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
				<Img src={staticFile(logo)} style={{width: logoW, display: 'block'}} />
				<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 14}}>
					<Img src={staticFile(flag)} style={{width: 66, height: 44, objectFit: 'cover', boxShadow: '0 0 0 1.5px rgba(0,0,0,0.18)'}} />
					<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 34, color: C.charcoal}}>{country}</span>
				</div>
				{role ? (
					<div dir="rtl" style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 26, color: C.charcoal, background: C.yellow, padding: '4px 16px 6px', borderRadius: 4}}>
						{role}
					</div>
				) : null}
			</div>
		</div>
	);
};

/** Small mono tech label (Latin), e.g. «13.5 nm». */
export const TechTag: React.FC<{text: string; size?: number; color?: string; bg?: string; style?: React.CSSProperties}> = ({text, size = 30, color = C.charcoal, bg = C.yellow, style}) => (
	<div dir="ltr" style={{display: 'inline-block', fontFamily: FONT.mono, fontWeight: 800, fontSize: size, color, background: bg, padding: `${size * 0.12}px ${size * 0.4}px`, borderRadius: 3, filter: SHADOW.soft, whiteSpace: 'nowrap', ...style}}>
		{text}
	</div>
);

export const appear = (f: number, at: number, dur = 8) => {
	const p = kf(f, [at, at + dur], [0, 1], EASE.out);
	return {opacity: p, transform: `translateY(${(1 - p) * 24}px)`};
};
