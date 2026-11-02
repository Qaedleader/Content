// 24.4 – 36.2 s · Chapter E/F/G: the people who master AI → seven industries → one person with the output of a whole company.
// Dashboards for marketing / sales / trading / e-commerce are ORIGINAL illustrative interfaces (labelled «واجهة توضيحية»), not
// screenshots of real products or real results. Real media: Commons footage + screenshots of open-source tools (VS Code, Kdenlive).
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EASE, kf, pop, prog, rand, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, Label} from '../../../brand/type';
import {M, wf} from '../ep';
import {CR} from '../credits';
import {appear, Cam, GridStage, Ico, K, NeuralNet, Note, Panel, PixelRow, Scan, Shot, Stream, TechTag} from '../kit';

/* ---------------- 24.40 – 27.66 s · «اللي رح يتقنوا هاي التكنولوجيا رح يكونوا من أسياد المستقبل» ---------------- */
const TASKS = ['كتابة كود وتجربته', 'تحليل بيانات المبيعات', 'تصميم إعلان', 'رد على العملاء'];
export const Masters: React.FC<{f: number}> = ({f}) => {
	const a = wf(66);
	const master = wf(69); // «يتقنوا»
	const fut = wf(72); // «رح يكونوا»
	const lords = wf(75); // «أسياد المستقبل»
	const b = wf(77) - 1;
	return (
		<AbsoluteFill>
			<Shot f={f} a={a} b={fut - 1} src={M('v_typing.mp4')} credit={CR.gyasi} trim={0.3} move={{s0: 1.15, s1: 1.3, p0: 40, p1: 30}} grade="contrast(1.12) saturate(0.9) brightness(1.15)" />
			<Shot f={f} a={fut} b={b} src={M('v_dc_aisle.mp4')} credit={CR.dcTour} trim={0} move={{s0: 1.05, s1: 1.25}} ease={EASE.out} dim={0.25} />
			{f < fut ? (
				<div style={{position: 'absolute', left: 120, top: 420, transform: `translateY(${(1 - pop(f, a + 2, {damping: 15})) * 300}px)`, opacity: prog(f, a + 2, a + 8)}}>
					<Panel w={840} title="ai agent · workflow" tag="RUNNING" accent={K.ai}>
						<div style={{padding: '18px 30px 26px', display: 'flex', flexDirection: 'column', gap: 16}}>
							{TASKS.map((t, i) => {
								const at = master - 4 + i * 6;
								const p = prog(f, at, at + 10, EASE.out);
								const done = f >= at + 10;
								return (
									<div key={t} dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 16, opacity: prog(f, a + 4 + i * 2, a + 8 + i * 2)}}>
										<div style={{width: 46}}>{done ? Ico.check(42, K.green) : <div style={{width: 38, height: 38, borderRadius: 19, border: `4px solid ${K.panelLine}`, borderTopColor: K.ai, transform: `rotate(${f * 24}deg)`}} />}</div>
										<div style={{flex: 1}}>
											<div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 32, color: C.paper}}>{t}</div>
											<div style={{marginTop: 8, height: 8, borderRadius: 4, background: 'rgba(244,236,221,0.12)', overflow: 'hidden'}}>
												<div style={{width: `${p * 100}%`, height: '100%', background: done ? K.green : K.ai, marginRight: 0, marginLeft: 'auto'}} />
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</Panel>
					<div style={{marginTop: 18, display: 'flex', justifyContent: 'center', ...appear(f, master)}}>
						<Label text="اللي بيتقنوا التكنولوجيا" size={40} bg={C.yellow} seed={6} rot={-1} />
					</div>
				</div>
			) : null}
			{f >= lords ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', transform: `scale(${0.55 + 0.45 * slam(f, lords)}) rotate(-2deg)`}}>
					<HeroWord text="أسياد المستقبل" size={150} strip={C.charcoal} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/* ---------------- 27.66 – 33.06 s · seven fields, each with its own treatment ---------------- */
const FIELDS = [
	{w: 77, ar: 'برمجة', en: 'CODE'},
	{w: 78, ar: 'تسويق', en: 'MARKETING'},
	{w: 79, ar: 'مبيعات', en: 'SALES'},
	{w: 80, ar: 'تداول', en: 'TRADING'},
	{w: 81, ar: 'تحليل أسواق', en: 'MARKET DATA'},
	{w: 83, ar: 'صناعة محتوى', en: 'CONTENT'},
	{w: 85, ar: 'تجارة إلكترونية', en: 'E-COMMERCE'},
];

const FieldHead: React.FC<{f: number; at: number; k: number}> = ({f, at, k}) => {
	const fl = FIELDS[k];
	const p = pop(f, at, {damping: 13, stiffness: 300, mass: 0.5});
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
			<div style={{transform: `scale(${0.6 + 0.4 * p}) rotate(-2deg)`}}>
				<HeroWord text={fl.ar} size={130} strip={C.charcoal} />
			</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: p}}>
				<TechTag text={`0${k + 1} / 07 · ${fl.en}`} size={26} bg={C.paperWhite} />
			</div>
		</div>
	);
};

