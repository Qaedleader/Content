// Scene M — «لأنه بهالعالم الأهم مش قديش معك مصاري، الأهم مين بملك القدرة على الإنتاج»
// The whole interconnected production civilization → money is crossed out and falls away → everything collapses
// into one yellow gear (the emblem printed on the opening banknote) → «القدرة على الإنتاج».
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {Backdrop, TEX} from '../../../brand/paper';
import {Banknote, G, Gear, SvgDefs} from '../../../brand/props';
import {IndustrialWorld} from '../../../brand/scenes/IndustrialWorld';
import {C, SHADOW} from '../../../brand/tokens';
import {HeroWord} from '../../../brand/type';
import {DURATION, S, wf} from '../ep';

export const FinaleScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.M;
	const zoom = kf(f, [a, a + 34], [1.45, 1.05], EASE.out5);
	const note = pop(f, wf(129) - 3, {damping: 15});
	const cross = prog(f, wf(130), wf(131) + 2, EASE.out);
	const fall = prog(f, wf(133) - 4, wf(133) + 12, EASE.in);
	const collapse = prog(f, wf(134) - 2, wf(134) + 18, EASE.in);
	const sheet = prog(f, wf(134) + 6, wf(135) + 6, EASE.out5);
	const gear = slam(f, wf(135) - 2);
	const settle = kf(f, [wf(137), DURATION - 1], [1.0, 1.045], EASE.out);
	const gearRot = f * 2.2 * (1 - prog(f, wf(139) + 6, DURATION - 4, EASE.out)) + prog(f, wf(139) + 6, DURATION - 4, EASE.out) * 10;
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
