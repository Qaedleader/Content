// Scene I — «الإنتاج بصير هائل، والتكلفة بتنهار، والمصاري رح يبطل إلها قيمة»
// Conceptual (not data): output stacks up, a cost tag crashes down; then the speaker's speculative conclusion about money.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, rand, shake} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {Backdrop} from '../../../brand/paper';
import {Banknote, CutText, G, Crate, SvgDefs} from '../../../brand/props';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../ep';

export const CostScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.I;
	const crash = wf(84);
	const sk = shake(f, crash, 14, 12);
	const line = prog(f, wf(83) - 2, crash + 2, EASE.in);
	const arrowUp = prog(f, wf(80), wf(82) + 6, EASE.out5);
	const moneyIn = pop(f, wf(85) - 2, {damping: 15});
	const shrink = prog(f, wf(86), wf(89) + 4, EASE.io);
	const q = pop(f, wf(89) - 1);
	const dim = prog(f, wf(85) - 2, wf(85) + 6);
	// cost line from (130,520) down to (470,1150)
	const lx = 130 + 340 * line;
	const ly = 520 + 630 * line * line;
	return (
		<AbsoluteFill>
			<Backdrop color={C.paper} pattern="grid" ink="rgba(38,35,33,0.06)" floorY={1205} light={0.25} />
			<Camera x={sk.x} y={sk.y}>
				<div style={{position: 'absolute', inset: 0, opacity: 1 - dim * 0.6}}>
					<Stage>
						<SvgDefs />
						{/* production: crates stacking fast */}
						{Array.from({length: 15}).map((_, k) => {
							const col = k % 3;
							const row = Math.floor(k / 3);
							const at = wf(80) + 2 + k * 2.2;
							const p = f < at ? 0 : Math.min(1, (f - at) / 6);
							if (p <= 0) return null;
							const y = 1205 - row * 112;
							return (
								<G key={k} x={640 + col * 116} y={y - (1 - p * p) * 900} r={(rand(k) - 0.5) * 8 * (1 - p) + (rand(k + 9) - 0.5) * 3} f="sh">
									<Crate s={108} color={k % 4 === 0 ? C.yellow : C.kraft} />
								</G>
							);
						})}
						<G x={760} y={620 - arrowUp * 160} s={arrowUp} f="sh">
							<path d="M-46,80 L-46,-10 L-96,-10 L0,-120 L96,-10 L46,-10 L46,80 Z" fill={C.yellow} stroke="rgba(30,20,10,0.25)" strokeWidth={2} />
						</G>
						{/* cost: falling line */}
						<line x1={110} y1={470} x2={110} y2={1190} stroke={C.charcoal} strokeWidth={6} />
						<line x1={110} y1={1190} x2={520} y2={1190} stroke={C.charcoal} strokeWidth={6} />
						{line > 0 ? (
							<>
								<path d={`M130,520 Q${130 + 170},${520 + 60} ${lx},${ly}`} fill="none" stroke={C.terracotta} strokeWidth={14} strokeLinecap="round" />
								<G x={lx} y={ly} r={50 + line * 20}>
									<path d="M-26,-20 L26,0 L-26,20 Z" fill={C.terracotta} />
								</G>
							</>
						) : null}
					</Stage>
					<div style={{position: 'absolute', left: 690, top: 760 - arrowUp * 180, transform: `scale(${pop(f, wf(80) + 4)}) rotate(-3deg)`}}>
						<Label text="الإنتاج" size={52} bg={C.yellow} />
					</div>
					{f >= wf(83) - 2 ? (
						<div style={{position: 'absolute', left: Math.min(300, lx - 40), top: ly - 140, transform: `rotate(${12 + line * 18}deg)`}}>
							<Label text="التكلفة" size={46} bg={C.terracotta} fg={C.paperWhite} />
						</div>
					) : null}
				</div>
				{/* the speculative conclusion about money */}
				{moneyIn > 0 ? (
					<Stage>
						<SvgDefs />
						<G x={540} y={760 + (1 - moneyIn) * 900} s={1.0 - 0.4 * shrink} r={-4 + shrink * 8} f="shl">
							<Banknote w={760} gray={shrink} seed={3} />
						</G>
						{q > 0 ? (
							<G x={760} y={640} s={q} r={12}>
								<CutText text="؟" size={240} color={C.terracotta} back={C.charcoal} />
							</G>
						) : null}
					</Stage>
				) : null}
			</Camera>
			<div style={{position: 'absolute', left: 60, top: 300, transform: `scale(${pop(f, a + 6)})`, transformOrigin: 'left top'}}>
				<Badge text="رسم توضيحي — مش بيانات حقيقية" size={22} />
			</div>
			{moneyIn > 0 ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 1060, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, wf(86))})`}}>
					<Badge text="توقّع المتحدث — مش حقيقة مثبتة" size={26} rot={-2} />
				</div>
			) : null}
			<TitleCard frame={f} at={wf(80)} text="الإنتاج ↑   التكلفة ↓" />
		</AbsoluteFill>
	);
};
