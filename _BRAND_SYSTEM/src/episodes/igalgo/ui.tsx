// Episode 08 UI kit: an illustrative, brand-styled short-video feed (not a copy of Instagram's interface),
// behaviour-signal chips and line icons. Built on the Paper Workshop tokens (yellow · paper white · charcoal/navy).
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {EASE, kf, pop} from '../../brand/anim';
import {C, FONT, SHADOW} from '../../brand/tokens';

/* ---------------- icons (24-unit line icons, drawn here so no glyph/font gaps) ---------------- */
export type IconName = 'pause' | 'replay' | 'skip' | 'clock' | 'heart' | 'comment' | 'send' | 'search' | 'moon' | 'sun' | 'plane' | 'spark' | 'play' | 'user' | 'bag' | 'book' | 'brief';
const PATHS: Record<IconName, React.ReactNode> = {
	pause: (
		<>
			<rect x={6} y={5} width={4} height={14} rx={1} fill="currentColor" stroke="none" />
			<rect x={14} y={5} width={4} height={14} rx={1} fill="currentColor" stroke="none" />
		</>
	),
	replay: (
		<>
			<path d="M5 12a7 7 0 1 0 2.2-5.1" />
			<path d="M5 4.5v4h4" />
		</>
	),
	skip: (
		<>
			<path d="M6 13l6-6 6 6" />
			<path d="M6 19l6-6 6 6" />
		</>
	),
	clock: (
		<>
			<circle cx={12} cy={12} r={8} />
			<path d="M12 7.5V12l3 2" />
		</>
	),
	heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
	comment: <path d="M5 6h14v9H10l-4 3.5V15H5z" />,
	send: <path d="M4 12l16-7-6 15-2.6-6.2z" />,
	search: (
		<>
			<circle cx={10.5} cy={10.5} r={5.5} />
			<path d="M15 15l4.5 4.5" />
		</>
	),
	moon: <path d="M17.5 14.5A7 7 0 0 1 9.5 6.5a7 7 0 1 0 8 8z" />,
	sun: (
		<>
			<circle cx={12} cy={12} r={4} />
			<path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
		</>
	),
	plane: <path d="M3 13.5l18-6.5-3 3.2-6 1.8 2.4 6.5-2.4.8-3.6-5.6-4.4 1.3z" />,
	spark: <path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z" />,
	play: <path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none" />,
	user: (
		<>
			<circle cx={12} cy={8.5} r={3.5} />
			<path d="M5 19.5a7 7 0 0 1 14 0" />
		</>
	),
	bag: (
		<>
			<path d="M5.5 8h13l-1 12h-11z" />
			<path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
		</>
	),
	book: (
		<>
			<path d="M4 5.5h6a2 2 0 0 1 2 2V19a2 2 0 0 0-2-2H4z" />
			<path d="M20 5.5h-6a2 2 0 0 0-2 2V19a2 2 0 0 1 2-2h6z" />
		</>
	),
	brief: (
		<>
			<rect x={4} y={8} width={16} height={11} rx={1.5} />
			<path d="M9 8V6h6v2" />
		</>
	),
};
export const Icon: React.FC<{name: IconName; size?: number; color?: string; stroke?: number; style?: React.CSSProperties}> = ({name, size = 32, color = C.paper, stroke = 2.2, style}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block', color, ...style}} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
		{PATHS[name]}
	</svg>
);

/* ---------------- media layer: video proxy (.mp4, starts at frame `from`) or still ---------------- */
export const Media: React.FC<{src: string; from?: number; rate?: number; style?: React.CSSProperties; pos?: string}> = ({src, from = 0, rate = 1, style, pos = 'center'}) => {
	const st: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, ...style};
	if (src.endsWith('.mp4'))
		return (
			<Sequence from={from} layout="none">
				<OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={st} />
			</Sequence>
		);
	return <Img src={staticFile(src)} style={st} />;
};

/* ---------------- behaviour-signal chip ---------------- */
export const SignalChip: React.FC<{f: number; at: number; icon: IconName; text: string; size?: number; hot?: boolean; style?: React.CSSProperties}> = ({f, at, icon, text, size = 40, hot = true, style}) => {
	if (f < at) return null;
	const p = pop(f, at, {damping: 12, stiffness: 260, mass: 0.6});
	return (
		<div
			dir="rtl"
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: size * 0.35,
				padding: `${size * 0.22}px ${size * 0.5}px ${size * 0.22}px ${size * 0.3}px`,
				background: 'rgba(14,18,26,0.88)',
				border: `3px solid ${hot ? C.yellow : 'rgba(251,248,241,0.35)'}`,
				borderRadius: size,
				filter: SHADOW.lifted,
				transform: `scale(${0.4 + 0.6 * p})`,
				opacity: Math.min(1, p * 2),
				whiteSpace: 'nowrap',
				...style,
			}}
		>
			<div style={{width: size * 1.15, height: size * 1.15, borderRadius: '50%', background: hot ? C.yellow : 'rgba(251,248,241,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Icon name={icon} size={size * 0.75} color={hot ? C.charcoal : C.paper} stroke={2.6} />
			</div>
			<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: size, color: C.paperWhite, lineHeight: 1.2}}>{text}</span>
		</div>
	);
};

