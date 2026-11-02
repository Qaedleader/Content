// Scene E — «طب مين بصنع الروبوتات نفسها؟ روبوتات ثانية. ومين بطوّرها؟ الذكاء الاصطناعي.»
// Reveal: the robot is being built by other robots, whose cell is one of many identical robot factories (self-expanding).
// Then the distinction: تصنيع (manufacturing) / تطوير (AI development) / تشغيل (deployment).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog} from '../../../brand/anim';
import {Stage} from '../../../brand/diagram';
import {FootagePrint} from '../../../brand/media';
import {Backdrop} from '../../../brand/paper';
import {Chip, CutText, G, RobotArm, Sparks, SvgDefs, armTip} from '../../../brand/props';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {TitleCard} from '../../../brand/type';
import {S, wf} from '../ep';

const CELL_W = 1080;
const CELL_H = 1100;
const N = 5; // 5×5 factories, hero = centre cell

/** One robot-building cell: two builder arms assembling a third arm on a small production floor. */
const RobotCell: React.FC<{f: number; seed: number; builders: number; build: number; hero?: boolean}> = ({f, seed, builders, build, hero}) => {
	const ph = f / 4 + seed;
	const a = Math.sin(ph) * 10;
	const lt = armTip(-40 + a, 100, 40);
	const rt = armTip(40 - a, -100, -40);
	return (
		<g>
			<rect x={30} y={40} width={CELL_W - 60} height={CELL_H - 80} rx={26} fill={hero ? 'rgba(244,236,221,0.0)' : 'rgba(244,236,221,0.08)'} stroke={C.paper} strokeOpacity={hero ? 0 : 0.35} strokeWidth={10} />
			<rect x={60} y={880} width={CELL_W - 120} height={30} rx={8} fill={C.charcoal} />
			<rect x={60} y={880} width={CELL_W - 120} height={8} fill={C.yellow} />
			{/* product robot (being built) */}
			<G x={540} y={880} s={1.5} f="sh">
				<g opacity={build > 0.05 ? 1 : 0}>
					<RobotArm a1={-12} a2={50 * build} a3={20} l1={210 * Math.min(1, build * 1.6)} l2={170 * Math.max(0, Math.min(1, build * 2 - 0.6))} tool={build > 0.9 ? 'gripper' : 'none'} />
				</g>
			</G>
			{builders > 0 ? (
				<>
					<G x={540 - 470 + (1 - builders) * -400} y={880} s={0.95} f="sh">
						<RobotArm a1={-40 + a} a2={100} a3={40} tool="welder" color={C.yellow} />
					</G>
					<G x={540 + 470 + (1 - builders) * 400} y={880} s={0.95} f="sh">
						<RobotArm a1={40 - a} a2={-100} a3={-40} tool="welder" color={C.yellow} />
					</G>
					{builders > 0.95 ? (
						<>
							<G x={540 - 470 + lt.x * 0.95} y={880 + lt.y * 0.95}>
								<Sparks frame={f + seed * 5} seed={seed} size={0.9} />
							</G>
							<G x={540 + 470 + rt.x * 0.95} y={880 + rt.y * 0.95}>
								<Sparks frame={f + seed * 7} seed={seed + 50} size={0.9} />
							</G>
						</>
					) : null}
				</>
			) : null}
		</g>
	);
};

