// Episode 02 (remake) — «أقول لك كيف رح تبطّل تنسى أي إشي بحياتك؟» (Neuralink), new Content Studio identity.
// All frames derive from the approved narration's word timings (data/words.json); the narration itself is never edited.
import data from './data/words.json';
import {autoChunks, makeTimeline, Word} from '../../brand/timing';

type NWord = Word & {chunk: number; emph: boolean};
export const WORDS = (data as {words: NWord[]}).words;
export const T = makeTimeline(WORDS);
export const wf = T.wf;
export const we = T.we;

export const AUDIO_SECONDS = 71.168; // decoded narration length (approved master)
export const TAIL_FRAMES = 24;
export const DURATION = Math.ceil(AUDIO_SECONDS * 30) + TAIL_FRAMES; // 2160

export const S = {
	N1: [0, 75],
	N2: [76, 249],
	N3: [250, 375],
	N4: [376, 532],
	N5: [533, 727],
	N6: [728, 891],
	N7: [892, 1077],
	N8: [1078, 1233],
	N9: [1234, 1405],
	N10: [1406, 1627],
	N11: [1628, 1806],
	N12: [1807, 1995],
	N13: [1996, DURATION - 1],
} as const;

// Caption chunks follow the original production's verified subtitle chunks, split to ≤3 words.
export const CHUNKS = (() => {
	const out: {from: number; to: number}[] = [];
	let start = 0;
	for (let i = 0; i < WORDS.length; i++) {
		const next = WORDS[i + 1];
		const len = i - start + 1;
		const endChunk = !next || next.chunk !== WORDS[i].chunk;
		const chars = WORDS.slice(start, i + 1).reduce((a, w) => a + w.w.length + 1, 0) + (next ? next.w.length : 0);
		if (endChunk || len >= 3 || chars > 24 || /[،.؟!:]$/.test(WORDS[i].w)) {
			out.push({from: start, to: i});
			start = i + 1;
		}
	}
	return out;
})();
void autoChunks;

export const EMPHASIS = new Set<number>(WORDS.filter((w) => w.emph).map((w) => w.i));

// Hero type already says these words → hide captions there.
export const CAPTION_HIDDEN: [number, number][] = [];

// Fact-check / labelling windows (frames)
export const SPECULATIVE: [number, number][] = [
	[wf(41) - 2, wf(121) - 2], // 17.8 s → 46.9 s : memory backup, retrieval, transfer, cloning
	[wf(153) - 2, wf(173) - 2], // 60.3 s → 66.5 s : saving all memories = future
];
