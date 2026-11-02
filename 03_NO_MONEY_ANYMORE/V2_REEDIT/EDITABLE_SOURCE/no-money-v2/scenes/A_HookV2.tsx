// V2 Scene A (frames 0–81) — «اصرف مصاريك، لأنه المصاري رح يبطل إلها قيمة»
// New hook: the very first frame is already full of motion. Banknotes rain down past an «اصرف» hero word,
// the hero note slams onto the table, and on «رح يبطل» a yellow robot arm (productive capacity, the subject of
// the video) crosses out the value with a marker. Every beat lands on an existing sound cue of the V1 mix:
// impact f5, paper slides ws(1)±0.1, stamp ws(3), scribble ws(4), pop ws(7), tear we(7).
// The end state (grey crossed note at centre, tear from f74) matches V1 so scene B continues unchanged.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, randRange, shake, slam} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {Backdrop} from '../../../brand/paper';
import {Banknote, G, RobotArm, SvgDefs} from '../../../brand/props';
import {C} from '../../../brand/tokens';
import {Badge, HeroWord} from '../../../brand/type';
import {wf, we} from '../../no-money/ep';

const NOTE_W = 820;
const NOTE_H = NOTE_W * 0.47;
const NOTE_X = 540;
const NOTE_Y = 860;
const NOTE_ROT = -4;

// Cross-out strokes in note-local coordinates (identical to V1, so scene B's note matches).
const S1 = [
	[NOTE_W / 2 - 330, -70],
	[NOTE_W / 2 - 50, 120],
] as const;
const S2 = [
	[NOTE_W / 2 - 60, -80],
	[NOTE_W / 2 - 320, 125],
] as const;

const toStage = (lx: number, ly: number) => {
	const a = (NOTE_ROT * Math.PI) / 180;
	return {x: NOTE_X + lx * Math.cos(a) - ly * Math.sin(a), y: NOTE_Y + lx * Math.sin(a) + ly * Math.cos(a)};
};

/** The top banknote: two marker strokes (c1, c2) and the zig-zag tear (same geometry as V1). */
const TornNote: React.FC<{split: number; gray: number; c1: number; c2: number; rot: number}> = ({split, gray, c1, c2, rot}) => {
	const zig = Array.from({length: 9})
		.map((_, i) => `${(i % 2 ? 26 : -26) + (i === 4 ? 10 : 0)},${-NOTE_H / 2 - 10 + (i * (NOTE_H + 20)) / 8}`)
		.join(' L');
	const leftClip = `M${-NOTE_W / 2 - 20},${-NOTE_H / 2 - 20} L${zig} L${-NOTE_W / 2 - 20},${NOTE_H / 2 + 20} Z`;
	const rightClip = `M${NOTE_W / 2 + 20},${-NOTE_H / 2 - 20} L${zig} L${NOTE_W / 2 + 20},${NOTE_H / 2 + 20} Z`;
	const body = (
		<>
			<Banknote w={NOTE_W} gray={gray} seed={3} />
			<path d={`M${S1[0][0]},${S1[0][1]} L${S1[1][0]},${S1[1][1]}`} stroke={C.terracotta} strokeWidth={22} strokeLinecap="round" fill="none" strokeDasharray="400" strokeDashoffset={400 * (1 - c1)} />
			<path d={`M${S2[0][0]},${S2[0][1]} L${S2[1][0]},${S2[1][1]}`} stroke={C.terracotta} strokeWidth={22} strokeLinecap="round" fill="none" strokeDasharray="400" strokeDashoffset={400 * (1 - c2)} />
		</>
	);
	if (split <= 0.001) return <g transform={`rotate(${rot})`} filter="url(#sh)">{body}</g>;
	return (
		<g transform={`rotate(${rot})`}>
			<clipPath id="tearL2">
				<path d={leftClip} />
			</clipPath>
			<clipPath id="tearR2">
				<path d={rightClip} />
			</clipPath>
			<g transform={`translate(${-split * 620} ${split * 260}) rotate(${-split * 28})`} filter="url(#sh)">
				<g clipPath="url(#tearL2)">{body}</g>
			</g>
			<g transform={`translate(${split * 620} ${split * 320}) rotate(${split * 34})`} filter="url(#sh)">
				<g clipPath="url(#tearR2)">{body}</g>
			</g>
		</g>
	);
};

// Falling banknotes: depth 0 = far (small, dim, behind), 2 = near (large, soft focus, in front). Deterministic.
type Rain = {x: number; w: number; t0: number; v: number; r0: number; spin: number; depth: 0 | 1 | 2; seed: number};
const RAIN: Rain[] = Array.from({length: 14}).map((_, i) => {
	const depth = (i % 5 === 0 ? 2 : i % 2 ? 1 : 0) as 0 | 1 | 2;
	return {
		x: randRange(i * 13 + 1, 40, 1040),
		w: depth === 2 ? randRange(i * 7 + 2, 560, 680) : depth === 1 ? randRange(i * 7 + 2, 340, 440) : randRange(i * 7 + 2, 220, 300),
		t0: depth === 2 ? randRange(i * 5 + 3, -14, 2) : randRange(i * 5 + 3, -26, 10),
		v: depth === 2 ? 110 : depth === 1 ? randRange(i * 3 + 4, 62, 78) : randRange(i * 3 + 4, 40, 52),
		r0: randRange(i * 11 + 5, -50, 50),
		spin: randRange(i * 17 + 6, -5, 5),
		depth,
		seed: 20 + i,
	};
});

