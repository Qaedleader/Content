// V3 · Shot 12 (frames 1599–1784) «لأنه بهالعالم الأهم مش قديش معك مصاري، الأهم مين بملك القدرة على الإنتاج»
// THE PRODUCTION WORLD ASSEMBLES: close on a banknote; pieces of the world slide in around it. «مش»: a charcoal
// pencil strikes the note; «مصاري»: it drops away. «الأهم مين»: energy, mining, smelting, robots, transport and
// homes fly into ONE radial ecosystem around a central factory while the camera pulls back; the world locks on
// the impact and its yellow flows light. «القدرة / على الإنتاج» land beneath it; on the ratchet a yellow frame
// snaps around the whole world. (No spinning gear.)
// Locked cues: whoosh f1599 · slide f1624 · scribble f1643 · whoosh f1663 · reverse riser f1681 · impact+clank
// f1693 · stamps f1716/1728 · ratchet f1762.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, shake, slam} from '../../../brand/anim';
import {Camera, Stage} from '../../../brand/diagram';
import {Backdrop} from '../../../brand/paper';
import {Banknote, Excavator, Factory, Furnace, G, House, Pylon, RobotArm, SolarPanel, SvgDefs, Truck, WindTurbine} from '../../../brand/props';
import {C, SHADOW} from '../../../brand/tokens';
import {HeroWord} from '../../../brand/type';
import {DURATION, S, wf} from '../../no-money/ep';
import {IconName, idle, Token} from '../kit';

const HUB = {x: 540, y: 760};
type Piece = {x: number; y: number; at: number; node: React.FC<{f: number}>};
const PIECES: Piece[] = [
	{x: 190, y: 470, at: 0, node: ({f}) => <G s={0.7}><SolarPanel w={200} shine={(f % 60) / 60} /></G>},
	{x: 540, y: 470, at: 1, node: ({f}) => <G s={0.62}><WindTurbine h={300} blade={f * 9} /></G>},
	{x: 890, y: 470, at: 2, node: () => <G s={0.62}><Pylon h={300} /></G>},
	{x: 150, y: 790, at: 3, node: ({f}) => <G s={0.62}><RobotArm a1={-20 + idle(f, 14, 10)} a2={70} a3={30} /></G>},
	{x: 930, y: 790, at: 4, node: ({f}) => <G s={0.62}><RobotArm a1={20 - idle(f, 14, 10)} a2={-70} a3={-30} /></G>},
	{x: 200, y: 1100, at: 5, node: ({f}) => <G s={0.55}><Excavator boom={-20 + idle(f, 12, 6)} stick={50} bucket={30} /></G>},
	{x: 420, y: 1100, at: 6, node: ({f}) => <G s={0.45}><Furnace glow={0.6 + idle(f, 9, 0.3)} pour={1} /></G>},
	{x: 600, y: 1100, at: 7, node: ({f}) => <G s={0.4} x={-130}><Truck wheelRot={f * 5} ping={(f / 16) % 1} /></G>},
	{x: 900, y: 1100, at: 8, node: () => <G s={0.6} x={-120}><House w={240} h={180} lit={1} /></G>},
];
const TOKENS: {icon: IconName; x: number; y: number}[] = [
	{icon: 'ore', x: 300, y: 560},
	{icon: 'bolt', x: 780, y: 560},
	{icon: 'robot', x: 300, y: 960},
	{icon: 'box', x: 780, y: 960},
];

