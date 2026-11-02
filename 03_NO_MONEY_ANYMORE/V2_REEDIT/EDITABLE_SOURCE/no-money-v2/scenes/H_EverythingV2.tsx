// V2 Scene H (frames 990–1081) — «ونفس الإشي بالأكل والبيوت والملابس والدوا»
// V1 opened on ~0.8 s of a mostly empty navy board with a small icon row, then prints dropped in through the
// top edge into an uneven layout. V2: from the cut, a clean 2×2 board of four paper slots (food, homes,
// clothes, medicine) is linked to ONE yellow gear in the centre — "the same production logic" — and on each
// spoken word the real footage of that industry lands in its slot (impact cues of the V1 mix: ws(76..79) − 0.1).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, pop, prog} from '../../../brand/anim';
import {Stage} from '../../../brand/diagram';
import {FootagePrint} from '../../../brand/media';
import {Backdrop, TEX} from '../../../brand/paper';
import {G, Gear, Icon, SvgDefs} from '../../../brand/props';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../../no-money/ep';

const PW = 450;
const PH = 400;
const COLS = [565, 65];
const ROWS = [345, 795];

const CARDS = [
	{w: 76, src: 'v_harvester', col: 0, row: 0, icon: 'wheat' as const, word: 'أكل', label: 'حصاد ← أكل', credit: 'Sillerkiil · CC0', trim: 1, rot: 1.2},
	{w: 77, src: 'v_3dhouse', col: 1, row: 0, icon: 'house' as const, word: 'بيوت', label: 'طباعة ← بيوت', credit: 'Alfredo Milano / WASP · CC BY 2.0', trim: 0.5, rot: -1.2},
	{w: 78, src: 'v_looms', col: 0, row: 1, icon: 'shirt' as const, word: 'ملابس', label: 'نسيج ← ملابس', credit: 'Victuallers · CC BY-SA 3.0', trim: 0.5, rot: -1},
	{w: 79, src: 'v_tablet_press', col: 1, row: 1, icon: 'pill' as const, word: 'دوا', label: 'أقراص ← دوا', credit: 'Robin Müller · CC BY-SA 3.0', trim: 0, rot: 1.4},
];

const HUB = {x: 540, y: ROWS[1] - 25};

export const EverythingSceneV2: React.FC<{f: number}> = ({f}) => {
	const [a] = S.H;
	const hub = pop(f, a - 4, {damping: 13});
	const spokes = prog(f, wf(75) - 4, wf(76) - 2, EASE.io);
	const gearRot = f * 3;
	return (
		<AbsoluteFill>
			<Backdrop color={C.navy} pattern="dots" ink="rgba(255,255,255,0.05)" light={0.2} />
			{/* empty paper slots, one per industry: visible from the cut */}
			{CARDS.map((c, i) => {
				const p = pop(f, a - 6 + i * 2, {damping: 14});
				const filled = f >= wf(c.w) + 8;
				return p > 0 && !filled ? (
					<div
						key={c.src}
						style={{
							position: 'absolute',
							left: COLS[c.col],
							top: ROWS[c.row],
							width: PW,
							height: PH,
							transform: `scale(${0.6 + 0.4 * p}) rotate(${c.rot}deg)`,
							opacity: Math.min(1, p * 2),
							filter: SHADOW.contact,
						}}
					>
						<div style={{position: 'absolute', inset: 0, background: C.paper, borderRadius: 6}} />
						<div style={{position: 'absolute', inset: 0, backgroundImage: `url(${TEX.fibers()})`, backgroundSize: '512px', opacity: 0.6, borderRadius: 6}} />
						<div style={{position: 'absolute', inset: 18, border: `4px dashed rgba(38,35,33,0.28)`, borderRadius: 4}} />
						<svg width={PW} height={PH} viewBox={`0 0 ${PW} ${PH}`} style={{position: 'absolute', left: 0, top: 0}}>
							<SvgDefs />
							<G x={PW / 2} y={PH / 2 - 30} f="shs">
								<circle r={86} fill={C.paperWhite} stroke="rgba(30,20,10,0.2)" strokeWidth={2} />
								<Icon name={c.icon} s={0.85} />
							</G>
						</svg>
						<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, bottom: 44, textAlign: 'center', fontFamily: FONT.display, fontWeight: 900, fontSize: 46, color: C.charcoal}}>
							{c.word}
						</div>
					</div>
				) : null;
			})}
			{/* real footage lands in each slot on its word */}
			{CARDS.map((c, i) => (
				<React.Fragment key={c.src}>
					<FootagePrint
						src={`episodes/no-money/media/${c.src}.mp4`}
						x={COLS[c.col]}
						y={ROWS[c.row]}
						w={PW}
						h={PH}
						rot={c.rot}
						frame={f}
						at={wf(c.w) - 3}
						seed={100 + i}
						trim={c.trim}
						enter="pop"
						credit={{kind: 'لقطات حقيقية', text: c.credit}}
					/>
					{f >= wf(c.w) + 2 ? (
						<div style={{position: 'absolute', left: COLS[c.col] + 40, top: ROWS[c.row] - 24, transform: `scale(${pop(f, wf(c.w) + 2)}) rotate(${-c.rot * 2}deg)`}}>
							<Label text={c.label} size={36} bg={C.yellow} />
						</div>
					) : null}
				</React.Fragment>
			))}
			{/* one gear drives all four: spokes to each slot */}
			{hub > 0 ? (
				<Stage>
					<SvgDefs />
					{CARDS.map((c, i) => {
						const cx = COLS[c.col] + PW / 2;
						const cy = ROWS[c.row] + PH / 2;
						const dx = cx - HUB.x;
						const dy = cy - HUB.y;
						const L = Math.hypot(dx, dy);
						const x1 = HUB.x + (dx / L) * 70;
						const y1 = HUB.y + (dy / L) * 70;
						const x2 = HUB.x + (dx / L) * (70 + 110 * spokes);
						const y2 = HUB.y + (dy / L) * (70 + 110 * spokes);
						const lit = f >= wf(c.w);
						return spokes > 0 ? (
							<g key={i}>
								<line x1={x1} y1={y1 + 5} x2={x2} y2={y2 + 5} stroke="rgba(20,14,8,0.3)" strokeWidth={18} strokeLinecap="round" />
								<line x1={x1} y1={y1} x2={x2} y2={y2} stroke={lit ? C.yellow : C.paperWhite} strokeWidth={14} strokeLinecap="round" />
								{spokes > 0.98 ? <circle cx={x2} cy={y2} r={lit ? 15 : 11} fill={lit ? C.yellow : C.paperWhite} stroke="rgba(30,20,10,0.3)" strokeWidth={2} /> : null}
							</g>
						) : null;
					})}
					<G x={HUB.x} y={HUB.y} s={hub} f="shl">
						<Gear r={86} teeth={12} rot={gearRot} hole={0.36} />
					</G>
				</Stage>
			) : null}
			{f >= wf(76) + 6 ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 1262, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, wf(76) + 6)})`}}>
					<Badge text="لقطات من اليوم — الأتمتة الكاملة لسّا مش واقع" color={C.yellow} bg="rgba(20,30,45,0.92)" size={22} rot={0} />
				</div>
			) : null}
			<TitleCard frame={f} at={a + 1} text="ونفس الإشي بـ…" />
		</AbsoluteFill>
	);
};
