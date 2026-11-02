// V3 · Shot 04 (frames 276–578) «بدك سيارة؟ … لباب بيتك»
// PRODUCTION MAP: one tall paper map; the camera travels DOWN a yellow production road through six stations.
// Each station opens a real photographic window with paper machinery in front, and ONE object travels the road,
// transforming: design file → ore → glowing ingot → steel panels → car → car on an autonomous truck.
// Locked cues: pop f278 · blip f303 · scribble f306–336 · whooshes f344/398/421/449/487 (pans) · rumble f352 ·
// fire f402 · clanks f429/437/445 · weld f457 · ding f470 · pings f497–561 · door f576.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog} from '../../../brand/anim';
import {Camera} from '../../../brand/diagram';
import {TEX} from '../../../brand/paper';
import {Car, Chip, CutText, Excavator, Furnace, G, House, Icon, Ingot, Ore, Press, RobotArm, Sparks, SvgDefs, Truck, armTip} from '../../../brand/props';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, Label} from '../../../brand/type';
import {S, wf} from '../../no-money/ep';
import {idle, M1, M3, StationTag, Win} from '../kit';

const PANEL = 1700;
const T = [0, PANEL, PANEL * 2, PANEL * 3, PANEL * 4, PANEL * 5]; // station panel tops (design, mine, smelt, parts, assembly, delivery)
const MAP_H = PANEL * 6 + 400;
const GROUND = 1150; // road level inside each panel
const ROAD_X = [760, 300, 760, 300, 760, 300]; // where the road crosses each station
const ARRIVE = [S.D[0], wf(28), wf(33), wf(34), wf(36), wf(38)];
const LEAVE = [wf(28) - 8, wf(33) - 9, wf(34) - 8, wf(36) - 8, wf(38) - 7];

// serpentine road: across each station's ground band, then down the map edge (never across a photo window)
const ROAD_Y = 150;
const roadD = () => {
	const L = 60;
	const R = 1020;
	const r = 90;
	let d = `M${L},${T[0] + GROUND + ROAD_Y}`;
	for (let i = 0; i < 6; i++) {
		const y = T[i] + GROUND + ROAD_Y;
		const toRight = i % 2 === 0;
		const xe = toRight ? R : L;
		const s = toRight ? 1 : -1;
		if (i === 5) {
			d += ` L${xe},${y}`;
			break;
		}
		const yn = T[i + 1] + GROUND + ROAD_Y;
		d += ` L${xe - s * r},${y} Q${xe},${y} ${xe},${y + r} L${xe},${yn - r} Q${xe},${yn} ${xe - s * r},${yn}`;
	}
	return d;
};

const camY = (f: number) => {
	const fr: number[] = [S.D[0]];
	const y: number[] = [0];
	for (let i = 0; i < 5; i++) {
		fr.push(LEAVE[i], ARRIVE[i + 1]);
		y.push(T[i], T[i + 1]);
	}
	fr.push(S.D[1]);
	y.push(T[5]);
	return kf(f, fr, y, EASE.io);
};

