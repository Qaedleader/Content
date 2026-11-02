// Episode 09 kit: one consistent vector world for «AI vs AI Agent», built on the Paper Workshop tokens.
// Colour logic used everywhere in this episode: paper-white = information coming IN, brand yellow = action going OUT.
import React from 'react';
import {EASE, kf, pop, rand} from '../../brand/anim';
import {BRAIN_PATH} from '../../brand/science';
import {EDGE} from '../../brand/props';
import {C, FONT, SHADOW} from '../../brand/tokens';

export const INFO = C.paperWhite;
export const ACT = C.yellow;

/* ---------------- camera (world → screen) ---------------- */
export type Cam = {px: number; py: number; s: number; tx: number; ty: number};
export const ID_CAM: Cam = {px: 540, py: 960, s: 1, tx: 540, ty: 960};
export const camT = (c: Cam) => `translate(${c.tx} ${c.ty}) scale(${c.s}) translate(${-c.px} ${-c.py})`;
export const toScreen = (c: Cam, x: number, y: number) => ({x: c.tx + (x - c.px) * c.s, y: c.ty + (y - c.py) * c.s});
/** Camera keyframes: [frame, cam][] with cubic in-out between keys. */
export const camAt = (f: number, keys: [number, Cam][]): Cam => {
	if (f <= keys[0][0]) return keys[0][1];
	for (let k = 0; k < keys.length - 1; k++) {
		const [fa, a] = keys[k];
		const [fb, b] = keys[k + 1];
		if (f <= fb) {
			const t = kf(f, [fa, fb], [0, 1], EASE.io);
			return {px: a.px + (b.px - a.px) * t, py: a.py + (b.py - a.py) * t, s: a.s + (b.s - a.s) * t, tx: a.tx + (b.tx - a.tx) * t, ty: a.ty + (b.ty - a.ty) * t};
		}
	}
	return keys[keys.length - 1][1];
};

/* ---------------- polyline sampling (signals travelling along nerves / cables) ---------------- */
export type Pt = {x: number; y: number};
export const along = (pts: Pt[], t: number): Pt => {
	const segs: number[] = [];
	let total = 0;
	for (let i = 0; i < pts.length - 1; i++) {
		const l = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
		segs.push(l);
		total += l;
	}
	let d = Math.max(0, Math.min(1, t)) * total;
	for (let i = 0; i < segs.length; i++) {
		if (d <= segs[i] || i === segs.length - 1) {
			const u = segs[i] > 0 ? Math.min(1, d / segs[i]) : 0;
			return {x: pts[i].x + (pts[i + 1].x - pts[i].x) * u, y: pts[i].y + (pts[i + 1].y - pts[i].y) * u};
		}
		d -= segs[i];
	}
	return pts[pts.length - 1];
};
export const polyD = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

/** A travelling signal: glowing head + short comet tail along `pts` (t = 0..1). */
export const Pulse: React.FC<{pts: Pt[]; t: number; color: string; r?: number; tail?: number; children?: React.ReactNode}> = ({pts, t, color, r = 14, tail = 0.12, children}) => {
	if (t <= 0 || t >= 1.02) return null;
	const head = along(pts, t);
	const tailPts = Array.from({length: 7}).map((_, i) => along(pts, Math.max(0, t - (tail * i) / 6)));
	return (
		<g>
			<path d={polyD(tailPts)} fill="none" stroke={color} strokeWidth={r * 0.9} strokeLinecap="round" opacity={0.35} />
			<circle cx={head.x} cy={head.y} r={r * 2.2} fill={color} opacity={0.25} filter="url(#glow)" />
			<circle cx={head.x} cy={head.y} r={r} fill={color} />
			{children ? <g transform={`translate(${head.x} ${head.y})`}>{children}</g> : null}
		</g>
	);
};

