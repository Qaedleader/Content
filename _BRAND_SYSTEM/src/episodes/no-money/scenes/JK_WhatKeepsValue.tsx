// Scenes J+K — «فالحق حالك، إذا عندك كاش بالبنك لازم تفكّر شو الإشي اللي رح يضل إله قيمة.
// أنا برأيي الكتلة والطاقة والقدرة هم اللي رح يضل إلهم قيمة.»
// Symbolic (not investment advice): cash on one pan of a balance; the speaker's three answers land on the other pan.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {Backdrop} from '../../../brand/paper';
import {Balance, Bank, Banknote, Bolt, CutText, G, Gear, Ingot, SvgDefs} from '../../../brand/props';
import {C} from '../../../brand/tokens';
import {Badge, HeroWord, Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../ep';

const TOKENS = [
	{w: 107, word: 'الكتلة', sub: 'مواد خام'},
	{w: 108, word: 'الطاقة', sub: 'كهربا'},
	{w: 109, word: 'القدرة', sub: 'على الإنتاج'},
];

export const ValueScene: React.FC<{f: number}> = ({f}) => {
	const [a, b] = S.JK;
	const bank = pop(f, a + 2);
	const bankOut = prog(f, wf(96) - 2, wf(96) + 10, EASE.in);
	const cash = pop(f, wf(94) - 2);
	const balIn = pop(f, wf(96) + 2, {damping: 14});
	const cashToPan = prog(f, wf(96) + 4, wf(97) + 2, EASE.io);
	const q = pop(f, wf(98) - 1) * (1 - prog(f, wf(107) - 4, wf(107)));
	const land = TOKENS.map((t) => slam(f, wf(t.w) - 2));
	const tilt = kf(f, [wf(96) + 6, wf(97) + 6, wf(107), wf(107) + 6, wf(108) + 6, wf(109) + 6, wf(115)], [0, -12, -12, -4, 4, 13, 15], EASE.io);
	const grayCash = prog(f, wf(109), wf(115));
	const push = kf(f, [a, b], [1.0, 1.06], EASE.linear);

	const cashStack = (
		<g>
			{[0, 1, 2].map((k) => (
				<G key={k} x={(k - 1) * 8} y={-26 - k * 14} s={0.28} r={(k - 1) * 4}>
					<Banknote w={760} seed={k + 2} gray={grayCash * 0.8} />
				</G>
			))}
		</g>
	);
	const tokens = (
		<g>
			{land[0] > 0 ? (
				<G x={-70} y={-(1 - land[0]) * 700} s={0.62}>
					<Ingot s={1} />
					<G y={-46}>
						<Ingot s={0.85} color={C.steelDark} />
					</G>
				</G>
			) : null}
			{land[1] > 0 ? (
				<G x={10} y={-70 - (1 - land[1]) * 700} s={0.62} r={-8}>
					<Bolt s={1} />
				</G>
			) : null}
			{land[2] > 0 ? (
				<G x={78} y={-58 - (1 - land[2]) * 700} s={0.62}>
					<Gear r={70} teeth={11} rot={f * 2} />
				</G>
			) : null}
			{q > 0 ? (
				<G y={-30} s={q}>
					<CutText text="؟" size={190} color={C.yellow} back={C.charcoal} />
				</G>
			) : null}
		</g>
	);

	return (
		<AbsoluteFill>
			<Backdrop color={C.sage} pattern="stripes" ink="rgba(255,255,255,0.07)" floorY={1180} light={0.2} />
			<Camera scale={push}>
				<Stage>
					<SvgDefs />
					{bankOut < 1 ? (
						<G x={540 - bankOut * 900} y={1182} s={1.05 * bank} f="sh">
							<Bank w={560} />
							{cash > 0 ? (
								<G x={0} y={-10} s={cash * 2.2}>
									{cashStack}
								</G>
							) : null}
						</G>
					) : null}
					{balIn > 0 ? (
						<G x={540} y={1182 + (1 - balIn) * 900} f="sh">
							<Balance tilt={tilt} w={660} left={cashToPan > 0.98 ? <G s={1.6}>{cashStack}</G> : null} right={tokens} />
						</G>
					) : null}
					{cashToPan > 0 && cashToPan < 0.98 ? (
						<G x={kf(cashToPan, [0, 1], [540 - bankOut * 900, 540 - 330])} y={kf(cashToPan, [0, 1], [1172, 1182 - 470 + 160 + 60])} s={1.6 + (1 - cashToPan) * 0.6}>
							{cashStack}
						</G>
					) : null}
				</Stage>
				{cash > 0 && bankOut < 0.5 ? (
					<div style={{position: 'absolute', left: 340, top: 1040, transform: `scale(${pop(f, wf(94) + 2)}) rotate(-3deg)`}}>
						<Label text="كاش بالبنك" size={46} bg={C.paperWhite} />
					</div>
				) : null}
				{/* the three answers */}
				<div dir="rtl" style={{position: 'absolute', left: 0, width: 1080, top: 400, display: 'flex', justifyContent: 'center', gap: 26}}>
					{TOKENS.map((t, i) => {
						const p = pop(f, wf(t.w) - 1);
						return (
							<div key={t.w} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${p}) rotate(${(i - 1) * 3}deg)`, opacity: p > 0 ? 1 : 0}}>
								<HeroWord text={t.word} size={118} face={i === 2 ? C.yellow : C.paperWhite} back={C.charcoal} depth={7} />
								<div style={{marginTop: 6}}>
									<Label text={t.sub} size={28} bg={C.charcoal} fg={C.paper} />
								</div>
							</div>
						);
					})}
				</div>
			</Camera>
			<TitleCard frame={f} at={a + 1} out={wf(98) - 6} text="فالحق حالك!" />
			<TitleCard frame={f} at={wf(98)} text="شو اللي رح يضل إله قيمة؟" seed={13} />
			{f >= wf(105) - 1 ? (
				<div style={{position: 'absolute', left: 60, top: 300, transform: `scale(${pop(f, wf(105) - 1)})`, transformOrigin: 'left top'}}>
					<Badge text="رأي المتحدث — مش نصيحة استثمارية" size={24} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
