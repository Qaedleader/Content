// N3 «لمّا تفكّر، مخّك بيطلّع إشارات كهربائية، الشريحة بتقرأها»
// N4 «والذكاء الاصطناعي بيترجمها لمعلومات، وبالمستقبل بيقدر كمان يرجّع معلومات لمخّك»
// N5 «هسّا تخيّل كل إشي بتشوفه، بتسمعه، أو حتى بتفكّر فيه، بنحوّله لبيانات وبنعمله باك أب على الكلاود» (speculative)
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, rand} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {PhotoPrint} from '../../../brand/media';
import {Backdrop} from '../../../brand/paper';
import {Chip, FlowPath, G, SvgDefs} from '../../../brand/props';
import {CardPic, GearPair, Implant, MemoryCard, PaperBrain, PaperCloud, SignalStrip} from '../../../brand/science';
import {C, FONT} from '../../../brand/tokens';
import {Badge, Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../ep';

export const SignalsScene: React.FC<{f: number}> = ({f}) => {
	const [a, b] = S.N3;
	const g = (k: number) => prog(f, wf(23) + k * 4, wf(24) + k * 4 + 6);
	const strip = pop(f, wf(26) - 2, {damping: 15});
	const read = prog(f, wf(29), wf(30) + 6);
	return (
		<AbsoluteFill>
			<Backdrop color={C.navy} pattern="dots" ink="rgba(255,255,255,0.05)" light={0.22} />
			<Camera scale={kf(f, [a, b], [1.04, 1.0], EASE.out)}>
				<Stage>
					<SvgDefs />
					<G x={540} y={800} s={1.05}>
						<PaperBrain id="n3" glow={[g(0), g(1), g(2), g(3), g(4), g(5)].map((x) => x * (0.7 + 0.3 * Math.sin(f / 3 + x * 5)))} />
						<G x={-70} y={-232} s={0.62}>
							<Implant r={52} threads={7} reach={0.45} frame={f} pulse={read} />
						</G>
					</G>
					{/* signal tape leaving the brain */}
					{strip > 0 ? (
						<G x={90 + (1 - strip) * -1100} y={1170}>
							<SignalStrip w={900} h={150} frame={f} speed={9} spikes={1 + read * 2} />
						</G>
					) : null}
					{/* spikes picked up by the chip */}
					{read > 0
						? [0, 1, 2, 3].map((k) => {
								const t = ((f - wf(29)) / 14 + k * 0.25) % 1;
								return <circle key={k} cx={540 + (rand(k) - 0.5) * 400 * (1 - t)} cy={1170 - t * 590} r={12} fill={C.yellow} opacity={1 - t * 0.3} filter="url(#glow)" />;
							})
						: null}
				</Stage>
			</Camera>
			<PhotoPrint
				src="episodes/neuralink/media/berger_eeg.jpg"
				x={80}
				y={980}
				w={560}
				h={110}
				rot={-2}
				frame={f}
				at={wf(27) - 1}
				seed={21}
				border={10}
				tape={false}
				enter="slideLeft"
				credit={{kind: 'أول تسجيل حقيقي لإشارات الدماغ · ١٩٢٤', text: 'Hans Berger · Public domain'}}
			/>
			<TitleCard frame={f} at={wf(23)} out={wf(29) - 4} text="لمّا تفكّر…" />
			<TitleCard frame={f} at={wf(29)} text="الشريحة بتقرأ الإشارات" seed={6} />
		</AbsoluteFill>
	);
};

export const DecodeScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.N4;
	const back = wf(35) - 2;
	const machine = pop(f, a + 2, {damping: 14});
	const outCards = (k: number) => pop(f, wf(33) + k * 5);
	const rev = prog(f, wf(38) - 4, wf(40) + 6);
	const isBack = f >= back;
	return (
		<AbsoluteFill>
			<Backdrop color={isBack ? C.navyDeep : C.tealDark} pattern="tiles" ink="rgba(255,255,255,0.05)" floorY={1200} floorColor={C.charcoalSoft} floorEdge={C.charcoal} light={0.2} />
			<Stage>
				<SvgDefs />
				{/* brain (left) → AI decoder (centre) → meaning (right) */}
				<G x={230} y={720} s={0.62}>
					<PaperBrain id="n4" glow={isBack ? [rev, rev, rev, rev, rev, rev] : [0.6, 0, 0.4, 0, 0, 0.5]} />
				</G>
				<FlowPath d="M400,700 Q460,690 470,770" draw={prog(f, a + 2, a + 16)} frame={f} width={10} color={isBack ? C.teal : C.yellow} />
				<G x={680} y={820} s={1.2 * machine}>
					<rect x={-170} y={-210} width={340} height={380} rx={26} fill={C.teal} stroke="rgba(30,20,10,0.25)" strokeWidth={2} filter="url(#sh)" />
					<rect x={-130} y={-170} width={260} height={150} rx={12} fill={C.navy} />
					<G y={-95} s={0.55}>
						<Chip glow={0.5 + 0.5 * Math.sin(f / 3)} />
					</G>
					<G x={-60} y={80}>
						<GearPair frame={f} s={0.7} />
					</G>
					<text x={0} y={150} textAnchor="middle" fontFamily={FONT.display} fontWeight={900} fontSize={34} fill={C.paperWhite}>
						ذكاء اصطناعي
					</text>
				</G>
				{/* output: decoded intent → cursor moves */}
				{!isBack
					? ['↑', '←', '↓'].map((s, k) =>
							outCards(k) > 0 ? (
								<G key={k} x={900} y={560 + k * 150} s={outCards(k)} r={(k - 1) * 4} f="sh">
									<rect x={-70} y={-55} width={140} height={110} rx={10} fill={C.paperWhite} />
									<text x={0} y={30} textAnchor="middle" fontFamily={FONT.display} fontWeight={900} fontSize={80} fill={C.charcoal}>
										{s}
									</text>
								</G>
							) : null,
						)
					: null}
				{isBack ? (
					<>
						<FlowPath d="M810,830 Q720,980 560,1000 Q380,1010 260,880" draw={rev} frame={f} width={12} color={C.teal} glow />
						<FlowPath d="M800,760 Q700,620 520,600 Q380,600 300,700" draw={prog(f, wf(39), wf(40) + 8)} frame={f} width={12} color={C.teal} glow />
					</>
				) : null}
			</Stage>
			{isBack ? (
				<PhotoPrint
					src="episodes/neuralink/media/galvani_setup.jpg"
					x={640}
					y={360}
					w={380}
					h={280}
					rot={3}
					frame={f}
					at={wf(37)}
					seed={41}
					enter="slideRight"
					credit={{kind: 'تحفيز كهربائي حقيقي · غالفاني ١٧٩١', text: 'Public domain'}}
				/>
			) : null}
			{!isBack && f >= wf(34) ? (
				<div style={{position: 'absolute', left: 60, top: 1080, transform: `scale(${pop(f, wf(34))})`, transformOrigin: 'left top'}}>
					<Badge text="اليوم: بيفكّ نيّة الحركة — مش الأفكار نفسها" size={22} color={C.yellow} bg="rgba(20,30,45,0.9)" />
				</div>
			) : null}
			{isBack && f >= wf(36) ? (
				<div style={{position: 'absolute', left: 60, top: 1080, transform: `scale(${pop(f, wf(36))})`, transformOrigin: 'left top'}}>
					<Badge text="تقنية قيد البحث" size={26} color={C.teal} />
				</div>
			) : null}
			<TitleCard frame={f} at={a + 1} out={back - 6} text="الذكاء الاصطناعي بيترجم" />
			<TitleCard frame={f} at={back} text="وبالمستقبل… بالعكس" seed={4} />
		</AbsoluteFill>
	);
};

