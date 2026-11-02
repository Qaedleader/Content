// Reusable paper-cut science props (brain, implant, neurons, signals, memory archive, cloud, devices, evidence board).
// Drawn in local SVG coordinates; position with <G>. Built for the Neuralink remake, kept generic for future science episodes.
import React from 'react';
import {rand} from './anim';
import {EDGE, Gear} from './props';
import {C, FONT} from './tokens';

/** Side-view brain outline (facing left), ~640×560 box centred on (0,0). */
export const BRAIN_PATH =
	'M-300,-20 C-312,-150 -190,-246 -60,-238 C40,-262 175,-232 245,-160 C312,-98 322,-8 292,44 C300,86 266,124 222,126 ' +
	'C268,150 280,204 232,220 C182,236 122,214 110,172 L82,176 C72,228 62,268 42,300 L2,300 C12,250 20,212 14,172 ' +
	'C-40,192 -152,182 -204,142 C-272,120 -302,62 -300,-20 Z';

const GYRI = [
	'M-250,-60 C-200,-110 -150,-60 -110,-120 C-80,-170 -20,-150 0,-200',
	'M-230,30 C-180,-10 -130,40 -80,-10 C-40,-50 20,-20 50,-80 C80,-140 150,-120 180,-160',
	'M-180,110 C-130,80 -80,120 -30,80 C10,50 60,90 110,40 C160,0 220,40 260,-10',
	'M-60,-200 C-40,-140 -100,-110 -70,-50',
	'M80,-210 C60,-150 120,-120 90,-60 C70,-20 120,10 100,60',
	'M200,-130 C170,-80 220,-40 200,20',
	'M-120,150 C-60,140 0,160 60,120',
];

/** Paper brain. mode 'plain' | 'cabinet' (filing drawers inside) | 'outline' (dashed future). */
export const PaperBrain: React.FC<{
	mode?: 'plain' | 'cabinet' | 'outline';
	color?: string;
	frame?: number;
	drawerOpen?: (i: number) => number; // 0..1 per drawer
	glow?: number[]; // per-region glow 0..1 (6 regions)
	id?: string;
}> = ({mode = 'plain', color = '#E7B9A7', frame = 0, drawerOpen, glow = [], id = 'b'}) => {
	const clip = `brainclip-${id}`;
	const cols = 8;
	const rows = 7;
	const dw = 640 / cols;
	const dh = 560 / rows;
	return (
		<g>
			<defs>
				<clipPath id={clip}>
					<path d={BRAIN_PATH} />
				</clipPath>
			</defs>
			{mode === 'outline' ? (
				<path d={BRAIN_PATH} fill="rgba(244,236,221,0.06)" stroke={C.paper} strokeWidth={5} strokeDasharray="18 14" strokeDashoffset={-frame * 2} />
			) : (
				<>
					<path d={BRAIN_PATH} fill={mode === 'cabinet' ? C.kraft : color} {...EDGE} filter="url(#sh)" />
					<g clipPath={`url(#${clip})`}>
						{mode === 'plain'
							? GYRI.map((d, i) => <path key={i} d={d} fill="none" stroke="rgba(120,50,40,0.35)" strokeWidth={9} strokeLinecap="round" />)
							: null}
						{mode === 'plain'
							? glow.map((g, i) =>
									g > 0.01 ? (
										<circle key={i} cx={[-200, -60, 90, 210, -120, 60][i]} cy={[-60, -150, -140, -20, 80, 60][i]} r={70 + 30 * g} fill={C.yellow} opacity={0.65 * g} filter="url(#glow)" />
									) : null,
								)
							: null}
						{mode === 'cabinet'
							? Array.from({length: cols * rows}).map((_, k) => {
									const i = k % cols;
									const j = Math.floor(k / cols);
									const x = -320 + i * dw;
									const y = -260 + j * dh;
									const o = drawerOpen ? drawerOpen(k) : 0;
									return (
										<g key={k} transform={`translate(${-o * 26} ${o * 10})`}>
											<rect x={x + 4} y={y + 4} width={dw - 8} height={dh - 8} rx={5} fill={k % 7 === 3 ? C.paperShade : C.paper} stroke="rgba(30,20,10,0.25)" strokeWidth={2} />
											<rect x={x + dw / 2 - 14} y={y + dh / 2 - 4} width={28} height={8} rx={4} fill={C.charcoalSoft} />
											<rect x={x + 12} y={y + 12} width={dw - 24} height={10} rx={2} fill="rgba(30,20,10,0.08)" />
										</g>
									);
								})
							: null}
					</g>
					{mode === 'cabinet' ? <path d={BRAIN_PATH} fill="none" stroke={color} strokeWidth={22} /> : null}
					{mode === 'cabinet' ? GYRI.slice(0, 3).map((d, i) => <path key={i} d={d} fill="none" stroke={color} strokeWidth={6} opacity={0.0} />) : null}
					<path d={BRAIN_PATH} fill="none" stroke="rgba(30,20,10,0.35)" strokeWidth={4} />
				</>
			)}
		</g>
	);
};

