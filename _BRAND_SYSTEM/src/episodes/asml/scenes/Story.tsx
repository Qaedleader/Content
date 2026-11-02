// All non-diagram scenes. Real media dominates; type and pixel details sit on top in the brand's yellow / paper language.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, Label, TitleCard} from '../../../brand/type';
import {M, wf, we} from '../ep';
import {appear, Flag, IdentityPlate, PixelMask, PixelRow, Shot, TechTag} from '../kit';

const CR = {
	asml: '© ASML',
	asmlR: '© ASML · تصيير رسمي',
	intel: 'Intel Corporation',
	ibm: 'IBM Research · CC BY 3.0',
} as const;

/* ---------------- 0 – 6.5 s · opening: the machine ---------------- */
export const Opening: React.FC<{f: number}> = ({f}) => {
	const A = 39;
	const B = 84;
	const D = wf(13) - 1; // «وممكن»
	const end = wf(19) - 1;
	return (
		<>
			<Shot f={f} a={0} b={A - 1} src={M('a_intel_highna.jpg')} credit={CR.intel} move={{s0: 1.02, s1: 1.1, p0: 14, p1: 24}} />
			<Shot f={f} a={A} b={B - 1} src={M('b_euv_internals.jpg')} credit="© ASML · EUV Alpha Demo Tool" move={{s0: 1.16, s1: 1.06, x0: -60, x1: -20}} pos="62% 50%" />
			<Shot f={f} a={B} b={D - 1} src={M('c_exe5200b.jpg')} credit={CR.asml} move={{s0: 1.02, s1: 1.07, p0: 30, p1: 52}} />
			<Shot f={f} a={D} b={end} src={M('d_highna_studio.jpg')} credit="© ASML · High-NA EUV" kind="لقطة من فيديو رسمي" move={{s0: 1.75, s1: 1.5}} fit="contain" dim={0.05} />
			{/* mystery title over shot C: the company's name stays pixelated until «ASML» */}
			{f >= B + 4 && f < D ? (
				<>
					<TitleCard frame={f} at={B + 4} text="جزء أساسي من مستقبل الذكاء الاصطناعي" size={36} seed={3} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', ...appear(f, B + 14)}}>
						<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(12,15,20,0.82)', padding: '12px 22px', borderRadius: 6, filter: SHADOW.lifted}}>
							<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 36, color: C.paper}}>الشركة:</span>
							<div style={{position: 'relative', width: 230, height: 56}}>
								<PixelMask f={f} reveal={99999} w={230} h={56} cell={14} seed={4} />
							</div>
						</div>
					</div>
				</>
			) : null}
			{f >= D ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', transform: `scale(${0.6 + 0.4 * slam(f, wf(16) - 2)})`, opacity: f >= wf(16) - 2 ? 1 : 0}}>
					<HeroWord text="أخطر الشركات؟" size={148} strip={C.charcoal} />
				</div>
			) : null}
			{f >= D ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 296, display: 'flex', justifyContent: 'center', opacity: prog(f, D, D + 8)}}>
					<PixelRow n={6} lit={6} size={14} />
				</div>
			) : null}
		</>
	);
};

