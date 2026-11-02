// Reusable paper-cut illustration props (SVG, drawn in local coordinates).
// Convention: each prop is drawn around a documented origin and positioned with <G x y r s>.
import React from 'react';
import {rand} from './anim';
import {C, FONT} from './tokens';

export const EDGE = {stroke: 'rgba(30,20,10,0.22)', strokeWidth: 2, strokeLinejoin: 'round' as const};

/** Shared SVG filter defs: paper contact shadows + glow. Include once per <svg>. */
export const SvgDefs: React.FC = () => (
	<defs>
		<filter id="sh" x="-30%" y="-30%" width="160%" height="170%">
			<feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="#140e08" floodOpacity="0.36" />
		</filter>
		<filter id="shs" x="-30%" y="-30%" width="160%" height="170%">
			<feDropShadow dx="0" dy="3" stdDeviation="2.2" floodColor="#140e08" floodOpacity="0.38" />
		</filter>
		<filter id="shl" x="-40%" y="-40%" width="180%" height="190%">
			<feDropShadow dx="0" dy="18" stdDeviation="12" floodColor="#140e08" floodOpacity="0.32" />
		</filter>
		<filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
			<feGaussianBlur stdDeviation="10" result="b" />
			<feMerge>
				<feMergeNode in="b" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="softglow" x="-100%" y="-100%" width="300%" height="300%">
			<feGaussianBlur stdDeviation="28" />
		</filter>
	</defs>
);

export const G: React.FC<{x?: number; y?: number; r?: number; s?: number; sx?: number; sy?: number; o?: number; f?: string; children?: React.ReactNode}> = ({
	x = 0,
	y = 0,
	r = 0,
	s = 1,
	sx,
	sy,
	o = 1,
	f,
	children,
}) => (
	<g transform={`translate(${x} ${y}) rotate(${r}) scale(${sx ?? s} ${sy ?? s})`} opacity={o} filter={f ? `url(#${f})` : undefined}>
		{children}
	</g>
);

// ---------- basic shapes ----------
export const gearPath = (r: number, teeth: number, depth = 0.18, hole = 0.32) => {
	const pts: string[] = [];
	const ri = r * (1 - depth);
	for (let i = 0; i < teeth; i++) {
		const a0 = (i / teeth) * Math.PI * 2;
		const st = (Math.PI * 2) / teeth;
		const seq: [number, number][] = [
			[a0, ri],
			[a0 + st * 0.12, r],
			[a0 + st * 0.48, r],
			[a0 + st * 0.6, ri],
		];
		for (const [a, rr] of seq) pts.push(`${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`);
	}
	const h = r * hole;
	return `M${pts.join(' L')} Z M${h},0 A${h},${h} 0 1,0 ${-h},0 A${h},${h} 0 1,0 ${h},0 Z`;
};

/** Gear, origin = centre. */
export const Gear: React.FC<{r?: number; teeth?: number; color?: string; rot?: number; hole?: number}> = ({r = 80, teeth = 12, color = C.yellow, rot = 0, hole = 0.3}) => (
	<g transform={`rotate(${rot})`}>
		<path d={gearPath(r, teeth, 0.2, hole)} fill={color} fillRule="evenodd" {...EDGE} />
		<circle r={r * 0.62} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={r * 0.06} />
	</g>
);

/** Industrial robot arm. Origin = base bottom centre. Angles in degrees (0 = straight up). */
export const RobotArm: React.FC<{a1?: number; a2?: number; a3?: number; color?: string; dark?: string; tool?: 'gripper' | 'welder' | 'brush' | 'none'; grip?: number; l1?: number; l2?: number}> = ({
	a1 = -20,
	a2 = 70,
	a3 = 30,
	color = C.yellow,
	dark = C.yellowShade,
	tool = 'gripper',
	grip = 0.5,
	l1 = 210,
	l2 = 170,
}) => (
	<g>
		<path d="M-80,0 L80,0 L62,-40 L-62,-40 Z" fill={C.charcoal} {...EDGE} />
		<rect x={-46} y={-86} width={92} height={50} rx={10} fill={dark} {...EDGE} />
		<g transform={`translate(0 -80) rotate(${a1})`}>
			<rect x={-30} y={-l1} width={60} height={l1 + 14} rx={28} fill={color} {...EDGE} />
			<circle r={30} fill={dark} {...EDGE} />
			<circle r={11} fill={C.charcoal} />
			<g transform={`translate(0 ${-l1}) rotate(${a2})`}>
				<rect x={-24} y={-l2} width={48} height={l2 + 10} rx={22} fill={color} {...EDGE} />
				<circle r={26} fill={dark} {...EDGE} />
				<circle r={9} fill={C.charcoal} />
				<g transform={`translate(0 ${-l2}) rotate(${a3})`}>
					<rect x={-20} y={-34} width={40} height={40} rx={8} fill={C.charcoalSoft} {...EDGE} />
					{tool === 'gripper' ? (
						<>
							<rect x={-22 - grip * 10} y={-78} width={12} height={48} rx={4} fill={C.steelDark} />
							<rect x={10 + grip * 10} y={-78} width={12} height={48} rx={4} fill={C.steelDark} />
						</>
					) : null}
					{tool === 'welder' ? <path d="M-8,-34 L8,-34 L4,-86 L-4,-86 Z" fill={C.steelDark} /> : null}
					{tool === 'brush' ? <rect x={-46} y={-62} width={92} height={28} rx={8} fill={C.teal} {...EDGE} /> : null}
				</g>
			</g>
		</g>
	</g>
);

