// Beats 5–6: affected vs frozen vs unknown, the SAFU + company-funds pledge, and the one-device ending.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, rand, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, Label, TitleCard} from '../../../brand/type';
import {wf} from '../ep';
import {BinanceLogo, Cam, Glyph, K, Laptop, Ring, rise, Source, Stage} from '../kit';

const Center: React.FC<{y: number; style?: React.CSSProperties; children: React.ReactNode}> = ({y, style, children}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);

const BAR = {x: 90, w: 900, y: 500, h: 140};
const FROZEN = 3.0 / 6.3; // share of the bar (Binance: ≈ $3B frozen of ≈ $6.3B)

/* ---------------- 25.1 – 38.0 s · compensation question → frozen ≈ $3B → pledge → the unknown remainder ---------------- */
export const Funds: React.FC<{f: number}> = ({f}) => {
	const a = wf(63); // «طيب»
	const ann = wf(68); // «Binance أعلنت»
	const froze = wf(71); // «جمدت»
	const three = wf(73);
	const pledge = wf(76); // «ووعدت»
	const safu = wf(81); // «صندوق»
	const corp = wf(83); // «ومصاري الشركة»
	const but = wf(86); // «لكن»
	const unk = wf(90); // «معروف»
	const back = wf(94); // «تسترجع»
	const end = wf(98) - 1;
	const q = f < ann; // question phase
	const qOut = prog(f, ann - 6, ann + 4);
	const fr = prog(f, froze - 2, three + 8, EASE.out5);
	const pl = prog(f, pledge - 4, pledge + 10) * (1 - prog(f, but - 4, but + 8));
	const rest = prog(f, but, but + 14);
	return (
		<AbsoluteFill>
			<Stage f={f} tone={0.15 + 0.4 * rest} seed={9} />
			{/* question: «رح يتم تعويض المستخدمين؟» */}
			{f < ann + 6 ? (
				<AbsoluteFill style={{opacity: 1 - qOut}}>
					<Center y={420} style={{transform: `scale(${0.6 + 0.4 * slam(f, wf(66) - 2)}) rotate(-1.5deg)`, opacity: f >= wf(66) - 2 ? 1 : 0}}>
						<HeroWord text="تعويض المستخدمين؟" size={128} strip={C.charcoal} />
					</Center>
					<Center y={720}>
						<div style={{display: 'flex', gap: 22}}>
							{Array.from({length: 7}).map((_, i) => (
								<div key={i} style={{opacity: pop(f, a - 6 + i * 2), transform: `translateY(${(1 - pop(f, a - 6 + i * 2)) * 40}px)`}}>
									{Glyph.user(i === 3 ? C.yellow : C.paper, 86)}
								</div>
							))}
						</div>
					</Center>
					<Center y={850} style={{opacity: 0.5 + 0.5 * Math.sin(f / 5)}}>
						<span style={{fontFamily: FONT.hero, fontSize: 140, color: C.yellow}}>؟</span>
					</Center>
				</AbsoluteFill>
			) : null}
			{!q || f >= ann - 4 ? (
				<>
					<TitleCard frame={f} at={ann} text="أين وصلت الأموال؟" size={46} seed={15} />
					{/* the 6.3B bar */}
					<div style={{position: 'absolute', left: BAR.x, top: BAR.y - 70, width: BAR.w, ...rise(f, ann)}}>
						<div dir="rtl" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
							<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 34, color: C.paper}}>الأثر الإجمالي المقدّر</span>
							<span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 40, color: K.red}}>≈ $6.3B</span>
						</div>
					</div>
					<div style={{position: 'absolute', left: BAR.x, top: BAR.y, width: BAR.w, height: BAR.h, borderRadius: 12, overflow: 'hidden', background: 'rgba(229,72,77,0.22)', border: `3px solid ${K.red}`, ...rise(f, ann + 2)}}>
						{/* remaining (unknown) part: hatched, pulses after «لكن» */}
						<div
							style={{
								position: 'absolute',
								left: 0,
								top: 0,
								bottom: 0,
								width: BAR.w * (1 - FROZEN * fr),
								backgroundImage: `repeating-linear-gradient(135deg, rgba(229,72,77,${0.55 + 0.25 * rest * Math.sin(f / 4)}) 0 16px, rgba(229,72,77,0.18) 16px 32px)`,
								backgroundPosition: `${f * 1.5}px 0`,
							}}
						/>
						{/* frozen part fills from the right (RTL reading) */}
						<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: BAR.w * FROZEN * fr, background: `linear-gradient(180deg, ${K.ice}, ${K.iceDeep})`, boxShadow: `inset 0 0 30px rgba(255,255,255,0.4)`}}>
							<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: fr}}>{Glyph.snow('#ffffff', 70)}</div>
						</div>
						{rest > 0
							? Array.from({length: 5}).map((_, i) => (
									<span key={i} style={{position: 'absolute', left: 40 + i * 92, top: 18 + rand(i * 5 + Math.floor(f / 6)) * 20, fontFamily: FONT.hero, fontSize: 70, color: C.white, opacity: rest * (0.5 + 0.5 * rand(i + Math.floor(f / 5)))}}>
										؟
									</span>
								))
							: null}
					</div>
					{/* legend under the bar */}
					<div style={{position: 'absolute', left: BAR.x, top: BAR.y + BAR.h + 22, width: BAR.w, display: 'flex', justifyContent: 'space-between', direction: 'rtl'}}>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, ...rise(f, three)}}>
							<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: K.ice}}>
								مجمّد ≈ <span dir="ltr">$3B</span>
							</span>
							<span dir="ltr" style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 22, color: C.steel}}>
								Tether ≈ $1.57B · Circle ≈ $0.8B · others
							</span>
						</div>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, ...rise(f, but + 4)}}>
							<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: K.red}}>
								الباقي ≈ <span dir="ltr">$3.3B</span>
							</span>
							<span style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 22, color: C.steel}}>مصيره غير معروف بعد</span>
						</div>
					</div>
					<Center y={BAR.y + BAR.h + 130} style={{transform: `scale(${0.6 + 0.4 * slam(f, wf(75))})`, opacity: f >= wf(75) ? 1 - pl * 0 : 0}}>
						<Badge text="مجمّد ≠ مُسترجَع" size={34} rot={-3} color={K.iceDeep} />
					</Center>
				</>
			) : null}
			{/* pledge: SAFU (internal emergency reserve) + company funds → «تغطية كل الخسائر» */}
			{pl > 0 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: pl}}>
					<Center y={900} style={{transform: `scale(${0.7 + 0.3 * pop(f, pledge)})`}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}>
							{Glyph.shield(C.yellow, 120)}
							<div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
								<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 46, color: C.paper}}>وعد بتغطية كل الخسائر</span>
								<span style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 24, color: C.steel}}>
									إعلان Binance · لم يُعلَن عن صرف تعويضات بعد
								</span>
							</div>
						</div>
					</Center>
					<div style={{position: 'absolute', left: 70, right: 70, top: 1080, display: 'flex', gap: 24, direction: 'rtl'}}>
						<div style={{flex: 1.25, background: K.panel, border: `3px solid ${C.yellow}`, borderRadius: 14, padding: '18px 22px', ...rise(f, safu - 2)}}>
							<div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
								<span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 40, color: C.yellow}}>SAFU</span>
								<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: C.paper}}>صندوق طوارئ</span>
							</div>
							<div style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 23, color: C.steel, marginTop: 6}}>احتياطي داخلي لدى Binance · ليس تأميناً خارجياً</div>
						</div>
						<div style={{flex: 1, background: K.panel, border: `3px solid ${C.paper}`, borderRadius: 14, padding: '18px 22px', ...rise(f, corp - 2)}}>
							<div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: C.paper}}>أموال الشركة نفسها</div>
							<div style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 23, color: C.steel, marginTop: 6}}>من ميزانية Binance</div>
						</div>
					</div>
				</div>
			) : null}
			{/* the unknown remainder */}
			{rest > 0 ? (
				<>
					<Center y={900} style={{transform: `scale(${0.6 + 0.4 * slam(f, unk - 2)}) rotate(-1.5deg)`, opacity: f >= unk - 2 ? 1 : 0}}>
						<HeroWord text="مش معروف" size={170} strip={C.charcoal} />
					</Center>
					<Center y={1130} style={rise(f, back - 2)}>
						<div dir="rtl" style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: C.paper}}>
							كم يمكن <span style={{color: C.yellow}}>استرجاعه</span> من الباقي؟
						</div>
					</Center>
				</>
			) : null}
			<div style={{position: 'absolute', left: 40, right: 40, top: 1470, ...rise(f, ann + 6)}}>
				<Source text="إعلان Binance · CoinDesk · NBC News · TRM Labs" size={21} />
			</div>
		</AbsoluteFill>
	);
};