/** N1-style implant: coin-sized disc with flexible threads (illustrative). Origin = disc centre. */
export const Implant: React.FC<{r?: number; threads?: number; reach?: number; frame?: number; pulse?: number}> = ({r = 60, threads = 9, reach = 1, frame = 0, pulse = 0}) => (
	<g>
		{Array.from({length: threads}).map((_, k) => {
			const a = ((k / (threads - 1)) - 0.5) * 1.6;
			const L = 260 * reach;
			const x2 = Math.sin(a) * L;
			const y2 = Math.cos(a) * L * 0.9 + 20;
			const d = `M${Math.sin(a) * r * 0.6},${r * 0.5} C${Math.sin(a) * r},${r + 60} ${x2 * 0.8 + Math.sin(k) * 20},${y2 * 0.5} ${x2},${y2}`;
			const p = (frame / 18 + k * 0.17) % 1;
			return (
				<g key={k}>
					<path d={d} fill="none" stroke={C.yellow} strokeWidth={3.5} strokeLinecap="round" />
					{pulse > 0 && reach > 0.95 ? <circle cx={x2 * (1 - p)} cy={y2 * (1 - p) + r * 0.5 * p} r={6} fill={C.white} opacity={pulse} filter="url(#glow)" /> : null}
				</g>
			);
		})}
		<circle r={r} fill={C.steel} {...EDGE} filter="url(#sh)" />
		<circle r={r * 0.78} fill={C.paperWhite} stroke="rgba(30,20,10,0.2)" strokeWidth={2} />
		<circle r={r * 0.36} fill={C.yellow} />
		<circle r={r * 0.14} fill={C.charcoal} />
	</g>
);

/** Neuron (soma + dendrites + axon). Origin = soma. `fire` 0..1 = action potential position along the axon. */
export const Neuron: React.FC<{s?: number; fire?: number; seed?: number; color?: string; lit?: number}> = ({s = 1, fire = -1, seed = 1, color = C.paper, lit = 0}) => {
	const dend = Array.from({length: 6}).map((_, k) => {
		const a = (k / 6) * Math.PI * 2 + rand(seed + k) * 0.5;
		const L = 70 + rand(seed * 3 + k) * 60;
		const mx = Math.cos(a + 0.3) * L * 0.5;
		const my = Math.sin(a + 0.3) * L * 0.5;
		return `M0,0 Q${mx},${my} ${Math.cos(a) * L},${Math.sin(a) * L}`;
	});
	const axon = 'M0,0 C40,60 -20,140 30,220 C60,270 20,320 40,380';
	return (
		<g transform={`scale(${s})`}>
			{dend.map((d, k) => (
				<path key={k} d={d} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" />
			))}
			<path d={axon} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
			<circle r={26} fill={lit > 0 ? C.yellow : color} {...EDGE} />
			{fire >= 0 && fire <= 1 ? (
				<circle cx={30 * fire + Math.sin(fire * 9) * 18} cy={380 * fire} r={14} fill={C.yellow} filter="url(#glow)" />
			) : null}
		</g>
	);
};