const RainLayer: React.FC<{f: number; depth: 0 | 1 | 2; gray: number}> = ({f, depth, gray}) => (
	<>
		{RAIN.filter((r) => r.depth === depth).map((r, i) => {
			const y = -420 + r.v * (f - r.t0);
			if (y < -500 || y > 2300) return null;
			const sway = Math.sin((f + i * 9) / 5) * 26;
			return (
				<g key={i} style={depth === 2 ? {filter: 'blur(5px)'} : depth === 0 ? {filter: 'brightness(0.72) blur(1.2px)'} : undefined}>
					<G x={r.x + sway} y={y} r={r.r0 + r.spin * f} sx={1} sy={0.82 + 0.18 * Math.cos((f + i * 5) / 3)} f={depth === 1 ? 'sh' : undefined}>
						<Banknote w={r.w} seed={r.seed} gray={gray} />
					</G>
				</g>
			);
		})}
	</>
);

// --- 2-link IK for the brand RobotArm (angles: 0 = up, clockwise positive; l1 210, l2 170, tool 86) ---
const L1 = 210;
const L2 = 170;
const TOOL = 86;
const ARM_S = 1.55;
const deg = (r: number) => (r * 180) / Math.PI;
const solveArm = (tx: number, ty: number, toolDeg: number) => {
	const ph = (toolDeg * Math.PI) / 180;
	const wx = tx - TOOL * Math.sin(ph);
	const wy = ty + TOOL * Math.cos(ph);
	const dx = wx;
	const dy = wy + 80; // shoulder at (0,-80)
	const D = Math.min(L1 + L2 - 4, Math.max(Math.abs(L1 - L2) + 4, Math.hypot(dx, dy)));
	const thetaD = Math.atan2(dx, -dy);
	const alpha = Math.acos((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D));
	const beta = Math.acos((L1 * L1 + L2 * L2 - D * D) / (2 * L1 * L2));
	const a1 = thetaD + alpha;
	const a2 = -(Math.PI - beta);
	const a3 = ph - (a1 + a2);
	return {a1: deg(a1), a2: deg(a2), a3: deg(a3)};
};

