// V3 · Shot 08 (frames 990–1081) «ونفس الإشي بالأكل والبيوت والملابس والدوا»
// FOUR PAGES: the production chain strip is "photocopied" four times, then each industry gets its own full-frame
// paper page, slid in on its spoken word, with real footage + a real photo + its own paper process:
// food (harvest → crates → delivery), housing (floors stack into a home), clothing (fabric ribbon → shirt),
// medicine (tablet press → blister filling).
// Locked cues: impacts f1010/1026/1041/1059 (one page each).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, pop, prog} from '../../../brand/anim';
import {Stage} from '../../../brand/diagram';
import {Backdrop, TEX} from '../../../brand/paper';
import {Crate, G, House, Icon, SvgDefs, Truck} from '../../../brand/props';
import {C, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, TitleCard} from '../../../brand/type';
import {S, wf} from '../../no-money/ep';
import {M1, M3, Token, Win} from '../kit';

const IMPACT = [wf(76) - 3, wf(77) - 3, wf(78) - 3, wf(79) - 3];

const Page: React.FC<{f: number; at: number; color: string; children: React.ReactNode}> = ({f, at, color, children}) => {
	const p = prog(f, at - 6, at, EASE.out);
	if (p <= 0) return null;
	return (
		<AbsoluteFill style={{transform: `translateX(${(1 - p) * 1150}px) rotate(${(1 - p) * 4}deg)`, filter: SHADOW.lifted}}>
			<AbsoluteFill style={{background: color}} />
			<AbsoluteFill style={{backgroundImage: `url(${TEX.fibers()})`, backgroundSize: '512px', opacity: 0.45}} />
			{children}
		</AbsoluteFill>
	);
};

const Hero: React.FC<{f: number; at: number; text: string; dark?: boolean}> = ({f, at, text, dark}) => {
	const p = pop(f, at + 1, {damping: 12});
	return (
		<div style={{position: 'absolute', left: 70, top: 850, transform: `scale(${p}) rotate(-3deg)`, transformOrigin: 'left center'}}>
			<HeroWord text={text} size={170} face={dark ? C.yellow : C.charcoal} back={dark ? C.charcoal : C.yellow} depth={9} />
		</div>
	);
};