/** End point of a RobotArm tool tip (for sparks / attaching objects). */
export const armTip = (a1: number, a2: number, a3: number, l1 = 210, l2 = 170, tool = 86) => {
	const d = (deg: number) => (deg * Math.PI) / 180;
	let x = 0;
	let y = -80;
	let a = d(a1);
	x += Math.sin(a) * l1;
	y -= Math.cos(a) * l1;
	a += d(a2);
	x += Math.sin(a) * l2;
	y -= Math.cos(a) * l2;
	a += d(a3);
	x += Math.sin(a) * tool;
	y -= Math.cos(a) * tool;
	return {x, y};
};

/** Factory with saw-tooth roof. Origin = bottom-left. */
export const Factory: React.FC<{w?: number; h?: number; color?: string; roof?: string; lit?: number; chimney?: boolean; smoke?: number; door?: string}> = ({
	w = 360,
	h = 200,
	color = C.paper,
	roof = C.charcoal,
	lit = 0,
	chimney = true,
	smoke = 0,
	door = C.teal,
}) => {
	const teeth = 4;
	const tw = w / teeth;
	let roofD = `M0,${-h}`;
	for (let i = 0; i < teeth; i++) roofD += ` L${i * tw + tw},${-h - 70} L${i * tw + tw},${-h}`;
	roofD += ` L${w},${-h} Z`;
	const win: React.ReactNode[] = [];
	const cols = Math.max(3, Math.round(w / 90));
	for (let i = 0; i < cols; i++)
		win.push(
			<rect
				key={i}
				x={20 + i * ((w - 40) / cols) + 8}
				y={-h + 40}
				width={(w - 40) / cols - 16}
				height={56}
				rx={4}
				fill={lit > 0 ? C.yellowLight : C.navyLight}
				opacity={lit > 0 ? 0.6 + 0.4 * lit : 1}
				{...EDGE}
			/>,
		);
	return (
		<g>
			{chimney ? (
				<>
					<rect x={w - 90} y={-h - 150} width={44} height={150} fill={C.terracotta} {...EDGE} />
					<rect x={w - 96} y={-h - 160} width={56} height={18} fill={C.charcoal} />
					{smoke > 0
						? [0, 1, 2].map((k) => {
								const t = (smoke + k / 3) % 1;
								return <circle key={k} cx={w - 68 + t * 40} cy={-h - 170 - t * 140} r={18 + t * 26} fill={C.paperShade} opacity={0.85 * (1 - t)} {...EDGE} />;
							})
						: null}
				</>
			) : null}
			<path d={roofD} fill={roof} {...EDGE} />
			{Array.from({length: teeth}).map((_, i) => (
				<path key={i} d={`M${i * tw + tw - 12},${-h - 58} L${i * tw + tw - 12},${-h - 6} L${i * tw + tw - 46},${-h - 6} Z`} fill={C.yellowLight} opacity={0.35 + lit * 0.5} />
			))}
			<rect x={0} y={-h} width={w} height={h} fill={color} {...EDGE} />
			{win}
			<rect x={w / 2 - 44} y={-96} width={88} height={96} fill={door} {...EDGE} />
			<rect x={w / 2 - 44} y={-96} width={88} height={10} fill="rgba(0,0,0,0.2)" />
		</g>
	);
};

