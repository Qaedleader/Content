import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {PaperGrade} from '../../brand/paper';
import {C} from '../../brand/tokens';
import {CaptionTrack} from '../../brand/type';
import {CHUNKS, DURATION, EMPHASIS, WORDS, wf, we} from './ep';
import {PixelCut} from './kit';
import {Deposit, Growth, Hook, Sp500} from './scenes/Finance';
import {AiReveal, Problem} from './scenes/Shift';
import {Industries, Masters, OneCompany} from './scenes/Future';
import {Comment, Follow, Secret} from './scenes/Close';

const inR = (f: number, a: number, b: number) => f >= a && f <= b;

// Scene ranges (frames), all anchored to word onsets of the locked narration.
export const R = {
	hook: [0, wf(10) - 1],
	deposit: [wf(10), wf(20) - 1],
	sp500: [wf(20), wf(25) - 1],
	growth: [wf(25), wf(42) - 1],
	problem: [wf(42), wf(52) - 1],
	reveal: [wf(52), wf(66) - 1],
	masters: [wf(66), wf(77) - 1],
	industries: [wf(77), wf(89) - 1],
	company: [wf(89), wf(98) - 1],
	secret: [wf(98), wf(114) - 1],
	follow: [wf(114), wf(127) - 1],
	comment: [wf(127), DURATION - 1],
} as const;

// Hero type already says these words → captions step aside.
const HIDDEN: [number, number][] = [
	[0, we(2) + 8], // بدك تصير مليونير؟
	[wf(6) - 1, we(6) + 4], // 99%
	[wf(23) - 1, we(23) + 4], // S&P 500
	[wf(44) - 1, we(44) + 4], // مشكلة
	[wf(50) - 1, we(51) + 6], // 30 سنة؟
	[wf(64) - 1, we(65) + 4], // الذكاء الاصطناعي
	[wf(75) - 1, we(76) + 4], // أسياد المستقبل
	[wf(77) - 1, we(88) + 4], // the seven fields + أي إشي
	[wf(96) - 1, we(97) + 4], // شركة كاملة
	[wf(130) - 1, DURATION], // the typed question
];

const CUTS = [wf(10), wf(20), wf(25), wf(52), wf(66), wf(77), wf(89), wf(98), wf(114), wf(127)];

export const Millionaire: React.FC<{withNarration?: boolean}> = ({withNarration = true}) => {
	const f = useCurrentFrame();
	const inSecret = inR(f, ...R.secret);
	return (
		<AbsoluteFill style={{background: C.navyDeep}}>
			{withNarration ? <Audio src={staticFile('episodes/millionaire/audio/narration_original.m4a')} /> : null}
			{inR(f, ...R.hook) ? <Hook f={f} /> : null}
			{inR(f, ...R.deposit) ? <Deposit f={f} /> : null}
			{inR(f, ...R.sp500) ? <Sp500 f={f} /> : null}
			{inR(f, ...R.growth) ? <Growth f={f} /> : null}
			{inR(f, ...R.problem) ? <Problem f={f} /> : null}
			{inR(f, ...R.reveal) ? <AiReveal f={f} /> : null}
			{inR(f, ...R.masters) ? <Masters f={f} /> : null}
			{inR(f, ...R.industries) ? <Industries f={f} /> : null}
			{inR(f, ...R.company) ? <OneCompany f={f} /> : null}
			{inSecret ? <Secret f={f} /> : null}
			{inR(f, ...R.follow) ? <Follow f={f} /> : null}
			{inR(f, ...R.comment) ? <Comment f={f} end={DURATION - 1} /> : null}
			{CUTS.map((c, i) => (
				<PixelCut key={i} f={f} at={c} seed={i + 5} density={0.42} dur={4} />
			))}
			<CaptionTrack
				frame={f}
				words={WORDS}
				chunks={CHUNKS}
				emphasis={EMPHASIS}
				hidden={HIDDEN}
				theme={inSecret ? () => ({bg: C.charcoal, fg: C.paper, hiBg: C.yellow, hiFg: C.charcoal}) : undefined}
			/>
			<PaperGrade frame={f} strength={0.4} vignette={0.3} />
		</AbsoluteFill>
	);
};
