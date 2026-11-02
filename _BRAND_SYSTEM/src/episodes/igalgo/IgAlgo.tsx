import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {PaperGrade} from '../../brand/paper';
import {C} from '../../brand/tokens';
import {CaptionTrack} from '../../brand/type';
import {CHUNKS, DURATION, EMPHASIS, W, WORDS, wf, we} from './ep';
import {PixelCut} from '../asml/kit';
import {Opening} from './scenes/Opening';
import {Night} from './scenes/Night';
import {Tomorrow} from './scenes/Tomorrow';
import {Signals} from './scenes/Signals';
import {Analysis} from './scenes/Analysis';
import {Patterns} from './scenes/Patterns';
import {Predict} from './scenes/Predict';
import {Montage} from './scenes/Montage';
import {Finale} from './scenes/Finale';

// Scene ranges (frames), all anchored to word onsets of the locked narration.
export const R = {
	opening: [0, wf(W.takhayyal) - 1],
	night: [wf(W.takhayyal), wf(W.bukra2) - 1],
	tomorrow: [wf(W.bukra2), wf(W.tab) - 1],
	signals: [wf(W.tab), wf(W.ai) - 1],
	analysis: [wf(W.ai), wf(W.btt3allam) - 1],
	patterns: [wf(W.btt3allam), wf(W.wbinaa) - 1],
	predict: [wf(W.wbinaa), wf(W.hatha) - 1],
	montage: [wf(W.hatha), wf(W.bas) - 1],
	finale: [wf(W.bas), DURATION - 1],
} as const;

// Hero type already says these words → captions step aside.
const HIDDEN: [number, number][] = [
	[wf(W.yaqra) - 1, wf(W.wkeef) - 1],
	[wf(W.bukra1) - 2, we(W.bukra1) + 6],
	[wf(W.wala) - 1, wf(W.bahatht) - 1],
	[wf(W.keef2) - 4, wf(W.kol) - 1],
	[wf(W.isharat) - 2, wf(W.ai) - 1],
	[wf(W.malayeen) - 2, we(W.anmat) + 4],
	[wf(W.shoghl) - 2, wf(W.bas) - 1],
	[wf(W.akhtar) - 6, wf(W.insta3) - 1],
	[wf(W.wala2) - 2, DURATION],
];

// Pixel cuts on the strongest scene changes (brand detail, very short).
const CUTS = [wf(W.yaqra), wf(W.takhayyal), wf(W.wbaadu), wf(W.wala), wf(W.bukra2), wf(W.video2), wf(W.tab), wf(W.ai), wf(W.btt3allam), wf(W.wbinaa), wf(W.hatha), wf(W.bas), wf(W.insta3)];

const inR = (f: number, r: readonly [number, number]) => f >= r[0] && f <= r[1];

export const IgAlgo: React.FC<{withNarration?: boolean}> = ({withNarration = true}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			{withNarration ? <Audio src={staticFile('episodes/igalgo/audio/narration_original.m4a')} /> : null}
			{inR(f, R.opening) ? <Opening f={f} end={R.opening[1]} /> : null}
			{inR(f, R.night) ? <Night f={f} end={R.night[1]} /> : null}
			{inR(f, R.tomorrow) ? <Tomorrow f={f} end={R.tomorrow[1]} /> : null}
			{inR(f, R.signals) ? <Signals f={f} end={R.signals[1]} /> : null}
			{inR(f, R.analysis) ? <Analysis f={f} end={R.analysis[1]} /> : null}
			{inR(f, R.patterns) ? <Patterns f={f} end={R.patterns[1]} /> : null}
			{inR(f, R.predict) ? <Predict f={f} end={R.predict[1]} /> : null}
			{inR(f, R.montage) ? <Montage f={f} end={R.montage[1]} /> : null}
			{inR(f, R.finale) ? <Finale f={f} end={R.finale[1]} /> : null}
			{CUTS.map((c, i) => (
				<PixelCut key={i} f={f} at={c} seed={i + 5} density={0.4} dur={4} />
			))}
			{/* captions: brand word strips, scaled down (key words only are hero-sized) */}
			<div style={{position: 'absolute', inset: 0, transform: 'scale(0.8)', transformOrigin: '540px 1395px'}}>
				<CaptionTrack frame={f} words={WORDS} chunks={CHUNKS} emphasis={EMPHASIS} hidden={HIDDEN} />
			</div>
			<PaperGrade frame={f} strength={0.4} vignette={0.28} />
		</AbsoluteFill>
	);
};
