import React from 'react';
import {EASE, kf, pop, prog, rand} from './anim';
import {roughPolygon, TEX, tornPolygon} from './paper';
import {CaptionChunk, Word} from './timing';
import {C, FONT, FPS, SAFE, SHADOW, W} from './tokens';

const fibreLayer = (seed: number, opacity = 0.5): React.CSSProperties => ({
	backgroundImage: `url(${TEX.fibers()})`,
	backgroundSize: '512px 512px',
	backgroundPosition: `${(seed * 97) % 512}px ${(seed * 53) % 512}px`,
	opacity,
});

/** One word on its own strip of paper (caption unit). */
export const PaperWord: React.FC<{
	text: string;
	size: number;
	bg?: string;
	fg?: string;
	seed: number;
	scale?: number;
	rot?: number;
	dy?: number;
	font?: string;
	weight?: number;
}> = ({text, size, bg = C.paper, fg = C.charcoal, seed, scale = 1, rot = 0, dy = 0, font = FONT.caption, weight = 800}) => {
	const padX = size * 0.36;
	const padTop = size * 0.12;
	const padBottom = size * 0.2;
	return (
		<div style={{display: 'inline-block', position: 'relative', transform: `translateY(${dy}px) rotate(${rot}deg) scale(${scale})`, filter: SHADOW.contact}}>
			<div
				style={{
					position: 'relative',
					background: bg,
					padding: `${padTop}px ${padX}px ${padBottom}px`,
					borderRadius: `${3 + rand(seed) * 4}px ${2 + rand(seed + 1) * 5}px ${3 + rand(seed + 2) * 4}px ${2 + rand(seed + 3) * 5}px`,
				}}
			>
				<div style={{position: 'absolute', inset: 0, ...fibreLayer(seed)}} />
				<span
					dir="rtl"
					style={{
						position: 'relative',
						fontFamily: font,
						fontWeight: weight,
						fontSize: size,
						lineHeight: 1.25,
						color: fg,
						whiteSpace: 'nowrap',
						display: 'block',
					}}
				>
					{text}
				</span>
			</div>
		</div>
	);
};

/** Word-synchronised caption strips (RTL), 1–3 words per chunk, emphasis words on signature yellow. */
export const CaptionTrack: React.FC<{
	frame: number;
	words: Word[];
	chunks: CaptionChunk[];
	emphasis: Set<number>;
	hidden?: [number, number][]; // frame ranges where captions are suppressed (e.g. hero text says the same)
	y?: number;
	lead?: number; // frames a word appears before its spoken onset
	theme?: (frame: number) => {bg: string; fg: string; hiBg: string; hiFg: string};
}> = ({frame, words, chunks, emphasis, hidden = [], y = SAFE.captionY, lead = 1, theme}) => {
	if (hidden.some(([a, b]) => frame >= a && frame <= b)) return null;
	const wf = (i: number) => Math.round(words[i].s * FPS) - lead;
	let active: CaptionChunk | undefined;
	for (let k = 0; k < chunks.length; k++) {
		const c = chunks[k];
		const start = wf(c.from);
		const nextStart = k + 1 < chunks.length ? wf(chunks[k + 1].from) : Infinity;
		const end = Math.min(nextStart - 1, Math.round(words[c.to].e * FPS) + 14);
		if (frame >= start && frame <= end) active = c;
	}
	if (!active) return null;
	const th = theme ? theme(frame) : {bg: C.paper, fg: C.charcoal, hiBg: C.yellow, hiFg: C.charcoal};
	const idx: number[] = [];
	for (let i = active.from; i <= active.to; i++) idx.push(i);
	const chars = idx.reduce((a, i) => a + words[i].w.length, 0) + idx.length;
	const size = chars > 22 ? 58 : chars > 16 ? 64 : 70;
	return (
		<div
			dir="rtl"
			style={{
				position: 'absolute',
				left: 40,
				width: W - 80,
				top: y - size,
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
				gap: 12,
			}}
		>
			{idx.map((i) => {
				const at = wf(i);
				if (frame < at) return <div key={i} style={{visibility: 'hidden'}} />;
				const p = pop(frame, at, {damping: 12, stiffness: 320, mass: 0.55});
				const hi = emphasis.has(i);
				const r = (rand(i * 7 + 3) - 0.5) * 6;
				const dy = (rand(i * 13 + 5) - 0.5) * 14;
				return (
					<PaperWord
						key={i}
						text={words[i].w.replace(/[.،,:]$/, '')}
						size={size}
						seed={i + 11}
						bg={hi ? th.hiBg : th.bg}
						fg={hi ? th.hiFg : th.fg}
						scale={0.55 + 0.45 * p}
						rot={r + (1 - p) * 8}
						dy={dy + (1 - p) * 24}
					/>
				);
			})}
		</div>
	);
};