export const RobotsScene: React.FC<{f: number}> = ({f}) => {
	const reveal = wf(49); // «روبوتات ثانية»
	const builders = pop(f, reveal - 4, {damping: 14});
	const z = kf(f, [reveal + 2, reveal + 16, reveal + 20, wf(51) + 2], [1, 0.42, 0.42, 0.2], EASE.io);
	const heroBuild = kf(f, [S.E[0], reveal + 10], [0.35, 1], EASE.out);
	const q = pop(f, wf(45) - 2) * (1 - prog(f, reveal - 4, reveal + 2));
	const dev = pop(f, wf(51) - 2, {damping: 15});
	const dim = prog(f, wf(51) - 2, wf(51) + 6);
	const version = f >= wf(53) + 4 ? 3 : f >= wf(52) + 4 ? 2 : 1;
	const chipGlow = prog(f, wf(53) - 2, wf(53) + 6);
	const heroCx = 2 * CELL_W + 540;
	const heroCy = 2 * CELL_H + 620;

	return (
		<AbsoluteFill>
			<Backdrop color={C.tealDark} pattern="tiles" ink="rgba(255,255,255,0.05)" light={0.18} />
			<div style={{position: 'absolute', inset: 0, opacity: 1 - dim * 0.65, filter: dim > 0 ? `blur(${dim * 3}px)` : undefined}}>
				<Stage>
					<SvgDefs />
					<g transform={`translate(540 ${1000}) scale(${z}) translate(${-heroCx} ${-heroCy})`}>
						{Array.from({length: N * N}).map((_, k) => {
							const i = k % N;
							const j = Math.floor(k / N);
							const hero = i === 2 && j === 2;
							const appear = hero ? 1 : pop(f, reveal + 8 + (Math.abs(i - 2) + Math.abs(j - 2)) * 3);
							if (appear <= 0.01) return null;
							return (
								<g key={k} transform={`translate(${i * CELL_W} ${j * CELL_H})`} opacity={appear}>
									<g transform={`translate(540 600) scale(${hero ? 1 : appear}) translate(-540 -600)`}>
										<RobotCell f={f} seed={k} builders={hero ? builders : 1} build={hero ? heroBuild : 0.4 + 0.6 * (((f + k * 13) / 60) % 1)} hero={hero} />
									</g>
								</g>
							);
						})}
					</g>
					{q > 0 ? (
						<G x={820} y={700} s={q} r={Math.sin(f / 5) * 8}>
							<CutText text="؟" size={320} color={C.yellow} back={C.charcoal} />
						</G>
					) : null}
				</Stage>
			</div>
			<TitleCard frame={f} at={wf(44)} out={reveal - 6} text="طب مين بصنع الروبوتات؟" />
			<TitleCard frame={f} at={reveal} out={wf(51) - 6} text="روبوتات بتصنع روبوتات" seed={8} />
			<TitleCard frame={f} at={wf(51)} text="ومين بطوّرها؟" seed={11} />

			{/* AI development interface */}
			{dev > 0 ? (
				<div style={{position: 'absolute', left: 80, top: 330, width: 920, height: 560, transform: `translateY(${(1 - dev) * 1300}px) rotate(-1deg)`, filter: SHADOW.lifted}}>
					<div style={{position: 'absolute', inset: 0, background: C.charcoal, borderRadius: 26}} />
					<div style={{position: 'absolute', left: 26, top: 26, right: 26, bottom: 26, background: C.navy, borderRadius: 12, overflow: 'hidden'}}>
						<div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '32px 32px'}} />
						<svg width={460} height={500} viewBox="-260 -620 520 640" style={{position: 'absolute', left: 10, top: 6}}>
							<g opacity={0.9}>
								<RobotArm a1={-18 + version * 6} a2={60 - version * 8} a3={25} color="none" dark="none" tool="gripper" />
								<g stroke={C.paperWhite} strokeWidth={4} fill="none">
									<RobotArm a1={-18 + version * 6} a2={60 - version * 8} a3={25} color={version === 3 ? C.yellow : 'rgba(255,255,255,0.15)'} dark={'rgba(255,255,255,0.25)'} />
								</g>
							</g>
						</svg>
						<div dir="rtl" style={{position: 'absolute', right: 26, top: 20, fontFamily: FONT.display, fontWeight: 800, fontSize: 34, color: C.paper}}>
							تطوير التصميم
						</div>
						<div dir="ltr" style={{position: 'absolute', right: 26, top: 74, display: 'flex', gap: 10}}>
							{[1, 2, 3].map((v) => (
								<div key={v} style={{padding: '6px 16px', borderRadius: 8, background: v === version ? C.yellow : 'rgba(255,255,255,0.12)', color: v === version ? C.charcoal : C.paper, fontFamily: FONT.mono, fontWeight: 800, fontSize: 28}}>
									v{v}
								</div>
							))}
						</div>
						{['الدقّة', 'السرعة', 'الكلفة'].map((lab, i) => {
							const val = [0.45, 0.4, 0.7][i] + (version - 1) * [0.22, 0.25, -0.2][i];
							return (
								<div key={lab} dir="rtl" style={{position: 'absolute', right: 26, top: 150 + i * 62, width: 380, display: 'flex', alignItems: 'center', gap: 14}}>
									<div style={{width: 96, fontFamily: FONT.label, fontWeight: 700, fontSize: 26, color: C.paper}}>{lab}</div>
									<div style={{position: 'relative', flex: 1, height: 18, background: 'rgba(255,255,255,0.12)', borderRadius: 9}}>
										<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${Math.max(0.05, Math.min(1, val)) * 100}%`, background: i === 2 ? C.terracotta : C.yellow, borderRadius: 9}} />
									</div>
								</div>
							);
						})}
						<div style={{position: 'absolute', right: 120, top: 340}}>
							<svg width={180} height={180} viewBox="-110 -110 220 220">
								<Chip glow={chipGlow * (0.7 + 0.3 * Math.sin(f / 3))} />
							</svg>
						</div>
					</div>
				</div>
			) : null}
			{/* real autonomous lab footage (today) */}
			<FootagePrint
				src="episodes/no-money/media/v_robot_lab.mp4"
				x={70}
				y={920}
				w={520}
				h={320}
				rot={-2}
				frame={f}
				at={wf(52) + 2}
				seed={77}
				trim={1}
				credit={{kind: 'لقطات حقيقية · مختبر آلي', text: 'Szymanski et al. · CC BY 4.0'}}
				enter="slideLeft"
			/>
			{/* the three roles */}
			{dev > 0 ? (
				<div dir="rtl" style={{position: 'absolute', right: 70, top: 935, width: 380, display: 'flex', flexDirection: 'column', gap: 12}}>
					{[
						['تصنيع', 'روبوتات', C.paperWhite],
						['تطوير', 'ذكاء اصطناعي', C.yellow],
						['تشغيل', 'بالمصانع', C.paperWhite],
					].map(([a, b, bg], i) => {
						const p = pop(f, wf(52) + 4 + i * 3);
						const on = i === 1 && f >= wf(53);
						return (
							<div
								key={a}
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									padding: '8px 18px',
									background: on ? C.yellow : (bg as string) === C.yellow ? C.yellowLight : bg,
									borderRadius: 8,
									filter: SHADOW.contact,
									transform: `scale(${p * (on ? 1.06 : 1)}) rotate(${(i - 1) * 1.5}deg)`,
								}}
							>
								<span style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 34, color: C.charcoal}}>{a}</span>
								<span style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 24, color: C.charcoalSoft}}>{b}</span>
							</div>
						);
					})}
				</div>
			) : null}
		</AbsoluteFill>
	);
};
