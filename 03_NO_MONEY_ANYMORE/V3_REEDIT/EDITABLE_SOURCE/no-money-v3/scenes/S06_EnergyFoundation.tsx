// V3 · Shot 06 (frames 719–826) «وحتى الطاقة، الروبوتات بتبني محطاتها وبتعملها صيانة»
// ENERGY IS THE FOUNDATION: a cross-section. Bottom slab = three real windows (power station, 750 kV switchyard,
// solar plant). Yellow energy lines rise through a build layer (turbine, solar panels placed by a robot arm) into
// the factories on top. Maintenance: a brush pass, a surge lights every factory, a maintenance card is stamped.
// Locked cues: wind f735 · slide f743 · clanks f757/766/775 · servo f762 · brush f794 · zap f800 · stamp f810.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {Backdrop} from '../../../brand/paper';
import {Factory, G, RobotArm, SolarPanel, SvgDefs, WindTurbine} from '../../../brand/props';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../../no-money/ep';
import {M1, M3, Win} from '../kit';

const WIN = [
	{src: M3('n_power_station.jpg'), credit: 'Epagemakerwiki · CC BY-SA 4.0', kind: 'محطة كهربا', x: 40},
	{src: M3('n_switchyard.jpg'), credit: 'Novoklimov · CC BY 4.0', kind: 'شبكة 750 ك.ف', x: 380},
	{src: M1('p_solar_plant.jpg'), credit: 'Hp.Baumeler · CC BY-SA 4.0', kind: 'محطة شمسية', x: 720},
];
const PANELS = [560, 670, 780];

export const EnergyFoundationScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.F;
	const cam = kf(f, [a, wf(56) + 6, wf(57) + 14], [1.32, 1.32, 1.0], EASE.io);
	const flows = prog(f, wf(56) - 6, wf(57) + 10, EASE.io);
	const blade = f * (2 + 10 * prog(f, wf(56), wf(56) + 20));
	const build = prog(f, wf(55) + 4, wf(56) + 6, EASE.out);
	const clank = [wf(58) - 2, wf(58) + 7, wf(58) + 16];
	const placed = clank.map((c) => pop(f, c, {damping: 13}));
	const reach = (() => {
		// arm reaches toward the panel being placed
		const k = f < clank[0] ? 0 : f < clank[1] ? 1 : 2;
		return k;
	})();
	const brush = prog(f, wf(60), wf(60) + 12, EASE.io);
	const surge = prog(f, wf(60) + 6, wf(61) - 2, EASE.out);
	const lit = surge;
	const card = slam(f, wf(61) - 1);
	const armA = f < wf(60) ? [-10 + reach * 12 + Math.sin(f / 4) * 3, 80 - reach * 6, 50] : [10 + brush * 34, 70 - brush * 10, 60];
	return (
		<AbsoluteFill>
			<Backdrop color={C.navy} pattern="dots" ink="rgba(255,255,255,0.05)" light={0.2} />
			<Camera scale={cam} origin="540px 1150px">
				<Stage>
					<SvgDefs />
					{/* upper floor: factories that consume energy */}
					<rect x={0} y={640} width={1080} height={36} fill={C.paperShade} filter="url(#sh)" />
					{[60, 410, 760].map((x, i) => (
						<G key={x} x={x} y={640} s={0.72} f="sh">
							<Factory w={360} h={190} lit={lit} chimney={i !== 1} />
						</G>
					))}
					{/* middle build layer */}
					<rect x={0} y={960} width={1080} height={50} fill={C.kraft} />
					<rect x={0} y={960} width={1080} height={10} fill={C.kraftDark} />
					<G x={170} y={960} s={0.85} f="sh">
						<WindTurbine h={360} blade={blade} build={build} />
					</G>
					{PANELS.map((x, k) => (placed[k] > 0 ? (
						<G key={x} x={x} y={960 - (1 - placed[k]) * 120} s={0.6} f="sh">
							<SolarPanel w={190} shine={brush > 0 && brush < 1 ? brush : 0} />
						</G>
					) : null))}
					<G x={420} y={965} s={0.8} f="sh">
						<RobotArm a1={armA[0]} a2={armA[1]} a3={armA[2]} tool={f >= wf(60) - 4 ? 'brush' : 'gripper'} />
					</G>
					{/* energy flows from the foundation up into the factories */}
					{WIN.map((w, i) => {
						const x0 = w.x + 160;
						const x1 = [190, 540, 890][i];
						const d = `M${x0},1035 C${x0},860 ${x1},840 ${x1},680`;
						return (
							<g key={i}>
								<path d={d} fill="none" stroke="rgba(20,14,8,0.3)" strokeWidth={22} strokeDasharray="600" strokeDashoffset={600 * (1 - flows)} transform="translate(0 5)" />
								<path d={d} fill="none" stroke={C.yellow} strokeWidth={16} strokeDasharray="600" strokeDashoffset={600 * (1 - flows)} strokeLinecap="round" filter={surge > 0 && surge < 1 ? 'url(#glow)' : undefined} />
								{flows >= 1 ? <path d={d} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={6} strokeDasharray="18 40" strokeDashoffset={f * (6 + surge * 10)} /> : null}
							</g>
						);
					})}
					{/* foundation slab */}
					<rect x={0} y={1010} width={1080} height={300} fill={C.navyDeep} />
					<rect x={0} y={1010} width={1080} height={12} fill={C.yellow} />
				</Stage>
				{WIN.map((w, i) => (
					<Win key={i} src={w.src} x={w.x} y={1045} w={320} h={200} rot={[-1.5, 1, -1][i]} f={f} at={a + 1 + i * 3} credit={w.credit} kind={`صورة حقيقية · ${w.kind}`} seed={40 + i} enter="pop" />
				))}
				<div dir="rtl" style={{position: 'absolute', right: 40, top: 960, padding: '4px 16px', background: C.yellow, borderRadius: 4, fontFamily: FONT.display, fontWeight: 900, fontSize: 30, color: C.charcoal, filter: SHADOW.soft, transform: `scale(${pop(f, wf(56))})`}}>
					الطاقة = الأساس
				</div>
				{f >= wf(58) ? (
					<div style={{position: 'absolute', left: 560, top: 1005 - 60, transform: `scale(${pop(f, wf(58))}) rotate(2deg)`}}>
						<Label text="روبوتات بتبني · تصوّر" size={26} bg={C.charcoal} fg={C.paper} />
					</div>
				) : null}
			</Camera>
			{card > 0 ? (
				<div style={{position: 'absolute', left: 640, top: 330, width: 360, transform: `scale(${1.8 - 0.8 * card}) rotate(${6 - 4 * card}deg)`, opacity: Math.min(1, card * 3), filter: SHADOW.lifted}}>
					<div dir="rtl" style={{background: C.paperWhite, padding: '18px 26px', borderRadius: 8, border: `5px solid ${C.teal}`}}>
						<div style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 44, color: C.teal}}>صيانة ✓</div>
						<div style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 24, color: C.charcoal, opacity: 0.8}}>بدون تدخّل بشري · تصوّر</div>
					</div>
				</div>
			) : null}
			<TitleCard frame={f} at={a + 1} text="وحتى الطاقة…" />
		</AbsoluteFill>
	);
};
