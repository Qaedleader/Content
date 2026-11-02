// Beats 1–2: the hook (scale, record, "hours ago") and the incident (hot wallets drained, $6.3B estimate).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, rand, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, Label, TitleCard} from '../../../brand/type';
import {wf} from '../ep';
import {BinanceLogo, Cam, Counter, K, NewsTag, Ring, rise, Source, Stage, Stream} from '../kit';

const Center: React.FC<{y: number; style?: React.CSSProperties; children: React.ReactNode}> = ({y, style, children}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);

/* ---------------- 0 – 6.5 s · «أكبر سرقة في تاريخ العملات الرقمية … صارت قبل ساعات فقط» ---------------- */
export const Hook: React.FC<{f: number}> = ({f}) => {
	const B = wf(6); // «وممكن» → record comparison
	const CL = wf(13); // «صارت» → clock
	const end = wf(17) - 1;
	const pA = f < B;
	const pB = f >= B && f < CL;
	const toB = prog(f, B - 6, B + 10, EASE.io);
	return (
		<AbsoluteFill>
			<Stage f={f} tone={pA ? 0 : 0.4} />
			{/* A · logo + headline + rolling total (all on screen from frame 0) */}
			{pA ? (
				<Cam s={1.0 + 0.05 * prog(f, 0, B, EASE.linear) - 0.15 * toB} y={-60 * toB}>
					{/* value draining out of the logo: illustrative outflow */}
					{[...Array(8)].map((_, i) => {
						const ang = (i / 8) * Math.PI * 2 + 0.3;
						return <Stream key={i} f={f} a={-8} b={B + 4} x0={540} y0={470} x1={540 + Math.cos(ang) * 760} y1={470 + Math.sin(ang) * 760} n={6} color={K.bnb} size={14} seed={i + 1} speed={1.4} />;
					})}
					<Center y={390}>
						<div style={{transform: `scale(${0.94 + 0.06 * pop(f, -4)})`}}>
							<BinanceLogo w={700} glow={0.9} />
						</div>
					</Center>
					<Center y={600} style={{transform: `scale(${0.7 + 0.3 * slam(f, -3)}) rotate(-2deg)`}}>
						<HeroWord text="أكبر سرقة" size={230} strip={C.charcoal} />
					</Center>
					<Center y={930}>
						<div style={{background: 'rgba(11,17,27,0.86)', padding: '22px 34px 26px', borderRadius: 10, border: `2px solid rgba(240,185,11,0.5)`, filter: SHADOW.lifted}}>
							<Counter f={f} fa={-12} fb={40} a={1.2e9} b={6.3e9} size={104} />
						</div>
					</Center>
					<Center y={1105} style={rise(f, wf(3) - 2)}>
						<Label text="في تاريخ العملات الرقمية" size={48} bg={C.yellow} seed={4} rot={-1.5} />
					</Center>
					<Center y={1215} style={{opacity: prog(f, 30, 40)}}>
						<Source text="تقدير Binance للأثر الإجمالي" size={24} />
					</Center>
				</Cam>
			) : null}
			{/* B · «أكبر سرقة أموال في التاريخ» — record comparison, characterisation flagged */}
			{pB ? (
				<>
					<Center y={250} style={{transform: `scale(${0.6 + 0.4 * slam(f, wf(8) - 2)})`, opacity: f >= wf(8) - 2 ? 1 : 0}}>
						<HeroWord text="أكبر سرقة أموال بالتاريخ؟" size={104} strip={C.charcoal} />
					</Center>
					<div style={{position: 'absolute', left: 90, right: 90, top: 560}}>
						<div dir="rtl" style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 38, color: C.paper, marginBottom: 26, ...rise(f, B + 2)}}>
							أكبر سرقات العملات الرقمية المسجّلة
						</div>
						{[
							{name: 'Binance', when: 'أكتوبر 2026', v: 6.3, at: wf(10) - 3, color: K.red},
							{name: 'Bybit', when: 'فبراير 2025', v: 1.5, at: B + 8, color: C.steel},
						].map((r, i) => {
							const g = prog(f, r.at, r.at + 16, EASE.out5);
							return (
								<div key={i} style={{marginBottom: 46, ...rise(f, r.at - 4)}}>
									<div dir="rtl" style={{display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10}}>
										<span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 40, color: C.paper}}>{r.name}</span>
										<span style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 26, color: C.steel}}>{r.when}</span>
									</div>
									<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 18}}>
										<div style={{height: 84, width: 760 * (r.v / 6.3) * g, background: r.color, borderRadius: 6, boxShadow: i === 0 ? `0 0 30px ${K.redGlow}` : undefined}} />
										<span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 44, color: i === 0 ? K.red : C.paper, opacity: g}}>${r.v.toFixed(1)}B</span>
									</div>
								</div>
							);
						})}
						<div dir="rtl" style={{display: 'flex', ...rise(f, wf(11))}}>
							<Label text="≈ ٤ أضعاف الرقم القياسي السابق" size={38} bg={C.yellow} seed={9} rot={1} />
						</div>
					</div>
					<Center y={1150} style={rise(f, wf(12))}>
						<Badge text="«الأكبر بالتاريخ» توصيف محتمل · غير محسوم" size={28} />
					</Center>
					<Center y={1240} style={{opacity: prog(f, wf(10), wf(10) + 8)}}>
						<Source text="TRM Labs · CoinDesk · NBC News" size={22} />
					</Center>
				</>
			) : null}
			{/* C · «صارت قبل ساعات فقط» — UTC clock */}
			{f >= CL ? <Clock f={f} a={CL} end={end} /> : null}
			<NewsTag f={f} at={-20} date="Binance · 29 أكتوبر 2026" />
		</AbsoluteFill>
	);
};

