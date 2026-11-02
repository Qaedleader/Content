// Episode 08 — Instagram's recommendation algorithm. «هل الإنستغرام فعلياً بقرأ أفكارك؟ … ولا هو اللي خلاك تفكر فيه؟»
// Every frame derives from the locked narration's word timings (data/words.json); the narration itself is never edited.
import data from './data/words.json';
import {makeTimeline, Word} from '../../brand/timing';

type AWord = Word & {emph: boolean};
export const WORDS = (data as {words: AWord[]}).words;
export const T = makeTimeline(WORDS);
export const wf = T.wf;
export const we = T.we;

export const AUDIO_SECONDS = 2118592 / 44100; // 48.041 s decoded narration
export const DURATION = 1442; // 48.067 s ≥ narration; the last word ends at 47.92 s

export const M = (n: string) => `episodes/igalgo/media/${n}`;

// Named word indices (see 02_TIMING/words.json).
export const W = {
	yaqra: 3, afkarak: 4, wkeef: 5, bukra1: 11, qabl: 12, takhayyal: 18, bellail: 19, video1: 21, maqha: 22, matar: 24,
	baadu: 25, shaqqa: 26, wbaadu: 28, qitar: 29, europe1: 30, wala: 31, bahatht: 33, safar: 35, bukra2: 36, insta2: 38,
	btlaqi: 39, video2: 40, keef2: 41, wtibda: 44, europe2: 47, tab: 48, kol: 51, waqf: 52, wkol: 55, iada: 56, wa7atta: 58,
	videos: 59, kollha: 62, isharat: 63, ai: 64, b7allel: 66, tasarrufat: 67, tawqeet: 68, tarteeb: 69, btt3allam: 70,
	malayeen: 72, anmat: 73, ashkhas: 74, qareeba: 77, wshu: 79, yhimmhum: 81, ba3dain: 82, wbinaa: 83, btitwaqqa: 86,
	yejthbak: 89, mustaqbal: 90, hatha: 91, mithal: 93, qeesu: 94, shoghl: 96, dirasa: 97, shira: 98, wkol2: 99, hayatak: 101,
	bas: 102, akhtar: 104, insta3: 105, tawaqqa: 106, wala2: 111, khallak: 114, last: 116,
} as const;

// Caption chunks: ≤3 words, break on punctuation or pauses.
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
