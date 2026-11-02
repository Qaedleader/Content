// 30.0 – 37.5 s · Altman's real remark (Cheeky Pint, reported 30–31 Oct 2026): verbatim English quote + sourced, then the
// "scarce global resource / used a small part of the time" idea as a pixel-allocation visual (≈5% is his own estimate).
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EASE, kf, pop, prog, rand} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Label, TitleCard} from '../../../brand/type';
import {M, wf} from '../ep';
import {CR} from '../credits';
import {appear, G, Note, PixelRow, Shot, Stage, TechTag} from '../kit';

export const Quote: React.FC<{f: number}> = ({f}) => {
	const a = wf(82);
	const said = wf(86) - 1; // «اعتبر»
	const b = wf(90) - 1;
	return (
		<>
			<Shot f={f} a={a} b={b} src={M('m_altman_vg.jpg')} credit={CR.altmanVg} move={{s0: 1.05, s1: 1.16, y0: -60, y1: -20}} pos="50% 30%" grade="contrast(1.08) saturate(0.85) brightness(0.88)" dim={f >= said ? 0.5 * prog(f, said, said + 8) : 0.05} />
			<TitleCard frame={f} at={a + 2} text="وهذا كلامه الحرفي:" size={44} seed={31} out={said - 4} />
			{f >= said ? (
				<div style={{position: 'absolute', left: 60, right: 60, top: 520, transform: `scale(${pop(f, said)})`, opacity: Math.min(1, (f - said) / 4)}}>
					<div style={{background: 'rgba(251,248,241,0.96)', borderRadius: 8, padding: '30px 36px 26px', filter: SHADOW.lifted, borderLeft: `14px solid ${C.yellow}`}}>
						<div dir="ltr" style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 33, lineHeight: 1.42, color: C.charcoal}}>
							“From a global allocation perspective, actually, it's quite terrible to have everybody have a bunch of the world's limited supply of{' '}
							<span style={{background: C.yellow, padding: '0 6px'}}>DRAM</span> sitting in their own computer, and being used maybe{' '}
							<span style={{background: C.yellow, padding: '0 6px'}}>5% of the time</span>.”
						</div>
						<div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 18}}>
							<Img src={staticFile(M('logo_openai_sym.svg'))} style={{width: 40}} />
							<span style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 24, color: C.charcoalSoft}}>SAM ALTMAN · CHEEKY PINT</span>
						</div>
					</div>
					<div style={{display: 'flex', justifyContent: 'center', marginTop: 18, ...appear(f, said + 8)}}>
						<Note text="اقتباس حرفي · المصدر: مقابلة Cheeky Pint عبر XDA و Engadget · أكتوبر 2026" size={22} />
					</div>
				</div>
			) : null}
		</>
	);
};

