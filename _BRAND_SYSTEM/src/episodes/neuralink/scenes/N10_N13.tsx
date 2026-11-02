// N10 «طب هسّا، الجد: وين وصلنا فعلياً؟ شركة نيورالينك تبعت إيلون ماسك قدرت تخلّي أشخاص يتحكّموا بالكمبيوتر بإشارات مخّهم»
// N11 «يعني صرنا نقدر نتحكّم بأشياء على الكمبيوتر بمجرّد التفكير، وهذا إشي حقيقي وصار فعلاً»
// N12 «أمّا حفظ ذكرياتك كلها، فهذا المستقبل اللي بحكي عنه. بس أهم إشي: لا تنسى تدفع الاشتراك للكلاود، بلاش تتعبّى الميموري»
// N13 «وهذا تاني فيديو إلي، تابعني لأنك رح تسمع أشياء مش رح تسمعها بمكان تاني»
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, shake, slam} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {FootagePrint, PaperScreen, PhotoPrint} from '../../../brand/media';
import {Backdrop, TEX} from '../../../brand/paper';
import {FlowPath, G, SvgDefs} from '../../../brand/props';
import {ChessMonitor, Implant, PaperBrain, PaperCloud, Pin} from '../../../brand/science';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../ep';

const Stamp: React.FC<{text: string; p: number; color?: string; rot?: number; size?: number}> = ({text, p, color = C.teal, rot = -8, size = 64}) => (
	<div style={{transform: `scale(${2 - p}) rotate(${rot}deg)`, opacity: Math.min(1, p * 2)}}>
		<div dir="rtl" style={{padding: '6px 26px', border: `7px solid ${color}`, borderRadius: 12, fontFamily: FONT.display, fontWeight: 900, fontSize: size, color, background: 'rgba(251,248,241,0.88)', whiteSpace: 'nowrap'}}>
			{text}
		</div>
	</div>
);

export const RealityScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.N10;
	const board = wf(127) - 3;
	const tear = prog(f, a, a + 14, EASE.in);
	const strings = prog(f, wf(132), wf(135) + 6, EASE.io);
	const chess = pop(f, wf(135) - 3, {damping: 14});
	const cur = {x: kf(f, [wf(135), wf(137), wf(138) + 6], [-160, 40, 70], EASE.io), y: kf(f, [wf(135), wf(137), wf(138) + 6], [90, -40, -70], EASE.io)};
	const moved = prog(f, wf(137) + 4, wf(138) + 8, EASE.io);
	const sig = prog(f, wf(136), wf(137) + 4, EASE.io);
	return (
		<AbsoluteFill>
			{f < board ? (
				<AbsoluteFill>
					<Backdrop color={C.navy} pattern="dots" ink="rgba(255,255,255,0.05)" light={0.2} />
					{/* the speculative badge is torn off */}
					<div style={{position: 'absolute', left: 300, top: 640, transform: `translateY(${tear * 900}px) rotate(${-4 + tear * 50}deg)`, opacity: 1 - tear}}>
						<Badge text="تصوّر مستقبلي" size={56} color={C.yellow} bg="rgba(20,30,45,0.95)" />
					</div>
					<div style={{position: 'absolute', left: 0, width: 1080, top: 720, display: 'flex', justifyContent: 'center'}}>
						{f >= wf(123) - 1 ? <Stamp text="الواقع" p={slam(f, wf(123) - 1)} size={110} /> : null}
					</div>
				</AbsoluteFill>
			) : (
				<AbsoluteFill>
					{/* cork / kraft evidence board */}
					<Backdrop color={C.kraft} pattern="none" light={0.22} />
					<AbsoluteFill style={{backgroundImage: `url(${TEX.kraft()})`, backgroundSize: '600px', mixBlendMode: 'multiply', opacity: 0.6}} />
					<PhotoPrint
						src="episodes/neuralink/media/nl_unveiling.jpg"
						x={60}
						y={350}
						w={380}
						h={400}
						rot={-3}
						frame={f}
						at={board + 1}
						seed={101}
						tape={false}
						kb={{from: 1.04, to: 1.1}}
						credit={{kind: 'إطلاق نيورالينك ٢٠١٩', text: 'Steve Jurvetson · CC BY 2.0'}}
					/>
					<PhotoPrint
						src="episodes/neuralink/media/nl_musk_future.jpg"
						x={470}
						y={330}
						w={560}
						h={380}
						rot={2}
						frame={f}
						at={wf(130) - 2}
						seed={102}
						tape={false}
						kb={{from: 1.04, to: 1.12, x0: 2, x1: -2}}
						credit={{kind: 'صورة حقيقية · ماسك وروبوت نيورالينك ٢٠٢٠', text: 'Steve Jurvetson · CC BY 2.0'}}
					/>
					<PhotoPrint
						src="episodes/neuralink/media/nl_noland.jpg"
						x={70}
						y={810}
						w={330}
						h={400}
						rot={-1.5}
						frame={f}
						at={wf(132) - 2}
						seed={103}
						tape={false}
						credit={{kind: 'نولاند أربو · أول مريض ٢٠٢٤', text: 'ClownChess · CC BY 3.0'}}
					/>
					<Stage>
						<SvgDefs />
						{/* red strings between pins */}
						<path d="M250,365 Q500,420 750,345" fill="none" stroke={C.terracotta} strokeWidth={4} strokeDasharray="900" strokeDashoffset={900 * (1 - prog(f, wf(130), wf(131) + 6))} />
						<path d="M240,825 Q300,600 250,365" fill="none" stroke={C.terracotta} strokeWidth={4} strokeDasharray="700" strokeDashoffset={700 * (1 - strings)} />
						<G x={250} y={365}>
							<Pin />
						</G>
						{f >= wf(130) - 2 ? (
							<G x={750} y={345}>
								<Pin />
							</G>
						) : null}
						{f >= wf(132) - 2 ? (
							<G x={240} y={825}>
								<Pin />
							</G>
						) : null}
						{/* brain signals → computer: chess played by thinking */}
						{chess > 0 ? (
							<>
								<FlowPath d="M400,980 Q520,1040 560,980" draw={sig} frame={f} width={8} glow />
								<G x={760} y={960} s={0.62 * chess} r={2}>
									<ChessMonitor w={560} cursor={cur} moved={moved} />
								</G>
							</>
						) : null}
					</Stage>
					{chess > 0 ? (
						<div style={{position: 'absolute', left: 560, top: 1170, transform: `scale(${pop(f, wf(136))}) rotate(-2deg)`}}>
							<Label text="شطرنج بالتفكير · ٢٠٢٤" size={30} bg={C.yellow} />
						</div>
					) : null}
				</AbsoluteFill>
			)}
			<TitleCard frame={f} at={wf(124) - 1} out={board - 3} text="وين وصلنا فعلياً؟" />
			<TitleCard frame={f} at={board} text="نيورالينك · إيلون ماسك" seed={31} />
		</AbsoluteFill>
	);
};

