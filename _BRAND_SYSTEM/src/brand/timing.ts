import {FPS} from './tokens';

// Narration-driven timing: every visual event is anchored to a word of the original narration.
export type Word = {i: number; w: string; s: number; e: number; p?: number};

export type Timeline = {
	words: Word[];
	/** start frame of word i */
	wf: (i: number, offsetSec?: number) => number;
	/** end frame of word i */
	we: (i: number, offsetSec?: number) => number;
	/** frame of an absolute time in seconds */
	at: (sec: number) => number;
};

export const makeTimeline = (words: Word[]): Timeline => ({
	words,
	wf: (i, o = 0) => Math.round((words[i].s + o) * FPS),
	we: (i, o = 0) => Math.round((words[i].e + o) * FPS),
	at: (sec) => Math.round(sec * FPS),
});

export type CaptionChunk = {from: number; to: number}; // inclusive word-index range

/** Phrase chunking: max `maxWords` words, break on punctuation or pauses longer than `gap` seconds. */
export const autoChunks = (words: Word[], maxWords = 3, gap = 0.22, maxChars = 24): CaptionChunk[] => {
	const chunks: CaptionChunk[] = [];
	let start = 0;
	for (let i = 0; i < words.length; i++) {
		const len = i - start + 1;
		const chars = words.slice(start, i + 1).reduce((a, w) => a + w.w.length + 1, 0);
		const next = words[i + 1];
		const punct = /[،.؟?!,]$/.test(words[i].w);
		const pause = next ? next.s - words[i].e > gap : true;
		const nextChars = next ? chars + next.w.length + 1 : 0;
		if (!next || punct || pause || len >= maxWords || nextChars > maxChars) {
			chunks.push({from: start, to: i});
			start = i + 1;
		}
	}
	return chunks;
};
