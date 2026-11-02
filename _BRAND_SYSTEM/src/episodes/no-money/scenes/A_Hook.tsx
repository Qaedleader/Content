// Scene A + B — the money hook: a (fictional) banknote slams down, gets crossed out, greys out and tears.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, shake, slam} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {Backdrop} from '../../../brand/paper';
import {Banknote, G, SvgDefs} from '../../../brand/props';
import {C, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord} from '../../../brand/type';
import {wf, we} from '../ep';

const NOTE_W = 820;
const NOTE_H = NOTE_W * 0.47;

/** Two halves of the top banknote, separated along a zig-zag tear. */
const TornNote: React.FC<{split: number; gray: number; cross: number; rot: number}> = ({split, gray, cross, rot}) => {
	const zig = Array.from({length: 9})
		.map((_, i) => `${(i % 2 ? 26 : -26) + (i === 4 ? 10 : 0)},${-NOTE_H / 2 - 10 + (i * (NOTE_H + 20)) / 8}`)
		.join(' L');
	const leftClip = `M${-NOTE_W / 2 - 20},${-NOTE_H / 2 - 20} L${zig} L${-NOTE_W / 2 - 20},${NOTE_H / 2 + 20} Z`;
	const rightClip = `M${NOTE_W / 2 + 20},${-NOTE_H / 2 - 20} L${zig} L${NOTE_W / 2 + 20},${NOTE_H / 2 + 20} Z`;
	const body = (
		<>
			<Banknote w={NOTE_W} gray={gray} seed={3} />
			{/* marker cross-out over the value */}
			<path
				d={`M${NOTE_W / 2 - 330},${-70} L${NOTE_W / 2 - 50},${120}`}
				stroke={C.terracotta}
				strokeWidth={22}
				strokeLinecap="round"
				fill="none"
				strokeDasharray="400"
				strokeDashoffset={400 * (1 - Math.min(1, cross * 2))}
			/>
			<path
				d={`M${NOTE_W / 2 - 60},${-80} L${NOTE_W / 2 - 320},${125}`}
				stroke={C.terracotta}
				strokeWidth={22}
				strokeLinecap="round"
				fill="none"
				strokeDasharray="400"
				strokeDashoffset={400 * (1 - Math.max(0, cross * 2 - 1))}
			/>
		</>
	);
	if (split <= 0.001) return <g transform={`rotate(${rot})`} filter="url(#sh)">{body}</g>;
	return (
		<g transform={`rotate(${rot})`}>
			<clipPath id="tearL">
				<path d={leftClip} />
			</clipPath>
			<clipPath id="tearR">
				<path d={rightClip} />
			</clipPath>
			<g transform={`translate(${-split * 620} ${split * 260}) rotate(${-split * 28})`} filter="url(#sh)">
				<g clipPath="url(#tearL)">{body}</g>
			</g>
			<g transform={`translate(${split * 620} ${split * 320}) rotate(${split * 34})`} filter="url(#sh)">
				<g clipPath="url(#tearR)">{body}</g>
			</g>
		</g>
	);
};

