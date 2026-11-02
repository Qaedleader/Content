// Scene G — «يعني من أول مادة خام بالأرض لآخر منتج ببيتك، بدون بشر تقريباً»
// The whole chain as one path from the ground up to the home; a pulse travels it. Then the human workforce fades — almost.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {Backdrop} from '../../../brand/paper';
import {FlowPath, G, Icon, Ore, SvgDefs} from '../../../brand/props';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../ep';

const NODES: {x: number; y: number; icon: 'ore' | 'furnace' | 'gear' | 'robot' | 'car' | 'house'; label: string}[] = [
	{x: 260, y: 1150, icon: 'ore', label: 'استخراج'},
	{x: 820, y: 1020, icon: 'furnace', label: 'صهر'},
	{x: 260, y: 890, icon: 'gear', label: 'تصنيع'},
	{x: 820, y: 760, icon: 'robot', label: 'تجميع'},
	{x: 260, y: 630, icon: 'car', label: 'توصيل'},
	{x: 820, y: 480, icon: 'house', label: 'بيتك'},
];

const pathD = () => {
	let d = `M${NODES[0].x},${NODES[0].y}`;
	for (let i = 1; i < NODES.length; i++) {
		const p = NODES[i - 1];
		const n = NODES[i];
		d += ` C${p.x + (n.x - p.x) * 0.1},${p.y - 90} ${n.x - (n.x - p.x) * 0.1},${n.y + 90} ${n.x},${n.y}`;
	}
	return d;
};

export const ChainScene: React.FC<{f: number}> = ({f}) => {
	const [a, b] = S.G;
	const draw = prog(f, a + 4, a + 30, EASE.io);
	const t = kf(f, [wf(63), wf(70)], [0, NODES.length - 1], EASE.io);
	const seg = Math.min(NODES.length - 2, Math.floor(t));
	const u = t - seg;
	const P = NODES[seg];
	const Q = NODES[seg + 1];
	const px = P.x + (Q.x - P.x) * u;
	const py = P.y + (Q.y - P.y) * u - Math.sin(u * Math.PI) * 0;
	const card = pop(f, wf(71) - 3, {damping: 14});
	const dim = prog(f, wf(71) - 3, wf(71) + 5);
	const fade = (k: number) => (k === 2 ? 1 : 1 - prog(f, wf(72) - 4 + k * 3, wf(72) + 2 + k * 3));
	const almost = pop(f, wf(73) - 1);
	return (
		<AbsoluteFill>
			<Backdrop color={C.paper} pattern="grid" ink="rgba(38,35,33,0.06)" light={0.25} />
			<Camera scale={kf(f, [a, b], [1.04, 1.0], EASE.out)}>
				<div style={{position: 'absolute', inset: 0, opacity: 1 - dim * 0.7}}>
					<Stage>
						<SvgDefs />
						{/* ground strip with raw material */}
						<rect x={0} y={1210} width={1080} height={710} fill={C.kraft} />
						<rect x={0} y={1210} width={1080} height={12} fill={C.kraftDark} />
						{[0, 1, 2, 3, 4, 5].map((i) => (
							<G key={i} x={90 + i * 170} y={1290 + (i % 2) * 50}>
								<Ore s={1.1} seed={i + 3} />
							</G>
						))}
						<FlowPath d={pathD()} draw={draw} frame={f} width={14} len={4200} />
						{NODES.map((n, i) => {
							const p = pop(f, a + 6 + i * 4);
							const passed = t >= i - 0.05 && f >= wf(63);
							return p > 0 ? (
								<G key={i} x={n.x} y={n.y} s={p * (passed ? 1.06 : 1)} f="sh">
									<circle r={86} fill={passed ? C.yellow : C.paperWhite} stroke="rgba(30,20,10,0.2)" strokeWidth={2} />
									<Icon name={n.icon} s={0.75} />
									<text x={0} y={128} textAnchor="middle" fontFamily={FONT.display} fontWeight={800} fontSize={34} fill={C.charcoal}>
										{n.label}
									</text>
								</G>
							) : null;
						})}
						{f >= wf(63) && f <= wf(70) + 8 ? (
							<G x={px} y={py}>
								<circle r={30} fill={C.white} filter="url(#glow)" />
								<circle r={18} fill={C.yellow} />
							</G>
						) : null}
					</Stage>
					{f >= wf(65) ? (
						<div style={{position: 'absolute', left: 380, top: 1110, transform: `scale(${pop(f, wf(65))}) rotate(-2deg)`}}>
							<Label text="أول مادة خام" size={34} bg={C.charcoal} fg={C.paper} />
						</div>
					) : null}
					{f >= wf(69) ? (
						<div style={{position: 'absolute', left: 400, top: 430, transform: `scale(${pop(f, wf(69))}) rotate(2deg)`}}>
							<Label text="آخر منتج" size={34} bg={C.charcoal} fg={C.paper} />
						</div>
					) : null}
				</div>
				{/* «بدون بشر تقريباً» */}
				{card > 0 ? (
					<div style={{position: 'absolute', left: 110, top: 620, width: 860, height: 420, transform: `translateY(${(1 - card) * 900}px) rotate(-1.5deg)`, filter: SHADOW.lifted}}>
						<div style={{position: 'absolute', inset: 0, background: C.paperWhite, borderRadius: 10}} />
						<div dir="rtl" style={{position: 'absolute', right: 40, top: 24, fontFamily: FONT.display, fontWeight: 900, fontSize: 52, color: C.charcoal}}>
							بدون بشر…
						</div>
						<svg width={860} height={300} viewBox="0 0 860 300" style={{position: 'absolute', left: 0, top: 110}}>
							<SvgDefs />
							{[0, 1, 2, 3, 4].map((k) => (
								<G key={k} x={130 + k * 150} y={150} s={1.2} o={fade(k)} f="shs">
									<Icon name="worker" />
								</G>
							))}
						</svg>
						{almost > 0 ? (
							<div style={{position: 'absolute', left: 470, top: 120, transform: `scale(${almost}) rotate(${-10 + (1 - almost) * 20}deg)`}}>
								<Label text="تقريباً" size={48} bg={C.yellow} font={FONT.hero} weight={400} />
							</div>
						) : null}
					</div>
				) : null}
			</Camera>
			<TitleCard frame={f} at={wf(62)} text="من الأرض… لباب بيتك" />
		</AbsoluteFill>
	);
};
