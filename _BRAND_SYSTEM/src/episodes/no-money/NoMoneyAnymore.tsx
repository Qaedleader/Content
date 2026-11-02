import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {PaperGrade} from '../../brand/paper';
import {C} from '../../brand/tokens';
import {CaptionTrack} from '../../brand/type';
import {CAPTION_HIDDEN, CHUNKS, EMPHASIS, S, WORDS} from './ep';
import {HookScene} from './scenes/A_Hook';
import {WorldScene} from './scenes/C_World';
import {CarJourneyScene} from './scenes/D_CarJourney';
import {RobotsScene} from './scenes/E_RobotsMakeRobots';
import {EnergyScene} from './scenes/F_Energy';
import {ChainScene} from './scenes/G_Chain';
import {EverythingScene} from './scenes/H_Everything';
import {CostScene} from './scenes/I_CostCollapse';
import {ValueScene} from './scenes/JK_WhatKeepsValue';
import {ExamplesScene} from './scenes/L_Examples';
import {FinaleScene} from './scenes/M_Finale';

const inRange = (f: number, r: readonly [number, number]) => f >= r[0] && f <= r[1];

// Master timeline. Scenes are mounted only inside their frame range (hard cuts on phrase onsets);
// all scene code works in absolute frames anchored to the narration's word timings.
export const NoMoneyAnymore: React.FC<{withNarration?: boolean}> = ({withNarration = true}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			{withNarration ? <Audio src={staticFile('episodes/no-money/audio/narration_original.m4a')} /> : null}
			{f <= S.B[1] ? <HookScene f={f} /> : null}
			{inRange(f, S.C) ? <WorldScene f={f} /> : null}
			{inRange(f, S.D) ? <CarJourneyScene f={f} /> : null}
			{inRange(f, S.E) ? <RobotsScene f={f} /> : null}
			{inRange(f, S.F) ? <EnergyScene f={f} /> : null}
			{inRange(f, S.G) ? <ChainScene f={f} /> : null}
			{inRange(f, S.H) ? <EverythingScene f={f} /> : null}
			{inRange(f, S.I) ? <CostScene f={f} /> : null}
			{inRange(f, S.JK) ? <ValueScene f={f} /> : null}
			{inRange(f, S.L) ? <ExamplesScene f={f} /> : null}
			{inRange(f, S.M) ? <FinaleScene f={f} /> : null}
			<CaptionTrack frame={f} words={WORDS} chunks={CHUNKS} emphasis={EMPHASIS} hidden={CAPTION_HIDDEN} />
			<PaperGrade frame={f} />
		</AbsoluteFill>
	);
};
