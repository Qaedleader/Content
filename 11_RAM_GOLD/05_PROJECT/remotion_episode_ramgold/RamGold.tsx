import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {PaperGrade} from '../../brand/paper';
import {C} from '../../brand/tokens';
import {CaptionTrack} from '../../brand/type';
import {CHUNKS, DURATION, EMPHASIS, WORDS, wf, we} from './ep';
import {PixelCut} from './kit';
import {Altman, Interpretation, Opening, Reveal} from './scenes/Hook';
import {AiProcessors, Family, WorkMemory} from './scenes/Tech';
import {Bottleneck, Demand} from './scenes/Demand';
import {Allocation, Quote} from './scenes/Quote';
import {Prices, Resource, Years} from './scenes/Price';
import {GoldFinale} from './scenes/Gold';

const inR = (f: number, a: number, b: number) => f >= a && f <= b;

// Scene ranges (frames), all anchored to word onsets of the locked narration.
export const R = {
	opening: [0, wf(13) - 1],
	altman: [wf(13), wf(21) - 1],
	interp: [wf(21), wf(34) - 1],
	reveal: [wf(34), wf(38) - 1],
	work: [wf(38), wf(47) - 1],
	family: [wf(47), wf(56) + 9],
	ai: [wf(56) + 10, wf(62) - 1],
	demand: [wf(62), wf(72) - 1],
	bottleneck: [wf(72), wf(82) - 1],
	quote: [wf(82), wf(90) - 1],
	alloc: [wf(90), wf(103) - 1],
	prices: [wf(103), wf(109) - 1],
	resource: [wf(109), wf(118) - 1],
	years: [wf(118), wf(128) - 1],
	gold: [wf(128), DURATION - 1],
} as const;

// Hero type / kinetic typography already says these words → captions step aside.
const HIDDEN: [number, number][] = [
	[wf(3) - 1, we(4) + 4], // حرب عالمية
	[wf(25) - 2, we(33) + 8], // the interpretation is typeset word by word
	[wf(37) - 2, we(37) + 8], // الرام
	[wf(63) - 2, we(63) + 4], // انفجار
	[wf(127) - 2, we(127) + 6], // لسنوات
	[wf(136) - 2, DURATION], // الذهب + final question typeset
];

// Pixel cuts on the strongest scene changes (brand detail, very short).
const CUTS = [wf(3), wf(13), wf(34), wf(38), wf(47), wf(62), wf(72), wf(82), wf(103), wf(118), wf(128)];

export const RamGold: React.FC<{withNarration?: boolean}> = ({withNarration = true}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			{withNarration ? <Audio src={staticFile('episodes/ramgold/audio/narration_original.m4a')} /> : null}
			{inR(f, ...R.opening) ? <Opening f={f} /> : null}
			{inR(f, ...R.altman) ? <Altman f={f} /> : null}
			{inR(f, ...R.interp) ? <Interpretation f={f} /> : null}
			{inR(f, ...R.reveal) ? <Reveal f={f} b={R.reveal[1]} /> : null}
			{inR(f, ...R.work) ? <WorkMemory f={f} /> : null}
			{inR(f, ...R.family) ? <Family f={f} /> : null}
			{inR(f, ...R.ai) ? <AiProcessors f={f} end={R.ai[1]} /> : null}
			{inR(f, ...R.demand) ? <Demand f={f} /> : null}
			{inR(f, ...R.bottleneck) ? <Bottleneck f={f} /> : null}
			{inR(f, ...R.quote) ? <Quote f={f} /> : null}
			{inR(f, ...R.alloc) ? <Allocation f={f} /> : null}
			{inR(f, ...R.prices) ? <Prices f={f} /> : null}
			{inR(f, ...R.resource) ? <Resource f={f} /> : null}
			{inR(f, ...R.years) ? <Years f={f} /> : null}
			{inR(f, ...R.gold) ? <GoldFinale f={f} end={R.gold[1]} /> : null}
			{CUTS.map((c, i) => (
				<PixelCut key={i} f={f} at={c} seed={i + 2} density={0.42} dur={4} />
			))}
			<CaptionTrack frame={f} words={WORDS} chunks={CHUNKS} emphasis={EMPHASIS} hidden={HIDDEN} />
			<PaperGrade frame={f} strength={0.42} vignette={0.3} />
		</AbsoluteFill>
	);
};