/* ---------------- the human figure (side view, facing left; origin = feet centre on the ground) ---------------- */
export const LEG = {L1: 225, L2: 225, hipY: -460};
export const HEAD = {x: -6, y: -875, r: 84};
export const EYE = {x: -54, y: -884};
export const BRAIN_IN_HEAD = {x: 14, y: -892, s: 0.2};
const rad = (d: number) => (d * Math.PI) / 180;
const dir = (deg: number) => ({x: -Math.sin(rad(deg)), y: Math.cos(rad(deg))});
/** Forward kinematics of the kicking leg: a1 = thigh angle (+ forward), a2 = knee bend (+ shin folds back). */
export const legPoints = (a1: number, a2: number) => {
	const hip = {x: 0, y: LEG.hipY};
	const d1 = dir(a1);
	const knee = {x: hip.x + d1.x * LEG.L1, y: hip.y + d1.y * LEG.L1};
	const d2 = dir(a1 - a2);
	const ankle = {x: knee.x + d2.x * LEG.L2, y: knee.y + d2.y * LEG.L2};
	return {hip, knee, ankle};
};

const SKIN = C.paperShade;
const SHIRT = C.teal;
const SHIRT_BACK = C.tealDark;
const PANTS = C.kraft;
const PANTS_BACK = C.kraftDark;

const Limb: React.FC<{len: number; w: number; color: string}> = ({len, w, color}) => (
	<>
		<line x1={0} y1={0} x2={0} y2={len} stroke="rgba(20,14,8,0.35)" strokeWidth={w + 5} strokeLinecap="round" />
		<line x1={0} y1={0} x2={0} y2={len} stroke={color} strokeWidth={w} strokeLinecap="round" />
	</>
);
const Shoe: React.FC<{glow?: number}> = ({glow = 0}) => (
	<g>
		<rect x={-92} y={-8} width={120} height={44} rx={20} fill={C.paperWhite} {...EDGE} />
		<rect x={-94} y={24} width={124} height={14} rx={7} fill={C.charcoal} />
		{glow > 0 ? <rect x={-98} y={-14} width={132} height={58} rx={26} fill="none" stroke={ACT} strokeWidth={7} opacity={glow} /> : null}
	</g>
);

