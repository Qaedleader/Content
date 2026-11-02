// N6 «مثلاً بعد سبع سنين بتسمع عن هاي التقنية وبتحكي: لحظة! أنا سامع عنها من قبل، بس مين حكالي؟»
// N7 «الشريحة بتفتّش بذكرياتك وبترجعلك الجواب فوراً. آه والله! قائد اللي حكالي عن هاي التقنية بهذا الفيديو» (speculative)
// N8 «والأقوى من هيك، ممكن ناخد ذكرياتك كلها ونحطّها بروبوت، أو حتى بجسم تاني» (speculative)
// N9 «يعني باختصار، بنعملّك استنساخ. لا، بمزح! مش بهاي البساطة. نسخ ذكرياتك إشي، ونقل وعيك إشي تاني»
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, rand, shake, slam} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {PhotoPrint} from '../../../brand/media';
import {Backdrop} from '../../../brand/paper';
import {CutText, FlowPath, G, RobotArm, SvgDefs} from '../../../brand/props';
import {ArchiveRail, FlipYear, MemoryCard, PaperBrain, PaperFigure} from '../../../brand/science';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../ep';
import {HookScene} from './N1_N2';

export const WaitScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.N6;
	const yearT = prog(f, wf(59), wf(61) + 8, EASE.io);
	const year = 2026 + Math.round(yearT * 7);
	const flip = ((yearT * 7) % 1) * (yearT < 1 ? 1 : 0);
	const news = pop(f, wf(62) - 2, {damping: 14});
	const freeze = f >= wf(67) - 1;
	const wait = slam(f, wf(67) - 1);
	const sk = shake(f, wf(67) - 1, 12, 8);
	const q = pop(f, wf(74) - 2);
	return (
		<AbsoluteFill style={{filter: freeze && f < wf(68) ? 'saturate(0.35)' : undefined}}>
			<Backdrop color={C.teal} pattern="grid" ink="rgba(255,255,255,0.06)" light={0.2} />
			<Camera x={sk.x} y={sk.y}>
				<Stage>
					<SvgDefs />
					<G x={540} y={freeze ? 640 : 760} s={freeze ? 0.6 : 1}>
						<FlipYear value={year} flip={flip} />
					</G>
					{/* calendar pages flying off while years pass */}
					{Array.from({length: 7}).map((_, k) => {
						const t0 = wf(59) + k * 4;
						const t = (f - t0) / 14;
						if (t <= 0 || t > 1) return null;
						return (
							<G key={k} x={540 + t * (k % 2 ? 500 : -500)} y={700 - t * 500} r={t * (k % 2 ? 90 : -90)} o={1 - t}>
								<rect x={-60} y={-80} width={120} height={160} rx={8} fill={C.paperWhite} />
								<text x={0} y={30} textAnchor="middle" fontFamily={FONT.display} fontWeight={900} fontSize={70} fill={C.charcoal}>
									{2027 + k}
								</text>
							</G>
						);
					})}
					{q > 0 ? (
						<G x={800} y={1120} s={q} r={Math.sin(f / 5) * 8}>
							<CutText text="؟" size={280} color={C.yellow} back={C.charcoal} />
						</G>
					) : null}
					{f >= wf(69) ? (
						<G x={330} y={1090} s={0.42 * pop(f, wf(69))}>
							<PaperBrain mode="cabinet" id="n6" drawerOpen={(k) => (k % 5 === (Math.floor(f / 3) % 5) ? 0.6 : 0)} />
						</G>
					) : null}
				</Stage>
				{news > 0 ? (
					<div style={{position: 'absolute', left: 140, top: 1000, width: 800, transform: `translateY(${(1 - news) * 500}px) rotate(-1.5deg)`, filter: SHADOW.lifted, opacity: freeze ? 0 : 1}}>
						<div dir="rtl" style={{background: C.paperWhite, borderRadius: 16, padding: '20px 28px', display: 'flex', gap: 18, alignItems: 'center'}}>
							<div style={{width: 64, height: 64, borderRadius: 14, background: C.yellow, flexShrink: 0}} />
							<div>
								<div style={{fontFamily: FONT.label, fontSize: 24, color: C.charcoalSoft}}>خبر · {year}</div>
								<div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 36, color: C.charcoal}}>تقنية جديدة بتحفظ ذكرياتك…</div>
							</div>
						</div>
					</div>
				) : null}
				{wait > 0 && f < wf(68) + 18 ? (
					<div style={{position: 'absolute', left: 0, width: 1080, top: 900, display: 'flex', justifyContent: 'center', transform: `scale(${2.2 - 1.2 * wait}) rotate(-4deg)`}}>
						<HeroWord text="لحظة!" size={240} face={C.charcoal} back={C.yellowShade} strip={C.yellow} stripSeed={4} depth={9} />
					</div>
				) : null}
			</Camera>
			<TitleCard frame={f} at={a + 1} out={wf(68) - 4} text="بعد ٧ سنين…" />
			<TitleCard frame={f} at={wf(68)} text="مين حكالي؟" seed={10} />
		</AbsoluteFill>
	);
};