const Illus: React.FC = () => <Note text="واجهة توضيحية" size={20} style={{position: 'absolute', left: 44, top: 1488}} />;

export const Industries: React.FC<{f: number}> = ({f}) => {
	const s = FIELDS.map((x) => wf(x.w));
	const any = wf(87); // «أي إشي»
	const b = wf(89) - 1;
	const seg = (k: number) => [s[k], k < 6 ? s[k + 1] - 1 : any - 1] as const;
	const inSeg = (k: number) => f >= seg(k)[0] && f <= seg(k)[1];
	const lit = s.filter((x) => f >= x).length;
	return (
		<AbsoluteFill>
			{/* 1 · programming: real code footage + AI completion */}
			{inSeg(0) ? (
				<>
					<Shot f={f} a={seg(0)[0]} b={seg(0)[1]} src={M('v_code.mp4')} credit={CR.gyasi} move={{s0: 1.35, s1: 1.2}} dim={0.15} />
					<div style={{position: 'absolute', left: 120, top: 880, ...appear(f, s[0] + 4, 5)}}>
						<Panel w={840} title="ai assistant" tag="SUGGEST" accent={K.ai}>
							<div dir="ltr" style={{padding: '16px 24px 20px', fontFamily: FONT.mono, fontWeight: 700, fontSize: 30, color: K.ai, whiteSpace: 'nowrap', overflow: 'hidden'}}>
								{'> write tests for counter.js'.slice(0, Math.max(0, Math.floor((f - s[0] - 6) * 2.2)))}
								<span style={{opacity: Math.floor(f / 4) % 2}}>▍</span>
							</div>
						</Panel>
					</div>
				</>
			) : null}
			{/* 2 · marketing: campaign dashboard (illustrative) */}
			{inSeg(1) ? (
				<>
					<GridStage f={f} tint="rgba(242,182,48,0.08)" />
					<div style={{position: 'absolute', left: 90, top: 640}}>
						<Panel w={900} h={560} title="campaigns · audience" tag="A/B" accent={C.yellow}>
							<div style={{display: 'flex', gap: 30, padding: '30px 34px', direction: 'ltr', alignItems: 'flex-end', height: 330}}>
								{[0.42, 0.66, 0.38, 0.9, 0.58, 0.74].map((v, i) => (
									<div key={i} style={{flex: 1, height: `${v * 100 * prog(f, s[1] + i * 0.5, s[1] + i * 0.5 + 5, EASE.out)}%`, background: i === 3 ? C.yellow : 'rgba(244,236,221,0.25)', borderRadius: '6px 6px 0 0'}} />
								))}
							</div>
							<div dir="rtl" style={{display: 'flex', gap: 16, padding: '0 34px'}}>
								{['إعلان A', 'إعلان B', 'جمهور جديد'].map((t, i) => (
									<div key={t} style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 24, color: i === 1 ? C.charcoal : C.paper, background: i === 1 ? C.yellow : 'rgba(244,236,221,0.1)', padding: '6px 14px', borderRadius: 6}}>{t}</div>
								))}
							</div>
						</Panel>
					</div>
					<Illus />
				</>
			) : null}
			{/* 3 · sales: CRM pipeline (illustrative) */}
			{inSeg(2) ? (
				<>
					<GridStage f={f} tint="rgba(63,191,127,0.08)" />
					<div style={{position: 'absolute', left: 60, top: 640, display: 'flex', gap: 16, direction: 'rtl'}}>
						{['عميل محتمل', 'تواصل', 'عرض سعر', 'تم البيع'].map((col, i) => (
							<div key={col} style={{width: 228, height: 540, background: K.panel, border: `2px solid ${i === 3 ? K.green : K.panelLine}`, borderRadius: 14, padding: 12}}>
								<div dir="rtl" style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 24, color: i === 3 ? K.green : C.paper, marginBottom: 12, whiteSpace: 'nowrap'}}>{col}</div>
								{Array.from({length: 4 - Math.floor(i / 2)}).map((_, k) => {
									const moving = i === 2 && k === 0;
									const dx = moving ? -244 * prog(f, s[2] + 4, s[2] + 12, EASE.io) : 0;
									return <div key={k} style={{height: 84, marginBottom: 10, borderRadius: 8, background: moving ? C.yellow : 'rgba(244,236,221,0.12)', transform: `translateX(${dx}px)`, boxShadow: moving ? '0 10px 20px rgba(0,0,0,0.4)' : undefined}} />;
								})}
							</div>
						))}
					</div>
					<Illus />
				</>
			) : null}
			{/* 4 · trading: candlesticks (illustrative) + no-guarantee badge */}
			{inSeg(3) ? (
				<>
					<GridStage f={f} tint="rgba(229,72,77,0.07)" />
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
						{Array.from({length: 22}).map((_, i) => {
							const x = 80 + i * 42;
							const up = rand(i * 7 + 1) > 0.42;
							const base = 1000 - i * 9 + (rand(i * 3) - 0.5) * 120;
							const hgt = 40 + rand(i * 5) * 110;
							const show = prog(f, s[3] - 2 + i * 0.25, s[3] + i * 0.25);
							return (
								<g key={i} opacity={show}>
									<line x1={x} x2={x} y1={base - hgt - 30} y2={base + 30} stroke={up ? K.green : K.red} strokeWidth={4} />
									<rect x={x - 13} y={base - hgt} width={26} height={hgt} fill={up ? K.green : K.red} />
								</g>
							);
						})}
					</svg>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1210, display: 'flex', justifyContent: 'center', ...appear(f, s[3] + 3, 5)}}>
						<Badge text="تحليل بمساعدة AI · مش ربح مضمون" color={C.yellow} bg="rgba(20,22,26,0.92)" size={28} rot={-1} />
					</div>
					<Illus />
				</>
			) : null}
			{/* 5 · market analysis: real ticker board + data overlay */}
			{inSeg(4) ? (
				<Shot f={f} a={seg(4)[0]} b={seg(4)[1]} src={M('m_ticker.jpg')} credit={CR.ticker} move={{s0: 1.3, s1: 1.15, p0: 35, p1: 60}} dim={0.3}>
					<Scan f={f} h={1920} speed={30} color="rgba(242,182,48,0.14)" />
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
						<polyline
							points={Array.from({length: 18}).map((_, i) => `${80 + i * 54},${1050 - i * 14 - Math.sin(i * 1.3) * 60}`).join(' ')}
							fill="none"
							stroke={C.yellow}
							strokeWidth={8}
							pathLength={1}
							strokeDasharray={`${prog(f, s[4], s[4] + 14)} 1`}
							style={{filter: 'drop-shadow(0 0 10px rgba(242,182,48,0.7))'}}
						/>
					</svg>
				</Shot>
			) : null}
			{/* 6 · content creation: real Kdenlive editor screenshot with a moving playhead */}
			{inSeg(5) ? (
				<Shot f={f} a={seg(5)[0]} b={seg(5)[1]} src={M('m_kdenlive.jpg')} credit={CR.kdenlive} kind="لقطة شاشة حقيقية" move={{s0: 1.9, s1: 1.7, p0: 30, p1: 40}} grade="contrast(1.05) brightness(0.95)">
					<div style={{position: 'absolute', left: kf(f, [s[5], seg(5)[1]], [300, 700], EASE.linear), top: 900, width: 6, height: 520, background: K.red, boxShadow: '0 0 14px rgba(229,72,77,0.8)'}} />
				</Shot>
			) : null}
			{/* 7 · e-commerce: real automated warehouse + order card (illustrative) */}
			{inSeg(6) ? (
				<Shot f={f} a={seg(6)[0]} b={seg(6)[1]} src={M('m_ocado.jpg')} credit={CR.ocado} move={{s0: 1.12, s1: 1.25, p0: 55, p1: 45}} dim={0.15}>
					<div style={{position: 'absolute', left: 140, top: 880, ...appear(f, s[6] + 5, 6)}}>
						<Panel w={800} title="store · orders" tag="AUTO" accent={K.green}>
							<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 20, padding: '18px 26px 22px'}}>
								{Ico.cart(56, C.yellow)}
								<div style={{flex: 1}}>
									<div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 34, color: C.paper}}>طلب جديد · تم الشحن</div>
									<div dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 24, color: 'rgba(244,236,221,0.6)', textAlign: 'right'}}>ORDER #1042 → SHIPPED</div>
								</div>
								{Ico.check(52, K.green)}
							</div>
						</Panel>
					</div>
				</Shot>
			) : null}
			{/* 8 · «أي إشي»: everything at once (mosaic) */}
			{f >= any ? (
				<>
					<GridStage f={f} />
					<div dir="rtl" style={{position: 'absolute', left: 60, top: 560, width: 960, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14}}>
						{[
							['m_vscode.jpg', 'برمجة'],
							['m_candle.jpg', 'تداول'],
							['m_ticker.jpg', 'تحليل أسواق'],
							['m_kdenlive.jpg', 'محتوى'],
							['m_ocado.jpg', 'تجارة إلكترونية'],
							['m_blender.jpg', 'تصميم'],
						].map(([img, t], i) => {
							const p = pop(f, any + i * 1.5, {damping: 14, stiffness: 260});
							return (
								<div key={img} style={{position: 'relative', height: 250, borderRadius: 10, overflow: 'hidden', transform: `scale(${p})`, border: `3px solid ${i % 2 ? C.yellow : C.paperWhite}`}}>
									<Img src={staticFile(M(img))} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)'}} />
									<div style={{position: 'absolute', right: 8, bottom: 8, fontFamily: FONT.display, fontWeight: 800, fontSize: 26, color: C.charcoal, background: C.paperWhite, padding: '2px 10px', borderRadius: 4}}>{t}</div>
								</div>
							);
						})}
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', transform: `scale(${0.55 + 0.45 * slam(f, wf(88))}) rotate(-2deg)`, opacity: f >= wf(88) ? 1 : 0}}>
						<HeroWord text="أي إشي" size={150} strip={C.charcoal} />
					</div>
					<div style={{position: 'absolute', left: 44, top: 1488}}>
						<Note text="لقطات: VS Code (MIT) · Qtstalker (CC0) · Kdenlive (CC BY 3.0) · Ocado (CC BY-SA 4.0) · Blender (CC0)" size={18} />
					</div>
				</>
			) : null}
			{/* field heads + progress */}
			{FIELDS.map((_, k) => (inSeg(k) ? <FieldHead key={k} f={f} at={s[k]} k={k} /> : null))}
			{f < any ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1290, display: 'flex', justifyContent: 'center'}}>
					<PixelRow n={7} lit={lit} size={20} gap={10} />
				</div>
			) : null}
			{f > b ? null : null}
		</AbsoluteFill>
	);
};