/** Paper tape recorder strip with a scrolling neural trace. Origin = left-centre. */
export const SignalStrip: React.FC<{w?: number; h?: number; frame?: number; speed?: number; seed?: number; spikes?: number; color?: string}> = ({
	w = 860,
	h = 150,
	frame = 0,
	speed = 7,
	seed = 3,
	spikes = 1,
	color = C.charcoal,
}) => {
	const off = frame * speed;
	let d = '';
	for (let x = 0; x <= w; x += 6) {
		const u = (x + off) / 6;
		const k = Math.floor(u);
		const r = rand(seed * 101 + k);
		const spike = r > 1 - 0.07 * spikes ? (rand(k + seed) > 0.5 ? -1 : 1) * h * 0.38 * (0.6 + rand(k * 7) * 0.4) : 0;
		const base = Math.sin(u * 0.35) * h * 0.06 + (rand(seed + k * 3) - 0.5) * h * 0.08;
		d += `${x === 0 ? 'M' : 'L'}${x},${(base + spike).toFixed(1)} `;
	}
	return (
		<g>
			<rect x={-10} y={-h / 2} width={w + 20} height={h} rx={6} fill={C.paperWhite} {...EDGE} filter="url(#sh)" />
			{Array.from({length: Math.floor(w / 40)}).map((_, i) => (
				<line key={i} x1={i * 40 - (off % 40)} y1={-h / 2 + 6} x2={i * 40 - (off % 40)} y2={h / 2 - 6} stroke="rgba(198,90,62,0.18)" strokeWidth={1.5} />
			))}
			<path d={d} fill="none" stroke={color} strokeWidth={3.5} strokeLinejoin="round" />
		</g>
	);
};

export type CardPic = 'sun' | 'house' | 'music' | 'key' | 'cake' | 'tree' | 'car' | 'book' | 'phone' | 'chat' | 'star' | 'video' | 'name';

