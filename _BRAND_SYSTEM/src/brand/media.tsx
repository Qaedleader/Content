import React from 'react';
import {Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {EASE, kf, pop, rand} from './anim';
import {TEX} from './paper';
import {C, FONT, SHADOW} from './tokens';

/** Credit line shown with every piece of real media (evidence layer). */
export const Credit: React.FC<{kind?: string; text: string; size?: number; style?: React.CSSProperties}> = ({kind = 'صورة حقيقية', text, size = 19, style}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 8,
			padding: '4px 10px 5px',
			background: 'rgba(38,35,33,0.82)',
			color: C.paper,
			borderRadius: 4,
			fontFamily: FONT.label,
			fontWeight: 700,
			fontSize: size,
			lineHeight: 1.25,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		<span dir="rtl" style={{color: C.yellow}}>
			{kind}
		</span>
		<span dir="ltr" style={{fontFamily: FONT.label, opacity: 0.92}}>
			{text}
		</span>
	</div>
);

const Tape: React.FC<{x: number; y: number; rot: number; w?: number}> = ({x, y, rot, w = 120}) => (
	<div
		style={{
			position: 'absolute',
			left: x - w / 2,
			top: y - 18,
			width: w,
			height: 36,
			background: 'rgba(236,222,186,0.78)',
			transform: `rotate(${rot}deg)`,
			boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
			backgroundImage: `url(${TEX.fibers()})`,
			backgroundSize: '256px 256px',
		}}
	/>
);

type FrameProps = {
	x: number;
	y: number;
	w: number;
	h: number;
	rot?: number;
	frame: number;
	at: number; // entrance frame
	out?: number; // exit frame
	border?: number;
	seed?: number;
	tape?: boolean;
	credit?: {kind?: string; text: string};
	kb?: {from: number; to: number; x0?: number; x1?: number; y0?: number; y1?: number}; // Ken Burns (scale & % offsets)
	enter?: 'drop' | 'pop' | 'slideLeft' | 'slideRight' | 'none';
	children?: React.ReactNode;
	z?: number;
	grade?: string; // css filter for the media itself (gentle documentary grade only)
};

const entrance = (frame: number, at: number, kind: FrameProps['enter'], seed: number) => {
	if (kind === 'none') return {t: '', o: 1};
	const p = pop(frame, at, {damping: 13, stiffness: 170, mass: 0.85});
	if (kind === 'drop') return {t: `translateY(${(1 - p) * -900}px) rotate(${(1 - p) * (rand(seed) > 0.5 ? 12 : -12)}deg)`, o: 1};
	if (kind === 'slideLeft') return {t: `translateX(${(1 - p) * -1200}px) rotate(${(1 - p) * -8}deg)`, o: 1};
	if (kind === 'slideRight') return {t: `translateX(${(1 - p) * 1200}px) rotate(${(1 - p) * 8}deg)`, o: 1};
	return {t: `scale(${0.4 + 0.6 * p})`, o: Math.min(1, p * 3)};
};

/** Generic print frame: white photo border, tape, contact shadow, credit. Children = media. */
export const PrintFrame: React.FC<FrameProps> = ({x, y, w, h, rot = 0, frame, at, out, border = 16, seed = 1, tape = true, credit, enter = 'drop', children, z}) => {
	if (frame < at - 2) return null;
	if (out !== undefined && frame > out + 10) return null;
	const e = entrance(frame, at, enter, seed);
	const leave = out !== undefined ? kf(frame, [out, out + 10], [0, 1], EASE.in) : 0;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: w,
				height: h,
				transform: `${e.t} translateY(${leave * 1300}px) rotate(${rot + leave * 10}deg)`,
				opacity: e.o,
				filter: SHADOW.lifted,
				zIndex: z,
			}}
		>
			<div style={{position: 'absolute', inset: 0, background: C.paperWhite, borderRadius: 3}}>
				<div style={{position: 'absolute', inset: 0, backgroundImage: `url(${TEX.fibers()})`, backgroundSize: '512px 512px', opacity: 0.5}} />
				<div style={{position: 'absolute', left: border, top: border, right: border, bottom: border, overflow: 'hidden', background: '#111'}}>
					{children}
					{/* print sheen + slight paper multiply so photos sit in the paper world */}
					<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)'}} />
					<div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 18px rgba(0,0,0,0.35)'}} />
				</div>
			</div>
			{tape ? (
				<>
					<Tape x={w * 0.22} y={2} rot={-7 + rand(seed) * 6} />
					<Tape x={w * 0.8} y={4} rot={5 + rand(seed + 1) * 5} />
				</>
			) : null}
			{credit ? (
				<div style={{position: 'absolute', right: border, bottom: -40}}>
					<Credit kind={credit.kind} text={credit.text} />
				</div>
			) : null}
		</div>
	);
};