/* ---------------- 33.3 – 37.5 s · a scarce global pool spread into devices that sit idle most of the time ---------------- */
const GRID_C = 16;
const GRID_R = 9;
const DEVICES = 4;
export const Allocation: React.FC<{f: number}> = ({f}) => {
	const a = wf(90);
	const rare = wf(93) - 1; // «نادر»
	const dev = wf(95) - 1; // «أجهزة»
	const use = wf(97) - 1; // «بتستخدمه»
	const small = wf(99) - 1; // «جزء بسيط»
	const b = wf(103) - 1;
	const split = prog(f, dev, dev + 14, EASE.io);
	const cell = 46;
	const gx = (1080 - GRID_C * cell) / 2;
	const gy = 470;
	return (
		<AbsoluteFill>
			<Stage f={f} grid={0.5} seed={8} />
			<TitleCard frame={f} at={a + 1} text="مورد عالمي نادر" size={50} seed={32} />
			{/* the world's DRAM supply as a pool of pixel cells; on «أجهزة» it splits into personal devices */}
			{Array.from({length: GRID_C * GRID_R}).map((_, k) => {
				const c = k % GRID_C;
				const r = Math.floor(k / GRID_C);
				const at = a + 2 + Math.floor(rand(k * 3 + 1) * 10);
				if (f < at) return null;
				const d = k % DEVICES; // destination device
				const x0 = gx + c * cell;
				const y0 = gy + r * cell;
				const lx = (k * 7) % 6;
				const ly = Math.floor(k / DEVICES) % 6;
				const x1 = 80 + d * 240 + 22 + lx * 30;
				const y1 = 1000 + ly * 0; // collapses into the device's memory bar
				const x = x0 + (x1 - x0) * split;
				const y = y0 + (y1 - y0) * split;
				const scarce = f >= rare ? 0.55 + 0.45 * Math.abs(Math.sin((f - rare + k) / 6)) : 1;
				return <div key={k} style={{position: 'absolute', left: x, top: y, width: cell - 8, height: cell - 8, background: C.yellow, opacity: (1 - split * 0.9) * scarce * Math.min(1, (f - at) / 4), boxShadow: `0 0 8px ${G.goldGlow}`}} />;
			})}
			{f < dev ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: gy + GRID_R * cell + 30, display: 'flex', justifyContent: 'center', ...appear(f, a + 8)}}>
					<Label text="مخزون DRAM العالمي · محدود" size={36} bg={C.paperWhite} seed={5} />
				</div>
			) : null}
			{/* personal devices: each holds memory that is busy only a small fraction of the time */}
			{f >= dev
				? Array.from({length: DEVICES}).map((_, d) => {
						const p = pop(f, dev + 6 + d * 2);
						const busy = f >= small ? 1 : f >= use ? Math.min(1, (f - use) / 10) : 0;
						return (
							<div key={d} style={{position: 'absolute', left: 60 + d * 245, top: 840, width: 220, transform: `scale(${p})`, opacity: p}}>
								{/* monitor */}
								<div style={{width: 220, height: 140, border: `6px solid ${C.paper}`, borderRadius: 10, background: '#0e141d', position: 'relative'}}>
									<div style={{position: 'absolute', left: 14, right: 14, top: 14, height: 10, background: 'rgba(244,236,221,0.25)'}} />
									<div style={{position: 'absolute', left: 14, width: 90, top: 34, height: 10, background: 'rgba(244,236,221,0.18)'}} />
								</div>
								<div style={{width: 60, height: 22, background: C.paper, margin: '0 auto'}} />
								<div style={{width: 120, height: 8, background: C.paper, margin: '0 auto', borderRadius: 4}} />
								{/* memory usage meter: 20 pixels, ~1 lit (≈5%) */}
								<div style={{marginTop: 22, display: 'flex', justifyContent: 'center', opacity: prog(f, use - 2, use + 4)}}>
									<div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 16px)', gap: 4, direction: 'ltr'}}>
										{Array.from({length: 20}).map((_, i) => (
											<div key={i} style={{width: 16, height: 16, background: i < Math.round(busy) ? C.yellow : 'rgba(244,236,221,0.16)', boxShadow: i < Math.round(busy) ? `0 0 10px ${G.goldGlow}` : undefined}} />
										))}
									</div>
								</div>
							</div>
						);
					})
				: null}
			{f >= use ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 650, display: 'flex', justifyContent: 'center', ...appear(f, use)}}>
					<Label text="ذاكرة قاعدة بأجهزتنا" size={44} bg={C.paperWhite} seed={6} />
				</div>
			) : null}
			{f >= small ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1130, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, ...appear(f, small)}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
						<TechTag text="≈ 5%" size={56} />
						<Label text="من الوقت" size={42} bg={C.paperWhite} seed={7} />
					</div>
					<Note text="الرقم تقدير ألتمان نفسه («maybe 5%») · مش قياس" size={22} />
				</div>
			) : null}
			{f >= small + 10 ? (
				<div style={{position: 'absolute', right: 70, top: 410, opacity: prog(f, small + 10, small + 16)}}>
					<PixelRow n={5} lit={Math.min(5, Math.floor((f - small - 10) / 2))} size={12} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

export const _q = kf;