const Clock: React.FC<{f: number; a: number; end: number}> = ({f, a, end}) => {
	const p = pop(f, a, {damping: 13, stiffness: 220, mass: 0.7});
	// fixed timestamp of the first outflow (TRM Labs); only the colon blinks
	const glow = 0.5 + 0.5 * Math.sin((f - a) / 5);
	return (
		<>
			<Center y={400} style={{opacity: p, transform: `scale(${0.8 + 0.2 * p})`}}>
				<div style={{background: 'rgba(11,17,27,0.9)', border: '2px solid rgba(154,165,174,0.45)', borderRadius: 18, padding: '30px 56px 34px', filter: SHADOW.lifted, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
					<div dir="rtl" style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 30, color: C.steel}}>بداية التحويلات المشبوهة</div>
					<div dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 190, color: C.paper, lineHeight: 1, letterSpacing: -6}}>
						20
						<span style={{opacity: Math.floor(f / 15) % 2 ? 0.25 : 1}}>:</span>
						05
					</div>
					<div style={{height: 6, width: 420, borderRadius: 3, background: K.red, opacity: 0.4 + 0.6 * glow, boxShadow: `0 0 20px ${K.redGlow}`}} />
					<div dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 34, color: K.bnb}}>UTC · 29 OCT 2026</div>
				</div>
			</Center>
			<Center y={860} style={{transform: `scale(${0.6 + 0.4 * slam(f, wf(14) - 2)}) rotate(-1.5deg)`, opacity: f >= wf(14) - 2 ? 1 : 0}}>
				<HeroWord text="قبل ساعات فقط" size={150} strip={C.charcoal} />
			</Center>
			<Center y={1110} style={rise(f, wf(15))}>
				<Source text="TRM Labs · توقيت أول تحويل على شبكة XRP Ledger" size={24} />
			</Center>
		</>
	);
};

