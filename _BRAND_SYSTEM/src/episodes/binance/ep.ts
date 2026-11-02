// Episode 10 — Binance security incident (29–30 Oct 2026). «أكبر سرقة في تاريخ العملات الرقمية … من اختراق جهاز واحد فقط»
// Every frame derives from the locked narration's word timings (data/words.json); the narration itself is never edited.
import data from './data/words.json';
import {makeTimeline, Word} from '../../brand/timing';

type BWord = Word & {emph: boolean};
export const WORDS = (data as {words: BWord[]}).words;
export const T = makeTimeline(WORDS);
export const wf = T.wf;
export const we = T.we;

export const AUDIO_SECONDS = 1803200 / 44100; // 40.889 s decoded narration (container reports 40.94 s incl. priming)
export const DURATION = 1229; // 40.967 s ≥ container duration; the last word ends at 40.42 s

export const M = (n: string) => `episodes/binance/media/${n}`;

// Caption chunks: ≤3 words, break on punctuation.
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
