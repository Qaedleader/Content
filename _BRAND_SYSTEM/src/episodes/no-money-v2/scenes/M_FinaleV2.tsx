// Scene M — «لأنه بهالعالم الأهم مش قديش معك مصاري، الأهم مين بملك القدرة على الإنتاج»
// The whole interconnected production civilization → money is crossed out and falls away → everything collapses
// into one yellow gear (the emblem printed on the opening banknote) → «القدرة على الإنتاج».
// V2 ending (last ~1.7 s): on «الإنتاج» the gear powers a ring of production (robots, energy, products, cars,
// homes) through yellow flow lines; on the V1 ratchet cue (58.75 s) the gear clicks to a stop and the ring
// locks in yellow; the camera eases back to a composed final frame. V1's end-of-shot gear unwind (a fast
// reverse spin from lerping f·2.2° back to 10°) is replaced by a real deceleration. Everything before
// wf(139) − 4 is identical to V1.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {Backdrop, TEX} from '../../../brand/paper';
import {Banknote, FlowPath, G, Gear, Icon, SvgDefs} from '../../../brand/props';
import {IndustrialWorld} from '../../../brand/scenes/IndustrialWorld';
import {C, SHADOW} from '../../../brand/tokens';
import {HeroWord} from '../../../brand/type';
import {DURATION, S, wf} from '../../no-money/ep';

const STOP = Math.round(58.75 * 30); // ratchet cue of the V1 mix
const RING: {deg: number; icon: 'robot' | 'bolt' | 'box' | 'car' | 'house'}[] = [
	{deg: 170, icon: 'robot'},
	{deg: 135, icon: 'bolt'},
	{deg: 100, icon: 'box'},
	{deg: 68, icon: 'car'},
	{deg: 15, icon: 'house'},
];
const GX = 540;
const GY = 690;
const RR = 400;

