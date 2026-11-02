// «بتضرب قطرات قصدير بالليزر … على رقائق السيليكون» — simplified, physically faithful EUV schematic.
// Order shown: tin droplets → CO₂ laser pulses (pre-pulse + main pulse) → plasma emits 13.5 nm EUV → collector mirror →
// multilayer mirrors in vacuum → reflective reticle (pattern) → projection mirrors → photoresist on a silicon wafer.
// The light changes the photoresist; it does not carve finished circuits (shown in the cross-section card).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, Label, TitleCard} from '../../../brand/type';
import {PixelRow, TechTag} from '../kit';
import {wf} from '../ep';

const EUV = '#A99BFF'; // diagram convention for EUV light (invisible in reality)
const EUV_HOT = '#E9E4FF';
const LASER = C.yellow;

type P = [number, number];
const P0: P = [540, 430]; // plasma point (collector focus)
const DISH_L: P = [290, 250];
const DISH_R: P = [790, 250];
const IF: P = [540, 880]; // intermediate focus
const M1: P = [230, 1060];
const M2: P = [850, 1240];
const RET: P = [230, 1420];
const PO1: P = [850, 1600];
const PO2: P = [230, 1780];
const WAF: P = [540, 2130];
const PATH: P[] = [IF, M1, M2, RET, PO1, PO2, WAF];

// stage on screen: y 320..1300
const STAGE_CY = 815;

const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const nrm = (v: P): P => {
	const l = Math.hypot(v[0], v[1]);
	return [v[0] / l, v[1] / l];
};
const lerpP = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Mirror at bounce point b (from a to c): plate perpendicular to the bisector normal. */
const Mirror: React.FC<{a: P; b: P; c: P; len?: number; reticle?: boolean; o: number}> = ({a, b, c, len = 250, reticle, o}) => {
	const din = nrm(sub(b, a));
	const dout = nrm(sub(c, b));
	const n = nrm(sub(dout, din)); // surface normal (points to the reflecting side)
	const ang = (Math.atan2(n[1], n[0]) * 180) / Math.PI + 90;
	const th = 26;
	return (
		<g transform={`translate(${b[0] - n[0] * (th / 2)}, ${b[1] - n[1] * (th / 2)}) rotate(${ang})`} opacity={o}>
			<rect x={-len / 2 + 6} y={-th / 2 + 8} width={len} height={th} rx={5} fill="rgba(0,0,0,0.35)" />
			<rect x={-len / 2} y={-th / 2} width={len} height={th} rx={5} fill={reticle ? C.charcoal : C.steelDark} />
			<rect x={-len / 2} y={-th / 2} width={len} height={8} rx={3} fill={reticle ? C.yellow : C.paperWhite} />
			{reticle
				? Array.from({length: 14}).map((_, i) => <rect key={i} x={-len / 2 + 12 + i * 16.5} y={-th / 2 + 1} width={i % 3 === 0 ? 10 : 6} height={6} fill={C.charcoal} />)
				: null}
		</g>
	);
};

