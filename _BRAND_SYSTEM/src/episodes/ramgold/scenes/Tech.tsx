// 13.2 – 22.6 s · what RAM does → DRAM is a type of RAM → HBM is stacked DRAM next to AI processors.
// Accuracy: HBM ⊂ DRAM ⊂ RAM (nested sets). Not every RAM module is HBM.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {HeroWord, Label, TitleCard} from '../../../brand/type';
import {M, wf} from '../ep';
import {CR} from '../credits';
import {appear, G, LogoCard, Note, PixelRow, RamCut, Shot, Stage, TechTag} from '../kit';

/* ---------------- 13.2 – 16.9 s · RAM = the computer's fast working memory ---------------- */
const VStream: React.FC<{f: number; a: number; b: number; x: number; y0: number; y1: number; n?: number; speed?: number; size?: number; seed?: number}> = ({f, a, b, x, y0, y1, n = 9, speed = 1, size = 16, seed = 1}) => {
	if (f < a || f > b) return null;
	const life = prog(f, a, a + 6) * (1 - prog(f, b - 6, b));
	return (
		<>
			<div style={{position: 'absolute', left: x - 2, top: Math.min(y0, y1), width: 4, height: Math.abs(y1 - y0), background: 'rgba(242,182,48,0.25)', opacity: life}} />
			{Array.from({length: n}).map((_, i) => {
				const ph = ((f - a) * 0.032 * speed + i / n) % 1;
				const y = y0 + (y1 - y0) * ph;
				const xx = x + ((i * 37) % 5 - 2) * 7;
				return <div key={i} style={{position: 'absolute', left: xx - size / 2, top: y - size / 2, width: size, height: size, background: C.yellow, opacity: life * Math.min(1, ph * 5) * Math.min(1, (1 - ph) * 5), boxShadow: `0 0 12px ${G.goldGlow}`}} />;
			})}
		</>
	);
};

const Node: React.FC<{title: string; tag: string; w?: number; hot?: number}> = ({title, tag, w = 520, hot = 0}) => (
	<div dir="rtl" style={{width: w, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(17,25,38,0.94)', border: `3px solid ${hot > 0 ? C.yellow : 'rgba(154,165,174,0.5)'}`, borderRadius: 10, padding: '16px 26px', filter: SHADOW.lifted, boxShadow: hot > 0 ? `0 0 ${30 * hot}px ${G.goldGlow}` : undefined}}>
		<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 42, color: C.paper}}>{title}</span>
		<TechTag text={tag} size={26} bg={C.paperWhite} />
	</div>
);

export const WorkMemory: React.FC<{f: number}> = ({f}) => {
	const a = wf(38);
	const diag = wf(42) - 1; // «يشغل البرامج»
	const data = wf(44) - 1; // «ويعالج البيانات»
	const fast = wf(46) - 1; // «بسرعة»
	const b = wf(47) - 1;
	const speed = f >= fast ? 2.6 : 1;
	return (
		<>
			<Shot f={f} a={a} b={wf(40) + 4} src={M('v_ram_in1.mp4')} credit={CR.pcBuild} move={{s0: 1.08, s1: 1.16, p0: 46, p1: 52}} />
			<Shot f={f} a={wf(40) + 5} b={diag - 1} src={M('v_ram_in2.mp4')} credit={CR.pcBuild} move={{s0: 1.12, s1: 1.06, p0: 50, p1: 44}} />
			{f < diag ? (
				<>
					<TitleCard frame={f} at={a + 1} text="الذاكرة اللي بيستخدمها جهازك" size={44} seed={21} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center', ...appear(f, a + 8)}}>
						<TechTag text="RAM · RANDOM ACCESS MEMORY" size={30} />
					</div>
				</>
			) : (
				<AbsoluteFill>
					<Stage f={f} grid={0.6} seed={5} />
					<TitleCard frame={f} at={diag + 1} text="RAM = ذاكرة العمل السريعة" size={46} seed={22} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, diag + 2)})`}}>
						<Node title="التخزين" tag="SSD" />
					</div>
					<div style={{position: 'absolute', left: 90, top: 640, transform: `scale(${pop(f, diag + 5)})`}}>
						<RamCut w={900} glow={0.25 + 0.3 * prog(f, fast, fast + 6)} sweep={prog(f, diag, b, EASE.linear)} />
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 960, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, data)})`}}>
						<Node title="المعالج" tag="CPU" hot={f >= data ? 1 : 0} />
					</div>
					<VStream f={f} a={diag + 4} b={b + 10} x={540} y0={470} y1={640} speed={speed} seed={2} />
					<VStream f={f} a={data} b={b + 10} x={420} y0={870} y1={960} n={6} speed={speed * 1.4} seed={3} />
					<VStream f={f} a={data + 3} b={b + 10} x={660} y0={960} y1={870} n={6} speed={speed * 1.4} seed={4} />
					{/* labels on the streams */}
					{f >= wf(43) - 1 ? (
						<div style={{position: 'absolute', left: 600, top: 520, ...appear(f, wf(43) - 1)}}>
							<Label text="البرامج" size={34} bg={C.yellow} seed={5} />
						</div>
					) : null}
					{f >= wf(45) - 1 ? (
						<div style={{position: 'absolute', left: 700, top: 880, ...appear(f, wf(45) - 1)}}>
							<Label text="البيانات" size={34} bg={C.yellow} seed={6} />
						</div>
					) : null}
					{f >= fast ? (
						<div style={{position: 'absolute', left: 0, right: 0, top: 1110, display: 'flex', justifyContent: 'center', ...appear(f, fast)}}>
							<Note text="ذاكرة مؤقتة: محتواها بينمسح لما ينطفي الجهاز" size={26} />
						</div>
					) : null}
				</AbsoluteFill>
			)}
		</>
	);
};