/* ---------------- 6.5 – 13.2 s · three essentials, then the surprise ---------------- */
const SLOT = [
	{x: 708, src: 'p_gpu.jpg', word: 25, label: 'معالجات', credit: 'NVIDIA'},
	{x: 384, src: 'p_datacenter.jpg', word: 26, label: 'مراكز بيانات', credit: ''},
	{x: 60, src: 'p_power.jpg', word: 28, label: 'طاقة', credit: ''},
];
export const Essentials: React.FC<{f: number; credits: string[]}> = ({f, credits}) => {
	const a = wf(19) - 1;
	const grow = wf(30) - 2; // «المعالجات» → processor slot fills the frame
	const surprise = wf(32);
	const g = prog(f, grow, grow + 14, EASE.io);
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(46,66,96,0.6), rgba(20,30,45,0) 75%)'}} />
			<TitleCard frame={f} at={a + 2} text="الذكاء الاصطناعي بده ٣ أشياء" size={48} seed={7} out={grow} />
			{SLOT.map((s, i) => {
				const at = wf(s.word);
				const enter = pop(f, a + 6 + i * 4, {damping: 13, stiffness: 200, mass: 0.7});
				const filled = f >= at - 1;
				const k = filled ? pop(f, at - 1, {damping: 12, stiffness: 240, mass: 0.6}) : 0;
				const isGpu = i === 0;
				// during «المعالجات»: GPU slot grows to full frame, the others drop away
				const X = isGpu ? kf(g, [0, 1], [s.x, 0]) : s.x;
				const Y = isGpu ? kf(g, [0, 1], [430, 0]) : 430 + g * 1500;
				const Wd = isGpu ? kf(g, [0, 1], [312, 1080]) : 312;
				const Ht = isGpu ? kf(g, [0, 1], [760, 1920]) : 760;
				const bd = isGpu ? 10 * (1 - g) : 10;
				return (
					<div key={i} style={{position: 'absolute', left: X, top: Y, width: Wd, height: Ht, transform: `scale(${0.7 + 0.3 * enter}) rotate(${(1 - g * (isGpu ? 1 : 0)) * (i - 1) * 1.2}deg)`, opacity: enter, filter: g < 1 ? SHADOW.lifted : undefined}}>
						<div style={{position: 'absolute', inset: 0, background: C.paperWhite, borderRadius: 4 * (1 - g)}} />
						<div style={{position: 'absolute', inset: bd, overflow: 'hidden', background: C.charcoal}}>
							{filled ? (
								<Img src={staticFile(M(s.src))} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: Math.min(1, k * 1.5), transform: `scale(${1.15 - 0.1 * k + (isGpu ? 0.08 * prog(f, grow, surprise + 40, EASE.linear) : 0)})`}} />
							) : (
								<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.hero, fontSize: 200, color: 'rgba(242,182,48,0.35)'}}>
									{['١', '٢', '٣'][i]}
								</div>
							)}
							{isGpu && g > 0 ? <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(8,10,14,${0.5 * g}) 0%, rgba(8,10,14,0) 30%, rgba(8,10,14,0) 60%, rgba(8,10,14,${0.75 * g}) 100%)`}} /> : null}
						</div>
						{filled && g < 0.4 ? (
							<div style={{position: 'absolute', left: 0, right: 0, bottom: -34, display: 'flex', justifyContent: 'center', transform: `scale(${k})`, opacity: 1 - g * 2.5}}>
								<Label text={s.label} size={38} bg={C.yellow} seed={i + 3} />
							</div>
						) : null}
					</div>
				);
			})}
			{f >= wf(25) && f < grow + 6 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1262, display: 'flex', justifyContent: 'center', opacity: 1 - prog(f, grow, grow + 6)}}>
					<PixelRow n={3} lit={f >= wf(28) ? 3 : f >= wf(26) ? 2 : 1} size={22} gap={10} />
				</div>
			) : null}
			{f >= wf(28) && g < 0.3 ? (
				<div style={{position: 'absolute', left: 44, right: 44, top: 1488, display: 'flex', justifyContent: 'center', opacity: 1 - g * 3}}>
					<Label text={credits[1]} size={18} bg="rgba(38,35,33,0.82)" fg={C.paper} font={FONT.label} dir="ltr" />
				</div>
			) : null}
			{g >= 1 && credits[0] ? (
				<div style={{position: 'absolute', left: 44, top: 1488}}>
					<Label text={`صورة حقيقية · ${credits[0]}`} size={20} bg="rgba(38,35,33,0.82)" fg={C.paper} font={FONT.label} />
				</div>
			) : null}
			{f >= surprise - 2 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', transform: `scale(${0.6 + 0.4 * slam(f, surprise - 2)}) rotate(-2deg)`}}>
					<HeroWord text="المفاجأة!" size={170} strip={C.charcoal} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/* ---------------- 13.2 – 21.0 s · Dutch company → ASML → lithography → EUV ---------------- */
export const Reveal: React.FC<{f: number}> = ({f}) => {
	const a = wf(33) - 1;
	const asml = wf(37);
	const make = wf(41);
	const euv = wf(46);
	const end = wf(49) - 1;
	const hit = slam(f, asml - 1);
	return (
		<>
			<Shot f={f} a={a} b={asml - 1} src={M('e_veldhoven.jpg')} credit="A. Ansems · Wikimedia Commons (PD)" move={{s0: 1.12, s1: 1.2, x0: 0, x1: -40}} />
			<Shot f={f} a={asml} b={make - 1} src={M('f_reveal.jpg')} credit={CR.asml} move={{s0: 1.22, s1: 1.1, y0: 20, y1: 0}} dim={0.28} />
			<Shot f={f} a={make} b={euv - 1} src={M('g_assembly.jpg')} credit="© ASML · EUV source vessels" move={{s0: 1.05, s1: 1.16, x0: -80, x1: 40}} />
			<Shot f={f} a={euv} b={end} src={M('h_euv_render.jpg')} credit={CR.asmlR} kind="تصيير رسمي" move={{s0: 1.05, s1: 1.22}} dim={0.15} />
			{/* «شركة هولندية» */}
			{f >= wf(35) - 2 && f < asml ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
					<div style={{transform: `scale(${pop(f, wf(35) - 2)}) rotate(-3deg)`}}>
						<Flag src={M('flag_nl.svg')} w={260} />
					</div>
					<div style={{transform: `scale(${pop(f, wf(35) + 2)})`}}>
						<Label text="شركة هولندية" size={52} bg={C.paperWhite} seed={9} />
					</div>
				</div>
			) : null}
			{/* ASML logo reveal through pixel cells */}
			{f >= asml - 1 && f < make ? (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: 520, display: 'flex', justifyContent: 'center', transform: `scale(${0.75 + 0.25 * hit})`}}>
						<div style={{position: 'relative', background: C.paperWhite, padding: '46px 70px 40px', borderRadius: 10, filter: SHADOW.lifted, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
							<Img src={staticFile(M('logo_asml.svg'))} style={{width: 560, display: 'block'}} />
							<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 16}}>
								<Img src={staticFile(M('flag_nl.svg'))} style={{width: 72, height: 48, objectFit: 'cover', boxShadow: '0 0 0 1.5px rgba(0,0,0,0.2)'}} />
								<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 38, color: C.charcoal}}>هولندا · Veldhoven</span>
							</div>
							<div style={{position: 'absolute', inset: 0, borderRadius: 10, overflow: 'hidden'}}>
								<PixelMask f={f} reveal={asml - 1} w={700} h={330} cell={35} seed={11} dur={10} />
							</div>
						</div>
					</div>
					{f >= wf(39) - 1 ? (
						<div style={{position: 'absolute', left: 0, right: 0, top: 960, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, wf(39) - 1)}) rotate(-2deg)`}}>
							<HeroWord text="الوحيدة بالعالم" size={104} strip={C.charcoal} />
						</div>
					) : null}
				</>
			) : null}
			{/* «آلات طباعة ضوئية» */}
			{f >= make && f < euv ? (
				<>
					<TitleCard frame={f} at={make + 1} text="آلات طباعة ضوئية" size={50} seed={13} />
					{f >= wf(44) ? (
						<div style={{position: 'absolute', left: 0, right: 0, top: 1120, display: 'flex', justifyContent: 'center', ...appear(f, wf(44))}}>
							<TechTag text="LITHOGRAPHY" size={40} />
						</div>
					) : null}
				</>
			) : null}
			{/* «EUV» */}
			{f >= euv ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
					{f >= wf(48) - 2 ? (
						<>
							<div style={{transform: `scale(${0.5 + 0.5 * slam(f, wf(48) - 2)})`}}>
								<HeroWord text="EUV" size={260} font={FONT.display} weight={900} />
							</div>
							<div style={{...appear(f, wf(48) + 4)}}>
								<TechTag text="EXTREME ULTRAVIOLET" size={34} bg={C.paperWhite} />
							</div>
							<div dir="rtl" style={{...appear(f, wf(48) + 9)}}>
								<Label text="أشعة فوق بنفسجية متطرفة" size={36} bg={C.charcoal} fg={C.paper} />
							</div>
						</>
					) : null}
				</div>
			) : null}
		</>
	);
};

