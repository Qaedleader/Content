// 5.6 – 13.6 s · «تخيل بالليل حضرت فيديو لمقهى تحت المطر، بعده شقة صغيرة، وبعده قطار بأوروبا، ولا مرة بحثت عن السفر»
// Real footage becomes feed cards; each watched video drops into a «tonight» history strip (café → apartment → train).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, pop, prog, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, TitleCard, typed} from '../../../brand/type';
import {M, W, wf} from '../ep';
import {Shot} from '../../asml/kit';
import {CR} from '../credits';
import {fadeIn, Icon, Media, morphRect, ReelCard, SignalChip} from '../ui';

const FULL = {x: 0, y: 0, w: 1080, h: 1920, r: 0};
const CARD = {x: 305, y: 470, w: 470, h: 836, r: 34};
const SLOT_X = [780, 540, 300]; // RTL: first video on the right
const SLOT = (i: number) => ({x: SLOT_X[i] - 48, y: 232, w: 96, h: 170, r: 10});
const TIMES = ['١١:٤٧ م', '١١:٤٩ م', '١١:٥٢ م'];

/** Café card content: the night café seen through rain on glass (two real clips, screen-blended). */
const CafeContent: React.FC<{from: number}> = ({from}) => (
	<>
		<Media src={M('b_cafe.mp4')} from={from} style={{filter: 'contrast(1.08) saturate(0.95) brightness(0.92)'}} />
		<Media src={M('b_rain.mp4')} from={from} style={{mixBlendMode: 'screen', opacity: 0.6}} />
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 70% at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)'}} />
	</>
);

const Box: React.FC<{r: {x: number; y: number; w: number; h: number; r: number}; children?: React.ReactNode; shadow?: boolean}> = ({r, children, shadow = true}) => (
	<div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: r.r, overflow: 'hidden', filter: shadow && r.r > 2 ? SHADOW.lifted : undefined}}>{children}</div>
);

/** History strip slots + connecting line + time labels. */
const Strip: React.FC<{f: number; filled: number[]; a: number; b: number}> = ({f, filled, a, b}) => {
	const o = Math.min(prog(f, a, a + 8), 1 - prog(f, b - 6, b));
	if (o <= 0) return null;
	return (
		<div style={{position: 'absolute', inset: 0, opacity: o}}>
			<svg width={1080} height={420} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={SLOT_X[0]} y1={317} x2={SLOT_X[2]} y2={317} stroke="rgba(251,248,241,0.35)" strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" />
				{filled[1] >= 0 ? <line x1={SLOT_X[0]} y1={317} x2={SLOT_X[0] - (SLOT_X[0] - SLOT_X[1]) * prog(f, filled[1], filled[1] + 10)} y2={317} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" /> : null}
				{filled[2] >= 0 ? <line x1={SLOT_X[1]} y1={317} x2={SLOT_X[1] - (SLOT_X[1] - SLOT_X[2]) * prog(f, filled[2], filled[2] + 10)} y2={317} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" /> : null}
			</svg>
			{SLOT_X.map((x, i) => (
				<React.Fragment key={i}>
					<div style={{position: 'absolute', left: x - 48, top: 232, width: 96, height: 170, borderRadius: 10, border: '3px dashed rgba(251,248,241,0.4)', background: 'rgba(14,18,26,0.55)'}} />
					<div dir="rtl" style={{position: 'absolute', left: x - 80, width: 160, top: 410, textAlign: 'center', fontFamily: FONT.mono, fontWeight: 700, fontSize: 22, color: filled[i] >= 0 && f >= filled[i] ? C.yellow : 'rgba(251,248,241,0.5)'}}>
						{TIMES[i]}
					</div>
				</React.Fragment>
			))}
			<div dir="rtl" style={{position: 'absolute', right: 40, top: 170, fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: C.paperWhite, display: 'flex', alignItems: 'center', gap: 10}}>
				<Icon name="moon" size={30} color={C.yellow} />
				سجل الليلة
			</div>
		</div>
	);
};

export const Night: React.FC<{f: number; end: number}> = ({f, end}) => {
	const a = wf(W.takhayyal);
	const cafe = wf(W.video1);
	const apt = wf(W.baadu);
	const train = wf(W.wbaadu);
	const train2 = wf(W.europe1) + 2;
	const never = wf(W.wala);
	if (f < a || f > end) return null;

	// café: full-bleed → card (on «تحت»), then up into slot 0 when the apartment scrolls in
	const toCard = (f - (wf(W.maqha) + 6)) / 14;
	const toSlot0 = (f - apt) / 12;
	const cafeRect = f < apt ? morphRect(toCard, FULL, CARD) : morphRect(toSlot0, CARD, SLOT(0));
	// apartment: rises from below into the card, then into slot 1 when the train cuts in
	const aptRect = f < train ? morphRect((f - apt) / 12, {...CARD, y: 1920}, CARD) : morphRect((f - train) / 11, CARD, SLOT(1));
	// train thumbnail drops into slot 2
	const trainIn = wf(W.europe1) + 6;
	const trainRect = morphRect((f - trainIn) / 12, {x: 340, y: 600, w: 400, h: 711, r: 26}, SLOT(2));

	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			{/* «تخيل بالليل» — rain on glass, city lights */}
			<Shot f={f} a={a} b={cafe - 1} src={M('b_bokeh.mp4')} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.12, s1: 1.04}} grade="contrast(1.05) saturate(0.9) brightness(0.9)" />
			{f < cafe ? <TitleCard frame={f} at={a + 1} text="تخيّل…" size={54} seed={31} out={cafe - 6} /> : null}
			{f >= wf(W.bellail) - 1 && f < cafe ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center'}}>
					<SignalChip f={f} at={wf(W.bellail) - 1} icon="moon" text="بالليل · ١١:٤٧ م" size={44} />
				</div>
			) : null}

			{/* backdrop once the café becomes a card */}
			{f >= cafe && f <= end ? (
				<AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 60% at 50% 55%, rgba(46,66,96,0.75), rgba(20,30,45,1) 80%)'}} />
			) : null}
			{f >= train && f < never ? (
				<>
					<Shot f={f} a={train} b={train2 - 1} src={M('d_train1.mp4')} credit={CR.train} kind="لقطات حقيقية" move={{s0: 1.04, s1: 1.12}} />
					<Shot f={f} a={train2} b={never - 1} src={M('d_train2.mp4')} credit={CR.train} kind="لقطات حقيقية" move={{s0: 1.1, s1: 1.04, x0: 30, x1: -30}} />
				</>
			) : null}

			{/* history strip */}
			<Strip f={f} filled={[apt + 10, train + 10, trainIn + 10]} a={apt} b={never} />

			{/* café */}
			{f >= cafe && f < never ? (
				<Box r={cafeRect}>
					<CafeContent from={cafe} />
					{f >= apt ? null : (
						<AbsoluteFill style={{opacity: fadeIn(f, wf(W.matar) - 2)}}>
							<ReelCard f={f} src="" w={cafeRect.w} h={cafeRect.h} handle="@rain.cafe" caption="ليلة ماطرة في المقهى" progress={prog(f, cafe, apt, EASE.linear)} ui={1} radius={0} />
						</AbsoluteFill>
					)}
				</Box>
			) : null}
			{f >= cafe && f < apt ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center'}}>
					<SignalChip f={f} at={wf(W.matar) + 2} icon="pause" text="توقّف وكمّله للآخر" size={38} />
				</div>
			) : null}
			{f >= wf(W.maqha) && f < wf(W.matar) + 2 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', opacity: fadeIn(f, wf(W.maqha)) * (1 - prog(f, wf(W.matar) - 4, wf(W.matar) + 2))}}>
					<Badge text="فيديو ١ · مقهى تحت المطر" color={C.yellow} bg="rgba(14,18,26,0.85)" size={30} rot={-1.5} />
				</div>
			) : null}

			{/* apartment */}
			{f >= apt && f < never ? (
				<Box r={aptRect}>
					<ReelCard f={f} src={M('c_apt.mp4')} from={apt} w={aptRect.w} h={aptRect.h} handle="@small.flat" caption="شقة صغيرة بإطلالة" progress={prog(f, apt, train, EASE.linear)} ui={f < train ? fadeIn(f, apt + 8) : 1 - prog(f, train, train + 4)} radius={0} />
				</Box>
			) : null}
			{f >= apt && f < train ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center'}}>
					<SignalChip f={f} at={wf(W.shaqqa) + 6} icon="replay" text="أعاد المشاهدة" size={38} />
				</div>
			) : null}

			{/* train: chip + thumbnail into the strip */}
			{f >= wf(W.qitar) + 4 && f < trainIn + 2 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center'}}>
					<SignalChip f={f} at={wf(W.qitar) + 4} icon="clock" text="مشاهدة طويلة" size={38} />
				</div>
			) : null}
			{f >= trainIn && f < never ? (
				<Box r={trainRect}>
					<Media src={M('t_train.jpg')} />
				</Box>
			) : null}

			{/* «ولا مرة بحثت عن السفر» */}
			{f >= never ? <NeverSearched f={f} a={never} end={end} /> : null}
		</AbsoluteFill>
	);
};

