// 37.8 – 42.9 s · «وهذا مجرد مثال قيسوا على الشغل والدراسة والشراء وكل إشي بحياتك»
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {pop, slam} from '../../../brand/anim';
import {C} from '../../../brand/tokens';
import {HeroWord, TitleCard} from '../../../brand/type';
import {M, W, wf} from '../ep';
import {Shot} from '../../asml/kit';
import {CR} from '../credits';
import {IconName, SignalChip} from '../ui';

const CATS: {word: number; src: string; hero: string; rec: string; icon: IconName}[] = [
	{word: W.shoghl, src: 'k_office.mp4', hero: 'الشغل', rec: 'مقترح: فرص عمل', icon: 'brief'},
	{word: W.dirasa, src: 'k_lib.mp4', hero: 'الدراسة', rec: 'مقترح: كورسات', icon: 'book'},
	{word: W.shira, src: 'k_shop.mp4', hero: 'الشراء', rec: 'مقترح: منتجات', icon: 'bag'},
];
const LIFE: {src: string; rec: string; icon: IconName}[] = [
	{src: 'k_run.mp4', rec: 'رياضة', icon: 'heart'},
	{src: 'k_fruit.mp4', rec: 'أكل', icon: 'spark'},
	{src: 'k_flor.mp4', rec: 'سفر', icon: 'plane'},
];

export const Montage: React.FC<{f: number; end: number}> = ({f, end}) => {
	const a = wf(W.hatha);
	const work = wf(W.qeesu);
	const life = wf(W.wkol2);
	if (f < a || f > end) return null;
	const lifeCuts = [life, life + 15, life + 31, end + 1];
	return (
		<AbsoluteFill>
			<Shot f={f} a={a} b={work - 1} src={M('k_ams.mp4')} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.04, s1: 1.1}} dim={0.15} />
			{f < work ? <TitleCard frame={f} at={a + 1} text="وهذا مجرد مثال" size={52} seed={71} out={work - 5} /> : null}
			{CATS.map((c, i) => {
				const s = i === 0 ? work : wf(c.word) - 1;
				const e = i < 2 ? wf(CATS[i + 1].word) - 2 : life - 1;
				if (f < s || f > e) return null;
				const at = wf(c.word) - 1;
				return (
					<React.Fragment key={i}>
						<Shot f={f} a={s} b={e} src={M(c.src)} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.12, s1: 1.04}} dim={0.12} />
						{f >= at ? (
							<div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
								<div style={{transform: `scale(${0.5 + 0.5 * slam(f, at)}) rotate(${(i - 1) * 2}deg)`}}>
									<HeroWord text={c.hero} size={160} strip={C.charcoal} />
								</div>
								<SignalChip f={f} at={at + 4} icon={c.icon} text={c.rec} size={40} />
							</div>
						) : null}
					</React.Fragment>
				);
			})}
			{LIFE.map((l, i) =>
				f >= lifeCuts[i] && f < lifeCuts[i + 1] ? (
					<React.Fragment key={i}>
						<Shot f={f} a={lifeCuts[i]} b={lifeCuts[i + 1] - 1} src={M(l.src)} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.1, s1: 1.02}} dim={0.15} />
						<div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center'}}>
							<SignalChip f={f} at={lifeCuts[i] + 1} icon={l.icon} text={`مقترح: ${l.rec}`} size={40} />
						</div>
					</React.Fragment>
				) : null,
			)}
			{f >= life ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', transform: `scale(${0.5 + 0.5 * pop(f, life)}) rotate(-2deg)`}}>
					<HeroWord text="وكل إشي بحياتك" size={124} strip={C.charcoal} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