/** Side-view car. Origin = bottom centre (wheel contact). */
export const Car: React.FC<{w?: number; color?: string; wheelRot?: number; parts?: number; wheels?: number}> = ({w = 360, color = C.terracotta, wheelRot = 0, parts = 1, wheels = 1}) => {
	const s = w / 360;
	const body = 'M-175,-40 Q-180,-80 -150,-88 L-95,-96 Q-60,-150 10,-152 Q80,-150 110,-100 L160,-90 Q182,-84 180,-50 L178,-40 Z';
	const wheel = (cx: number) => (
		<g transform={`translate(${cx} -38) rotate(${wheelRot}) scale(${wheels})`}>
			<circle r={38} fill={C.charcoal} {...EDGE} />
			<circle r={17} fill={C.steel} />
			<rect x={-3} y={-17} width={6} height={34} fill={C.steelDark} />
		</g>
	);
	return (
		<g transform={`scale(${s})`}>
			<g opacity={parts}>
				<path d={body} fill={color} {...EDGE} />
				<path d="M-78,-98 Q-50,-138 2,-140 L2,-98 Z" fill={C.navyLight} {...EDGE} />
				<path d="M16,-98 L16,-140 Q70,-136 92,-100 Z" fill={C.navyLight} {...EDGE} />
				<rect x={-10} y={-80} width={30} height={6} rx={3} fill="rgba(0,0,0,0.25)" />
				<circle cx={168} cy={-70} r={8} fill={C.yellowLight} />
			</g>
			{wheels > 0.01 ? wheel(-105) : null}
			{wheels > 0.01 ? wheel(108) : null}
		</g>
	);
};

/** Autonomous car-carrier truck (illustrative). Origin = bottom-left at road level. `cargo` renders on the deck. */
export const Truck: React.FC<{wheelRot?: number; ping?: number; cargo?: React.ReactNode; color?: string}> = ({wheelRot = 0, ping = 0, cargo, color = C.navy}) => {
	const wheel = (cx: number) => (
		<g transform={`translate(${cx} -34) rotate(${wheelRot})`}>
			<circle r={34} fill={C.charcoal} {...EDGE} />
			<circle r={14} fill={C.steel} />
			<rect x={-3} y={-14} width={6} height={28} fill={C.steelDark} />
		</g>
	);
	return (
		<g>
			{/* trailer deck */}
			<rect x={0} y={-80} width={470} height={26} fill={C.steelDark} {...EDGE} />
			<g transform="translate(235 -80)">{cargo}</g>
			{/* cab */}
			<path d="M480,-40 L480,-200 Q480,-216 496,-216 L590,-216 Q640,-210 650,-150 L656,-40 Z" fill={color} {...EDGE} />
			<path d="M560,-196 L600,-196 Q630,-190 636,-150 L560,-150 Z" fill={C.navyLight} {...EDGE} />
			<rect x={490} y={-120} width={150} height={10} fill={C.yellow} />
			{/* sensor dome (lidar) + pings */}
			<rect x={510} y={-238} width={56} height={22} rx={8} fill={C.yellow} {...EDGE} />
			{ping > 0
				? [0, 1].map((k) => {
						const t = (ping + k * 0.5) % 1;
						return <path key={k} d={`M${538 - 40 - t * 60},${-250 - t * 30} Q538,${-290 - t * 70} ${538 + 40 + t * 60},${-250 - t * 30}`} fill="none" stroke={C.yellow} strokeWidth={5} opacity={1 - t} strokeLinecap="round" />;
					})
				: null}
			<rect x={0} y={-56} width={660} height={20} fill={C.charcoal} />
			{wheel(70)}
			{wheel(150)}
			{wheel(400)}
			{wheel(600)}
		</g>
	);
};

/** House. Origin = bottom-left. */
export const House: React.FC<{w?: number; h?: number; color?: string; roof?: string; door?: number; lit?: number}> = ({w = 300, h = 220, color = C.paper, roof = C.terracotta, door = 0, lit = 0}) => (
	<g>
		<rect x={w * 0.68} y={-h - 110} width={40} height={90} fill={C.kraftDark} {...EDGE} />
		<path d={`M${-24},${-h} L${w / 2},${-h - 150} L${w + 24},${-h} Z`} fill={roof} {...EDGE} />
		<rect x={0} y={-h} width={w} height={h} fill={color} {...EDGE} />
		<rect x={30} y={-h + 46} width={84} height={70} rx={4} fill={lit ? C.yellowLight : C.navyLight} {...EDGE} />
		<rect x={w - 120} y={-140} width={78} height={140} fill={C.kraftDark} {...EDGE} />
		<rect x={w - 120} y={-140} width={78 * (1 - door)} height={140} fill={C.teal} {...EDGE} />
		<circle cx={w - 120 + 78 * (1 - door) - 14} cy={-70} r={6} fill={C.yellow} />
	</g>
);

