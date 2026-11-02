// 0.00 – 3.48 s · «ما هو الفرق بين AI والـAI Agent بأبسط صورة؟»
// Frame 0 is already a full composition: AI (answers in a bubble) vs AI Agent (the same core wired to tools, acting toward a goal).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog} from '../../../brand/anim';
import {SvgDefs} from '../../../brand/props';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {HeroWord} from '../../../brand/type';
import {W, wf} from '../ep';
import {ACT, AiCore, along, Envelope, Ground, INFO, Plane, polyD, Pt, SIco} from '../kit';

const PL = {ai: {x: 770, y: 900}, agent: {x: 310, y: 900}, w: 400, h: 600};

export const Hook: React.FC<{f: number; end: number}> = ({f, end}) => {
	if (f > end) return null;
	const aiOn = prog(f, wf(W.ai) - 2, wf(W.ai) + 6);
	const agOn = prog(f, wf(W.agent) - 2, wf(W.agent) + 6);
	// whole frame settles from a slight push at frame 0, then pushes into the agent side before the cut
	const s = kf(f, [0, 30, end - 14, end], [1.05, 1, 1, 1.12], EASE.out);
	const ox = kf(f, [end - 14, end], [0, 120], EASE.in);
	const t0 = wf(W.agent) + 2; // agent starts acting
	// agent network (local coords inside the left plate, origin = plate centre)
	const core = {x: 0, y: -120};
	const toolIn = {x: 120, y: 60};
	const toolOut = {x: -120, y: 60};
	const goal = {x: 0, y: 200};
	const pathIn: Pt[] = [{x: 260, y: -60}, toolIn, {x: 60, y: -60}, core];
	const pathOut: Pt[] = [core, {x: -60, y: -60}, toolOut, {x: -60, y: 200}, goal];
	const tin = prog(f, t0, t0 + 14, EASE.io);
	const tout = prog(f, t0 + 16, t0 + 34, EASE.io);
	const hit = pop(f, t0 + 34, {damping: 9, stiffness: 240, mass: 0.6});
	const bubble = prog(f, wf(W.ai), wf(W.ai) + 10, EASE.out);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Ground shift={f * 0.6} />
			<AbsoluteFill style={{transform: `translateX(${ox}px) scale(${s})`, transformOrigin: '310px 900px'}}>
				{/* hero question */}
				<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', transform: `scale(${kf(f, [0, 10], [0.92, 1], EASE.back)})`}}>
					<HeroWord text="ما الفرق؟" size={150} />
				</div>
				{/* plates */}
				{(['ai', 'agent'] as const).map((k) => {
					const p = PL[k];
					const on = k === 'ai' ? aiOn : agOn;
					return (
						<div
							key={k}
							style={{
								position: 'absolute',
								left: p.x - PL.w / 2,
								top: p.y - PL.h / 2,
								width: PL.w,
								height: PL.h,
								borderRadius: 36,
								background: 'rgba(14,18,26,0.78)',
								border: `4px solid ${on > 0.5 ? C.yellow : 'rgba(251,248,241,0.22)'}`,
								filter: SHADOW.lifted,
								transform: `translateY(${-on * 16}px) scale(${1 + on * 0.03})`,
							}}
						/>
					);
				})}
				<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
					<SvgDefs />
					{/* AI: a core that answers */}
					<g transform={`translate(${PL.ai.x} ${PL.ai.y - 120 - aiOn * 16})`}>
						<AiCore S={190} glow={aiOn * 0.6} think={aiOn} frame={f} />
					</g>
					<g transform={`translate(${PL.ai.x} ${PL.ai.y + 95 - aiOn * 16}) scale(${0.85 + 0.15 * bubble + aiOn * 0.03})`}>
						<path d="M-150,-62 Q-150,-80 -132,-80 L132,-80 Q150,-80 150,-62 L150,52 Q150,70 132,70 L-30,70 L-60,104 L-62,70 L-132,70 Q-150,70 -150,52 Z" fill={C.paperWhite} filter="url(#shs)" />
						{[0, 1, 2].map((i) => (
							<rect key={i} x={-118} y={-54 + i * 38} width={(i === 2 ? 140 : 236) * Math.max(0.15, prog(f, wf(W.ai) + i * 4, wf(W.ai) + 8 + i * 4))} height={16} rx={8} fill={i === 0 ? C.charcoal : 'rgba(38,35,33,0.35)'} transform="scale(-1 1)" />
						))}
					</g>
					{/* AI Agent: the same core, wired to tools, acting toward a goal */}
					<g transform={`translate(${PL.agent.x} ${PL.agent.y - agOn * 16})`}>
						<path d={polyD(pathIn)} fill="none" stroke="rgba(251,248,241,0.35)" strokeWidth={6} strokeDasharray="12 10" />
						<path d={polyD(pathOut)} fill="none" stroke="rgba(242,182,48,0.55)" strokeWidth={6} strokeDasharray="12 10" />
						<g transform={`translate(${core.x} ${core.y})`}>
							<AiCore S={150} glow={agOn * 0.7} think={tin > 0 && tout < 1 ? 1 : 0} frame={f} />
						</g>
						{[
							{pt: toolIn, icon: 'inbox' as const, col: INFO, lit: tin > 0.3 && tin < 1},
							{pt: toolOut, icon: 'send' as const, col: ACT, lit: tout > 0.25 && tout < 0.7},
						].map((t, i) => (
							<g key={i} transform={`translate(${t.pt.x} ${t.pt.y})`}>
								<circle r={46} fill={t.lit ? t.col : 'rgba(14,18,26,0.95)'} stroke={t.col} strokeWidth={5} filter="url(#shs)" />
								<SIco name={t.icon} size={50} color={t.lit ? C.charcoal : t.col} stroke={2.4} />
							</g>
						))}
						<g transform={`translate(${goal.x} ${goal.y}) scale(${1 + hit * 0.18 - (hit > 0 ? 0.18 * prog(f, t0 + 40, t0 + 52) : 0)})`}>
							<circle r={50} fill={hit > 0.2 ? C.yellow : 'rgba(14,18,26,0.95)'} stroke={C.yellow} strokeWidth={5} filter="url(#shs)" />
							<SIco name="target" size={58} color={hit > 0.2 ? C.charcoal : C.yellow} stroke={2.4} />
						</g>
						{tin > 0 && tin < 1 ? (
							<g transform={`translate(${along(pathIn, tin).x} ${along(pathIn, tin).y})`}>
								<Envelope w={70} />
							</g>
						) : null}
						{tout > 0 && tout < 1 ? (
							<g transform={`translate(${along(pathOut, tout).x} ${along(pathOut, tout).y}) rotate(${tout < 0.5 ? 200 : 120})`}>
								<Plane s={0.62} />
							</g>
						) : null}
						{hit > 0
							? Array.from({length: 8}).map((_, i) => {
									const a = (i / 8) * Math.PI * 2;
									const r1 = 62 + 40 * prog(f, t0 + 34, t0 + 44, EASE.out);
									const o = 1 - prog(f, t0 + 40, t0 + 48);
									return <line key={i} x1={goal.x + Math.cos(a) * 58} y1={goal.y + Math.sin(a) * 58} x2={goal.x + Math.cos(a) * r1} y2={goal.y + Math.sin(a) * r1} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" opacity={o} />;
								})
							: null}
					</g>
				</svg>
				{/* plate names (Latin) + Arabic verbs: AI answers, the agent acts */}
				{(['ai', 'agent'] as const).map((k) => {
					const p = PL[k];
					const on = k === 'ai' ? aiOn : agOn;
					return (
						<div key={k} style={{position: 'absolute', left: p.x - PL.w / 2, width: PL.w, top: p.y + PL.h / 2 + 22 - on * 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
							<div dir="ltr" style={{fontFamily: FONT.hero, fontWeight: 400, fontSize: 76, lineHeight: 1, color: on > 0.5 ? C.yellow : C.paperWhite, whiteSpace: 'nowrap'}}>
								{k === 'ai' ? 'AI' : 'AI Agent'}
							</div>
						</div>
					);
				})}
				<div style={{position: 'absolute', left: 540 - 40, top: PL.ai.y - 40, width: 80, height: 80, borderRadius: '50%', background: C.paperWhite, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: SHADOW.lifted, fontFamily: FONT.display, fontWeight: 900, fontSize: 30, color: C.charcoal}}>
					VS
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
