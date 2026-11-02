// 22.6 – 30.0 s · AI demand explodes (real data centres, AI racks, OpenAI's stated DRAM target) → fabs can't scale as fast.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, rand, shake, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, Label, TitleCard} from '../../../brand/type';
import {M, wf} from '../ep';
import {CR} from '../credits';
import {appear, G, LogoCard, Note, Ring, Shot, TechTag} from '../kit';

/** Field of memory-chip squares multiplying across the frame (demand escalating). */
const ChipField: React.FC<{f: number; a: number; b: number; o?: number}> = ({f, a, b, o = 1}) => {
	const cols = 12;
	const rows = 21;
	const t = prog(f, a, b, EASE.in);
	const out: React.ReactNode[] = [];
	for (let r = 0; r < rows; r++)
		for (let c = 0; c < cols; c++) {
			const k = r * cols + c;
			const th = rand(k * 7 + 3);
			if (th > t) continue;
			out.push(<div key={k} style={{position: 'absolute', left: c * 90 + 12, top: r * 92 + 12, width: 66, height: 66, background: th < 0.12 ? C.yellow : 'rgba(20,24,30,0.82)', border: `2px solid ${th < 0.12 ? C.yellowLight : 'rgba(242,182,48,0.55)'}`, borderRadius: 4, opacity: o * Math.min(1, (t - th) * 8)}} />);
		}
	return <AbsoluteFill style={{pointerEvents: 'none'}}>{out}</AbsoluteFill>;
};

