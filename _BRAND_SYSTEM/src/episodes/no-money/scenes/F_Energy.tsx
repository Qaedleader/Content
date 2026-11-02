// Scene F — «وحتى الطاقة، الروبوتات بتبني محطاتها وبتعملها صيانة»
// Real footage first (wind turbine, solar), then the paper diorama: robots build & maintain the plant, energy flows out.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {FootagePrint} from '../../../brand/media';
import {Backdrop} from '../../../brand/paper';
import {FlowPath, G, RobotArm, SolarPanel, SvgDefs, WindTurbine} from '../../../brand/props';
import {C} from '../../../brand/tokens';
import {Label, TitleCard} from '../../../brand/type';
import {S, wf} from '../ep';

export const EnergyScene: React.FC<{f: number}> = ({f}) => {
	const [a, b] = S.F;
	const shrinkAt = wf(57) - 3;
	const sh = prog(f, shrinkAt, shrinkAt + 10, EASE.io);
	// wind footage: full stage → top-left print
	const wx = kf(sh, [0, 1], [90, 60]);
	const wy = kf(sh, [0, 1], [330, 340]);
	const ww = kf(sh, [0, 1], [900, 400]);
	const wh = kf(sh, [0, 1], [900, 560]);
	const panelAt = (i: number) => wf(58) - 2 + i * 9;
	const build = prog(f, wf(58), wf(59) + 4, EASE.io);
	const maint = f >= wf(60);
	const armA1 = maint ? -50 + Math.sin(f / 3) * 16 : kf(f, [panelAt(0), panelAt(1), panelAt(2), wf(60)], [-35, -10, 18, -50], EASE.io);
	const flow = (k: number) => prog(f, wf(60) + 4 + k * 4, wf(60) + 20 + k * 4, EASE.out);
	const stamp = pop(f, wf(61) - 1);
	const diorama = prog(f, shrinkAt, shrinkAt + 8);
	return (
		<AbsoluteFill>
			<Backdrop color={C.paper} pattern="grid" ink="rgba(38,35,33,0.05)" floorY={1170} light={0.2} />
			<Camera scale={kf(f, [a, b], [1.0, 1.04], EASE.linear)}>
				<Stage>
					<SvgDefs />
					<g opacity={diorama}>
						{/* plant: solar panels built by a robot arm, turbine erected */}
						{[0, 1, 2].map((i) => {
							const p = pop(f, panelAt(i));
							return p > 0 ? (
								<G key={i} x={360 + i * 175} y={1172 + (1 - p) * -260} s={0.9} f="sh">
									<SolarPanel w={170} shine={maint ? ((f / 18 + i * 0.3) % 1.6) - 0.3 : 0} />
								</G>
							) : null;
						})}
						<G x={150} y={1172} s={0.85} f="sh">
							<RobotArm a1={armA1} a2={maint ? 110 : 85} a3={maint ? 60 : 40} tool={maint ? 'brush' : 'gripper'} />
						</G>
						<G x={900} y={1172} f="sh">
							<WindTurbine h={420} blade={f * 6} build={build} />
						</G>
						{build > 0.05 && build < 0.98 ? (
							<G x={980} y={1172 - 420 * build} s={0.4}>
								<RobotArm a1={-60} a2={70} a3={20} />
							</G>
						) : null}
						{/* energy leaving the plant → grid → factories (connects to production) */}
						<FlowPath d="M450,1060 Q620,980 760,1010 Q900,1040 1100,960" draw={flow(0)} frame={f} width={9} glow />
						<FlowPath d="M900,760 Q1000,820 1100,880" draw={flow(1)} frame={f} width={9} glow />
					</g>
				</Stage>
			</Camera>
			{/* real footage */}
			<FootagePrint
				src="episodes/no-money/media/v_wind_vertical.mp4"
				x={wx}
				y={wy}
				w={ww}
				h={wh}
				rot={-1.5 + sh * -1}
				frame={f}
				at={a + 1}
				seed={91}
				enter="pop"
				credit={{kind: 'لقطات حقيقية · طاقة الرياح', text: 'Aliceinthealice · CC0'}}
			/>
			<FootagePrint
				src="episodes/no-money/media/v_solar.mp4"
				x={500}
				y={350}
				w={520}
				h={330}
				rot={2}
				frame={f}
				at={shrinkAt + 6}
				seed={92}
				enter="slideRight"
				credit={{kind: 'لقطات حقيقية · طاقة شمسية', text: 'Tobi Kellner · CC0'}}
			/>
			{f >= shrinkAt + 14 ? (
				<div style={{position: 'absolute', left: 470, top: 1085, transform: `scale(${pop(f, shrinkAt + 14)}) rotate(-2deg)`}}>
					<Label text="روبوتات بتبني وبتصون · تصوّر" size={28} bg={C.yellow} />
				</div>
			) : null}
			{stamp > 0 ? (
				<div style={{position: 'absolute', left: 300, top: 1010, transform: `scale(${2 - stamp}) rotate(-8deg)`, opacity: Math.min(1, stamp * 2)}}>
					<div dir="rtl" style={{padding: '6px 24px', border: `6px solid ${C.teal}`, borderRadius: 12, fontFamily: 'Alexandria', fontWeight: 900, fontSize: 52, color: C.teal, background: 'rgba(251,248,241,0.85)'}}>
						صيانة ✓
					</div>
				</div>
			) : null}
			<TitleCard frame={f} at={wf(55)} text="وحتى الطاقة" />
		</AbsoluteFill>
	);
};
