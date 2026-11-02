// V3 · Shot 09 (frames 1082–1201) «الإنتاج بصير هائل، والتكلفة بتنهار، والمصاري رح يبطل إلها قيمة»
// THE MULTIPLYING MACHINE: the opening's machine returns. On each of the 15 impacts one good flies out of its chute
// onto a growing pyramid (15 goods = 15 cues) while its «الإنتاج» meter fills. A hanging «التكلفة» price tag
// snaps and crashes off the mountain. A banknote slides in and shrinks, greying, beside the goods. «؟».
// No numbers: badges mark it as an illustration and as the speaker's prediction.
// Locked cues: 15 impacts f1085–1116 · riser · crash f1143 · paper slide f1156 · pop f1189.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, shake} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {Backdrop} from '../../../brand/paper';
import {Banknote, CutText, G, SvgDefs} from '../../../brand/props';
import {C, FONT} from '../../../brand/tokens';
import {Badge, TitleCard} from '../../../brand/type';
import {S, wf} from '../../no-money/ep';
import {IconName, idle, Token} from '../kit';

const GOODS: IconName[] = ['car', 'house', 'bread', 'shirt', 'pill', 'phone', 'box', 'bolt', 'wheat', 'beam', 'car', 'box', 'house', 'phone', 'bread'];
const PILE = (() => {
	const out: {x: number; y: number}[] = [];
	const rows = [5, 4, 3, 2, 1];
	rows.forEach((n, r) => {
		for (let i = 0; i < n; i++) out.push({x: 770 - ((n - 1) * 100) / 2 + i * 100, y: 1128 - r * 92});
	});
	return out;
})();
const CHUTE = {x: 420, y: 930};

export const MultiplyScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.I;
	const t0 = a + 3; // first impact ≈ f1085
	const hits = GOODS.map((_, k) => Math.round(t0 + k * 2.2));
	const n = hits.filter((h) => f >= h).length;
	const meter = kf(f, [t0, hits[14] + 4], [0.08, 1], EASE.out);
	const pulse = hits.some((h) => f >= h && f < h + 2) ? 1.03 : 1;
	const crash = wf(84) - 2;
	const tagFall = prog(f, crash - 4, crash + 4, EASE.in);
	const tumble = prog(f, crash + 4, crash + 18, EASE.in);
	const sk = shake(f, crash, 14, 10);
	const note = pop(f, wf(85) - 3, {damping: 15});
	const shrink = prog(f, wf(85) + 2, wf(89) - 2, EASE.io);
	const q = pop(f, wf(89) - 1);
	const swing = f < crash - 4 ? idle(f, 20, 6) + (f > wf(83) ? idle(f, 5, 8) : 0) : 0;
	return (
		<AbsoluteFill>
			<Backdrop color={C.paper} pattern="dots" ink="rgba(38,35,33,0.07)" floorY={1180} floorColor={C.kraft} light={0.25} />
			<Camera x={sk.x} y={sk.y}>
				<Stage>
					<SvgDefs />
					{/* machine */}
					<G x={240} y={1180} sy={pulse} sx={1 / pulse} f="shl">
						<rect x={-190} y={-560} width={380} height={560} rx={18} fill={C.charcoalSoft} />
						<rect x={-190} y={-200} width={380} height={30} fill={C.teal} />
						<path d="M-210,-560 L210,-560 L150,-640 L-150,-640 Z" fill={C.charcoal} />
						{/* «الإنتاج» meter */}
						<rect x={-60} y={-520} width={120} height={300} rx={14} fill={C.paperWhite} />
						<rect x={-44} y={-236 - 270 * meter} width={88} height={270 * meter} rx={8} fill={C.yellow} />
						<text x={0} y={-130} textAnchor="middle" fontFamily={FONT.display} fontWeight={900} fontSize={42} fill={C.paper}>
							الإنتاج
						</text>
						<rect x={170} y={-280} width={60} height={90} rx={8} fill={C.charcoal} />
					</G>
					{/* goods: fly out of the chute, one per impact, onto the pyramid */}
					{GOODS.map((g, k) => {
						if (f < hits[k] - 6) return null;
						const u = prog(f, hits[k] - 6, hits[k], EASE.linear);
						const tgt = PILE[k];
						const x = CHUTE.x + (tgt.x - CHUTE.x) * u;
						const y = CHUTE.y + (tgt.y - CHUTE.y) * u - Math.sin(u * Math.PI) * 220;
						const land = f >= hits[k] ? 1 + 0.15 * Math.exp(-(f - hits[k]) / 2) : 0.7 + 0.3 * u;
						return (
							<G key={k} x={x} y={y} s={land * 0.82}>
								<Token icon={g} r={56} bg={k % 3 === 0 ? C.yellow : C.paperWhite} />
							</G>
						);
					})}
					{/* hanging «التكلفة» price tag → snaps, crashes, tumbles off */}
					{tumble < 1 ? (
						<g>
							{tagFall <= 0 ? <line x1={770} y1={250} x2={770 + Math.sin((swing * Math.PI) / 180) * 140} y2={390} stroke={C.charcoal} strokeWidth={4} /> : null}
							<G x={770 + Math.sin((swing * Math.PI) / 180) * 150 + tumble * 420} y={450 + tagFall * 250 + tumble * 900} r={swing + tagFall * 30 + tumble * 160} f="sh">
								<path d="M-110,-60 L80,-60 L130,0 L80,60 L-110,60 Z" fill={C.terracotta} stroke="rgba(30,20,10,0.3)" strokeWidth={2} />
								<circle cx={88} cy={0} r={10} fill={C.paper} />
								<text x={-20} y={16} textAnchor="middle" fontFamily={FONT.display} fontWeight={900} fontSize={44} fill={C.paperWhite}>
									التكلفة
								</text>
							</G>
						</g>
					) : null}
					{/* the banknote: dwarfed by the goods */}
					{note > 0 ? (
						<G x={kf(note, [0, 1], [-300, 470])} y={kf(shrink, [0, 1], [470, 560])} s={kf(shrink, [0, 1], [1, 0.42])} r={-6} f="sh">
							<Banknote w={420} seed={3} gray={shrink} />
						</G>
					) : null}
					{q > 0 ? (
						<G x={560} y={500} s={q} r={(1 - q) * 30}>
							<CutText text="؟" size={160} color={C.terracotta} back={C.charcoal} />
						</G>
					) : null}
				</Stage>
			</Camera>
			{f >= t0 + 6 ? (
				<div style={{position: 'absolute', left: 60, top: 300, transform: `scale(${pop(f, t0 + 6)})`, transformOrigin: 'left center'}}>
					<Badge text="رسم توضيحي — مش بيانات حقيقية" size={22} />
				</div>
			) : null}
			{f >= wf(87) ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 1262, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, wf(87))})`}}>
					<Badge text="توقّع المتحدث — مش حقيقة مثبتة" size={24} rot={0} />
				</div>
			) : null}
			<TitleCard frame={f} at={a + 1} text="إنتاج هائل… وتكلفة بتنهار" />
		</AbsoluteFill>
	);
};
