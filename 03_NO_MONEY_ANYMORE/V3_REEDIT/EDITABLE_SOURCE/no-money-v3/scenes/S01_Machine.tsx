// V3 · Shots 01–02 (frames 0–131)
// 01 «اصرف مصاريك، لأنه المصاري رح يبطل إلها قيمة» — THE MACHINE: a running production machine pours out goods
//    from frame 0; three tiny banknotes drop into its hopper; its «قيمة» gauge sweeps down; the camera pulls
//    back until the money is insignificant next to the output; the rollers tear the note.
// 02 «احضر الفيديو لتعرف ليش» — a shelf of goods, a "watch" token whose ring fills, «ليش؟».
// Locked V1 cues: impact f5 · slides f10/f16 · stamp f40 · scribble f52 · pop f65 · tear f80 · whoosh f82 ·
// blip f83 · stamp f118.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, shake, slam} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {Backdrop} from '../../../brand/paper';
import {Banknote, Conveyor, Crate, G, RobotArm, SvgDefs} from '../../../brand/props';
import {C, FONT} from '../../../brand/tokens';
import {Badge, HeroWord} from '../../../brand/type';
import {wf} from '../../no-money/ep';
import {IconName, idle, Token} from '../kit';

const STREAM: IconName[] = ['car', 'house', 'bread', 'shirt', 'pill', 'phone', 'box', 'bolt', 'wheat', 'beam'];
const NW = 290; // banknote width: deliberately small next to the machine
const DY = 150; // stage offset: keeps the hopper clear of the hero word

/** Note split into two halves along a vertical zig-zag (tear). */
const HalfNote: React.FC<{side: -1 | 1; gray: number; seed: number}> = ({side, gray, seed}) => {
	const h = NW * 0.47;
	const zig = Array.from({length: 7}).map((_, i) => `${i % 2 ? 8 : -8},${-h / 2 - 4 + (i * (h + 8)) / 6}`).join(' L');
	const d = side < 0 ? `M${-NW / 2 - 10},${-h / 2 - 10} L${zig} L${-NW / 2 - 10},${h / 2 + 10} Z` : `M${NW / 2 + 10},${-h / 2 - 10} L${zig} L${NW / 2 + 10},${h / 2 + 10} Z`;
	const id = `half${side}${seed}`;
	return (
		<g>
			<clipPath id={id}>
				<path d={d} />
			</clipPath>
			<g clipPath={`url(#${id})`}>
				<Banknote w={NW} gray={gray} seed={seed} />
			</g>
		</g>
	);
};

const Machine: React.FC<{f: number; needle: number; trace: number; tag: number}> = ({f, needle, trace, tag}) => {
	const toXY = (deg: number, r: number) => ({x: 780 + Math.sin((deg * Math.PI) / 180) * r, y: 760 - Math.cos((deg * Math.PI) / 180) * r});
	const n = toXY(needle, 92);
	const a0 = toXY(60, 76);
	const a1 = toXY(needle, 76);
	return (
		<g>
			{/* body */}
			<rect x={560} y={560} width={460} height={590} rx={18} fill={C.charcoalSoft} stroke="rgba(30,20,10,0.3)" strokeWidth={2} />
			<rect x={560} y={980} width={460} height={34} fill={C.teal} />
			<rect x={560} y={1014} width={460} height={10} fill={C.tealDark} />
			{/* status lamps */}
			{[0, 1, 2].map((i) => (
				<circle key={i} cx={880 + i * 40} cy={920} r={12} fill={(Math.floor(f / 4) + i) % 3 === 0 ? C.yellow : C.charcoal} stroke="rgba(0,0,0,0.3)" strokeWidth={2} />
			))}
			{/* gauge «قيمة» */}
			<circle cx={780} cy={760} r={118} fill={C.paperWhite} stroke={C.charcoal} strokeWidth={8} />
			{Array.from({length: 7}).map((_, i) => {
				const p = toXY(-60 + i * 20, 98);
				const q = toXY(-60 + i * 20, 82);
				return <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={C.charcoal} strokeWidth={5} strokeLinecap="round" />;
			})}
			{trace > 0 ? <path d={`M${a0.x},${a0.y} A76,76 0 0 0 ${a1.x},${a1.y}`} fill="none" stroke={C.terracotta} strokeWidth={14} strokeLinecap="round" /> : null}
			<line x1={780} y1={760} x2={n.x} y2={n.y} stroke={C.charcoal} strokeWidth={10} strokeLinecap="round" />
			<circle cx={780} cy={760} r={16} fill={C.yellow} stroke={C.charcoal} strokeWidth={4} />
			<text x={780} y={850} textAnchor="middle" fontFamily={FONT.display} fontWeight={900} fontSize={40} fill={C.charcoal}>
				قيمة
			</text>
			{tag > 0 ? (
				<G x={925} y={650} s={tag} r={10} f="sh">
					<path d="M-30,-70 L30,-70 L30,0 L62,0 L0,70 L-62,0 L-30,0 Z" fill={C.terracotta} stroke="rgba(30,20,10,0.3)" strokeWidth={2} />
				</G>
			) : null}
			{/* output chute */}
			<rect x={530} y={1040} width={80} height={100} rx={10} fill={C.charcoal} />
		</g>
	);
};