/* ---------------- 38.0 – 41.0 s · «وكل هذا بدأ من اختراق جهاز واحد فقط» ---------------- */
const NET = (() => {
	const pts: {x: number; y: number; d: number}[] = [];
	const rings = [0, 150, 280, 420, 570, 730, 900];
	rings.forEach((r, k) => {
		const n = k === 0 ? 0 : 8 + k * 9;
		for (let i = 0; i < n; i++) {
			const ang = (i / n) * Math.PI * 2 + k * 0.37 + (rand(k * 100 + i) - 0.5) * 0.18;
			const rr = r + (rand(i * 7 + k) - 0.5) * 50;
			pts.push({x: 540 + Math.cos(ang) * rr, y: 760 + Math.sin(ang) * rr * 1.25, d: rr});
		}
	});
	return pts;
})();

export const Ending: React.FC<{f: number; end: number}> = ({f, end}) => {
	const a = wf(98);
	const hack = wf(102); // «اختراق»
	const dev = wf(103); // «جهاز»
	const one = wf(104); // «واحد»
	const fin = wf(105) + 4; // «فقط» → closing frame
	const s = kf(f, [a, hack, dev + 10], [2.4, 2.1, 1.0], EASE.io);
	const wave = Math.max(0, (f - hack) * 42);
	const closing = prog(f, fin, fin + 10);
	return (
		<AbsoluteFill>
			<Stage f={f} tone={prog(f, hack, dev + 10) * 0.7} seed={11} />
			<Cam s={s} y={(320 * (s - 1)) / 1.4}>
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					{NET.map((p, i) => {
						const q = NET[(i * 7 + 3) % NET.length];
						const red = wave > p.d;
						return <line key={`l${i}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={red ? 'rgba(229,72,77,0.35)' : 'rgba(154,165,174,0.16)'} strokeWidth={2} />;
					})}
					{NET.map((p, i) => {
						const red = wave > p.d;
						const flash = red && wave - p.d < 60;
						return <circle key={i} cx={p.x} cy={p.y} r={flash ? 11 : 7} fill={red ? K.red : 'rgba(240,185,11,0.75)'} opacity={0.4 + 0.6 * pop(f, a + Math.floor(p.d / 60))} />;
					})}
				</svg>
				<Ring f={f} at={hack} x={540} y={760} r={500} dur={26} />
				<Ring f={f} at={hack + 8} x={540} y={760} r={900} dur={30} />
				<div style={{position: 'absolute', left: 540 - 90, top: 760 - 60}}>
					<Laptop f={f} w={180} hit={prog(f, hack - 2, hack + 4)} />
				</div>
			</Cam>
			{/* closing frame */}
			<AbsoluteFill style={{background: `rgba(11,17,27,${0.45 * closing})`}} />
			<Center y={260} style={{opacity: closing, transform: `scale(${0.9 + 0.1 * closing})`}}>
				<BinanceLogo w={520} glow={0.8} />
			</Center>
			{f >= one - 2 ? (
				<Center y={1010} style={{transform: `scale(${0.6 + 0.4 * slam(f, one - 2)}) rotate(-2deg)`}}>
					<HeroWord text="جهاز واحد" size={180} strip={C.charcoal} />
				</Center>
			) : null}
			<Center y={1235} style={{opacity: closing}}>
				<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(11,17,27,0.9)', padding: '12px 28px 16px', borderRadius: 10, border: `2px solid ${K.red}`, filter: SHADOW.lifted}}>
					<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: C.paper}}>لابتوب واحد</span>
					<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: K.red}}>←</span>
					<span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 44, color: K.bnb}}>≈ $6.3B</span>
				</div>
			</Center>
			<Center y={1350} style={{opacity: closing}}>
				<Label text="أرقام أولية من Binance · القصة ما زالت تتطور" size={26} bg="rgba(38,35,33,0.85)" fg={C.paper} font={FONT.label} />
			</Center>
		</AbsoluteFill>
	);
};
