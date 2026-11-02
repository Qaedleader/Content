// V3 — full visual re-direction of «المصاري رح يبطل إلها قيمة» on the LOCKED V1 soundtrack.
// Same word timings, scene boundaries, captions and paper grade as V1 (no-money/ep.ts). New scenes: shots 01–09, 12.
// Shots 10 (J+K, balance) and 11 (L, examples) are kept from V1 on purpose. See 03_NO_MONEY_ANYMORE/V3_REEDIT/.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {PaperGrade} from '../../brand/paper';
import {C} from '../../brand/tokens';
import {CaptionTrack} from '../../brand/type';
import {CAPTION_HIDDEN, CHUNKS, EMPHASIS, S, WORDS} from '../no-money/ep';
import {ValueScene} from '../no-money/scenes/JK_WhatKeepsValue';
import {ExamplesScene} from '../no-money/scenes/L_Examples';
import {MachineScene} from './scenes/S01_Machine';
import {ThousandScene} from './scenes/S03_Thousand';
import {ProductionMapScene} from './scenes/S04_ProductionMap';
import {RobotCellScene} from './scenes/S05_RobotCell';
import {EnergyFoundationScene} from './scenes/S06_EnergyFoundation';
import {ElevatorScene} from './scenes/S07_Elevator';
import {FourPagesScene} from './scenes/S08_FourPages';
import {MultiplyScene} from './scenes/S09_Multiply';
import {ProductionWorldScene} from './scenes/S12_ProductionWorld';

const inRange = (f: number, r: readonly [number, number]) => f >= r[0] && f <= r[1];

export const NoMoneyAnymoreV3: React.FC<{withNarration?: boolean}> = ({withNarration = true}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			{withNarration ? <Audio src={staticFile('episodes/no-money/audio/narration_original.m4a')} /> : null}
			{f <= S.B[1] ? <MachineScene f={f} /> : null}
			{inRange(f, S.C) ? <ThousandScene f={f} /> : null}
			{inRange(f, S.D) ? <ProductionMapScene f={f} /> : null}
			{inRange(f, S.E) ? <RobotCellScene f={f} /> : null}
			{inRange(f, S.F) ? <EnergyFoundationScene f={f} /> : null}
			{inRange(f, S.G) ? <ElevatorScene f={f} /> : null}
			{inRange(f, S.H) ? <FourPagesScene f={f} /> : null}
			{inRange(f, S.I) ? <MultiplyScene f={f} /> : null}
			{inRange(f, S.JK) ? <ValueScene f={f} /> : null}
			{inRange(f, S.L) ? <ExamplesScene f={f} /> : null}
			{inRange(f, S.M) ? <ProductionWorldScene f={f} /> : null}
			<CaptionTrack frame={f} words={WORDS} chunks={CHUNKS} emphasis={EMPHASIS} hidden={CAPTION_HIDDEN} />
			<PaperGrade frame={f} />
		</AbsoluteFill>
	);
};