export const EuvProcessScene: React.FC<{f: number; a: number; b: number}> = ({f, a, b}) => {
	if (f < a || f > b) return null;
	// ---- camera (virtual canvas → screen) ----
	const K = [a, wf(52), wf(54) - 4, wf(59), wf(65) + 2, wf(67) + 6, wf(69) + 2, wf(70) + 14, wf(72) + 4, wf(74)];
	const CY = [1120, 1120, 450, 470, 600, 1150, 1180, 1660, 1700, 2120];
	const SC = [0.43, 0.43, 1.0, 1.0, 0.86, 0.8, 0.8, 0.78, 0.8, 1.55];
	const camY = kf(f, K, CY, EASE.io);
	const s = kf(f, K, SC, EASE.io);
	const toS = (p: P): P => [540 + (p[0] - 540) * s, STAGE_CY + (p[1] - camY) * s];

	// ---- timeline ----
	const tDrops = wf(52);
	const tLaser = wf(54);
	const tCount = wf(55);
	const tLight = wf(59);
	const tMirror = wf(65);
	const tPrint = wf(69);
	const tWafer = wf(73);

	const blue = prog(f, a, a + 22, EASE.out); // blueprint draw-in
	// droplets + pulses
	const period = f < tLight ? 7 : 5;
	const speed = 16;
	const drops: React.ReactNode[] = [];
	let plasma = 0;
	let laserMain = 0;
	let laserPre = 0;
	for (let k = 0; k < 60; k++) {
		const spawn = tDrops - 26 + k * period;
		if (spawn > f) break;
		const x = 110 + (f - spawn) * speed;
		const arrive = spawn + Math.round((P0[0] - 110) / speed);
		const hitOn = arrive >= tLaser;
		if (hitOn && f >= arrive) {
			// pre-pulse flattens the droplet, main pulse turns it into plasma
			const d = f - arrive;
			if (d <= 1) laserPre = Math.max(laserPre, 1);
			if (d >= 2 && d <= 3) laserMain = Math.max(laserMain, 1);
			if (d <= 2) drops.push(<ellipse key={k} cx={P0[0]} cy={P0[1]} rx={9 + d * 9} ry={Math.max(3, 9 - d * 3)} fill={C.steel} />);
			if (d >= 2) plasma = Math.max(plasma, Math.max(0, 1 - (d - 2) / 7));
			continue;
		}
		if (x > 980) continue;
		drops.push(<circle key={k} cx={x} cy={P0[1]} r={9} fill={C.steel} stroke={C.paperWhite} strokeWidth={2} />);
	}
	if (f >= tLight) plasma = Math.max(plasma, 0.55 + 0.25 * Math.sin(f * 1.7));

	const cone = prog(f, tLight + 8, tLight + 20);
	const conv = prog(f, tLight + 18, tLight + 36);
	// beam segments after the intermediate focus
	const segT = [tMirror + 4, tMirror + 16, tMirror + 28, tMirror + 42, tPrint + 4, tPrint + 16, tPrint + 28, tPrint + 42];
	const segs: React.ReactNode[] = [];
	for (let i = 0; i < PATH.length - 1; i++) {
		const p = prog(f, segT[i], segT[i + 1], EASE.io);
		if (p <= 0) continue;
		const A = PATH[i];
		const B = lerpP(A, PATH[i + 1], p);
		const patterned = i >= 3;
		segs.push(
			<g key={i}>
				<line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={EUV} strokeWidth={34} strokeLinecap="round" opacity={0.28} filter="url(#euvglow)" />
				<line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={EUV} strokeWidth={14} strokeLinecap="round" />
				<line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={EUV_HOT} strokeWidth={4} strokeLinecap="round" strokeDasharray={patterned ? '10 9' : undefined} strokeDashoffset={-f * 3} />
			</g>,
		);
	}
	const mirrorO = (i: number) => (f >= segT[i] - 8 ? Math.min(1, (f - segT[i] + 8) / 6) * 1 : 0.18 * blue);
	const exposed = prog(f, tPrint + 40, tWafer, EASE.out);

	// HTML labels follow the camera
	const LabelAt: React.FC<{p: P; at: number; text: string; dx?: number; dy?: number; dark?: boolean; until?: number}> = ({p, at, text, dx = 0, dy = 0, dark, until}) => {
		if (f < at || (until !== undefined && f > until)) return null;
		const q = toS(p);
		const k = pop(f, at, {damping: 12, stiffness: 260, mass: 0.6});
		return (
			<div style={{position: 'absolute', left: q[0] + dx, top: q[1] + dy, transform: `translate(-50%,-50%) scale(${k})`}}>
				<Label text={text} size={30} bg={dark ? C.charcoal : C.paperWhite} fg={dark ? C.paper : C.charcoal} seed={Math.round(p[1])} />
			</div>
		);
	};

	const step = f < tLight ? 0 : f < tMirror ? 1 : f < tPrint ? 2 : 3;
	const steps = ['١ · قصدير + ليزر', '٢ · ضوء EUV', '٣ · مرايا داخل فراغ', '٤ · النمط على الرقاقة'];
	const stepAt = [a + 2, tLight, tMirror, tPrint];

	// counter
	const cnt = Math.round(kf(f, [tCount, tCount + 26], [0, 50000], EASE.out) / 500) * 500;
	const cntO = f >= tCount && f < tLight + 6 ? Math.min(1, (f - tCount) / 5) * (1 - prog(f, tLight, tLight + 6)) : 0;

	// wafer cross-section card
	const xs = pop(f, tWafer - 22, {damping: 13, stiffness: 190, mass: 0.8});

	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			{/* blueprint grid */}
			<AbsoluteFill
				style={{
					backgroundImage:
						'linear-gradient(rgba(154,165,174,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(154,165,174,0.08) 1px, transparent 1px)',
					backgroundSize: `${60 * s}px ${60 * s}px`,
					backgroundPosition: `${540 - 540 * s}px ${STAGE_CY - camY * s}px`,
				}}
			/>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(46,66,96,0.55) 0%, rgba(20,30,45,0) 70%)'}} />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<defs>
					<filter id="euvglow" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="10" />
					</filter>
					<radialGradient id="plasma">
						<stop offset="0%" stopColor="#FFFFFF" />
						<stop offset="35%" stopColor={EUV_HOT} />
						<stop offset="70%" stopColor={EUV} stopOpacity={0.55} />
						<stop offset="100%" stopColor={EUV} stopOpacity={0} />
					</radialGradient>
					<linearGradient id="waf" x1="0" x2="1" y1="0" y2="1">
						<stop offset="0%" stopColor="#5d6871" />
						<stop offset="45%" stopColor="#c9d1d8" />
						<stop offset="55%" stopColor="#8d98a3" />
						<stop offset="100%" stopColor="#3a4450" />
					</linearGradient>
				</defs>
				<g transform={`translate(540, ${STAGE_CY}) scale(${s}) translate(-540, ${-camY})`}>
					{/* vacuum chamber outline */}
					<rect x={70} y={60} width={940} height={2230} rx={60} fill="none" stroke={C.steel} strokeOpacity={0.35 * blue} strokeWidth={4} strokeDasharray="22 16" />
					{/* light path preview (blueprint) */}
					<polyline points={PATH.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.steel} strokeOpacity={0.22 * blue} strokeWidth={3} strokeDasharray="8 10" />
					{/* droplet generator + catcher */}
					<rect x={40} y={P0[1] - 34} width={80} height={68} rx={10} fill={C.steelDark} stroke={C.paperWhite} strokeOpacity={0.6} strokeWidth={3} opacity={0.4 + 0.6 * blue} />
					<rect x={975} y={P0[1] - 40} width={60} height={80} rx={10} fill={C.charcoalSoft} opacity={0.4 + 0.6 * blue} />
					{/* laser beams through the collector's central hole */}
					{laserPre ? <line x1={540} y1={-220} x2={P0[0]} y2={P0[1]} stroke={LASER} strokeWidth={6} opacity={0.75} /> : null}
					{laserMain ? (
						<>
							<line x1={540} y1={-220} x2={P0[0]} y2={P0[1]} stroke={LASER} strokeWidth={40} opacity={0.35} filter="url(#euvglow)" />
							<line x1={540} y1={-220} x2={P0[0]} y2={P0[1]} stroke={LASER} strokeWidth={16} />
						</>
					) : null}
					{/* EUV cone: plasma → collector → intermediate focus */}
					{cone > 0 ? <polygon points={`${P0.join(',')} ${DISH_L.join(',')} ${DISH_R.join(',')}`} fill={EUV} opacity={0.22 * cone} /> : null}
					{conv > 0 ? (
						<polygon points={`${DISH_L.join(',')} ${DISH_R.join(',')} ${lerpP(DISH_R, IF, conv).join(',')} ${lerpP(DISH_L, IF, conv).join(',')}`} fill={EUV} opacity={0.3} />
					) : null}
					{/* collector mirror (concave dish, focus at the plasma) */}
					<path d={`M ${DISH_L[0]} ${DISH_L[1]} Q 540 70 ${DISH_R[0]} ${DISH_R[1]}`} fill="none" stroke={C.steelDark} strokeWidth={30} strokeLinecap="round" opacity={0.35 + 0.65 * blue} />
					<path d={`M ${DISH_L[0]} ${DISH_L[1] + 10} Q 540 84 ${DISH_R[0]} ${DISH_R[1] + 10}`} fill="none" stroke={C.paperWhite} strokeWidth={7} strokeLinecap="round" opacity={0.35 + 0.65 * blue} />
					<rect x={522} y={130} width={36} height={40} fill={C.navyDeep} />
					{drops}
					{plasma > 0 ? <circle cx={P0[0]} cy={P0[1]} r={40 + 60 * plasma} fill="url(#plasma)" opacity={plasma} /> : null}
					{/* intermediate focus marker */}
					<circle cx={IF[0]} cy={IF[1]} r={10} fill="none" stroke={C.paperWhite} strokeOpacity={0.5 * blue} strokeWidth={3} />
					{segs}
					{/* mirrors + reticle */}
					<Mirror a={IF} b={M1} c={M2} o={mirrorO(0)} />
					<Mirror a={M1} b={M2} c={RET} o={mirrorO(1)} />
					<Mirror a={M2} b={RET} c={PO1} reticle o={mirrorO(2)} />
					<Mirror a={RET} b={PO1} c={PO2} o={mirrorO(3)} />
					<Mirror a={PO1} b={PO2} c={WAF} o={mirrorO(4)} />
					{/* wafer (perspective disc) with die grid; exposed field glows */}
					<g opacity={0.25 + 0.75 * prog(f, tPrint, tPrint + 20)}>
						<ellipse cx={540} cy={2160} rx={340} ry={100} fill="#20262e" />
						<ellipse cx={540} cy={2148} rx={340} ry={100} fill="url(#waf)" />
						{Array.from({length: 9}).map((_, i) => (
							<line key={`v${i}`} x1={540 + (i - 4) * 68} y1={2066} x2={540 + (i - 4) * 68} y2={2230} stroke="rgba(20,30,45,0.35)" strokeWidth={2} />
						))}
						{Array.from({length: 5}).map((_, i) => (
							<line key={`h${i}`} x1={220} y1={2088 + i * 30} x2={860} y2={2088 + i * 30} stroke="rgba(20,30,45,0.35)" strokeWidth={2} />
						))}
						<ellipse cx={540} cy={2148} rx={340} ry={100} fill="none" stroke={C.paperWhite} strokeOpacity={0.5} strokeWidth={3} />
						{exposed > 0 ? (
							<g opacity={exposed}>
								<rect x={500} y={2124} width={80} height={44} fill={EUV} opacity={0.75} />
								{Array.from({length: 6}).map((_, i) => (
									<rect key={i} x={506 + i * 12} y={2128} width={6} height={36} fill={EUV_HOT} />
								))}
							</g>
						) : null}
					</g>
				</g>
			</svg>

			{/* labels */}
			<LabelAt p={[150, 340]} at={tDrops} text="قطرات قصدير" until={tLight + 30} />
			<LabelAt p={[700, 20]} at={tLaser - 2} text="ليزر CO₂" dark until={tLight + 30} />
			<LabelAt p={[720, 520]} at={tLight + 4} text="بلازما" until={tMirror} />
			<LabelAt p={[540, 70]} at={tLight + 16} text="مرآة التجميع" dark until={tMirror} />
			<LabelAt p={[440, 1060]} at={segT[0] + 4} text="مرآة" until={tPrint + 6} />
			<LabelAt p={[640, 1240]} at={segT[1] + 4} text="مرآة" until={tPrint + 6} />
			<LabelAt p={[470, 1420]} at={segT[2] + 6} text="قناع النمط" dark until={tWafer} />
			<LabelAt p={[640, 1600]} at={segT[4] + 2} text="مرايا الإسقاط" until={tWafer - 8} />
			<LabelAt p={[540, 2290]} at={tPrint + 34} text="رقاقة سيليكون" dark />

			{f >= tLight + 10 && f < tMirror + 10 ? (
				<div style={{position: 'absolute', left: 540, top: toS([540, 690])[1], transform: `translate(-50%,-50%) scale(${pop(f, tLight + 10)})`}}>
					<TechTag text="EUV · 13.5 nm" size={36} />
				</div>
			) : null}
			{f >= tMirror + 6 ? (
				<div style={{position: 'absolute', left: 60, top: 1172, transform: `scale(${pop(f, tMirror + 6)})`, transformOrigin: 'left center'}}>
					<Label text="داخل فراغ · Vacuum" size={26} bg={C.navyLight} fg={C.paper} />
				</div>
			) : null}

			{/* counter: «عشرات آلاف المرات بالثانية» */}
			{cntO > 0 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1035, display: 'flex', justifyContent: 'center', opacity: cntO}}>
					<div dir="rtl" style={{display: 'flex', alignItems: 'baseline', gap: 16, background: 'rgba(20,30,45,0.9)', padding: '10px 28px 14px', borderRadius: 8, border: `3px solid ${C.yellow}`, filter: SHADOW.lifted}}>
						<span style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 64, color: C.yellow, direction: 'ltr'}}>≈{cnt.toLocaleString('en-US')}</span>
						<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 36, color: C.paper}}>نبضة بالثانية</span>
					</div>
				</div>
			) : null}

			{/* cross-section: light changes the photoresist (pattern), silicon underneath */}
			{f >= tWafer - 22 ? (
				<div style={{position: 'absolute', left: 90, top: 760, width: 900, transform: `scale(${0.6 + 0.4 * xs}) rotate(${(1 - xs) * 6 - 1.5}deg)`, opacity: Math.min(1, xs * 2), filter: SHADOW.lifted}}>
					<div style={{background: C.paperWhite, borderRadius: 8, padding: '22px 26px 20px'}}>
						<svg width={848} height={250}>
							{Array.from({length: 6}).map((_, i) => {
								const x = 90 + i * 128;
								const lp = prog(f, tWafer - 16 + i, tWafer - 4 + i);
								return <rect key={i} x={x} y={0} width={56} height={120 * lp} fill={EUV} opacity={0.55} />;
							})}
							<rect x={20} y={120} width={808} height={40} fill="#E9C46A" />
							{Array.from({length: 6}).map((_, i) => (
								<rect key={i} x={90 + i * 128} y={120} width={56} height={40} fill={EUV} opacity={prog(f, tWafer - 6, tWafer + 2)} />
							))}
							<rect x={20} y={160} width={808} height={80} fill="#5D6871" />
						</svg>
						<div dir="rtl" style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: FONT.display, fontWeight: 800, fontSize: 28, color: C.charcoal}}>
							<span>
								<span style={{background: '#E9C46A', padding: '0 8px'}}>طبقة حساسة للضوء</span> فوق <span style={{background: '#5D6871', color: C.paper, padding: '0 8px'}}>السيليكون</span>
							</span>
						</div>
						<div dir="rtl" style={{marginTop: 6, fontFamily: FONT.label, fontWeight: 700, fontSize: 24, color: C.charcoalSoft}}>
							الضوء بيطبع النمط على الطبقة · وبعدها خطوات حفر وترسيب
						</div>
					</div>
				</div>
			) : null}

			{/* step title + pixel progress */}
			{steps.map((t, i) =>
				step === i ? <TitleCard key={i} frame={f} at={stepAt[i]} text={t} size={48} seed={20 + i} /> : null,
			)}
			<div style={{position: 'absolute', left: 0, right: 0, top: 292, display: 'flex', justifyContent: 'center'}}>
				<PixelRow n={4} lit={step + 1} size={18} gap={8} />
			</div>
			<div style={{position: 'absolute', right: 40, top: 1250}}>
				<Badge text="تمثيل مبسّط · ليس بالمقياس" color={C.yellow} bg="rgba(20,30,45,0.92)" size={22} rot={-2} />
			</div>
		</AbsoluteFill>
	);
};
