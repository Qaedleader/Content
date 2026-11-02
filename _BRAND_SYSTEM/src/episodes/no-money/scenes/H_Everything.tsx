// Scene H — «ونفس الإشي بالأكل والبيوت والملابس والدوا»: four real production processes land on each spoken word.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, pop, prog} from '../../../brand/anim';
import {Stage} from '../../../brand/diagram';
import {G, Icon, SvgDefs} from '../../../brand/props';
import {FootagePrint} from '../../../brand/media';
import {Backdrop} from '../../../brand/paper';
import {C} from '../../../brand/tokens';
import {Badge, Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../ep';

const CARDS = [
	{w: 76, src: 'v_harvester', x: 560, y: 320, label: 'حصاد ← أكل', credit: 'Sillerkiil · CC0', trim: 1, rot: 2},
	{w: 77, src: 'v_3dhouse', x: 70, y: 330, label: 'طباعة ← بيوت', credit: 'Alfredo Milano / WASP · CC BY 2.0', trim: 0.5, rot: -2},
	{w: 78, src: 'v_looms', x: 560, y: 760, label: 'نسيج ← ملابس', credit: 'Victuallers · CC BY-SA 3.0', trim: 0.5, rot: -1.5},
	{w: 79, src: 'v_tablet_press', x: 70, y: 770, label: 'أقراص ← دوا', credit: 'Robin Müller · CC BY-SA 3.0', trim: 0, rot: 2.5},
];

export const EverythingScene: React.FC<{f: number}> = ({f}) => {
	return (
		<AbsoluteFill>
			<Backdrop color={C.navy} pattern="dots" ink="rgba(255,255,255,0.05)" light={0.2} />
			{/* bridge from the previous chain: the same chain, compressed into a row, before the four industries land */}
			{f < wf(77) ? (
				<Stage>
					<SvgDefs />
					{(['ore', 'furnace', 'gear', 'robot', 'car', 'house'] as const).map((n, i) => {
						const p = pop(f, S.H[0] + 1 + i * 2);
						const out = prog(f, wf(76) - 4, wf(76) + 4, EASE.in);
						return p > 0 ? (
							<G key={n} x={540 + (2.5 - i) * 150} y={860 - out * 300} s={p * (1 - out)} f="sh">
								<circle r={62} fill={i % 2 ? C.paperWhite : C.yellow} stroke="rgba(30,20,10,0.2)" strokeWidth={2} />
								<Icon name={n} s={0.55} />
							</G>
						) : null;
					})}
				</Stage>
			) : null}
			{CARDS.map((c, i) => (
				<React.Fragment key={c.src}>
					<FootagePrint
						src={`episodes/no-money/media/${c.src}.mp4`}
						x={c.x}
						y={c.y}
						w={450}
						h={380}
						rot={c.rot}
						frame={f}
						at={wf(c.w) - 3}
						seed={100 + i}
						trim={c.trim}
						enter="drop"
						credit={{kind: 'لقطات حقيقية', text: c.credit}}
					/>
					{f >= wf(c.w) + 2 ? (
						<div style={{position: 'absolute', left: c.x + 70, top: c.y - 22, transform: `scale(${pop(f, wf(c.w) + 2)}) rotate(${-c.rot * 2}deg)`}}>
							<Label text={c.label} size={36} bg={C.yellow} />
						</div>
					) : null}
				</React.Fragment>
			))}
			{f >= wf(76) + 6 ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 1262, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, wf(76) + 6)})`}}>
					<Badge text="لقطات من اليوم — الأتمتة الكاملة لسّا مش واقع" color={C.yellow} bg="rgba(20,30,45,0.92)" size={22} rot={0} />
				</div>
			) : null}
			<TitleCard frame={f} at={S.H[0] + 1} text="ونفس الإشي بـ…" />
		</AbsoluteFill>
	);
};
