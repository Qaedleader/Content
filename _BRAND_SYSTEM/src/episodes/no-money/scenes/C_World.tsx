// Scene C — «تخيّل عالم الذكاء الاصطناعي والروبوتات بيعملوا فيه 99.9% من كل إشي»
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {Camera, PaperCounter, Stage} from '../../../brand/diagram';
import {Backdrop} from '../../../brand/paper';
import {Chip, FlowPath, G, Icon, SvgDefs} from '../../../brand/props';
import {IndustrialWorld} from '../../../brand/scenes/IndustrialWorld';
import {C, SHADOW} from '../../../brand/tokens';
import {Badge, TitleCard} from '../../../brand/type';
import {S, wf} from '../ep';

const ICONS = ['car', 'house', 'bread', 'shirt', 'pill', 'bolt'] as const;

export const WorldScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.C;
	const chip = pop(f, wf(14) - 2);
	const chipOut = prog(f, wf(20) - 6, wf(20) + 2, EASE.in);
	const sig = (k: number) => prog(f, wf(14) + 4 + k * 3, wf(14) + 16 + k * 3, EASE.out);
	const cIn = slam(f, wf(19) - 2);
	const val = kf(f, [wf(19), wf(19) + 30], [0, 99.9], EASE.out5);
	const pct = pop(f, wf(19) + 30);
	const push = kf(f, [a, S.C[1]], [1.18, 1.1], EASE.out);
	return (
		<AbsoluteFill>
			<Backdrop color={C.navy} pattern="dots" ink="rgba(255,255,255,0.05)" light={0.2} />
			<Camera scale={push} y={70}>
				<Stage>
					<SvgDefs />
					<IndustrialWorld f={f} at={a + 1} robotsAt={wf(16) - 2} flowsAt={wf(17)} />
					{/* the AI "brain" sending signals down to every machine */}
					{chip > 0 && chipOut < 1 ? (
						<g opacity={1 - chipOut}>
							<FlowPath d="M540,770 Q350,840 200,960" draw={sig(0)} frame={f} width={6} dash={14} />
							<FlowPath d="M540,770 Q700,840 800,950" draw={sig(1)} frame={f} width={6} dash={14} />
							<FlowPath d="M540,770 L540,1050" draw={sig(2)} frame={f} width={6} dash={14} />
							<G x={540} y={700} s={0.75 * chip} r={(1 - chip) * 30} f="sh">
								<Chip glow={0.5 + 0.5 * Math.sin(f / 4)} />
							</G>
						</g>
					) : null}
					{/* «من كل إشي» */}
					{ICONS.map((n, i) => {
						const p = pop(f, wf(20) - 1 + i * 2);
						if (p <= 0) return null;
						const x = 540 + (i - 2.5) * 136;
						return (
							<G key={n} x={x} y={850} s={p} r={(1 - p) * 40} f="sh">
								<circle r={58} fill={C.paperWhite} stroke="rgba(30,20,10,0.2)" strokeWidth={2} />
								<Icon name={n} s={0.54} />
							</G>
						);
					})}
				</Stage>
			</Camera>
			<TitleCard frame={f} at={wf(12)} text="تخيّل: عالم شبه آلي بالكامل" />
			<div style={{position: 'absolute', left: 60, top: 300, transform: `scale(${pop(f, wf(12) + 6)})`, transformOrigin: 'left top'}}>
				<Badge text="سيناريو افتراضي" color={C.yellow} bg="rgba(20,30,45,0.9)" size={24} />
			</div>
			{cIn > 0 ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 430, display: 'flex', justifyContent: 'center', transform: `scale(${0.4 + 0.6 * cIn}) translateY(${(1 - cIn) * -200}px)`}}>
					<div style={{position: 'relative', padding: '26px 34px', background: 'rgba(20,30,45,0.55)', borderRadius: 24, filter: SHADOW.lifted}}>
						<PaperCounter value={val} decimals={1} size={150} suffix={pct > 0.5 ? '%' : ''} seed={4} />
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
