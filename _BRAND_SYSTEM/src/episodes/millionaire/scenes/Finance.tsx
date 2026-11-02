// 0 – 15.9 s · Chapter A/B: the millionaire hook, $500 a month, the S&P 500 fund and the hypothetical 30-year projection.
// Projection (data/projection.json): $500 deposited at the end of each month, 10 %/yr effective (monthly compounding) → $1,031,422 after
// 30 years from $180,000 paid in. Shown as a hypothetical scenario with the required disclaimer; 10 % is a historical average, not a promise.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, Label, TitleCard} from '../../../brand/type';
import {M, PROJ, wf} from '../ep';
import {CR} from '../credits';
import {appear, Cam, Coin, EdTag, fmt, GoldDust, GrowthChart, K, Money3D, Note, Panel, PixelMask, PixelRow, Shot, Stage, Sweep} from '../kit';

/* ---------------- 0 – 4.26 s · «بدك تصير مليونير؟ رح أعطيك استراتيجية 99% رح تخليك مليونير» ---------------- */
export const Hook: React.FC<{f: number}> = ({f}) => {
	const mil = wf(2); // «مليونير؟»
	const strat = wf(5); // «استراتيجية»
	const n99 = wf(6); // «99%»
	const mil2 = wf(9); // «مليونير.»
	const end = wf(10) - 1;
	const roll = prog(f, 0, mil + 4, EASE.out5);
	const v = Math.min(1000000, Math.round(120000 + 880000 * Math.pow(roll, 1.3)));
	const up = prog(f, wf(3), wf(3) + 10, EASE.io); // counter moves up when the strategy starts
	const camS = kf(f, [0, mil, end], [1.18, 1.0, 0.96], EASE.out);
	return (
		<AbsoluteFill>
			{/* the financial district, very dark behind the type */}
			<Shot f={f} a={0} b={end} src={M('m_nyse.jpg')} credit={CR.nyse} move={{s0: 1.45, s1: 1.12, y0: -40, y1: 0}} ease={EASE.out} grade="contrast(1.15) saturate(0.6) brightness(0.55) blur(2px)" dim={0.35} creditY={1500} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 30% at 50% 40%, rgba(242,182,48,0.28), rgba(0,0,0,0) 70%)', opacity: prog(f, mil - 4, mil + 6)}} />
			<GoldDust f={f} n={40} seed={12} o={prog(f, mil - 2, mil + 10)} />
			<EdTag f={f} at={1} text="خطة المليون" date="استثمار + ذكاء اصطناعي" y={110} />
			<Cam s={camS}>
				{/* the number */}
				<div style={{position: 'absolute', left: 0, right: 0, top: kf(up, [0, 1], [610, 330]), display: 'flex', justifyContent: 'center', transform: `scale(${kf(up, [0, 1], [1, 0.62]) * (0.92 + 0.08 * slam(f, mil))})`}}>
					<Money3D text={`$${fmt(v)}`} size={150} depth={16} glow={0.8 + 0.4 * (1 - prog(f, 0, 12))} shine={prog(f, mil + 2, mil + 22, EASE.linear)} />
				</div>
				{f < wf(3) + 6 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 830, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 1 - prog(f, wf(3), wf(3) + 6)}}>
						<div style={{...appear(f, 2, 6)}}>
							<Label text="بدك تصير" size={58} bg={C.paperWhite} seed={3} rot={-2} />
						</div>
						{f >= mil ? (
							<div style={{transform: `scale(${0.5 + 0.5 * slam(f, mil)}) rotate(-2deg)`}}>
								<HeroWord text="مليونير؟" size={190} strip={C.charcoal} />
							</div>
						) : null}
					</div>
				) : null}
			</Cam>
			{/* the strategy dossier: three redacted lines (revealed later in the video) */}
			{f >= strat - 4 ? (
				<div style={{position: 'absolute', left: 140, top: 560, width: 800, transform: `translateY(${(1 - pop(f, strat - 4)) * 500}px) rotate(${-2 + (1 - pop(f, strat - 4)) * 6}deg)`}}>
					<div style={{position: 'relative', background: C.paperWhite, borderRadius: 8, padding: '34px 46px 40px', filter: SHADOW.lifted}}>
						<div dir="rtl" style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 56, color: C.charcoal}}>
							الاستراتيجية
						</div>
						<div dir="rtl" style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 26, color: C.steelDark, marginTop: 4}}>
							خطة طويلة المدى · 3 خطوات
						</div>
						{[0, 1, 2].map((i) => (
							<div key={i} dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 24}}>
								<div style={{width: 46, height: 46, background: C.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.mono, fontWeight: 800, fontSize: 28, color: C.charcoal}}>{i + 1}</div>
								<div style={{position: 'relative', height: 40, width: [470, 400, 300][i], overflow: 'hidden', borderRadius: 4}}>
									<PixelMask f={f} reveal={99999} w={[470, 400, 300][i]} h={40} cell={20} seed={i + 4} />
								</div>
							</div>
						))}
						{f >= mil2 ? (
							<div style={{position: 'absolute', left: 30, bottom: 26, transform: `scale(${1.6 - 0.6 * slam(f, mil2)}) rotate(-12deg)`, opacity: Math.min(1, (f - mil2) / 3)}}>
								<Badge text="الهدف: مليون" color={C.terracotta} size={34} rot={0} />
							</div>
						) : null}
					</div>
				</div>
			) : null}
			{f >= n99 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1040, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
					<div style={{transform: `scale(${0.5 + 0.5 * slam(f, n99)})`}}>
						<Money3D text="99%" size={150} depth={12} face={`linear-gradient(180deg, ${C.paperWhite}, ${C.paperShade})`} side={C.charcoal} glow={0.2} />
					</div>
					<div style={{...appear(f, n99 + 6)}}>
						<Note text="تعبير الراوي · مش احتمال محسوب" size={24} />
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/* ---------------- 4.26 – 7.14 s · «كل اللي عليك تعمله إنك تستثمر 500 دولار كل شهر» ---------------- */
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
export const Deposit: React.FC<{f: number}> = ({f}) => {
	const a = wf(10);
	const inv = wf(15); // «تستثمر»
	const n500 = wf(16); // «500»
	const monthly = wf(18); // «كل شهر»
	const b = wf(20) - 1;
	const per = Math.max(1, (b - 2 - monthly) / 12);
	const done = Math.max(0, Math.min(12, Math.floor((f - monthly) / per) + 1));
	return (
		<AbsoluteFill>
			<Stage f={f} seed={4} />
			<TitleCard frame={f} at={a + 1} text="الخطوة 1 · استثمار شهري" size={46} seed={21} />
			<div style={{position: 'absolute', left: 60, top: 340, transform: `translateY(${(1 - pop(f, a + 2, {damping: 15})) * 300}px)`, opacity: prog(f, a + 2, a + 8)}}>
				<Panel w={960} h={880} title="portfolio / auto-invest" tag={f >= inv ? 'ON' : 'OFF'} accent={K.green}>
					<div dir="rtl" style={{padding: '30px 40px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
						<div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 38, color: C.paper}}>استثمار تلقائي</div>
						<div style={{width: 96, height: 50, borderRadius: 25, background: f >= inv ? K.green : 'rgba(154,165,174,0.4)', position: 'relative'}}>
							<div style={{position: 'absolute', top: 5, width: 40, height: 40, borderRadius: 20, background: C.white, left: kf(f, [inv, inv + 6], [6, 50])}} />
						</div>
					</div>
					{/* the amount */}
					<div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16, marginTop: 40, direction: 'ltr', transform: `scale(${f >= n500 ? 0.7 + 0.3 * slam(f, n500) : 0.7})`, opacity: f >= n500 - 2 ? 1 : 0.25}}>
						<Money3D text="$500" size={170} depth={12} glow={0.7} shine={prog(f, n500 + 4, n500 + 24, EASE.linear)} />
						<span style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 64, color: C.paper}}>/ month</span>
					</div>
					{/* the 12 months: a coin drops into each */}
					<div dir="rtl" style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, padding: '44px 40px 0'}}>
						{MONTHS.map((m, i) => {
							const at = monthly + i * per;
							const d = f >= at ? pop(f, at, {damping: 12, stiffness: 260}) : 0;
							return (
								<div key={m} style={{height: 150, borderRadius: 10, border: `2px solid ${d > 0 ? 'rgba(242,182,48,0.8)' : K.panelLine}`, background: d > 0 ? 'rgba(242,182,48,0.10)' : 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0 12px', overflow: 'hidden'}}>
									<div style={{height: 70, display: 'flex', alignItems: 'center', transform: `translateY(${(1 - d) * -90}px)`, opacity: d}}>
										<Coin s={54} />
									</div>
									<div style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 22, color: 'rgba(244,236,221,0.8)'}}>{m}</div>
								</div>
							);
						})}
					</div>
					<div dir="rtl" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '34px 40px 0'}}>
						<div style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 28, color: 'rgba(244,236,221,0.75)'}}>مجموع اللي دفعته بالسنة</div>
						<div dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 48, color: C.yellow}}>${fmt(done * 500)}</div>
					</div>
				</Panel>
			</div>
		</AbsoluteFill>
	);
};

