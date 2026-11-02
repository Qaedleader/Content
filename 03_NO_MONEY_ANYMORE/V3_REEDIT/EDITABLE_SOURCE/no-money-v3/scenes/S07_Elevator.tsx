// V3 · Shot 07 (frames 827–989) «يعني من أول مادة خام بالأرض لآخر منتج ببيتك، بدون بشر تقريباً»
// ELEVATOR THROUGH THE LAYERS: a vertical cross-section of the world. The camera rides UP from ore in the rock
// through extraction, furnace, factory and road to a home, while a yellow spine is drawn and each layer's node
// lights on a tick. Then the column shrinks back and a staff board of 20 worker tiles flips to robot tiles in four
// waves; one worker tile stays — «تقريباً».
// Locked cues: scribble f831 · ticks f847/862/877/892/907/922 · whoosh f933 · flicks f951–960 · pop f969.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog} from '../../../brand/anim';
import {Camera} from '../../../brand/diagram';
import {TEX} from '../../../brand/paper';
import {Excavator, Factory, Furnace, G, House, Icon, Ore, RobotArm, SvgDefs, Truck} from '../../../brand/props';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../../no-money/ep';
import {idle} from '../kit';

const COL_H = 3400;
const NODE_Y = [3050, 2550, 2050, 1550, 1050, 560];
const LAYERS = [
	{top: 2800, color: '#5E4434', label: 'مادة خام'},
	{top: 2300, color: C.kraftDark, label: 'استخراج'},
	{top: 1800, color: C.charcoalSoft, label: 'صهر'},
	{top: 1300, color: C.navy, label: 'تصنيع'},
	{top: 800, color: C.sageDark, label: 'توصيل'},
	{top: 0, color: C.paper, label: 'بيتك'},
];
const TICKS = [847, 862, 877, 892, 907, 922];