export const Figure: React.FC<{
	a1?: number;
	a2?: number;
	lean?: number; // upper-body lean (deg, + = forward)
	arm?: number; // front-arm swing (deg)
	xray?: number; // 0..1: head turns translucent and shows the brain
	brainGlow?: number;
	eyeGlow?: number;
	pupil?: Pt; // pupil offset
	legGlow?: number; // yellow outline on the acting leg
	brainHidden?: boolean;
}> = ({a1 = 0, a2 = 0, lean = 0, arm = 0, xray = 0, brainGlow = 0, eyeGlow = 0, pupil = {x: -3, y: 3}, legGlow = 0, brainHidden}) => (
	<g>
		{/* standing (back) leg */}
		<g transform={`translate(14 ${LEG.hipY}) rotate(${-a1 * 0.12})`}>
			<Limb len={LEG.L1} w={62} color={PANTS_BACK} />
			<g transform={`translate(0 ${LEG.L1}) rotate(${a1 * 0.12 + Math.max(0, a1) * 0.1})`}>
				<Limb len={LEG.L2} w={52} color={PANTS_BACK} />
				<g transform={`translate(0 ${LEG.L2 - 4})`}>
					<Shoe />
				</g>
			</g>
		</g>
		{/* upper body (leans around the hip) */}
		<g transform={`translate(0 ${LEG.hipY}) rotate(${-lean}) translate(0 ${-LEG.hipY})`}>
			{/* back arm */}
			<g transform={`translate(10 -760) rotate(${-arm * 0.8 - 8})`}>
				<Limb len={150} w={38} color={SHIRT_BACK} />
				<g transform="translate(0 150) rotate(-12)">
					<Limb len={140} w={32} color={SKIN} />
				</g>
			</g>
			{/* torso */}
			<path d="M-66,-760 Q-70,-800 -20,-806 L30,-806 Q74,-800 70,-760 L64,-480 Q60,-448 30,-446 L-34,-446 Q-62,-450 -62,-480 Z" fill={SHIRT} {...EDGE} />
			<path d="M-60,-500 L62,-500 L64,-470 Q60,-446 30,-444 L-34,-444 Q-62,-450 -62,-470 Z" fill={PANTS} {...EDGE} />
			{/* neck + head */}
			<rect x={-20} y={-812} width={36} height={40} rx={10} fill={SKIN} {...EDGE} />
			<g>
				<defs>
					<clipPath id="headclip">
						<circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} />
					</clipPath>
				</defs>
				<circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill={SKIN} opacity={1 - 0.62 * xray} {...EDGE} />
				{/* hair cap */}
				<path d="M-84,-890 Q-80,-972 6,-962 Q86,-956 82,-866 Q70,-900 34,-912 Q-20,-930 -84,-890 Z" fill={C.charcoal} opacity={1 - 0.7 * xray} />
				{/* ear */}
				<ellipse cx={26} cy={-872} rx={13} ry={19} fill={C.paperShade} stroke="rgba(30,20,10,0.25)" strokeWidth={2} opacity={1 - 0.7 * xray} />
				{xray > 0.01 ? (
					<g clipPath="url(#headclip)" opacity={xray}>
						<circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill="rgba(20,30,45,0.55)" />
						{!brainHidden ? (
							<g transform={`translate(${BRAIN_IN_HEAD.x} ${BRAIN_IN_HEAD.y}) scale(${BRAIN_IN_HEAD.s})`}>
								<MiniBrain glow={brainGlow} />
							</g>
						) : null}
						{/* optic nerve: eye → brain */}
						<path d={`M${EYE.x + 10},${EYE.y} C${EYE.x + 30},${EYE.y + 4} ${-14},${EYE.y + 6} ${BRAIN_IN_HEAD.x - 30},${BRAIN_IN_HEAD.y + 6}`} fill="none" stroke={INFO} strokeWidth={3} strokeDasharray="6 5" opacity={0.7} />
					</g>
				) : null}
				{xray > 0.01 ? <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill="none" stroke={C.paper} strokeWidth={3} strokeDasharray="10 8" opacity={xray * 0.8} /> : null}
				{/* eye */}
				{eyeGlow > 0 ? <circle cx={EYE.x} cy={EYE.y} r={30} fill={INFO} opacity={0.35 * eyeGlow} filter="url(#glow)" /> : null}
				<path d={`M${EYE.x - 18},${EYE.y} Q${EYE.x},${EYE.y - 15} ${EYE.x + 16},${EYE.y} Q${EYE.x},${EYE.y + 13} ${EYE.x - 18},${EYE.y} Z`} fill={C.paperWhite} stroke="rgba(30,20,10,0.45)" strokeWidth={2} />
				<circle cx={EYE.x + pupil.x} cy={EYE.y + pupil.y} r={8} fill={C.navy} />
				<circle cx={EYE.x + pupil.x - 2.5} cy={EYE.y + pupil.y - 3} r={2.6} fill={C.white} />
				<path d={`M${EYE.x - 20},${EYE.y - 22} Q${EYE.x - 2},${EYE.y - 32} ${EYE.x + 16},${EYE.y - 24}`} fill="none" stroke={C.charcoal} strokeWidth={5} strokeLinecap="round" opacity={1 - 0.5 * xray} />
				{/* nose + mouth */}
				<path d="M-86,-866 Q-98,-846 -84,-842" fill="none" stroke="rgba(30,20,10,0.4)" strokeWidth={3} strokeLinecap="round" opacity={1 - 0.6 * xray} />
				<path d="M-74,-826 Q-62,-820 -52,-828" fill="none" stroke="rgba(30,20,10,0.45)" strokeWidth={3.5} strokeLinecap="round" opacity={1 - 0.6 * xray} />
			</g>
			{/* front arm */}
			<g transform={`translate(-6 -762) rotate(${arm})`}>
				<Limb len={150} w={40} color={SHIRT} />
				<g transform="translate(0 150) rotate(-18)">
					<Limb len={140} w={34} color={SKIN} />
				</g>
			</g>
		</g>
		{/* kicking (front) leg — nested joints */}
		<g transform={`translate(0 ${LEG.hipY}) rotate(${a1})`}>
			{legGlow > 0 ? <line x1={0} y1={0} x2={0} y2={LEG.L1} stroke={ACT} strokeWidth={84} strokeLinecap="round" opacity={0.35 * legGlow} /> : null}
			<Limb len={LEG.L1} w={66} color={PANTS} />
			<g transform={`translate(0 ${LEG.L1}) rotate(${-a2})`}>
				{legGlow > 0 ? <line x1={0} y1={0} x2={0} y2={LEG.L2} stroke={ACT} strokeWidth={74} strokeLinecap="round" opacity={0.35 * legGlow} /> : null}
				<Limb len={LEG.L2} w={56} color={PANTS} />
				<g transform={`translate(0 ${LEG.L2 - 4})`}>
					<Shoe glow={legGlow} />
				</g>
			</g>
		</g>
	</g>
);

