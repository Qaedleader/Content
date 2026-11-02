// 3.48 – 17.30 s · «تخيل حالك كإنسان شفت كرة قدامك … فأعطى أمر لإجرك تتحرك وتشوّت الكرة. هون عينك جابت المعلومة ومخك قرر وإجرك نفذت.»
// One continuous camera: eye perceives (white signal) → brain analyses + decides → yellow command runs down to the leg → kick → recap.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, shake} from '../../../brand/anim';
import {SvgDefs} from '../../../brand/props';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {TitleCard} from '../../../brand/type';
import {W, wf} from '../ep';

const DETACH = wf(W.wnafs); // the brain leaves the head here (AgentWorld takes over)
import {ACT, Ball, BRAIN_IN_HEAD, Cam, camAt, camT, chipIn, EYE, Figure, Ground, HEAD, Ico, INFO, legPoints, NumBadge, Pt, Pulse, toScreen} from '../kit';

// figure placement in world space
export const FIG = {x: 700, y: 1230, s: 0.92};
export const fw = (p: Pt): Pt => ({x: FIG.x + p.x * FIG.s, y: FIG.y + p.y * FIG.s});
const BALL_REST = fw({x: -322, y: -62});
const BALL_R = 62 * FIG.s;

// keyed timings (frames)
export const K = {
	stand: wf(W.takhayyal),
	ballIn: wf(W.shuft) - 4,
	ballStop: wf(W.kora) + 14,
	see: wf(W.aynak),
	zoom: wf(W.dimaghak) - 6,
	packet: wf(W.dimaghak) + 2,
	analyse: wf(W.hallalha),
	known: wf(W.w3eref) + 4,
	options: wf(W.qarrar),
	pick: wf(W.yshawwet) + 2,
	command: wf(W.fa3ta),
	atLeg: wf(W.tet7arrak) - 2,
	windup: wf(W.tet7arrak),
	contact: wf(W.wetshawwet) + 8,
	recap: wf(W.hon) - 6,
	r1: wf(W.aynak2),
	r2: wf(W.mokhak),
	r3: wf(W.ijrak2),
};

export const HEAD_W = fw({x: HEAD.x, y: HEAD.y});
export const BRAIN_W = fw({x: BRAIN_IN_HEAD.x, y: BRAIN_IN_HEAD.y});
const EYE_W = fw(EYE);

const CAM_ID: Cam = {px: 540, py: 960, s: 1, tx: 540, ty: 960};
const CAM_SEE: Cam = {px: 560, py: 800, s: 1.32, tx: 560, ty: 830};
const CAM_HEAD: Cam = {px: HEAD_W.x, py: HEAD_W.y, s: 2.6, tx: 540, ty: 735};
const CAM_RECAP: Cam = {px: 700, py: 800, s: 0.92, tx: 790, ty: 840};
export const humanCam = (f: number) =>
	camAt(f, [
		[K.stand, {...CAM_ID, s: 1.04}],
		[K.ballStop, CAM_ID],
		[K.see - 4, CAM_ID],
		[K.see + 10, CAM_SEE],
		[K.zoom, CAM_SEE],
		[K.zoom + 22, CAM_HEAD],
		[K.command + 2, CAM_HEAD],
		[K.atLeg - 2, {...CAM_ID, py: 940, ty: 960}],
		[K.contact + 14, {...CAM_ID, py: 940, ty: 960}],
		[K.recap + 16, CAM_RECAP],
	]);

// kicking-leg animation: rest → wind-up (anticipation) → swing → contact → follow-through → settle
export const kick = (f: number) => {
	const fr = [K.windup, K.windup + 12, K.contact - 3, K.contact, K.contact + 8, K.contact + 30, K.contact + 52];
	const a1 = kf(f, fr, [0, -30, 18, 30, 64, 8, 0], EASE.io);
	const a2 = kf(f, fr, [0, 100, 40, 2, 12, 10, 0], EASE.io);
	const lean = kf(f, fr, [0, 6, 2, -4, -10, -2, 0], EASE.io);
	const arm = kf(f, fr, [0, 22, 10, -16, -34, -6, 0], EASE.io);
	return {a1, a2, lean, arm};
};

// nerve paths in world space
const P_EYE_BRAIN: Pt[] = [EYE_W, fw({x: -30, y: -886}), BRAIN_W];
const commandPath = (): Pt[] => {
	const lp = legPoints(0, 0);
	return [BRAIN_W, fw({x: 6, y: -800}), fw({x: 0, y: -640}), fw(lp.hip), fw(lp.knee), fw({x: lp.ankle.x - 20, y: lp.ankle.y + 14})];
};
const P_CMD = commandPath();