const SOURCES: {at: number; kind: 'eye' | 'ear' | 'mind'; pics: CardPic[]}[] = [
	{at: 43, kind: 'eye', pics: ['sun', 'house', 'tree']},
	{at: 46, kind: 'ear', pics: ['music', 'chat', 'music']},
	{at: 49, kind: 'mind', pics: ['star', 'book', 'key']},
];

const SourceIcon: React.FC<{kind: 'eye' | 'ear' | 'mind'}> = ({kind}) => {
	if (kind === 'eye')
		return (
			<g>
				<path d="M-80,0 Q0,-70 80,0 Q0,70 -80,0 Z" fill={C.paperWhite} stroke={C.charcoal} strokeWidth={6} />
				<circle r={30} fill={C.teal} />
				<circle r={13} fill={C.charcoal} />
			</g>
		);
	if (kind === 'ear')
		return (
			<g>
				<path d="M20,-70 C-60,-80 -70,10 -30,40 C-10,56 -10,80 10,80 C40,80 60,40 50,-10 C44,-50 30,-68 20,-70 Z" fill={C.terracotta} stroke={C.charcoal} strokeWidth={5} />
				{[0, 1, 2].map((k) => (
					<path key={k} d={`M${80 + k * 26},-40 Q${110 + k * 26},0 ${80 + k * 26},40`} stroke={C.yellow} strokeWidth={6} fill="none" />
				))}
			</g>
		);
	return (
		<g>
			<path d="M-80,10 C-100,-50 -30,-90 10,-70 C50,-100 110,-60 90,-10 C120,30 70,70 30,55 C0,80 -60,70 -60,40 C-90,40 -96,24 -80,10 Z" fill={C.paperWhite} stroke={C.charcoal} strokeWidth={5} />
			<circle cx={-50} cy={84} r={12} fill={C.paperWhite} stroke={C.charcoal} strokeWidth={4} />
			<circle cx={-70} cy={108} r={7} fill={C.paperWhite} stroke={C.charcoal} strokeWidth={3} />
		</g>
	);
};

