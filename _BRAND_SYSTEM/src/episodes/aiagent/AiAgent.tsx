import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {PaperGrade} from '../../brand/paper';
import {C} from '../../brand/tokens';
import {CaptionTrack} from '../../brand/type';
import {CHUNKS, DURATION, EMPHASIS, W, WORDS, wf} from './ep';
import {PixelCut} from '../asml/kit';
import {Hook} from './scenes/Hook';
import {Human, K} from './scenes/Human';
import {A, AgentWorld} from './scenes/AgentWorld';

// Scene ranges (frames), anchored to word onsets of the locked narration. Human and AgentWorld overlap by 14 frames:
// the brain lifts out of the head while the body fades behind the new ground.
const HUMAN: [number, number] = [wf(W.takhayyal), A.lift + 14];

// Hero type / labels already say these words → captions step aside.
const HIDDEN: [number, number][] = [
	[0, wf(W.absat) - 1],
	[K.recap, A.lift - 1],
	[A.m1 - 2, A.ex - 1],
	[A.agent - 2, DURATION],
];

export const AiAgent: React.FC<{withNarration?: boolean}> = ({withNarration = true}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			{withNarration ? <Audio src={staticFile('episodes/aiagent/audio/narration_original.m4a')} /> : null}
			{f < HUMAN[0] ? <Hook f={f} end={HUMAN[0] - 1} /> : null}
			<Human f={f} start={HUMAN[0]} end={HUMAN[1]} />
			<AgentWorld f={f} start={A.lift} />
			<PixelCut f={f} at={HUMAN[0]} seed={9} density={0.4} dur={4} />
			{/* captions: brand word strips, scaled down (key words only are hero-sized) */}
			<div style={{position: 'absolute', inset: 0, transform: 'scale(0.8)', transformOrigin: '540px 1395px'}}>
				<CaptionTrack frame={f} words={WORDS} chunks={CHUNKS} emphasis={EMPHASIS} hidden={HIDDEN} />
			</div>
			<PaperGrade frame={f} strength={0.4} vignette={0.28} />
		</AbsoluteFill>
	);
};