export const MachineScene: React.FC<{f: number}> = ({f}) => {
	if (f >= 82) return <WhyScene f={f} />;
	const sk = shake(f, 5, 14, 10);
	const cam = kf(f, [0, 72], [1.25, 0.97], EASE.io);
	// banknotes
	const n1y = kf(f, [0, 5], [130, 455], EASE.in);
	const n2 = pop(f, wf(1) - 3, {damping: 15});
	const n3 = pop(f, wf(1) + 3, {damping: 15});
	const sink = prog(f, wf(3), 72, EASE.io);
	const split = prog(f, 74, 81, EASE.out);
	const gray = prog(f, wf(4), wf(7), EASE.io);
	// gauge
	const needle = kf(f, [wf(4), wf(5) + 6], [60, -52], EASE.io) + (f > wf(5) + 6 ? idle(f, 7, 2) : 0);
	const trace = prog(f, wf(4), wf(5) + 6);
	const tag = pop(f, wf(7) - 3);
	// words
	const w0 = slam(f, -3);
	const w0Out = prog(f, wf(3) - 4, wf(3) + 2, EASE.in);
	const w1 = slam(f, wf(3) - 1);
	const arm = idle(f, 18, 1);
	return (
		<AbsoluteFill>
			<Backdrop color={C.navyDeep} pattern="dots" ink="rgba(255,255,255,0.05)" floorY={1150 + DY} floorColor={C.kraft} light={0.24} />
			<Camera x={sk.x} y={sk.y + DY} scale={cam} origin="760px 760px">
				<Stage>
					<SvgDefs />
					{/* output already piling up behind the belt: crate stacks grow through the shot */}
					{[0, 1, 2, 3].map((i) => {
						const a = 2 + (i % 2);
						const b = 5 + (i === 1 ? 1 : 0);
						const n = Math.floor(kf(f, [0, 76], [a, b], EASE.linear));
						return Array.from({length: n}).map((_, k) => {
							const at = k + 1 <= a ? -20 : Math.round(((k + 1 - a) / (b - a)) * 76);
							return (
								<G key={`${i}-${k}`} x={95 + i * 118} y={1150 - k * 104} s={pop(f, at, {damping: 13})} f="shs">
									<Crate s={104} color={(i + k) % 3 === 0 ? C.yellow : C.kraft} />
								</G>
							);
						});
					})}
					{/* robot arm transferring goods from the chute */}
					<G x={500} y={1150} s={0.9} f="sh">
						<RobotArm a1={-20 + arm * 14} a2={70 - arm * 18} a3={40} tool="gripper" grip={0.5 + arm * 0.3} />
					</G>
					{/* hopper back */}
					<path d="M545,430 L1015,430 L890,560 L670,560 Z" fill={C.charcoal} />
					{/* banknotes in the hopper */}
					<G x={700 - (1 - n2) * 900} y={448 + sink * 60} r={-12 + (1 - n2) * -30} f="sh">
						<Banknote w={NW} seed={5} gray={gray} />
					</G>
					<G x={845 + (1 - n3) * 700} y={444 + sink * 66} r={10 + (1 - n3) * 30} f="sh">
						<Banknote w={NW} seed={9} gray={gray} />
					</G>
					{split <= 0 ? (
						<G x={775} y={f < 5 ? n1y : 455 + sink * 40} r={-4 + (f < 5 ? (1 - f / 5) * -24 : 0)} f="sh">
							<Banknote w={NW} seed={3} gray={gray} />
						</G>
					) : (
						<G x={775} y={455 + 40 - split * 60} f="sh">
							<G x={-split * 70} r={-split * 22}>
								<HalfNote side={-1} gray={gray} seed={3} />
							</G>
							<G x={split * 70} r={split * 26}>
								<HalfNote side={1} gray={gray} seed={3} />
							</G>
						</G>
					)}
					{/* hopper front lip */}
					<path d="M545,470 L1015,470 L960,545 L600,545 Z" fill={C.charcoalSoft} stroke="rgba(30,20,10,0.35)" strokeWidth={2} />
					<rect x={545} y={462} width={470} height={14} rx={6} fill={C.yellow} />
					<Machine f={f} needle={needle} trace={trace} tag={tag} />
					{/* conveyor and the stream of goods */}
					<G x={-20} y={1150}>
						<Conveyor len={600} frame={f} speed={9} />
					</G>
					{Array.from({length: 26}).map((_, k) => {
						const tk = k * 5 - 44;
						const x = 560 - (f - tk) * 9;
						if (x < -90 || x > 600) return null;
						const emerge = Math.min(1, (560 - x) / 50);
						return (
							<G key={k} x={x} y={1096} s={0.45 + 0.4 * emerge}>
								<Token icon={STREAM[k % STREAM.length]} r={56} bg={k % 4 === 0 ? C.yellow : C.paperWhite} />
							</G>
						);
					})}
				</Stage>
			</Camera>
			{/* hero words (fixed, readable from frame 0) */}
			{w0Out < 1 ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 210, display: 'flex', justifyContent: 'center', transform: `scale(${2.0 - 1.0 * w0}) rotate(${3 - 5 * w0}deg) translateY(${w0Out * -700}px)`}}>
					<HeroWord text="اصرف" size={260} face={C.yellow} back={C.charcoal} depth={12} />
				</div>
			) : null}
			{f >= wf(3) - 1 ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 210, display: 'flex', justifyContent: 'center', transform: `scale(${2.1 - 1.1 * w1}) rotate(${-3 + (1 - w1) * 8}deg)`, opacity: Math.min(1, w1 * 4)}}>
					<HeroWord text="المصاري" size={230} face={C.yellow} back={C.charcoal} depth={11} />
				</div>
			) : null}
			{f >= wf(4) ? (
				<div style={{position: 'absolute', left: 60, top: 150, transform: `scale(${pop(f, wf(4))})`, transformOrigin: 'left center'}}>
					<Badge text="سيناريو مستقبلي افتراضي — ورقة نقدية رمزية" color={C.yellow} bg="rgba(20,30,45,0.88)" size={24} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

// ---------------- 02 «احضر الفيديو لتعرف ليش» ----------------
const SHELF: IconName[] = ['car', 'house', 'bread', 'shirt', 'pill', 'phone'];
const WhyScene: React.FC<{f: number}> = ({f}) => {
	const ring = prog(f, 83, wf(11) - 2, EASE.linear);
	const tok = pop(f, 83) * (1 - prog(f, wf(11) - 4, wf(11) + 1, EASE.in));
	const why = slam(f, wf(11) - 2);
	const fallL = kf(f, [82, 100], [-260, 1196], EASE.in);
	const fallR = kf(f, [86, 106], [-300, 1204], EASE.in);
	const R = 150;
	const C2 = 2 * Math.PI * R;
	return (
		<AbsoluteFill>
			<Backdrop color={C.paper} pattern="dots" ink="rgba(38,35,33,0.07)" floorY={1250} floorColor={C.kraft} light={0.25} />
			<Stage>
				<SvgDefs />
				{/* shelf of goods */}
				<rect x={60} y={560} width={960} height={26} rx={6} fill={C.kraftDark} filter="url(#sh)" />
				{SHELF.map((ic, i) => {
					const p = pop(f, 82 + i * 2, {damping: 13});
					return p > 0 ? (
						<G key={ic} x={140 + i * 160} y={490 + (1 - p) * -400}>
							<Token icon={ic} r={66} bg={i % 2 ? C.yellow : C.paperWhite} />
						</G>
					) : null;
				})}
				{/* the torn note, small and grey, falls to the floor */}
				<G x={300} y={Math.min(1196, fallL)} r={-24 + (fallL >= 1196 ? 0 : f * 3)}>
					<HalfNote side={-1} gray={1} seed={3} />
				</G>
				<G x={430} y={Math.min(1204, fallR)} r={18 - (fallR >= 1204 ? 0 : f * 2)}>
					<HalfNote side={1} gray={1} seed={3} />
				</G>
				{/* "watch" token with circular progress */}
				{tok > 0.01 ? (
					<G x={540} y={880} s={tok} f="shl">
						<circle r={R + 22} fill={C.charcoal} />
						<circle r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={18} />
						<circle r={R} fill="none" stroke={C.yellow} strokeWidth={18} strokeDasharray={`${C2}`} strokeDashoffset={C2 * (1 - ring)} transform="rotate(-90)" strokeLinecap="round" />
						<circle r={R - 30} fill={C.yellow} />
						<path d="M-34,-56 L-34,56 L60,0 Z" fill={C.charcoal} />
					</G>
				) : null}
			</Stage>
			{f >= wf(11) - 2 ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 700, display: 'flex', justifyContent: 'center', transform: `scale(${2.4 - 1.4 * why}) rotate(${4 - 6 * why}deg)`}}>
					<HeroWord text="ليش؟" size={330} face={C.charcoal} back={C.yellow} depth={14} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
