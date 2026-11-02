// 13.6 – 18.7 s · «بكرا بتفتح الإنستغرام بتلاقي فيديو كيف تترك بلدك وتبدأ حياة جديدة بأوروبا»
// Night → morning, then the recommended reel; last night's three videos connect to it (illustrative example).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, pop, prog} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, Label, TitleCard} from '../../../brand/type';
import {M, W, wf} from '../ep';
import {Shot} from '../../asml/kit';
import {CR} from '../credits';
import {fadeIn, Icon, Media, PhoneFrame, ReelCard, SignalChip} from '../ui';

/** «الليلة ● ─── ● بكرا» — the day changes. */
const DayLine: React.FC<{f: number; a: number}> = ({f, a}) => {
	const p = prog(f, a + 2, a + 16, EASE.io);
	const o = fadeIn(f, a, 6);
	return (
		<div dir="rtl" style={{position: 'absolute', left: 120, right: 120, top: 330, height: 80, opacity: o}}>
			<div style={{position: 'absolute', left: 60, right: 60, top: 38, height: 6, borderRadius: 3, background: 'rgba(251,248,241,0.3)'}} />
			<div style={{position: 'absolute', right: 60, top: 38, height: 6, borderRadius: 3, width: `${p * 100 * 0.86}%`, background: C.yellow}} />
			<div style={{position: 'absolute', right: 0, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
				<div style={{width: 80, height: 80, borderRadius: '50%', background: C.navy, border: `3px solid ${C.paper}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Icon name="moon" size={42} color={C.paper} />
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, top: 0, transform: `scale(${0.6 + 0.4 * p})`}}>
				<div style={{width: 80, height: 80, borderRadius: '50%', background: p > 0.95 ? C.yellow : C.navy, border: `3px solid ${C.yellow}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Icon name="sun" size={46} color={p > 0.95 ? C.charcoal : C.yellow} />
				</div>
			</div>
			<div style={{position: 'absolute', right: 6, top: 92, fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: C.paper}}>الليلة</div>
			<div style={{position: 'absolute', left: 10, top: 92, fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: C.yellow}}>بكرا</div>
		</div>
	);
};

const THUMBS = ['t_cafe.jpg', 't_apt.jpg', 't_train.jpg'];

export const Tomorrow: React.FC<{f: number; end: number}> = ({f, end}) => {
	const a = wf(W.bukra2);
	const bed = wf(W.insta2);
	const feed = wf(W.video2);
	const link = wf(W.europe2);
	if (f < a || f > end) return null;
	// phone geometry: centred, then shifted right & smaller when the night videos connect to it
	const g = prog(f, link, link + 12, EASE.io);
	const pw = 560;
	const ph = 1060;
	const s = 1 - 0.22 * g;
	const cx = 540 + 120 * g;
	const cy = 260 + ph / 2 + 70 * g;
	const enter = pop(f, feed, {damping: 14, stiffness: 170, mass: 0.8});
	const titleAt = wf(W.keef2) - 1;
	return (
		<AbsoluteFill>
			<Shot f={f} a={a} b={bed - 1} src={M('f_alarm.mp4')} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.08, s1: 1.02}} />
			<Shot f={f} a={bed} b={feed - 1} src={M('f_bed.mp4')} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.04, s1: 1.1}} />
			{f < feed ? (
				<>
					<TitleCard frame={f} at={a + 1} text="بكرا الصبح" size={54} seed={41} out={feed - 6} />
					<DayLine f={f} a={a} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 1130, display: 'flex', justifyContent: 'center'}}>
						<SignalChip f={f} at={bed + 2} icon="play" text="فتح التطبيق" size={40} />
					</div>
				</>
			) : null}
			{f >= feed ? (
				<>
					<Shot f={f} a={feed} b={end} src={M('f_bg.mp4')} move={{s0: 1.15, s1: 1.22}} grade="blur(10px) brightness(0.42) saturate(0.85)" />
					<div style={{position: 'absolute', left: 0, right: 0, top: 168, display: 'flex', justifyContent: 'center', opacity: fadeIn(f, feed + 4) * (1 - g)}}>
						<Badge text="مثال توضيحي · واجهة مبسّطة" color={C.paper} bg="rgba(14,18,26,0.8)" size={24} rot={0} />
					</div>
					<div style={{position: 'absolute', left: cx - pw / 2, top: cy - ph / 2, width: pw, height: ph, transform: `translateY(${(1 - enter) * 900}px) scale(${s})`}}>
						<PhoneFrame w={pw} h={ph}>
							<ReelCard
								f={f}
								src={M('f_paris.mp4')}
								from={feed}
								w={pw * 0.94}
								h={ph - pw * 0.06}
								handle="@new.life.eu"
								progress={prog(f, feed, end + 30, EASE.linear)}
								radius={0}
								tag={
									f >= feed + 6 ? (
										<div style={{transform: `scale(${pop(f, feed + 6)})`}}>
											<SignalChip f={f} at={feed + 6} icon="spark" text="مقترح لك" size={30} />
										</div>
									) : null
								}
								title={
									f >= titleAt ? (
										<div dir="rtl" style={{textAlign: 'center', transform: `scale(${0.8 + 0.2 * pop(f, titleAt)})`, opacity: Math.min(1, pop(f, titleAt) * 2)}}>
											<div style={{display: 'inline', fontFamily: FONT.display, fontWeight: 900, fontSize: 50, lineHeight: 1.5, color: C.charcoal, background: C.yellow, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', padding: '2px 14px'}}>
												كيف تبدأ حياة جديدة بأوروبا؟
											</div>
										</div>
									) : null
								}
							/>
						</PhoneFrame>
					</div>
				</>
			) : null}
			{/* last night's three videos → today's recommendation */}
			{f >= link ? (
				<>
					<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
						{THUMBS.map((_, i) => {
							const y = 620 + i * 280;
							const d = prog(f, link + 6 + i * 3, link + 18 + i * 3);
							const x2 = cx - (pw * s) / 2;
							const y2 = cy;
							const path = `M ${270} ${y} C ${330} ${y}, ${x2 - 80} ${y2}, ${x2} ${y2}`;
							return <path key={i} d={path} fill="none" stroke={C.yellow} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${d * 900} 2000`} />;
						})}
					</svg>
					{THUMBS.map((t, i) => {
						const p = pop(f, link + i * 3, {damping: 12, stiffness: 240, mass: 0.6});
						return (
							<div key={t} style={{position: 'absolute', left: 150, top: 620 + i * 280 - 115, width: 130, height: 230, borderRadius: 14, overflow: 'hidden', boxShadow: `0 0 0 4px ${C.paperWhite}`, transform: `scale(${p}) rotate(${(i - 1) * 3}deg)`, filter: SHADOW.lifted}}>
								<Media src={M(t)} />
							</div>
						);
					})}
					<div style={{position: 'absolute', left: 120, top: 400, opacity: fadeIn(f, link + 2)}}>
						<Label text="الليلة" size={34} bg={C.paperWhite} seed={5} />
					</div>
					<div style={{position: 'absolute', left: cx - 70, top: cy - (ph * s) / 2 - 70, opacity: fadeIn(f, link + 6)}}>
						<Label text="بكرا" size={34} bg={C.yellow} seed={6} />
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1290, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, link + 14)})`}}>
						<Badge text="بدون ولا عملية بحث" color={C.yellow} bg="rgba(14,18,26,0.92)" size={32} rot={-1.5} />
					</div>
				</>
			) : null}
		</AbsoluteFill>
	);
};

