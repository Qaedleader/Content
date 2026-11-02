import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {pop} from '../../brand/anim';
import {PaperGrade} from '../../brand/paper';
import {C} from '../../brand/tokens';
import {Badge, CaptionTrack} from '../../brand/type';
import {CAPTION_HIDDEN, CHUNKS, EMPHASIS, S, SPECULATIVE, WORDS, wf, we} from './ep';
import {HookScene, ImplantScene} from './scenes/N1_N2';
import {BackupScene, DecodeScene, SignalsScene} from './scenes/N3_N5';
import {CloneScene, RetrievalScene, TransferScene, WaitScene} from './scenes/N6_N9';
import {DemoScene, FutureJokeScene, OutroScene, RealityScene} from './scenes/N10_N13';

const inR = (f: number, r: readonly [number, number]) => f >= r[0] && f <= r[1];
// hero type already shows these words
const HIDDEN: [number, number][] = [...CAPTION_HIDDEN, [wf(67) - 1, we(67) + 6], [wf(110) - 1, we(110) + 6], [wf(177) - 2, we(177) + 4]];

// Master timeline: hard cuts on phrase onsets; every scene uses absolute frames anchored to the approved narration.
export const NeuralinkRemake: React.FC<{withNarration?: boolean}> = ({withNarration = true}) => {
	const f = useCurrentFrame();
	const spec = SPECULATIVE.find(([a, b]) => f >= a && f <= b);
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			{withNarration ? <Audio src={staticFile('episodes/neuralink/audio/narration_original.m4a')} /> : null}
			{inR(f, S.N1) ? <HookScene f={f} /> : null}
			{inR(f, S.N2) ? <ImplantScene f={f} /> : null}
			{inR(f, S.N3) ? <SignalsScene f={f} /> : null}
			{inR(f, S.N4) ? <DecodeScene f={f} /> : null}
			{inR(f, S.N5) ? <BackupScene f={f} /> : null}
			{inR(f, S.N6) ? <WaitScene f={f} /> : null}
			{inR(f, S.N7) ? <RetrievalScene f={f} /> : null}
			{inR(f, S.N8) ? <TransferScene f={f} /> : null}
			{inR(f, S.N9) ? <CloneScene f={f} /> : null}
			{inR(f, S.N10) ? <RealityScene f={f} /> : null}
			{inR(f, S.N11) ? <DemoScene f={f} /> : null}
			{inR(f, S.N12) ? <FutureJokeScene f={f} /> : null}
			{inR(f, S.N13) ? <OutroScene f={f} /> : null}
			{spec ? (
				<div style={{position: 'absolute', left: 56, top: 296, transform: `scale(${pop(f, spec[0])})`, transformOrigin: 'left top'}}>
					<Badge text="تصوّر مستقبلي" color={C.yellow} bg="rgba(20,30,45,0.92)" size={24} />
				</div>
			) : null}
			<CaptionTrack frame={f} words={WORDS} chunks={CHUNKS} emphasis={EMPHASIS} hidden={HIDDEN} />
			<PaperGrade frame={f} />
		</AbsoluteFill>
	);
};
