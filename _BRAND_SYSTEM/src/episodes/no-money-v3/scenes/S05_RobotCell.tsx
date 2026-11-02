// V3 · Shot 05 (frames 579–718) «طب مين بصنع الروبوتات نفسها؟ روبوتات ثانية. ومين بطوّرها؟ الذكاء الاصطناعي»
// ROBOT CELL: real industrial-robot footage over a paper line carrying robot-arm PARTS («؟»). On «روبوتات ثانية» the
// camera pushes in: two arms weld and assemble a NEW arm joint by joint; it wakes up («تصنيع»). On «ومين بطوّرها»
// a navy «تطوير» board slides in: an AI blueprint of the arm iterates v1→v2→v3 (chip lights), with real
// autonomous-lab footage; an arrow feeds the improved design down into production.
// Locked cues: pop f585 · whoosh f629 · riser/weld f633–659 · servos f641–653 · slide f657 · blips f671/689 · digital f685.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {Backdrop} from '../../../brand/paper';
import {Chip, Conveyor, CutText, G, RobotArm, Sparks, SvgDefs, armTip} from '../../../brand/props';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../../no-money/ep';
import {idle, M1, Win} from '../kit';

const LINE_Y = 1235;

/** Robot-arm parts riding the line. */
const Part: React.FC<{k: number}> = ({k}) =>
	k % 3 === 0 ? (
		<g>
			<path d="M-60,0 L60,0 L46,-30 L-46,-30 Z" fill={C.charcoal} stroke="rgba(30,20,10,0.3)" strokeWidth={2} />
			<rect x={-34} y={-66} width={68} height={38} rx={8} fill={C.yellowShade} />
		</g>
	) : k % 3 === 1 ? (
		<rect x={-80} y={-44} width={160} height={44} rx={22} fill={C.yellow} stroke="rgba(30,20,10,0.3)" strokeWidth={2} />
	) : (
		<g>
			<circle cx={0} cy={-30} r={30} fill={C.yellowShade} stroke="rgba(30,20,10,0.3)" strokeWidth={2} />
			<circle cx={0} cy={-30} r={11} fill={C.charcoal} />
		</g>
	);