/* ---------------- 21.0 – 22.0 s · «كيف بتشتغل؟» — dive into the light source ---------------- */
export const HowIntro: React.FC<{f: number; b: number}> = ({f, b}) => {
	const a = wf(49) - 1;
	if (f < a || f > b) return null;
	return (
		<>
			<Shot f={f} a={a} b={b} src={M('i_source_render.jpg')} credit={CR.asmlR} kind="تصيير رسمي" move={{s0: 1.05, s1: 1.7, x0: 0, x1: 60}} ease={EASE.in} />
			<TitleCard frame={f} at={a + 1} text="كيف بتشتغل؟" size={56} seed={17} />
		</>
	);
};

/* ---------------- 33.9 – 35.0 s · real wafer ---------------- */
export const Wafer: React.FC<{f: number}> = ({f}) => {
	const a = wf(76) + 1;
	const b = wf(78) - 1;
	return <Shot f={f} a={a} b={b} src={M('j_wafer.mp4')} credit={CR.ibm} move={{s0: 1.25, s1: 1.08}} />;
};

/* ---------------- 35.0 – 40.0 s · core technology for the strongest processors ---------------- */
export const Core: React.FC<{f: number; chipCredit: string}> = ({f, chipCredit}) => {
	const a = wf(78);
	const mid = wf(84) - 2; // «أقوى المعالجات»
	const b = wf(87) - 1;
	return (
		<>
			<Shot f={f} a={a} b={mid - 1} src={M('k_fab.mp4')} credit={CR.ibm} rate={0.8} move={{s0: 1.08, s1: 1.18, x0: 30, x1: -30}} />
			<Shot f={f} a={mid} b={b} src={M('l_chip.mp4')} credit={chipCredit} move={{s0: 1.2, s1: 1.06}} />
			{f >= wf(79) ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, wf(79))}) rotate(-2deg)`}}>
					<HeroWord text="تقنية أساسية" size={120} strip={C.charcoal} />
				</div>
			) : null}
			{f >= wf(81) ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1180, display: 'flex', justifyContent: 'center', ...appear(f, wf(81))}}>
					<Badge text="EUV خطوة طباعة النمط · من مئات خطوات التصنيع" color={C.yellow} bg="rgba(20,30,45,0.92)" size={26} rot={-1.5} />
				</div>
			) : null}
		</>
	);
};

/* ---------------- 39.6 – 44.0 s · TSMC + NVIDIA, and who does what ---------------- */
export const Partners: React.FC<{f: number; tsmcCredit: string; nvCredit: string}> = ({f, tsmcCredit, nvCredit}) => {
	const a = wf(87);
	const tsmc = wf(90) - 2;
	const nv = wf(92) - 2;
	const chain = wf(93);
	const b = wf(95) - 1;
	const rows = [
		{logo: 'logo_nvidia.svg', w: 260, flag: 'flag_us.svg', role: 'تصمّم المعالجات', at: chain + 1},
		{logo: 'logo_tsmc.svg', w: 200, flag: 'flag_tw.svg', role: 'تصنّع الشرائح', at: chain + 6},
		{logo: 'logo_asml.svg', w: 230, flag: 'flag_nl.svg', role: 'تبيعها آلات EUV', at: chain + 11},
	];
	return (
		<>
			<Shot f={f} a={a} b={tsmc - 1} src={M('m_fab2.mp4')} credit="ZDF/Terra X · CC BY 4.0" move={{s0: 1.15, s1: 1.05}} />
			<Shot f={f} a={tsmc} b={nv - 1} src={M('n_tsmc.jpg')} credit={tsmcCredit} move={{s0: 1.06, s1: 1.16}} dim={0.1} />
			<Shot f={f} a={nv} b={b} src={M('o_nvidia.jpg')} credit={nvCredit} move={{s0: 1.16, s1: 1.05}} dim={f >= chain ? 0.55 * prog(f, chain, chain + 8) : 0.1} />
			{f >= tsmc && f < chain + 2 ? (
				<IdentityPlate f={f} at={tsmc} logo={M('logo_tsmc.svg')} logoW={300} flag={M('flag_tw.svg')} country="تايوان" x={540} y={760} s={1.3 * (f >= nv ? 1 - prog(f, nv, nv + 6) : 1)} />
			) : null}
			{f >= nv && f < chain + 2 ? <IdentityPlate f={f} at={nv} logo={M('logo_nvidia.svg')} logoW={380} flag={M('flag_us.svg')} country="الولايات المتحدة" x={540} y={760} rot={2} s={1.15} /> : null}
			{f >= chain ? (
				<div style={{position: 'absolute', left: 90, right: 90, top: 400, display: 'flex', flexDirection: 'column', gap: 28}}>
					{rows.map((r, i) => {
						const p = pop(f, r.at, {damping: 13, stiffness: 230, mass: 0.6});
						return (
							<React.Fragment key={i}>
								<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 22, background: C.paperWhite, padding: '18px 26px', borderRadius: 8, filter: SHADOW.lifted, transform: `translateX(${(1 - p) * 700}px) rotate(${(i - 1) * 0.8}deg)`, opacity: Math.min(1, p * 2)}}>
									<div style={{width: 290, display: 'flex', justifyContent: 'center'}}>
										<Img src={staticFile(M(r.logo))} style={{width: r.w, display: 'block'}} />
									</div>
									<Img src={staticFile(M(r.flag))} style={{width: 60, height: 40, objectFit: 'cover', boxShadow: '0 0 0 1.5px rgba(0,0,0,0.2)'}} />
									<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 38, color: C.charcoal, background: i === 2 ? C.yellow : 'transparent', padding: '0 10px'}}>{r.role}</span>
								</div>
								{i < 2 ? (
									<div style={{display: 'flex', justifyContent: 'center', opacity: prog(f, rows[i + 1].at - 2, rows[i + 1].at + 2)}}>
										<svg width={40} height={30}>
											<path d="M20 28 L4 6 L36 6 Z" fill={C.yellow} />
										</svg>
									</div>
								) : null}
							</React.Fragment>
						);
					})}
				</div>
			) : null}
		</>
	);
};

/* ---------------- 44.0 – 48.5 s · the only commercial EUV supplier ---------------- */
export const Exclusive: React.FC<{f: number}> = ({f}) => {
	const a = wf(95);
	const mid = wf(101) - 1;
	const b = wf(106) - 1;
	return (
		<>
			<Shot f={f} a={a} b={mid - 1} src={M('q_cleanroom1.jpg')} credit={CR.asml} move={{s0: 1.04, s1: 1.1, p0: 40, p1: 58}} dim={0.12} />
			<Shot f={f} a={mid} b={b} src={M('r_cleanroom2.jpg')} credit={CR.asml} move={{s0: 1.1, s1: 1.02, x0: -40, x1: 40}} dim={0.18} />
			{f >= a + 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', transform: `scale(${0.6 + 0.4 * slam(f, a + 1)})`}}>
					<HeroWord text="والأخطر" size={140} strip={C.charcoal} />
				</div>
			) : null}
			{f >= wf(99) ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
					<div style={{transform: `scale(${pop(f, wf(99))})`}}>
						<div dir="rtl" style={{background: 'rgba(12,15,20,0.86)', border: `4px solid ${C.yellow}`, borderRadius: 8, padding: '16px 34px 20px', filter: SHADOW.lifted, textAlign: 'center'}}>
							<div style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 60, color: C.yellow, lineHeight: 1.25}}>مورّد تجاري واحد</div>
							<div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 44, color: C.paper, lineHeight: 1.3}}>لآلات EUV بالعالم</div>
						</div>
					</div>
					<div style={{...appear(f, wf(101))}}>
						<TechTag text="ONE COMMERCIAL EUV SUPPLIER" size={28} bg={C.paperWhite} />
					</div>
					<div style={{...appear(f, wf(104))}}>
						<Label text="آلات EUV تحديداً · مش كل معدّات صناعة الرقائق" size={26} bg={C.charcoal} fg={C.paper} font={FONT.label} />
					</div>
				</div>
			) : null}
		</>
	);
};

/* ---------------- 48.5 – end · final question ---------------- */
export const Finale: React.FC<{f: number; end: number}> = ({f, end}) => {
	const a = wf(106);
	const last = wf(115) - 1; // «تكنولوجيا شركة واحدة؟»
	const one = wf(116) - 1;
	return (
		<>
			<Shot f={f} a={a} b={last - 1} src={M('s_final_wide.jpg')} credit={CR.intel} move={{s0: 1.02, s1: 1.1, p0: 22, p1: 34}} />
			<Shot f={f} a={last} b={end} src={M('t_final_machine.jpg')} credit={CR.asml} move={{s0: 1.14, s1: 1.04}} dim={0.42} />
			{f >= a + 2 && f < last ? <TitleCard frame={f} at={a + 2} text="تخيّلوا…" size={52} seed={23} /> : null}
			{f >= last ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
					<div style={{transform: `scale(${pop(f, last)})`, background: C.paperWhite, padding: '24px 40px', borderRadius: 8, filter: SHADOW.lifted}}>
						<Img src={staticFile(M('logo_asml.svg'))} style={{width: 380, display: 'block'}} />
					</div>
					{f >= one ? (
						<div style={{transform: `scale(${0.55 + 0.45 * slam(f, one)}) rotate(-2deg)`}}>
							<HeroWord text="شركة واحدة؟" size={170} strip={C.charcoal} />
						</div>
					) : null}
					{f >= one + 10 ? (
						<div style={{opacity: prog(f, one + 10, one + 18)}}>
							<PixelRow n={8} lit={Math.min(8, Math.floor((f - one - 10) / 2))} size={18} gap={8} />
						</div>
					) : null}
				</div>
			) : null}
		</>
	);
};

export {we};