/** Blast furnace / smelter. Origin = bottom centre. `window` area is exposed via props for real footage overlay. */
export const Furnace: React.FC<{glow?: number; pour?: number}> = ({glow = 0, pour = 0}) => (
	<g>
		<path d="M-150,0 L-120,-360 L-70,-430 L70,-430 L120,-360 L150,0 Z" fill={C.charcoalSoft} {...EDGE} />
		<path d="M-70,-430 L-50,-520 L50,-520 L70,-430 Z" fill={C.charcoal} {...EDGE} />
		{[0, 1, 2, 3].map((i) => (
			<rect key={i} x={-140 + i * 4} y={-80 - i * 80} width={280 - i * 8} height={10} fill="rgba(0,0,0,0.25)" />
		))}
		<rect x={-95} y={-300} width={190} height={170} rx={14} fill="#1a0f08" {...EDGE} />
		<rect x={-95} y={-300} width={190} height={170} rx={14} fill={C.fire} opacity={0.25 + glow * 0.6} filter="url(#glow)" />
		{/* spout + molten stream */}
		<path d="M110,-110 L210,-90 L210,-70 L110,-80 Z" fill={C.charcoal} {...EDGE} />
		{pour > 0 ? <rect x={196} y={-72} width={16} height={pour * 72} rx={8} fill={C.fireHot} filter="url(#glow)" /> : null}
	</g>
);

/** Robotic excavator (illustrative). Origin = bottom centre of tracks. */
export const Excavator: React.FC<{boom?: number; stick?: number; bucket?: number; color?: string}> = ({boom = -20, stick = 50, bucket = 40, color = C.yellow}) => (
	<g>
		<rect x={-150} y={-56} width={300} height={56} rx={28} fill={C.charcoal} {...EDGE} />
		{[-110, -55, 0, 55, 110].map((cx) => (
			<circle key={cx} cx={cx} cy={-28} r={16} fill={C.steelDark} />
		))}
		<rect x={-120} y={-150} width={210} height={96} rx={12} fill={color} {...EDGE} />
		<rect x={-110} y={-210} width={110} height={70} rx={10} fill={C.yellowShade} {...EDGE} />
		<rect x={-98} y={-200} width={86} height={34} rx={6} fill={C.navyLight} />
		<circle cx={-55} cy={-226} r={10} fill={C.terracotta} />
		<g transform={`translate(70 -130) rotate(${boom})`}>
			<rect x={-20} y={-20} width={250} height={40} rx={18} fill={color} {...EDGE} />
			<g transform={`translate(230 0) rotate(${stick})`}>
				<rect x={-16} y={-16} width={170} height={32} rx={14} fill={C.yellowShade} {...EDGE} />
				<g transform={`translate(160 0) rotate(${bucket})`}>
					<path d="M-10,-24 L60,-30 L70,30 L0,40 Z" fill={C.steelDark} {...EDGE} />
				</g>
			</g>
		</g>
	</g>
);

/** Conveyor belt. Origin = left end, top of belt. */
export const Conveyor: React.FC<{len: number; frame: number; speed?: number; color?: string}> = ({len, frame, speed = 6, color = C.charcoal}) => {
	const off = (frame * speed) % 40;
	const rollers = Math.floor(len / 70);
	return (
		<g>
			<rect x={0} y={0} width={len} height={34} rx={17} fill={color} {...EDGE} />
			<line x1={20} y1={8} x2={len - 20} y2={8} stroke="rgba(255,255,255,0.22)" strokeWidth={4} strokeDasharray="18 22" strokeDashoffset={-off} />
			{Array.from({length: rollers}).map((_, i) => (
				<g key={i} transform={`translate(${35 + i * ((len - 70) / Math.max(1, rollers - 1))} 17) rotate(${frame * speed * 3})`}>
					<circle r={11} fill={C.steel} />
					<rect x={-2} y={-11} width={4} height={22} fill={C.steelDark} />
				</g>
			))}
			<rect x={30} y={34} width={18} height={70} fill={C.steelDark} />
			<rect x={len - 48} y={34} width={18} height={70} fill={C.steelDark} />
		</g>
	);
};

/** Stamping press. Origin = bottom centre. ram = 0 (up) .. 1 (down). */
export const Press: React.FC<{ram?: number; color?: string}> = ({ram = 0, color = C.teal}) => (
	<g>
		<rect x={-170} y={-40} width={340} height={40} fill={C.charcoal} {...EDGE} />
		<rect x={-170} y={-420} width={56} height={380} fill={color} {...EDGE} />
		<rect x={114} y={-420} width={56} height={380} fill={color} {...EDGE} />
		<rect x={-190} y={-470} width={380} height={70} rx={10} fill={C.tealDark} {...EDGE} />
		<rect x={-30} y={-400} width={60} height={60 + ram * 200} fill={C.steelDark} />
		<rect x={-110} y={-340 + ram * 200} width={220} height={60} rx={6} fill={C.steel} {...EDGE} />
		<rect x={-120} y={-80} width={240} height={40} fill={C.steelDark} {...EDGE} />
		<rect x={-160} y={-454} width={60} height={20} rx={4} fill={C.yellow} />
	</g>
);