/* ---------------- 7.14 – 10.20 s · «بصندوق بيتبع مؤشر S&P 500 الأمريكي» ---------------- */
export const Sp500: React.FC<{f: number}> = ({f}) => {
	const a = wf(20); // «بصندوق»
	const idx = wf(22); // «مؤشر»
	const sp = wf(23); // «S&P 500»
	const us = wf(24); // «الأمريكي»
	const b = wf(25) - 1;
	const cols = 25;
	const rows = 20; // 500 cells = ~500 companies
	const fill = prog(f, sp, us + 8, EASE.out);
	return (
		<AbsoluteFill>
			<Shot f={f} a={a} b={sp - 1} src={M('m_nyse2.jpg')} credit={CR.nyse2} move={{s0: 1.08, s1: 1.22, p0: 40, p1: 55}} />
			<Shot f={f} a={sp} b={b} src={M('m_wallst_flags.jpg')} credit={CR.wallstFlags} move={{s0: 1.25, s1: 1.12, p0: 60, p1: 45}} dim={0.55} grade="contrast(1.05) saturate(0.7) brightness(0.8)" />
			<TitleCard frame={f} at={a + 1} text="الخطوة 2 · صندوق مؤشر" size={46} seed={22} />
			{f < sp ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1110, display: 'flex', justifyContent: 'center', ...appear(f, idx)}}>
					<Note text="بورصة نيويورك · وول ستريت" size={26} />
				</div>
			) : null}
			{f >= sp ? (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', transform: `scale(${0.55 + 0.45 * slam(f, sp)})`}}>
						<Money3D text="S&P 500" size={150} depth={14} face={`linear-gradient(180deg, ${C.white}, ${C.paperShade})`} side={C.charcoal} glow={0.25} shine={prog(f, sp + 3, sp + 25, EASE.linear)} />
					</div>
					{/* the fund: one box holding ~500 companies */}
					<div style={{position: 'absolute', left: 140, top: 600, width: 800, padding: 20, border: `5px solid ${C.yellow}`, borderRadius: 14, background: 'rgba(7,9,12,0.72)', opacity: prog(f, sp + 2, sp + 8)}}>
						<div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 5, direction: 'ltr'}}>
							{Array.from({length: cols * rows}).map((_, k) => {
								const on = k / (cols * rows) < fill;
								return <div key={k} style={{aspectRatio: '1', background: on ? (k % 37 === 0 ? C.white : C.yellow) : 'rgba(244,236,221,0.08)', opacity: on ? 0.55 + 0.45 * ((k * 7) % 5) / 4 : 1}} />;
							})}
						</div>
						<div dir="rtl" style={{position: 'absolute', right: 26, top: -30, background: C.yellow, padding: '4px 16px 6px', fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: C.charcoal, borderRadius: 4}}>
							صندوق مؤشر
						</div>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1140, display: 'flex', justifyContent: 'center', ...appear(f, us - 2)}}>
						<Label text="حوالي 500 من أكبر الشركات الأمريكية" size={38} bg={C.paperWhite} seed={9} rot={-1} />
					</div>
				</>
			) : null}
		</AbsoluteFill>
	);
};

