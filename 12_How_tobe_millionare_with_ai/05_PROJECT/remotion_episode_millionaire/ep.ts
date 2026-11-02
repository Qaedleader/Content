// Episode 12 — «كيف تصير مليونير بالذكاء الاصطناعي». «بدك تصير مليونير؟ … شو أول شي بدكم تتعلموه؟»
// Every frame derives from the locked narration's word timings (data/words.json); the narration itself is never edited.
import data from './data/words.json';
import proj from './data/projection.json';
import {makeTimeline, Word} from '../../brand/timing';

type RWord = Word & {emph: boolean};
export const WORDS = (data as {words: RWord[]}).words;
export const T = makeTimeline(WORDS);
export const wf = T.wf;
export const we = T.we;

export const AUDIO_SECONDS = 2155456 / 44100; // 48.877 s decoded narration (container reports 48.92 s incl. priming)
export const DURATION = 1467; // 48.900 s ≥ decoded audio; last word ends at 48.64 s

export const M = (n: string) => `episodes/millionaire/media/${n}`;

/** Hypothetical projection: $500 at the end of every month, 10 %/yr effective (monthly compounding). years[k] = value after k years. */
export const PROJ = proj as {method: string; years: number[]; contributed: number; final: number};

// Caption chunks: ≤3 words, break on punctuation / pauses.
export const CHUNKS = (() => {
	const out: {from: number; to: number}[] = [];
	let start = 0;
	for (let i = 0; i < WORDS.length; i++) {
		const next = WORDS[i + 1];
		const len = i - start + 1;
		const chars = WORDS.slice(start, i + 1).reduce((a, w) => a + w.w.length + 1, 0) + (next ? next.w.length : 0);
		if (!next || len >= 3 || chars > 22 || /[،.؟!:]$/.test(WORDS[i].w) || next.s - WORDS[i].e > 0.2) {
			out.push({from: start, to: i});
			start = i + 1;
		}
	}
	return out;
})();

export const EMPHASIS = new Set<number>(WORDS.filter((w) => w.emph).map((w) => w.i));