/* ---------------- 16.9 – 19.9 s · RAM ⊃ DRAM ⊃ HBM (stacked DRAM) ---------------- */
export const Family: React.FC<{f: number}> = ({f}) => {
	const a = wf(47);
	const dram = wf(50) - 1;
	const stackA = wf(53) - 2; // «نوع مطوّر»
	const hbm = wf(56) - 1;
	const b = wf(56) + 9;
	const layers = 8;
	return (
		<AbsoluteFill>
			<Stage f={f} grid={0.5} seed={6} />
			<TitleCard frame={f} at={a + 1} text="عائلة الذاكرة" size={46} seed={23} />
			{/* outer set: RAM */}
			<div style={{position: 'absolute', left: 60, top: 330, width: 960, height: 980, border: '4px dashed rgba(244,236,221,0.6)', borderRadius: 28, opacity: prog(f, a, a + 6), transform: `scale(${0.92 + 0.08 * pop(f, a)})`}}>
				<div style={{position: 'absolute', right: 30, top: 22}}>
					<Label text="RAM" size={44} bg={C.paperWhite} font={FONT.mono} dir="ltr" seed={2} />
				</div>
				<div dir="rtl" style={{position: 'absolute', right: 34, top: 96, fontFamily: FONT.label, fontWeight: 700, fontSize: 26, color: 'rgba(244,236,221,0.8)'}}>
					ذاكرة الوصول العشوائي · المفهوم العام
				</div>
			</div>
			{/* middle set: DRAM — with a real DRAM package */}
			{f >= dram ? (
				<div style={{position: 'absolute', left: 110, top: 480, width: 860, height: 790, border: `4px solid ${C.yellow}`, background: 'rgba(242,182,48,0.07)', borderRadius: 22, transform: `scale(${0.8 + 0.2 * slam(f, dram)})`, opacity: Math.min(1, (f - dram) / 3)}}>
					<div style={{position: 'absolute', right: 26, top: 20, display: 'flex', alignItems: 'center', gap: 12}}>
						<TechTag text="DRAM" size={48} />
					</div>
					<div dir="rtl" style={{position: 'absolute', right: 30, top: 96, fontFamily: FONT.label, fontWeight: 700, fontSize: 26, color: C.paper}}>
						نوع من الرام · الأشهر بأجهزتنا
					</div>
					<div style={{position: 'absolute', left: 36, top: 26, width: 300, transform: `rotate(-3deg) scale(${pop(f, dram + 4)})`, filter: SHADOW.lifted}}>
						<Img src={staticFile(M('m_samsung_pkg.jpg'))} style={{width: 300, display: 'block', border: `6px solid ${C.paperWhite}`}} />
						<div style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 16, color: C.paper, marginTop: 4}} dir="ltr">
							Samsung DRAM chip · {CR.mcmaster}
						</div>
					</div>
				</div>
			) : null}
			{/* inner set: HBM = DRAM dies stacked vertically */}
			{f >= stackA ? (
				<div style={{position: 'absolute', left: 250, top: 700, width: 580, height: 520}}>
					{Array.from({length: layers}).map((_, k) => {
						const at = stackA + k * 2.2;
						const d = prog(f, at, at + 6, EASE.out);
						const y = 400 - k * 36 - (1 - d) * 260;
						return (
							<div
								key={k}
								style={{position: 'absolute', left: 150, top: y, width: 280, height: 30, background: k === 0 ? '#4b5563' : `linear-gradient(90deg, #2a2f38, #555d6b 50%, #2a2f38)`, border: `2px solid ${C.yellow}`, borderRadius: 4, opacity: d, transform: 'perspective(600px) rotateX(38deg)', boxShadow: '0 6px 10px rgba(0,0,0,0.5)'}}
							/>
						);
					})}
					{/* through-silicon via hint: thin vertical lines through the stack */}
					{f >= hbm - 4
						? [0.3, 0.5, 0.7].map((p, i) => <div key={i} style={{position: 'absolute', left: 150 + 280 * p, top: 400 - 7 * 36 + 6, width: 3, height: 7 * 36 + 20, background: C.yellow, opacity: 0.7 * prog(f, hbm - 4, hbm + 2), boxShadow: `0 0 8px ${G.goldGlow}`}} />)
						: null}
					{f >= hbm ? (
						<>
							<div style={{position: 'absolute', left: 60, top: 30, width: 460, height: 450, border: `4px solid ${C.paperWhite}`, borderRadius: 18, transform: `scale(${0.85 + 0.15 * slam(f, hbm)})`, opacity: Math.min(1, (f - hbm) / 3)}} />
							<div style={{position: 'absolute', left: 0, right: 0, top: -6, display: 'flex', justifyContent: 'center', transform: `scale(${slam(f, hbm)})`}}>
								<TechTag text="HBM" size={64} bg={C.paperWhite} />
							</div>
						</>
					) : (
						<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: 20, textAlign: 'center', fontFamily: FONT.display, fontWeight: 800, fontSize: 36, color: C.paper, ...appear(f, stackA + 2)}}>
							طبقات DRAM فوق بعض
						</div>
					)}
				</div>
			) : null}
			{f >= hbm + 2 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1236, display: 'flex', justifyContent: 'center', ...appear(f, hbm + 2)}}>
					<TechTag text="HIGH BANDWIDTH MEMORY" size={30} bg={C.yellow} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/* ---------------- 19.9 – 22.6 s · HBM sits beside the processor; used by powerful AI accelerators ---------------- */