/** Solar panel on a stand. Origin = bottom centre. */
export const SolarPanel: React.FC<{w?: number; tilt?: number; shine?: number}> = ({w = 220, tilt = -14, shine = 0}) => (
	<g>
		<rect x={-6} y={-90} width={12} height={90} fill={C.steelDark} />
		<g transform={`translate(0 -96) rotate(${tilt})`}>
			<rect x={-w / 2} y={-62} width={w} height={74} rx={4} fill={C.navy} {...EDGE} />
			{Array.from({length: 5}).map((_, i) => (
				<line key={i} x1={-w / 2 + (w / 5) * i} y1={-62} x2={-w / 2 + (w / 5) * i} y2={12} stroke={C.navyLight} strokeWidth={3} />
			))}
			<line x1={-w / 2} y1={-25} x2={w / 2} y2={-25} stroke={C.navyLight} strokeWidth={3} />
			<path d={`M${-w / 2 + 20 + shine * w},-62 l40,0 l-30,74 l-40,0 Z`} fill="rgba(255,255,255,0.25)" />
		</g>
	</g>
);

/** Wind turbine. Origin = bottom of tower. */
export const WindTurbine: React.FC<{h?: number; blade?: number; build?: number}> = ({h = 420, blade = 0, build = 1}) => (
	<g>
		<path d={`M-16,0 L16,0 L7,${-h * build} L-7,${-h * build} Z`} fill={C.paperWhite} {...EDGE} />
		{build >= 0.99 ? (
			<g transform={`translate(0 ${-h})`}>
				<rect x={-26} y={-16} width={52} height={30} rx={10} fill={C.paperWhite} {...EDGE} />
				<g transform={`rotate(${blade})`}>
					{[0, 120, 240].map((a) => (
						<path key={a} transform={`rotate(${a})`} d={`M-8,0 Q-14,${-h * 0.25} 0,${-h * 0.46} Q10,${-h * 0.25} 8,0 Z`} fill={C.paperWhite} {...EDGE} />
					))}
					<circle r={12} fill={C.yellow} {...EDGE} />
				</g>
			</g>
		) : null}
	</g>
);

/** Electricity pylon. Origin = bottom centre. */
export const Pylon: React.FC<{h?: number; color?: string}> = ({h = 380, color = C.charcoalSoft}) => (
	<g stroke={color} strokeWidth={8} fill="none" strokeLinecap="round">
		<path d={`M-70,0 L-14,${-h} M70,0 L14,${-h} M-14,${-h} L14,${-h}`} />
		<path d={`M-55,${-h * 0.25} L45,${-h * 0.5} M55,${-h * 0.25} L-45,${-h * 0.5} M-42,${-h * 0.55} L32,${-h * 0.78} M42,${-h * 0.55} L-32,${-h * 0.78}`} strokeWidth={5} />
		<path d={`M-110,${-h * 0.7} L110,${-h * 0.7} M-80,${-h * 0.88} L80,${-h * 0.88}`} strokeWidth={9} />
	</g>
);

/** Lightning bolt. Origin = centre. */
export const Bolt: React.FC<{s?: number; color?: string}> = ({s = 1, color = C.yellow}) => (
	<path transform={`scale(${s})`} d="M14,-90 L-46,10 L-4,10 L-22,90 L46,-16 L4,-16 Z" fill={color} {...EDGE} />
);

/** AI chip. Origin = centre. */
export const Chip: React.FC<{s?: number; glow?: number; label?: string}> = ({s = 1, glow = 0, label = 'AI'}) => (
	<g transform={`scale(${s})`}>
		{Array.from({length: 5}).map((_, i) => (
			<g key={i}>
				<rect x={-62 + i * 28} y={-104} width={12} height={30} fill={C.steel} />
				<rect x={-62 + i * 28} y={74} width={12} height={30} fill={C.steel} />
				<rect x={-104} y={-62 + i * 28} width={30} height={12} fill={C.steel} />
				<rect x={74} y={-62 + i * 28} width={30} height={12} fill={C.steel} />
			</g>
		))}
		<rect x={-80} y={-80} width={160} height={160} rx={16} fill={C.charcoal} {...EDGE} />
		<rect x={-48} y={-48} width={96} height={96} rx={10} fill={C.yellow} opacity={0.35 + glow * 0.65} filter={glow > 0.2 ? 'url(#glow)' : undefined} />
		<text x={0} y={16} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={44} fill={C.charcoal}>
			{label}
		</text>
	</g>
);

