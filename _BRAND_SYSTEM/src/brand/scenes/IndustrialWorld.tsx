// Reusable paper diorama: an industrial landscape that unfolds like a pop-up book.
// Used for "automated world" overviews; `level` controls richness, `at` the unfold start frame.
import React from 'react';
import {pop} from '../anim';
import {Excavator, Factory, FlowPath, Furnace, G, House, Pylon, RobotArm, SolarPanel, Truck, WindTurbine, Car} from '../props';
import {C} from '../tokens';

const PopUp: React.FC<{f: number; at: number; base: number; children: React.ReactNode}> = ({f, at, base, children}) => {
	const p = pop(f, at, {damping: 12, stiffness: 150, mass: 0.8});
	if (p <= 0.001) return null;
	return <g transform={`translate(0 ${base}) scale(1 ${p}) translate(0 ${-base})`}>{children}</g>;
};

export const IndustrialWorld: React.FC<{
	f: number;
	at: number;
	level?: 'basic' | 'full';
	robotsAt?: number;
	flowsAt?: number;
	collapse?: number; // 0..1 everything shrinks toward the centre (finale)
	litAt?: number;
}> = ({f, at, level = 'basic', robotsAt = 1e9, flowsAt = 1e9, collapse = 0, litAt = 1e9}) => {
	const full = level === 'full';
	const blade = f * 7;
	const rob = (k: number) => pop(f, robotsAt + k * 3);
	const flow = (k: number) => Math.min(1, Math.max(0, (f - flowsAt - k * 4) / 18));
	const lit = f >= litAt ? Math.min(1, (f - litAt) / 10) : 0;
	const truckX = ((f * 5) % 1500) - 400;
	const truck2X = 1300 - ((f * 4 + 600) % 1600);
	const c = (k: number) => Math.max(0, Math.min(1, collapse * 1.6 - k * 0.12));
	const shrink = (k: number, cx: number, cy: number, node: React.ReactNode) => {
		const s = 1 - c(k);
		if (s <= 0.01) return null;
		return <g transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`} opacity={Math.min(1, s * 2)}>{node}</g>;
	};
	return (
		<g>
			{/* sun */}
			{shrink(0, 830, 560, <PopUp f={f} at={at} base={640}><circle cx={830} cy={560} r={78} fill={C.yellowLight} opacity={0.9} filter="url(#shs)" /></PopUp>)}
			{/* far hills */}
			{shrink(1, 540, 1150,
				<PopUp f={f} at={at} base={1150}>
					<path d="M0,1150 L0,930 Q140,860 260,920 Q380,980 520,890 Q660,800 800,900 Q930,980 1080,880 L1080,1150 Z" fill={C.navyLight} filter="url(#sh)" />
					<G x={150} y={1000}><WindTurbine h={300} blade={blade} /></G>
					<G x={290} y={1015}><WindTurbine h={230} blade={blade + 40} /></G>
					<G x={980} y={935} s={0.6}><WindTurbine h={300} blade={blade + 80} /></G>
					<G x={420} y={985} s={0.5}><Pylon h={380} color={C.charcoal} /></G>
					<G x={760} y={955} s={0.5}><Pylon h={380} color={C.charcoal} /></G>
					<path d="M390,800 Q575,860 730,770" fill="none" stroke={C.charcoal} strokeWidth={3} />
					{full ? (
						<>
							<G x={860} y={968} s={0.42}><House w={300} h={220} lit={lit} /></G>
							<G x={1000} y={980} s={0.36}><House w={300} h={220} roof={C.teal} lit={lit} /></G>
						</>
					) : null}
				</PopUp>,
			)}
			{/* mid hills */}
			{shrink(2, 540, 1160,
				<PopUp f={f} at={at + 4} base={1160}>
					<path d="M0,1160 L0,1010 Q180,960 360,1020 Q540,1080 720,1000 Q900,930 1080,1000 L1080,1160 Z" fill={C.teal} filter="url(#sh)" />
					{[0, 1, 2].map((i) => (
						<G key={i} x={420 + i * 80} y={1060} s={0.42}><SolarPanel w={200} shine={((f / 40 + i * 0.3) % 1.4) - 0.2} /></G>
					))}
				</PopUp>,
			)}
			{/* ground */}
			<PopUp f={f} at={at + 8} base={1920}>
				<rect x={0} y={1150} width={1080} height={770} fill={C.sage} />
				<rect x={0} y={1150} width={1080} height={10} fill={C.sageDark} opacity={0.6} />
				<rect x={0} y={1222} width={1080} height={50} fill={C.charcoalSoft} />
				<line x1={0} y1={1247} x2={1080} y2={1247} stroke={C.yellow} strokeWidth={5} strokeDasharray="34 30" strokeDashoffset={-f * 5} />
			</PopUp>
			{/* factories */}
			{shrink(3, 210, 1160,
				<PopUp f={f} at={at + 10} base={1160}>
					<G x={40} y={1160} f="sh"><Factory w={330} h={170} color={C.paper} smoke={(f / 45) % 1} lit={lit} /></G>
					{rob(0) > 0 ? <G x={120} y={990} s={0.32 * rob(0)}><RobotArm a1={-20 + Math.sin(f / 7) * 18} a2={70 + Math.sin(f / 5) * 14} a3={30} /></G> : null}
					{rob(1) > 0 ? <G x={270} y={990} s={0.32 * rob(1)}><RobotArm a1={15 + Math.sin(f / 6 + 1) * 18} a2={-60 + Math.sin(f / 4) * 14} a3={-20} /></G> : null}
				</PopUp>,
			)}
			{shrink(4, 820, 1160,
				<PopUp f={f} at={at + 14} base={1160}>
					<G x={640} y={1160} f="sh"><Factory w={370} h={200} color={C.paperShade} roof={C.navy} door={C.terracotta} smoke={((f + 20) / 50) % 1} lit={lit} /></G>
					{rob(2) > 0 ? <G x={730} y={958} s={0.34 * rob(2)}><RobotArm a1={-10 + Math.sin(f / 6) * 20} a2={75 + Math.sin(f / 5 + 2) * 12} a3={25} tool="welder" /></G> : null}
					{rob(3) > 0 ? <G x={900} y={958} s={0.34 * rob(3)}><RobotArm a1={20 + Math.sin(f / 7 + 2) * 16} a2={-70 + Math.sin(f / 4 + 1) * 10} a3={-30} /></G> : null}
				</PopUp>,
			)}
			{full ? (
				<>
					{shrink(5, 470, 1160, <PopUp f={f} at={at + 16} base={1160}><G x={470} y={1160} s={0.38} f="sh"><Furnace glow={0.6 + 0.4 * Math.sin(f / 5)} pour={1} /></G></PopUp>)}
					{shrink(6, 560, 1300, <PopUp f={f} at={at + 18} base={1300}><G x={560} y={1300} s={0.45} f="sh"><Excavator boom={-25 + Math.sin(f / 9) * 12} stick={55 + Math.sin(f / 7) * 15} bucket={40} /></G></PopUp>)}
				</>
			) : null}
			{/* traffic */}
			{shrink(7, 540, 1250,
				<PopUp f={f} at={at + 12} base={1272}>
					<G x={truckX} y={1262} s={0.36} f="shs"><Truck wheelRot={f * 9} ping={(f / 20) % 1} cargo={<Car w={300} />} /></G>
					<G x={truck2X} y={1238} s={-0.3} sy={0.3} f="shs"><Truck wheelRot={-f * 9} color={C.teal} /></G>
				</PopUp>,
			)}
			{/* production pathways */}
			{flow(0) > 0 ? (
				<g opacity={1 - c(8)}>
					<FlowPath d="M150,860 Q260,760 420,830 Q560,880 740,800" draw={flow(0)} frame={f} width={8} />
					<FlowPath d="M740,800 Q860,900 820,960" draw={flow(1)} frame={f} width={8} />
					<FlowPath d="M420,830 Q300,900 210,970" draw={flow(2)} frame={f} width={8} />
					<FlowPath d="M370,1110 Q520,1180 640,1110" draw={flow(3)} frame={f} width={8} />
				</g>
			) : null}
		</g>
	);
};