const SPOTS = [
	{x: 0.34, y: 0.4},
	{x: 0.285, y: 0.54},
	{x: 0.665, y: 0.49},
	{x: 0.6, y: 0.66},
];
export const AiProcessors: React.FC<{f: number; end: number}> = ({f, end}) => {
	const a = wf(56) + 10;
	const gh = wf(58) - 1; // «معالجات»
	const strong = wf(61) - 1; // «القوية»
	const cw = 1000;
	const ch = (cw * 1740) / 2600;
	const zoom = kf(f, [a, gh], [1.0, 1.08], EASE.linear);
	return (
		<>
			{f < gh ? (
				<AbsoluteFill>
					<Stage f={f} grid={0.4} seed={7} />
					<TitleCard frame={f} at={a + 1} text="HBM بتنحط جنب المعالج مباشرة" size={42} seed={24} />
					<div style={{position: 'absolute', left: 40, top: 470, width: cw, height: ch, transform: `scale(${zoom * (0.9 + 0.1 * pop(f, a))})`, filter: SHADOW.lifted}}>
						<Img src={staticFile(M('m_fiji.jpg'))} style={{width: cw, height: ch, display: 'block', border: `8px solid ${C.paperWhite}`}} />
						{/* GPU die */}
						<div style={{position: 'absolute', left: cw * 0.48 - 120, top: ch * 0.5 - 30, ...appear(f, a + 6)}}>
							<Label text="المعالج (GPU)" size={34} bg={C.paperWhite} seed={3} />
						</div>
						{SPOTS.map((s, i) => {
							const at = a + 4 + i * 2;
							return f >= at ? <div key={i} style={{position: 'absolute', left: cw * s.x - 34, top: ch * s.y - 30, width: 68, height: 60, border: `5px solid ${C.yellow}`, borderRadius: 6, transform: `scale(${pop(f, at)})`, boxShadow: `0 0 18px ${G.goldGlow}`}} /> : null;
						})}
						<div style={{position: 'absolute', left: 30, top: ch - 100, ...appear(f, a + 12)}}>
							<TechTag text="HBM × 4" size={36} />
						</div>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1170, display: 'flex', justifyContent: 'center', ...appear(f, a + 10)}}>
						<Note text="مثال حقيقي: AMD Fiji (2015) · أول معالج رسومي بذاكرة HBM" size={24} />
					</div>
					<div style={{position: 'absolute', left: 44, top: 1488}}>
						<Note text={`صورة حقيقية · ${CR.fiji}`} size={20} />
					</div>
				</AbsoluteFill>
			) : null}
			<Shot f={f} a={gh} b={strong - 1} src={M('v_gh200.mp4')} credit={CR.qct} kind="لقطات حقيقية" trim={0.4} move={{s0: 1.15, s1: 1.25, p0: 38, p1: 46}} dim={0.1} />
			<Shot f={f} a={strong} b={end} src={M('m_b200.jpg')} credit={CR.b200} move={{s0: 1.2, s1: 1.08, p0: 40, p1: 30}} dim={0.15} />
			{f >= gh ? (
				<>
					<TitleCard frame={f} at={gh + 1} text="معالجات الذكاء الاصطناعي" size={46} seed={25} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 1090, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, ...appear(f, gh + 6)}}>
						<TechTag text={f >= strong ? 'NVIDIA B200 · HBM3E' : 'NVIDIA GH200 · HBM3'} size={32} bg={C.paperWhite} />
					</div>
				</>
			) : null}
			{f >= strong ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', transform: `scale(${0.6 + 0.4 * slam(f, strong)}) rotate(-2deg)`}}>
					<HeroWord text="القوية" size={170} strip={C.charcoal} />
				</div>
			) : null}
			{f >= strong + 6 ? (
				<div style={{position: 'absolute', right: 70, top: 1250, opacity: prog(f, strong + 6, strong + 12)}}>
					<PixelRow n={8} lit={Math.min(8, Math.floor((f - strong - 6) / 2))} size={14} />
				</div>
			) : null}
		</>
	);
};

export {LogoCard};