export const FinaleSceneV2: React.FC<{f: number}> = ({f}) => {
	const RING_AT = wf(139) - 4;
	const [a] = S.M;
	const zoom = kf(f, [a, a + 34], [1.45, 1.05], EASE.out5);
	const note = pop(f, wf(129) - 3, {damping: 15});
	const cross = prog(f, wf(130), wf(131) + 2, EASE.out);
	const fall = prog(f, wf(133) - 4, wf(133) + 12, EASE.in);
	const collapse = prog(f, wf(134) - 2, wf(134) + 18, EASE.in);
	const sheet = prog(f, wf(134) + 6, wf(135) + 6, EASE.out5);
	const gear = slam(f, wf(135) - 2);
	const settle = f < RING_AT ? kf(f, [wf(137), DURATION - 1], [1.0, 1.045], EASE.out) : kf(f, [RING_AT, DURATION - 1], [kf(RING_AT, [wf(137), DURATION - 1], [1.0, 1.045], EASE.out), 0.985], EASE.io);
	// gear turns at 2.2°/frame, then decelerates and clicks to a stop on the ratchet cue
	const gearRot = 2.2 * Math.min(f, STOP - 6) + 6.6 * prog(f, STOP - 6, STOP, EASE.out) - 1.6 * Math.sin(prog(f, STOP, STOP + 5) * Math.PI);
	const lock = pop(f, STOP);
	const w1 = slam(f, wf(137) - 1);
	const w2 = slam(f, wf(138) - 1);
	return (
		<AbsoluteFill>
			<Backdrop color={C.navy} pattern="dots" ink="rgba(255,255,255,0.05)" light={0.22} />
			{sheet < 1 ? (
				<Camera scale={zoom} y={60}>
					<Stage>
						<SvgDefs />
						<IndustrialWorld f={f} at={a - 30} level="full" robotsAt={a - 30} flowsAt={a - 20} litAt={a} collapse={collapse} />
					</Stage>
				</Camera>
			) : null}
			{/* money: crossed out, then falls away */}
			{note > 0 && fall < 1 ? (
				<Stage>
					<SvgDefs />
					<G x={540} y={760 + fall * 1300} s={0.78 * note} r={-5 + fall * 40} f="shl">
						<Banknote w={760} seed={3} gray={cross * 0.6} />
						<path d="M-300,-150 L300,150" stroke={C.charcoal} strokeWidth={26} strokeLinecap="round" strokeDasharray="700" strokeDashoffset={700 * (1 - Math.min(1, cross * 2))} />
						<path d="M300,-150 L-300,150" stroke={C.charcoal} strokeWidth={26} strokeLinecap="round" strokeDasharray="700" strokeDashoffset={700 * (1 - Math.max(0, cross * 2 - 1))} />
					</G>
				</Stage>
			) : null}
			{/* cream sheet rises: the world simplifies */}
			{sheet > 0 ? (
				<AbsoluteFill style={{transform: `translateY(${(1 - sheet) * 100}%)`, filter: SHADOW.lifted}}>
					<AbsoluteFill style={{background: C.paper}} />
					<AbsoluteFill style={{backgroundImage: `url(${TEX.fibers()})`, backgroundSize: '512px', opacity: 0.6}} />
				</AbsoluteFill>
			) : null}
			{gear > 0 ? (
				<Camera scale={settle}>
					<Stage>
						<SvgDefs />
						<circle cx={540} cy={690} r={300} fill={C.yellowLight} opacity={0.35 * gear} filter="url(#softglow)" />
						{/* V2: the gear powers the whole production ring */}
						{RING.map((n, i) => {
							const rad = (n.deg * Math.PI) / 180;
							const ux = Math.cos(rad);
							const uy = -Math.sin(rad);
							const p = pop(f, RING_AT + 3 + i * 2, {damping: 13});
							const draw = prog(f, RING_AT + i * 2, RING_AT + 8 + i * 2, EASE.out);
							const ix = GX + ux * RR;
							const iy = GY + uy * RR;
							return f >= RING_AT ? (
								<g key={n.icon}>
									<FlowPath d={`M${GX + ux * 250},${GY + uy * 250} L${GX + ux * (RR - 66)},${GY + uy * (RR - 66)}`} draw={draw} frame={f} width={12} len={160} dash={14} speed={3} />
									{p > 0 ? (
										<G x={ix} y={iy} s={p * (1 + 0.12 * Math.sin(Math.min(1, lock) * Math.PI))} f="sh">
											<circle r={62} fill={C.paperWhite} stroke="rgba(30,20,10,0.22)" strokeWidth={2} />
											{lock > 0.05 ? <circle r={62} fill="none" stroke={C.yellow} strokeWidth={10 * Math.min(1, lock)} /> : null}
											<Icon name={n.icon} s={0.62} />
										</G>
									) : null}
								</g>
							) : null;
						})}
						<G x={540} y={690} s={gear} f="shl">
							<Gear r={235} teeth={16} rot={gearRot} hole={0.34} />
						</G>
						<G x={720} y={500} s={gear * 0.45} f="sh">
							<Gear r={110} teeth={11} rot={-gearRot * 2.1 + 8} color={C.charcoal} />
						</G>
					</Stage>
					{w1 > 0 ? (
						<div style={{position: 'absolute', left: 0, width: 1080, top: 950, display: 'flex', justifyContent: 'center', transform: `scale(${1.8 - 0.8 * w1}) rotate(${-2 + (1 - w1) * 6}deg)`, opacity: Math.min(1, w1 * 3)}}>
							<HeroWord text="القدرة" size={250} face={C.charcoal} back={C.yellowShade} depth={10} strip={C.yellow} stripSeed={7} />
						</div>
					) : null}
					{w2 > 0 ? (
						<div style={{position: 'absolute', left: 0, width: 1080, top: 1255, display: 'flex', justifyContent: 'center', transform: `scale(${1.8 - 0.8 * w2}) rotate(${1.5 + (1 - w2) * -6}deg)`, opacity: Math.min(1, w2 * 3)}}>
							<HeroWord text="على الإنتاج" size={168} face={C.charcoal} back={C.paperShade} depth={7} />
						</div>
					) : null}
				</Camera>
			) : null}
		</AbsoluteFill>
	);
};