/** Paper brain (same outline as the brand's PaperBrain), with optional analysis glow. Local box ~640×560. */
export const MiniBrain: React.FC<{glow?: number; color?: string}> = ({glow = 0, color = '#E7B9A7'}) => (
	<g>
		<path d={BRAIN_PATH} fill={color} {...EDGE} strokeWidth={8} />
		{['M-250,-60 C-200,-110 -150,-60 -110,-120 C-80,-170 -20,-150 0,-200', 'M-230,30 C-180,-10 -130,40 -80,-10 C-40,-50 20,-20 50,-80 C80,-140 150,-120 180,-160', 'M-180,110 C-130,80 -80,120 -30,80 C10,50 60,90 110,40 C160,0 220,40 260,-10', 'M80,-210 C60,-150 120,-120 90,-60 C70,-20 120,10 100,60'].map((d, i) => (
			<path key={i} d={d} fill="none" stroke="rgba(120,50,40,0.38)" strokeWidth={14} strokeLinecap="round" />
		))}
		{glow > 0 ? <ellipse cx={0} cy={-20} rx={250} ry={200} fill={ACT} opacity={0.5 * glow} filter="url(#softglow)" /> : null}
	</g>
);

/* ---------------- ball ---------------- */
export const Ball: React.FC<{r?: number; rot?: number}> = ({r = 62, rot = 0}) => {
	const pent = (cx: number, cy: number, s: number) =>
		Array.from({length: 5})
			.map((_, i) => {
				const a = rad(-90 + i * 72);
				return `${(cx + Math.cos(a) * s).toFixed(1)},${(cy + Math.sin(a) * s).toFixed(1)}`;
			})
			.join(' ');
	return (
		<g transform={`rotate(${rot})`}>
			<defs>
				<clipPath id="ballclip">
					<circle r={r} />
				</clipPath>
			</defs>
			<circle r={r} fill={C.paperWhite} {...EDGE} strokeWidth={3} />
			<g clipPath="url(#ballclip)">
				<polygon points={pent(0, 0, r * 0.34)} fill={C.charcoal} />
				{[0, 1, 2, 3, 4].map((i) => {
					const a = rad(-90 + i * 72);
					return <polygon key={i} points={pent(Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95, r * 0.3)} fill={C.charcoal} />;
				})}
				{[0, 1, 2, 3, 4].map((i) => {
					const a = rad(-90 + i * 72);
					return <line key={i} x1={Math.cos(a) * r * 0.34} y1={Math.sin(a) * r * 0.34} x2={Math.cos(a) * r * 0.66} y2={Math.sin(a) * r * 0.66} stroke="rgba(38,35,33,0.55)" strokeWidth={3} />;
				})}
				<circle r={r} fill="url(#ballshade)" />
			</g>
			<defs>
				<radialGradient id="ballshade" cx="35%" cy="30%" r="80%">
					<stop offset="0%" stopColor="rgba(255,255,255,0)" />
					<stop offset="100%" stopColor="rgba(20,14,8,0.32)" />
				</radialGradient>
			</defs>
		</g>
	);
};