/** Bank building. Origin = bottom centre. */
export const Bank: React.FC<{w?: number}> = ({w = 520}) => (
	<g>
		<rect x={-w / 2 - 20} y={-30} width={w + 40} height={30} fill={C.paperShade} {...EDGE} />
		<rect x={-w / 2} y={-300} width={w} height={270} fill={C.paper} {...EDGE} />
		{Array.from({length: 5}).map((_, i) => (
			<rect key={i} x={-w / 2 + 30 + i * ((w - 60) / 4) - 18} y={-290} width={36} height={260} fill={C.paperShade} {...EDGE} />
		))}
		<rect x={-w / 2 - 24} y={-330} width={w + 48} height={34} fill={C.navy} {...EDGE} />
		<path d={`M${-w / 2 - 30},-330 L0,-450 L${w / 2 + 30},-330 Z`} fill={C.navy} {...EDGE} />
		<circle cx={0} cy={-370} r={30} fill={C.yellow} {...EDGE} />
	</g>
);

/** Balance scale. Origin = bottom centre of the stand. tilt in degrees (+ = right pan down). */
export const Balance: React.FC<{tilt?: number; left?: React.ReactNode; right?: React.ReactNode; w?: number}> = ({tilt = 0, left, right, w = 640}) => {
	const a = (tilt * Math.PI) / 180;
	const lx = (-w / 2) * Math.cos(a);
	const ly = (-w / 2) * Math.sin(a);
	const rx = (w / 2) * Math.cos(a);
	const ry = (w / 2) * Math.sin(a);
	const pan = (x: number, y: number, content: React.ReactNode) => (
		<g transform={`translate(${x} ${y - 470})`}>
			<line x1={-90} y1={160} x2={0} y2={0} stroke={C.charcoal} strokeWidth={4} />
			<line x1={90} y1={160} x2={0} y2={0} stroke={C.charcoal} strokeWidth={4} />
			<g transform="translate(0 160)">{content}</g>
			<path d="M-130,160 L130,160 Q110,206 0,206 Q-110,206 -130,160 Z" fill={C.kraft} {...EDGE} />
		</g>
	);
	return (
		<g>
			<path d="M-120,0 L120,0 L60,-40 L-60,-40 Z" fill={C.charcoal} {...EDGE} />
			<rect x={-16} y={-470} width={32} height={430} fill={C.charcoalSoft} {...EDGE} />
			<g transform={`translate(0 -470) rotate(${tilt})`}>
				<rect x={-w / 2} y={-12} width={w} height={24} rx={12} fill={C.charcoal} {...EDGE} />
			</g>
			<circle cx={0} cy={-470} r={22} fill={C.yellow} {...EDGE} />
			{pan(lx, ly, left)}
			{pan(rx, ry, right)}
		</g>
	);
};

/** Fictional banknote (no real currency, no portrait). Origin = centre. Emblem = gear (callback to "productive capacity"). */
export const Banknote: React.FC<{w?: number; value?: string; color?: string; ink?: string; gray?: number; seed?: number}> = ({
	w = 760,
	value = '100',
	color = '#A9BC93',
	ink = '#3F5434',
	gray = 0,
	seed = 1,
}) => {
	const h = w * 0.47;
	const lines = Array.from({length: 7}).map((_, i) => {
		let d = `M${-w / 2 + 40},${-h / 2 + 60 + i * 14}`;
		for (let x = -w / 2 + 40; x <= w / 2 - 40; x += 20) d += ` L${x},${-h / 2 + 60 + i * 14 + Math.sin(x / 26 + i + seed) * 6}`;
		return <path key={i} d={d} fill="none" stroke={ink} strokeWidth={1.6} opacity={0.35} />;
	});
	return (
		<g style={{filter: gray > 0 ? `grayscale(${gray}) brightness(${1 - gray * 0.12})` : undefined}}>
			<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={color} {...EDGE} />
			<rect x={-w / 2 + 18} y={-h / 2 + 18} width={w - 36} height={h - 36} rx={6} fill="none" stroke={ink} strokeWidth={4} opacity={0.75} />
			<rect x={-w / 2 + 30} y={-h / 2 + 30} width={w - 60} height={h - 60} rx={4} fill="none" stroke={ink} strokeWidth={1.5} opacity={0.6} strokeDasharray="6 5" />
			{lines}
			<g transform={`translate(${-w * 0.2} ${h * 0.05})`}>
				<circle r={h * 0.3} fill="none" stroke={ink} strokeWidth={3} opacity={0.7} />
				<g opacity={0.85}>
					<Gear r={h * 0.24} teeth={14} color="none" />
					<path d={gearPath(h * 0.24, 14, 0.2, 0.3)} fill="none" stroke={ink} strokeWidth={4} fillRule="evenodd" />
				</g>
			</g>
			<text x={w / 2 - 54} y={h * 0.2} textAnchor="end" fontFamily={FONT.display} fontWeight={900} fontSize={h * 0.42} fill={ink}>
				{value}
			</text>
			<text x={w / 2 - 60} y={-h / 2 + 76} textAnchor="end" fontFamily={FONT.display} fontWeight={700} fontSize={34} fill={ink}>
				مصاري
			</text>
			<text x={-w / 2 + 52} y={h / 2 - 44} fontFamily={FONT.mono} fontWeight={700} fontSize={24} fill={ink} opacity={0.8}>
				{`N° ${(Math.floor(rand(seed) * 9e7) + 1e7).toString()}`}
			</text>
		</g>
	);
};