const kbStyle = (frame: number, at: number, kb?: FrameProps['kb'], dur = 120): React.CSSProperties => {
	if (!kb) return {};
	const t = kf(frame, [at, at + dur], [0, 1], EASE.linear);
	const s = kb.from + (kb.to - kb.from) * t;
	const tx = (kb.x0 ?? 0) + ((kb.x1 ?? 0) - (kb.x0 ?? 0)) * t;
	const ty = (kb.y0 ?? 0) + ((kb.y1 ?? 0) - (kb.y0 ?? 0)) * t;
	return {transform: `scale(${s}) translate(${tx}%, ${ty}%)`};
};

/** Real photograph as a taped print, with gentle Ken Burns move. */
export const PhotoPrint: React.FC<FrameProps & {src: string; kbDur?: number; objectPosition?: string}> = (p) => (
	<PrintFrame {...p}>
		<Img
			src={staticFile(p.src)}
			style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: p.objectPosition ?? 'center', filter: p.grade ?? 'saturate(0.92) contrast(1.04)', ...kbStyle(p.frame, p.at, p.kb, p.kbDur)}}
		/>
	</PrintFrame>
);

/** Real footage inside a taped print frame. Plays from `at` (trim = seconds skipped at clip start). */
export const FootagePrint: React.FC<FrameProps & {src: string; trim?: number; rate?: number; objectPosition?: string; kbDur?: number}> = (p) => (
	<PrintFrame {...p}>
		<Sequence from={p.at - 2} layout="none">
			<OffthreadVideo
				src={staticFile(p.src)}
				muted
				trimBefore={Math.round((p.trim ?? 0) * 30)}
				playbackRate={p.rate ?? 1}
				style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: p.objectPosition ?? 'center', filter: p.grade ?? 'saturate(0.95) contrast(1.04)', ...kbStyle(p.frame, p.at, p.kb, p.kbDur)}}
			/>
		</Sequence>
	</PrintFrame>
);

/** Retro paper TV / monitor body around footage (a "window" into the real world). */
export const PaperScreen: React.FC<{
	x: number;
	y: number;
	w: number;
	h: number;
	frame: number;
	at: number;
	src: string;
	kind?: 'tv' | 'monitor';
	trim?: number;
	rate?: number;
	body?: string;
	credit?: {kind?: string; text: string};
	rot?: number;
	isImage?: boolean;
	objectPosition?: string;
}> = ({x, y, w, h, frame, at, src, kind = 'tv', trim = 0, rate = 1, body = C.kraft, credit, rot = 0, isImage, objectPosition}) => {
	if (frame < at - 2) return null;
	const p = pop(frame, at, {damping: 12, stiffness: 180, mass: 0.8});
	const pad = kind === 'tv' ? 34 : 22;
	const knobs = kind === 'tv' ? 90 : 0;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `scale(${0.3 + 0.7 * p}) rotate(${rot + (1 - p) * 10}deg)`, opacity: Math.min(1, p * 2.5), filter: SHADOW.lifted}}>
			<div style={{position: 'absolute', inset: 0, background: body, borderRadius: kind === 'tv' ? 34 : 14}}>
				<div style={{position: 'absolute', inset: 0, backgroundImage: `url(${TEX.kraft()})`, backgroundSize: '512px 512px', mixBlendMode: 'multiply', borderRadius: kind === 'tv' ? 34 : 14, opacity: 0.8}} />
			</div>
			<div style={{position: 'absolute', left: pad, top: pad, right: pad + knobs, bottom: pad, borderRadius: kind === 'tv' ? 26 : 6, overflow: 'hidden', background: '#0c0c0c', boxShadow: 'inset 0 0 0 6px rgba(0,0,0,0.55)'}}>
				{isImage ? (
					<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition}} />
				) : (
					<Sequence from={at - 2} layout="none">
						<OffthreadVideo src={staticFile(src)} muted trimBefore={Math.round(trim * 30)} playbackRate={rate} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition}} />
					</Sequence>
				)}
				<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)'}} />
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,0.13), rgba(255,255,255,0) 40%)'}} />
			</div>
			{kind === 'tv' ? (
				<>
					<div style={{position: 'absolute', right: 28, top: pad + 20, width: 54, height: 54, borderRadius: '50%', background: C.charcoal, boxShadow: 'inset 0 -4px 0 rgba(255,255,255,0.15)'}} />
					<div style={{position: 'absolute', right: 28, top: pad + 96, width: 54, height: 54, borderRadius: '50%', background: C.charcoal, boxShadow: 'inset 0 -4px 0 rgba(255,255,255,0.15)'}} />
					<div style={{position: 'absolute', right: 34, top: pad + 176, width: 42, height: 8, borderRadius: 4, background: C.yellow}} />
				</>
			) : null}
			{kind === 'monitor' ? <div style={{position: 'absolute', left: w / 2 - 70, bottom: -46, width: 140, height: 50, background: C.charcoalSoft, borderRadius: '0 0 10px 10px'}} /> : null}
			{credit ? (
				<div style={{position: 'absolute', right: 10, bottom: kind === 'monitor' ? -88 : -42}}>
					<Credit kind={credit.kind} text={credit.text} />
				</div>
			) : null}
		</div>
	);
};
