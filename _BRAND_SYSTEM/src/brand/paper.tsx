import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {boil, rand} from './anim';
import {C, SHADOW} from './tokens';

export const TEX = {
	grain: () => staticFile('brand/textures/paper_grain.png'),
	fibers: () => staticFile('brand/textures/paper_fibers.png'),
	kraft: () => staticFile('brand/textures/kraft.png'),
};

/** Hand-cut edge: a polygon with jittered points along each side (CSS clip-path). */
export const roughPolygon = (w: number, h: number, seed: number, amp = 3, step = 46) => {
	const pts: string[] = [];
	const j = (k: number) => (rand(seed * 977 + k) - 0.5) * 2 * amp;
	let k = 0;
	const side = (x0: number, y0: number, x1: number, y1: number) => {
		const len = Math.hypot(x1 - x0, y1 - y0);
		const n = Math.max(2, Math.round(len / step));
		for (let i = 0; i < n; i++) {
			const t = i / n;
			const nx = (y1 - y0) / len;
			const ny = -(x1 - x0) / len;
			const d = i === 0 ? j(k++) * 0.4 : j(k++);
			pts.push(`${(x0 + (x1 - x0) * t + nx * d).toFixed(1)}px ${(y0 + (y1 - y0) * t + ny * d).toFixed(1)}px`);
		}
	};
	const a = Math.abs(amp);
	side(a, a, w - a, a);
	side(w - a, a, w - a, h - a);
	side(w - a, h - a, a, h - a);
	side(a, h - a, a, a);
	return `polygon(${pts.join(',')})`;
};

/** Torn edge on one side only (bottom), for torn paper strips. */
export const tornPolygon = (w: number, h: number, seed: number, amp = 9, step = 14) => {
	const pts: string[] = ['0px 0px', `${w}px 0px`];
	const n = Math.round(w / step);
	for (let i = 0; i <= n; i++) {
		const x = w - (i / n) * w;
		pts.push(`${x.toFixed(1)}px ${(h - amp - rand(seed * 131 + i) * amp).toFixed(1)}px`);
	}
	return `polygon(${pts.join(',')})`;
};

type PaperProps = {
	x?: number;
	y?: number;
	w: number;
	h: number;
	color?: string;
	rot?: number;
	scale?: number;
	seed?: number;
	rough?: number;
	shadow?: keyof typeof SHADOW | 'none';
	texture?: boolean;
	origin?: string;
	opacity?: number;
	radius?: number;
	style?: React.CSSProperties;
	innerStyle?: React.CSSProperties;
	children?: React.ReactNode;
};

/** A sheet of cut paper (HTML layer) with fibre texture and contact shadow. x/y = top-left. */
export const Paper: React.FC<PaperProps> = ({
	x = 0,
	y = 0,
	w,
	h,
	color = C.paper,
	rot = 0,
	scale = 1,
	seed = 1,
	rough = 2.5,
	shadow = 'contact',
	texture = true,
	origin = 'center',
	opacity = 1,
	radius = 0,
	style,
	innerStyle,
	children,
}) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: y,
			width: w,
			height: h,
			transform: `rotate(${rot}deg) scale(${scale})`,
			transformOrigin: origin,
			filter: shadow === 'none' ? undefined : SHADOW[shadow],
			opacity,
			...style,
		}}
	>
		<div
			style={{
				position: 'absolute',
				inset: 0,
				background: color,
				clipPath: rough > 0 ? roughPolygon(w, h, seed, rough) : undefined,
				borderRadius: radius,
				overflow: 'hidden',
				...innerStyle,
			}}
		>
			{texture ? (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						backgroundImage: `url(${TEX.fibers()})`,
						backgroundSize: '512px 512px',
						backgroundPosition: `${(seed * 137) % 512}px ${(seed * 71) % 512}px`,
						opacity: 0.55,
					}}
				/>
			) : null}
			{children}
		</div>
	</div>
);