export const BackupScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.N5;
	const shred = wf(51) - 2;
	const cloudIn = pop(f, wf(53) - 4, {damping: 14});
	const up = prog(f, wf(53), wf(57) + 14, EASE.io);
	return (
		<AbsoluteFill>
			<Backdrop color={C.navy} pattern="dots" ink="rgba(255,255,255,0.05)" floorY={1210} floorColor={C.charcoalSoft} floorEdge={C.charcoal} light={0.2} />
			<Stage>
				<SvgDefs />
				{SOURCES.map((s, i) => {
					const p = pop(f, wf(s.at) - 2);
					return p > 0 ? (
						<G key={i} x={180} y={480 + i * 250} s={1.15 * p} f="sh">
							<circle r={105} fill={[C.yellow, C.paperWhite, C.sage][i]} stroke="rgba(30,20,10,0.2)" strokeWidth={2} />
							<G s={0.95}>
								<SourceIcon kind={s.kind} />
							</G>
						</G>
					) : null;
				})}
				{/* cards travelling from each source to the shredder */}
				{SOURCES.map((s, i) =>
					s.pics.map((pic, k) => {
						const t0 = wf(s.at) + k * 6;
						const t = (f - t0) / 26;
						if (t <= 0 || t > 1.3) return null;
						const u = Math.min(1, t);
						const x = 290 + u * 380;
						const y = 470 + i * 250 + (920 - (470 + i * 250)) * u * u;
						return (
							<G key={`${i}-${k}`} x={x} y={y} r={(rand(i * 9 + k) - 0.5) * 20} s={0.95 * (t > 1 ? 1 - (t - 1) * 3 : 1)} f="sh">
								<MemoryCard pic={pic} seed={i + k} />
							</G>
						);
					}),
				)}
				{/* shredder → data tiles */}
				<G x={720} y={1010} s={1.3 * pop(f, a + 4)} f="sh">
					<rect x={-150} y={-90} width={300} height={190} rx={18} fill={C.charcoal} />
					<rect x={-120} y={-100} width={240} height={20} rx={6} fill={C.steelDark} />
					<text x={0} y={30} textAnchor="middle" fontFamily={FONT.display} fontWeight={900} fontSize={42} fill={C.yellow}>
						بيانات
					</text>
				</G>
				{f >= shred
					? Array.from({length: 26}).map((_, k) => {
							const t = ((f - shred) / 34 + k / 26) % 1;
							const x = 720 + (rand(k) - 0.5) * 220 * (1 - t);
							const y = 920 - t * (920 - 460);
							return (
								<g key={k} transform={`translate(${x} ${y}) rotate(${k * 30 + f * 4})`} opacity={1 - t * 0.6}>
									<rect x={-14} y={-14} width={28} height={28} rx={4} fill={k % 3 ? C.yellow : C.paperWhite} />
									<text x={0} y={8} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={20} fill={C.charcoal}>
										{k % 2}
									</text>
								</g>
							);
						})
					: null}
				{cloudIn > 0 ? (
					<G x={700} y={430} s={0.95 * cloudIn}>
						<PaperCloud progress={up} />
						{up >= 0.999 ? (
							<g transform="translate(0 -60)">
								<circle r={40} fill={C.teal} />
								<path d="M-18,0 L-4,14 L20,-14" stroke={C.paperWhite} strokeWidth={9} fill="none" strokeLinecap="round" />
							</g>
						) : null}
					</G>
				) : null}
			</Stage>
			{f >= wf(55) ? (
				<div style={{position: 'absolute', left: 520, top: 610, transform: `scale(${pop(f, wf(55))}) rotate(-2deg)`}}>
					<Label text={up >= 0.999 ? 'نسخة احتياطية ✓' : `باك أب ${Math.round(up * 100)}٪`} size={34} bg={C.yellow} />
				</div>
			) : null}
			<TitleCard frame={f} at={a + 1} out={shred - 6} text="بتشوف · بتسمع · بتفكّر" />
			<TitleCard frame={f} at={shred} text="← بيانات ← الكلاود" seed={7} />
		</AbsoluteFill>
	);
};