/** Crate / box. Origin = bottom centre. */
export const Crate: React.FC<{s?: number; color?: string}> = ({s = 80, color = C.kraft}) => (
	<g>
		<rect x={-s / 2} y={-s} width={s} height={s} rx={4} fill={color} {...EDGE} />
		<path d={`M${-s / 2},${-s} L${s / 2},0 M${s / 2},${-s} L${-s / 2},0`} stroke="rgba(0,0,0,0.15)" strokeWidth={4} />
		<rect x={-s * 0.16} y={-s} width={s * 0.32} height={s * 0.2} fill={C.yellow} opacity={0.8} />
	</g>
);

/** Metal ingot (trapezoid bar). Origin = bottom centre. */
export const Ingot: React.FC<{s?: number; color?: string}> = ({s = 1, color = C.steel}) => (
	<g transform={`scale(${s})`}>
		<path d="M-80,0 L80,0 L60,-46 L-60,-46 Z" fill={color} {...EDGE} />
		<path d="M-60,-46 L60,-46 L52,-38 L-52,-38 Z" fill="rgba(255,255,255,0.35)" />
	</g>
);

/** Ore nugget. Origin = centre. */
export const Ore: React.FC<{s?: number; seed?: number; color?: string}> = ({s = 1, seed = 1, color = '#7A4A3A'}) => {
	const pts = Array.from({length: 7}).map((_, i) => {
		const a = (i / 7) * Math.PI * 2;
		const r = 24 * (0.75 + rand(seed * 13 + i) * 0.45);
		return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
	});
	return (
		<g transform={`scale(${s})`}>
			<path d={`M${pts.join(' L')} Z`} fill={color} {...EDGE} />
			<circle cx={-5} cy={-6} r={4} fill="rgba(255,255,255,0.25)" />
		</g>
	);
};