/* ---------------- 33.06 – 36.22 s · «الذكاء الاصطناعي صار يخليك لحالك تعمل شغل شركة كاملة» ---------------- */
const DEPTS = ['تطوير', 'تصميم', 'تسويق', 'دعم العملاء', 'مبيعات', 'تحليلات', 'عمليات', 'أتمتة'];
export const OneCompany: React.FC<{f: number}> = ({f}) => {
	const a = wf(89);
	const alone = wf(93); // «لحالك»
	const work = wf(94); // «تعمل شغل»
	const comp = wf(96); // «شركة كاملة»
	const b = wf(98) - 1;
	const cx = 540;
	const cy = 860;
	const R = 345;
	const camS = kf(f, [a, alone, b], [1.12, 1.0, 0.94], EASE.out);
	return (
		<AbsoluteFill>
			<GridStage f={f} />
			<Cam s={camS}>
				{/* system ring */}
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					<circle cx={cx} cy={cy} r={R} fill="none" stroke={C.yellow} strokeWidth={4} strokeDasharray="14 12" pathLength={1} opacity={prog(f, comp, comp + 8)} style={{transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${f * 0.6}deg)`}} />
					<circle cx={cx} cy={cy} r={140} fill="none" stroke={K.ai} strokeWidth={3} opacity={0.5 + 0.3 * Math.sin(f / 5)} />
				</svg>
				{DEPTS.map((d, i) => {
					const at = work - 4 + i * 2.2;
					const ang = (-90 + i * 45) * (Math.PI / 180);
					const x = cx + Math.cos(ang) * R;
					const y = cy + Math.sin(ang) * R;
					return (
						<React.Fragment key={d}>
							<Stream f={f} a={at} b={b + 12} x0={cx} y0={cy} x1={x} y1={y} color={i % 2 ? K.ai : C.yellow} n={5} size={12} seed={i + 3} speed={1.3} />
							<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${pop(f, at, {damping: 12, stiffness: 260})})`}}>
								<div dir="rtl" style={{background: f >= comp ? C.yellow : K.panel, color: f >= comp ? C.charcoal : C.paper, border: `3px solid ${i % 2 ? K.ai : C.yellow}`, borderRadius: 10, padding: '8px 16px 10px', fontFamily: FONT.display, fontWeight: 800, fontSize: 30, whiteSpace: 'nowrap', boxShadow: '0 12px 24px rgba(0,0,0,0.45)'}}>
									{d}
								</div>
							</div>
						</React.Fragment>
					);
				})}
				<div style={{position: 'absolute', left: cx - 300, top: cy - 300, width: 600, height: 600, opacity: 0.55 * (1 - prog(f, work, work + 10) * 0.6), mixBlendMode: 'screen', transform: `rotate(${f * 0.3}deg)`}}>
					<NeuralNet f={f} draw={prog(f, a, a + 24)} w={600} h={600} layers={[3, 6, 2, 6, 3]} seed={9} />
				</div>
				{/* the one operator */}
				<div style={{position: 'absolute', left: cx - 95, top: cy - 105, width: 190, height: 190, borderRadius: 95, background: 'rgba(242,182,48,0.14)', border: `5px solid ${C.yellow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.7 + 0.3 * pop(f, a + 2)})`, boxShadow: f >= alone ? `0 0 ${40 + 20 * Math.sin(f / 4)}px rgba(242,182,48,0.6)` : undefined}}>
					{Ico.person(120, C.paper)}
				</div>
				{f >= alone ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: cy + 115, display: 'flex', justifyContent: 'center', ...appear(f, alone, 6)}}>
						<TechTag text="1 PERSON + AI" size={28} bg={C.paperWhite} />
					</div>
				) : null}
			</Cam>
			{f >= alone && f < comp ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', transform: `scale(${0.55 + 0.45 * slam(f, alone)}) rotate(-2deg)`}}>
					<HeroWord text="شخص واحد" size={120} face={C.paperWhite} strip={C.charcoal} />
				</div>
			) : null}
			{f < alone ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 320, display: 'flex', justifyContent: 'center', ...appear(f, a + 2)}}>
					<TechTag text="AI = LEVERAGE" size={40} bg={K.ai} />
				</div>
			) : null}
			{f >= comp ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', transform: `scale(${0.55 + 0.45 * slam(f, comp)}) rotate(-2deg)`}}>
					<HeroWord text="شغل شركة كاملة" size={120} strip={C.charcoal} />
				</div>
			) : null}
			<div style={{position: 'absolute', left: 0, right: 0, top: 1255, display: 'flex', justifyContent: 'center', ...appear(f, work)}}>
				<Note text="الأدوات بتضاعف قدرتك · النجاح مش مضمون، وبعض الأدوار بتضل بحاجة لناس" size={22} />
			</div>
		</AbsoluteFill>
	);
};

export const _u = {SHADOW, Label};