export const ProductionMapScene: React.FC<{f: number}> = ({f}) => {
	const cy = camY(f);
	let dip = 0;
	for (let i = 0; i < 5; i++) if (f > LEAVE[i] && f < ARRIVE[i + 1]) dip = Math.sin(((f - LEAVE[i]) / (ARRIVE[i + 1] - LEAVE[i])) * Math.PI) * 0.08;
	const scale = kf(f, [S.D[0], S.D[0] + 14], [1.12, 1.0], EASE.out) - dip;
	// station 1 — design
	const card = pop(f, S.D[0] - 5, {damping: 15});
	const q = pop(f, S.D[0] + 1) * (1 - prog(f, wf(25) - 4, wf(25) + 2));
	const ui = pop(f, wf(25));
	const draw = prog(f, wf(25) + 3, wf(27) + 8, EASE.io);
	const variant = f < wf(26) ? 0 : f < wf(27) ? 1 : 2;
	const chosen = pop(f, wf(27) + 10);
	// station 2 — mine
	const dig = f >= wf(28) ? Math.sin((f - wf(28)) / 5) : 0;
	const orePile = pop(f, wf(30) - 2);
	// station 3 — smelt
	const glow = prog(f, wf(33) - 6, wf(33) + 2);
	const pour = prog(f, wf(33) - 2, wf(33) + 8);
	const ingot = prog(f, wf(33) + 4, wf(34) - 8);
	// station 4 — parts
	const stamp = (at: number) => (f >= at && f < at + 7 ? Math.sin(((f - at) / 7) * Math.PI) : 0);
	const ram = Math.max(stamp(wf(34)), stamp(wf(34) + 8), stamp(wf(34) + 16));
	// station 5 — assembly
	const body = prog(f, wf(36), wf(37) - 2, EASE.io);
	const wheels = pop(f, wf(37) - 4);
	const done = pop(f, wf(37));
	const welding = f >= wf(36) && f < wf(38) - 8;
	const sw = idle(f, 8, 12);
	// station 6 — delivery
	const tx = kf(f, [wf(38) - 2, wf(43) - 4], [-760, 300], EASE.io);
	const ping = f >= wf(38) ? ((f - wf(38)) / 16) % 1 : 0;
	const door = prog(f, wf(43) + 1, wf(43) + 9, EASE.out);

	// travelling object: which form, and where (between stations it rides the road)
	const stage = f < LEAVE[0] ? 0 : f < LEAVE[1] ? 1 : f < LEAVE[2] ? 2 : f < LEAVE[3] ? 3 : f < LEAVE[4] ? 4 : 5;
	const travel = (() => {
		for (let i = 0; i < 5; i++) if (f >= LEAVE[i] && f <= ARRIVE[i + 1]) return {i, u: prog(f, LEAVE[i], ARRIVE[i + 1], EASE.io)};
		return null;
	})();
	const objX = (i: number) => ROAD_X[i] + (i % 2 ? 130 : -130);
	let ox = objX(Math.min(stage, 4));
	let oy = T[Math.min(stage, 4)] + GROUND - 40;
	if (travel) {
		const u = travel.u;
		const x0 = objX(travel.i);
		const x1 = objX(Math.min(4, travel.i + 1));
		ox = x0 + (x1 - x0) * u;
		oy = T[travel.i] + GROUND - 40 + PANEL * u;
	}
	const form = f < LEAVE[0] - 2 ? 'none' : f < wf(30) ? 'file' : f < wf(33) + 4 ? 'ore' : f < wf(34) + 4 ? 'ingot' : f < wf(36) + 2 ? 'plates' : 'none';
	const tipL = armTip(-30 + sw, 92, 40);
	const tipR = armTip(30 - sw, -92, -40);

	return (
		<AbsoluteFill style={{background: C.paper}}>
			<Camera scale={scale}>
				<div style={{position: 'absolute', left: 0, top: -cy, width: 1080, height: MAP_H}}>
					{/* map paper with grid + soft station zones */}
					<div style={{position: 'absolute', inset: 0, background: C.paper}} />
					<div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(38,35,33,0.06) 2px, transparent 2px), linear-gradient(90deg, rgba(38,35,33,0.06) 2px, transparent 2px)', backgroundSize: '60px 60px'}} />
					<div style={{position: 'absolute', inset: 0, backgroundImage: `url(${TEX.fibers()})`, backgroundSize: '512px', opacity: 0.5}} />
					{T.map((t, i) => (
						<div key={i} style={{position: 'absolute', left: 0, right: 0, top: t + GROUND - 60, height: 300, background: C.kraft, opacity: 0.95}}>
							<div style={{position: 'absolute', inset: 0, backgroundImage: `url(${TEX.kraft()})`, backgroundSize: '512px', mixBlendMode: 'multiply', opacity: 0.8}} />
						</div>
					))}
					{/* the production road (yellow = productive capacity) */}
					<svg width={1080} height={MAP_H} viewBox={`0 0 1080 ${MAP_H}`} style={{position: 'absolute', left: 0, top: 0}}>
						<SvgDefs />
						<path d={roadD()} fill="none" stroke="rgba(20,14,8,0.25)" strokeWidth={70} transform="translate(0 8)" strokeLinecap="round" />
						<path d={roadD()} fill="none" stroke={C.charcoal} strokeWidth={64} strokeLinecap="round" />
						<path d={roadD()} fill="none" stroke={C.yellow} strokeWidth={10} strokeDasharray="34 30" strokeDashoffset={-f * 6} strokeLinecap="round" />
					</svg>

					{/* ===== 1 DESIGN ===== */}
					<div style={{position: 'absolute', left: 90, top: 300, width: 900, height: 700, transform: `translateY(${(1 - card) * -900}px) rotate(${(1 - card) * -6 - 1}deg)`, filter: SHADOW.lifted}}>
						<div style={{position: 'absolute', inset: 0, background: C.navy, borderRadius: 14}} />
						<div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.09) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.09) 2px, transparent 2px)', backgroundSize: '45px 45px', borderRadius: 14}} />
						<svg width={900} height={700} viewBox="0 0 900 700" style={{position: 'absolute', left: 0, top: 0}}>
							<SvgDefs />
							{q > 0.01 ? (
								<G x={450} y={330} s={q}>
									<CutText text="؟" size={300} color={C.yellow} back={C.charcoal} />
								</G>
							) : null}
							<G x={450} y={520} s={1.55}>
								<g opacity={1 - ui}>
									<Car w={360} />
								</g>
								<g opacity={ui}>
									<path d="M-175,-40 Q-180,-80 -150,-88 L-95,-96 Q-60,-150 10,-152 Q80,-150 110,-100 L160,-90 Q182,-84 180,-50 L178,-40 Z" fill="none" stroke={C.paperWhite} strokeWidth={3} strokeDasharray="1200" strokeDashoffset={1200 * (1 - draw)} />
									{[-105, 108].map((cx) => (
										<circle key={cx} cx={cx} cy={-38} r={38} fill="none" stroke={C.yellow} strokeWidth={3} strokeDasharray="240" strokeDashoffset={240 * (1 - draw)} />
									))}
									{variant >= 1 ? <path d="M-150,-88 Q-40,-170 120,-96" fill="none" stroke={C.yellow} strokeWidth={2} strokeDasharray="8 6" opacity={0.8} /> : null}
								</g>
							</G>
							{ui > 0 ? (
								<G x={790} y={110} s={0.45 * ui} f="sh">
									<Chip glow={prog(f, wf(25), wf(25) + 10)} />
								</G>
							) : null}
							{/* variant thumbnails */}
							{[0, 1, 2].map((k) => {
								const p = pop(f, wf(25) + 6 + k * 9);
								const sel = k === 2 && chosen > 0;
								return p > 0 ? (
									<G key={k} x={170 + k * 160} y={620} s={p}>
										<rect x={-66} y={-46} width={132} height={86} rx={8} fill={sel ? C.yellow : 'rgba(255,255,255,0.12)'} stroke={k === variant || sel ? C.yellow : 'rgba(255,255,255,0.3)'} strokeWidth={4} />
										<g transform="translate(0 22) scale(0.28)">
											<path d="M-175,-40 Q-180,-80 -150,-88 L-95,-96 Q-60,-150 10,-152 Q80,-150 110,-100 L160,-90 Q182,-84 180,-50 L178,-40 Z" fill={sel ? C.charcoal : 'none'} stroke={sel ? C.charcoal : C.paperWhite} strokeWidth={8} />
										</g>
										<text x={-54} y={-26} fontFamily={FONT.mono} fontWeight={800} fontSize={20} fill={sel ? C.charcoal : C.paperWhite}>{`v${k + 1}`}</text>
									</G>
								) : null;
							})}
						</svg>
						{ui > 0 ? (
							<div dir="rtl" style={{position: 'absolute', right: 34, top: 28, fontFamily: FONT.display, fontWeight: 800, fontSize: 34, color: C.paperWhite, opacity: ui}}>
								تصميم بالذكاء الاصطناعي
							</div>
						) : null}
					</div>
					<StationTag n="١" text="تصميم" f={f} at={wf(25)} x={60} y={170} />

					{/* ===== 2 MINE ===== */}
					<StationTag n="٢" text="استخراج" f={f} at={wf(28) - 10} x={60} y={T[1] + 170} />
					<Win src={M3('p_mine_brockman.jpg')} x={150} y={T[1] + 300} w={800} h={480} rot={1.5} f={f} at={wf(28) - 10} credit="Calistemon · CC BY-SA 4.0" kind="صورة حقيقية · معدّات منجم حديد" seed={21} enter="none" />
					<svg width={1080} height={PANEL} viewBox={`0 0 1080 ${PANEL}`} style={{position: 'absolute', left: 0, top: T[1]}}>
						<SvgDefs />
						<G x={760} y={GROUND - 40} s={0.95} f="sh">
							<Excavator boom={-25 + dig * 10} stick={50 + dig * 14} bucket={40 - dig * 30} />
						</G>
						{[0, 1, 2, 3, 4].map((k) => (
							<G key={k} x={980 - k * 46} y={GROUND + 40 + (k % 2) * 30}>
								<Ore s={1.4} seed={k + 2} />
							</G>
						))}
					</svg>
					<div style={{position: 'absolute', left: 640, top: T[1] + 820}}>
						<Label text="حفّارة روبوتية · تصوّر" size={28} bg={C.charcoal} fg={C.paper} rot={-2} />
					</div>

					{/* ===== 3 SMELT ===== */}
					<StationTag n="٣" text="صهر" f={f} at={wf(33) - 10} x={60} y={T[2] + 170} />
					<Win src={M1('v_furnace.mp4')} x={150} y={T[2] + 300} w={800} h={480} rot={-1.5} f={f} at={wf(33) - 10} credit="Vyacheslav Bukharov · CC BY-SA 4.0" kind="لقطات حقيقية · فرن صهر" seed={22} enter="none" />
					<svg width={1080} height={PANEL} viewBox={`0 0 1080 ${PANEL}`} style={{position: 'absolute', left: 0, top: T[2]}}>
						<SvgDefs />
						<G x={330} y={GROUND - 40} s={0.8} f="sh">
							<Furnace glow={glow} pour={pour} />
						</G>
						<rect x={470} y={GROUND - 70} width={150} height={40} rx={6} fill={C.charcoal} />
						<rect x={480} y={GROUND - 66} width={130 * pour} height={26} rx={6} fill={C.fireHot} filter="url(#glow)" />
					</svg>

					{/* ===== 4 PARTS ===== */}
					<StationTag n="٤" text="تصنيع القطع" f={f} at={wf(34) - 10} x={60} y={T[3] + 170} />
					<Win src={M3('n_rolling_mill.jpg')} x={150} y={T[3] + 300} w={800} h={480} rot={1.2} f={f} at={wf(34) - 10} credit="Erik Charlton · CC BY 2.0" kind="صورة حقيقية · درفلة فولاذ" seed={23} enter="none" />
					<svg width={1080} height={PANEL} viewBox={`0 0 1080 ${PANEL}`} style={{position: 'absolute', left: 0, top: T[3]}}>
						<SvgDefs />
						<G x={720} y={GROUND - 40} s={0.72} f="sh">
							<Press ram={ram} />
						</G>
						{[0, 1, 2].map((k) => {
							const p = pop(f, wf(34) + 4 + k * 8);
							return p > 0 ? (
								<G key={k} x={900 + (k - 1) * 0} y={GROUND - 70 - k * 30} s={p} f="shs">
									<rect x={-70} y={-12} width={140} height={24} rx={4} fill={C.steel} stroke="rgba(30,20,10,0.3)" strokeWidth={2} />
								</G>
							) : null;
						})}
					</svg>

					{/* ===== 5 ASSEMBLY ===== */}
					<StationTag n="٥" text="تجميع" f={f} at={wf(36) - 10} x={60} y={T[4] + 170} />
					<Win src={M3('n_kuka_line.jpg')} x={150} y={T[4] + 300} w={800} h={480} rot={-1.2} f={f} at={wf(36) - 10} credit="AKomkova · CC BY-SA 4.0" kind="صورة حقيقية · خط لحام روبوتي" seed={24} enter="none" />
					<svg width={1080} height={PANEL} viewBox={`0 0 1080 ${PANEL}`} style={{position: 'absolute', left: 0, top: T[4]}}>
						<SvgDefs />
						<G x={760} y={GROUND - 36} s={1.15}>
							<g filter="url(#sh)">
								<Car w={360} parts={0.25 + 0.75 * body} wheels={wheels} />
							</g>
						</G>
						<G x={500} y={GROUND - 30} s={0.8} f="sh">
							<RobotArm a1={-30 + sw} a2={92} a3={40} tool="welder" />
						</G>
						<G x={1020} y={GROUND - 30} s={0.8} f="sh">
							<RobotArm a1={30 - sw} a2={-92} a3={-40} tool="welder" />
						</G>
						{welding ? (
							<>
								<G x={500 + tipL.x * 0.8} y={GROUND - 30 + tipL.y * 0.8}>
									<Sparks frame={f} seed={3} size={0.8} />
								</G>
								<G x={1020 + tipR.x * 0.8} y={GROUND - 30 + tipR.y * 0.8}>
									<Sparks frame={f} seed={7} size={0.8} />
								</G>
							</>
						) : null}
						{done > 0 ? (
							<G x={760} y={GROUND - 330} s={done} f="sh">
								<circle r={44} fill={C.teal} />
								<path d="M-20,2 L-5,18 L22,-14" fill="none" stroke={C.paperWhite} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
							</G>
						) : null}
					</svg>

					{/* ===== 6 DELIVERY ===== */}
					<StationTag n="٦" text="توصيل" f={f} at={wf(38) - 10} x={60} y={T[5] + 170} />
					<Win src={M3('n_waymo.jpg')} x={150} y={T[5] + 300} w={800} h={480} rot={1} f={f} at={wf(38) - 10} credit="Grendelkhan · CC BY-SA 4.0" kind="صورة حقيقية · سيارة بلا سائق اليوم" seed={25} enter="none" objectPosition="center 60%" />
					<svg width={1080} height={PANEL} viewBox={`0 0 1080 ${PANEL}`} style={{position: 'absolute', left: 0, top: T[5]}}>
						<SvgDefs />
						<G x={790} y={GROUND - 20} s={0.9} f="sh">
							<House w={240} h={190} door={door} lit={door} />
						</G>
						<G x={tx} y={GROUND + 20} s={0.62} f="sh">
							<Truck wheelRot={tx * 0.8} ping={ping} cargo={<g transform="translate(0 -4) scale(0.75)"><Car w={360} color={C.terracotta} /></g>} />
						</G>
					</svg>
					<div style={{position: 'absolute', left: 120, top: T[5] + 860, transform: `scale(${pop(f, wf(39))})`, transformOrigin: 'left center'}}>
						<Badge text="شاحنة ذاتية القيادة · تصوّر مستقبلي" color={C.charcoal} bg="rgba(251,248,241,0.95)" size={26} rot={-2} />
					</div>

					{/* ===== travelling object ===== */}
					{form !== 'none' ? (
						<svg width={1080} height={MAP_H} viewBox={`0 0 1080 ${MAP_H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
							<SvgDefs />
							<G x={ox} y={oy} f="shl">
								{form === 'file' ? (
									<G s={pop(f, LEAVE[0] - 2)}>
										<rect x={-70} y={-90} width={140} height={180} rx={8} fill={C.paperWhite} stroke="rgba(30,20,10,0.25)" strokeWidth={2} />
										<rect x={-70} y={-90} width={140} height={34} rx={8} fill={C.yellow} />
										<g transform="translate(0 40) scale(0.32)">
											<Icon name="car" />
										</g>
									</G>
								) : null}
								{form === 'ore' ? (
									<G s={0.6 + 0.4 * orePile}>
										{[0, 1, 2, 3].map((k) => (
											<G key={k} x={(k - 1.5) * 40} y={k % 2 ? -26 : 0}>
												<Ore s={1.6} seed={k + 9} />
											</G>
										))}
									</G>
								) : null}
								{form === 'ingot' ? (
									<G s={1.3}>
										<Ingot color={ingot < 1 ? C.fireHot : C.steel} />
										{ingot < 1 ? <rect x={-60} y={-46} width={120} height={46} fill={C.fire} opacity={0.5 * (1 - ingot)} filter="url(#glow)" /> : null}
									</G>
								) : null}
								{form === 'plates' ? (
									<G>
										{[0, 1, 2].map((k) => (
											<rect key={k} x={-80 + k * 6} y={-20 - k * 22} width={160} height={20} rx={4} fill={C.steel} stroke="rgba(30,20,10,0.3)" strokeWidth={2} />
										))}
									</G>
								) : null}
							</G>
						</svg>
					) : null}
				</div>
			</Camera>
		</AbsoluteFill>
	);
};
