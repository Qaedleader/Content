// 18.7 – 25.5 s · «طب كيف عرف؟ كل وقف عند فيديو وكل إعادة مشاهدة وحتى الفيديوهات اللي بتتخطاها كلها إشارات»
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, rand, slam} from '../../../brand/anim';
import {C} from '../../../brand/tokens';
import {HeroWord} from '../../../brand/type';
import {M, W, wf} from '../ep';
import {Shot} from '../../asml/kit';
import {CR} from '../credits';
import {IconName, SignalChip, WatchBar} from '../ui';

const CHIPS: {icon: IconName; text: string; word: number}[] = [
	{icon: 'pause', text: 'توقف', word: W.waqf},
	{icon: 'replay', text: 'إعادة', word: W.iada},
	{icon: 'skip', text: 'تخطي', word: W.videos},
];

export const Signals: React.FC<{f: number; end: number}> = ({f, end}) => {
	const a = wf(W.tab);
	const scroll = wf(W.kol);
	const skip = wf(W.wa7atta);
	const all = wf(W.kollha);
	if (f < a || f > end) return null;
	const g = prog(f, all, all + 12, EASE.io); // chips gather into the signal stream
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			<Shot f={f} a={a} b={scroll - 1} src={M('g_hands1.mp4')} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.1, s1: 1.04}} dim={0.35} />
			<Shot f={f} a={scroll} b={skip - 1} src={M('g_scroll.mp4')} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.04, s1: 1.1}} dim={0.1} />
			<Shot f={f} a={skip} b={all + 4} src={M('g_hands2.mp4')} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.06, s1: 1.14, y0: 0, y1: -30}} dim={0.2 + 0.6 * g} />
			{f < scroll ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', transform: `scale(${0.5 + 0.5 * slam(f, a + 2)}) rotate(-2deg)`}}>
					<HeroWord text="طب كيف عرف؟" size={140} strip={C.charcoal} />
				</div>
			) : null}

			{/* signal stream (pixel squares flowing left out of each chip) */}
			{g > 0 ? (
				<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: g}}>
					{[0, 1, 2, 3].map((r) =>
						Array.from({length: 18}).map((_, i) => {
							const y = 737 + r * 130;
							const x = ((i * 64 + (f - all) * 14 + rand(r * 7 + i) * 30) % 1150) - 60;
							const size = 10 + rand(r * 13 + i) * 10;
							const hot = rand(r * 31 + i) > 0.45;
							return <rect key={`${r}-${i}`} x={440 - x} y={y - size / 2} width={size} height={size} fill={hot ? C.yellow : 'rgba(251,248,241,0.55)'} opacity={Math.max(0, 1 - (x / 620) ** 2)} />;
						}),
					)}
				</svg>
			) : null}

			{/* watch time — the fourth signal, running the whole time */}
			{f >= scroll ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: kf(g, [0, 1], [250, 1150 - 60]), display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, scroll)})`}}>
					<WatchBar p={prog(f, scroll, all, EASE.linear)} w={640} />
				</div>
			) : null}
			{CHIPS.map((c, i) => {
				const at = wf(c.word) - 1;
				if (f < at) return null;
				const y0 = 860 + i * 120;
				const y1 = 700 + i * 130 + 0;
				const x0 = 60;
				const y = kf(g, [0, 1], [y0, y1]);
				return (
					<div key={i} style={{position: 'absolute', right: kf(g, [0, 1], [x0, 380]), top: y, transform: `translateY(${c.icon === 'skip' ? -40 * prog(f, at, at + 10, EASE.out) : 0}px)`}}>
						<SignalChip f={f} at={at} icon={c.icon} text={c.text} size={46} />
					</div>
				);
			})}
			{f >= all ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', transform: `scale(${0.5 + 0.5 * slam(f, wf(W.isharat) - 2)})`, opacity: f >= wf(W.isharat) - 2 ? 1 : 0}}>
					<HeroWord text="كلها إشارات" size={140} strip={C.charcoal} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
