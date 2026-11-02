// 28.9 – 34.7 s · «وبتعلم من ملايين الأنماط لأشخاص تصرفوا بطريقة قريبة منك وشو صار يهمهم بعدين»
// One viewing sequence → zoom out into a field of sequences → similar ones light up → what they went on to watch.
// Framed accurately: the model learned statistical relationships from past behaviour (not a live comparison with everyone).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, rand} from '../../../brand/anim';
import {C, FONT} from '../../../brand/tokens';
import {Badge, Label} from '../../../brand/type';
import {W, wf} from '../ep';
import {Icon} from '../ui';

const GC = 6; // units per row
const GR = 34; // unit rows
const N = 7; // squares per sequence
const SQ = 15;
const GAP = 4;
const PX = 165;
const PY = 28;
const OX = 45 + (PX - (N * (SQ + GAP) - GAP)) / 2;
const OY = 300;
const YOU = {c: 2, r: 16};
const CAT = [C.steel, C.sage, C.terracotta, C.teal, C.kraft, C.navyLight, '#B98AA6'];
const MOTIF = [4, 1, 3]; // café (kraft) → apartment (sage) → train (teal)

type Unit = {c: number; r: number; seq: number[]; similar: boolean; you: boolean};
const UNITS: Unit[] = (() => {
	const out: Unit[] = [];
	for (let r = 0; r < GR; r++)
		for (let c = 0; c < GC; c++) {
			const k = r * GC + c;
			const you = c === YOU.c && r === YOU.r;
			const similar = you || rand(k * 7 + 3) < 0.085;
			const seq = Array.from({length: N}, (_, i) => Math.floor(rand(k * 31 + i * 5) * CAT.length));
			if (similar) {
				const off = you ? 1 : Math.floor(rand(k * 11) * 3);
				MOTIF.forEach((m, j) => (seq[off + j * 2 > N - 2 ? N - 2 : off + j * 2] = m));
			}
			out.push({c, r, seq, similar, you});
		}
	return out;
})();
const pos = (u: {c: number; r: number}) => ({x: 1080 - (OX + u.c * PX) - (N * (SQ + GAP) - GAP), y: OY + u.r * PY}); // RTL placement
const YP = pos(YOU);
const YC = {x: YP.x + (N * (SQ + GAP)) / 2, y: YP.y + SQ / 2};