export const HookScene: React.FC<{f: number}> = ({f}) => {
	// A: 0..81  |  B: 82..131
	const land = slam(f, 0);
	const noteY = kf(f, [0, 6], [-520, 860], EASE.in);
	const sq = f >= 6 ? 1 - 0.06 * Math.exp(-(f - 6) / 3) * Math.cos((f - 6) * 0.9) : 1;
	const sk = shake(f, 6, 16, 12);
	const fan2 = pop(f, wf(1) - 2, {damping: 14});
	const fan3 = pop(f, wf(1) + 4, {damping: 14});
	const cross = prog(f, wf(4), wf(5) + 6, EASE.out);
	const gray = prog(f, wf(6), we(7), EASE.io);
	const split = prog(f, 74, 98, EASE.in);
	const hero = slam(f, wf(3) - 1);
	const heroOut = prog(f, 80, 88, EASE.in);
	const arrow = pop(f, wf(7) - 2);
	const push = kf(f, [0, 81], [1.0, 1.07], EASE.linear);
	const inB = f >= 82;
	// B elements
	const bar = prog(f, wf(8), we(10), EASE.linear);
	const why = slam(f, wf(11) - 1);
	const barIn = pop(f, 84);

	return (
		<AbsoluteFill>
			{inB ? <Backdrop color={C.paper} pattern="dots" ink="rgba(38,35,33,0.07)" light={0.25} /> : <Backdrop color={C.navyDeep} pattern="none" floorY={1250} floorColor={C.kraft} light={0.22} />}
			<Camera x={sk.x} y={sk.y} scale={inB ? 1 : push}>
				{!inB ? (
					<Stage>
						<SvgDefs />
						{/* soft spotlight pool on the table */}
						<ellipse cx={540} cy={1250} rx={520} ry={70} fill="rgba(255,236,190,0.12)" filter="url(#softglow)" />
						<G x={540 - (1 - fan3) * 900 - 70} y={880 + 30} r={-14 + (1 - fan3) * -30} f="sh" o={fan3 > 0.01 ? 1 : 0}>
							<Banknote w={NOTE_W} gray={gray * 0.9} seed={9} value="100" />
						</G>
						<G x={540 + (1 - fan2) * 900 + 60} y={880 - 40} r={9 + (1 - fan2) * 30} f="sh" o={fan2 > 0.01 ? 1 : 0}>
							<Banknote w={NOTE_W} gray={gray * 0.9} seed={5} value="100" />
						</G>
						<G x={540} y={noteY + (f >= 6 ? 0 : 0)} sx={1 / sq} sy={sq}>
							<TornNote split={split} gray={gray} cross={cross} rot={-4 + (1 - Math.min(1, land)) * -10} />
						</G>
						{/* value-down arrow */}
						{arrow > 0 ? (
							<G x={900} y={560} s={arrow} r={8} f="sh">
								<path d="M-38,-120 L38,-120 L38,10 L80,10 L0,110 L-80,10 L-38,10 Z" fill={C.terracotta} stroke="rgba(30,20,10,0.25)" strokeWidth={2} />
							</G>
						) : null}
					</Stage>
				) : null}
				{/* hero word «المصاري» */}
				{!inB && f >= wf(3) - 1 ? (
					<div style={{position: 'absolute', left: 0, width: 1080, top: 300, display: 'flex', justifyContent: 'center', transform: `scale(${2.2 - 1.2 * hero}) rotate(${-3 + (1 - hero) * 8}deg) translateY(${heroOut * -700}px)`, opacity: Math.min(1, hero * 4)}}>
						<HeroWord text="المصاري" size={250} face={C.yellow} back={C.charcoal} depth={11} />
					</div>
				) : null}
			</Camera>
			{!inB && f >= wf(4) ? (
				<div style={{position: 'absolute', left: 60, top: 168, transform: `scale(${pop(f, wf(4))})`, transformOrigin: 'left center'}}>
					<Badge text="سيناريو مستقبلي افتراضي — ورقة نقدية رمزية" color={C.yellow} bg="rgba(20,30,45,0.88)" size={24} />
				</div>
			) : null}
			{inB ? (
				<>
					<Stage>
						<SvgDefs />
						<G x={540} y={860}>
							<TornNote split={Math.min(1.6, split)} gray={1} cross={1} rot={-4} />
						</G>
					</Stage>
					{/* "watch the video" progress strip */}
					<div style={{position: 'absolute', left: 120, top: 1020, width: 840, height: 120, transform: `translateY(${(1 - barIn) * 400}px) rotate(-1.5deg)`, filter: SHADOW.contact}}>
						<div style={{position: 'absolute', inset: 0, background: C.charcoal, borderRadius: 18}} />
						<div style={{position: 'absolute', right: 32, top: 26, width: 0, height: 0, borderTop: '34px solid transparent', borderBottom: '34px solid transparent', borderRight: `56px solid ${C.yellow}`}} />
						<div style={{position: 'absolute', left: 36, right: 120, top: 52, height: 18, background: 'rgba(255,255,255,0.18)', borderRadius: 9}} />
						<div style={{position: 'absolute', right: 120, top: 52, height: 18, width: `${bar * (840 - 156)}px`, background: C.yellow, borderRadius: 9}} />
					</div>
					{f >= wf(11) - 1 ? (
						<div style={{position: 'absolute', left: 0, width: 1080, top: 420, display: 'flex', justifyContent: 'center', transform: `scale(${2.4 - 1.4 * why}) rotate(${4 - 6 * why}deg)`}}>
							<HeroWord text="ليش؟" size={330} face={C.charcoal} back={C.yellow} depth={14} />
						</div>
					) : null}
				</>
			) : null}
		</AbsoluteFill>
	);
};
