// 17.30 – 44.67 s · «ونفس المبدأ بالـAI … مثل مخك. فعلى سبيل المثال … ضمن تعليماتي. هون المخ بحلّل ويقرر … عشان يحقق هدف.»
// One continuous world: the brain lifts out of the head and becomes the AI core → example models plug in one at a time →
// email tools connect (white = incoming, yellow = outgoing) → a fictional email is read, analysed and answered inside the
// user's instructions → the system compacts into the closing equation «مخ + أدوات + هدف = AI Agent».
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog} from '../../../brand/anim';
import {SvgDefs} from '../../../brand/props';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, Label, TitleCard} from '../../../brand/type';
import {W, wf} from '../ep';
import {ACT, AiCore, along, BRAIN_IN_HEAD, chipIn, Envelope, Ground, Ico, IName, INFO, MiniBrain, Plane, polyD, Pt, Pulse, toScreen, ToolPlate, wordsUpTo} from '../kit';
import {BRAIN_W, FIG, humanCam} from './Human';

export const A = {
	lift: wf(W.wnafs),
	dig: wf(W.bilai),
	label: wf(W.takhayyal2),
	m1: wf(W.chatgpt),
	m2: wf(W.claude),
	m3: wf(W.gemini),
	like: wf(W.mithl),
	ex: wf(W.fa3ala),
	tools: wf(W.rabatnaha),
	read: wf(W.btiqra),
	send: wf(W.wbtib3ath),
	rules: wf(W.qulnalo),
	mailIn: wf(W.ywaslak),
	analyse: wf(W.hallel),
	reply: wf(W.wrod),
	bound: wf(W.dimn),
	hon2: wf(W.hon2),
	bihallel: wf(W.bihallel),
	decide: wf(W.wyqarrer),
	adawat: wf(W.wal_adawat),
	receive: wf(W.yestaqbel),
	sendAll: wf(W.wyeb3ath),
	fin: wf(W.wbhay),
	agent: wf(W.agent2),
	wakeel: wf(W.wakeel),
	mokh: wf(W.mokh4),
	ma3o: wf(W.wma3o),
	adawat2: wf(W.adawat2),
	uses: wf(W.byestakhdemha),
	yhaqqeq: wf(W.yhaqqeq),
	hadaf: wf(W.hadaf),
};

// layout
const READER = {x: 300, y: 540};
const SENDER = {x: 300, y: 1120};
const COL = 760; // right column centre (cards)
const TILE = {y: 1080, core: 820, tools: 540, goal: 260, half: 114};

/** Core position/size over the whole world (k = size factor, S = 360·k). */
const coreAt = (f: number) => {
	const fr = [A.dig + 24, A.like, A.like + 14, A.ex + 2, A.ex + 40, A.fin, A.fin + 38];
	return {
		x: kf(f, fr, [540, 540, 330, 330, 300, 300, TILE.core]),
		y: kf(f, fr, [790, 790, 790, 790, 830, 830, TILE.y]),
		k: kf(f, fr, [1, 1, 0.8, 0.8, 0.78, 0.78, 0.5]),
	};
};
const toolsAt = (f: number) => {
	const t = prog(f, A.fin, A.fin + 38, EASE.io);
	return {
		reader: {x: READER.x + (TILE.tools - READER.x) * t, y: READER.y + (TILE.y - 44 - READER.y) * t},
		sender: {x: SENDER.x + (TILE.tools - SENDER.x) * t, y: SENDER.y + (TILE.y + 44 - SENDER.y) * t},
		s: 1 - 0.5 * t,
	};
};

