// 0 – 13.2 s · hook («حرب عالمية … عندك إنت؟»), Sam Altman (interpretation, not a quote), reveal «الرام».
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, Label, TitleCard} from '../../../brand/type';
import {M, WORDS, wf, we} from '../ep';
import {CR} from '../credits';
import {appear, Brackets, EdTag, G, LogoCard, Note, PixelMask, PixelRow, RamCut, Stage, Sweep, TechTag, Shot} from '../kit';

/* ---------------- 0 – 4.2 s · the war over something you own ---------------- */
export const Opening: React.FC<{f: number}> = ({f}) => {
	const A = wf(3); // «حرب»
	const B = wf(5); // «بين شركات»
	const Cc = wf(9); // «لإشي موجود عندك»
	const end = wf(13) - 1;
	const lockAt = wf(11) - 2; // «عندك»
	return (
		<>
			{/* 0: real DRAM chip macro — light rakes across the package */}
			<Shot f={f} a={0} b={A - 1} src={M('m_ram_chip.jpg')} credit={CR.ramChip} move={{s0: 1.5, s1: 1.22, x0: 60, x1: 0}} grade="contrast(1.15) saturate(1.05) brightness(0.9)">
				<Sweep pos={prog(f, 0, A, EASE.linear)} strength={0.45} />
			</Shot>
			{/* «حرب عالمية»: AI-scale compute */}
			<Shot f={f} a={A} b={B - 1} src={M('m_frontier.jpg')} credit={CR.frontier} move={{s0: 1.28, s1: 1.12, p0: 46, p1: 54}} dim={0.25} />
			{/* «بين شركات الذكاء الاصطناعي»: real data-centre footage */}
			<Shot f={f} a={B} b={Cc - 1} src={M('v_dc_trays.mp4')} credit={CR.dcTour} trim={0.5} move={{s0: 1.06, s1: 1.14, p0: 40, p1: 58}} dim={0.2} />
			{/* «لإشي موجود عندك إنت؟»: a personal PC; the RGB RAM stick is locked by brackets but stays pixel-masked */}
			<Shot f={f} a={Cc} b={end} src={M('m_gamingpc.jpg')} credit={CR.gamingPc} move={{s0: 1.1, s1: 1.45, p0: 50, p1: 66}} ease={EASE.out} dim={0.12} />

			<EdTag f={f} at={0} text="حرب الذاكرة" date="الذكاء الاصطناعي · 2026" out={Cc - 4} />
			{f < A ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1120, display: 'flex', justifyContent: 'center', ...appear(f, 3)}}>
					<TechTag text="DRAM · MEMORY CHIP" size={30} bg={C.paperWhite} />
				</div>
			) : null}
			{f >= A && f < B ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', transform: `scale(${0.55 + 0.45 * slam(f, A)}) rotate(-2deg)`}}>
					<HeroWord text="حرب عالمية" size={170} strip={C.charcoal} />
				</div>
			) : null}
			{f >= B && f < Cc ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
					<div style={{transform: `scale(${pop(f, wf(6))}) rotate(-2deg)`}}>
						<LogoCard src="logo_openai.svg" w={330} pad={24} />
					</div>
					<div style={{transform: `scale(${pop(f, wf(7))}) rotate(2deg)`}}>
						<LogoCard src="logo_nvidia_w.svg" w={330} pad={22} bg={C.charcoal} />
					</div>
					<div style={{...appear(f, wf(7) + 4)}}>
						<Label text="شركات الذكاء الاصطناعي" size={40} bg={C.yellow} seed={4} />
					</div>
				</div>
			) : null}
			{f >= Cc ? (
				<>
					<Brackets f={f} at={lockAt} x={295} y={560} w={190} h={700} />
					{f >= lockAt + 4 ? (
						<div style={{position: 'absolute', left: 0, right: 0, top: 400, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, lockAt + 4)}) rotate(-3deg)`}}>
							<Label text="داخل جهازك" size={46} bg={C.paperWhite} seed={8} />
						</div>
					) : null}
					{f >= wf(12) ? (
						<div style={{position: 'absolute', left: 560, top: 700, transform: `scale(${slam(f, wf(12))})`}}>
							<HeroWord text="؟" size={190} />
						</div>
					) : null}
				</>
			) : null}
		</>
	);
};

/* ---------------- 4.2 – 7.1 s · Sam Altman, CEO of the company that made ChatGPT ---------------- */
export const Altman: React.FC<{f: number}> = ({f}) => {
	const a = wf(13);
	const b = wf(21) - 1;
	const name = wf(15) - 1;
	const role = wf(17);
	const gpt = wf(20) - 1;
	return (
		<>
			<Shot f={f} a={a} b={b} src={M('m_altman_ted.jpg')} credit={CR.altmanTed} kind="صورة حقيقية" move={{s0: 1.06, s1: 1.18, y0: 30, y1: -20}} grade="contrast(1.1) saturate(0.85) brightness(0.92)" />
			{f >= name ? (
				<div style={{position: 'absolute', left: 60, right: 60, top: 1040, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14}}>
					<div style={{transform: `translateX(${(1 - pop(f, name)) * 400}px)`, opacity: Math.min(1, (f - name) / 4)}}>
						<div dir="rtl" style={{background: C.paperWhite, padding: '14px 30px 16px', borderRadius: 6, filter: SHADOW.lifted, borderRight: `14px solid ${C.yellow}`}}>
							<div style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 64, color: C.charcoal, lineHeight: 1.15}}>سام ألتمان</div>
							<div dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 28, color: C.charcoalSoft, textAlign: 'right'}}>SAM ALTMAN</div>
						</div>
					</div>
					{f >= role ? (
						<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 16, ...appear(f, role)}}>
							<Label text="الرئيس التنفيذي لـ" size={34} bg={C.charcoal} fg={C.paper} />
							<LogoCard src="logo_openai.svg" w={200} pad={12} />
						</div>
					) : null}
				</div>
			) : null}
			{f >= gpt ? (
				<div style={{position: 'absolute', left: 70, top: 1260, display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${pop(f, gpt)})`, transformOrigin: 'left center'}}>
					<Img src={staticFile(M('logo_chatgpt.svg'))} style={{width: 92, borderRadius: 18, filter: SHADOW.lifted}} />
					<TechTag text="ChatGPT" size={40} />
				</div>
			) : null}
		</>
	);
};

