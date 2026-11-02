// 34.7 – 37.8 s · «وبناءً على هيك بتوقع شو ممكن يجذبك بالمستقبل»
// Last night's signals → candidate topics scored and re-ranked; «الحياة في أوروبا» rises to the top (a probability, not certainty).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, TitleCard} from '../../../brand/type';
import {M, W, wf} from '../ep';
import {Shot} from '../../asml/kit';
import {CR} from '../credits';
import {Icon, IconName, Media} from '../ui';

const TOPICS: {t: string; icon: IconName; score: number; from: number; to: number}[] = [
	{t: 'رحلات القطار', icon: 'clock', score: 0.71, from: 0, to: 1},
	{t: 'ديكور الشقق الصغيرة', icon: 'book', score: 0.58, from: 1, to: 2},
	{t: 'الحياة في أوروبا', icon: 'plane', score: 0.92, from: 2, to: 0},
	{t: 'مقاهي حول العالم', icon: 'heart', score: 0.46, from: 3, to: 3},
];
const ROW_Y = (i: number) => 640 + i * 150;
const THUMBS = ['t_cafe.jpg', 't_apt.jpg', 't_train.jpg'];

export const Predict: React.FC<{f: number; end: number}> = ({f, end}) => {
	const a = wf(W.wbinaa);
	const score = wf(W.btitwaqqa) - 2;
	const rank = wf(W.yejthbak) - 2;
	if (f < a || f > end) return null;
	const r = prog(f, rank, rank + 12, EASE.io);
	return (
		<AbsoluteFill>
			<Shot f={f} a={a} b={end} src={M('j_bg.mp4')} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.06, s1: 1.14}} dim={0.62} grade="blur(3px) contrast(1.05) saturate(0.85)" />
			<TitleCard frame={f} at={a + 1} text="بتوقّع شو ممكن يجذبك" size={46} seed={61} />
			{/* inputs */}
			<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: 320, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
				{THUMBS.map((t, i) => (
					<React.Fragment key={t}>
						<div style={{width: 92, height: 164, borderRadius: 10, overflow: 'hidden', boxShadow: `0 0 0 3px ${C.yellow}`, transform: `scale(${pop(f, a + 2 + i * 2)})`, filter: SHADOW.soft}}>
							<Media src={M(t)} />
						</div>
						{i < 2 ? <span style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 44, color: C.yellow, opacity: prog(f, a + 6, a + 10)}}>+</span> : null}
					</React.Fragment>
				))}
			</div>
			<svg width={1080} height={120} style={{position: 'absolute', left: 0, top: 492}}>
				<path d="M540 6 L540 92" stroke={C.yellow} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${prog(f, a + 8, a + 16) * 90} 200`} />
				<path d="M520 76 L540 100 L560 76" fill="none" stroke={C.yellow} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={prog(f, a + 14, a + 17)} />
			</svg>
			{/* candidate list */}
			{TOPICS.map((tp, i) => {
				const p = pop(f, a + 10 + i * 3, {damping: 14, stiffness: 230, mass: 0.6});
				const y = kf(r, [0, 1], [ROW_Y(tp.from), ROW_Y(tp.to)]);
				const top = tp.to === 0;
				const hot = top && r > 0.5;
				const bar = tp.score * prog(f, score + i * 2, score + 14 + i * 2, EASE.out);
				return (
					<div key={i} dir="rtl" style={{position: 'absolute', left: 90, right: 90, top: y, height: 124, transform: `translateX(${(1 - p) * -700}px) scale(${hot ? 1 + 0.05 * r : 1})`, zIndex: top ? 2 : 1}}>
						<div style={{position: 'absolute', inset: 0, borderRadius: 16, background: hot ? C.yellow : 'rgba(251,248,241,0.95)', filter: SHADOW.lifted, display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px'}}>
							<div style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 44, width: 46, color: C.charcoal}}>{['١', '٢', '٣', '٤'][r > 0.5 ? tp.to : tp.from]}</div>
							<div style={{width: 64, height: 64, borderRadius: '50%', background: hot ? C.charcoal : C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<Icon name={tp.icon} size={38} color={hot ? C.yellow : C.paper} />
							</div>
							<div style={{flex: 1}}>
								<div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 38, color: C.charcoal, lineHeight: 1.3}}>{tp.t}</div>
								<div style={{position: 'relative', height: 12, borderRadius: 6, background: 'rgba(38,35,33,0.15)', marginTop: 8}}>
									<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${bar * 100}%`, borderRadius: 6, background: hot ? C.charcoal : C.yellowShade}} />
								</div>
							</div>
							<div dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 30, color: C.charcoal, width: 90, textAlign: 'center'}}>{Math.round(bar * 100)}%</div>
						</div>
					</div>
				);
			})}
			{f >= wf(W.mustaqbal) - 2 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1262, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, wf(W.mustaqbal) - 2)})`}}>
					<Badge text="ترتيب حسب الاحتمال · مش يقين" color={C.yellow} bg="rgba(14,18,26,0.9)" size={28} rot={-1} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