// ---------- simple icons (origin = centre, ~120px box) ----------
export const Icon: React.FC<{name: 'car' | 'house' | 'bread' | 'wheat' | 'shirt' | 'pill' | 'bolt' | 'gear' | 'worker' | 'phone' | 'beam' | 'robot' | 'ore' | 'furnace' | 'box'; s?: number; color?: string}> = ({
	name,
	s = 1,
	color,
}) => {
	const sc = `scale(${s})`;
	switch (name) {
		case 'car':
			return (
				<g transform={`${sc} translate(0 40)`}>
					<Car w={130} color={color ?? C.terracotta} />
				</g>
			);
		case 'house':
			return (
				<g transform={`${sc} translate(-48 52)`}>
					<House w={96} h={70} color={color ?? C.paper} />
				</g>
			);
		case 'wheat':
			return (
				<g transform={sc} fill={color ?? C.yellow} {...EDGE}>
					<rect x={-3} y={-10} width={6} height={70} fill={C.sageDark} />
					{[0, 1, 2, 3].map((i) => (
						<g key={i}>
							<ellipse cx={-14} cy={-40 + i * 16} rx={9} ry={15} transform={`rotate(-30 -14 ${-40 + i * 16})`} />
							<ellipse cx={14} cy={-40 + i * 16} rx={9} ry={15} transform={`rotate(30 14 ${-40 + i * 16})`} />
						</g>
					))}
					<ellipse cx={0} cy={-62} rx={8} ry={14} />
				</g>
			);
		case 'bread':
			return (
				<g transform={sc}>
					<path d="M-60,30 L-60,-10 Q-60,-50 0,-50 Q60,-50 60,-10 L60,30 Z" fill={color ?? '#D9A35B'} {...EDGE} />
					{[-30, 0, 30].map((x) => (
						<path key={x} d={`M${x - 10},-34 L${x + 10},-14`} stroke="rgba(0,0,0,0.25)" strokeWidth={5} strokeLinecap="round" />
					))}
				</g>
			);
		case 'shirt':
			return (
				<path transform={sc} d="M-25,-55 Q0,-40 25,-55 L65,-35 L50,0 L35,-8 L35,55 L-35,55 L-35,-8 L-50,0 L-65,-35 Z" fill={color ?? C.teal} {...EDGE} />
			);
		case 'pill':
			return (
				<g transform={`${sc} rotate(-35)`}>
					<rect x={-60} y={-24} width={120} height={48} rx={24} fill={C.paperWhite} {...EDGE} />
					<path d="M0,-24 L36,-24 A24,24 0 0 1 36,24 L0,24 Z" fill={color ?? C.terracotta} />
				</g>
			);
		case 'bolt':
			return <Bolt s={0.6 * s} color={color} />;
		case 'gear':
			return (
				<g transform={sc}>
					<Gear r={55} teeth={10} color={color ?? C.yellow} />
				</g>
			);
		case 'worker':
			return (
				<g transform={sc} fill={color ?? C.charcoalSoft}>
					<circle cx={0} cy={-42} r={20} />
					<path d="M-26,-48 Q0,-80 26,-48 Z" fill={C.yellow} />
					<path d="M-34,60 L-34,0 Q-34,-18 -16,-18 L16,-18 Q34,-18 34,0 L34,60 Z" />
				</g>
			);
		case 'phone':
			return (
				<g transform={sc}>
					<rect x={-34} y={-60} width={68} height={120} rx={12} fill={C.charcoal} {...EDGE} />
					<rect x={-26} y={-48} width={52} height={90} rx={4} fill={C.navyLight} />
				</g>
			);
		case 'beam':
			return <path transform={sc} d="M-70,-40 L70,-40 L70,-24 L10,-24 L10,24 L70,24 L70,40 L-70,40 L-70,24 L-10,24 L-10,-24 L-70,-24 Z" fill={color ?? C.steel} {...EDGE} />;
		case 'robot':
			return (
				<g transform={`${sc} translate(0 60) scale(0.3)`}>
					<RobotArm a1={-25} a2={80} a3={35} color={color ?? C.yellow} />
				</g>
			);
		case 'ore':
			return <Ore s={1.6 * s} />;
		case 'furnace':
			return (
				<g transform={`${sc} translate(0 60) scale(0.25)`}>
					<Furnace glow={1} />
				</g>
			);
		case 'box':
			return (
				<g transform={`${sc} translate(0 40)`}>
					<Crate s={80} color={color} />
				</g>
			);
		default:
			return null;
	}
};

/** Animated flow path: draws on between [t0,t1] (0..1 progress `draw`), then marches dashes. */
export const FlowPath: React.FC<{d: string; draw: number; frame: number; color?: string; width?: number; dash?: number; len?: number; speed?: number; glow?: boolean}> = ({
	d,
	draw,
	frame,
	color = C.yellow,
	width = 10,
	dash = 26,
	len = 3000,
	speed = 4,
	glow,
}) => (
	<g>
		<path d={d} fill="none" stroke="rgba(20,14,8,0.25)" strokeWidth={width + 6} strokeLinecap="round" strokeDasharray={`${len}`} strokeDashoffset={len * (1 - draw)} transform="translate(0 5)" />
		<path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={`${len}`} strokeDashoffset={len * (1 - draw)} filter={glow ? 'url(#glow)' : undefined} />
		{draw >= 0.999 ? <path d={d} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth={width * 0.35} strokeLinecap="round" strokeDasharray={`${dash} ${dash * 2.2}`} strokeDashoffset={-frame * speed} /> : null}
	</g>
);

/** Welding spark burst. Origin = tip. */
export const Sparks: React.FC<{frame: number; seed?: number; n?: number; size?: number}> = ({frame, seed = 1, n = 9, size = 1}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const a = rand(seed * 31 + i + Math.floor(frame / 2) * 7) * Math.PI * 2;
			const r = (14 + rand(i * 3 + frame) * 46) * size;
			return <line key={i} x1={0} y1={0} x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke={i % 3 ? C.fireHot : C.white} strokeWidth={4} strokeLinecap="round" />;
		})}
		<circle r={10 * size} fill={C.white} filter="url(#glow)" />
	</g>
);

/** Paper question mark / symbol as an SVG text cut-out. Origin = baseline centre. */
export const CutText: React.FC<{text: string; size: number; color?: string; back?: string; font?: string; weight?: number}> = ({text, size, color = C.yellow, back = C.charcoal, font = FONT.hero, weight = 400}) => (
	<g>
		<text x={size * 0.03} y={size * 0.06} textAnchor="middle" fontFamily={font} fontWeight={weight} fontSize={size} fill={back} direction="rtl">
			{text}
		</text>
		<text x={0} y={0} textAnchor="middle" fontFamily={font} fontWeight={weight} fontSize={size} fill={color} direction="rtl">
			{text}
		</text>
	</g>
);