const Pic: React.FC<{k: CardPic}> = ({k}) => {
	switch (k) {
		case 'sun':
			return (
				<g>
					<rect x={-60} y={-40} width={120} height={80} fill={C.navyLight} />
					<circle cx={0} cy={10} r={24} fill={C.yellow} />
					<rect x={-60} y={22} width={120} height={18} fill={C.teal} />
				</g>
			);
		case 'house':
			return (
				<g>
					<path d="M-40,-4 L0,-38 L40,-4 Z" fill={C.terracotta} />
					<rect x={-32} y={-4} width={64} height={42} fill={C.paperShade} />
					<rect x={-8} y={14} width={16} height={24} fill={C.teal} />
				</g>
			);
		case 'music':
			return <path d="M-14,26 a14,12 0 1,0 0.1,0 M0,26 L0,-30 L34,-40 L34,14 M34,14 a14,12 0 1,0 0.1,0" fill={C.charcoal} stroke={C.charcoal} strokeWidth={6} />;
		case 'key':
			return (
				<g fill={C.yellowShade}>
					<circle cx={-24} cy={0} r={20} />
					<circle cx={-24} cy={0} r={8} fill={C.paperWhite} />
					<rect x={-6} y={-6} width={56} height={12} />
					<rect x={34} y={6} width={8} height={14} />
				</g>
			);
		case 'cake':
			return (
				<g>
					<rect x={-40} y={-6} width={80} height={40} rx={6} fill={C.terracotta} />
					<rect x={-40} y={-6} width={80} height={12} fill={C.paperWhite} />
					<rect x={-3} y={-30} width={6} height={24} fill={C.teal} />
					<ellipse cx={0} cy={-36} rx={5} ry={8} fill={C.yellow} />
				</g>
			);
		case 'tree':
			return (
				<g>
					<rect x={-6} y={0} width={12} height={36} fill={C.kraftDark} />
					<circle cx={0} cy={-10} r={30} fill={C.sageDark} />
				</g>
			);
		case 'car':
			return <path d="M-50,20 L-46,0 L-26,-4 L-12,-24 L22,-24 L34,-4 L50,0 L50,20 Z" fill={C.terracotta} />;
		case 'book':
			return (
				<g>
					<path d="M0,-28 Q-30,-38 -54,-28 L-54,30 Q-30,20 0,30 Z" fill={C.teal} />
					<path d="M0,-28 Q30,-38 54,-28 L54,30 Q30,20 0,30 Z" fill={C.tealDark} />
				</g>
			);
		case 'phone':
			return (
				<g>
					<rect x={-22} y={-38} width={44} height={76} rx={8} fill={C.charcoal} />
					<rect x={-16} y={-30} width={32} height={56} rx={3} fill={C.navyLight} />
				</g>
			);
		case 'chat':
			return (
				<g>
					<path d="M-50,-30 L50,-30 L50,20 L-10,20 L-30,38 L-26,20 L-50,20 Z" fill={C.paperShade} stroke={C.charcoal} strokeWidth={3} />
					<line x1={-34} y1={-12} x2={34} y2={-12} stroke={C.charcoal} strokeWidth={5} />
					<line x1={-34} y1={4} x2={14} y2={4} stroke={C.charcoal} strokeWidth={5} />
				</g>
			);
		case 'star':
			return <path d="M0,-34 L10,-10 L36,-10 L15,6 L23,32 L0,16 L-23,32 L-15,6 L-36,-10 L-10,-10 Z" fill={C.yellow} />;
		case 'video':
			return (
				<g>
					<rect x={-50} y={-34} width={100} height={68} rx={8} fill={C.charcoal} />
					<path d="M-12,-16 L18,0 L-12,16 Z" fill={C.yellow} />
				</g>
			);
		case 'name':
			return (
				<g>
					<circle cx={0} cy={-14} r={18} fill={C.charcoalSoft} />
					<path d="M-34,36 Q-34,6 0,6 Q34,6 34,36 Z" fill={C.charcoalSoft} />
				</g>
			);
		default:
			return null;
	}
};

/** Index-card "memory". Origin = centre (card 170×120 at s=1). */
export const MemoryCard: React.FC<{pic: CardPic; s?: number; hi?: boolean; faded?: number; label?: string; seed?: number}> = ({pic, s = 1, hi, faded = 0, label, seed = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-85} y={-60} width={170} height={120} rx={6} fill={hi ? C.yellow : C.paperWhite} {...EDGE} />
		<rect x={-85} y={-60} width={170} height={10} rx={3} fill={hi ? C.yellowShade : [C.teal, C.terracotta, C.navyLight, C.sageDark][seed % 4]} />
		<g transform="translate(0 6) scale(0.7)" opacity={1 - faded * 0.85} style={{filter: faded > 0 ? `grayscale(${faded})` : undefined}}>
			<Pic k={pic} />
		</g>
		{label ? (
			<text x={0} y={52} textAnchor="middle" fontFamily={FONT.display} fontWeight={800} fontSize={16} fill={C.charcoal}>
				{label}
			</text>
		) : null}
		{faded > 0 ? <rect x={-85} y={-60} width={170} height={120} rx={6} fill={C.paper} opacity={faded * 0.55} /> : null}
	</g>
);