/* ---------------- AI core (the digital "brain"): chip body + circuit-brain glyph ---------------- */
const TRACES = [
	'M-200,-40 L-120,-40 L-90,-90 L-20,-90',
	'M-160,60 L-60,60 L-30,10 L60,10',
	'M40,-180 L40,-110 L120,-110 L150,-60',
	'M-60,-200 L-60,-140 L0,-140',
	'M120,60 L200,60 L230,10',
	'M-100,140 L0,140 L40,100 L120,100',
];
const NODES: [number, number][] = [[-20, -90], [60, 10], [150, -60], [0, -140], [230, 10], [120, 100], [-200, -40], [-160, 60]];
export const AiCore: React.FC<{S?: number; glow?: number; think?: number; frame?: number; brainOpacity?: number; label?: string}> = ({S = 360, glow = 0, think = 0, frame = 0, brainOpacity = 1, label}) => {
	const h = S / 2;
	const pins = [-0.3, -0.1, 0.1, 0.3];
	return (
		<g>
			{glow > 0 ? <rect x={-h - 30} y={-h - 30} width={S + 60} height={S + 60} rx={S * 0.18} fill={ACT} opacity={0.28 * glow} filter="url(#softglow)" /> : null}
			{pins.map((p, i) => (
				<g key={i}>
					<rect x={p * S - 9} y={-h - 26} width={18} height={30} rx={4} fill={C.steel} />
					<rect x={p * S - 9} y={h - 4} width={18} height={30} rx={4} fill={C.steel} />
					<rect x={-h - 26} y={p * S - 9} width={30} height={18} rx={4} fill={C.steel} />
					<rect x={h - 4} y={p * S - 9} width={30} height={18} rx={4} fill={C.steel} />
				</g>
			))}
			<rect x={-h} y={-h} width={S} height={S} rx={S * 0.14} fill={C.navy} stroke={ACT} strokeWidth={S * 0.018} filter="url(#sh)" />
			<rect x={-h + S * 0.06} y={-h + S * 0.06} width={S * 0.88} height={S * 0.88} rx={S * 0.1} fill="none" stroke="rgba(242,182,48,0.25)" strokeWidth={2} />
			<g transform={`scale(${(S / 360) * 0.42})`} opacity={brainOpacity}>
				<path d={BRAIN_PATH} fill="rgba(242,182,48,0.10)" stroke={ACT} strokeWidth={14} strokeLinejoin="round" />
				{TRACES.map((d, i) => (
					<path key={i} d={d} fill="none" stroke={ACT} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
				))}
				{think > 0
					? TRACES.map((d, i) => (
							<path key={i} d={d} fill="none" stroke={C.white} strokeWidth={12} strokeLinecap="round" strokeDasharray="30 260" strokeDashoffset={-(frame * 12 + i * 70)} opacity={think} />
						))
					: null}
				{NODES.map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r={18} fill={C.navy} stroke={ACT} strokeWidth={9} />
				))}
			</g>
			{label ? (
				<text x={0} y={h - S * 0.07} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={S * 0.075} fill="rgba(242,182,48,0.75)" letterSpacing={4}>
					{label}
				</text>
			) : null}
		</g>
	);
};

