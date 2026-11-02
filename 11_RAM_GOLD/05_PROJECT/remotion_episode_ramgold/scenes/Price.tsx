// 37.5 – 47.4 s · prices (TrendForce DRAM *contract* price changes, quarter on quarter) → strategic resource → new fabs take years.
// Figures (TrendForce): 1Q26 forecast +55–60% (5 Jan 2026 press release); 2Q26 ≈ +80%, 3Q26 ≈ +40%, 4Q26 forecast ≈ +20% (20 Oct 2026 note).
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, Label, TitleCard} from '../../../brand/type';
import {M, wf} from '../ep';
import {CR} from '../credits';
import {appear, G, LogoCard, Note, PixelRow, RamCut, Shot, Stage, Stream, TechTag} from '../kit';

const BARS = [
	{q: '1Q26', v: 57.5, txt: '+55–60%', fc: true, word: 104},
	{q: '2Q26', v: 80, txt: '≈ +80%', fc: false, word: 105},
	{q: '3Q26', v: 40, txt: '≈ +40%', fc: false, word: 106},
	{q: '4Q26', v: 20, txt: '≈ +20%', fc: true, word: 107},
];

export const Prices: React.FC<{f: number}> = ({f}) => {
	const a = wf(103);
	const b = wf(109) - 1;
	const maxH = 520;
	const base = 1130;
	return (
		<AbsoluteFill>
			<Shot f={f} a={a} b={b} src={M('m_sodimm_skh.jpg')} credit={CR.sodimm} move={{s0: 1.3, s1: 1.4}} grade="blur(6px) brightness(0.5) saturate(0.7)" dim={0.45} />
			<TitleCard frame={f} at={a + 1} text="أسعار الذاكرة" size={52} seed={41} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', ...appear(f, a + 6)}}>
				<Label text="أسعار عقود DRAM · الزيادة مقارنة بالربع السابق" size={32} bg={C.charcoal} fg={C.paper} font={FONT.label} />
			</div>
			{/* baseline */}
			<div style={{position: 'absolute', left: 90, right: 90, top: base, height: 4, background: 'rgba(244,236,221,0.7)', opacity: prog(f, a + 4, a + 10)}} />
			{BARS.map((bar, i) => {
				const at = wf(bar.word) - 2;
				const g = prog(f, at, at + 14, EASE.out5);
				const h = (bar.v / 80) * maxH * g;
				const x = 1080 - 140 - i * 220 - 150; // RTL-friendly order: first quarter on the right
				return (
					<div key={i} style={{position: 'absolute', left: x, top: base - h, width: 150, height: h}}>
						<div
							style={{
								position: 'absolute',
								inset: 0,
								background: bar.fc ? `repeating-linear-gradient(135deg, ${C.yellow} 0 14px, rgba(242,182,48,0.45) 14px 26px)` : C.yellow,
								borderRadius: '6px 6px 0 0',
								boxShadow: `0 0 26px ${G.goldGlow}`,
							}}
						/>
						{g > 0.3 ? (
							<div dir="ltr" style={{position: 'absolute', left: -30, right: -30, top: -64, textAlign: 'center', fontFamily: FONT.mono, fontWeight: 800, fontSize: 36, color: C.white, opacity: prog(f, at + 4, at + 10), textShadow: '0 4px 10px rgba(0,0,0,0.6)'}}>
								{bar.txt}
							</div>
						) : null}
						<div dir="ltr" style={{position: 'absolute', left: -20, right: -20, top: h + 14, textAlign: 'center', fontFamily: FONT.mono, fontWeight: 800, fontSize: 28, color: C.paper, opacity: prog(f, at, at + 6)}}>
							{bar.q}
						</div>
						{bar.fc ? (
							<div dir="rtl" style={{position: 'absolute', left: -20, right: -20, top: h + 52, textAlign: 'center', fontFamily: FONT.label, fontWeight: 700, fontSize: 22, color: C.yellowLight, opacity: prog(f, at + 4, at + 10)}}>
								توقّع
							</div>
						) : null}
					</div>
				);
			})}
			{f >= wf(108) - 2 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1240, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, ...appear(f, wf(108) - 2)}}>
					<Note text="المصدر: TrendForce (يناير وأكتوبر 2026) · أسعار عقود الشركات، مش أسعار المتاجر" size={22} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/* ---------------- 40.5 – 43.9 s · a resource tech companies compete over ---------------- */
export const Resource: React.FC<{f: number}> = ({f}) => {
	const a = wf(109);
	const key = wf(112) - 1; // «الموارد»
	const comp = wf(114) - 1; // «بتتنافس»
	const b = wf(118) - 1;
	return (
		<>
			<Shot f={f} a={a} b={b} src={M('m_frontier3.jpg')} credit={CR.frontier} move={{s0: 1.1, s1: 1.2, p0: 40, p1: 55}} dim={0.62} />
			<TitleCard frame={f} at={a + 1} text="مورد استراتيجي" size={52} seed={42} />
			{/* suppliers (top) — the three largest DRAM makers */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
				<div style={{...appear(f, a + 4)}}>
					<Label text="أكبر مصنّعي DRAM" size={30} bg={C.charcoal} fg={C.paper} font={FONT.label} />
				</div>
				<div style={{display: 'flex', gap: 18, alignItems: 'center'}}>
					{['logo_samsung.svg', 'logo_skhynix.svg', 'logo_micron.svg'].map((l, i) => (
						<div key={l} style={{transform: `scale(${pop(f, a + 6 + i * 3)})`}}>
							<LogoCard src={l} w={i === 1 ? 130 : 200} pad={12} />
						</div>
					))}
				</div>
			</div>
			{/* the RAM module in the middle */}
			<div style={{position: 'absolute', left: 140, top: 700, transform: `scale(${0.9 + 0.1 * pop(f, key)})`}}>
				<RamCut w={800} gold={0.18 * prog(f, key, key + 20)} glow={0.5 * prog(f, key, key + 10)} sweep={prog(f, key, b, EASE.linear)} />
			</div>
			{/* buyers (bottom) pulling toward it */}
			{f >= comp ? (
				<>
					<Stream f={f} a={comp} b={b + 10} x0={250} y0={1180} x1={420} y1={900} color={C.yellow} n={7} size={14} seed={2} />
					<Stream f={f} a={comp + 3} b={b + 10} x0={830} y0={1180} x1={660} y1={900} color={C.yellow} n={7} size={14} seed={3} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center', gap: 40}}>
						<div style={{transform: `scale(${pop(f, comp + 2)})`}}>
							<LogoCard src="logo_openai.svg" w={220} pad={14} />
						</div>
						<div style={{transform: `scale(${pop(f, comp + 6)})`}}>
							<LogoCard src="logo_nvidia_w.svg" w={220} pad={14} bg={C.charcoal} />
						</div>
					</div>
				</>
			) : null}
			{f >= key ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, key)}) rotate(-2deg)`}}>
					<HeroWord text="أهم الموارد" size={110} strip={C.charcoal} />
				</div>
			) : null}
		</>
	);
};

/* ---------------- 43.9 – 47.4 s · new fabs take years ---------------- */
const STEPS = ['قرار', 'بناء', 'تجهيز', 'إنتاج'];
export const Years: React.FC<{f: number}> = ({f}) => {
	const a = wf(118);
	const mid = wf(124) - 1; // «زيادة الإنتاج»
	const yrs = wf(127) - 1; // «لسنوات»
	const b = wf(128) - 1;
	const fill = prog(f, wf(121), b, EASE.linear);
	return (
		<>
			<Shot f={f} a={a} b={mid - 1} src={M('m_build2.jpg')} credit={CR.build} move={{s0: 1.08, s1: 1.2, p0: 30, p1: 50}} dim={0.15} />
			<Shot f={f} a={mid} b={b} src={M('m_build1.jpg')} credit={CR.build} move={{s0: 1.2, s1: 1.1, p0: 60, p1: 45}} dim={0.45} />
			<TitleCard frame={f} at={a + 1} text="مصانع جديدة؟" size={52} seed={43} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', ...appear(f, wf(122))}}>
				<Note text="صورة: مصنع رقائق قيد الإنشاء · دريسدن، ألمانيا (2026)" size={22} />
			</div>
			{/* build timeline: four stages fill slowly */}
			<div dir="rtl" style={{position: 'absolute', left: 70, right: 70, top: 820, display: 'flex', gap: 12, opacity: prog(f, wf(121), wf(121) + 6)}}>
				{STEPS.map((s, i) => {
					const seg = Math.max(0, Math.min(1, fill * 4 - i));
					return (
						<div key={s} style={{flex: 1}}>
							<div style={{height: 46, background: 'rgba(12,15,20,0.8)', border: `3px solid ${C.yellow}`, borderRadius: 6, overflow: 'hidden'}}>
								<div style={{width: `${seg * 100}%`, height: '100%', background: C.yellow, marginRight: 'auto'}} />
							</div>
							<div style={{textAlign: 'center', marginTop: 10, fontFamily: FONT.display, fontWeight: 800, fontSize: 34, color: C.paper, textShadow: '0 3px 8px rgba(0,0,0,0.7)'}}>{s}</div>
						</div>
					);
				})}
			</div>
			{f >= yrs ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', transform: `scale(${0.55 + 0.45 * slam(f, yrs)}) rotate(-2deg)`}}>
					<HeroWord text="سنوات" size={180} strip={C.charcoal} />
				</div>
			) : null}
			{f >= yrs + 4 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1010, display: 'flex', justifyContent: 'center', ...appear(f, yrs + 4)}}>
					<Badge text="بناء وتجهيز مصنع رقائق بياخد عادةً سنين" color={C.yellow} bg="rgba(20,22,26,0.9)" size={24} rot={-1} />
				</div>
			) : null}
		</>
	);
};

export const _p = {kf, Img, staticFile, SHADOW, TechTag, PixelRow, Stage};