const NeverSearched: React.FC<{f: number; a: number; end: number}> = ({f, a, end}) => {
	const card = wf(W.bahatht) - 2;
	const q = typed('السفر', f, wf(W.safar) - 4, 14);
	return (
		<>
			<Shot f={f} a={a} b={end} src={M('e_window.mp4')} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.06, s1: 1.14}} dim={0.5} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', transform: `scale(${0.5 + 0.5 * slam(f, a + 1)}) rotate(-4deg)`}}>
				<HeroWord text="ولا مرة!" size={170} strip={C.charcoal} />
			</div>
			{f >= card ? (
				<div style={{position: 'absolute', left: 120, right: 120, top: 640, transform: `scale(${0.7 + 0.3 * pop(f, card)})`, opacity: Math.min(1, pop(f, card) * 2)}}>
					<div dir="rtl" style={{background: C.paperWhite, borderRadius: 22, padding: '28px 32px 30px', filter: SHADOW.lifted}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#ECE6DA', borderRadius: 40, padding: '16px 26px'}}>
							<Icon name="search" size={44} color={C.charcoal} stroke={2.6} />
							<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 46, color: C.charcoal, minHeight: 58}}>
								{q}
								<span style={{display: 'inline-block', width: 4, height: 46, marginRight: 6, background: C.charcoal, opacity: Math.floor(f / 8) % 2 === 0 ? 1 : 0, verticalAlign: 'middle'}} />
							</span>
						</div>
						<div style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 28, color: C.steelDark, marginTop: 26}}>عمليات البحث الأخيرة</div>
						<div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 36, color: C.charcoalSoft, marginTop: 10, opacity: 0.6}}>— لا يوجد بحث عن السفر —</div>
					</div>
				</div>
			) : null}
			{f >= wf(W.safar) + 4 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1040, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, wf(W.safar) + 4)})`}}>
					<Badge text="صفر عمليات بحث" color={C.yellow} bg="rgba(14,18,26,0.9)" size={34} rot={-2} />
				</div>
			) : null}
		</>
	);
};