export const RetrievalScene: React.FC<{f: number}> = ({f}) => {
	const [a, b] = S.N7;
	// rail scanning speed: accelerates, then decelerates to stop on the answer
	const stopAt = wf(80);
	const v = (t: number) => (t < a ? 0 : t < a + 12 ? ((t - a) / 12) * 46 : t < stopAt - 14 ? 46 : t < stopAt ? ((stopAt - t) / 14) * 46 : 0);
	let off = 0;
	for (let t = a; t < f; t++) off += v(t);
	const target = Math.floor((off + 540) / 120); // card nearest centre once stopped
	const lift = prog(f, stopAt, stopAt + 8, EASE.out);
	const toFront = prog(f, wf(81) - 4, wf(82) + 2, EASE.io);
	const flip = prog(f, wf(83), wf(84), EASE.io);
	const phoneIn = prog(f, wf(85), wf(86) + 6, EASE.io);
	const query = 'مين حكالي عن هالتقنية؟';
	const typedN = Math.max(0, Math.min(query.length, Math.floor((f - a - 2) / 1.4)));
	const scanning = f < stopAt;
	const flipScale = Math.abs(Math.cos(flip * Math.PI));
	const showBack = flip > 0.5;
	return (
		<AbsoluteFill>
			<Backdrop color={C.navyDeep} pattern="none" light={0.3} />
			<Camera scale={kf(f, [a, stopAt, b], [1.12, 1.0, 1.04], EASE.io)}>
				<Stage>
					<SvgDefs />
					<g opacity={1 - toFront * 0.65} style={{filter: scanning ? 'none' : undefined}}>
						<G x={0} y={860}>
							<ArchiveRail w={1080} offset={off} seed={5} rows={3} hiIndex={f >= stopAt ? target : -1} hiLift={lift * (1 - toFront)} />
						</G>
						{/* sorter head travelling along the middle rail */}
						<G x={540 + Math.sin(f / 3) * (scanning ? 30 : 0)} y={700} s={0.55}>
							<RobotArm a1={180} a2={0} a3={0} tool="gripper" grip={scanning ? 0.6 : 0.1} l1={120} l2={80} />
						</G>
						{scanning ? <rect x={520} y={540} width={40} height={640} fill={C.yellow} opacity={0.18 + 0.1 * Math.sin(f)} /> : null}
					</g>
					{/* the retrieved card flies to the front, flips: «قائد» */}
					{f >= stopAt && phoneIn < 1 ? (
						<G x={540} y={kf(toFront, [0, 1], [860 - 60, 760])} s={kf(toFront, [0, 1], [0.62, 2.4])} f="shl" o={1 - phoneIn}>
							<g transform={`scale(${flipScale} 1)`}>
								{showBack ? (
									<g>
										<rect x={-85} y={-60} width={170} height={120} rx={6} fill={C.yellow} stroke="rgba(30,20,10,0.25)" strokeWidth={2} />
										<text x={0} y={22} textAnchor="middle" fontFamily={FONT.hero} fontSize={68} fill={C.charcoal}>
											قائد
										</text>
										<text x={0} y={-34} textAnchor="middle" fontFamily={FONT.label} fontWeight={700} fontSize={13} fill={C.charcoalSoft}>
											المصدر
										</text>
									</g>
								) : (
									<MemoryCard pic="video" hi />
								)}
							</g>
						</G>
					) : null}
				</Stage>
				{/* search query */}
				<div dir="rtl" style={{position: 'absolute', left: 150, top: 380, width: 820, filter: SHADOW.lifted, opacity: 1 - phoneIn, transform: `translateY(${(1 - pop(f, a + 1)) * -300}px)`}}>
					<div style={{background: C.paperWhite, borderRadius: 40, padding: '16px 30px', display: 'flex', alignItems: 'center', gap: 16}}>
						<svg width={44} height={44} viewBox="-22 -22 44 44">
							<circle cx={-3} cy={-3} r={13} fill="none" stroke={C.charcoal} strokeWidth={5} />
							<line x1={7} y1={7} x2={18} y2={18} stroke={C.charcoal} strokeWidth={6} strokeLinecap="round" />
						</svg>
						<div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 38, color: C.charcoal}}>
							{query.slice(0, typedN)}
							{typedN < query.length && Math.floor(f / 8) % 2 ? '|' : ''}
						</div>
					</div>
				</div>
				{f >= stopAt + 4 && phoneIn < 0.5 ? (
					<div style={{position: 'absolute', left: 660, top: 470, transform: `scale(${pop(f, stopAt + 4)}) rotate(4deg)`}}>
						<Label text="⏱ ٠٫٢ ثانية" size={34} bg={C.teal} fg={C.paperWhite} />
					</div>
				) : null}
				{/* this very video, inside a paper phone (callback to the opening) */}
				{phoneIn > 0 ? (
					<div style={{position: 'absolute', left: 540 - 175, top: 400, width: 350, height: 680, transform: `scale(${0.5 + 0.5 * phoneIn}) rotate(${(1 - phoneIn) * 12 - 2}deg)`, opacity: phoneIn, filter: SHADOW.lifted}}>
						<div style={{position: 'absolute', inset: 0, background: C.charcoal, borderRadius: 46}} />
						<div style={{position: 'absolute', left: 22, top: 40, width: 306, height: 544, borderRadius: 18, overflow: 'hidden', background: C.navyDeep}}>
							<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${306 / 1080})`, transformOrigin: '0 0'}}>
								<HookScene f={Math.max(0, f - wf(85)) % 75} mini />
							</div>
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, bottom: 22, display: 'flex', justifyContent: 'center'}}>
							<Label text="بهذا الفيديو ▶" size={30} bg={C.yellow} />
						</div>
					</div>
				) : null}
				{showBack && f < wf(85) + 8 ? (
					<div style={{position: 'absolute', left: 0, width: 1080, top: 1060, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, wf(84))})`}}>
						<Badge text="✓ تم العثور على المصدر" color={C.teal} size={28} rot={-2} />
					</div>
				) : null}
			</Camera>
			<TitleCard frame={f} at={a + 1} out={wf(82) - 4} text="الشريحة بتفتّش بذكرياتك" />
			<TitleCard frame={f} at={wf(82)} text="آه والله!" seed={14} />
		</AbsoluteFill>
	);
};