export const Demand: React.FC<{f: number}> = ({f}) => {
	const a = wf(62);
	const boom = wf(63) - 1; // «انفجار»
	const comp = wf(66) - 1; // «الشركات»
	const need = wf(68); // «تحتاج»
	const huge = wf(70) - 1; // «هائلة»
	const b = wf(72) - 1;
	const sh = shake(f, boom, 9, 12);
	return (
		<>
			<div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
				<Shot f={f} a={a} b={comp - 1} src={M('v_dc_aisle.mp4')} credit={CR.dcTour} kind="لقطات حقيقية" move={{s0: 1.08, s1: 1.4}} ease={EASE.in} dim={0.15} />
				<Shot f={f} a={comp} b={need - 1} src={M('m_frontier2.jpg')} credit={CR.frontier} move={{s0: 1.2, s1: 1.08, p0: 30, p1: 60}} dim={0.2} />
				<Shot f={f} a={need} b={huge - 1} src={M('m_gb200.jpg')} credit={CR.gb200} move={{s0: 1.05, s1: 1.2}} pos="50% 40%" dim={0.2} />
				<Shot f={f} a={huge} b={b} src={M('v_dc_cables.mp4')} credit={CR.dcTour} kind="لقطات حقيقية" move={{s0: 1.12, s1: 1.2, p0: 40, p1: 52}} dim={0.55} />
			</div>
			{f < comp ? <Ring f={f} at={boom} x={540} y={820} r={520} color={C.yellow} dur={20} /> : null}
			{f >= boom && f < comp ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 650, display: 'flex', justifyContent: 'center', transform: `scale(${0.5 + 0.5 * slam(f, boom)}) rotate(-2deg)`}}>
					<HeroWord text="انفجار" size={200} strip={C.charcoal} />
				</div>
			) : null}
			{f >= comp && f < huge ? (
				<>
					<ChipField f={f} a={comp} b={huge} o={0.75} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, comp + 2)})`}}>
						<Label text={f >= need ? 'طلب على ذاكرة بكميات ضخمة' : 'سباق مراكز البيانات'} size={50} bg={C.paperWhite} seed={7} />
					</div>
					{f >= need ? (
						<div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', ...appear(f, need + 2)}}>
							<TechTag text="NVIDIA GB200 · RACK" size={28} bg={C.yellow} />
						</div>
					) : null}
				</>
			) : null}
			{f >= huge ? (
				<div style={{position: 'absolute', left: 60, right: 60, top: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
					<div style={{transform: `scale(${pop(f, huge)})`}}>
						<LogoCard src="logo_openai.svg" w={260} pad={16} />
					</div>
					<div dir="rtl" style={{background: G.panel, border: `4px solid ${C.yellow}`, borderRadius: 10, padding: '18px 34px 22px', textAlign: 'center', filter: SHADOW.lifted, transform: `scale(${pop(f, huge + 3)})`}}>
						<div dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 96, color: C.yellow, lineHeight: 1.05, textShadow: `0 0 24px ${G.goldGlow}`}}>
							{Math.round(900000 * prog(f, huge + 3, huge + 20, EASE.out5)).toLocaleString('en-US')}
						</div>
						<div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: C.paper, lineHeight: 1.3}}>رقاقة DRAM شهرياً</div>
						<div style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 26, color: 'rgba(244,236,221,0.85)', marginTop: 6}}>هدف معلن لشراكات OpenAI مع Samsung و SK hynix</div>
					</div>
					<div style={{display: 'flex', gap: 16, ...appear(f, huge + 8)}}>
						<LogoCard src="logo_samsung.svg" w={190} pad={10} />
						<LogoCard src="logo_skhynix.svg" w={150} pad={10} />
					</div>
					<div style={{...appear(f, huge + 10)}}>
						<Note text="المصدر: OpenAI · 1 أكتوبر 2025 · خطابات نوايا (هدف، مش إنتاج فعلي)" size={22} />
					</div>
				</div>
			) : null}
		</>
	);
};

/* ---------------- 26.1 – 30.0 s · the bottleneck: fabs can't expand as fast as demand ---------------- */
export const Bottleneck: React.FC<{f: number}> = ({f}) => {
	const a = wf(72);
	const fabs = wf(74) - 1; // «المصانع»
	const prod = wf(78) - 1; // «إنتاجها»
	const b = wf(82) - 1;
	const chart = prog(f, prod, b, EASE.linear);
	const W0 = 860;
	const H0 = 480;
	// concept curves (no data): demand accelerates, supply grows slowly
	const pts = (fn: (x: number) => number) =>
		Array.from({length: 41})
			.map((_, i) => i / 40)
			.filter((x) => x <= chart)
			.map((x) => `${x * W0},${H0 - fn(x) * H0}`)
			.join(' ');
	const demand = (x: number) => 0.12 + 0.86 * Math.pow(x, 2.1);
	const supply = (x: number) => 0.12 + 0.3 * x;
	return (
		<>
			<Shot f={f} a={a} b={fabs - 1} src={M('m_micron_fab.jpg')} credit={CR.micronFab} move={{s0: 1.1, s1: 1.2, p0: 30, p1: 36}} dim={0.12} />
			<Shot f={f} a={fabs} b={prod - 1} src={M('v_fab_yellow.mp4')} credit={CR.ibm} kind="لقطات حقيقية" move={{s0: 1.1, s1: 1.18, p0: 50, p1: 56}} dim={0.1} />
			<Shot f={f} a={prod} b={b} src={M('v_st_fab.mp4')} credit={CR.st} kind="لقطات حقيقية" move={{s0: 1.12, s1: 1.2}} dim={0.62} />
			{f < fabs ? (
				<>
					<TitleCard frame={f} at={a + 1} text="والمشكلة…" size={52} seed={26} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center', ...appear(f, a + 6)}}>
						<Label text="مصنع Micron للذاكرة · تايوان" size={34} bg={C.paperWhite} seed={9} />
					</div>
				</>
			) : null}
			{f >= fabs && f < prod ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, fabs)}) rotate(-2deg)`}}>
					<HeroWord text="المصانع" size={150} strip={C.charcoal} />
				</div>
			) : null}
			{f >= prod ? (
				<>
					<TitleCard frame={f} at={prod + 1} text="الطلب أسرع من الإنتاج" size={48} seed={27} />
					<div style={{position: 'absolute', left: 110, top: 520, width: W0, height: H0}}>
						<svg width={W0} height={H0} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							<line x1={0} y1={H0} x2={W0} y2={H0} stroke="rgba(244,236,221,0.6)" strokeWidth={3} />
							<line x1={0} y1={0} x2={0} y2={H0} stroke="rgba(244,236,221,0.6)" strokeWidth={3} />
							<polygon
								points={`${pts(demand)} ${Array.from({length: 41}).map((_, i) => i / 40).filter((x) => x <= chart).reverse().map((x) => `${x * W0},${H0 - supply(x) * H0}`).join(' ')}`}
								fill="rgba(229,72,77,0.22)"
							/>
							<polyline points={pts(supply)} fill="none" stroke={C.paper} strokeWidth={9} strokeLinecap="round" />
							<polyline points={pts(demand)} fill="none" stroke={C.yellow} strokeWidth={11} strokeLinecap="round" style={{filter: `drop-shadow(0 0 10px ${G.goldGlow})`}} />
						</svg>
						{chart > 0.7 ? (
							<>
								<div style={{position: 'absolute', left: W0 * 0.7, top: H0 - demand(0.82) * H0 - 70, ...appear(f, prod + 30)}}>
									<Label text="الطلب" size={38} bg={C.yellow} seed={2} />
								</div>
								<div style={{position: 'absolute', left: W0 * 0.72, top: H0 - supply(1) * H0 + 20, ...appear(f, prod + 32)}}>
									<Label text="الإنتاج" size={38} bg={C.paperWhite} seed={3} />
								</div>
								<div style={{position: 'absolute', left: W0 * 0.4, top: H0 - 0.5 * H0 + 30, ...appear(f, prod + 36)}}>
									<Label text="نقص" size={34} bg={G.red} fg={C.white} seed={4} />
								</div>
							</>
						) : null}
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1090, display: 'flex', justifyContent: 'center', ...appear(f, prod + 8)}}>
						<Badge text="رسم توضيحي للفكرة · بدون أرقام" color={C.yellow} bg="rgba(20,22,26,0.9)" size={24} rot={-1} />
					</div>
				</>
			) : null}
		</>
	);
};

export const _k = kf;
