// N1 Hook — «أقول لك كيف رح تبطّل تنسى أي إشي بحياتك؟»: the brain is a paper archive; memories fade and fall.
// N2 Implant — «أول إشي، رح نركّب شريحة صغيرة بمخّك ونوصّلها بالخلايا العصبية بخيوط أدقّ من الشعرة»
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, rand, shake, slam} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {PaperScreen, PhotoPrint} from '../../../brand/media';
import {Backdrop} from '../../../brand/paper';
import {FlowPath, G, SvgDefs} from '../../../brand/props';
import {CardPic, Implant, MemoryCard, Neuron, PaperBrain, Pin} from '../../../brand/science';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Badge, HeroWord, Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../ep';

const HOOK_CARDS: {pic: CardPic; x: number; y: number}[] = [
	{pic: 'key', x: -330, y: -330},
	{pic: 'cake', x: 300, y: -360},
	{pic: 'phone', x: -380, y: 40},
	{pic: 'house', x: 360, y: 10},
	{pic: 'music', x: -250, y: 360},
	{pic: 'tree', x: 280, y: 380},
];

/** Exported so the memory-retrieval scene can replay the opening inside a phone ("بهذا الفيديو"). */
export const HookScene: React.FC<{f: number; mini?: boolean}> = ({f, mini}) => {
	const inA = slam(f, 0);
	const sk = mini ? {x: 0, y: 0} : shake(f, 2, 12, 10);
	const fade = prog(f, wf(5) - 2, wf(5) + 12, EASE.io);
	const fall = prog(f, wf(6), wf(8) + 8, EASE.in);
	const hero = slam(f, wf(5) - 1);
	const q = pop(f, wf(8));
	const tease = pop(f, wf(7));
	const drawer = (k: number) => {
		const t = f - (k % 8) * 1.2 - Math.floor(k / 8) * 2;
		return t > 0 && t < 26 ? Math.max(0, Math.sin((t / 26) * Math.PI)) * 0.8 : 0;
	};
	return (
		<AbsoluteFill>
			<Backdrop color={C.navyDeep} pattern="dots" ink="rgba(255,255,255,0.05)" light={0.28} />
			<Camera x={sk.x} y={sk.y} scale={kf(f, [0, 75], [1.0, 1.07], EASE.linear)}>
				<Stage>
					<SvgDefs />
					<ellipse cx={540} cy={1240} rx={420} ry={50} fill="rgba(0,0,0,0.25)" filter="url(#softglow)" />
					<G x={540} y={880 - (1 - inA) * 900} s={1.18 * (0.8 + 0.2 * inA)}>
						<PaperBrain mode="cabinet" drawerOpen={drawer} id="hook" />
						{tease > 0 ? (
							<G x={-70} y={-232} s={0.55 * tease}>
								<circle r={90} fill={C.yellow} opacity={0.35 * (0.6 + 0.4 * Math.sin(f / 3))} filter="url(#softglow)" />
								<Implant r={60} threads={0} />
							</G>
						) : null}
					</G>
					{HOOK_CARDS.map((c, i) => {
						const p = pop(f, wf(2) - 2 + i * 3, {damping: 12});
						if (p <= 0) return null;
						const fx = 540 + c.x * p;
						const fy = 880 + c.y * p + fall * (700 + i * 80);
						return (
							<G key={i} x={fx} y={fy} r={(rand(i) - 0.5) * 24 + fall * (i % 2 ? 60 : -60)} s={1.15} f="sh" o={1 - fall * 0.7}>
								<MemoryCard pic={c.pic} faded={fade} seed={i} />
							</G>
						);
					})}
				</Stage>
				{f >= wf(5) - 1 ? (
					<div style={{position: 'absolute', left: 0, width: 1080, top: 250, display: 'flex', justifyContent: 'center', transform: `scale(${2 - hero}) rotate(${-3 + (1 - hero) * 8}deg)`, opacity: Math.min(1, hero * 3)}}>
						<HeroWord text={q > 0.5 ? 'تنسى؟' : 'تنسى'} size={230} face={C.paper} back={C.terracotta} depth={10} />
					</div>
				) : null}
			</Camera>
		</AbsoluteFill>
	);
};

