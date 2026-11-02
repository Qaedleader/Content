// 42.9 – 48.07 s · «بس السؤال الأخطر... إنستغرام توقع شو راح تفكر فيه؟ ولا هو اللي خلاك تفكر فيه؟»
// Two readings stacked (prediction vs influence), then they close into a loop: «توقّعك… ولا أثّر عليك؟»
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {HeroWord} from '../../../brand/type';
import {M, W, wf} from '../ep';
import {PixelRow, Shot} from '../../asml/kit';
import {CR} from '../credits';
import {Icon, IconName} from '../ui';

const Node: React.FC<{icon: IconName; text: string; hot?: boolean}> = ({icon, text, hot}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: 200}}>
		<div style={{width: 104, height: 104, borderRadius: '50%', background: hot ? C.yellow : 'rgba(251,248,241,0.12)', border: `3px solid ${hot ? C.yellow : 'rgba(251,248,241,0.5)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<Icon name={icon} size={56} color={hot ? C.charcoal : C.paper} stroke={2.4} />
		</div>
		<span dir="rtl" style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 32, color: C.paperWhite, whiteSpace: 'nowrap'}}>{text}</span>
	</div>
);

/** One reading: heading + three nodes joined by arrows (flow right → left). */
const Panel: React.FC<{f: number; at: number; y: number; head: string; nodes: [IconName, string][]; hotLast?: boolean; out: number}> = ({f, at, y, head, nodes, hotLast, out}) => {
	if (f < at) return null;
	const p = pop(f, at, {damping: 14, stiffness: 200, mass: 0.7});
	const draw = (i: number) => prog(f, at + 4 + i * 3, at + 9 + i * 3);
	return (
		<div style={{position: 'absolute', left: 60, right: 60, top: y, height: 440, transform: `scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 2) * (1 - out)}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: 22, background: 'rgba(12,15,21,0.82)', border: `3px solid ${C.yellow}`, filter: SHADOW.lifted}} />
			<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: FONT.display, fontWeight: 900, fontSize: 62, color: C.yellow}}>
				{head}
			</div>
			<div dir="rtl" style={{position: 'absolute', left: 30, right: 30, top: 170, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
				{nodes.map(([ic, t], i) => (
					<React.Fragment key={i}>
						<div style={{transform: `scale(${pop(f, at + 2 + i * 3)})`}}>
							<Node icon={ic} text={t} hot={hotLast && i === nodes.length - 1} />
						</div>
						{i < nodes.length - 1 ? (
							<svg width={70} height={104} style={{flexShrink: 0}}>
								<path d={`M64 52 L${64 - 52 * draw(i)} 52`} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" />
								<path d="M22 36 L6 52 L22 68" fill="none" stroke={C.yellow} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={draw(i) > 0.9 ? 1 : 0} />
							</svg>
						) : null}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export const Finale: React.FC<{f: number; end: number}> = ({f, end}) => {
	const a = wf(W.bas);
	const q = wf(W.insta3);
	const or = wf(W.wala2) - 1;
	const loop = wf(W.khallak);
	if (f < a || f > end) return null;
	const close = prog(f, loop, loop + 10, EASE.io);
	return (
		<AbsoluteFill style={{background: '#07090c'}}>
			<Shot f={f} a={a} b={q - 1} src={M('l_curtain.mp4')} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.04, s1: 1.12}} dim={0.4} />
			<Shot f={f} a={q} b={end} src={M('l_night.mp4')} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.08, s1: 1.16}} dim={0.55 + 0.2 * close} grade="grayscale(1) contrast(1.1) brightness(0.8)" />
			{f < q ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 720, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, transform: `scale(${0.55 + 0.45 * slam(f, wf(W.akhtar) - 6)})`, opacity: f >= wf(W.akhtar) - 6 ? 1 - prog(f, q - 5, q) : 0}}>
					<HeroWord text="السؤال الأخطر" size={140} strip={C.charcoal} />
					<PixelRow n={8} lit={Math.min(8, Math.max(0, Math.floor((f - wf(W.akhtar)) / 2)))} size={16} gap={8} />
				</div>
			) : null}
			<Panel f={f} at={q} y={260} head="توقّع اهتمامك؟" nodes={[['user', 'سلوكك'], ['spark', 'الخوارزمية'], ['play', 'توقّع']]} out={close} />
			<Panel f={f} at={or} y={760} head="ولا صنعه؟" nodes={[['spark', 'الخوارزمية'], ['play', 'اقتراح'], ['user', 'اهتمام جديد']]} hotLast out={close} />
			{/* the loop: prediction ⇄ influence */}
			{f >= loop ? (
				<>
					<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: close}}>
						<g transform={`rotate(${(f - loop) * 1.6} 540 640)`}>
							<path d="M 540 410 A 230 230 0 0 1 770 640" fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" />
							<path d="M 540 870 A 230 230 0 0 1 310 640" fill="none" stroke={C.paperWhite} strokeWidth={10} strokeLinecap="round" />
							<path d="M 748 610 L 770 646 L 794 612" fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
							<path d="M 332 670 L 310 634 L 286 668" fill="none" stroke={C.paperWhite} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
						</g>
					</svg>
					<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', gap: 60, opacity: close, transform: `scale(${kf(close, [0, 1], [0.7, 1])})`}}>
						<Node icon="user" text="أنت" />
						<Node icon="spark" text="الخوارزمية" hot />
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 960, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transform: `scale(${0.55 + 0.45 * slam(f, loop + 3)})`, opacity: f >= loop + 3 ? 1 : 0}}>
						<HeroWord text="توقّعك" size={136} strip={C.charcoal} />
						<HeroWord text="ولا أثّر عليك؟" size={136} face={C.paperWhite} strip={C.charcoal} stripSeed={7} />
					</div>
				</>
			) : null}
		</AbsoluteFill>
	);
};