export const HookSceneV2: React.FC<{f: number}> = ({f}) => {
	// hero note: already falling at frame 0, slams on the table at f5 (impact cue)
	const noteY = kf(f, [0, 5], [230, NOTE_Y], EASE.in);
	const sq = f >= 5 ? 1 - 0.07 * Math.exp(-(f - 5) / 3) * Math.cos((f - 5) * 0.9) : 1;
	const sk = shake(f, 5, 18, 12);
	const fan2 = pop(f, wf(1) - 2, {damping: 14});
	const fan3 = pop(f, wf(1) + 4, {damping: 14});
	// marker strokes, drawn by the robot arm on «رح يبطل»
	const c1 = prog(f, wf(4), wf(4) + 4, EASE.io);
	const c2 = prog(f, wf(4) + 6, wf(5) + 6, EASE.io);
	const gray = prog(f, wf(6), we(7), EASE.io);
	const split = prog(f, 74, 98, EASE.in);
	// typography: «اصرف» from frame 0, swapped for «المصاري» on its word (stamp cue)
	const w0 = slam(f, -3);
	const w0Out = prog(f, wf(3) - 3, wf(3) + 3, EASE.in);
	const hero = slam(f, wf(3) - 1);
	const heroOut = prog(f, 80, 88, EASE.in);
	const arrow = pop(f, wf(7) - 2);
	// camera: starts close inside the rain and pulls out as the note lands, then a slow push
	const cam = f < 16 ? kf(f, [0, 16], [1.2, 1.0], EASE.out) : kf(f, [16, 81], [1.0, 1.06], EASE.linear);
	const rainGray = gray * 0.9;

	// robot arm: slides in from the right, draws both strokes, then retreats
	const armIn = pop(f, wf(4) - 10, {damping: 15, stiffness: 150});
	const armOut = prog(f, wf(5) + 8, wf(5) + 20, EASE.in);
	const baseX = 1010 + (1 - armIn) * 560 + armOut * 640;
	const baseY = 1300;
	const P = (p: readonly [number, number]) => toStage(p[0], p[1]);
	const a = P(S1[0]);
	const b = P(S1[1]);
	const c = P(S2[0]);
	const d = P(S2[1]);
	let tip: {x: number; y: number};
	if (f < wf(4)) tip = {x: a.x + 30, y: a.y - 90 * (1 - prog(f, wf(4) - 5, wf(4), EASE.out))};
	else if (f <= wf(4) + 4) tip = {x: a.x + (b.x - a.x) * c1, y: a.y + (b.y - a.y) * c1};
	else if (f < wf(4) + 6) {
		const u = prog(f, wf(4) + 4, wf(4) + 6, EASE.io);
		tip = {x: b.x + (c.x - b.x) * u, y: b.y + (c.y - b.y) * u - Math.sin(u * Math.PI) * 50};
	} else if (f <= wf(5) + 6) tip = {x: c.x + (d.x - c.x) * c2, y: c.y + (d.y - c.y) * c2};
	else tip = {x: d.x + 120 * prog(f, wf(5) + 6, wf(5) + 16), y: d.y - 160 * prog(f, wf(5) + 6, wf(5) + 16, EASE.out)};
	const pen = f >= wf(4) && f <= wf(5) + 6 && !(f > wf(4) + 4 && f < wf(4) + 6);
	const arm = solveArm((tip.x - baseX) / ARM_S, (tip.y - baseY) / ARM_S, -135);

	return (
		<AbsoluteFill>
			<Backdrop color={C.navyDeep} pattern="none" floorY={1250} floorColor={C.kraft} light={0.22} />
			<Camera x={sk.x} y={sk.y} scale={cam}>
				<Stage>
					<SvgDefs />
					{/* far notes fall behind the table edge */}
					<clipPath id="aboveTable">
						<rect x={-400} y={-800} width={1880} height={2050} />
					</clipPath>
					<g clipPath="url(#aboveTable)">
						<RainLayer f={f} depth={0} gray={rainGray} />
					</g>
					<ellipse cx={540} cy={1250} rx={520} ry={70} fill="rgba(255,236,190,0.12)" filter="url(#softglow)" />
					<RainLayer f={f} depth={1} gray={rainGray} />
					<G x={540 - (1 - fan3) * 900 - 70} y={880 + 30} r={-14 + (1 - fan3) * -30} f="sh" o={fan3 > 0.01 ? 1 : 0}>
						<Banknote w={NOTE_W} gray={gray * 0.9} seed={9} value="100" />
					</G>
					<G x={540 + (1 - fan2) * 900 + 60} y={880 - 40} r={9 + (1 - fan2) * 30} f="sh" o={fan2 > 0.01 ? 1 : 0}>
						<Banknote w={NOTE_W} gray={gray * 0.9} seed={5} value="100" />
					</G>
					<G x={NOTE_X} y={noteY} sx={1 / sq} sy={sq}>
						<TornNote split={split} gray={gray} c1={c1} c2={c2} rot={NOTE_ROT - 16 * (1 - prog(f, 0, 5, EASE.in))} />
					</G>
					{/* robot arm with a marker */}
					{armIn > 0.01 && armOut < 0.999 ? (
						<G x={baseX} y={baseY} s={ARM_S} f="shl">
							<RobotArm a1={arm.a1} a2={arm.a2} a3={arm.a3} tool="welder" />
						</G>
					) : null}
					{armIn > 0.01 && armOut < 0.999 ? <circle cx={tip.x} cy={tip.y} r={pen ? 13 : 11} fill={C.terracotta} stroke="rgba(30,20,10,0.35)" strokeWidth={2} /> : null}
					{arrow > 0 ? (
						<G x={900} y={560} s={arrow} r={8} f="sh">
							<path d="M-38,-120 L38,-120 L38,10 L80,10 L0,110 L-80,10 L-38,10 Z" fill={C.terracotta} stroke="rgba(30,20,10,0.25)" strokeWidth={2} />
						</G>
					) : null}
					<RainLayer f={f} depth={2} gray={rainGray} />
				</Stage>
				{/* «اصرف» — readable from the first frame */}
				{w0Out < 1 ? (
					<div style={{position: 'absolute', left: 0, width: 1080, top: 300, display: 'flex', justifyContent: 'center', transform: `scale(${2.0 - 1.0 * w0}) rotate(${4 - 6 * w0}deg) translateY(${w0Out * -760}px)`, opacity: Math.min(1, w0 * 3)}}>
						<HeroWord text="اصرف" size={280} face={C.yellow} back={C.charcoal} depth={12} />
					</div>
				) : null}
				{f >= wf(3) - 1 ? (
					<div style={{position: 'absolute', left: 0, width: 1080, top: 300, display: 'flex', justifyContent: 'center', transform: `scale(${2.2 - 1.2 * hero}) rotate(${-3 + (1 - hero) * 8}deg) translateY(${heroOut * -700}px)`, opacity: Math.min(1, hero * 4)}}>
						<HeroWord text="المصاري" size={250} face={C.yellow} back={C.charcoal} depth={11} />
					</div>
				) : null}
			</Camera>
			{f >= wf(4) ? (
				<div style={{position: 'absolute', left: 60, top: 168, transform: `scale(${pop(f, wf(4))})`, transformOrigin: 'left center'}}>
					<Badge text="سيناريو مستقبلي افتراضي — ورقة نقدية رمزية" color={C.yellow} bg="rgba(20,30,45,0.88)" size={24} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