/* ---------------- line icons (24-unit) ---------------- */
export type IName = 'inbox' | 'send' | 'mail' | 'target' | 'check' | 'chat' | 'tools' | 'brain' | 'eye' | 'leg' | 'rule' | 'ask' | 'skip';
const IP: Record<IName, React.ReactNode> = {
	inbox: (
		<>
			<path d="M4 13l2.5-7h11L20 13v6H4z" />
			<path d="M4 13h4.5l1.2 2.5h4.6l1.2-2.5H20" />
		</>
	),
	send: <path d="M3.5 11.5L20.5 4l-5.5 16-3.4-6.6z M11.6 13.4L20.5 4" />,
	mail: (
		<>
			<rect x={3.5} y={6} width={17} height={12.5} rx={1.6} />
			<path d="M4 7l8 6 8-6" />
		</>
	),
	target: (
		<>
			<circle cx={12} cy={12} r={8} />
			<circle cx={12} cy={12} r={4.4} />
			<circle cx={12} cy={12} r={1.2} fill="currentColor" />
		</>
	),
	check: <path d="M5 12.5l4.2 4.2L19 7" />,
	chat: <path d="M4.5 5.5h15v10h-9l-4.5 3.8V15.5h-1.5z" />,
	tools: (
		<>
			<path d="M14.5 4.5a4 4 0 0 0-4.8 5.2L4.5 15a2 2 0 0 0 2.8 2.8l5.3-5.2a4 4 0 0 0 5.2-4.8l-2.4 2.4-2.6-.6-.6-2.6z" />
		</>
	),
	brain: <path d="M9 4.5a3 3 0 0 0-3 3 3 3 0 0 0-1.5 5.3A3 3 0 0 0 7 17.5a3 3 0 0 0 5 1V5.8A2.6 2.6 0 0 0 9 4.5zM15 4.5a3 3 0 0 1 3 3 3 3 0 0 1 1.5 5.3A3 3 0 0 1 17 17.5a3 3 0 0 1-5 1" />,
	eye: (
		<>
			<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
			<circle cx={12} cy={12} r={3} />
		</>
	),
	leg: <path d="M10 3v8l-1.5 7.5H14l4 2H8.5" />,
	rule: (
		<>
			<rect x={5} y={3.5} width={14} height={17} rx={1.5} />
			<path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
		</>
	),
	ask: (
		<>
			<path d="M9.2 9a2.9 2.9 0 1 1 3.9 2.7c-.7.3-1.1.9-1.1 1.6v.7" />
			<circle cx={12} cy={17.5} r={0.6} fill="currentColor" />
		</>
	),
	skip: <path d="M6 6l12 12M18 6L6 18" />,
};
export const Ico: React.FC<{name: IName; size?: number; color?: string; stroke?: number}> = ({name, size = 32, color = C.paper, stroke = 2.3}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block', color}} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
		{IP[name]}
	</svg>
);
/** Same icon inside an SVG scene. Origin = icon centre. */
export const SIco: React.FC<{name: IName; size?: number; color?: string; stroke?: number}> = ({name, size = 32, color = C.paper, stroke = 2.3}) => (
	<g transform={`translate(${-size / 2} ${-size / 2}) scale(${size / 24})`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{color}}>
		{IP[name]}
	</g>
);