export const Human: React.FC<{f: number; start: number; end: number}> = ({f, start, end}) => {
	if (f < start || f > end) return null;
	const cam = humanCam(f);
	const k = kick(f);
	const stand = pop(f, K.stand, {damping: 13, stiffness: 170, mass: 0.8});
	// ball: rolls in from the left, rests, is struck, flies off to the left
	let ball: Pt & {rot: number; o: number} = {x: BALL_REST.x, y: BALL_REST.y, rot: 0, o: 1};
	if (f < K.ballStop) {
		const t = prog(f, K.ballIn, K.ballStop, EASE.out);
		const x = -120 + (BALL_REST.x + 120) * t;
		ball = {x, y: BALL_REST.y - Math.abs(Math.sin(t * Math.PI * 2)) * 30 * (1 - t), rot: ((x - BALL_REST.x) / BALL_R) * 57.3, o: f < K.ballIn ? 0 : 1};
	} else if (f >= K.contact) {
		const t = f - K.contact;
		ball = {x: BALL_REST.x - 44 * t, y: BALL_REST.y - 30 * t + 0.9 * t * t, rot: -t * 34, o: 1};
	}
	const seeP = prog(f, K.see, K.see + 18, EASE.io); // perception rays
	const xray = prog(f, K.zoom + 4, K.zoom + 16) * (1 - prog(f, K.atLeg + 4, K.atLeg + 14)) + prog(f, K.r2 - 6, K.r2 + 4);
	const pkt = prog(f, K.packet, K.packet + 22, EASE.io);
	const brainGlow = prog(f, K.analyse - 4, K.analyse + 6) * (1 - prog(f, K.command + 18, K.command + 30)) + 0.8 * prog(f, K.r2, K.r2 + 6);
	const cmd = prog(f, K.command, K.atLeg, EASE.in);
	const legGlow = prog(f, K.atLeg - 4, K.atLeg + 2) * (1 - prog(f, K.contact + 16, K.contact + 30)) + prog(f, K.r3 + 4, K.r3 + 10);
	const sh = shake(f, K.contact, 7, 8);
	const lookBall = f < K.contact ? {x: -6, y: 5} : {x: -7, y: -2};
	// recap pulses replay the two signals (white in, yellow out)
	const rpIn = prog(f, K.r1 + 2, K.r1 + 22, EASE.io);
	const rpOut = prog(f, K.r3 - 12, K.r3 + 8, EASE.io);
	const S = (p: Pt) => toScreen(cam, p.x, p.y);
	const brainS = S(BRAIN_W);
	const headTop = S({x: HEAD_W.x, y: HEAD_W.y - HEAD.r * FIG.s});
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Ground shift={-cam.px * 0.15} />
			<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
				<SvgDefs />
				<g transform={camT(cam)}>
					{/* floor: paper edge + soft contact shadows */}
					<rect x={-2000} y={FIG.y + 18} width={5000} height={1400} fill={C.navy} />
					<rect x={-2000} y={FIG.y + 14} width={5000} height={8} fill="rgba(242,182,48,0.55)" />
					<ellipse cx={FIG.x - 10} cy={FIG.y + 16} rx={150} ry={16} fill="rgba(0,0,0,0.35)" />
					{ball.o > 0 && ball.x > -200 ? <ellipse cx={ball.x} cy={FIG.y + 16} rx={BALL_R * 0.9 * Math.max(0.3, 1 - (BALL_REST.y - ball.y) / 600)} ry={9} fill="rgba(0,0,0,0.3)" /> : null}
					{/* perception: light from the ball converges on the eye */}
					{seeP > 0 && f < K.command
						? [-0.6, 0, 0.6].map((o, i) => {
								const from = {x: BALL_REST.x + o * 40, y: BALL_REST.y + o * 30};
								const d = `M${from.x},${from.y} L${EYE_W.x},${EYE_W.y}`;
								const fade = 1 - prog(f, K.zoom + 6, K.zoom + 18);
								return <path key={i} d={d} stroke={INFO} strokeWidth={3} strokeDasharray="14 12" strokeDashoffset={-f * 3} opacity={0.75 * seeP * fade} />;
							})
						: null}
					<g transform={`translate(${FIG.x} ${FIG.y}) scale(${FIG.s} ${FIG.s * (0.3 + 0.7 * stand)})`}>
						<Figure a1={k.a1} a2={k.a2} lean={k.lean} arm={k.arm} xray={Math.min(1, xray)} brainGlow={Math.min(1, brainGlow)} eyeGlow={prog(f, K.see + 8, K.see + 16) * (1 - prog(f, K.packet + 6, K.packet + 16)) + (rpIn > 0 && rpIn < 1 ? 1 : 0)} pupil={lookBall} legGlow={Math.min(1, legGlow)} brainHidden={f >= DETACH} />
					</g>
					{/* image of the ball travelling into the eye */}
					{seeP > 0 && seeP < 1 ? (
						<g transform={`translate(${BALL_REST.x + (EYE_W.x - BALL_REST.x) * seeP} ${BALL_REST.y + (EYE_W.y - BALL_REST.y) * seeP}) scale(${0.32 - 0.22 * seeP})`}>
							<circle r={70} fill={INFO} opacity={0.5} filter="url(#glow)" />
							<Ball r={62} />
						</g>
					) : null}
					{/* eye → brain information signal (white) carrying the picture */}
					<Pulse pts={P_EYE_BRAIN} t={pkt} color={INFO} r={5}>
						<g transform="scale(0.1)">
							<Ball r={62} />
						</g>
					</Pulse>
					<Pulse pts={P_EYE_BRAIN} t={rpIn} color={INFO} r={6} />
					{/* brain → leg command signal (yellow) */}
					<Pulse pts={P_CMD} t={cmd} color={ACT} r={12} tail={0.1} />
					<Pulse pts={P_CMD} t={rpOut} color={ACT} r={10} tail={0.1} />
					{/* the ball */}
					{ball.o > 0 && ball.x > -200 ? (
						<g transform={`translate(${ball.x} ${ball.y})`}>
							{f >= K.contact
								? [1, 2, 3].map((i) => {
										const t = f - K.contact;
										const q = Math.max(0, t - i * 1.2);
										return <circle key={i} cx={-44 * q + 44 * t} cy={-30 * q + 0.9 * q * q - (-30 * t + 0.9 * t * t)} r={BALL_R * (1 - i * 0.18)} fill={C.paperWhite} opacity={0.22 / i} />;
									})
								: null}
							<Ball r={BALL_R} rot={ball.rot} />
						</g>
					) : null}
					{/* impact burst */}
					{f >= K.contact && f < K.contact + 9
						? Array.from({length: 9}).map((_, i) => {
								const a = (i / 9) * Math.PI * 2;
								const c = {x: BALL_REST.x + 30, y: BALL_REST.y};
								const r0 = 40 + (f - K.contact) * 10;
								return <line key={i} x1={c.x + Math.cos(a) * r0} y1={c.y + Math.sin(a) * r0} x2={c.x + Math.cos(a) * (r0 + 34)} y2={c.y + Math.sin(a) * (r0 + 34)} stroke={ACT} strokeWidth={8} strokeLinecap="round" opacity={1 - (f - K.contact) / 9} />;
							})
						: null}
					{/* analysis brackets around the recognised object inside the brain */}
					{f >= K.analyse && f < K.command + 6 ? (
						<g transform={`translate(${BRAIN_W.x} ${BRAIN_W.y})`} opacity={1 - prog(f, K.command, K.command + 6)}>
							{[0, 1, 2, 3].map((i) => {
								const sx = i % 2 ? 1 : -1;
								const sy = i < 2 ? -1 : 1;
								const r = 30 - 10 * prog(f, K.analyse, K.analyse + 10, EASE.out);
								return <path key={i} d={`M${sx * r},${sy * (r - 9)} L${sx * r},${sy * r} L${sx * (r - 9)},${sy * r}`} fill="none" stroke={f >= K.known ? ACT : INFO} strokeWidth={2.6} strokeLinecap="round" />;
							})}
							<g transform={`scale(${0.12 * pop(f, K.analyse - 2)})`}>
								<Ball r={62} />
							</g>
						</g>
					) : null}
				</g>
			</svg>
			{/* recognised: «كرة» */}
			{f >= K.known && f < K.command + 8 ? (
				<div style={{position: 'absolute', left: brainS.x - 200, width: 400, top: headTop.y - 150, display: 'flex', justifyContent: 'center', transform: `scale(${chipIn(f, K.known)})`, opacity: 1 - prog(f, K.command, K.command + 8)}}>
					<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 16, background: C.paperWhite, borderRadius: 50, padding: '10px 30px 12px 16px', filter: SHADOW.lifted}}>
						<div style={{width: 58, height: 58, borderRadius: '50%', background: C.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<Ico name="check" size={40} color={C.paperWhite} stroke={3} />
						</div>
						<span style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 52, color: C.charcoal}}>كرة</span>
					</div>
				</div>
			) : null}
			{/* decision: three possible actions, the brain picks one */}
			{f >= K.options && f < K.command + 14
				? ['اتركها', 'امسكها', 'شوّتها'].map((t, i) => {
						const p = chipIn(f, K.options + i * 4);
						const chosen = i === 2;
						const picked = f >= K.pick;
						const out = prog(f, K.command + 2, K.command + 12);
						const x = [840, 540, 240][i];
						return (
							<div key={i} style={{position: 'absolute', left: x - 140, width: 280, top: 1035, display: 'flex', justifyContent: 'center', transform: `scale(${(0.4 + 0.6 * p) * (picked && chosen ? 1.12 : 1)}) translateY(${picked && !chosen ? 22 : 0}px)`, opacity: Math.min(1, p * 2) * (picked && !chosen ? 0.35 : 1) * (1 - (chosen ? out * 0.0 : out))}}>
								<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 28px 14px', borderRadius: 44, background: picked && chosen ? C.yellow : 'rgba(14,18,26,0.9)', border: `4px solid ${picked && chosen ? C.yellow : 'rgba(251,248,241,0.4)'}`, filter: SHADOW.lifted}}>
									<span style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 44, color: picked && chosen ? C.charcoal : C.paperWhite, whiteSpace: 'nowrap'}}>{t}</span>
								</div>
							</div>
						);
					})
				: null}
			{/* «قرار» link from the brain to the chosen chip */}
			{f >= K.pick && f < K.command + 10 ? (
				<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}} opacity={1 - prog(f, K.command + 2, K.command + 10)}>
					<path d={`M${brainS.x},${brainS.y + 60} C${brainS.x},${brainS.y + 200} 240,${930} 240,${1030}`} fill="none" stroke={ACT} strokeWidth={6} strokeDasharray={`${prog(f, K.pick, K.pick + 8) * 900} 900`} strokeLinecap="round" />
				</svg>
			) : null}
			<TitleCard frame={f} at={K.stand + 2} out={K.see - 6} text="تخيّل حالك" size={50} seed={91} />
			{/* recap: perceive → decide → act, labelled on the body */}
			{f >= K.recap ? <Recap f={f} cam={cam} /> : null}
		</AbsoluteFill>
	);
};

