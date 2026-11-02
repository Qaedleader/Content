// 15.9 – 24.4 s · Chapter C/D: «بس في مشكلة.. مين فينا عنده صبر يستنى 30 سنة؟» → «عشان هيك … لازم تتعلم تستخدم الذكاء الاصطناعي».
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {HeroWord, Label} from '../../../brand/type';
import {M, wf} from '../ep';
import {CR} from '../credits';
import {appear, CalendarBlock, Cam, GridStage, K, NeuralNet, Note, PixelMask, Shot, Sweep, TechTag} from '../kit';

/* ---------------- 15.88 – 19.04 s · the 30-year problem (the energy drops, time becomes heavy) ---------------- */
export const Problem: React.FC<{f: number}> = ({f}) => {
	const a = wf(42); // «بس»
	const prob = wf(44); // «مشكلة»
	const who = wf(45); // «مين فينا»
	const wait = wf(49); // «يستنى»
	const y30 = wf(50); // «30 سنة؟»
	const b = wf(52) - 1;
	// years flip slowly at first, then rush (2026 → 2056), then settle on the question
	const yp = prog(f, who, y30 + 4, (x) => x * x * x);
	const yearF = 30 * yp;
	const year = 2026 + Math.floor(yearF);
	const flip = yearF - Math.floor(yearF);
	const camS = kf(f, [a, b], [1.0, 1.06], EASE.linear);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 85% 60% at 50% 40%, #2A2522 0%, #171412 65%, #0B0A09 100%)`}} />
			{/* the paused chart, drained of colour: the energy stops here */}
			<AbsoluteFill style={{opacity: 1 - prog(f, a, prob + 4), filter: 'grayscale(1) brightness(0.5)'}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center'}}>
					<div dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 120, color: C.paper}}>$1,031,422</div>
				</div>
			</AbsoluteFill>
			<Cam s={camS}>
				{f >= prob ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', transform: `scale(${0.6 + 0.4 * slam(f, prob)}) rotate(-2deg)`, opacity: (1 - prog(f, who + 10, who + 18) * 0.65) * (1 - prog(f, y30 - 3, y30))}}>
						<HeroWord text="مشكلة" size={160} face={C.terracotta} back={C.charcoal} strip={C.paperWhite} />
					</div>
				) : null}
				{f >= who - 2 ? (
					<div style={{position: 'absolute', left: 330, top: 560, opacity: prog(f, who - 2, who + 6), transform: `translateY(${(1 - pop(f, who - 2, {damping: 16})) * 120}px)`}}>
						<CalendarBlock year={Math.min(2056, year)} flip={year >= 2056 ? 0 : flip} w={420} tone={prog(f, y30, y30 + 6)} />
					</div>
				) : null}
				{/* the 30-year bar under the calendar */}
				{f >= who ? (
					<div style={{position: 'absolute', left: 110, right: 110, top: 1110, opacity: prog(f, who, who + 6)}}>
						<div style={{height: 26, borderRadius: 13, background: 'rgba(244,236,221,0.12)', overflow: 'hidden', direction: 'ltr'}}>
							<div style={{width: `${yp * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.steel}, ${C.terracotta})`}} />
						</div>
						<div dir="ltr" style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: FONT.mono, fontWeight: 700, fontSize: 26, color: 'rgba(244,236,221,0.7)'}}>
							<span>2026</span>
							<span>2056</span>
						</div>
					</div>
				) : null}
			</Cam>
			{f >= y30 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', transform: `scale(${0.55 + 0.45 * slam(f, y30)}) rotate(-2deg)`}}>
					<HeroWord text="30 سنة؟" size={170} face={C.paperWhite} back={C.terracotta} strip={C.charcoal} />
				</div>
			) : null}
			{f >= wait ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1200, display: 'flex', justifyContent: 'center', ...appear(f, wait)}}>
					<Note text="لو عمرك 25 اليوم… بتوصل للمليون وعمرك 55" size={26} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/* ---------------- 19.04 – 24.40 s · the shortcut → AI (biggest transition) ---------------- */