export const ImplantScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.N2;
	// phase boundaries (word anchored)
	const p2 = wf(13) - 2; // «شريحة صغيرة بمخّك»
	const p3 = wf(16) - 2; // «ونوصّلها بالخلايا العصبية»
	const p4 = wf(19) - 2; // «بخيوط أدقّ من الشعرة»
	const drop = slam(f, wf(15) - 4);
	const reach = prog(f, p3 + 2, wf(18) + 4, EASE.io);
	const hairIn = pop(f, p4 + 2);
	const lens = pop(f, wf(20) - 2);
	return (
		<AbsoluteFill>
			{/* ---- phase 1: the real surgical robot on a research board ---- */}
			{f < p2 ? (
				<AbsoluteFill>
					<Backdrop color={C.kraft} pattern="none" light={0.2} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(60,40,20,0.25) 2px, transparent 2.5px)', backgroundSize: '26px 26px'}} />
					<PhotoPrint
						src="episodes/neuralink/media/nl_robot.jpg"
						x={80}
						y={340}
						w={540}
						h={720}
						rot={-2.5}
						frame={f}
						at={a + 1}
						seed={3}
						kb={{from: 1.05, to: 1.16, y0: 2, y1: -2}}
						kbDur={45}
						credit={{kind: 'صورة حقيقية · روبوت الزرع · نيورالينك ٢٠٢٠', text: 'Leijurv · CC BY-SA 4.0'}}
					/>
					<Stage>
						<SvgDefs />
						<FlowPath d="M600,640 Q760,600 820,820" draw={prog(f, wf(12) - 4, wf(12) + 8)} frame={f} width={8} />
						<G x={830} y={940} s={0.34 * pop(f, wf(11))}>
							<PaperBrain id="mini2" />
						</G>
						<G x={655} y={455}>
							<Pin />
						</G>
					</Stage>
					{f >= wf(10) ? (
						<div style={{position: 'absolute', left: 650, top: 470, transform: `scale(${pop(f, wf(10))}) rotate(2deg)`, transformOrigin: 'left top'}}>
							<Label text="الروبوت اللي بيركّب" size={34} />
						</div>
					) : null}
				</AbsoluteFill>
			) : null}
			{/* ---- phase 2: a small chip in your brain (+ real MRI on a medical monitor) ---- */}
			{f >= p2 && f < p3 ? (
				<AbsoluteFill>
					<Backdrop color={C.teal} pattern="grid" ink="rgba(255,255,255,0.06)" light={0.2} />
					<PaperScreen x={560} y={330} w={460} h={420} frame={f} at={p2 + 2} src="episodes/neuralink/media/v_mri.mp4" kind="monitor" trim={6} credit={{kind: 'صورة رنين حقيقية لمخ بشري', text: 'Edlow et al. · CC0'}} />
					<Stage>
						<SvgDefs />
						<G x={430} y={980} s={1.0}>
							<PaperBrain id="n2" />
							<G x={-70} y={-232 - (1 - drop) * 700} s={0.9}>
								<Implant r={52} threads={0} />
							</G>
						</G>
					</Stage>
					{f >= wf(14) ? (
						<div style={{position: 'absolute', left: 90, top: 520, transform: `scale(${pop(f, wf(14))}) rotate(-3deg)`}}>
							<Label text="≈ ٢٣ مم · قد العملة" size={40} bg={C.yellow} />
						</div>
					) : null}
				</AbsoluteFill>
			) : null}
			{/* ---- phase 3: threads into neurons (+ real micrograph) ---- */}
			{f >= p3 && f < p4 ? (
				<AbsoluteFill>
					<Backdrop color={C.navy} pattern="dots" ink="rgba(255,255,255,0.05)" light={0.15} />
					<Stage>
						<SvgDefs />
						{Array.from({length: 7}).map((_, k) => (
							<G key={k} x={110 + k * 143} y={880 + (k % 2) * 110} r={(k - 3) * 6} o={0.95}>
								<Neuron s={0.82} seed={k + 2} fire={reach > 0.95 ? ((f / 22 + k * 0.3) % 1.4) - 0.2 : -1} lit={reach > 0.95 && k % 2 ? 1 : 0} color={C.sage} />
							</G>
						))}
						<G x={660} y={520} s={1.45}>
							<Implant r={58} threads={11} reach={reach} frame={f} pulse={reach} />
						</G>
					</Stage>
					<PhotoPrint
						src="episodes/neuralink/media/pyramidal_electrode.jpg"
						x={60}
						y={340}
						w={400}
						h={300}
						rot={-3}
						frame={f}
						at={wf(17) - 2}
						seed={7}
						enter="slideLeft"
						credit={{kind: 'خلية عصبية حقيقية + قطب (توضيحي)', text: 'Laurens R. Krol · CC BY-SA 4.0'}}
					/>
				</AbsoluteFill>
			) : null}
			{/* ---- phase 4: thinner than a hair ---- */}
			{f >= p4 ? (
				<AbsoluteFill>
					<Backdrop color={C.paper} pattern="grid" ink="rgba(38,35,33,0.05)" light={0.25} />
					<Stage>
						<SvgDefs />
						<G x={540} y={830}>
							{/* hair: thick strip */}
							<path d={`M-520,${-150 + (1 - hairIn) * 400} C-200,-200 100,-60 520,-120`} stroke="#5A3E2B" strokeWidth={70} fill="none" strokeLinecap="round" filter="url(#sh)" opacity={hairIn} />
							{/* thread: hairline */}
							<path d="M-520,120 C-200,60 120,170 520,100" stroke={C.yellowShade} strokeWidth={5} fill="none" strokeDasharray="1400" strokeDashoffset={1400 * (1 - prog(f, wf(19), wf(20) + 4))} />
							{lens > 0 ? (
								<G x={60} y={-10} s={lens}>
									<circle r={250} fill="rgba(255,255,255,0.18)" stroke={C.charcoal} strokeWidth={22} filter="url(#sh)" />
									<rect x={170} y={170} width={46} height={190} rx={18} fill={C.charcoal} transform="rotate(-45 190 190)" />
								</G>
							) : null}
						</G>
					</Stage>
					{hairIn > 0 ? (
						<div style={{position: 'absolute', left: 80, top: 520, transform: `scale(${hairIn}) rotate(-3deg)`}}>
							<Label text="شعرة ≈ ٧٠ ميكرون" size={38} bg={C.charcoal} fg={C.paper} />
						</div>
					) : null}
					{f >= wf(20) ? (
						<div style={{position: 'absolute', left: 520, top: 1050, transform: `scale(${pop(f, wf(20))}) rotate(2deg)`}}>
							<Label text="خيط ≈ ٤–٦ ميكرون" size={38} bg={C.yellow} />
						</div>
					) : null}
					{f >= wf(22) ? (
						<div style={{position: 'absolute', left: 60, top: 1140, transform: `scale(${pop(f, wf(22))})`, transformOrigin: 'left top'}}>
							<Badge text="١٠٢٤ قطب على ٦٤ خيط — أرقام نيورالينك المنشورة" size={22} color={C.teal} />
						</div>
					) : null}
				</AbsoluteFill>
			) : null}
			<TitleCard frame={f} at={a + 1} out={p2 - 6} text="أول إشي: شريحة" />
			<TitleCard frame={f} at={p2} out={p3 - 6} text="شريحة صغيرة بمخّك" seed={9} />
			<TitleCard frame={f} at={p3} out={p4 - 6} text="خيوط للخلايا العصبية" seed={12} />
			<TitleCard frame={f} at={p4} text="أدقّ من الشعرة" seed={15} />
			<div style={{display: 'none', fontFamily: FONT.display, filter: SHADOW.soft}} />
		</AbsoluteFill>
	);
};
