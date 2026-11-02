// Scene D — the full production chain of one car, as ONE continuous paper world the camera travels through:
// design (AI) → mine (extraction) → furnace (smelting) → press (parts) → assembly → autonomous delivery to the door.
// V2: «بدك سيارة؟» no longer opens on an empty blueprint while the car scales up from nothing. The car is already
// driving into frame on the cut, brakes at centre on the V1 pop cue (f278) and the «؟» pops above it.
// From ~f306 every value equals V1.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, rand} from '../../../brand/anim';
import {Camera} from '../../../brand/diagram';
import {FootagePrint, PhotoPrint} from '../../../brand/media';
import {Car, Chip, Conveyor, CutText, Excavator, Furnace, G, Gear, House, Ore, Press, RobotArm, Sparks, SvgDefs, Truck, armTip} from '../../../brand/props';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../../no-money/ep';

const CW = 5400;
const CH = 3840;

// station activation frames (word-anchored)
const STEP_AT = [wf(25), wf(28), wf(33), wf(34), wf(36), wf(38)];
const STEPS = ['تصميم', 'استخراج', 'صهر', 'تصنيع', 'تجميع', 'توصيل'];

const camKeys = () => {
	const fr = [S.D[0], wf(25), wf(28) - 8, wf(28) + 4, wf(33) - 9, wf(33) + 2, wf(34) - 8, wf(34) + 2, wf(36) - 8, wf(36) + 2, wf(38) - 7, wf(38) + 3, wf(43) + 6, S.D[1]];
	const x = [0, 0, 0, 0, 0, 1080, 1080, 2160, 2160, 2160, 2160, 3240, 4290, 4290];
	const y = [0, 0, 0, 1920, 1920, 1920, 1920, 1920, 1920, 0, 0, 0, 0, 0];
	return {fr, x, y};
};

const Stepper: React.FC<{f: number}> = ({f}) => {
	const appear = pop(f, STEP_AT[0] - 3);
	let active = -1;
	STEP_AT.forEach((a, i) => {
		if (f >= a) active = i;
	});
	return (
		<div dir="rtl" style={{position: 'absolute', left: 40, right: 40, top: 128, display: 'flex', justifyContent: 'center', gap: 10, transform: `translateY(${(1 - appear) * -300}px)`}}>
			{STEPS.map((s, i) => {
				const on = i === active;
				const done = i < active;
				const p = on ? pop(f, STEP_AT[i]) : 1;
				return (
					<div
						key={s}
						style={{
							position: 'relative',
							width: on ? 190 : 140,
							height: on ? 128 : 104,
							marginTop: on ? 0 : 12,
							background: on ? C.yellow : done ? C.paperWhite : 'rgba(244,236,221,0.55)',
							borderRadius: 8,
							filter: SHADOW.contact,
							transform: `rotate(${(rand(i * 7) - 0.5) * 5}deg) scale(${on ? 0.85 + 0.15 * p : 1})`,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div style={{fontFamily: FONT.display, fontWeight: 900, fontSize: on ? 30 : 24, color: C.charcoal, opacity: on || done ? 1 : 0.55}}>{['١', '٢', '٣', '٤', '٥', '٦'][i]}</div>
						<div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: on ? 34 : 26, color: C.charcoal, opacity: on || done ? 1 : 0.55, lineHeight: 1.2}}>{s}</div>
						{done ? <div style={{position: 'absolute', top: -12, left: -10, width: 34, height: 34, borderRadius: 17, background: C.teal, color: C.paperWhite, fontSize: 24, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.display}}>✓</div> : null}
					</div>
				);
			})}
		</div>
	);
};

