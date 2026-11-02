// Scene L — «يعني مثلاً معادن بتصنع منها أشياء، وطاقة بتشغّل فيها ملايين الروبوتات»
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog} from '../../../brand/anim';
import {Stage, PaperCounter} from '../../../brand/diagram';
import {PhotoPrint} from '../../../brand/media';
import {Backdrop} from '../../../brand/paper';
import {Conveyor, FlowPath, G, Icon, Ingot, RobotArm, SvgDefs} from '../../../brand/props';
import {C, SHADOW} from '../../../brand/tokens';
import {TitleCard} from '../../../brand/type';
import {S, wf} from '../ep';

const THINGS = ['car', 'phone', 'beam', 'house'] as const;

export const ExamplesScene: React.FC<{f: number}> = ({f}) => {
	const [a] = S.L;
	const swap = wf(122) - 6;
	const out1 = prog(f, swap, swap + 10, EASE.in);
	const in2 = prog(f, swap + 2, swap + 14, EASE.out);
	// robots multiplying: 1 → 3² → 7² → 15²
	const lvl = f >= wf(125) + 4 ? 3 : f >= wf(124) ? 2 : f >= wf(123) ? 1 : 0;
	const n = [1, 3, 7, 15][lvl];
	const cnt = kf(f, [wf(125) - 2, wf(126) + 6], [0, 1000000], EASE.out);
	const flows = (k: number) => prog(f, swap + 10 + k * 3, swap + 26 + k * 3, EASE.out);
	return (
		<AbsoluteFill>
			<Backdrop color={C.navy} pattern="dots" ink="rgba(255,255,255,0.05)" floorY={1210} floorColor={C.charcoalSoft} floorEdge={C.charcoal} light={0.2} />
			{/* part 1: metals → things */}
			{out1 < 1 ? (
				<AbsoluteFill style={{transform: `translateY(${-out1 * 1400}px)`}}>
					<PhotoPrint
						src="episodes/no-money/media/p_al_ingots.jpg"
						x={70}
						y={350}
						w={560}
						h={450}
						rot={-2}
						frame={f}
						at={a + 3}
						seed={121}
						kb={{from: 1.04, to: 1.14}}
						kbDur={80}
						credit={{kind: 'صورة حقيقية · سبائك معدن', text: 'Anders Beer Wilse · CC BY 4.0'}}
					/>
					<Stage>
						<SvgDefs />
						{THINGS.map((t, i) => {
							const p = pop(f, wf(119) - 1 + i * 4);
							const y = 400 + i * 170;
							return (
								<g key={t}>
									<FlowPath d={`M640,${560} Q740,${560 + (y - 560) * 0.3} 820,${y}`} draw={prog(f, wf(119) - 4 + i * 4, wf(119) + 6 + i * 4)} frame={f} width={7} dash={14} />
									{p > 0 ? (
										<G x={900} y={y} s={p} f="sh">
											<circle r={72} fill={C.paperWhite} stroke="rgba(30,20,10,0.2)" strokeWidth={2} />
											<Icon name={t} s={0.7} />
										</G>
									) : null}
								</g>
							);
						})}
						{/* ingots on a line becoming products */}
						<G x={60} y={1150}>
							<Conveyor len={960} frame={f} speed={6} />
						</G>
						{Array.from({length: 6}).map((_, i) => {
							const x = 90 + ((Math.max(0, f - a) * 6 + i * 160) % 920);
							const done = x > 600;
							return (
								<G key={i} x={x} y={1150} f="shs">
									{done ? <G y={-50} s={0.55}><Icon name={THINGS[i % 4]} /></G> : <Ingot s={0.55} />}
								</G>
							);
						})}
					</Stage>
				</AbsoluteFill>
			) : null}
			{/* part 2: energy → millions of robots */}
			{in2 > 0 ? (
				<AbsoluteFill style={{transform: `translateY(${(1 - in2) * 1400}px)`}}>
					<PhotoPrint
						src="episodes/no-money/media/p_pylon.jpg"
						x={290}
						y={340}
						w={500}
						h={370}
						rot={1.5}
						frame={f}
						at={swap + 2}
						enter="none"
						seed={131}
						kb={{from: 1.05, to: 1.15}}
						kbDur={70}
						credit={{kind: 'صورة حقيقية · شبكة كهربا', text: 'Ron Clausen · CC0'}}
					/>
					<Stage>
						<SvgDefs />
						<FlowPath d="M540,720 L540,800" draw={flows(0)} frame={f} width={10} glow />
						<FlowPath d="M540,800 Q300,840 200,900" draw={flows(1)} frame={f} width={8} glow />
						<FlowPath d="M540,800 Q780,840 880,900" draw={flows(2)} frame={f} width={8} glow />
						{(() => {
							// grid inside the band y 840..1200: cols = n, rows ≈ n/2.4 (min 1)
							const cols = n;
							const rows = Math.max(1, Math.round(n / 2.4));
							const cw = 920 / cols;
							const rh = 360 / rows;
							const sc = Math.min(cw / 300, rh / 560) * 1.0;
							const at = (lvl === 0 ? wf(122) : [wf(122), wf(123), wf(124), wf(125) + 4][lvl]);
							return Array.from({length: cols * rows}).map((_, k) => {
								const i = k % cols;
								const j = Math.floor(k / cols);
								const p = pop(f, at + ((i + j) % 6));
								const ph = f / 4 + k;
								return (
									<G key={`${n}-${k}`} x={80 + cw * (i + 0.5)} y={840 + rh * (j + 1)} s={sc * p}>
										<RobotArm a1={-18 + Math.sin(ph) * 18} a2={65 + Math.cos(ph) * 15} a3={30} />
									</G>
								);
							});
						})()}
					</Stage>
					{f >= wf(125) - 2 ? (
						<div style={{position: 'absolute', left: 0, width: 1080, top: 745, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, wf(125) - 2)})`}}>
							<div style={{padding: '16px 22px', background: 'rgba(20,30,45,0.85)', borderRadius: 18, filter: SHADOW.lifted}}>
								<PaperCounter value={cnt} size={74} group suffix="+" seed={7} />
							</div>
						</div>
					) : null}
				</AbsoluteFill>
			) : null}
			<TitleCard frame={f} at={wf(117)} out={swap} text="معادن ← أشياء" />
			<TitleCard frame={f} at={swap + 6} text="طاقة ← ملايين الروبوتات" seed={17} />
		</AbsoluteFill>
	);
};
