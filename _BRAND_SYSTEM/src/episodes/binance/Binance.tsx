import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {PaperGrade} from '../../brand/paper';
import {C} from '../../brand/tokens';
import {CaptionTrack} from '../../brand/type';
import {CHUNKS, DURATION, EMPHASIS, WORDS, wf, we} from './ep';
import {PixelCut} from '../asml/kit';
import {Hook, Incident} from './scenes/Hook';
import {Attribution, LaptopChain} from './scenes/Breach';
import {Ending, Funds} from './scenes/Funds';

const inR = (f: number, a: number, b: number) => f >= a && f <= b;

// Scene ranges (frames), all anchored to word onsets of the locked narration.
export const R = {
	hook: [0, wf(17) - 1],
	incident: [wf(17), wf(34) - 1],
	laptop: [wf(34), wf(52) - 1],
	attribution: [wf(52), wf(63) - 1],
	funds: [wf(63), wf(98) - 1],
	ending: [wf(98), DURATION - 1],
} as const;

// Hero type already says these words → captions step aside.
const HIDDEN: [number, number][] = [
	[0, we(1) + 4], // «أكبر سرقة»
	[wf(14) - 2, we(16) + 6], // «قبل ساعات فقط»
	[wf(29) - 1, we(30) + 4], // «مليون دولار»
	[wf(31) - 2, we(33) + 6], // «شو اللي صار؟»
	[wf(66) - 2, we(67) + 4], // «تعويض المستخدمين»
	[wf(89) - 2, we(90) + 4], // «مش معروف»
	[wf(103) - 2, DURATION], // «جهاز واحد فقط» + closing frame
];

// Pixel cuts on the scene changes (brand detail, very short).
const CUTS = [wf(6), wf(17), wf(34), wf(52), wf(63), wf(98)];

export const Binance: React.FC<{withNarration?: boolean}> = ({withNarration = true}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			{withNarration ? <Audio src={staticFile('episodes/binance/audio/narration_original.m4a')} /> : null}
			{inR(f, ...R.hook) ? <Hook f={f} /> : null}
			{inR(f, ...R.incident) ? <Incident f={f} /> : null}
			{inR(f, ...R.laptop) ? <LaptopChain f={f} /> : null}
			{inR(f, ...R.attribution) ? <Attribution f={f} /> : null}
			{inR(f, ...R.funds) ? <Funds f={f} /> : null}
			{inR(f, ...R.ending) ? <Ending f={f} end={R.ending[1]} /> : null}
			{CUTS.map((c, i) => (
				<PixelCut key={i} f={f} at={c} seed={i + 5} density={0.4} dur={4} />
			))}
			<CaptionTrack frame={f} words={WORDS} chunks={CHUNKS} emphasis={EMPHASIS} hidden={HIDDEN} />
			<PaperGrade frame={f} strength={0.35} vignette={0.3} />
		</AbsoluteFill>
	);
};