/* ---------------- 7.1 – 11.2 s · the narrator's reading of his position (NOT a quotation) ---------------- */
const LINES: {words: number[]; top: number; size: number; hi?: boolean}[] = [
	{words: [25, 26, 27, 28], top: 640, size: 78},
	{words: [29, 30], top: 770, size: 112, hi: true},
	{words: [31, 32, 33], top: 960, size: 84},
];
export const Interpretation: React.FC<{f: number}> = ({f}) => {
	const a = wf(21);
	const b = wf(34) - 1;
	return (
		<>
			<Shot f={f} a={a} b={b} src={M('m_altman_tc.jpg')} credit={CR.altmanTc} move={{s0: 1.1, s1: 1.22, x0: 40, x1: -40}} grade="grayscale(0.75) contrast(1.15) brightness(0.7)" dim={0.42} />
			<TitleCard frame={f} at={a + 2} text="من كلامه… كأنه بيحكي:" size={44} seed={12} />
			{f >= wf(23) ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, wf(23))})`}}>
					<Badge text="تفسير الراوي لكلامه · مش اقتباس حرفي" color={C.yellow} bg="rgba(20,22,26,0.9)" size={28} rot={-1.5} />
				</div>
			) : null}
			{/* opening / closing quote marks in brand yellow */}
			{f >= wf(25) - 1 ? <div style={{position: 'absolute', right: 30, top: 560, fontFamily: FONT.hero, fontSize: 150, color: C.yellow, opacity: 0.85 * prog(f, wf(25) - 1, wf(25) + 5)}}>«</div> : null}
			{LINES.map((ln, k) => (
				<div key={k} dir="rtl" style={{position: 'absolute', left: 50, right: 50, top: ln.top, display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', gap: '0 20px', whiteSpace: 'nowrap'}}>
					{ln.words.map((i) => {
						const at = wf(i) - 1;
						if (f < at) return <span key={i} style={{fontFamily: ln.hi ? FONT.hero : FONT.display, fontWeight: 900, fontSize: ln.size, visibility: 'hidden'}}>{WORD(i)}</span>;
						const p = pop(f, at, {damping: 12, stiffness: 300, mass: 0.55});
						const spoken = f <= we(i) + 2;
						return (
							<span
								key={i}
								style={{
									display: 'inline-block',
									fontFamily: ln.hi ? FONT.hero : FONT.display,
									fontWeight: ln.hi ? 400 : 900,
									fontSize: ln.size,
									lineHeight: 1.3,
									color: ln.hi ? C.yellow : spoken ? C.white : C.paper,
									transform: `translateY(${(1 - p) * 40}px) scale(${0.7 + 0.3 * p})`,
									opacity: Math.min(1, p * 1.6),
									textShadow: '0 6px 18px rgba(0,0,0,0.65)',
								}}
							>
								{WORD(i)}
							</span>
						);
					})}
				</div>
			))}
			{f >= wf(33) ? <div style={{position: 'absolute', left: 30, top: 1010, fontFamily: FONT.hero, fontSize: 150, color: C.yellow, opacity: 0.85 * prog(f, wf(33), wf(33) + 5)}}>»</div> : null}
			{f >= wf(29) ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1240, display: 'flex', justifyContent: 'center', ...appear(f, wf(29) + 6)}}>
					<Note text="صياغة الراوي · لم يقلها ألتمان بهذا النص" size={24} />
				</div>
			) : null}
		</>
	);
};
const WORD = (i: number) => WORDS[i].w.replace(/[،.:]$/, '');

/* ---------------- 11.2 – 13.2 s · «هذه القطعة هي… الرام» ---------------- */
export const Reveal: React.FC<{f: number; b: number}> = ({f, b}) => {
	const a = wf(34);
	const hit = wf(37) - 1; // «الرام»
	const s = kf(f, [a, hit, b], [0.82, 0.94, 1.0], EASE.out);
	const tilt = kf(f, [a, hit + 10], [24, 4], EASE.out);
	const h = (940 * 933) / 3840;
	return (
		<AbsoluteFill>
			<Stage f={f} grid={0.7} seed={3} />
			<AbsoluteFill style={{background: `radial-gradient(ellipse 60% 26% at 50% 48%, rgba(242,182,48,${0.12 + 0.2 * prog(f, hit, hit + 8)}), rgba(0,0,0,0) 70%)`}} />
			<div style={{position: 'absolute', left: 70, top: 900 - h / 2, transform: `scale(${s})`, transformOrigin: '50% 50%'}}>
				<RamCut w={940} tilt={tilt} sweep={prog(f, hit, hit + 22, EASE.linear)} glow={0.35 * prog(f, hit, hit + 8)} />
				{f < hit + 12 ? (
					<div style={{position: 'absolute', inset: 0}}>
						<PixelMask f={f} reveal={hit} w={940} h={h} cell={26} seed={9} dur={11} />
					</div>
				) : null}
			</div>
			<Brackets f={f} at={a + 4} x={60} y={900 - h / 2 - 20} w={960} h={h + 40} />
			{f < hit ? <TitleCard frame={f} at={a + 2} text="هذه القطعة هي…" size={50} seed={14} /> : null}
			{f >= hit ? (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', transform: `scale(${0.5 + 0.5 * slam(f, hit)}) rotate(-2deg)`}}>
						<HeroWord text="الرام" size={230} strip={C.charcoal} />
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', justifyContent: 'center', gap: 16, ...appear(f, hit + 5)}}>
						<TechTag text="RAM" size={44} />
						<TechTag text="DDR5 · Micron" size={30} bg={C.paperWhite} />
					</div>
				</>
			) : null}
			<div style={{position: 'absolute', left: 44, top: 1488, opacity: prog(f, hit, hit + 6)}}>
				<Note text={`صورة حقيقية · ${CR.rdimm}`} size={20} dir="rtl" />
			</div>
			<div style={{position: 'absolute', right: 70, top: 1180, opacity: prog(f, hit + 8, hit + 14)}}>
				<PixelRow n={6} lit={Math.min(6, Math.max(0, Math.floor((f - hit - 8) / 2)))} size={14} />
			</div>
		</AbsoluteFill>
	);
};

export {G};