export const CarJourneySceneV2: React.FC<{f: number}> = ({f}) => {
	const k = camKeys();
	const camX = kf(f, k.fr, k.x, EASE.io);
	const camY = kf(f, k.fr, k.y, EASE.io);
	// scale: push-in on the question, then small "dip" in the middle of each pan
	let dip = 0;
	for (let i = 2; i < k.fr.length - 2; i += 2) {
		const a = k.fr[i];
		const b = k.fr[i + 1];
		if (f > a && f < b && (k.x[i] !== k.x[i + 1] || k.y[i] !== k.y[i + 1])) dip = Math.sin(((f - a) / (b - a)) * Math.PI) * 0.07;
	}
	const scale = kf(f, [S.D[0], wf(25)], [1.16, 1.0], EASE.out) - dip;

	// --- station 1: design ---
	const drive = kf(f, [S.D[0], S.D[0] + 6], [-430, 0], EASE.out5);
	const brake = f >= S.D[0] + 4 ? Math.exp(-(f - S.D[0] - 4) / 4) * Math.sin((f - S.D[0] - 4) * 0.8) : 0;
	const speedLines = 1 - prog(f, S.D[0] + 3, S.D[0] + 9);
	const q = pop(f, S.D[0] + 4) * (1 - prog(f, wf(25) - 4, wf(25) + 2));
	const draw = prog(f, wf(25), wf(27) + 4, EASE.io);
	const fillOut = prog(f, wf(25), wf(25) + 10);
	const panel = pop(f, wf(25) + 2);
	const tries = Math.floor(kf(f, [wf(25) + 2, wf(27)], [0, 12480], EASE.out));
	// --- station 2: mine ---
	const dig = (f - wf(28)) / 6;
	// --- station 3: furnace ---
	const glow = prog(f, wf(33) - 6, wf(33) + 4);
	const pour = prog(f, wf(33) + 2, wf(33) + 10);
	const mold = prog(f, wf(33) + 6, wf(34) - 4);
	// --- station 4: press ---
	const stamp = (at: number) => (f >= at && f < at + 7 ? Math.sin(((f - at) / 7) * Math.PI) : 0);
	const ram = Math.max(stamp(wf(34)), stamp(wf(34) + 8), stamp(wf(34) + 16));
	const part = (i: number) => pop(f, wf(34) + 3 + i * 8, {damping: 13});
	const lift = prog(f, wf(36) - 8, wf(36) + 2, EASE.io);
	// --- station 5: assembly ---
	const body = pop(f, wf(36) + 1, {damping: 14});
	const wheels = pop(f, wf(36) + 9);
	const done = pop(f, wf(37));
	const weld = f >= wf(36) && f < wf(37) + 8;
	// --- station 6: delivery ---
	const tx = kf(f, [wf(38) - 6, wf(43) + 2], [3300, 4300], EASE.io);
	const door = prog(f, wf(43) - 2, wf(43) + 8, EASE.out);

	const a1 = Math.sin(f / 4) * 12;
	const leftTip = armTip(-35 + a1, 95, 40);
	const rightTip = armTip(35 - a1, -95, -40);

	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Camera scale={scale}>
				<div style={{position: 'absolute', left: -camX, top: -camY, width: CW, height: CH}}>
					<svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{position: 'absolute', left: 0, top: 0}}>
						<SvgDefs />
						<defs>
							<pattern id="bp" width="60" height="60" patternUnits="userSpaceOnUse">
								<path d="M60,0 L0,0 L0,60" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
							</pattern>
						</defs>
						{/* ================= 1 DESIGN ================= */}
						<rect x={0} y={0} width={1080} height={1920} fill={C.navy} />
						<rect x={0} y={0} width={1080} height={1920} fill="url(#bp)" />
						{/* V2: speed strips behind the arriving car */}
						{speedLines > 0
							? [0, 1, 2].map((k) => (
									<rect key={k} x={540 + drive - 330 - 260 - k * 70} y={1150 - 230 + k * 70} width={240 + k * 40} height={16} rx={8} fill={C.paperWhite} opacity={0.75 * speedLines} />
								))
							: null}
						<G x={540 + drive} y={1150} s={1.75} r={brake * 3.5}>
							<g opacity={1 - fillOut}>
								<Car w={360} wheelRot={((drive / 1.75) / 38) * 57.3} />
							</g>
							<g opacity={fillOut}>
								<path
									d="M-175,-40 Q-180,-80 -150,-88 L-95,-96 Q-60,-150 10,-152 Q80,-150 110,-100 L160,-90 Q182,-84 180,-50 L178,-40 Z"
									fill="none"
									stroke={C.paperWhite}
									strokeWidth={3}
									strokeDasharray="1200"
									strokeDashoffset={1200 * (1 - draw)}
								/>
								<circle cx={-105} cy={-38} r={38} fill="none" stroke={C.yellow} strokeWidth={3} strokeDasharray="240" strokeDashoffset={240 * (1 - draw)} />
								<circle cx={108} cy={-38} r={38} fill="none" stroke={C.yellow} strokeWidth={3} strokeDasharray="240" strokeDashoffset={240 * (1 - draw)} />
								<g opacity={prog(f, wf(26), wf(27))} stroke={C.paperWhite} strokeWidth={1.5}>
									<line x1={-175} y1={30} x2={180} y2={30} />
									<line x1={-175} y1={22} x2={-175} y2={38} />
									<line x1={180} y1={22} x2={180} y2={38} />
									<line x1={210} y1={-152} x2={210} y2={0} />
								</g>
							</g>
						</G>
						{q > 0 ? (
							<G x={540} y={800} s={q} r={(1 - q) * 30}>
								<CutText text="؟" size={300} color={C.yellow} back={C.charcoal} />
							</G>
						) : null}

						{/* ================= 2 MINE ================= */}
						<rect x={0} y={1920} width={1080} height={1000} fill="#B9C7A6" />
						<rect x={0} y={2920} width={1080} height={920} fill={C.kraft} />
						<rect x={0} y={3150} width={1080} height={690} fill={C.kraftDark} />
						<rect x={0} y={3450} width={1080} height={390} fill="#5E4530" />
						<path d="M500,2920 L560,3040 L780,3060 L860,2920 Z" fill="#4A3424" />
						{Array.from({length: 22}).map((_, i) => (
							<G key={i} x={40 + rand(i * 3) * 1000} y={2990 + rand(i * 5 + 1) * 780} r={rand(i) * 90}>
								<Ore s={0.7 + rand(i * 9) * 0.6} seed={i} />
							</G>
						))}
						<G x={330} y={2925} s={0.9} f="sh">
							<Excavator boom={-18 + Math.sin(dig) * 14} stick={60 + Math.cos(dig) * 22} bucket={50 + Math.sin(dig + 1) * 30} />
						</G>
						<G x={600} y={3080}>
							<Conveyor len={780} frame={f} speed={7} />
						</G>
						{Array.from({length: 9}).map((_, i) => {
							const x = 610 + ((Math.max(0, f - wf(28) + 12) * 7 + i * 90) % 780);
							return f > wf(28) - 12 ? (
								<G key={i} x={x} y={3060} r={x}>
									<Ore s={0.9} seed={i + 40} />
								</G>
							) : null;
						})}

						{/* ================= 3 FURNACE ================= */}
						<rect x={1080} y={1920} width={1080} height={1920} fill="#2B2724" />
						<rect x={1080} y={3120} width={1080} height={720} fill={C.kraftDark} />
						<G x={1480} y={3122} s={0.8} f="sh">
							<Furnace glow={glow} pour={pour} />
						</G>
						<circle cx={1500} cy={2880} r={220} fill={C.fire} opacity={glow * 0.25} filter="url(#softglow)" />
						{/* mold → ingot */}
						<rect x={1640} y={3060} width={150} height={60} rx={6} fill={C.charcoal} />
						<rect x={1648} y={3112 - 48 * mold} width={134} height={48 * mold} rx={4} fill={mold < 0.99 ? C.fireHot : C.steel} filter={mold < 0.99 ? 'url(#glow)' : undefined} />
						<G x={1780} y={3122}>
							<Conveyor len={680} frame={f} speed={7} />
						</G>

						{/* ================= 4 PRESS ================= */}
						<rect x={2160} y={1920} width={1080} height={1920} fill={C.tealDark} />
						<rect x={2160} y={3120} width={1080} height={720} fill={C.kraft} />
						<G x={2540} y={3122} s={1.25} f="sh">
							<Press ram={ram} />
						</G>
						{/* parts produced (door panel, wheel, gear) then lifted to assembly */}
						<g transform={`translate(0 ${-lift * 1500})`}>
							{part(0) > 0 ? (
								<G x={2560 + part(0) * 380} y={2700 - part(0) * 120} r={-8} s={part(0)} f="sh">
									<path d="M-90,-70 L80,-70 Q100,-70 100,-50 L100,70 L-90,70 Z" fill={C.terracotta} stroke="rgba(30,20,10,0.22)" strokeWidth={2} />
									<rect x={40} y={-10} width={40} height={10} rx={5} fill={C.charcoal} />
								</G>
							) : null}
							{part(1) > 0 ? (
								<G x={2560 + part(1) * 420} y={2900 - part(1) * 80} s={part(1)} r={f * 4} f="sh">
									<circle r={70} fill={C.charcoal} />
									<circle r={30} fill={C.steel} />
								</G>
							) : null}
							{part(2) > 0 ? (
								<G x={2560 + part(2) * 280} y={2520 - part(2) * 60} s={part(2)} f="sh">
									<Gear r={64} teeth={11} rot={f * 3} />
								</G>
							) : null}
						</g>

						{/* ================= 5 ASSEMBLY ================= */}
						<rect x={2160} y={0} width={1080} height={1920} fill={C.steel} />
						<rect x={2160} y={1180} width={1080} height={740} fill={C.charcoalSoft} />
						<rect x={2160} y={1180} width={1080} height={12} fill={C.yellow} />
						<G x={2340} y={1182} f="sh">
							<RobotArm a1={-35 + a1} a2={95} a3={40} tool="welder" />
						</G>
						<G x={3060} y={1182} f="sh">
							<RobotArm a1={35 - a1} a2={-95} a3={-40} tool="welder" />
						</G>
						{weld ? (
							<>
								<G x={2340 + leftTip.x} y={1182 + leftTip.y}>
									<Sparks frame={f} seed={1} />
								</G>
								<G x={3060 + rightTip.x} y={1182 + rightTip.y}>
									<Sparks frame={f} seed={2} />
								</G>
							</>
						) : null}
						<G x={2700} y={1182 + (1 - body) * 500} s={1.35} f="sh">
							<Car w={360} wheels={wheels} wheelRot={f * 2} />
						</G>
						{done > 0 ? (
							<G x={2700} y={880} s={done} r={(1 - done) * -40}>
								<circle r={56} fill={C.teal} filter="url(#sh)" />
								<path d="M-24,0 L-6,20 L28,-20" stroke={C.paperWhite} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
							</G>
						) : null}

						{/* ================= 6 DELIVERY ================= */}
						<rect x={3240} y={0} width={2160} height={1920} fill={C.paper} />
						{Array.from({length: 14}).map((_, i) => (
							<rect key={i} x={3260 + i * 160} y={1150 - 140 - rand(i * 4) * 220} width={120 + rand(i) * 40} height={400} fill={C.paperShade} stroke="rgba(30,20,10,0.12)" strokeWidth={2} />
						))}
						<path d="M3240,1150 Q3800,1060 4400,1120 Q5000,1180 5400,1100 L5400,1150 Z" fill={C.sage} />
						<rect x={3240} y={1150} width={2160} height={110} fill={C.charcoalSoft} />
						<line x1={3240} y1={1205} x2={5400} y2={1205} stroke={C.yellow} strokeWidth={6} strokeDasharray="40 36" />
						<rect x={3240} y={1260} width={2160} height={660} fill={C.sageDark} />
						{/* fill below the delivery row so camera dips never reveal the empty canvas */}
						<rect x={3240} y={1920} width={2160} height={1920} fill={C.sageDark} />
						<rect x={-400} y={-400} width={CW + 800} height={400} fill={C.navy} />
						<G x={4985} y={1152} s={1.1} f="sh">
							<House w={320} h={240} door={door} lit={door} />
						</G>
						<G x={tx} y={1236} s={1.0} f="sh">
							<Truck wheelRot={f * 10} ping={(f / 16) % 1} cargo={<Car w={340} wheelRot={0} />} />
						</G>
					</svg>

					{/* ---------- HTML layers in canvas coordinates ---------- */}
					{/* 1: AI design panel */}
					{panel > 0 ? (
						<div style={{position: 'absolute', left: 120, top: 360, width: 840, height: 290, transform: `scale(${panel}) rotate(-1.5deg)`, filter: SHADOW.lifted}}>
							<div style={{position: 'absolute', inset: 0, background: C.paperWhite, borderRadius: 10}} />
							<div dir="rtl" style={{position: 'absolute', right: 34, top: 22, fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: C.charcoal}}>
								الذكاء الاصطناعي بيصمّم
							</div>
							{[0, 1, 2].map((i) => {
								const v = 0.5 + 0.42 * Math.sin(f / (5 + i) + i * 2);
								return (
									<div key={i} style={{position: 'absolute', right: 34, top: 104 + i * 46, width: 540, height: 14, background: C.paperShade, borderRadius: 7}}>
										<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${v * 100}%`, background: i === 1 ? C.yellow : C.navyLight, borderRadius: 7}} />
										<div style={{position: 'absolute', right: `calc(${v * 100}% - 14px)`, top: -8, width: 28, height: 28, borderRadius: 14, background: C.charcoal}} />
									</div>
								);
							})}
							<div style={{position: 'absolute', left: 32, top: 92, width: 190, textAlign: 'center'}}>
								<svg width={150} height={150} viewBox="-110 -110 220 220">
									<Chip glow={0.6 + 0.4 * Math.sin(f / 3)} />
								</svg>
							</div>
							<div dir="rtl" style={{position: 'absolute', right: 34, bottom: 18, fontFamily: FONT.label, fontWeight: 700, fontSize: 26, color: C.charcoalSoft}}>
								تصاميم مجرَّبة: <span style={{fontFamily: FONT.display, fontWeight: 900, color: C.charcoal}} dir="ltr">{tries.toLocaleString('en-US')}</span>
							</div>
						</div>
					) : null}
					{/* 2: real open-pit iron-ore mine */}
					<PhotoPrint
						src="episodes/no-money/media/p_mine_lamco.jpg"
						x={100}
						y={1920 + 330}
						w={880}
						h={520}
						rot={-2}
						frame={f}
						at={wf(28) - 4}
						seed={21}
						kb={{from: 1.05, to: 1.15, x0: 0, x1: -2}}
						kbDur={60}
						credit={{kind: 'صورة حقيقية · منجم حديد مكشوف', text: 'Fred van der Kraaij · CC BY-SA 4.0'}}
					/>
					{/* 3: real molten iron footage */}
					<FootagePrint
						src="episodes/no-money/media/v_furnace.mp4"
						x={1080 + 120}
						y={1920 + 300}
						w={840}
						h={430}
						rot={1.5}
						frame={f}
						at={wf(33) - 7}
						seed={31}
						trim={0.5}
						credit={{kind: 'لقطات حقيقية · فرن صهر', text: 'Vyacheslav Bukharov · CC BY-SA 4.0'}}
					/>
					{/* 4: real industrial robot handling parts */}
					<FootagePrint
						src="episodes/no-money/media/v_staubli.mp4"
						x={2160 + 150}
						y={1920 + 300}
						w={780}
						h={400}
						rot={-1.5}
						frame={f}
						at={wf(34) - 7}
						seed={41}
						trim={1}
						credit={{kind: 'لقطات حقيقية · روبوت صناعي', text: 'no_kids_for_dads · CC BY 3.0'}}
					/>
					{/* 5: real robotic body shop */}
					<PhotoPrint
						src="episodes/no-money/media/p_bmw_bodyshop.jpg"
						x={2160 + 100}
						y={320}
						w={880}
						h={480}
						rot={1.5}
						frame={f}
						at={wf(36) - 6}
						seed={51}
						kb={{from: 1.04, to: 1.14, x0: 2, x1: -2}}
						kbDur={45}
						credit={{kind: 'صورة حقيقية · خط تجميع آلي', text: 'BMW Werk Leipzig · CC BY-SA 2.0 DE'}}
					/>
					{/* 6: real car carrier (today: human-driven) */}
					<PhotoPrint
						src="episodes/no-money/media/p_car_carrier.jpg"
						x={3240 + 110}
						y={330}
						w={760}
						h={520}
						rot={-2.5}
						frame={f}
						at={wf(38) - 2}
						seed={61}
						kb={{from: 1.05, to: 1.12}}
						kbDur={60}
						credit={{kind: 'صورة حقيقية · اليوم بسائق', text: 'Syced · CC0'}}
					/>
					{f >= wf(39) - 2 ? (
						<div style={{position: 'absolute', left: tx + 330, top: 905, transform: `scale(${pop(f, wf(39) - 2)}) rotate(-3deg)`}}>
							<Label text="ذاتية القيادة · تصوّر مستقبلي" size={30} bg={C.yellow} />
						</div>
					) : null}
				</div>
			</Camera>
			<TitleCard frame={f} at={S.D[0] + 1} out={wf(25) - 6} text="بدك سيارة؟" />
			{f >= STEP_AT[0] - 4 ? <Stepper f={f} /> : null}
		</AbsoluteFill>
	);
};
