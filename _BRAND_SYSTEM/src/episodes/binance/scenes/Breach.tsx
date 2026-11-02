// Beats 3–4: the preliminary attack path (laptop → service container → withdrawal system → external wallets) and the
// preliminary North Korea attribution. Everything here is a labelled illustration, not evidence.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, Label, TitleCard} from '../../../brand/type';
import {M, wf} from '../ep';
import {Cam, Glyph, K, Laptop, Ring, rise, Source, Stage, Stream, SysNode} from '../kit';

const Center: React.FC<{y: number; style?: React.CSSProperties; children: React.ReactNode}> = ({y, style, children}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);

// diagram geometry (world space = 1080×1920 canvas)
const G = {lapY: 430, lapW: 400, contY: 800, wdY: 990, walY: 1150, walX: [250, 540, 830]};

/** Vertical connector that fills red from top to bottom as `p` goes 0→1. */
const Wire: React.FC<{y0: number; y1: number; p: number; x?: number}> = ({y0, y1, p, x = 540}) => (
	<>
		<div style={{position: 'absolute', left: x - 3, top: y0, width: 6, height: y1 - y0, background: 'rgba(154,165,174,0.3)', borderRadius: 3}} />
		<div style={{position: 'absolute', left: x - 4, top: y0, width: 8, height: (y1 - y0) * p, background: K.red, borderRadius: 4, boxShadow: `0 0 16px ${K.redGlow}`}} />
		{p > 0 && p < 1 ? <div style={{position: 'absolute', left: x - 12, top: y0 + (y1 - y0) * p - 12, width: 24, height: 24, borderRadius: 12, background: '#fff', boxShadow: `0 0 24px ${K.red}`}} /> : null}
	</>
);

/* ---------------- 13.0 – 20.7 s · «حسب التحقيق الأولي، الهاكر اخترق لابتوب مهندس … وقدر يحول مليارات الدولارات» ---------------- */
export const LaptopChain: React.FC<{f: number}> = ({f}) => {
	const a = wf(34);
	const hacker = wf(37);
	const breach = wf(38); // «اخترق»
	const laptop = wf(39);
	const eng = wf(40);
	const via = wf(42); // «ومن خلاله»
	const reach = wf(44); // «وصل»
	const wd = wf(46); // «السحب»
	const move = wf(48); // «وقدر يحول»
	const bil = wf(50);
	const end = wf(52) - 1;
	const hit = prog(f, laptop - 3, laptop + 5);
	// camera: laptop close-up → follow the path down → full system
	const s = kf(f, [a, via - 4, via + 14, move - 6, move + 14], [1.5, 1.42, 1.22, 1.18, 0.94]);
	const cy = kf(f, [a, via - 4, via + 14, move - 6, move + 14], [G.lapY + 40, G.lapY + 60, 840, 860, 870]);
	const p1 = prog(f, via, reach + 4, EASE.io); // laptop → container
	const p2 = prog(f, reach + 6, wd + 4, EASE.io); // container → withdrawal system
	return (
		<AbsoluteFill>
			<Stage f={f} tone={hit * 0.6} seed={5} />
			<Cam s={s} y={(960 - cy) * s}>
				{/* attacker signal: an abstract remote origin, not a person */}
				{f >= hacker - 2 ? (
					<>
						<div style={{position: 'absolute', left: 250, top: 250, display: 'flex', alignItems: 'center', gap: 10, opacity: pop(f, hacker - 2) * (1 - prog(f, via, via + 10))}}>
							<div style={{width: 26, height: 26, borderRadius: 13, background: K.red, boxShadow: `0 0 26px ${K.red}`}} />
							<span dir="rtl" style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: K.red}}>المهاجم</span>
						</div>
						<Stream f={f} a={hacker} b={laptop + 6} x0={264} y0={276} x1={470} y1={G.lapY - 40} n={8} size={13} speed={2.2} seed={2} />
					</>
				) : null}
				<Center y={G.lapY - G.lapW * 0.33}>
					<div style={{transform: `scale(${0.85 + 0.15 * pop(f, a)})`}}>
						<Laptop f={f} w={G.lapW} hit={hit} />
					</div>
				</Center>
				<Ring f={f} at={laptop - 1} x={540} y={G.lapY - 30} r={300} />
				<Center y={G.lapY + 150} style={{opacity: f >= eng - 2 ? 1 : 0, transform: `scale(${0.6 + 0.4 * pop(f, eng - 2)})`}}>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
						<Label text="لابتوب مهندس بالشركة" size={40} bg={C.paperWhite} seed={3} rot={-1} />
						<div dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 24, color: C.steel}}>DevOps engineer · per Binance</div>
					</div>
				</Center>
				{/* path */}
				<Wire y0={G.lapY + 235} y1={G.contY - 62} p={p1} />
				<Wire y0={G.contY + 62} y1={G.wdY - 62} p={p2} />
				<Center y={G.contY - 60} style={{opacity: pop(f, via - 6)}}>
					<SysNode title="حاوية خدمة داخلية" tag="service container" icon={Glyph.container(p1 >= 1 ? K.red : C.steel)} w={640} state={p1 >= 1 ? 'hit' : 'idle'} glow={0.5 + 0.5 * Math.sin(f / 4)} />
				</Center>
				<Center y={G.wdY - 60} style={{opacity: pop(f, reach)}}>
					<SysNode title="نظام السحب الداخلي" tag="withdrawal system" icon={Glyph.vault(p2 >= 1 ? K.red : C.steel)} w={640} state={p2 >= 1 ? 'hit' : 'idle'} glow={0.5 + 0.5 * Math.sin(f / 4)} />
				</Center>
				{/* unauthorized withdrawals → external wallets */}
				{G.walX.map((x, i) => (
					<React.Fragment key={i}>
						<Stream f={f} a={move + i * 2} b={end + 6} x0={540} y0={G.wdY + 62} x1={x} y1={G.walY - 30} n={9} speed={2} seed={i + 9} />
						<div style={{position: 'absolute', left: x - 50, top: G.walY - 34, width: 100, display: 'flex', justifyContent: 'center', opacity: pop(f, move + 4 + i * 3), transform: `scale(${0.5 + 0.5 * pop(f, move + 4 + i * 3)})`}}>
							{Glyph.wallet(K.red, 76)}
						</div>
					</React.Fragment>
				))}
				<Center y={G.walY + 56} style={rise(f, move + 10)}>
					<div dir="rtl" style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 34, color: C.paper}}>
						سحوبات غير مصرّح بها ← <span style={{color: K.red}}>محافظ خارجية</span>
					</div>
				</Center>
			</Cam>
			<TitleCard frame={f} at={a + 1} text="حسب التحقيق الأولي" size={48} seed={12} />
			{f >= bil - 2 ? (
				<Center y={300} style={{transform: `scale(${0.7 + 0.3 * slam(f, bil - 2)})`}}>
					<div style={{background: 'rgba(11,17,27,0.9)', border: `2px solid ${K.red}`, borderRadius: 10, padding: '8px 24px 12px', filter: SHADOW.lifted}}>
						<span dir="rtl" style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 44, color: C.paper}}>
							تحويل <span style={{color: K.red}}>مليارات الدولارات</span>
						</span>
					</div>
				</Center>
			) : null}
			<div style={{position: 'absolute', left: 40, right: 40, top: 1462, display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...rise(f, a + 6)}}>
				<Badge text="نتيجة أولية · قد تتغيّر" size={24} rot={-2} />
				<Badge text="رسم توضيحي" size={24} rot={2} color={C.steelDark} />
			</div>
		</AbsoluteFill>
	);
};