export const AiReveal: React.FC<{f: number}> = ({f}) => {
	const a = wf(52); // «عشان هيك»
	const fast = wf(56); // «تسرع»
	const wealth = wf(58); // «للثروة»
	const now = wf(59); // «بوقتنا الحالي»
	const must = wf(61); // «لازم»
	const ai = wf(64); // «الذكاء الاصطناعي»
	const b = wf(66) - 1;
	// path diagram (19.04 – 22.38)
	const longD = 'M540 1180 C 140 1120, 120 980, 400 930 S 960 820, 760 700 S 140 620, 300 520 S 700 420, 540 360';
	const shortD = 'M540 1180 L540 360';
	const drawLong = prog(f, a + 2, a + 20);
	const drawShort = prog(f, fast - 2, fast + 12, EASE.out);
	const toAi = prog(f, must - 6, must + 2); // diagram dissolves into pixels
	return (
		<AbsoluteFill>
			<GridStage f={f} tint={`rgba(127,214,255,${0.05 + 0.1 * prog(f, now, must)})`} />
			{f < must + 4 ? (
				<AbsoluteFill style={{opacity: 1 - toAi}}>
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
						<path d={longD} fill="none" stroke="rgba(154,165,174,0.55)" strokeWidth={10} strokeDasharray="22 18" pathLength={1000} strokeDashoffset={0} style={{clipPath: `inset(${(1 - drawLong) * 100}% 0 0 0)`}} />
						<path d={shortD} fill="none" stroke={f >= now ? K.ai : C.yellow} strokeWidth={14} strokeLinecap="square" pathLength={1} strokeDasharray={`${drawShort} 1`} style={{filter: `drop-shadow(0 0 16px ${f >= now ? K.aiGlow : 'rgba(242,182,48,0.7)'})`}} />
					</svg>
					{/* labels */}
					<div style={{position: 'absolute', left: 0, right: 0, top: 1200, display: 'flex', justifyContent: 'center', ...appear(f, a + 2)}}>
						<Label text="اليوم" size={40} bg={C.paperWhite} seed={2} />
					</div>
					<div style={{position: 'absolute', left: 470, top: 250, transform: `scale(${pop(f, wealth)})`}}>
						<div style={{width: 140, height: 140, background: C.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.mono, fontWeight: 800, fontSize: 96, color: C.charcoal, boxShadow: '0 0 40px rgba(242,182,48,0.6)'}}>$</div>
					</div>
					<div style={{position: 'absolute', left: 60, top: 560, ...appear(f, a + 10)}}>
						<Label text="الطريق التقليدي · 30 سنة" size={30} bg="rgba(38,35,33,0.9)" fg={C.steel} font={FONT.label} />
					</div>
					{f >= fast ? (
						<div style={{position: 'absolute', left: 580, top: 760, transform: `scale(${pop(f, fast + 4)}) rotate(-3deg)`}}>
							<HeroWord text="أسرع" size={120} strip={C.charcoal} />
						</div>
					) : null}
					{f >= now ? (
						<div style={{position: 'absolute', left: 600, top: 980, transform: `scale(${pop(f, now)})`}}>
							<TechTag text="NOW · 2026" size={34} bg={K.ai} />
						</div>
					) : null}
				</AbsoluteFill>
			) : null}
			{/* the AI reveal: real NVIDIA DGX B200 under a pixel mosaic + neural overlay */}
			{f >= must - 2 ? (
				<AbsoluteFill style={{opacity: prog(f, must - 2, must + 3)}}>
					<Shot f={f} a={must - 2} b={b} src={M('m_dgx_b200.jpg')} credit={CR.dgxB200} move={{s0: 1.35, s1: 1.12, y0: 40, y1: -20}} ease={EASE.out} grade="contrast(1.15) saturate(0.85) brightness(0.8) hue-rotate(-8deg)" dim={0.2}>
						<Sweep pos={prog(f, ai - 4, b, EASE.linear)} strength={0.35} color="190,235,255" />
					</Shot>
					<PixelMask f={f} reveal={must} w={1080} h={1920} cell={60} seed={7} dur={14} />
					<div style={{position: 'absolute', left: 90, top: 470, mixBlendMode: 'screen', opacity: 0.9 * prog(f, must + 6, ai)}}>
						<NeuralNet f={f} draw={prog(f, must + 4, ai + 10)} w={900} h={620} seed={5} />
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1140, display: 'flex', justifyContent: 'center', ...appear(f, must + 10)}}>
						<Note text="NVIDIA DGX B200 · جهاز حقيقي لتدريب وتشغيل الذكاء الاصطناعي" size={24} />
					</div>
				</AbsoluteFill>
			) : null}
			{f >= ai ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 290, display: 'flex', justifyContent: 'center', transform: `scale(${0.55 + 0.45 * slam(f, ai)}) rotate(-2deg)`}}>
					<HeroWord text="الذكاء الاصطناعي" size={112} face={K.ai} back="#0B2A3A" strip={C.charcoal} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

export const _s = {SHADOW};
