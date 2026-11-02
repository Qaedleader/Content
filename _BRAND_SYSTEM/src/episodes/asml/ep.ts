// Episode 07 — ASML / EUV. «تعرفوا إنه فيه شركة … معتمد على تكنولوجيا شركة واحدة؟»
// Every frame derives from the locked narration's word timings (data/words.json); the narration itself is never edited.
import data from './data/words.json';
import {makeTimeline, Word} from '../../brand/timing';

type AWord = Word & {emph: boolean};
export const WORDS = (data as {words: AWord[]}).words;
export const T = makeTimeline(WORDS);
export const wf = T.wf;
export const we = T.we;

export const AUDIO_SECONDS = 2380736 / 44100; // 53.985 s decoded narration (container reports 54.03 s incl. priming)
export const DURATION = 1621; // 54.033 s ≥ narration; the last word ends at 53.70 s

export const M = (n: string) => `episodes/asml/media/${n}`;

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
