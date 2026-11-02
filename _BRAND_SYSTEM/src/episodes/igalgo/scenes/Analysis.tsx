// 25.5 – 28.9 s · «الذكاء الاصطناعي بحلل تصرفاتك وتوقيتها وترتيبها»
// A sequence table of last night's feed: behaviour · timing · order, highlighted on each word, then wired into a model.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, pop, prog} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {TitleCard} from '../../../brand/type';
import {M, W, wf} from '../ep';
import {PixelRow} from '../../asml/kit';
import {Icon, IconName, Media} from '../ui';

const COLS: {src: string; act: IconName; actText: string; time: string; watch: number; skipped?: boolean}[] = [
	{src: 't_cafe.jpg', act: 'pause', actText: 'توقف', time: '١١:٤٧', watch: 1},
	{src: 't_desk.jpg', act: 'skip', actText: 'تخطي', time: '١١:٤٨', watch: 0.12, skipped: true},
	{src: 't_apt.jpg', act: 'replay', actText: 'إعادة', time: '١١:٤٩', watch: 1},
	{src: 't_fruit.jpg', act: 'skip', actText: 'تخطي', time: '١١:٥٠', watch: 0.08, skipped: true},
	{src: 't_train.jpg', act: 'clock', actText: 'طويلة', time: '١١:٥٢', watch: 1},
];
const ROWS = [
	{label: 'التصرف', y: 690, word: W.tasarrufat},
	{label: 'التوقيت', y: 790, word: W.tawqeet},
	{label: 'الترتيب', y: 890, word: W.tarteeb},
];
const X0 = 790; // first column centre (RTL: sequence runs right → left)
const DX = 168;
const MODEL = {x: 540, y: 1150};

export const Analysis: React.FC<{f: number; end: number}> = ({f, end}) => {
	const a = wf(W.ai);
	if (f < a || f > end) return null;
	const wire = wf(W.tarteeb) + 6;
	const w = prog(f, wire, wire + 12, EASE.io);
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			<AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(154,165,174,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(154,165,174,0.07) 2px, transparent 2px)', backgroundSize: '60px 60px'}} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 55% at 50% 45%, rgba(46,66,96,0.55), rgba(20,30,45,0) 75%)'}} />
			<TitleCard frame={f} at={a + 1} text="الذكاء الاصطناعي بحلّل" size={48} seed={51} />
			{/* row labels + highlight bands */}
			{ROWS.map((r, i) => {
				const on = f >= wf(r.word) - 1;
				const hb = prog(f, wf(r.word) - 1, wf(r.word) + 5);
				return (
					<React.Fragment key={i}>
						<div style={{position: 'absolute', left: 30, right: 30, top: r.y - 42, height: 84, borderRadius: 12, background: `rgba(242,182,48,${0.16 * hb})`, border: `2px solid rgba(242,182,48,${0.7 * hb})`, opacity: 1 - w * 0.6}} />
						<div dir="rtl" style={{position: 'absolute', right: 40, top: r.y - 26, fontFamily: FONT.display, fontWeight: 800, fontSize: 34, color: on ? C.yellow : 'rgba(251,248,241,0.55)', opacity: prog(f, a + 6 + i * 3, a + 12 + i * 3)}}>
							{r.label}
						</div>
					</React.Fragment>
				);
			})}
			{/* sequence line through the order row */}
			<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={X0} y1={890} x2={X0 - DX * 4 * prog(f, wf(W.tarteeb) - 1, wf(W.tarteeb) + 10)} y2={890} stroke={C.yellow} strokeWidth={5} strokeLinecap="round" />
				{COLS.map((c, i) => {
					const x = X0 - i * DX;
					const d = prog(f, wire + i * 1.5, wire + 8 + i * 1.5);
					const path = `M ${x} 940 C ${x} 1040, ${MODEL.x + (x - MODEL.x) * 0.3} ${MODEL.y - 120}, ${MODEL.x} ${MODEL.y - 70}`;
					return <path key={i} d={path} fill="none" stroke={c.skipped ? 'rgba(251,248,241,0.45)' : C.yellow} strokeWidth={c.skipped ? 3 : 5} strokeDasharray={`${d * 500} 1000`} />;
				})}
			</svg>
			{COLS.map((c, i) => {
				const x = X0 - i * DX;
				const p = pop(f, a + 3 + i * 3, {damping: 13, stiffness: 240, mass: 0.6});
				const hb = (k: number) => prog(f, wf(ROWS[k].word) - 1, wf(ROWS[k].word) + 5);
				return (
					<React.Fragment key={i}>
						<div style={{position: 'absolute', left: x - 64, top: 330, width: 128, height: 228, borderRadius: 12, overflow: 'hidden', transform: `scale(${p})`, boxShadow: c.skipped ? undefined : `0 0 0 3px ${C.yellow}`, filter: SHADOW.soft, opacity: c.skipped ? 0.55 : 1}}>
							<Media src={M(c.src)} />
						</div>
						{/* watch-share bar */}
						<div style={{position: 'absolute', left: x - 60, top: 576, width: 120, height: 10, borderRadius: 5, background: 'rgba(251,248,241,0.2)', transform: `scale(${p})`}}>
							<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${c.watch * 100 * prog(f, a + 8 + i * 3, a + 20 + i * 3)}%`, borderRadius: 5, background: c.skipped ? C.steel : C.yellow}} />
						</div>
						{/* behaviour */}
						<div style={{position: 'absolute', left: x - 40, top: 690 - 40, width: 80, height: 80, borderRadius: '50%', background: hb(0) > 0.5 && !c.skipped ? C.yellow : 'rgba(251,248,241,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`}}>
							<Icon name={c.act} size={44} color={hb(0) > 0.5 && !c.skipped ? C.charcoal : C.paper} stroke={2.6} />
						</div>
						{/* timing */}
						<div dir="ltr" style={{position: 'absolute', left: x - 80, width: 160, top: 790 - 24, textAlign: 'center', fontFamily: FONT.mono, fontWeight: 800, fontSize: 34, color: hb(1) > 0.5 ? C.yellow : 'rgba(251,248,241,0.7)', opacity: p}}>
							{c.time}
						</div>
						{/* order */}
						<div style={{position: 'absolute', left: x - 30, top: 890 - 30, width: 60, height: 60, borderRadius: '50%', background: hb(2) > 0.5 ? C.yellow : C.navy, border: `3px solid ${C.yellow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`, fontFamily: FONT.display, fontWeight: 900, fontSize: 32, color: hb(2) > 0.5 ? C.charcoal : C.paper}}>
							{['١', '٢', '٣', '٤', '٥'][i]}
						</div>
					</React.Fragment>
				);
			})}
			{/* the model */}
			{f >= wire ? (
				<div style={{position: 'absolute', left: MODEL.x - 260, top: MODEL.y - 70, width: 520, transform: `scale(${pop(f, wire + 4)})`}}>
					<div dir="rtl" style={{background: C.paperWhite, borderRadius: 16, padding: '20px 26px', filter: SHADOW.lifted, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
						<div style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 40, color: C.charcoal}}>نموذج التوصية</div>
						<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
							{[0, 1, 2].map((r) => (
								<PixelRow key={r} n={5} lit={Math.max(0, Math.min(5, Math.floor((f - wire - 6 - r * 2) / 1.5)))} size={12} gap={5} off="rgba(38,35,33,0.18)" />
							))}
						</div>
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