/* ---------------- 10.20 – 15.88 s · «بعد 30 سنة … أكثر من مليون دولار لأنه متوسط عائده التاريخي حوالي 10% سنوياً» ---------------- */
export const Growth: React.FC<{f: number}> = ({f}) => {
	const a = wf(25);
	const y30 = wf(26); // «30»
	const mil = wf(33); // «مليون»
	const avg = wf(36); // «متوسط»
	const hist = wf(38); // «التاريخي»
	const pct = wf(40); // «10%»
	const b = wf(42) - 1;
	const t = prog(f, y30 - 2, mil + 6, EASE.io);
	const year = 30 * t;
	const i = Math.floor(year);
	const val = i >= 30 ? PROJ.years[30] : PROJ.years[i] + (PROJ.years[i + 1] - PROJ.years[i]) * (year - i);
	const hitMil = f >= mil + 6;
	return (
		<AbsoluteFill>
			<Stage f={f} seed={6} />
			<TitleCard frame={f} at={a + 1} text="الخطوة 3 · الوقت" size={46} seed={23} />
			<div style={{position: 'absolute', left: 40, top: 320, opacity: prog(f, a, a + 6), transform: `translateY(${(1 - pop(f, a, {damping: 15})) * 200}px)`}}>
				<Panel w={1000} h={930} title="hypothetical projection · $500/mo · 30y" tag="SIM" accent={C.yellow}>
					<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 34px 0', direction: 'ltr'}}>
						<div>
							<div style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 24, color: 'rgba(244,236,221,0.6)'}}>YEAR</div>
							<div style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 64, color: C.paper, lineHeight: 1.05}}>
								{Math.floor(year)}
								<span style={{fontSize: 34, color: 'rgba(244,236,221,0.5)'}}> / 30</span>
							</div>
						</div>
						<div style={{textAlign: 'right'}}>
							<div style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 24, color: 'rgba(244,236,221,0.6)'}}>PORTFOLIO</div>
							<div style={{transform: `scale(${hitMil ? 0.9 + 0.1 * slam(f, mil + 6) : 0.9})`, transformOrigin: '100% 0'}}>
								<Money3D text={`$${fmt(val)}`} size={84} depth={8} glow={hitMil ? 0.9 : 0.3} shine={hitMil ? prog(f, mil + 6, mil + 26, EASE.linear) : -1} />
							</div>
						</div>
					</div>
					<div style={{position: 'absolute', left: 40, top: 230}}>
						<GrowthChart w={920} h={440} t={t} f={f} showPaid={prog(f, y30 + 10, y30 + 20)} />
					</div>
					{/* legend */}
					<div dir="rtl" style={{position: 'absolute', left: 34, right: 34, top: 745, display: 'flex', gap: 30, justifyContent: 'flex-start', opacity: prog(f, y30 + 10, y30 + 18)}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
							<div style={{width: 34, height: 8, background: C.yellow}} />
							<span style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 24, color: C.paper}}>قيمة المحفظة</span>
						</div>
						<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
							<div style={{width: 34, height: 0, borderTop: `5px dashed ${C.paper}`}} />
							<span style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 24, color: C.paper}}>
								اللي دفعته فعلياً: <span dir="ltr">$180,000</span>
							</span>
						</div>
					</div>
					{/* disclaimer strip */}
					<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 30px 16px', background: 'rgba(242,182,48,0.12)', borderTop: `2px solid rgba(242,182,48,0.5)`, display: 'flex', flexDirection: 'column', gap: 4, opacity: prog(f, a + 8, a + 16)}}>
						<div style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 31, color: C.yellowLight}}>العوائد التاريخية لا تضمن النتائج المستقبلية</div>
						<div style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 21, color: 'rgba(244,236,221,0.75)'}}>سيناريو افتراضي: إيداع 500$ آخر كل شهر · عائد 10% سنوياً · قبل الرسوم والضرائب والتضخم</div>
					</div>
				</Panel>
			</div>
			{hitMil ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, mil + 6)}) rotate(-3deg)`, opacity: 1 - prog(f, avg, avg + 6)}}>
					<Label text="أكثر من مليون دولار" size={52} bg={C.yellow} seed={5} />
				</div>
			) : null}
			{f >= avg ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', gap: 18, alignItems: 'center'}}>
					<div style={{transform: `scale(${f >= pct ? 0.6 + 0.4 * slam(f, pct) : 0.6})`, opacity: f >= pct ? 1 : 0}}>
						<div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(7,9,12,0.92)', border: `4px solid ${C.yellow}`, borderRadius: 14, padding: '10px 26px 14px', filter: SHADOW.lifted}}>
							<span style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 92, color: C.yellow, lineHeight: 1}}>≈10%</span>
							<span dir="rtl" style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: C.paper}}>سنوياً</span>
						</div>
					</div>
					<div style={{position: 'absolute', top: -70, ...appear(f, hist - 2)}}>
						<Badge text="متوسط تاريخي تقريبي · مش وعد" color={C.yellow} bg="rgba(20,22,26,0.92)" size={28} rot={-2} />
					</div>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 0, right: 0, top: 1300, display: 'flex', justifyContent: 'center', opacity: 0}}>
				<PixelRow n={30} lit={Math.floor(year)} size={10} gap={4} />
			</div>
		</AbsoluteFill>
	);
};

export const _f = {Img, staticFile, Sweep, K};