export const RobotCellScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.E;
	const q = pop(f, wf(45) - 3);
	const push = prog(f, wf(49) - 4, wf(49) + 6, EASE.io);
	const back = prog(f, wf(51) - 3, wf(51) + 12, EASE.io);
	const cam = 1 + 0.32 * push * (1 - back);
	const winOut = prog(f, wf(49) - 6, wf(49) + 2, EASE.in);
	// new arm assembled joint by joint (servo cues)
	const base = pop(f, wf(49));
	const l1 = prog(f, wf(49) + 8, wf(49) + 14, EASE.out);
	const l2 = prog(f, wf(49) + 14, wf(49) + 20, EASE.out);
	const tool = pop(f, wf(49) + 20);
	const wake = prog(f, wf(50) + 4, wf(51) + 10, EASE.io);
	const welding = f >= wf(49) && f < wf(51);
	const sw = idle(f, 7, 10);
	const tipL = armTip(-38 + sw, 88, 40);
	const tipR = armTip(38 - sw, -88, -40);
	// development board
	const board = pop(f, wf(51) - 2, {damping: 15});
	const ver = f < wf(52) + 4 ? 0 : f < wf(53) + 4 ? 1 : 2;
	const verPop = pop(f, ver === 0 ? wf(51) + 4 : ver === 1 ? wf(52) + 4 : wf(53) + 4);
	const chip = prog(f, wf(53), wf(53) + 10);
	const feed = prog(f, wf(54), wf(54) + 14, EASE.io);
	const bars = [
		[0.45, 0.62, 0.86],
		[0.5, 0.7, 0.9],
		[0.3, 0.55, 0.8],
	];
	const geo = [
		{a1: -18, a2: 64, a3: 30},
		{a1: -26, a2: 74, a3: 38},
		{a1: -32, a2: 84, a3: 44},
	][ver];
	const conv = f;
	return (
		<AbsoluteFill>
			<Backdrop color={C.navy} pattern="grid" ink="rgba(255,255,255,0.05)" floorY={LINE_Y + 40} floorColor={C.kraft} light={0.2} />
			<Camera scale={cam} origin={`540px ${LINE_Y - 200}px`}>
				<Stage>
					<SvgDefs />
					{/* parts conveyor */}
					<G x={-40} y={LINE_Y}>
						<Conveyor len={1160} frame={conv} speed={5} />
					</G>
					{Array.from({length: 9}).map((_, k) => {
						const x = 1180 - ((f - a + k * 46) * 5) % (9 * 46 * 5) + (k % 2) * 0;
						const near = Math.abs(x - 540) < 170;
						return near && f >= wf(49) - 4 ? null : (
							<G key={k} x={x} y={LINE_Y} s={0.8} f="shs">
								<Part k={k} />
							</G>
						);
					})}
					{/* two builder arms */}
					<G x={250} y={LINE_Y + 40} s={0.95} f="sh">
						<RobotArm a1={-38 + sw} a2={88} a3={40} tool="welder" />
					</G>
					<G x={830} y={LINE_Y + 40} s={0.95} f="sh">
						<RobotArm a1={38 - sw} a2={-88} a3={-40} tool="welder" />
					</G>
					{welding ? (
						<>
							<G x={250 + tipL.x * 0.95} y={LINE_Y + 40 + tipL.y * 0.95}>
								<Sparks frame={f} seed={5} size={0.9} />
							</G>
							<G x={830 + tipR.x * 0.95} y={LINE_Y + 40 + tipR.y * 0.95}>
								<Sparks frame={f} seed={9} size={0.9} />
							</G>
						</>
					) : null}
					{/* the NEW robot arm, assembled joint by joint */}
					{base > 0 ? (
						<G x={540} y={LINE_Y} s={0.9 * base} f="shl">
							<RobotArm a1={kf(wake, [0, 1], [0, -22]) + (wake >= 1 ? idle(f, 16, 6) : 0)} a2={kf(wake, [0, 1], [0, 70])} a3={kf(wake, [0, 1], [0, 30])} l1={210 * Math.max(0.01, l1)} l2={170 * Math.max(0.01, l2)} tool={tool > 0.5 ? 'gripper' : 'none'} color={C.yellow} />
						</G>
					) : null}
					{q > 0 && base <= 0 ? (
						<G x={540} y={LINE_Y - 170} s={q}>
							<CutText text="؟" size={380} color={C.yellow} back={C.charcoal} />
						</G>
					) : null}
					{/* design feeds production */}
					{feed > 0 ? <path d={`M540,880 L540,${880 + feed * 120}`} stroke={C.yellow} strokeWidth={12} strokeLinecap="round" strokeDasharray="22 16" strokeDashoffset={-f * 4} /> : null}
					{feed > 0.95 ? <path d="M520,990 L540,1020 L560,990" fill="none" stroke={C.yellow} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /> : null}
				</Stage>
				{f >= wf(50) - 2 ? (
					<div style={{position: 'absolute', left: 250, top: LINE_Y - 600, transform: `scale(${pop(f, wf(50) - 2)}) rotate(-2deg)`}}>
						<Label text="تصنيع" size={44} bg={C.yellow} />
					</div>
				) : null}
			</Camera>
			{/* real robot footage (question beat) */}
			{winOut < 1 ? (
				<div style={{position: 'absolute', inset: 0, transform: `translateY(${winOut * -1100}px)`}}>
					<Win src={M1('v_staubli.mp4')} x={150} y={330} w={780} h={470} rot={-1.2} f={f} at={a + 1} credit="no_kids_for_dads · CC BY 3.0" kind="لقطات حقيقية · روبوت صناعي" seed={31} enter="pop" />
				</div>
			) : null}
			{/* development board */}
			{board > 0 ? (
				<div style={{position: 'absolute', left: 70, top: 270, width: 940, height: 540, transform: `translateX(${(1 - board) * 1200}px) rotate(${(1 - board) * 6 + 0.8}deg)`, filter: SHADOW.lifted}}>
					<div style={{position: 'absolute', inset: 0, background: C.navyDeep, borderRadius: 14, border: `4px solid ${C.navyLight}`}} />
					<div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.07) 2px, transparent 2px)', backgroundSize: '40px 40px', borderRadius: 14}} />
					<div dir="rtl" style={{position: 'absolute', right: 30, top: 18, display: 'flex', gap: 14, alignItems: 'center'}}>
						<div style={{background: C.yellow, padding: '4px 16px', borderRadius: 6, fontFamily: FONT.display, fontWeight: 900, fontSize: 38, color: C.charcoal}}>تطوير</div>
						<div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: C.paper}}>الذكاء الاصطناعي بيحسّن التصميم</div>
					</div>
					<svg width={940} height={540} viewBox="0 0 940 540" style={{position: 'absolute', left: 0, top: 0}}>
						<SvgDefs />
						{/* blueprint arm */}
						<G x={650} y={480} s={0.95}>
							<g opacity={0.95}>
								<RobotArm a1={geo.a1} a2={geo.a2} a3={geo.a3} color="rgba(255,255,255,0.08)" dark="rgba(255,255,255,0.14)" />
							</g>
						</G>
						{/* version tabs */}
						{[0, 1, 2].map((k) => (
							<g key={k} transform={`translate(${70 + k * 120} 110)`}>
								<rect x={0} y={0} width={100} height={52} rx={8} fill={k === ver ? C.yellow : 'rgba(255,255,255,0.1)'} transform={k === ver ? `scale(${0.9 + 0.1 * verPop})` : undefined} />
								<text x={50} y={36} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={28} fill={k === ver ? C.charcoal : C.paper}>{`v${k + 1}`}</text>
							</g>
						))}
						{/* improving metrics (illustrative, no numbers) */}
						{['دقة', 'سرعة', 'كفاءة'].map((m, k) => (
							<g key={m} transform={`translate(70 ${210 + k * 62})`}>
								<rect x={0} y={0} width={300} height={22} rx={11} fill="rgba(255,255,255,0.12)" />
								<rect x={0} y={0} width={300 * (bars[k][ver] * (0.85 + 0.15 * verPop))} height={22} rx={11} fill={k === 2 ? C.yellow : C.paper} />
								<text x={320} y={20} fontFamily={FONT.display} fontWeight={700} fontSize={24} fill={C.paper}>{m}</text>
							</g>
						))}
						<G x={150} y={440} s={0.42} f="sh">
							<Chip glow={chip} />
						</G>
					</svg>
				</div>
			) : null}
			{board > 0.5 ? <Win src={M1('v_robot_lab.mp4')} x={330} y={560} w={260} h={190} rot={-3} f={f} at={wf(52) - 4} credit="Szymanski et al. · CC BY 4.0" kind="لقطات حقيقية · مختبر مؤتمت" seed={32} enter="pop" /> : null}
			{f >= wf(53) ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 832, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, wf(53))})`}}>
					<Badge text="تصوّر افتراضي — التصنيع الذاتي الكامل مش واقع اليوم" color={C.yellow} bg="rgba(20,30,45,0.92)" size={22} rot={0} />
				</div>
			) : null}
			<TitleCard frame={f} at={a + 1} out={wf(51) - 6} text="مين بيصنع الروبوتات؟" />
		</AbsoluteFill>
	);
};
