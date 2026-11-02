import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {PaperGrade} from '../../brand/paper';
import {C} from '../../brand/tokens';
import {CaptionTrack} from '../../brand/type';
import {CHUNKS, DURATION, EMPHASIS, WORDS, wf, we} from './ep';
import {PixelCut} from './kit';
import {EuvProcessScene} from './scenes/EuvProcess';
import {Core, Essentials, Exclusive, Finale, HowIntro, Opening, Partners, Reveal, Wafer} from './scenes/Story';
import {CREDITS} from './credits';

const inR = (f: number, a: number, b: number) => f >= a && f <= b;

// Scene ranges (frames), all anchored to word onsets of the locked narration.
export const R = {
	opening: [0, wf(19) - 2],
	essentials: [wf(19) - 1, wf(33) - 2],
	reveal: [wf(33) - 1, wf(49) - 2],
	how: [wf(49) - 1, wf(49) + 24],
	euv: [wf(49) + 25, wf(76)],
	wafer: [wf(76) + 1, wf(78) - 1],
	core: [wf(78), wf(87) - 1],
	partners: [wf(87), wf(95) - 1],
	exclusive: [wf(95), wf(106) - 1],
	finale: [wf(106), DURATION - 1],
} as const;

// Hero type already says these words → captions step aside.
const HIDDEN: [number, number][] = [
	[wf(16) - 2, we(18) + 6],
	[wf(32) - 2, we(32) + 6],
	[wf(39) - 2, we(40) + 6],
	[wf(48) - 2, we(48) + 6],
	[wf(79) - 1, we(80) + 4],
	[wf(95) - 1, we(95) + 4],
	[wf(116) - 2, DURATION],
];

// Pixel cuts on the strongest scene changes (brand detail, very short).
const CUTS = [39, 84, wf(33) - 1, wf(37), wf(49) + 25, wf(87), wf(95), wf(115) - 1];

export const Asml: React.FC<{withNarration?: boolean}> = ({withNarration = true}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			{withNarration ? <Audio src={staticFile('episodes/asml/audio/narration_original.m4a')} /> : null}
			{inR(f, ...R.opening) ? <Opening f={f} /> : null}
			{inR(f, ...R.essentials) ? <Essentials f={f} credits={[CREDITS.gpu, CREDITS.slots]} /> : null}
			{inR(f, ...R.reveal) ? <Reveal f={f} /> : null}
			{inR(f, ...R.how) ? <HowIntro f={f} b={R.how[1]} /> : null}
			<EuvProcessScene f={f} a={R.euv[0]} b={R.euv[1]} />
			{inR(f, ...R.wafer) ? <Wafer f={f} /> : null}
			{inR(f, ...R.core) ? <Core f={f} chipCredit={CREDITS.chip} /> : null}
			{inR(f, ...R.partners) ? <Partners f={f} tsmcCredit={CREDITS.tsmc} nvCredit={CREDITS.nvidia} /> : null}
			{inR(f, ...R.exclusive) ? <Exclusive f={f} /> : null}
			{inR(f, ...R.finale) ? <Finale f={f} end={R.finale[1]} /> : null}
			{CUTS.map((c, i) => (
				<PixelCut key={i} f={f} at={c} seed={i + 2} density={0.42} dur={4} />
			))}
			<CaptionTrack frame={f} words={WORDS} chunks={CHUNKS} emphasis={EMPHASIS} hidden={HIDDEN} />
			<PaperGrade frame={f} strength={0.42} vignette={0.3} />
		</AbsoluteFill>
	);
};