/* ---------------- 20.7 – 25.1 s · «والتحقيقات بترجح إنه هاكرز من كوريا الشمالية هم اللي ينفذوا العملية» ---------------- */
export const Attribution: React.FC<{f: number}> = ({f}) => {
	const a = wf(52);
	const card = wf(53); // «بترجح»
	const kp = wf(57); // «كوريا»
	const stamp = wf(59); // «هم اللي»
	const end = wf(63) - 1;
	const zoom = prog(f, a, end, EASE.linear);
	const ROWS = [
		{who: 'TRM Labs', what: 'تقييم «بثقة عالية»', at: card + 4},
		{who: 'Chainalysis', what: 'استنتاج مشابه', at: card + 10},
		{who: 'Binance', what: 'لم تحدّد الجهة رسمياً', at: card + 16},
	];
	return (
		<AbsoluteFill>
			<Stage f={f} tone={0.35} seed={7} grid={0.6} />
			{/* trace line: from the external wallets (below) up to the assessment */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<path d="M540 1340 C 540 1200, 860 1180, 860 980 S 540 760, 540 640" fill="none" stroke={K.red} strokeWidth={4} strokeDasharray="10 14" strokeDashoffset={-f * 2} opacity={0.5 * prog(f, a, a + 10)} />
			</svg>
			<Cam s={1.04 + 0.04 * zoom}>
				<TitleCard frame={f} at={a + 1} text="مَن وراء الهجوم؟" size={50} seed={14} />
				{/* restrained flag: small, desaturated, on a paper mount */}
				<Center y={360} style={{opacity: f >= kp - 2 ? 1 : 0, transform: `scale(${0.6 + 0.4 * pop(f, kp - 2, {damping: 15, stiffness: 200, mass: 0.8})})`}}>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
						<div style={{padding: 8, background: C.paperWhite, borderRadius: 4, filter: SHADOW.lifted, transform: 'rotate(-2deg)'}}>
							<Img src={staticFile(M('flag_kp.svg'))} style={{width: 300, height: 182, display: 'block', filter: 'saturate(0.7) brightness(0.92)'}} />
						</div>
						<Label text="كوريا الشمالية" size={42} bg={C.paperWhite} seed={6} />
					</div>
				</Center>
				{/* assessment card */}
				<div style={{position: 'absolute', left: 80, right: 80, top: 720, background: K.panel, border: '2px solid rgba(154,165,174,0.45)', borderRadius: 16, padding: '30px 36px', filter: SHADOW.lifted, ...rise(f, a + 2)}}>
					<div dir="rtl" style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18}}>
						<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 36, color: C.paper}}>الجهة المرجّحة</span>
						<span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 40, color: C.yellow}}>TraderTraitor</span>
					</div>
					<div dir="rtl" style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 26, color: C.steel, marginBottom: 22}}>
						وحدة يربطها المحققون بمجموعة <span dir="ltr">Lazarus</span>
					</div>
					{ROWS.map((r, i) => (
						<div key={i} dir="rtl" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: '1.5px solid rgba(154,165,174,0.25)', ...rise(f, r.at)}}>
							<span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 32, color: C.paper}}>{r.who}</span>
							<span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 32, color: i === 2 ? C.yellow : C.paper}}>{r.what}</span>
						</div>
					))}
				</div>
			</Cam>
			<Center y={1222} style={{transform: `scale(${0.6 + 0.4 * slam(f, stamp)})`, opacity: f >= stamp ? 1 : 0}}>
				<Badge text="إسناد أولي · غير مؤكَّد رسمياً" size={36} rot={-4} />
			</Center>
			<div style={{position: 'absolute', left: 40, right: 40, top: 1470, ...rise(f, card + 4)}}>
				<Source text="TRM Labs · Chainalysis عبر CoinDesk و Al Jazeera" size={21} />
			</div>
		</AbsoluteFill>
	);
};