/** Full-frame paper grain (multiply) with stop-motion boil + soft vignette. Put it on top of everything. */
export const PaperGrade: React.FC<{frame: number; strength?: number; vignette?: number}> = ({frame, strength = 0.85, vignette = 0.42}) => {
	const ox = Math.round(boil(frame, 3, 180, 3));
	const oy = Math.round(boil(frame, 9, 180, 3));
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill
				style={{
					backgroundImage: `url(${TEX.grain()})`,
					backgroundSize: '1024px 1024px',
					backgroundPosition: `${ox}px ${oy}px`,
					mixBlendMode: 'multiply',
					opacity: strength,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 75% 62% at 50% 46%, rgba(0,0,0,0) 55%, rgba(18,12,6,${vignette}) 100%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: 'linear-gradient(180deg, rgba(255,236,200,0.06) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.10) 100%)',
					mixBlendMode: 'soft-light',
				}}
			/>
		</AbsoluteFill>
	);
};

export type Pattern = 'none' | 'stripes' | 'grid' | 'dots' | 'rays' | 'blueprint' | 'tiles';

const patternCss = (p: Pattern, ink: string): React.CSSProperties => {
	switch (p) {
		case 'stripes':
			return {backgroundImage: `repeating-linear-gradient(90deg, ${ink} 0 70px, transparent 70px 140px)`};
		case 'grid':
			return {
				backgroundImage: `linear-gradient(${ink} 2px, transparent 2px), linear-gradient(90deg, ${ink} 2px, transparent 2px)`,
				backgroundSize: '90px 90px',
			};
		case 'blueprint':
			return {
				backgroundImage: `linear-gradient(${ink} 1.5px, transparent 1.5px), linear-gradient(90deg, ${ink} 1.5px, transparent 1.5px), linear-gradient(${ink} 1px, transparent 1px), linear-gradient(90deg, ${ink} 1px, transparent 1px)`,
				backgroundSize: '180px 180px, 180px 180px, 36px 36px, 36px 36px',
			};
		case 'dots':
			return {backgroundImage: `radial-gradient(${ink} 3px, transparent 3.5px)`, backgroundSize: '44px 44px'};
		case 'tiles':
			return {
				backgroundImage: `linear-gradient(${ink} 4px, transparent 4px), linear-gradient(90deg, ${ink} 4px, transparent 4px)`,
				backgroundSize: '120px 120px',
			};
		case 'rays':
			return {backgroundImage: `repeating-conic-gradient(from 0deg at 50% 62%, ${ink} 0deg 9deg, transparent 9deg 18deg)`};
		default:
			return {};
	}
};

/** Scene backdrop: coloured paper wall + optional printed pattern + optional table/floor band. */
export const Backdrop: React.FC<{
	color: string;
	pattern?: Pattern;
	ink?: string;
	floorY?: number;
	floorColor?: string;
	floorEdge?: string;
	light?: number;
}> = ({color, pattern = 'none', ink = 'rgba(255,255,255,0.06)', floorY, floorColor = C.kraft, floorEdge = C.kraftDark, light = 0.16}) => (
	<AbsoluteFill style={{background: color}}>
		<AbsoluteFill style={patternCss(pattern, ink)} />
		<AbsoluteFill style={{background: `radial-gradient(ellipse 70% 45% at 50% 30%, rgba(255,248,230,${light}) 0%, rgba(0,0,0,0) 70%)`}} />
		{floorY !== undefined ? (
			<>
				<div style={{position: 'absolute', left: 0, right: 0, top: floorY, bottom: 0, background: floorColor}} />
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: floorY,
						bottom: 0,
						backgroundImage: `url(${TEX.kraft()})`,
						backgroundSize: '768px 768px',
						mixBlendMode: 'multiply',
						opacity: 0.9,
					}}
				/>
				<div style={{position: 'absolute', left: 0, right: 0, top: floorY, height: 14, background: floorEdge, opacity: 0.85}} />
				<div style={{position: 'absolute', left: 0, right: 0, top: floorY - 26, height: 26, background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.22))'}} />
			</>
		) : null}
	</AbsoluteFill>
);
