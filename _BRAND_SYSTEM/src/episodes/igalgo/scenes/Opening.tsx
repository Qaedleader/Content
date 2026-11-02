// 0 – 5.6 s · «هل الإنستغرام فعلياً بقرأ أفكارك؟ وكيف ممكن يعرف إنت شو بدك بكرا قبل ما إنت نفسك تفكر فيه؟»
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {HeroWord} from '../../../brand/type';
import track from '../data/phone_track.json';
import {M, W, wf} from '../ep';
import {PixelRow, Shot} from '../../asml/kit';
import {CR} from '../credits';
import {ReelCard} from '../ui';

const TR = (track as {frames: {x: number; y: number; w: number; h: number; a: number}[]}).frames;
const FEED = [
	{src: 't_fruit.jpg', handle: '@market.days', cap: 'سوق الصبح'},
	{src: 't_runner.jpg', handle: '@run.city', cap: 'جري قبل الغروب'},
	{src: 't_roofs.jpg', handle: '@paris.roofs', cap: 'أسطح باريس'},
	{src: 't_lib.jpg', handle: '@study.with.me', cap: 'ساعة دراسة'},
];

/** Real hands (keyed green-screen clip) scrolling an illustrative feed that is tracked onto the phone screen. */
const PhoneScroll: React.FC<{f: number; end: number}> = ({f, end}) => {
	const k = Math.min(TR.length - 1, Math.max(0, f));
	const t = TR[k];
	const sw = t.w * 0.955;
	const sh = t.h * 0.975;
	// finger swipe ≈ frames 5–31 → feed travels two items, then holds (the freeze lands on «بقرأ»)
	const s = kf(f, [0, 4, 31, end], [0.05, 0.1, 2, 2], EASE.io);
	return (
		<>
			<div style={{position: 'absolute', left: t.x - t.w / 2 - 4, top: t.y - t.h / 2 - 4, width: t.w + 8, height: t.h + 8, transform: `rotate(${t.a}deg)`, background: '#050608', borderRadius: 34}} />
			<div style={{position: 'absolute', left: t.x - sw / 2, top: t.y - sh / 2, width: sw, height: sh, transform: `rotate(${t.a}deg)`, borderRadius: 30, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${-s * sh}px)`}}>
					{FEED.map((it, i) => (
						<div key={i} style={{width: sw, height: sh}}>
							<ReelCard f={f} src={M(it.src)} w={sw} h={sh} handle={it.handle} caption={it.cap} progress={i < 2 ? 1 : 0.2} radius={0} />
						</div>
					))}
				</div>
			</div>
			<Img src={staticFile(`episodes/igalgo/phone/${String(k).padStart(3, '0')}.png`)} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}} />
		</>
	);
};

/** Tear-off calendar page: «اليوم» flips away to reveal «بكرا». */
const Calendar: React.FC<{f: number; at: number}> = ({f, at}) => {
	const enter = pop(f, at - 7, {damping: 13, stiffness: 220, mass: 0.7});
	const flip = prog(f, at - 1, at + 6, EASE.in);
	const hit = slam(f, at + 4);
	const Page: React.FC<{word: string; sub: string; hot?: boolean}> = ({word, sub, hot}) => (
		<div style={{position: 'absolute', inset: 0, borderRadius: 14, overflow: 'hidden', background: C.paperWhite, filter: SHADOW.lifted}}>
			<div style={{height: 92, background: hot ? C.yellow : C.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 120}}>
				{[0, 1].map((i) => (
					<div key={i} style={{width: 26, height: 26, borderRadius: '50%', background: hot ? C.charcoal : C.paper}} />
				))}
			</div>
			<div dir="rtl" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 30}}>
				<span style={{fontFamily: FONT.hero, fontSize: 170, lineHeight: 1.05, color: hot ? C.charcoal : C.steelDark}}>{word}</span>
				<span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 34, color: C.charcoalSoft, marginTop: 6}}>{sub}</span>
			</div>
		</div>
	);
	return (
		<div style={{position: 'absolute', left: 540 - 210, top: 300, width: 420, height: 420, transform: `scale(${(0.6 + 0.4 * enter) * (1 + 0.05 * (1 - hit) * (f >= at + 4 ? 1 : 0))}) rotate(${-3 + (1 - enter) * 10}deg)`, opacity: Math.min(1, enter * 2), perspective: 900}}>
			<Page word="بكرا" sub="قبل ما تفكّر فيه" hot />
			{flip < 1 ? (
				<div style={{position: 'absolute', inset: 0, transformOrigin: '50% 0%', transform: `rotateX(${flip * 110}deg)`, opacity: 1 - flip * 0.6}}>
					<Page word="اليوم" sub="الليلة" />
				</div>
			) : null}
		</div>
	);
};

export const Opening: React.FC<{f: number; end: number}> = ({f, end}) => {
	const freeze = wf(W.yaqra); // «بقرأ» → scroll stops, cut to the eye
	const bukra = wf(W.bukra1);
	if (f > end) return null;
	// iris position in the eye crop (scaled by the Shot's push-in around frame centre)
	const s = 1.06 + 0.16 * prog(f, freeze, end, EASE.linear);
	const ix = 540 + (522 - 540) * s;
	const iy = 960 + (1000 - 960) * s;
	const scan = prog(f, wf(W.wkeef) - 2, wf(W.wkeef) + 10);
	const scanOut = 1 - prog(f, bukra - 8, bukra);
	return (
		<>
			{f < freeze ? (
				<AbsoluteFill style={{background: C.navyDeep}}>
					<Shot f={f} a={0} b={freeze - 1} src={M('o_bg.mp4')} move={{s0: 1.15, s1: 1.2}} grade="blur(14px) brightness(0.42) saturate(0.8)" />
					<PhoneScroll f={f} end={freeze} />
				</AbsoluteFill>
			) : null}
			<Shot f={f} a={freeze} b={end} src={M('o_eye.mp4')} credit={CR.mixkit} kind="لقطات حقيقية" move={{s0: 1.06, s1: 1.22}} grade="contrast(1.12) saturate(0.85) brightness(0.92)" dim={f >= bukra - 6 ? 0.3 * prog(f, bukra - 6, bukra + 4) : 0} />
			{/* «بقرأ أفكارك؟!» */}
			{f >= freeze && f < bukra - 4 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, transform: `scale(${0.55 + 0.45 * slam(f, freeze)}) translateY(${-60 * prog(f, wf(W.wkeef), wf(W.wkeef) + 10)}px)`, opacity: 1 - prog(f, bukra - 10, bukra - 4)}}>
					<HeroWord text="بقرأ أفكارك؟!" size={150} strip={C.charcoal} />
					<div style={{opacity: prog(f, freeze + 8, freeze + 14)}}>
						<PixelRow n={7} lit={Math.min(7, Math.max(0, Math.floor((f - freeze - 8) / 2)))} size={16} gap={8} />
					</div>
				</div>
			) : null}
			{/* reading rings around the iris («وكيف ممكن يعرف…») */}
			{f >= wf(W.wkeef) - 2 && f < bukra ? (
				<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: scan * scanOut}}>
					<circle cx={ix} cy={iy} r={150 * s} fill="none" stroke={C.yellow} strokeWidth={4} strokeDasharray="10 14" transform={`rotate(${f * 2.2} ${ix} ${iy})`} />
					<circle cx={ix} cy={iy} r={200 * s} fill="none" stroke="rgba(251,248,241,0.7)" strokeWidth={2} strokeDasharray={`${2 * Math.PI * 200 * s * scan} 9999`} transform={`rotate(-90 ${ix} ${iy})`} />
					{[0, 1, 2, 3].map((i) => {
						const a = (i * Math.PI) / 2 + f * 0.02;
						return <rect key={i} x={ix + Math.cos(a) * 232 * s - 7} y={iy + Math.sin(a) * 232 * s - 7} width={14} height={14} fill={C.yellow} />;
					})}
				</svg>
			) : null}
			{f >= bukra - 7 ? <Calendar f={f} at={bukra} /> : null}
		</>
	);
};
