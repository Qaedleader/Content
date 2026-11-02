// V3 · Shot 03 (frames 132–275) «تخيّل عالم الذكاء الاصطناعي والروبوتات بيعملوا فيه 99.9% من كل إشي»
// 999 OF 1,000: a board of 1,000 paper task tiles. AI chip (on «الذكاء الاصطناعي») and robot arms (on «والروبوتات»)
// arrive; across «99.9%» a yellow wave flips 999 tiles; one cream tile stays («0.1%»); six goods pop on «من كل إشي».
// Locked cues: slides f133–145 · digital f153 · servos f179–188 · tick-roll f210–240 · stamp f240 · pops f252–262.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {PaperCounter, Stage} from '../../../brand/diagram';
import {Backdrop} from '../../../brand/paper';
import {Chip, G, RobotArm, SvgDefs} from '../../../brand/props';
import {C, SHADOW} from '../../../brand/tokens';
import {Badge, Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../../no-money/ep';
import {IconName, idle, Token} from '../kit';

const COLS = 40;
const ROWS = 25;
const P = 21; // tile pitch
const BX = 540 - (COLS * P) / 2;
const BY = 650;
const KEEP = {c: 6, r: 21}; // the one task still done by people
const GOODS: IconName[] = ['car', 'house', 'bread', 'shirt', 'pill', 'phone'];

export const ThousandScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.C;
	const board = pop(f, a + 1, {damping: 15});
	const chip = pop(f, wf(14) - 2);
	const sig = prog(f, wf(14), wf(14) + 14);
	const t0 = wf(19);
	const t1 = t0 + 28;
	const ox = 540;
	const oy = BY - 40;
	const dmax = Math.hypot(COLS * P / 2 + 10, ROWS * P + 40);
	const count = kf(f, [t0, t1], [0, 99.9], EASE.out);
	const lock = slam(f, t1 + 1);
	const keepTag = pop(f, t1 + 4);
	const tiles: React.ReactNode[] = [];
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLS; c++) {
			const x = BX + c * P;
			const y = BY + r * P;
			const keep = c === KEEP.c && r === KEEP.r;
			const ft = t0 + (Math.hypot(x + P / 2 - ox, y + P / 2 - oy) / dmax) * 28;
			const flip = keep ? 0 : prog(f, ft, ft + 4);
			const sy = Math.abs(Math.cos(flip * Math.PI));
			const on = flip > 0.5;
			tiles.push(<rect key={r * COLS + c} x={x + 2} y={y + 2 + ((P - 4) * (1 - sy)) / 2} width={P - 4} height={(P - 4) * Math.max(0.08, sy)} rx={3} fill={keep ? C.paperWhite : on ? C.yellow : 'rgba(38,35,33,0.16)'} />);
		}
	}
	const kx = BX + KEEP.c * P + P / 2;
	const ky = BY + KEEP.r * P + P / 2;
	return (
		<AbsoluteFill>
			<Backdrop color={C.navy} pattern="dots" ink="rgba(255,255,255,0.05)" light={0.22} />
			<Stage>
				<SvgDefs />
				{/* board */}
				<G x={540} y={BY + (ROWS * P) / 2} s={board} r={(1 - board) * -6} f="shl">
					<rect x={-(COLS * P) / 2 - 26} y={-(ROWS * P) / 2 - 26} width={COLS * P + 52} height={ROWS * P + 52} rx={10} fill={C.paper} />
				</G>
				{board > 0.9 ? <g>{tiles}</g> : null}
				{/* AI chip and its signal lines into the board */}
				{chip > 0 ? (
					<>
						{[-280, -100, 100, 280].map((dx, i) => (
							<path key={i} d={`M540,470 C540,${540} ${540 + dx},${560} ${540 + dx},${BY - 20}`} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="300" strokeDashoffset={300 * (1 - sig)} opacity={0.9} />
						))}
						<G x={540} y={420} s={0.62 * chip} f="sh">
							<Chip glow={sig} />
						</G>
					</>
				) : null}
				{/* robot arms join on «والروبوتات» */}
				{[0, 1, 2, 3].map((i) => {
					const p = pop(f, wf(16) - 2 + i * 3);
					const side = i < 2 ? -1 : 1;
					const x = 540 + side * (210 + (i % 2) * 150);
					return p > 0 ? (
						<G key={i} x={x} y={BY - 26} s={0.5 * p} f="sh">
							<RobotArm a1={side * -25 + idle(f, 20, 10, i)} a2={side * -70} a3={side * -30} tool="gripper" />
						</G>
					) : null;
				})}
				{/* the one remaining task */}
				{keepTag > 0 ? (
					<>
						<circle cx={kx} cy={ky} r={22} fill="none" stroke={C.terracotta} strokeWidth={5} />
						<path d={`M${kx + 20},${ky - 14} L${kx + 120},${ky - 90}`} stroke={C.terracotta} strokeWidth={4} />
					</>
				) : null}
				{/* six goods on «من كل إشي» */}
				{GOODS.map((g, i) => {
					const p = pop(f, Math.round(252 + i * 2) - 1);
					return p > 0 ? (
						<G key={g} x={130 + i * 164} y={1250} s={p}>
							<Token icon={g} r={52} bg={i % 2 ? C.paperWhite : C.yellow} />
						</G>
					) : null;
				})}
			</Stage>
			{/* counter plate */}
			{f >= t0 - 2 ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: BY + 150, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, t0 - 2) * (1 + 0.12 * Math.sin(Math.min(1, lock) * Math.PI))})`}}>
					<div style={{padding: '20px 30px', background: C.charcoal, borderRadius: 14, filter: SHADOW.lifted}}>
						<PaperCounter value={count} decimals={1} suffix="%" size={120} minDigits={2} />
					</div>
				</div>
			) : null}
			{keepTag > 0 ? (
				<div style={{position: 'absolute', left: kx + 110, top: ky - 140, transform: `scale(${keepTag}) rotate(-4deg)`, transformOrigin: 'left bottom'}}>
					<Label text="0.1% بس" size={34} bg={C.paperWhite} />
				</div>
			) : null}
			<div style={{position: 'absolute', left: 60, top: 300, transform: `scale(${pop(f, a + 8)})`, transformOrigin: 'left center'}}>
				<Badge text="سيناريو افتراضي" color={C.yellow} bg="rgba(20,30,45,0.9)" size={24} />
			</div>
			<TitleCard frame={f} at={a + 1} text="تخيّل: 999 مهمة من كل 1000" />
		</AbsoluteFill>
	);
};