export const DemoScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.N11;
	const full = wf(146) - 3;
	const arrows = prog(f, wf(143), wf(144) + 6, EASE.out);
	const real = slam(f, wf(150) - 2);
	const isFull = f >= full;
	return (
		<AbsoluteFill>
			<Backdrop color={C.charcoal} pattern="dots" ink="rgba(255,255,255,0.04)" light={0.2} />
			{!isFull ? (
				<>
					<PaperScreen x={40} y={380} w={1000} h={760} frame={f} at={a + 1} src="episodes/neuralink/media/v_bci_arm.mp4" kind="tv" trim={0} body={C.kraft} credit={{kind: 'تجربة حقيقية · جامعة بيتسبرغ ٢٠١١ — مش نيورالينك', text: 'Wang, Collinger et al. · PLoS ONE · CC BY 2.5'}} />
					<Stage>
						<SvgDefs />
						{arrows > 0 ? (
							<>
								<FlowPath d="M200,1230 Q380,1080 580,830" draw={arrows} frame={f} width={10} />
								<G x={640} y={780}>
									<circle r={96} fill="none" stroke={C.yellow} strokeWidth={8} strokeDasharray="12 10" strokeDashoffset={-f * 2} />
								</G>
							</>
						) : null}
					</Stage>
					{arrows > 0 ? (
						<div style={{position: 'absolute', left: 60, top: 1180, transform: `scale(${arrows}) rotate(-2deg)`, transformOrigin: 'left center'}}>
							<Label text="ذراع آلية بإشارات الدماغ" size={34} bg={C.yellow} />
						</div>
					) : null}
				</>
			) : (
				<>
					{/* fullscreen evidence */}
					<FootagePrint
						src="episodes/neuralink/media/v_bci_highfive.mp4"
						x={24}
						y={300}
						w={1032}
						h={980}
						rot={0}
						frame={f}
						at={full}
						seed={111}
						enter="pop"
						tape={false}
						trim={1.2}
						objectPosition="38% 50%"
						kb={{from: 1.0, to: 1.08}}
						kbDur={90}
						credit={{kind: 'لقطات حقيقية · تجربة جامعة بيتسبرغ', text: 'Wang, Collinger et al. · PLoS ONE · CC BY 2.5'}}
					/>
					<Stage>
						<SvgDefs />
						<G x={480} y={600}>
							<circle r={110} fill="none" stroke={C.yellow} strokeWidth={10} strokeDasharray={`${700 * prog(f, full + 10, full + 22)} 900`} transform="rotate(-90)" />
						</G>
					</Stage>
					{f >= full + 12 ? (
						<div style={{position: 'absolute', left: 560, top: 400, transform: `scale(${pop(f, full + 12)}) rotate(3deg)`}}>
							<Label text="كفّ… بالتفكير" size={40} bg={C.yellow} />
						</div>
					) : null}
					{real > 0 ? (
						<div style={{position: 'absolute', left: 0, width: 1080, top: 1040, display: 'flex', justifyContent: 'center'}}>
							<Stamp text="حقيقي ✓" p={real} size={96} />
						</div>
					) : null}
				</>
			)}
			<TitleCard frame={f} at={a + 1} out={full - 4} text="صرنا نقدر نتحكّم" />
			<TitleCard frame={f} at={full} text="وصار فعلاً" seed={35} />
		</AbsoluteFill>
	);
};

