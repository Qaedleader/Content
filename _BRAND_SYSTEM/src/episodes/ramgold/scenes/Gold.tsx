// 47.4 s – end · «فهل رح نوصل لمرحلة تصير فيها الرام مثل الذهب، ولا رح يلاقوا لها حل؟»
// The real RAM module turns to gold (a visual metaphor, labelled as such — not a forecast or investment advice).
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord} from '../../../brand/type';
import {M, wf, we} from '../ep';
import {CR} from '../credits';
import {G, GoldDust, Note, PixelRow, RamCut, Sweep} from '../kit';

export const GoldFinale: React.FC<{f: number; end: number}> = ({f, end}) => {
	const a = wf(128);
	const ram = wf(134) - 1; // «الرام»
	const gold = wf(136) - 1; // «الذهب»
	const q = wf(137) - 1; // «ولا رح يلاقوا لها حل؟»
	const last = we(141);
	const wipe = prog(f, ram + 2, gold + 6, EASE.io);
	const cam = kf(f, [a, gold, end], [0.8, 0.94, 1.0], EASE.out);
	const tilt = kf(f, [a, gold, end], [32, 10, 6], EASE.out);
	const rise = kf(f, [a, gold], [80, 0], EASE.out);
	const barsO = prog(f, ram, gold + 10);
	return (
		<AbsoluteFill style={{background: G.ink}}>
			{/* real gold bars (CC0) as a deep, blurred backdrop that warms up as the module turns to gold */}
			<AbsoluteFill style={{opacity: 0.18 + 0.5 * barsO}}>
				<Img src={staticFile(M('m_gold_bars.jpg'))} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(14px) brightness(0.45) saturate(1.2)', transform: `scale(${1.25 - 0.08 * prog(f, a, end, EASE.linear)})`}} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 75% 38% at 50% 50%, rgba(242,182,48,${0.06 + 0.3 * wipe}), rgba(7,9,12,0) 70%)`}} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)'}} />
			{/* the module: large diagonal hero, slow push and rotation */}
			<div style={{position: 'absolute', left: 540 - 760, top: 900 - 185 + rise, width: 1520, height: 370, transform: `rotate(${-58 + 6 * prog(f, a, end, EASE.linear)}deg) scale(${cam})`, transformOrigin: '50% 50%'}}>
				<RamCut w={1520} gold={wipe} tilt={tilt * 0.4} glow={0.2 + 0.9 * wipe} sweep={f >= gold ? ((f - gold) % 54) / 54 : prog(f, a, ram, EASE.linear)} />
			</div>
			<GoldDust f={f} o={0.25 + 0.75 * wipe} />
			{f >= a && f < ram ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 260, display: 'flex', justifyContent: 'center', opacity: prog(f, a + 2, a + 10) * (1 - prog(f, ram - 4, ram))}}>
					<div dir="rtl" style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 64, color: C.paper, textShadow: '0 6px 18px rgba(0,0,0,0.7)'}}>
						فهل رح نوصل لمرحلة…
					</div>
				</div>
			) : null}
			{f >= gold - 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center', transform: `scale(${0.5 + 0.5 * slam(f, gold - 1)}) rotate(-2deg)`}}>
					<HeroWord text="الرام = ذهب؟" size={150} face={G.goldHot} back={G.goldDeep} strip={C.charcoal} />
				</div>
			) : null}
			{f >= q ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1170, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
					<div style={{transform: `scale(${pop(f, q)})`}}>
						<div dir="rtl" style={{background: C.paperWhite, padding: '14px 34px 18px', borderRadius: 6, filter: SHADOW.lifted, fontFamily: FONT.display, fontWeight: 900, fontSize: 58, color: C.charcoal}}>
							ولا رح <span style={{background: C.yellow, padding: '0 10px'}}>يلاقوا لها حل؟</span>
						</div>
					</div>
				</div>
			) : null}
			{f >= gold + 8 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1320, display: 'flex', justifyContent: 'center', opacity: prog(f, gold + 8, gold + 16)}}>
					<Badge text="تشبيه بصري · مش توقّع ولا نصيحة استثمارية" color={C.yellow} bg="rgba(20,22,26,0.9)" size={22} rot={-1} />
				</div>
			) : null}
			{f >= last ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', justifyContent: 'center', opacity: prog(f, last, last + 6)}}>
					<PixelRow n={10} lit={Math.min(10, Math.floor((f - last) / 1.5))} size={14} gap={8} />
				</div>
			) : null}
			<div style={{position: 'absolute', left: 44, top: 1488, opacity: 0.9}}>
				<Note text={`صورة حقيقية · ${CR.rdimm} · ذهب: ${CR.goldBars} · التذهيب معالجة بصرية`} size={18} />
			</div>
			{wipe > 0.98 ? <Sweep pos={((f - gold) % 80) / 80} strength={0.08} /> : null}
		</AbsoluteFill>
	);
};