/** Paper cloud with optional upload progress bar. Origin = centre. */
export const PaperCloud: React.FC<{s?: number; progress?: number; color?: string}> = ({s = 1, progress, color = C.paperWhite}) => (
	<g transform={`scale(${s})`}>
		<path
			d="M-220,60 C-290,60 -300,-20 -230,-30 C-240,-110 -130,-130 -90,-80 C-60,-170 90,-170 110,-70 C170,-120 260,-60 220,10 C290,20 280,60 230,60 Z"
			fill={color}
			{...EDGE}
			filter="url(#sh)"
		/>
		{progress !== undefined ? (
			<g>
				<rect x={-150} y={0} width={300} height={26} rx={13} fill={C.paperShade} />
				<rect x={-150} y={0} width={300 * Math.max(0, Math.min(1, progress))} height={26} rx={13} fill={C.yellow} />
			</g>
		) : null}
	</g>
);

/** Generic paper-cut human silhouette (abstract — never a real person). Origin = feet centre. */
export const PaperFigure: React.FC<{s?: number; color?: string}> = ({s = 1, color = C.paperShade}) => (
	<g transform={`scale(${s})`}>
		<circle cx={0} cy={-300} r={46} fill={color} {...EDGE} />
		<path d="M-70,-230 Q0,-260 70,-230 L84,-90 L50,-90 L46,0 L10,0 L0,-110 L-10,0 L-46,0 L-50,-90 L-84,-90 Z" fill={color} {...EDGE} />
	</g>
);

/** Year/number flip counter tile row (paper calendar). Origin = centre. */
export const FlipYear: React.FC<{value: number; flip?: number; s?: number}> = ({value, flip = 0, s = 1}) => {
	const digits = String(value).split('');
	return (
		<g transform={`scale(${s})`}>
			<rect x={-280} y={-150} width={560} height={300} rx={18} fill={C.charcoal} {...EDGE} filter="url(#sh)" />
			{digits.map((d, i) => (
				<g key={i} transform={`translate(${-195 + i * 130} 0)`}>
					<rect x={-56} y={-110} width={112} height={220} rx={10} fill={C.paperWhite} />
					<rect x={-56} y={-2} width={112} height={4} fill="rgba(0,0,0,0.25)" />
					<text x={0} y={62} textAnchor="middle" fontFamily={FONT.display} fontWeight={900} fontSize={170} fill={C.charcoal} transform={i === 3 && flip > 0 ? `scale(1 ${1 - flip * 0.9})` : undefined}>
						{d}
					</text>
				</g>
			))}
			<circle cx={-200} cy={-150} r={14} fill={C.steelDark} />
			<circle cx={200} cy={-150} r={14} fill={C.steelDark} />
		</g>
	);
};

/** Paper computer monitor showing a chess board with a thought-driven cursor. Origin = centre of screen. */
export const ChessMonitor: React.FC<{w?: number; cursor?: {x: number; y: number}; moved?: number}> = ({w = 560, cursor = {x: 0, y: 0}, moved = 0}) => {
	const h = w * 0.66;
	const n = 8;
	const cs = (h - 40) / n;
	return (
		<g>
			<rect x={-w / 2 - 26} y={-h / 2 - 26} width={w + 52} height={h + 52} rx={18} fill={C.charcoal} {...EDGE} filter="url(#sh)" />
			<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={C.navy} />
			<g transform={`translate(${-cs * 4} ${-cs * 4})`}>
				{Array.from({length: 64}).map((_, k) => (
					<rect key={k} x={(k % n) * cs} y={Math.floor(k / n) * cs} width={cs} height={cs} fill={(k + Math.floor(k / n)) % 2 ? C.kraftDark : C.paper} />
				))}
				{/* a few pieces as discs; one moves */}
				{[
					[1, 6],
					[2, 6],
					[5, 6],
					[4, 7],
					[3, 1],
					[5, 0],
				].map(([x, y], i) => (
					<circle key={i} cx={(x + 0.5) * cs} cy={(y + 0.5) * cs} r={cs * 0.32} fill={y > 3 ? C.paperWhite : C.charcoal} stroke="rgba(0,0,0,0.3)" strokeWidth={2} />
				))}
				<circle cx={(4.5 - moved * 0) * cs} cy={(6.5 - moved * 2) * cs} r={cs * 0.34} fill={C.yellow} stroke={C.charcoal} strokeWidth={3} />
			</g>
			<g transform={`translate(${cursor.x} ${cursor.y})`}>
				<path d="M0,0 L0,40 L11,30 L19,48 L27,44 L19,27 L34,27 Z" fill={C.white} stroke={C.charcoal} strokeWidth={3} />
			</g>
			<rect x={-60} y={h / 2 + 26} width={120} height={50} fill={C.charcoalSoft} />
			<rect x={-140} y={h / 2 + 70} width={280} height={18} rx={8} fill={C.charcoal} />
		</g>
	);
};