export const Patterns: React.FC<{f: number; end: number}> = ({f, end}) => {
	const a = wf(W.btt3allam);
	const zoom0 = wf(W.malayeen) - 4;
	const near = wf(W.qareeba) - 1;
	const later = wf(W.yhimmhum) - 2;
	if (f < a || f > end) return null;
	const z = prog(f, zoom0, zoom0 + 30, EASE.io);
	const s = kf(z, [0, 1], [4.2, 1]);
	const tx = kf(z, [0, 1], [540, YC.x]);
	const ty = kf(z, [0, 1], [820, YC.y]);
	const hi = prog(f, near, near + 10);
	const lat = prog(f, later, later + 12);
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(46,66,96,0.6), rgba(20,30,45,0) 75%)'}} />
			<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${tx - YC.x * s}px, ${ty - YC.y * s}px) scale(${s})`}}>
				<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
					{/* links: you → similar sequences */}
					{hi > 0
						? UNITS.filter((u) => u.similar && !u.you).map((u, i) => {
								const p = pos(u);
								const cx = p.x + (N * (SQ + GAP)) / 2;
								const d = prog(f, near + (i % 8), near + 12 + (i % 8));
								return <line key={i} x1={YC.x} y1={YC.y} x2={YC.x + (cx - YC.x) * d} y2={YC.y + (p.y + SQ / 2 - YC.y) * d} stroke={C.yellow} strokeWidth={1.6} opacity={0.55} />;
							})
						: null}
					{UNITS.map((u, k) => {
						const p = pos(u);
						const dist = Math.hypot(u.c - YOU.c, (u.r - YOU.r) / 3);
						const vis = u.you ? 1 : prog(f, zoom0 + 4 + dist * 2.2, zoom0 + 10 + dist * 2.2);
						if (vis <= 0) return null;
						const dim = u.similar ? 1 : 1 - 0.72 * hi;
						return (
							<g key={k} opacity={vis * dim}>
								{u.seq.map((cat, i) => {
									const inMotif = u.similar && MOTIF.includes(cat);
									const born = u.you ? prog(f, a + 2 + i * 2, a + 6 + i * 2) : 1;
									return <rect key={i} x={p.x + i * (SQ + GAP)} y={p.y} width={SQ} height={SQ} rx={2} fill={CAT[cat]} opacity={born} stroke={inMotif && hi > 0.5 ? C.paperWhite : 'none'} strokeWidth={1.5} />;
								})}
								{u.similar && hi > 0 ? <rect x={p.x - 4} y={p.y - 4} width={N * (SQ + GAP) + 4} height={SQ + 8} rx={4} fill="none" stroke={C.yellow} strokeWidth={u.you ? 3 : 2} opacity={hi} /> : null}
								{/* what they watched later (left = later, RTL) */}
								{u.similar && !u.you && lat > 0 ? (
									<g opacity={prog(f, later + (k % 10), later + 6 + (k % 10))}>
										<line x1={p.x - 6} y1={p.y + SQ / 2} x2={p.x - 16} y2={p.y + SQ / 2} stroke={C.yellow} strokeWidth={2} />
										<rect x={p.x - 16 - SQ - 4} y={p.y - 2} width={SQ + 4} height={SQ + 4} rx={3} fill={C.yellow} />
									</g>
								) : null}
								{u.you && lat > 0 ? (
									<g opacity={prog(f, wf(W.ba3dain) - 2, wf(W.ba3dain) + 6)}>
										<line x1={p.x - 6} y1={p.y + SQ / 2} x2={p.x - 16} y2={p.y + SQ / 2} stroke={C.yellow} strokeWidth={2} />
										<rect x={p.x - 16 - SQ - 4} y={p.y - 2} width={SQ + 4} height={SQ + 4} rx={3} fill="none" stroke={C.yellow} strokeWidth={2} strokeDasharray="3 3" />
									</g>
								) : null}
							</g>
						);
					})}
				</svg>
			</div>
			{/* «أنت» marker (screen space) */}
			{(() => {
				const sx = tx + (YP.x + N * (SQ + GAP) - YC.x) * s;
				const sy = ty;
				return (
					<div style={{position: 'absolute', left: sx + 14, top: sy - 30 - 16 * (s - 1) / 3, transform: `scale(${pop(f, a + 2)})`, transformOrigin: 'left center'}}>
						<Label text="أنت" size={z < 0.5 ? 46 : 30} bg={C.yellow} seed={8} />
					</div>
				);
			})()}
			{/* headline + legend */}
			{f >= zoom0 + 2 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, zoom0 + 2)})`}}>
					<div dir="rtl" style={{background: 'rgba(14,18,26,0.88)', border: `3px solid ${C.yellow}`, borderRadius: 10, padding: '10px 26px 14px', textAlign: 'center'}}>
						<div style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 56, color: C.yellow, lineHeight: 1.25}}>ملايين الأنماط</div>
						<div style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 26, color: C.paper, opacity: prog(f, zoom0 + 10, zoom0 + 18)}}>كل سطر = تسلسل مشاهدات لشخص</div>
					</div>
				</div>
			) : null}
			{lat > 0 ? (
				<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: 1262, display: 'flex', justifyContent: 'center', gap: 14, alignItems: 'center', opacity: lat}}>
					<div style={{width: 30, height: 30, borderRadius: 4, background: C.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<Icon name="plane" size={22} color={C.charcoal} stroke={2} />
					</div>
					<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 32, color: C.paperWhite}}>اللي صار يهمّهم بعدين: السفر</span>
				</div>
			) : null}
			{f >= near + 6 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1490, display: 'flex', justifyContent: 'center', opacity: prog(f, near + 6, near + 14)}}>
					<Badge text="النموذج تعلّم علاقات إحصائية من سلوك سابق" color={C.paper} bg="rgba(14,18,26,0.85)" size={22} rot={0} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