/* ---------------- 6.5 – 13.0 s · «منصة Binance تعرضت لاختراق ضخم بقيمة 6 مليار و300 مليون دولار، شو اللي صار؟» ---------------- */
const NODES = 10;
export const Incident: React.FC<{f: number}> = ({f}) => {
	const a = wf(17);
	const breach = wf(22); // «لاختراق»
	const value = wf(24); // «بقيمة»
	const what = wf(31); // «شو اللي صار؟»
	const end = wf(34) - 1;
	const cx = 540;
	const cy = 760;
	const R = 330;
	const hit = prog(f, breach - 2, breach + 6);
	const push = prog(f, value - 4, value + 18, EASE.io);
	const dimQ = prog(f, what - 3, what + 4);
	return (
		<AbsoluteFill>
			<Stage f={f} tone={hit * 0.9} seed={3} />
			<Cam s={1 + 0.12 * prog(f, a, value, EASE.linear) - 0.32 * push} y={-120 * push}>
				{/* hot-wallet ring */}
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					<circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(154,165,174,0.35)" strokeWidth={3} strokeDasharray="6 12" transform={`rotate(${f * 0.4} ${cx} ${cy})`} />
					{Array.from({length: NODES}).map((_, i) => {
						const ang = (i / NODES) * Math.PI * 2 - Math.PI / 2 + f * 0.003;
						const x = cx + Math.cos(ang) * R;
						const y = cy + Math.sin(ang) * R;
						const on = pop(f, a + 4 + i * 2);
						const red = f >= breach + i;
						return (
							<g key={i} opacity={on}>
								<line x1={cx} y1={cy} x2={x} y2={y} stroke={red ? 'rgba(229,72,77,0.5)' : 'rgba(240,185,11,0.35)'} strokeWidth={3} />
								<rect x={x - 26} y={y - 26} width={52} height={52} rx={8} fill={K.ink} stroke={red ? K.red : K.bnb} strokeWidth={4} transform={`rotate(45 ${x} ${y})`} />
							</g>
						);
					})}
				</svg>
				{/* outflow: each hot wallet drains outward after the breach */}
				{Array.from({length: NODES}).map((_, i) => {
					const ang = (i / NODES) * Math.PI * 2 - Math.PI / 2 + f * 0.003;
					const x = cx + Math.cos(ang) * R;
					const y = cy + Math.sin(ang) * R;
					return <Stream key={i} f={f} a={breach + i} b={end + 4} x0={x} y0={y} x1={cx + Math.cos(ang) * 900} y1={cy + Math.sin(ang) * 900} n={7} seed={i + 4} speed={1.6} />;
				})}
				<Ring f={f} at={breach} x={cx} y={cy} r={520} />
				<Ring f={f} at={breach + 5} x={cx} y={cy} r={380} />
				<div style={{position: 'absolute', left: cx - 150, top: cy - 150, width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.6 + 0.4 * pop(f, a)})`}}>
					<BinanceLogo w={250} icon glow={1 - hit * 0.6} style={{filter: hit > 0.5 ? `drop-shadow(0 0 40px ${K.redGlow})` : undefined}} />
				</div>
				<Center y={cy + R + 64} style={{opacity: pop(f, a + 10) * (1 - push)}}>
					<div dir="rtl" style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 28, color: C.steel}}>
						محافظ Binance على <span style={{color: C.paper}}>١٠ شبكات بلوكتشين</span>
					</div>
				</Center>
			</Cam>
			<TitleCard frame={f} at={wf(19)} text="منصة Binance تعرّضت لاختراق" size={44} seed={8} out={value - 2} />
			{/* timeline strip */}
			{f >= breach && f < value + 4 ? (
				<div style={{position: 'absolute', left: 80, right: 80, top: 1180, ...rise(f, breach + 2)}}>
					<div dir="rtl" style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT.mono, fontWeight: 700, fontSize: 28, color: C.paper}}>
						<span dir="ltr">20:05 UTC</span>
						<span dir="rtl" style={{fontFamily: FONT.display, color: K.red}}>معظمها خلال ≈ ٢٠ دقيقة</span>
					</div>
					<div style={{height: 10, marginTop: 10, background: 'rgba(154,165,174,0.25)', borderRadius: 5, overflow: 'hidden', direction: 'rtl'}}>
						<div style={{height: '100%', width: `${100 * prog(f, breach, value, EASE.out)}%`, background: K.red}} />
					</div>
					<Source text="TRM Labs" size={20} style={{marginTop: 8}} />
				</div>
			) : null}
			{/* the value */}
			{f >= value - 2 ? (
				<>
					<AbsoluteFill style={{background: `rgba(11,17,27,${0.55 * push + 0.3 * dimQ})`}} />
					<Center y={640} style={{opacity: push, transform: `scale(${0.8 + 0.2 * push})`}}>
						<div style={{background: 'rgba(11,17,27,0.9)', padding: '24px 30px 28px', borderRadius: 12, border: '2px solid rgba(240,185,11,0.55)', filter: SHADOW.lifted}}>
							<MoneyTicker f={f} />
						</div>
					</Center>
					<Center y={850} style={{transform: `scale(${0.6 + 0.4 * slam(f, wf(29) - 1)}) rotate(-1.5deg)`, opacity: f >= wf(29) - 1 ? 1 - dimQ : 0}}>
						<HeroWord text="٦٫٣ مليار دولار" size={150} strip={C.charcoal} />
					</Center>
					<Center y={1100} style={{...rise(f, wf(30)), opacity: (f >= wf(30) ? 1 : 0) * (1 - dimQ)}}>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
							<Source text="تقدير Binance للأثر الإجمالي" size={26} />
							<div dir="rtl" style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 22, color: C.steel}}>
								TRM Labs: ≈ $6.36B وقت التحويل · الأرقام قابلة للتعديل
							</div>
						</div>
					</Center>
				</>
			) : null}
			{f >= what - 2 ? (
				<Center y={900} style={{transform: `scale(${0.6 + 0.4 * slam(f, what - 2)}) rotate(2deg)`}}>
					<HeroWord text="شو اللي صار؟" size={170} strip={C.charcoal} />
				</Center>
			) : null}
		</AbsoluteFill>
	);
};

/** «6 مليار … و300 مليون»: the ledger lands on 6,000,000,000 then adds 300,000,000 on the spoken words. */
const MoneyTicker: React.FC<{f: number}> = ({f}) => {
	const v = kf(f, [wf(24) - 2, wf(26) + 2, wf(28) - 2, wf(29) + 4], [0, 6e9, 6e9, 6.3e9], EASE.out);
	const lit = f >= wf(28) - 2;
	return (
		<div dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 92, letterSpacing: -2, color: K.bnb, textShadow: `0 0 26px ${K.bnbGlow}`, lineHeight: 1, whiteSpace: 'nowrap'}}>
			${Math.round(v).toLocaleString('en-US').replace(/^(\d),(\d{3})/, (m, a, b) => (lit ? `${a},<${b}>` : m)).split(/[<>]/).map((s, i) => (i === 1 ? <span key={i} style={{color: K.red}}>{s}</span> : <span key={i}>{s}</span>))}
		</div>
	);
};