/** Paper smartphone frame (SVG). Children are drawn inside a 300×600 screen at origin (0,0) top-left of the screen. */
export const PaperPhone: React.FC<{children?: React.ReactNode; clipId?: string}> = ({children, clipId = 'phoneclip'}) => (
	<g>
		<rect x={-180} y={-340} width={360} height={680} rx={46} fill={C.charcoal} {...EDGE} filter="url(#shl)" />
		<defs>
			<clipPath id={clipId}>
				<rect x={-150} y={-300} width={300} height={600} rx={18} />
			</clipPath>
		</defs>
		<g clipPath={`url(#${clipId})`}>
			<rect x={-150} y={-300} width={300} height={600} fill={C.navyDeep} />
			<g transform="translate(-150 -300)">{children}</g>
		</g>
		<rect x={-40} y={-326} width={80} height={10} rx={5} fill={C.charcoalSoft} />
	</g>
);

/** Cork/kraft evidence board pin. */
export const Pin: React.FC<{color?: string}> = ({color = C.terracotta}) => (
	<g>
		<circle r={12} fill={color} {...EDGE} />
		<circle cx={-3} cy={-3} r={4} fill="rgba(255,255,255,0.5)" />
	</g>
);

/** Archive of memory drawers/cards scrolling past (rolodex rail). Origin = left-centre of the rail. */
export const ArchiveRail: React.FC<{w: number; offset: number; seed?: number; rows?: number; hiIndex?: number; hiLift?: number}> = ({w, offset, seed = 1, rows = 3, hiIndex = -1, hiLift = 0}) => {
	const pics: CardPic[] = ['sun', 'house', 'music', 'key', 'cake', 'tree', 'car', 'book', 'phone', 'chat', 'star'];
	const gap = 120;
	const n = Math.ceil(w / gap) + 2;
	const first = Math.floor(offset / gap);
	return (
		<g>
			{Array.from({length: rows}).map((_, r) => (
				<g key={r} transform={`translate(0 ${(r - (rows - 1) / 2) * 190})`}>
					<rect x={-30} y={50} width={w + 60} height={22} rx={8} fill={C.charcoalSoft} />
					{Array.from({length: n}).map((_, k) => {
						const idx = first + k;
						const x = idx * gap - offset;
						const hi = r === 1 && idx === hiIndex;
						const lean = Math.max(-40, Math.min(40, (x - w / 2) * -0.06));
						return (
							<g key={k} transform={`translate(${x} ${hi ? -hiLift * 60 : 0}) rotate(${lean} 0 60)`}>
								<MemoryCard pic={pics[Math.floor(rand(seed * 31 + idx * 7 + r) * pics.length)]} s={0.62} hi={hi} seed={idx + r} />
							</g>
						);
					})}
				</g>
			))}
		</g>
	);
};

/** Small decorative gear cluster used in machines. */
export const GearPair: React.FC<{frame: number; s?: number}> = ({frame, s = 1}) => (
	<g transform={`scale(${s})`}>
		<Gear r={60} teeth={10} rot={frame * 3} />
		<g transform="translate(88 -40)">
			<Gear r={38} teeth={8} rot={-frame * 4.7} color={C.charcoalSoft} />
		</g>
	</g>
);