export const AgentWorld: React.FC<{f: number; start: number}> = ({f, start}) => {
	if (f < start) return null;
	const core = coreAt(f);
	const m = prog(f, A.dig, A.dig + 24, EASE.io); // brain → digital core
	const tools = toolsAt(f);
	const toolP = chipIn(f, A.tools + 2);
	const cable = prog(f, A.tools + 8, A.tools + 24, EASE.io) * (1 - prog(f, A.fin, A.fin + 12));
	// brain lift: from the head (recap camera) to the stage centre
	const cam0 = humanCam(A.lift);
	const b0 = toScreen(cam0, BRAIN_W.x, BRAIN_W.y);
	const s0 = BRAIN_IN_HEAD.s * FIG.s * cam0.s;
	const lt = prog(f, A.lift, A.lift + 26, EASE.io);
	const bx = b0.x + (540 - b0.x) * lt;
	const by = b0.y + (790 - b0.y) * lt - Math.sin(lt * Math.PI) * 90;
	const bs = (s0 + (0.62 - s0) * lt) * (1 - 0.32 * m);
	// signal activity on the tools
	const readerOn = Math.max(env(f, A.read - 2, A.send - 2), env(f, A.mailIn + 18, A.analyse + 8), env(f, A.receive - 14, A.sendAll - 2));
	const senderOn = Math.max(env(f, A.send - 2, A.rules - 6), env(f, A.bound + 18, A.hon2 + 16), env(f, A.sendAll - 2, A.fin + 4));
	const think = Math.max(env(f, A.analyse + 6, A.bound + 10), env(f, A.hon2 + 4, A.fin), f >= A.uses ? 1 : 0);
	const coreGlow = Math.max(m * (1 - prog(f, A.dig + 24, A.dig + 40)), think * 0.8, env(f, A.mokh - 2, A.mokh + 26));
	// boundary = the user's instructions around the agent
	const bDraw = prog(f, A.rules + 6, A.rules + 30, EASE.io);
	const bPulse = env(f, A.bound - 2, A.bound + 30, 4, 12);
	const bFade = 1 - prog(f, A.fin, A.fin + 16);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{opacity: prog(f, A.lift, A.lift + 14)}}>
				<Ground shift={f * 0.4} />
			</AbsoluteFill>
			<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
				<SvgDefs />
				{/* instructions boundary */}
				{bDraw > 0 && bFade > 0 ? (
					<g opacity={bFade}>
						<rect x={90} y={445} width={420} height={770} rx={40} fill={`rgba(242,182,48,${(0.04 + 0.08 * bPulse) * bDraw})`} stroke="none" />
						{bDraw < 1 ? (
							<rect x={90} y={445} width={420} height={770} rx={40} fill="none" stroke={ACT} strokeWidth={5} pathLength={1000} strokeDasharray={`${bDraw * 1000} 1000`} opacity={0.75} />
						) : (
							<rect x={90} y={445} width={420} height={770} rx={40} fill="none" stroke={ACT} strokeWidth={5 + 3 * bPulse} strokeDasharray="22 14" strokeDashoffset={-f * 1.2} opacity={0.6 + 0.4 * bPulse} />
						)}
					</g>
				) : null}
				{/* cables: tools ↔ core */}
				{cable > 0 ? (
					<g>
						<line x1={READER.x} y1={READER.y + 50} x2={READER.x} y2={READER.y + 50 + (core.y - core.k * 206 - READER.y - 50) * cable} stroke={INFO} strokeWidth={10} strokeLinecap="round" opacity={0.85} />
						<line x1={SENDER.x} y1={core.y + core.k * 206} x2={SENDER.x} y2={core.y + core.k * 206 + (SENDER.y - 50 - core.y - core.k * 206) * cable} stroke={ACT} strokeWidth={10} strokeLinecap="round" opacity={0.85} />
					</g>
				) : null}
				<FinaleTiles f={f} />
				{/* paper brain lifting out of the head, then dissolving into the core */}
				{f < A.dig + 26 ? (
					<g transform={`translate(${bx} ${by}) scale(${bs})`} opacity={1 - m}>
						<MiniBrain glow={0.4 * (1 - lt)} />
					</g>
				) : null}
				{/* the AI core */}
				{m > 0 ? (
					<g transform={`translate(${core.x} ${core.y}) scale(${core.k * (0.75 + 0.25 * m)})`} opacity={m}>
						<AiCore S={360} glow={coreGlow} think={think} frame={f} label={f >= A.label && f < A.fin ? 'MODEL' : undefined} />
					</g>
				) : null}
				{/* digitising pixels */}
				{m > 0.05 && m < 0.95
					? Array.from({length: 40}).map((_, i) => {
							const a = (i * 137.5 * Math.PI) / 180;
							const r = 120 + ((i * 53) % 140) * m;
							const s = 22 * (1 - Math.abs(m - 0.5) * 2);
							return <rect key={i} x={540 + Math.cos(a) * r - s / 2} y={790 + Math.sin(a) * r - s / 2} width={s} height={s} fill={i % 3 ? C.yellow : C.paperWhite} opacity={0.9} />;
						})
					: null}
				{/* example models: one plugged into the core at a time */}
				<ModelLinks f={f} />
				{/* «مثل مخك»: paper brain ≈ core */}
				{f >= A.like && f < A.ex + 16 ? (
					<g opacity={1 - prog(f, A.ex, A.ex + 14)}>
						<g transform={`translate(770 790) scale(${0.36 * pop(f, A.like + 4)})`}>
							<MiniBrain />
						</g>
						<g transform="translate(552 790)" opacity={prog(f, A.like + 8, A.like + 14)}>
							<rect x={-36} y={-20} width={72} height={12} rx={6} fill={C.yellow} />
							<rect x={-36} y={8} width={72} height={12} rx={6} fill={C.yellow} />
						</g>
					</g>
				) : null}
				<EmailFlow f={f} core={core} />
				<Finale f={f} />
			</svg>
			{/* tool plates */}
			{f >= A.tools ? (
				<>
					<ToolPlate x={tools.reader.x} y={tools.reader.y} icon="inbox" label="قراءة الإيميل" tone="in" on={readerOn} p={toolP} scale={tools.s} />
					<ToolPlate x={tools.sender.x} y={tools.sender.y} icon="send" label="إرسال الإيميل" tone="out" on={senderOn} p={chipIn(f, A.tools + 6)} scale={tools.s} />
				</>
			) : null}
			<Overlays f={f} core={core} />
		</AbsoluteFill>
	);
};