export const ElevatorScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.G;
	const camFr = [a, ...TICKS];
	const camY = kf(f, camFr, [NODE_Y[0] - 900, ...NODE_Y.map((y) => y - 900)], EASE.io);
	const out = prog(f, wf(71) - 4, wf(71) + 10, EASE.io);
	const scale = 1 - out * 0.47;
	const yOut = kf(out, [0, 1], [camY, COL_H / 2 - 960 + 120]);
	const spineTop = kf(f, [a + 4, TICKS[5]], [NODE_Y[0] + 200, NODE_Y[5]], EASE.io);
	const board = pop(f, wf(71) - 2, {damping: 15});
	const dim = prog(f, wf(71), wf(71) + 10);
	const waves = [951, 954, 957, 960];
	const keep = 13;
	const almost = pop(f, 968);
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			<Camera scale={scale}>
				<div style={{position: 'absolute', left: 0, top: -yOut, width: 1080, height: COL_H, opacity: 1 - dim * 0.65}}>
					{LAYERS.map((l, i) => (
						<div key={i} style={{position: 'absolute', left: 0, right: 0, top: l.top, height: (i === 0 ? COL_H : LAYERS[i - 1].top) - l.top, background: l.color}}>
							<div style={{position: 'absolute', inset: 0, backgroundImage: `url(${i === 5 ? TEX.fibers() : TEX.kraft()})`, backgroundSize: '512px', mixBlendMode: 'multiply', opacity: i === 5 ? 0.5 : 0.55}} />
							<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 14, background: 'rgba(0,0,0,0.18)'}} />
						</div>
					))}
					<svg width={1080} height={COL_H} viewBox={`0 0 1080 ${COL_H}`} style={{position: 'absolute', left: 0, top: 0}}>
						<SvgDefs />
						{/* layer props */}
						{Array.from({length: 9}).map((_, k) => (
							<G key={k} x={120 + (k % 5) * 200 + (k > 4 ? 100 : 0)} y={2900 + (k > 4 ? 200 : 0) + (k % 2) * 40} r={k * 31}>
								<Ore s={2.2} seed={k + 4} />
							</G>
						))}
						<G x={250} y={2700} s={0.9} f="sh">
							<Excavator boom={-20 + idle(f, 14, 8)} stick={50 + idle(f, 14, 10)} bucket={30} />
						</G>
						<G x={250} y={2200} s={0.75} f="sh">
							<Furnace glow={0.5 + idle(f, 10, 0.3)} pour={1} />
						</G>
						<G x={70} y={1700} s={0.8} f="sh">
							<Factory w={360} h={190} lit={1} />
						</G>
						<G x={820} y={1720} s={0.65} f="sh">
							<RobotArm a1={-20 + idle(f, 12, 10)} a2={-70} a3={-30} />
						</G>
						<rect x={0} y={1130} width={1080} height={60} fill={C.charcoal} />
						<line x1={0} y1={1160} x2={1080} y2={1160} stroke={C.yellow} strokeWidth={6} strokeDasharray="40 30" strokeDashoffset={f * 6} />
						<G x={60 + ((f - a) * 3) % 300} y={1150} s={0.5} f="sh">
							<Truck wheelRot={f * 6} ping={(f / 16) % 1} />
						</G>
						<G x={110} y={760} s={1.0} f="sh">
							<House w={300} h={220} lit={prog(f, TICKS[5], TICKS[5] + 6)} door={prog(f, TICKS[5] + 2, TICKS[5] + 10)} />
						</G>
						{/* the spine (pencil-drawn production chain) */}
						<line x1={540} y1={NODE_Y[0] + 200} x2={540} y2={spineTop} stroke="rgba(20,14,8,0.35)" strokeWidth={30} strokeLinecap="round" transform="translate(0 6)" />
						<line x1={540} y1={NODE_Y[0] + 200} x2={540} y2={spineTop} stroke={C.yellow} strokeWidth={24} strokeLinecap="round" />
						{NODE_Y.map((y, i) => {
							const on = pop(f, TICKS[i] - 1);
							return (
								<G key={i} x={540} y={y} s={0.8 + 0.25 * Math.min(1.2, on)} f="sh">
									<circle r={70} fill={on > 0.3 ? C.yellow : C.paperWhite} stroke={C.charcoal} strokeWidth={6} />
									<g transform="scale(0.5)">
										<Icon name={(['ore', 'ore', 'furnace', 'gear', 'car', 'house'] as const)[i]} />
									</g>
								</G>
							);
						})}
					</svg>
					{NODE_Y.map((y, i) =>
						f >= TICKS[i] - 1 ? (
							<div key={i} style={{position: 'absolute', left: 640, top: y - 34, transform: `scale(${pop(f, TICKS[i] - 1)})`, transformOrigin: 'left center', opacity: out > 0 ? 1 - out : 1 - prog(y - yOut, 1150, 1260)}}>
								<Label text={LAYERS[i].label} size={44} bg={i === 0 || i === 5 ? C.yellow : C.paperWhite} />
							</div>
						) : null,
					)}
				</div>
			</Camera>
			{/* «بدون بشر… تقريباً» staff board */}
			{board > 0 ? (
				<div style={{position: 'absolute', left: 110, top: 420, width: 860, height: 760, transform: `translateY(${(1 - board) * 1300}px) rotate(-1deg)`, filter: SHADOW.lifted}}>
					<div style={{position: 'absolute', inset: 0, background: C.paperWhite, borderRadius: 12}} />
					<div style={{position: 'absolute', inset: 0, backgroundImage: `url(${TEX.fibers()})`, backgroundSize: '512px', opacity: 0.5, borderRadius: 12}} />
					<div dir="rtl" style={{position: 'absolute', right: 44, top: 26, fontFamily: FONT.display, fontWeight: 900, fontSize: 56, color: C.charcoal}}>
						بدون بشر…
					</div>
					<svg width={860} height={640} viewBox="0 0 860 640" style={{position: 'absolute', left: 0, top: 120}}>
						<SvgDefs />
						{Array.from({length: 20}).map((_, k) => {
							const col = k % 5;
							const row = Math.floor(k / 5);
							const w = row; // wave index = row
							const ft = waves[w] - 1;
							const flip = k === keep ? 0 : prog(f, ft, ft + 4);
							const sx = Math.abs(Math.cos(flip * Math.PI));
							const robot = flip > 0.5;
							const kept = k === keep && almost > 0;
							return (
								<g key={k} transform={`translate(${110 + col * 160} ${70 + row * 140}) scale(${Math.max(0.05, sx)} 1)`}>
									<rect x={-66} y={-58} width={132} height={116} rx={10} fill={robot ? C.charcoal : kept ? C.paper : C.paperShade} stroke={kept ? C.terracotta : 'rgba(30,20,10,0.2)'} strokeWidth={kept ? 6 : 2} filter="url(#shs)" />
									<g transform={robot ? 'translate(0 -2) scale(0.95)' : 'translate(0 -4) scale(0.85)'}>
										<Icon name={robot ? 'robot' : 'worker'} />
									</g>
								</g>
							);
						})}
					</svg>
					{almost > 0 ? (
						<div style={{position: 'absolute', left: 110 + 3 * 160 - 40, top: 120 + 70 + 2 * 140 - 130, transform: `scale(${almost}) rotate(${-8 + (1 - almost) * 20}deg)`}}>
							<Label text="تقريباً" size={50} bg={C.yellow} font={FONT.hero} weight={400} />
						</div>
					) : null}
				</div>
			) : null}
			<TitleCard frame={f} at={a + 1} out={wf(71) - 6} text="من الأرض… لباب بيتك" />
		</AbsoluteFill>
	);
};