export const TransferScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.N8;
	const open = (k: number) => prog(f, a + 2 + (k % 8) * 0.8 + Math.floor(k / 8), a + 12 + (k % 8) * 0.8);
	const pack = prog(f, wf(95), wf(98) + 6, EASE.io);
	const robotIn = wf(99) - 3;
	const toRobot = prog(f, wf(99), wf(100) + 6, EASE.io);
	const body = pop(f, wf(101) - 2);
	const toBody = prog(f, wf(102), wf(104) + 6, EASE.io);
	return (
		<AbsoluteFill>
			<Backdrop color={C.navyDeep} pattern="none" light={0.28} />
			<AbsoluteFill style={{background: 'repeating-conic-gradient(from 0deg at 50% 52%, rgba(242,182,48,0.05) 0deg 8deg, transparent 8deg 16deg)'}} />
			<Stage>
				<SvgDefs />
				<G x={f < robotIn ? 540 : 300} y={f < robotIn ? 820 : 760} s={f < robotIn ? 1.0 : 0.6}>
					<PaperBrain mode="cabinet" id="n8" drawerOpen={open} />
				</G>
				{/* cards streaming out of the archive into one cartridge */}
				{Array.from({length: 16}).map((_, k) => {
					const t = Math.min(1, Math.max(0, pack * 1.4 - k * 0.025));
					if (t <= 0 || t >= 1) return null;
					const x0 = (f < robotIn ? 540 : 300) + (rand(k) - 0.5) * 500;
					const y0 = 760 + (rand(k + 9) - 0.5) * 360;
					return (
						<G key={k} x={x0 + (540 - x0) * t} y={y0 + (1150 - y0) * t} s={0.5 * (1 - t * 0.6)} r={k * 23 * (1 - t)}>
							<MemoryCard pic={(['sun', 'music', 'key', 'house', 'book', 'star'] as const)[k % 6]} seed={k} />
						</G>
					);
				})}
				{pack > 0 ? (
					<G x={kf(toRobot, [0, 1], [540, 760])} y={kf(toRobot, [0, 1], [1130, 760])} s={1.25 * (1 - toBody * 0.3)} f="sh">
						<rect x={-120} y={-70} width={240} height={140} rx={16} fill={C.charcoal} />
						<rect x={-100} y={-50} width={200} height={30} rx={8} fill={C.paperShade} />
						<rect x={-100} y={-50} width={200 * pack} height={30} rx={8} fill={C.yellow} />
						<text x={0} y={46} textAnchor="middle" fontFamily={FONT.display} fontWeight={900} fontSize={34} fill={C.paperWhite}>
							ذكرياتك كلها
						</text>
					</G>
				) : null}
				{f >= robotIn ? <FlowPath d="M420,760 Q580,680 690,760" draw={toRobot} frame={f} width={10} glow /> : null}
				{body > 0 ? (
					<>
						<G x={260} y={1230} s={0.75 * body} f="sh">
							<PaperFigure color={C.paperShade} />
						</G>
						<FlowPath d="M300,900 Q240,960 260,1010" draw={toBody} frame={f} width={9} glow />
					</>
				) : null}
			</Stage>
			<PhotoPrint
				src="episodes/neuralink/media/humanoid_robot.jpg"
				x={620}
				y={420}
				w={400}
				h={560}
				rot={2.5}
				frame={f}
				at={robotIn}
				seed={81}
				kb={{from: 1.05, to: 1.12}}
				kbDur={60}
				credit={{kind: 'روبوت حقيقي اليوم', text: 'Magda Ehlers · Pexels'}}
			/>
			{f >= robotIn + 8 ? (
				<div style={{position: 'absolute', left: 60, top: 1110, transform: `scale(${pop(f, robotIn + 8)})`, transformOrigin: 'left top'}}>
					<Badge text="نقل الذكريات لروبوت: مش ممكن اليوم" size={24} />
				</div>
			) : null}
			<TitleCard frame={f} at={a + 1} out={robotIn - 6} text="والأقوى من هيك…" />
			<TitleCard frame={f} at={robotIn} text="ذكرياتك… بروبوت؟" seed={19} />
		</AbsoluteFill>
	);
};