/* ---------------- illustrative short-video card (feed item) ---------------- */
export const ReelCard: React.FC<{
	f: number;
	src: string;
	from?: number;
	w: number;
	h: number;
	handle: string;
	caption?: string;
	ui?: number; // 0..1 visibility of the overlay UI
	progress?: number; // 0..1 watch progress
	radius?: number;
	tag?: React.ReactNode;
	title?: React.ReactNode;
	pos?: string;
	children?: React.ReactNode;
}> = ({f, src, from = 0, w, h, handle, caption, ui = 1, progress = 0, radius = 34, tag, title, pos, children}) => {
	const k = w / 470; // design unit
	return (
		<div style={{position: 'relative', width: w, height: h, borderRadius: radius, overflow: 'hidden', background: src ? '#0b0d12' : 'transparent'}}>
			{src ? <Media src={src} from={from} pos={pos} /> : null}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.72) 100%)', opacity: ui}} />
			{children}
			<div style={{position: 'absolute', inset: 0, opacity: ui}}>
				{/* top tabs */}
				<div dir="rtl" style={{position: 'absolute', top: 22 * k, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22 * k, fontFamily: FONT.display, fontWeight: 700, fontSize: 21 * k}}>
					<span style={{color: C.paperWhite, borderBottom: `${3 * k}px solid ${C.yellow}`, paddingBottom: 4 * k}}>لك</span>
					<span style={{color: 'rgba(251,248,241,0.6)'}}>متابَعون</span>
				</div>
				{/* right-hand action column (kept on the card's physical right, as in feeds) */}
				<div style={{position: 'absolute', right: 16 * k, bottom: 118 * k, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 * k}}>
					{(['heart', 'comment', 'send'] as IconName[]).map((n) => (
						<Icon key={n} name={n} size={38 * k} color={C.paperWhite} stroke={2} />
					))}
				</div>
				{/* handle + caption */}
				<div style={{position: 'absolute', left: 20 * k, right: 80 * k, bottom: 34 * k, display: 'flex', flexDirection: 'column', gap: 8 * k}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10 * k, direction: 'ltr'}}>
						<div style={{width: 36 * k, height: 36 * k, borderRadius: '50%', border: `${3 * k}px solid ${C.yellow}`, background: C.navyLight}} />
						<span style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 19 * k, color: C.paperWhite}}>{handle}</span>
					</div>
					{caption ? (
						<div dir="rtl" style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 20 * k, color: 'rgba(251,248,241,0.9)', lineHeight: 1.35}}>
							{caption}
						</div>
					) : null}
				</div>
				{/* progress */}
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 6 * k, background: 'rgba(251,248,241,0.25)'}}>
					<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, background: C.yellow}} />
				</div>
				{tag ? <div style={{position: 'absolute', top: 70 * k, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>{tag}</div> : null}
				{title ? <div style={{position: 'absolute', left: 24 * k, right: 24 * k, top: '38%'}}>{title}</div> : null}
			</div>
		</div>
	);
};

/** Paper-white rounded phone body (illustrative device) wrapping arbitrary screen content. */
export const PhoneFrame: React.FC<{w: number; h: number; children?: React.ReactNode}> = ({w, h, children}) => (
	<div style={{position: 'relative', width: w, height: h, borderRadius: w * 0.11, background: C.charcoal, padding: w * 0.03, filter: SHADOW.lifted, boxShadow: `inset 0 0 0 3px ${C.charcoalSoft}`}}>
		<div style={{position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.085, overflow: 'hidden', background: '#000'}}>{children}</div>
		<div style={{position: 'absolute', top: w * 0.055, left: '50%', width: w * 0.22, height: w * 0.05, marginLeft: -w * 0.11, borderRadius: w * 0.03, background: '#000'}} />
	</div>
);

/** Small thumbnail tile of a watched video. */
export const Thumb: React.FC<{src: string; w: number; h?: number; from?: number; dim?: number; ring?: string; radius?: number; children?: React.ReactNode}> = ({src, w, h, from, dim = 0, ring, radius = 12, children}) => (
	<div style={{position: 'relative', width: w, height: h ?? (w * 16) / 9, borderRadius: radius, overflow: 'hidden', background: '#0b0d12', boxShadow: ring ? `0 0 0 4px ${ring}` : undefined, filter: SHADOW.soft}}>
		<Media src={src} from={from} />
		{dim > 0 ? <AbsoluteFill style={{background: `rgba(10,13,19,${dim})`}} /> : null}
		{children}
	</div>
);

/** Watch-time bar with label. */
export const WatchBar: React.FC<{p: number; w?: number; label?: string}> = ({p, w = 520, label = 'مدة المشاهدة'}) => (
	<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(14,18,26,0.86)', padding: '12px 22px', borderRadius: 40, filter: SHADOW.lifted}}>
		<Icon name="clock" size={38} color={C.yellow} stroke={2.4} />
		<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 34, color: C.paperWhite, whiteSpace: 'nowrap'}}>{label}</span>
		<div style={{position: 'relative', width: w - 300, height: 14, borderRadius: 7, background: 'rgba(251,248,241,0.22)', overflow: 'hidden'}}>
			<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(1, p)) * 100}%`, background: C.yellow, borderRadius: 7}} />
		</div>
	</div>
);

/** Rect interpolation helper for morphing a full-frame shot into a card. */
export const morphRect = (t: number, a: {x: number; y: number; w: number; h: number; r: number}, b: {x: number; y: number; w: number; h: number; r: number}) => {
	const e = EASE.io(Math.max(0, Math.min(1, t)));
	return {x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, w: a.w + (b.w - a.w) * e, h: a.h + (b.h - a.h) * e, r: a.r + (b.r - a.r) * e};
};

export const fadeIn = (f: number, at: number, d = 8) => kf(f, [at, at + d], [0, 1], EASE.out);