export const ProductionWorldScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.M;
	const noteIn = pop(f, a - 7, {damping: 15});
	const tokens = TOKENS.map((_, k) => pop(f, wf(129) - 4 + k * 2, {damping: 14}));
	const strike = prog(f, wf(130), wf(131) + 2, EASE.out);
	const noteOut = prog(f, wf(133) - 4, wf(133) + 10, EASE.in);
	const assemble = prog(f, wf(134) - 2, wf(135) + 2, EASE.io);
	const lockAt = wf(135) - 2;
	const sk = shake(f, lockAt, 10, 10);
	const flows = prog(f, lockAt, lockAt + 16, EASE.out);
	const hub = slam(f, lockAt - 6);
	const cam = kf(f, [a, wf(134) - 4, wf(135) + 2, DURATION - 1], [1.7, 1.7, 1.0, 1.035], EASE.io);
	const w1 = slam(f, wf(137) - 1);
	const w2 = slam(f, wf(138) - 1);
	const frameSnap = slam(f, 1762);
	return (
		<AbsoluteFill>
			<Backdrop color={C.navy} pattern="dots" ink="rgba(255,255,255,0.05)" light={0.24} />
			<Camera scale={cam} x={sk.x} y={sk.y} origin={`${HUB.x}px ${HUB.y}px`}>
				<Stage>
					<SvgDefs />
					{/* ground disc of the world */}
					<ellipse cx={540} cy={1130} rx={560 * Math.max(0.01, assemble)} ry={70 * Math.max(0.01, assemble)} fill={C.kraft} opacity={assemble} />
					{/* flows from every piece into the hub */}
					{PIECES.map((p, i) => {
						const d = `M${p.x},${p.y - 60} Q${(p.x + HUB.x) / 2},${(p.y + HUB.y) / 2 - 80} ${HUB.x},${HUB.y - 120}`;
						return flows > 0 ? (
							<g key={i}>
								<path d={d} fill="none" stroke="rgba(20,14,8,0.3)" strokeWidth={14} strokeDasharray="700" strokeDashoffset={700 * (1 - flows)} transform="translate(0 4)" />
								<path d={d} fill="none" stroke={C.yellow} strokeWidth={10} strokeDasharray="700" strokeDashoffset={700 * (1 - flows)} strokeLinecap="round" />
								{flows >= 1 ? <path d={d} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={4} strokeDasharray="14 30" strokeDashoffset={-f * 5} /> : null}
							</g>
						) : null;
					})}
					{/* pieces fly in from the tokens' area */}
					{PIECES.map((p, i) => {
						const u = prog(f, wf(134) - 2 + p.at, wf(135) - 2 + p.at, EASE.out);
						if (u <= 0) return null;
						const sx = HUB.x + (p.x - HUB.x) * u;
						const sy = HUB.y + (p.y - HUB.y) * u;
						const N = p.node;
						return (
							<G key={i} x={sx} y={sy} s={0.3 + 0.7 * u} f="sh">
								<N f={f} />
							</G>
						);
					})}
					{/* central factory */}
					{hub > 0 ? (
						<G x={HUB.x - 200} y={HUB.y + 60} s={1.1 * hub} f="shl">
							<Factory w={360} h={200} lit={prog(f, lockAt, lockAt + 10)} roof={C.charcoal} />
						</G>
					) : null}
					{/* the banknote, struck and dropped */}
					{noteIn > 0 && noteOut < 1 ? (
						<G x={HUB.x} y={HUB.y - (1 - noteIn) * 700 + noteOut * 1300} s={0.62} r={-4 + noteOut * 40} f="shl">
							<Banknote w={520} seed={3} gray={strike * 0.7} />
							<path d="M-240,40 L-160,-60 L-80,50 L0,-60 L80,50 L160,-60 L240,40" fill="none" stroke={C.charcoal} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1100" strokeDashoffset={1100 * (1 - strike)} />
						</G>
					) : null}
					{/* tokens around the note (fade into the assembling world) */}
					{TOKENS.map((t, k) =>
						tokens[k] > 0 && assemble < 1 ? (
							<G key={t.icon} x={t.x + (HUB.x - t.x) * assemble * 0.6} y={t.y + (HUB.y - t.y) * assemble * 0.6} s={tokens[k] * (1 - assemble)}>
								<Token icon={t.icon} r={58} bg={k % 2 ? C.yellow : C.paperWhite} />
							</G>
						) : null,
					)}
					{/* final frame snaps around the world on the ratchet */}
					{frameSnap > 0 ? (
						<g opacity={Math.min(1, frameSnap * 2)}>
							<rect x={40 - (1 - frameSnap) * 60} y={150 - (1 - frameSnap) * 60} width={1000 + (1 - frameSnap) * 120} height={1020 + (1 - frameSnap) * 120} rx={18} fill="none" stroke={C.yellow} strokeWidth={14} />
						</g>
					) : null}
				</Stage>
			</Camera>
			{w1 > 0 ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 1185, display: 'flex', justifyContent: 'center', transform: `scale(${1.8 - 0.8 * w1}) rotate(${-2 + (1 - w1) * 6}deg)`, opacity: Math.min(1, w1 * 3), filter: SHADOW.soft}}>
					<HeroWord text="القدرة" size={200} face={C.charcoal} back={C.yellowShade} depth={9} strip={C.yellow} stripSeed={7} />
				</div>
			) : null}
			{w2 > 0 ? (
				<div style={{position: 'absolute', left: 0, width: 1080, top: 1418, display: 'flex', justifyContent: 'center', transform: `scale(${1.8 - 0.8 * w2}) rotate(${1.5 + (1 - w2) * -6}deg)`, opacity: Math.min(1, w2 * 3)}}>
					<HeroWord text="على الإنتاج" size={130} face={C.paperWhite} back={C.charcoal} depth={7} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