export const CloneScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.N9;
	const n = f >= wf(108) ? 9 : f >= wf(107) ? 4 : f >= wf(106) ? 2 : 1;
	const joke = wf(109) - 1;
	const crumple = prog(f, joke, joke + 10, EASE.in);
	const mz = slam(f, wf(110) - 1);
	const split = wf(114) - 2;
	const leftC = pop(f, split + 1);
	const rightC = pop(f, wf(117) - 1);
	const neq = slam(f, wf(117) + 6);
	const knot = pop(f, wf(111) - 1);
	return (
		<AbsoluteFill>
			<Backdrop color={f < split ? C.sage : C.paper} pattern={f < split ? 'stripes' : 'grid'} ink={f < split ? 'rgba(255,255,255,0.07)' : 'rgba(38,35,33,0.05)'} floorY={f < split ? 1200 : undefined} light={0.22} />
			<Stage>
				<SvgDefs />
				{f < split ? (
					<g transform={`translate(0 ${crumple * 300}) scale(1 ${1 - crumple * 0.4})`} opacity={1 - crumple}>
						{Array.from({length: n}).map((_, k) => {
							const cols = n === 1 ? 1 : n === 2 ? 2 : n === 4 ? 2 : 3;
							const rows = Math.ceil(n / cols);
							const i = k % cols;
							const j = Math.floor(k / cols);
							const s = n === 1 ? 1.4 : n <= 4 ? 0.85 : 0.6;
							const x = 540 + (i - (cols - 1) / 2) * 380 * s;
							const y = 1200 - (rows - 1 - j) * 470 * s;
							return (
								<G key={`${n}-${k}`} x={x} y={y} s={s * pop(f, ({1: a, 2: wf(106), 4: wf(107), 9: wf(108)} as Record<number, number>)[n] + k)} f="sh">
									<PaperFigure color={k === 0 ? C.yellow : C.paperShade} />
								</G>
							);
						})}
					</g>
				) : null}
				{knot > 0 && f < split ? (
					<G x={540} y={760} s={knot}>
						<path d="M-260,0 C-160,-160 -40,160 40,-40 C110,-200 -110,-180 -40,40 C30,240 200,60 120,-60 C60,-140 260,-120 260,40" fill="none" stroke={C.charcoal} strokeWidth={18} strokeLinecap="round" filter="url(#sh)" />
					</G>
				) : null}
				{f >= split ? (
					<>
						{/* copy: memory cards duplicate */}
						<G x={270} y={820} s={leftC}>
							<rect x={-210} y={-260} width={420} height={520} rx={18} fill={C.paperWhite} stroke="rgba(30,20,10,0.2)" strokeWidth={2} filter="url(#sh)" />
							<G x={-50} y={-40} r={-6}>
								<MemoryCard pic="sun" seed={1} />
							</G>
							<G x={50} y={40} r={5}>
								<MemoryCard pic="sun" seed={1} />
							</G>
							<text x={0} y={200} textAnchor="middle" fontFamily={FONT.display} fontWeight={900} fontSize={46} fill={C.charcoal}>
								نسخ ذكرياتك
							</text>
						</G>
						{/* transfer of consciousness: unknown */}
						{rightC > 0 ? (
							<G x={810} y={820} s={rightC}>
								<rect x={-210} y={-260} width={420} height={520} rx={18} fill={C.navy} filter="url(#sh)" />
								<G x={-90} y={60} s={0.45}>
									<PaperFigure color={C.paper} />
								</G>
								<G x={90} y={60} s={0.45}>
									<PaperFigure color={C.steel} />
								</G>
								<circle cx={kf((f / 20) % 1, [0, 1], [-90, 90])} cy={-110} r={18} fill={C.yellow} filter="url(#glow)" />
								<G x={0} y={-40} s={0.6}>
									<CutText text="؟" size={160} color={C.yellow} back={C.charcoal} />
								</G>
								<text x={0} y={200} textAnchor="middle" fontFamily={FONT.display} fontWeight={900} fontSize={46} fill={C.paperWhite}>
									نقل وعيك
								</text>
							</G>
						) : null}
						{neq > 0 ? (
							<G x={540} y={820} s={neq}>
								<CutText text="≠" size={200} color={C.terracotta} back={C.charcoal} font={FONT.display} weight={900} />
							</G>
						) : null}
					</>
				) : null}
			</Stage>
			{f >= wf(108) - 1 && f < joke ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 420, display: 'flex', justifyContent: 'center', transform: `scale(${2 - slam(f, wf(108) - 1)}) rotate(-6deg)`}}>
					<div style={{padding: '8px 34px', border: `8px solid ${C.terracotta}`, borderRadius: 14, fontFamily: FONT.display, fontWeight: 900, fontSize: 90, color: C.terracotta, background: 'rgba(251,248,241,0.85)'}}>استنساخ</div>
				</div>
			) : null}
			{mz > 0 && f < split ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 360, display: 'flex', justifyContent: 'center', transform: `scale(${2.2 - 1.2 * mz}) rotate(5deg)`}}>
					<HeroWord text="بمزح!" size={220} face={C.charcoal} back={C.yellowShade} strip={C.yellow} stripSeed={9} depth={9} />
				</div>
			) : null}
			{rightC > 0 ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 1135, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, wf(118))})`}}>
					<Badge text="لا يوجد أي دليل علمي على إمكانية نقل الوعي" size={24} />
				</div>
			) : null}
			<TitleCard frame={f} at={a + 1} out={joke - 4} text="يعني… استنساخ؟" />
			<TitleCard frame={f} at={wf(111) - 1} out={split - 4} text="مش بهاي البساطة" seed={22} />
			<TitleCard frame={f} at={split} text="نسخ ≠ نقل" seed={25} />
		</AbsoluteFill>
	);
};