const env = (f: number, a: number, b: number, fin = 4, fout = 8) => {
	if (f < a || f > b) return 0;
	return Math.min(fin > 0 ? Math.min(1, (f - a) / fin) : 1, fout > 0 ? Math.min(1, (b - f) / fout) : 1);
};

const MODELS = [
	{name: 'ChatGPT', at: A.m1, x: 820},
	{name: 'Claude', at: A.m2, x: 540},
	{name: 'Gemini', at: A.m3, x: 260},
];
const activeModel = (f: number) => (f >= A.like ? -1 : f >= A.m3 ? 2 : f >= A.m2 ? 1 : f >= A.m1 ? 0 : -1);

const ModelLinks: React.FC<{f: number}> = ({f}) => {
	const i = activeModel(f);
	if (i < 0) return null;
	const md = MODELS[i];
	const d = prog(f, md.at, md.at + 7, EASE.out);
	const path: Pt[] = [{x: md.x, y: 1105}, {x: md.x, y: 1060}, {x: 540, y: 1040}, {x: 540, y: 1000}];
	return (
		<g>
			<path d={polyD(path)} fill="none" stroke={ACT} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${d * 400} 400`} />
			<Pulse pts={path} t={prog(f, md.at + 4, md.at + 14)} color={ACT} r={9} />
		</g>
	);
};

/* ---------------- email: in through the reader, analysed, answered, out through the sender ---------------- */
const E1_IN: Pt[] = [{x: COL, y: 470}, {x: 500, y: 540}, READER, {x: READER.x, y: 830}];
const REPLY_OUT: Pt[] = [{x: COL, y: 960}, {x: 500, y: 1120}, SENDER];
const PLANE_OUT: Pt[] = [SENDER, {x: 120, y: 1100}, {x: -220, y: 1010}];
const STREAM_IN: Pt[] = [{x: 1180, y: 470}, {x: 500, y: 540}, READER, {x: READER.x, y: 830}];

const EmailFlow: React.FC<{f: number; core: {x: number; y: number; k: number}}> = ({f}) => {
	const e1 = prog(f, A.mailIn + 18, A.analyse + 10, EASE.io);
	const r1 = prog(f, A.bound + 12, A.bound + 26, EASE.io);
	const p1 = prog(f, A.bound + 26, A.hon2 + 16, EASE.in);
	const streams = [0, 1, 2].map((i) => prog(f, A.receive - 14 + i * 10, A.receive + 6 + i * 10, EASE.io));
	const planes = [0, 1, 2].map((i) => prog(f, A.sendAll + i * 7, A.sendAll + 16 + i * 7, EASE.in));
	const env1 = along(E1_IN, e1);
	const envR = along(REPLY_OUT, r1);
	return (
		<g>
			{e1 > 0 && e1 < 1 ? (
				<g transform={`translate(${env1.x} ${env1.y})`}>
					<Envelope w={110} />
				</g>
			) : null}
			{r1 > 0 && r1 < 1 ? (
				<g transform={`translate(${envR.x} ${envR.y})`}>
					<Envelope w={110} tone="out" />
				</g>
			) : null}
			{p1 > 0 && p1 < 1 ? (
				<g transform={`translate(${along(PLANE_OUT, p1).x} ${along(PLANE_OUT, p1).y}) rotate(${-8 - 14 * p1})`}>
					<Plane s={1.1} />
				</g>
			) : null}
			{streams.map((t, i) =>
				t > 0 && t < 1 ? (
					<g key={i} transform={`translate(${along(STREAM_IN, t).x} ${along(STREAM_IN, t).y})`}>
						<Envelope w={90} />
					</g>
				) : null,
			)}
			{planes.map((t, i) =>
				t > 0 && t < 1 ? (
					<g key={i} transform={`translate(${along(PLANE_OUT, t).x} ${along(PLANE_OUT, t).y + i * 26 - 26}) rotate(${-8 - 14 * t})`}>
						<Plane s={0.9} />
					</g>
				) : null,
			)}
		</g>
	);
};

const FinaleTiles: React.FC<{f: number}> = ({f}) => {
	if (f < A.fin + 10) return null;
	const tileP = prog(f, A.fin + 16, A.fin + 34, EASE.out);
	const lit = (at: number) => 0.35 + 0.65 * prog(f, at - 2, at + 6);
	const goalP = pop(f, A.yhaqqeq - 2, {damping: 10, stiffness: 220, mass: 0.6});
	const h = TILE.half;
	return (
		<g>
			{[
				{x: TILE.core, at: A.mokh},
				{x: TILE.tools, at: A.adawat2},
				{x: TILE.goal, at: A.yhaqqeq},
			].map((t, i) => (
				<rect key={i} x={t.x - h} y={TILE.y - h} width={2 * h} height={2 * h} rx={30} fill="rgba(14,18,26,0.7)" stroke={f >= t.at - 2 ? ACT : 'rgba(251,248,241,0.25)'} strokeWidth={4} opacity={tileP * (i === 2 ? Math.min(1, goalP) : lit(t.at))} transform={`translate(0 ${(1 - tileP) * 40})`} />
			))}
		</g>
	);
};

/* ---------------- closing equation (SVG part): tiles, plus signs, goal, goal-directed flow ---------------- */
const Finale: React.FC<{f: number}> = ({f}) => {
	if (f < A.fin + 10) return null;
	const goalP = pop(f, A.yhaqqeq - 2, {damping: 10, stiffness: 220, mass: 0.6});
	const flowPts: Pt[] = [{x: TILE.core - 100, y: TILE.y}, {x: TILE.tools, y: TILE.y}, {x: TILE.goal + 70, y: TILE.y}];
	const loop = f >= A.hadaf - 6 ? ((f - (A.hadaf - 6)) % 26) / 22 : -1;
	const hitAge = loop >= 0 ? (f - (A.hadaf - 6)) % 26 : 99;
	return (
		<g>
			{/* plus signs */}
			{[
				{x: (TILE.core + TILE.tools) / 2, at: A.ma3o},
				{x: (TILE.tools + TILE.goal) / 2, at: A.uses},
			].map((p, i) => {
				const s = pop(f, p.at);
				return (
					<g key={i} transform={`translate(${p.x} ${TILE.y}) scale(${s})`}>
						<rect x={-22} y={-6} width={44} height={12} rx={6} fill={C.paperWhite} />
						<rect x={-6} y={-22} width={12} height={44} rx={6} fill={C.paperWhite} />
					</g>
				);
			})}
			{/* goal */}
			{goalP > 0 ? (
				<g transform={`translate(${TILE.goal} ${TILE.y - 10}) scale(${goalP})`}>
					<circle r={72} fill={C.yellow} filter="url(#shs)" />
					<circle r={52} fill={C.navy} />
					<circle r={28} fill={C.yellow} />
					<circle r={10} fill={C.navy} />
					{hitAge < 8
						? Array.from({length: 10}).map((_, i) => {
								const a = (i / 10) * Math.PI * 2;
								const r0 = 86 + hitAge * 5;
								return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * (r0 + 22)} y2={Math.sin(a) * (r0 + 22)} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" opacity={1 - hitAge / 8} />;
							})
						: null}
				</g>
			) : null}
			{/* goal-directed flow: model → tools → goal */}
			{f >= A.uses ? <path d={polyD(flowPts)} fill="none" stroke="rgba(242,182,48,0.35)" strokeWidth={6} strokeDasharray="10 12" strokeDashoffset={-f * 2} /> : null}
			{loop >= 0 && loop <= 1 ? <Pulse pts={flowPts} t={loop} color={ACT} r={11} tail={0.14} /> : null}
		</g>
	);
};

/* ---------------- HTML overlays: titles, cards, chips, labels ---------------- */
const Card: React.FC<{x: number; y: number; w?: number; border: string; p: number; o?: number; children: React.ReactNode}> = ({x, y, w = 390, border, p, o = 1, children}) => (
	<div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `scale(${0.5 + 0.5 * p})`, opacity: Math.min(1, p * 2) * o}}>
		<div dir="rtl" style={{background: C.paperWhite, borderRadius: 18, padding: '16px 22px 18px', borderTop: `10px solid ${border}`, filter: SHADOW.lifted, display: 'flex', flexDirection: 'column', gap: 8}}>
			{children}
		</div>
	</div>
);
const Row: React.FC<{icon: IName; text: string; size?: number; color?: string; bold?: boolean}> = ({icon, text, size = 30, color = C.charcoal, bold}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
		<Ico name={icon} size={size * 1.1} color={color} stroke={2.4} />
		<span style={{fontFamily: FONT.display, fontWeight: bold ? 900 : 700, fontSize: size, color, lineHeight: 1.3, whiteSpace: 'nowrap'}}>{text}</span>
	</div>
);
const Chip: React.FC<{x: number; y: number; icon: IName; text: string; col: string; p: number; o?: number; hot?: boolean; size?: number}> = ({x, y, icon, text, col, p, o = 1, hot, size = 32}) => (
	<div style={{position: 'absolute', left: x - 260, width: 520, top: y, display: 'flex', justifyContent: 'center', transform: `scale(${0.4 + 0.6 * p})`, opacity: Math.min(1, p * 2) * o}}>
		<div dir="rtl" style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 22px 10px 14px', borderRadius: 40, background: hot ? col : 'rgba(14,18,26,0.92)', border: `3px solid ${col}`, filter: SHADOW.lifted, whiteSpace: 'nowrap'}}>
			<div style={{width: size * 1.4, height: size * 1.4, borderRadius: '50%', background: hot ? 'rgba(38,35,33,0.12)' : col, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Ico name={icon} size={size} color={C.charcoal} stroke={2.6} />
			</div>
			<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: size, color: hot ? C.charcoal : C.paperWhite, lineHeight: 1.25}}>{text}</span>
		</div>
	</div>
);

const Overlays: React.FC<{f: number; core: {x: number; y: number; k: number}}> = ({f, core}) => {
	const out1 = prog(f, A.hon2 + 2, A.hon2 + 14); // first email example clears
	const outAll = prog(f, A.fin, A.fin + 12);
	const rulesT = prog(f, A.mailIn - 4, A.mailIn + 12, EASE.io); // instructions card → boundary tag
	const decideSel = f >= A.decide + 10;
	return (
		<>
			<TitleCard frame={f} at={A.lift + 2} out={A.ex - 4} text="نفس المبدأ بالـ AI" size={50} seed={95} />
			<TitleCard frame={f} at={A.ex + 2} out={A.fin - 2} text="مثال: الإيميلات" size={50} seed={97} />
			{/* core name */}
			{f >= A.label && f < A.like + 12 ? (
				<div style={{position: 'absolute', left: 340, width: 400, top: 1000 - 6, display: 'flex', justifyContent: 'center', transform: `scale(${chipIn(f, A.label)})`, opacity: 1 - prog(f, A.like, A.like + 10)}}>
					<Label text="النموذج = الذكاء اللي بتستخدمه" size={34} seed={4} rot={-1.5} />
				</div>
			) : null}
			{/* example model plates */}
			{f >= A.m1 - 8 && f < A.like + 14 ? (
				<>
					<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: 1180 + 34, textAlign: 'center', fontFamily: FONT.label, fontWeight: 700, fontSize: 26, color: 'rgba(251,248,241,0.7)', opacity: prog(f, A.m1 - 8, A.m1) * (1 - prog(f, A.like, A.like + 10))}}>
						أمثلة على نماذج — كل واحد لحاله
					</div>
					{MODELS.map((md, i) => {
						const p = chipIn(f, md.at - 2);
						const on = activeModel(f) === i;
						return (
							<div key={i} style={{position: 'absolute', left: md.x - 120, top: 1105, width: 240, height: 92, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, background: on ? C.yellow : 'rgba(14,18,26,0.9)', border: `4px solid ${on ? C.yellow : 'rgba(251,248,241,0.3)'}`, filter: SHADOW.lifted, transform: `scale(${(0.4 + 0.6 * p) * (on ? 1.06 : 1)})`, opacity: Math.min(1, p * 2) * (on ? 1 : 0.55) * (1 - prog(f, A.like, A.like + 10))}}>
								<span dir="ltr" style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 44, color: on ? C.charcoal : C.paperWhite}}>
									{md.name}
								</span>
							</div>
						);
					})}
				</>
			) : null}
			{/* «مثل مخك» labels */}
			{f >= A.like + 4 && f < A.ex + 16 ? (
				<div style={{opacity: 1 - prog(f, A.ex, A.ex + 12)}}>
					<div style={{position: 'absolute', left: 770 - 150, width: 300, top: 930, display: 'flex', justifyContent: 'center', transform: `scale(${chipIn(f, A.like + 6)})`}}>
						<Label text="مخك" size={44} seed={8} rot={2} />
					</div>
					<div style={{position: 'absolute', left: core.x - 150, width: 300, top: 930, display: 'flex', justifyContent: 'center', transform: `scale(${chipIn(f, A.like + 9)})`}}>
						<Label text="النموذج" size={44} seed={9} rot={-2} bg={C.yellow} />
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1090, display: 'flex', justifyContent: 'center', transform: `scale(${chipIn(f, A.like + 14)})`}}>
						<Badge text="تشبيه للتوضيح" size={28} color={C.yellow} bg="rgba(14,18,26,0.9)" />
					</div>
				</div>
			) : null}
			{/* instructions card → boundary tag */}
			{f >= A.rules && f < A.fin + 14 ? (
				<>
					{rulesT < 1 ? (
						<div style={{position: 'absolute', left: COL - 200 + (300 - COL) * rulesT, top: 600 + (420 - 600) * rulesT, width: 400, transform: `scale(${chipIn(f, A.rules) * (1 - 0.6 * rulesT)})`, transformOrigin: '50% 0%', opacity: 1 - prog(f, A.mailIn - 2, A.mailIn + 6)}}>
							<div dir="rtl" style={{position: 'relative', background: C.paperWhite, borderRadius: 8, padding: '22px 26px 18px', filter: SHADOW.lifted, overflow: 'hidden'}}>
								<div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 41px, rgba(46,66,96,0.14) 41px 43px)', backgroundPosition: '0 22px'}} />
								<div style={{position: 'absolute', left: 0, right: 0, top: 12, height: 3, background: 'rgba(198,90,62,0.55)'}} />
								<div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6}}>
									<Ico name="rule" size={40} color={C.charcoal} stroke={2.4} />
									<span style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 42, color: C.charcoal}}>تعليماتي</span>
								</div>
								<div style={{position: 'relative', fontFamily: FONT.display, fontWeight: 700, fontSize: 30, lineHeight: 1.45, color: C.charcoal}}>
									<div>١. ردود قصيرة ولطيفة</div>
									<div>٢. المواعيد: الثلاثاء أو الخميس</div>
								</div>
							</div>
						</div>
					) : null}
					<div style={{position: 'absolute', left: 300 - 200, width: 400, top: 445 - 30, display: 'flex', justifyContent: 'center', opacity: prog(f, A.mailIn + 4, A.mailIn + 12) * (1 - outAll), transform: `scale(${1 + 0.12 * env(f, A.bound - 2, A.bound + 24, 4, 10)})`}}>
						<div dir="rtl" style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px 8px', borderRadius: 10, background: C.yellow, filter: SHADOW.soft}}>
							<Ico name="rule" size={30} color={C.charcoal} stroke={2.6} />
							<span style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 30, color: C.charcoal, whiteSpace: 'nowrap'}}>ضمن تعليماتي</span>
						</div>
					</div>
				</>
			) : null}
			{/* first email (fictional) */}
			{f >= A.mailIn && f < A.hon2 + 16 ? (
				<Card x={COL} y={340} border={C.steel} p={prog(f, A.mailIn, A.mailIn + 8, EASE.out)} o={1 - out1}>
					<div style={{transform: `translateX(${(1 - prog(f, A.mailIn, A.mailIn + 10, EASE.out)) * -260}px)`}}>
						<Row icon="mail" text="إيميل جديد" size={28} color={C.steelDark} bold />
						<div style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 34, color: C.charcoal, lineHeight: 1.35, marginTop: 4}}>طلب اجتماع</div>
						<div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 30, color: C.charcoalSoft, lineHeight: 1.4}}>مرحبا، ممكن نحدد اجتماع الأسبوع الجاي؟</div>
					</div>
				</Card>
			) : null}
			{/* analysis */}
			{f >= A.analyse + 6 && f < A.hon2 + 16 ? (
				<>
					<Chip x={COL} y={630} icon="mail" text="نوعه: طلب اجتماع" col={INFO} p={chipIn(f, A.analyse + 8)} o={1 - out1} size={30} />
					<Chip x={COL} y={712} icon="rule" text="حسب تعليماتي: الثلاثاء" col={ACT} p={chipIn(f, A.analyse + 16)} o={1 - out1} size={30} />
				</>
			) : null}
			{/* the reply */}
			{f >= A.reply && f < A.hon2 + 16 ? (
				<Card x={COL} y={830} border={C.yellow} p={prog(f, A.reply, A.reply + 8, EASE.out)} o={(1 - out1) * (1 - 0.6 * prog(f, A.bound + 12, A.bound + 20))}>
					<Row icon="send" text="الرد" size={28} color={C.yellowShade} bold />
					<div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 32, color: C.charcoal, lineHeight: 1.4, minHeight: 90}}>{wordsUpTo('أهلاً! الثلاثاء الساعة ١١ الصبح مناسب؟', f, A.reply + 6, 4)}</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 8, opacity: prog(f, A.bound, A.bound + 6), transform: `scale(${0.6 + 0.4 * chipIn(f, A.bound)})`, transformOrigin: '100% 50%'}}>
						<div style={{width: 34, height: 34, borderRadius: '50%', background: C.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<Ico name="check" size={24} color={C.charcoal} stroke={3.2} />
						</div>
						<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 26, color: C.yellowShade}}>ضمن تعليماتي</span>
					</div>
				</Card>
			) : null}
			{/* the model analyses and decides by itself */}
			{f >= A.bihallel - 2 && f < A.fin + 14 ? (
				<div style={{opacity: 1 - outAll}}>
					<Chip x={COL} y={470} icon="brain" text="يحلّل" col={INFO} p={chipIn(f, A.bihallel - 1)} size={34} />
					{f >= A.decide - 2 ? (
						<div style={{position: 'absolute', left: COL - 190, width: 380, top: 580, transform: `scale(${0.5 + 0.5 * chipIn(f, A.decide - 1)})`, opacity: Math.min(1, chipIn(f, A.decide - 1) * 2)}}>
							<div dir="rtl" style={{background: 'rgba(14,18,26,0.92)', border: `3px solid ${C.yellow}`, borderRadius: 24, padding: '14px 16px 16px', filter: SHADOW.lifted, display: 'flex', flexDirection: 'column', gap: 10}}>
								<div style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 34, color: C.yellow, padding: '0 8px'}}>يقرّر الخطوة</div>
								{[
									{icon: 'send' as const, t: 'يرد'},
									{icon: 'ask' as const, t: 'يسألني أولاً'},
									{icon: 'skip' as const, t: 'يتجاهل'},
								].map((o, i) => {
									const sel = decideSel && i === 0;
									const scan = !decideSel && Math.floor((f - A.decide) / 3) % 3 === i;
									return (
										<div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 14, background: sel ? C.yellow : scan ? 'rgba(251,248,241,0.14)' : 'transparent', opacity: decideSel && !sel ? 0.4 : 1}}>
											<Ico name={o.icon} size={34} color={sel ? C.charcoal : C.paperWhite} stroke={2.4} />
											<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 32, color: sel ? C.charcoal : C.paperWhite}}>{o.t}</span>
										</div>
									);
								})}
							</div>
						</div>
					) : null}
					<div style={{position: 'absolute', left: COL - 260, width: 520, top: 960, display: 'flex', justifyContent: 'center', transform: `scale(${chipIn(f, A.adawat)})`}}>
						<Badge text="بدون ما تضغط على كل خطوة" size={32} color={C.yellow} bg="rgba(14,18,26,0.9)" rot={-2} />
					</div>
					{f >= A.receive - 2 ? <Chip x={COL} y={1100} icon="inbox" text="يستقبل" col={INFO} p={chipIn(f, A.receive - 2)} size={30} /> : null}
					{f >= A.sendAll - 2 ? <Chip x={SENDER.x} y={1205} icon="send" text="يبعث" col={ACT} hot p={chipIn(f, A.sendAll - 2)} size={30} /> : null}
				</div>
			) : null}
			{/* closing equation (HTML part) */}
			{f >= A.agent - 2 ? <FinaleText f={f} /> : null}
		</>
	);
};

const FinaleText: React.FC<{f: number}> = ({f}) => {
	const hero = pop(f, A.agent - 1, {damping: 12, stiffness: 230, mass: 0.8});
	const strip = chipIn(f, A.wakeel - 1);
	const eq = pop(f, A.mokh - 6);
	const glowEnd = prog(f, A.hadaf + 2, A.hadaf + 10);
	const labels = [
		{x: TILE.core, at: A.mokh, t: 'مخ', sub: 'النموذج'},
		{x: TILE.tools, at: A.adawat2, t: 'أدوات', sub: 'قراءة وإرسال'},
		{x: TILE.goal, at: A.hadaf, t: 'هدف', sub: 'ردود مناسبة'},
	];
	return (
		<>
			<div style={{position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center', transform: `scale(${0.5 + 0.5 * hero}) rotate(${(1 - hero) * -6}deg)`, opacity: Math.min(1, hero * 2)}}>
				<div style={{filter: glowEnd > 0 ? `drop-shadow(0 0 ${24 * glowEnd}px rgba(242,182,48,0.6))` : undefined}}>
					<HeroWord text="AI Agent" size={170} />
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 665, display: 'flex', justifyContent: 'center', transform: `scale(${0.4 + 0.6 * strip}) rotate(-1.5deg)`, opacity: Math.min(1, strip * 2)}}>
				<Label text="وكيل ذكاء اصطناعي" size={58} seed={12} />
			</div>
			{/* «=» */}
			<div style={{position: 'absolute', left: 540 - 40, top: 835, width: 80, transform: `scale(${eq})`, display: 'flex', flexDirection: 'column', gap: 12}}>
				<div style={{height: 14, borderRadius: 7, background: C.yellow}} />
				<div style={{height: 14, borderRadius: 7, background: C.yellow}} />
			</div>
			{labels.map((l, i) => {
				const p = chipIn(f, l.at - 1);
				return (
					<div key={i} style={{position: 'absolute', left: l.x - 140, width: 280, top: TILE.y + 128, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${0.4 + 0.6 * p})`, opacity: Math.min(1, p * 2)}}>
						<span style={{fontFamily: FONT.hero, fontSize: 64, lineHeight: 1.1, color: C.yellow}}>{l.t}</span>
						<span style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 26, color: 'rgba(251,248,241,0.8)'}}>{l.sub}</span>
					</div>
				);
			})}
		</>
	);
};
