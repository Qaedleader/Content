// V2 re-edit of «المصاري رح يبطل إلها قيمة» (NoMoneyAnymore). Same narration, same timeline (ep.ts of V1),
// same captions and grade. Only these shots are replaced (see 03_NO_MONEY_ANYMORE/V2_REEDIT/CHANGED_SHOTS_TIMELINE.md):
//   A hook 0–81 · D car entrance 276–305 · G opening 827–871 · H everything 990–1081 · M ending 1729–1784.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {PaperGrade} from '../../brand/paper';
import {C} from '../../brand/tokens';
import {CaptionTrack} from '../../brand/type';
import {CAPTION_HIDDEN, CHUNKS, EMPHASIS, S, WORDS} from '../no-money/ep';
import {HookScene} from '../no-money/scenes/A_Hook';
import {WorldScene} from '../no-money/scenes/C_World';
import {RobotsScene} from '../no-money/scenes/E_RobotsMakeRobots';
import {EnergyScene} from '../no-money/scenes/F_Energy';
import {CostScene} from '../no-money/scenes/I_CostCollapse';
import {ValueScene} from '../no-money/scenes/JK_WhatKeepsValue';
import {ExamplesScene} from '../no-money/scenes/L_Examples';
import {HookSceneV2} from './scenes/A_HookV2';
import {CarJourneySceneV2} from './scenes/D_CarJourneyV2';
import {ChainSceneV2} from './scenes/G_ChainV2';
import {EverythingSceneV2} from './scenes/H_EverythingV2';
import {FinaleSceneV2} from './scenes/M_FinaleV2';

const inRange = (f: number, r: readonly [number, number]) => f >= r[0] && f <= r[1];

export const NoMoneyAnymoreV2: React.FC<{withNarration?: boolean}> = ({withNarration = true}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			{withNarration ? <Audio src={staticFile('episodes/no-money/audio/narration_original.m4a')} /> : null}
			{inRange(f, S.A) ? <HookSceneV2 f={f} /> : null}
			{inRange(f, S.B) ? <HookScene f={f} /> : null}
			{inRange(f, S.C) ? <WorldScene f={f} /> : null}
			{inRange(f, S.D) ? <CarJourneySceneV2 f={f} /> : null}
			{inRange(f, S.E) ? <RobotsScene f={f} /> : null}
			{inRange(f, S.F) ? <EnergyScene f={f} /> : null}
			{inRange(f, S.G) ? <ChainSceneV2 f={f} /> : null}
			{inRange(f, S.H) ? <EverythingSceneV2 f={f} /> : null}
			{inRange(f, S.I) ? <CostScene f={f} /> : null}
			{inRange(f, S.JK) ? <ValueScene f={f} /> : null}
			{inRange(f, S.L) ? <ExamplesScene f={f} /> : null}
			{inRange(f, S.M) ? <FinaleSceneV2 f={f} /> : null}
			<CaptionTrack frame={f} words={WORDS} chunks={CHUNKS} emphasis={EMPHASIS} hidden={CAPTION_HIDDEN} />
			<PaperGrade frame={f} />
		</AbsoluteFill>
	);
};