/** Index-card headline (identity element): ruled cream card, red margin line, yellow binder clip. */
export const TitleCard: React.FC<{frame: number; at: number; text: string; out?: number; y?: number; size?: number; seed?: number; accent?: string}> = ({
	frame,
	at,
	text,
	out,
	y = SAFE.titleY,
	size = 52,
	seed = 5,
	accent = C.yellow,
}) => {
	if (frame < at - 1) return null;
	const p = pop(frame, at, {damping: 13, stiffness: 210, mass: 0.8});
	const o = out !== undefined ? prog(frame, out, out + 6, EASE.in) : 0;
	const rot = (rand(seed) - 0.5) * 3.2;
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				width: W,
				top: y - 72,
				display: 'flex',
				justifyContent: 'center',
				transform: `translateY(${(1 - p) * -260 - o * 260}px) rotate(${rot + (1 - p) * -6}deg)`,
				opacity: 1 - o,
			}}
		>
			<div style={{position: 'relative', filter: SHADOW.lifted}}>
				<div
					style={{
						position: 'relative',
						background: C.paperWhite,
						padding: '26px 54px 22px',
						minWidth: 520,
						maxWidth: 940,
						borderRadius: '5px 3px 6px 2px',
						overflow: 'hidden',
					}}
				>
					{/* ruled lines + red margin line, like an index card */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 33px, rgba(46,66,96,0.16) 33px 35px)',
							backgroundPosition: '0 14px',
						}}
					/>
					<div style={{position: 'absolute', left: 0, right: 0, top: 16, height: 3, background: 'rgba(198,90,62,0.55)'}} />
					<div style={{position: 'absolute', inset: 0, ...fibreLayer(seed, 0.6)}} />
					<div
						dir="rtl"
						style={{position: 'relative', fontFamily: FONT.display, fontWeight: 800, fontSize: size, lineHeight: 1.3, color: C.charcoal, textAlign: 'center', whiteSpace: 'nowrap'}}
					>
						{text}
					</div>
				</div>
				{/* binder clip */}
				<div style={{position: 'absolute', right: 34, top: -26, width: 64, height: 46, filter: SHADOW.soft}}>
					<div style={{position: 'absolute', inset: 0, background: accent, borderRadius: '6px 6px 2px 2px'}} />
					<div style={{position: 'absolute', left: 10, right: 10, top: -16, height: 22, border: `5px solid ${C.steelDark}`, borderBottom: 'none', borderRadius: '10px 10px 0 0'}} />
				</div>
			</div>
		</div>
	);
};

/** Big paper-cut hero word: coloured face over a darker cut layer (2-layer paper stack). */
export const HeroWord: React.FC<{
	text: string;
	size: number;
	face?: string;
	back?: string;
	depth?: number;
	font?: string;
	weight?: number;
	style?: React.CSSProperties;
	strip?: string; // optional paper strip behind the word
	stripSeed?: number;
}> = ({text, size, face = C.yellow, back = C.charcoal, depth = 9, font = FONT.hero, weight = 400, style, strip, stripSeed = 3}) => (
	<div style={{position: 'relative', display: 'inline-block', ...style}}>
		{strip ? (
			<div
				style={{
					position: 'absolute',
					left: -size * 0.28,
					right: -size * 0.28,
					top: size * 0.18,
					bottom: size * 0.02,
					background: strip,
					filter: SHADOW.contact,
					clipPath: tornPolygon(2000, 600, stripSeed, 0),
					transform: `rotate(${(rand(stripSeed) - 0.5) * 3}deg)`,
				}}
			/>
		) : null}
		<span
			dir="rtl"
			style={{
				position: 'absolute',
				left: depth * 0.45,
				top: depth,
				fontFamily: font,
				fontWeight: weight,
				fontSize: size,
				lineHeight: 1.15,
				color: back,
				whiteSpace: 'nowrap',
				filter: 'drop-shadow(0px 6px 5px rgba(0,0,0,0.35))',
			}}
		>
			{text}
		</span>
		<span
			dir="rtl"
			style={{position: 'relative', fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.15, color: face, whiteSpace: 'nowrap', display: 'block'}}
		>
			{text}
		</span>
	</div>
);

/** Rubber-stamp style tag (e.g. «سيناريو افتراضي», «رأي المتحدث»). */
export const Badge: React.FC<{text: string; color?: string; bg?: string; size?: number; rot?: number; style?: React.CSSProperties}> = ({
	text,
	color = C.terracotta,
	bg = 'rgba(251,248,241,0.94)',
	size = 26,
	rot = -3,
	style,
}) => (
	<div
		dir="rtl"
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 10,
			padding: '6px 16px 8px',
			border: `3.5px solid ${color}`,
			borderRadius: 8,
			color,
			background: bg,
			fontFamily: FONT.label,
			fontWeight: 700,
			fontSize: size,
			lineHeight: 1.3,
			transform: `rotate(${rot}deg)`,
			filter: SHADOW.soft,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		<span style={{width: size * 0.42, height: size * 0.42, borderRadius: '50%', background: color, display: 'inline-block'}} />
		{text}
	</div>
);

/** Small paper label used for media credits and diagram labels. */
export const Label: React.FC<{text: string; size?: number; bg?: string; fg?: string; rot?: number; seed?: number; font?: string; weight?: number; style?: React.CSSProperties; dir?: 'rtl' | 'ltr'}> = ({
	text,
	size = 30,
	bg = C.paperWhite,
	fg = C.charcoal,
	rot = 0,
	seed = 1,
	font = FONT.display,
	weight = 700,
	style,
	dir = 'rtl',
}) => (
	<div style={{display: 'inline-block', transform: `rotate(${rot}deg)`, filter: SHADOW.soft, ...style}}>
		<div style={{position: 'relative', background: bg, padding: `${size * 0.16}px ${size * 0.42}px ${size * 0.22}px`, borderRadius: 3}}>
			<div style={{position: 'absolute', inset: 0, ...fibreLayer(seed, 0.45)}} />
			<span dir={dir} style={{position: 'relative', fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.25, color: fg, whiteSpace: 'nowrap', display: 'block'}}>
				{text}
			</span>
		</div>
	</div>
);

/** Typewriter reveal helper for short Latin/mono strings. */
export const typed = (text: string, frame: number, at: number, cps = 26) => text.slice(0, Math.max(0, Math.floor(((frame - at) / FPS) * cps)));

export const fadeUp = (frame: number, at: number, dur = 8) => {
	const p = kf(frame, [at, at + dur], [0, 1], EASE.out);
	return {opacity: p, transform: `translateY(${(1 - p) * 30}px)`};
};