export const FourPagesScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.H;
	const copies = prog(f, a + 3, wf(75) + 2, EASE.out);
	const [i0, i1, i2, i3] = IMPACT;
	return (
		<AbsoluteFill>
			{/* intro: the same chain, copied four times */}
			<Backdrop color={C.navy} pattern="dots" ink="rgba(255,255,255,0.05)" light={0.2} />
			<Stage>
				<SvgDefs />
				{[3, 2, 1, 0].map((k) => (
					<G key={k} x={540 + k * 14 * copies} y={560 + k * 190 * copies} r={k * -1.5 * copies} o={k === 0 ? 1 : copies} s={1.05}>
						<rect x={-460} y={-90} width={920} height={180} rx={14} fill={k === 0 ? C.paper : C.paperShade} filter="url(#sh)" />
						{(['ore', 'furnace', 'gear', 'robot', 'box'] as const).map((ic, j) => (
							<G key={ic} x={-360 + j * 180} y={0} s={pop(f, a + 1 + j * 2)}>
								<circle r={56} fill={j === 4 ? C.yellow : C.paperWhite} stroke="rgba(30,20,10,0.2)" strokeWidth={2} />
								<g transform="scale(0.5)">
									<Icon name={ic} />
								</g>
							</G>
						))}
						{[0, 1, 2, 3].map((j) => (
							<path key={j} d={`M${-300 + j * 180},0 L${-240 + j * 180},0`} stroke={C.yellow} strokeWidth={10} strokeLinecap="round" />
						))}
					</G>
				))}
			</Stage>
			<TitleCard frame={f} at={a + 1} text="ونفس الإشي بـ…" />

			{/* FOOD */}
			<Page f={f} at={i0} color={C.sage}>
				<Win src={M1('v_harvester.mp4')} x={70} y={260} w={940} h={540} rot={-1} f={f} at={i0 - 6} credit="Sillerkiil · CC0" kind="لقطات حقيقية · حصاد آلي" trim={1} seed={51} enter="none" />
				<Win src={M3('n_greenhouse.jpg')} x={600} y={690} w={390} h={290} rot={4} f={f} at={i0 - 6} credit="Giancarlo Dessì · CC BY-SA 3.0" kind="صورة حقيقية · زراعة مائية" seed={52} enter="none" />
				<Stage>
					<SvgDefs />
					<G x={150} y={1150} s={pop(f, i0 + 2)}>
						<Token icon="wheat" r={60} />
					</G>
					<path d="M220,1150 L300,1150" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" />
					{[0, 1, 2].map((k) => (
						<G key={k} x={360 + k * 70} y={1200 - (k === 1 ? 70 : 0)} s={pop(f, i0 + 4 + k)} f="shs">
							<Crate s={66} color={k === 1 ? C.yellow : C.kraft} />
						</G>
					))}
					<path d="M560,1150 L630,1150" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" />
					<G x={650 + prog(f, i0 + 6, i0 + 16) * 60} y={1215} s={0.42} f="sh">
						<Truck wheelRot={f * 8} cargo={<g transform="scale(1.4) translate(0 -2)"><Crate s={90} /></g>} />
					</G>
				</Stage>
				<div style={{position: 'absolute', left: 0, top: 0}}>
					<HeroCorner f={f} at={i0} text="أكل" />
				</div>
			</Page>

			{/* HOUSING */}
			<Page f={f} at={i1} color={C.paper}>
				<Win src={M3('n_cranes.jpg')} x={70} y={260} w={600} h={520} rot={-2} f={f} at={i1 - 6} credit="Tupungato · CC BY 3.0" kind="صورة حقيقية · موقع بناء" seed={53} enter="none" />
				<Win src={M1('v_3dhouse.mp4')} x={560} y={560} w={440} h={330} rot={3} f={f} at={i1 - 6} credit="Alfredo Milano / WASP · CC BY 2.0" kind="لقطات حقيقية · بيت مطبوع 3D" trim={0.5} seed={54} enter="none" />
				<Stage>
					<SvgDefs />
					{[0, 1, 2].map((k) => {
						const p = pop(f, i1 + 1 + k * 3, {damping: 13});
						return p > 0 ? (
							<G key={k} x={790} y={1220 - k * 70 - (1 - p) * 300} f="shs">
								<rect x={-150} y={-66} width={300} height={66} rx={4} fill={k % 2 ? C.paperShade : C.paperWhite} stroke="rgba(30,20,10,0.25)" strokeWidth={2} />
								{[0, 1, 2].map((w) => (
									<rect key={w} x={-120 + w * 90} y={-50} width={50} height={34} rx={3} fill={C.navyLight} />
								))}
							</G>
						) : null;
					})}
					{pop(f, i1 + 10) > 0 ? (
						<G x={790} y={1010 - (1 - pop(f, i1 + 10)) * 200} f="sh">
							<path d="M-180,0 L0,-110 L180,0 Z" fill={C.terracotta} stroke="rgba(30,20,10,0.3)" strokeWidth={2} />
						</G>
					) : null}
				</Stage>
				<HeroCorner f={f} at={i1} text="بيوت" />
			</Page>

			{/* CLOTHING */}
			<Page f={f} at={i2} color={C.navy}>
				<Win src={M3('n_knitting.jpg')} x={70} y={260} w={620} h={470} rot={-1.5} f={f} at={i2 - 6} credit="Mary Mark Ockerbloom · CC BY-SA 3.0" kind="صورة حقيقية · آلة حياكة دائرية" seed={55} enter="none" />
				<Win src={M1('v_looms.mp4')} x={560} y={600} w={440} h={300} rot={2.5} f={f} at={i2 - 6} credit="Victuallers · CC BY-SA 3.0" kind="لقطات حقيقية · أنوال نسيج" trim={0.5} seed={56} enter="none" />
				<Stage>
					<SvgDefs />
					{(() => {
						const r = prog(f, i2, i2 + 12, EASE.io);
						const d = 'M520,740 C520,900 700,880 720,980 S800,1110 860,1110';
						return (
							<g>
								<path d={d} fill="none" stroke={C.tealDark} strokeWidth={70} strokeLinecap="round" strokeDasharray="1100" strokeDashoffset={1100 * (1 - r)} transform="translate(0 6)" opacity={0.6} />
								<path d={d} fill="none" stroke={C.teal} strokeWidth={60} strokeLinecap="round" strokeDasharray="1100" strokeDashoffset={1100 * (1 - r)} />
								<path d={d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={4} strokeDasharray="10 12" strokeDashoffset={-f * 3} opacity={r} />
							</g>
						);
					})()}
					<G x={880} y={1120} s={1.3 * pop(f, i2 + 10)} f="sh">
						<Icon name="shirt" />
					</G>
				</Stage>
				<HeroCorner f={f} at={i2} text="ملابس" dark />
			</Page>

			{/* MEDICINE */}
			<Page f={f} at={i3} color={C.paperWhite}>
				<div style={{position: 'absolute', left: 0, right: 0, top: 840, height: 8, background: 'rgba(46,66,96,0.15)'}} />
				<Win src={M1('v_tablet_press.mp4')} x={70} y={250} w={940} h={560} rot={0.8} f={f} at={i3 - 6} credit="Robin Müller · CC BY-SA 3.0" kind="لقطات حقيقية · مكبس أقراص" seed={57} enter="none" />
				<Stage>
					<SvgDefs />
					<G x={740} y={1100} f="sh">
						<rect x={-230} y={-95} width={460} height={190} rx={22} fill="#DCE3E8" stroke="rgba(30,20,10,0.25)" strokeWidth={2} />
						{Array.from({length: 10}).map((_, k) => {
							const col = k % 5;
							const row = Math.floor(k / 5);
							const fill = f >= i3 + 2 + k * 1.4;
							return (
								<g key={k} transform={`translate(${-176 + col * 88} ${-40 + row * 80})`}>
									<ellipse rx={34} ry={26} fill="rgba(255,255,255,0.7)" stroke="rgba(30,20,10,0.2)" strokeWidth={2} />
									{fill ? <ellipse rx={26} ry={19} fill={k % 3 === 0 ? C.yellow : C.paperWhite} stroke="rgba(30,20,10,0.3)" strokeWidth={2} /> : null}
								</g>
							);
						})}
					</G>
				</Stage>
				<HeroCorner f={f} at={i3} text="دوا" />
			</Page>
			{f >= i0 + 4 ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 1268, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, i0 + 4)})`}}>
					<Badge text="لقطات من اليوم — الأتمتة الكاملة لسّا مش واقع" color={C.yellow} bg="rgba(20,30,45,0.92)" size={22} rot={0} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

const HeroCorner: React.FC<{f: number; at: number; text: string; dark?: boolean}> = (p) => <Hero {...p} />;