/* ---------------- tool plate (HTML, centred at x,y) ---------------- */
export const ToolPlate: React.FC<{x: number; y: number; w?: number; icon: IName; label: string; tone: 'in' | 'out'; on?: number; p?: number; scale?: number; opacity?: number}> = ({
	x,
	y,
	w = 380,
	icon,
	label,
	tone,
	on = 0,
	p = 1,
	scale = 1,
	opacity = 1,
}) => {
	const col = tone === 'in' ? INFO : ACT;
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - 58, width: w, height: 116, transform: `scale(${scale * (0.4 + 0.6 * p)})`, opacity: Math.min(1, p * 2) * opacity}}>
			{on > 0 ? <div style={{position: 'absolute', inset: -14, borderRadius: 72, background: col, opacity: 0.22 * on, filter: 'blur(14px)'}} /> : null}
			<div
				dir="rtl"
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: 58,
					background: 'rgba(14,18,26,0.92)',
					border: `4px solid ${on > 0.5 ? col : 'rgba(251,248,241,0.35)'}`,
					display: 'flex',
					alignItems: 'center',
					gap: 22,
					padding: '0 18px',
					filter: SHADOW.lifted,
				}}
			>
				<div style={{width: 80, height: 80, borderRadius: '50%', background: on > 0.5 ? col : 'rgba(251,248,241,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>
					<Ico name={icon} size={50} color={on > 0.5 ? C.charcoal : C.paper} stroke={2.4} />
				</div>
				<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 38, color: C.paperWhite, whiteSpace: 'nowrap'}}>{label}</span>
			</div>
		</div>
	);
};

/* ---------------- envelope + paper plane (SVG, origin = centre) ---------------- */
export const Envelope: React.FC<{w?: number; tone?: 'in' | 'out'; open?: number}> = ({w = 120, tone = 'in', open = 0}) => {
	const h = w * 0.68;
	const body = tone === 'in' ? C.paperWhite : C.yellow;
	const ink = tone === 'in' ? 'rgba(38,35,33,0.55)' : 'rgba(38,35,33,0.7)';
	return (
		<g filter="url(#shs)">
			<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.06} fill={body} stroke={ink} strokeWidth={2} />
			<path d={`M${-w / 2 + 3},${-h / 2 + 3} L0,${-h / 2 + h * (0.55 - open * 1.1)} L${w / 2 - 3},${-h / 2 + 3}`} fill="none" stroke={ink} strokeWidth={3} strokeLinejoin="round" />
		</g>
	);
};
export const Plane: React.FC<{s?: number; color?: string}> = ({s = 1, color = ACT}) => (
	<g transform={`scale(${s})`} filter="url(#shs)">
		<path d="M-60,4 L56,-34 L18,40 L4,12 Z" fill={color} stroke="rgba(38,35,33,0.55)" strokeWidth={2.5} strokeLinejoin="round" />
		<path d="M4,12 L56,-34 L-6,22 Z" fill="rgba(38,35,33,0.22)" />
	</g>
);

/* ---------------- small helpers ---------------- */
export const NumBadge: React.FC<{n: string; color?: string; size?: number}> = ({n, color = ACT, size = 54}) => (
	<div style={{width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.display, fontWeight: 900, fontSize: size * 0.56, color: C.charcoal, flex: 'none'}}>
		{n}
	</div>
);

/** Words revealed one by one (keeps Arabic letter shaping intact, unlike per-letter typing). */
export const wordsUpTo = (text: string, f: number, at: number, every = 3) => {
	const ws = text.split(' ');
	const n = Math.max(0, Math.min(ws.length, Math.floor((f - at) / every) + 1));
	return f < at ? '' : ws.slice(0, n).join(' ');
};

export const chipIn = (f: number, at: number) => pop(f, at, {damping: 12, stiffness: 260, mass: 0.6});
export const jitter = (seed: number) => (rand(seed) - 0.5) * 2;

/** Blueprint navy ground used across the episode (matches the IgAlgo analysis scenes). */
export const Ground: React.FC<{shift?: number; light?: number}> = ({shift = 0, light = 0.55}) => (
	<>
		<div style={{position: 'absolute', inset: 0, background: C.navyDeep}} />
		<div
			style={{
				position: 'absolute',
				inset: 0,
				backgroundImage: 'linear-gradient(rgba(154,165,174,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(154,165,174,0.07) 2px, transparent 2px)',
				backgroundSize: '60px 60px',
				backgroundPosition: `${shift}px ${shift * 0.4}px`,
			}}
		/>
		<div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 55% at 50% 45%, rgba(46,66,96,${light}), rgba(20,30,45,0) 75%)`}} />
	</>
);