const Recap: React.FC<{f: number; cam: Cam}> = ({f, cam}) => {
	const S = (p: Pt) => toScreen(cam, p.x, p.y);
	const lp = legPoints(0, 0);
	const items = [
		{at: K.r1, n: '١', title: 'العين', sub: 'جابت المعلومة', icon: 'eye' as const, col: INFO, anchor: S(EYE_W), y: 470},
		{at: K.r2, n: '٢', title: 'المخ', sub: 'حلّل وقرّر', icon: 'brain' as const, col: ACT, anchor: S(BRAIN_W), y: 700},
		{at: K.r3, n: '٣', title: 'الإجر', sub: 'نفّذت', icon: 'leg' as const, col: ACT, anchor: S(fw(lp.knee)), y: 1010},
	];
	return (
		<>
			<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
				{items.map((it, i) => {
					const d = prog(f, it.at, it.at + 10, EASE.io);
					if (d <= 0) return null;
					const x0 = 470;
					const y0 = it.y + 50;
					const x1 = x0 + (it.anchor.x - x0) * d;
					const y1 = y0 + (it.anchor.y - y0) * d;
					return (
						<g key={i}>
							<line x1={x0} y1={y0} x2={x1} y2={y1} stroke={it.col} strokeWidth={4} strokeDasharray="10 8" />
							<circle cx={it.anchor.x} cy={it.anchor.y} r={14 * d} fill="none" stroke={it.col} strokeWidth={5} />
						</g>
					);
				})}
			</svg>
			{items.map((it, i) => {
				const p = chipIn(f, it.at - 1);
				if (p <= 0) return null;
				return (
					<div key={i} dir="rtl" style={{position: 'absolute', left: 40, width: 440, top: it.y, display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-start', transform: `scale(${0.5 + 0.5 * p})`, transformOrigin: '100% 50%', opacity: Math.min(1, p * 2)}}>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: 'rgba(14,18,26,0.9)', border: `4px solid ${it.col}`, borderRadius: 22, padding: '10px 22px 12px', filter: SHADOW.lifted}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
								<NumBadge n={it.n} color={it.col} size={46} />
								<span style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 44, color: it.col, lineHeight: 1.2}}>{it.title}</span>
								<Ico name={it.icon} size={40} color={it.col} stroke={2.4} />
							</div>
							<span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 36, color: C.paperWhite, lineHeight: 1.3}}>{it.sub}</span>
						</div>
					</div>
				);
			})}
			<TitleCard frame={f} at={K.r1 - 2} text="تستقبل ← تقرّر ← تنفّذ" size={46} seed={93} />
		</>
	);
};