export const FutureJokeScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.N12;
	const joke = wf(162) - 2;
	const bill = pop(f, wf(167) - 2, {damping: 13});
	const due = slam(f, wf(169) - 2);
	const mem = prog(f, wf(170) - 2, wf(172) + 4, EASE.io);
	const warn = pop(f, wf(172) - 2);
	const sk = shake(f, wf(172), 8, 14);
	const isJoke = f >= joke;
	return (
		<AbsoluteFill>
			<Backdrop color={isJoke ? C.paper : C.navyDeep} pattern={isJoke ? 'grid' : 'dots'} ink={isJoke ? 'rgba(38,35,33,0.05)' : 'rgba(255,255,255,0.05)'} light={0.25} />
			<Camera x={sk.x} y={sk.y}>
				<Stage>
					<SvgDefs />
					{!isJoke ? (
						<G x={540} y={820} s={1.05}>
							<PaperBrain mode="outline" frame={f} id="n12" />
							{Array.from({length: 10}).map((_, k) => (
								<rect key={k} x={-250 + (k % 5) * 110} y={-150 + Math.floor(k / 5) * 140} width={90} height={64} rx={6} fill="none" stroke={C.paper} strokeWidth={3} strokeDasharray="8 6" opacity={0.6} />
							))}
						</G>
					) : (
						<>
							<G x={540} y={560} s={0.95}>
								<PaperCloud />
							</G>
							{bill > 0 ? (
								<G x={540} y={760 + (1 - bill) * -200} r={-3} f="sh">
									<line x1={0} y1={-130} x2={0} y2={-60} stroke={C.charcoal} strokeWidth={3} />
									<rect x={-180} y={-60} width={360} height={260} rx={8} fill={C.paperWhite} />
									<text x={150} y={-10} textAnchor="end" fontFamily={FONT.display} fontWeight={900} fontSize={34} fill={C.charcoal}>
										فاتورة الكلاود
									</text>
									{['ذكريات · ٢٠٢٦–٢٠٣٣', 'نسخة احتياطية', 'اشتراك شهري'].map((t, i) => (
										<text key={t} x={150} y={45 + i * 44} textAnchor="end" fontFamily={FONT.label} fontWeight={700} fontSize={26} fill={C.charcoalSoft}>
											{t}
										</text>
									))}
								</G>
							) : null}
						</>
					)}
				</Stage>
				{!isJoke && f >= wf(157) - 1 ? (
					<div style={{position: 'absolute', left: 0, width: 1080, top: 1090, display: 'flex', justifyContent: 'center'}}>
						<Stamp text="المستقبل" p={slam(f, wf(158) - 2)} color={C.yellow} size={80} />
					</div>
				) : null}
				{due > 0 && mem < 0.05 ? (
					<div style={{position: 'absolute', left: 620, top: 860}}>
						<Stamp text="مستحقّة!" p={due} color={C.terracotta} rot={-12} size={52} />
					</div>
				) : null}
				{mem > 0 ? (
					<div dir="rtl" style={{position: 'absolute', left: 140, top: 1000, width: 800, filter: SHADOW.lifted}}>
						<div style={{background: C.charcoal, borderRadius: 18, padding: '22px 28px'}}>
							<div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT.display, fontWeight: 800, fontSize: 32, color: C.paper}}>
								<span>الميموري</span>
								<span dir="ltr">{Math.round(mem * 99)}%</span>
							</div>
							<div style={{marginTop: 14, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.15)', position: 'relative', overflow: 'hidden'}}>
								<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${mem * 99}%`, background: mem > 0.85 ? C.terracotta : C.yellow}} />
							</div>
						</div>
					</div>
				) : null}
				{warn > 0 ? (
					<div style={{position: 'absolute', left: 0, width: 1080, top: 760, display: 'flex', justifyContent: 'center', transform: `scale(${warn}) rotate(-2deg)`}}>
						<div dir="rtl" style={{background: C.paperWhite, border: `6px solid ${C.terracotta}`, borderRadius: 18, padding: '18px 34px', fontFamily: FONT.display, fontWeight: 900, fontSize: 52, color: C.terracotta, filter: SHADOW.lifted}}>
							⚠ الذاكرة ممتلئة!
						</div>
					</div>
				) : null}
			</Camera>
			<TitleCard frame={f} at={a + 1} out={joke - 4} text="حفظ كل ذكرياتك" />
			<TitleCard frame={f} at={joke} text="أهم إشي: لا تنسى!" seed={41} />
		</AbsoluteFill>
	);
};

export const OutroScene: React.FC<{f: number}> = ({f}) => {
	const [a, b] = S.N13;
	const cards = pop(f, a + 1, {damping: 14});
	const two = pop(f, wf(174) - 1);
	const follow = slam(f, wf(177) - 2);
	const fin = prog(f, wf(178), wf(179) + 4, EASE.io);
	const close = (k: number) => Math.max(0, 0.7 - prog(f, wf(181) + (k % 8), wf(184) + (k % 8)) * 0.7) * (k % 3 === 0 ? 1 : 0.4);
	const settle = kf(f, [wf(178), b], [1.0, 1.05], EASE.out);
	const glowP = prog(f, wf(184), wf(186) + 6);
	return (
		<AbsoluteFill>
			<Backdrop color={C.navyDeep} pattern="dots" ink="rgba(255,255,255,0.05)" light={0.3} />
			<Camera scale={settle}>
				<Stage>
					<SvgDefs />
					{fin < 1 ? (
						<g opacity={1 - fin}>
							{[0, 1].map((k) => (
								<G key={k} x={540 + (k ? 150 : -150)} y={820 + (k ? 0 : 30)} r={k ? 4 : -6} s={cards * (k && two > 0 ? 1 + 0.12 * two : 1)} f="shl">
									<rect x={-170} y={-230} width={340} height={460} rx={18} fill={k && two > 0 ? C.yellow : C.paperShade} />
									<text x={0} y={60} textAnchor="middle" fontFamily={FONT.display} fontWeight={900} fontSize={220} fill={C.charcoal} opacity={k ? 1 : 0.5}>
										{k ? '٢' : '١'}
									</text>
									<text x={0} y={170} textAnchor="middle" fontFamily={FONT.display} fontWeight={800} fontSize={34} fill={C.charcoal} opacity={k ? 1 : 0.5}>
										فيديو
									</text>
								</G>
							))}
						</g>
					) : null}
					{fin > 0 ? (
						<G x={540} y={820} s={0.95 * fin}>
							<circle cx={-70} cy={-232} r={110 + glowP * 40} fill={C.yellow} opacity={0.25 + glowP * 0.25} filter="url(#softglow)" />
							<PaperBrain mode="cabinet" id="n13" drawerOpen={close} />
							<G x={-70} y={-232} s={0.6}>
								<Implant r={60} threads={0} />
							</G>
						</G>
					) : null}
				</Stage>
				{follow > 0 ? (
					<div style={{position: 'absolute', left: 0, width: 1080, top: fin > 0 ? 1100 : 420, display: 'flex', justifyContent: 'center', transform: `scale(${2 - follow}) rotate(-2deg)`}}>
						<HeroWord text="تابعني" size={180} face={C.charcoal} back={C.yellowShade} strip={C.yellow} stripSeed={12} depth={8} />
					</div>
				) : null}
			</Camera>
			<TitleCard frame={f} at={a + 1} out={wf(177) - 4} text="هذا تاني فيديو إلي" />
		</AbsoluteFill>
	);
};

export {Label};
