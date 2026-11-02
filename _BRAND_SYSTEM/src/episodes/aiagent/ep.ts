// Episode 09 — AI vs AI Agent. «ما هو الفرق بين AI والـAI Agent بأبسط صورة؟ … مخ ومعه أدوات بيستخدمها عشان يحقق هدف.»
// Every frame derives from the locked narration's word timings (data/words.json); the narration itself is never edited.
import data from './data/words.json';
import {makeTimeline, Word} from '../../brand/timing';

type AWord = Word & {emph: boolean};
export const WORDS = (data as {words: AWord[]}).words;
export const T = makeTimeline(WORDS);
export const wf = T.wf;
export const we = T.we;

// Source m4a: 44.652 s container, last word ends at 44.28 s. 1340 frames = 44.667 s covers the whole recording.
export const DURATION = 1340;

// Named word indices (see 02_TIMING/words.json).
export const W = {
	farq: 2, ai: 4, agent: 5, absat: 6, takhayyal: 8, ensan: 10, shuft: 11, kora: 12, aynak: 14, istaqbalat: 15, sura: 16,
	dimaghak: 17, hallalha: 18, w3eref: 19, kora2: 21, wba3dain: 22, qarrar: 23, yshawwet: 25, fa3ta: 26, amr: 27, ijrak: 28,
	tet7arrak: 29, wetshawwet: 30, kora3: 31, hon: 32, aynak2: 33, malouma: 35, mokhak: 36, qarrar2: 37, ijrak2: 38, naffazat: 39,
	wnafs: 40, mabda: 41, bilai: 42, takhayyal2: 43, thaka: 44, chatgpt: 48, claude: 49, gemini: 50, mithl: 51, mokhak2: 52,
	fa3ala: 53, mithal: 55, jibna: 56, rabatnaha: 58, adawat: 59, btiqra: 60, wbtib3ath: 61, emails: 62, qulnalo: 63, kol: 65,
	ywaslak: 67, email: 68, hallel: 69, wrod: 70, radd: 72, munaseb: 73, dimn: 74, ta3limati: 75, hon2: 76, mokh3: 77,
	bihallel: 78, wyqarrer: 79, wal_adawat: 80, yestaqbel: 82, rasa2el: 83, wyeb3ath: 84, rdood: 85, wbhay: 86, bykoon: 88,
	agent2: 91, ya3ni: 92, wakeel: 93, mokh4: 96, wma3o: 97, adawat2: 98, byestakhdemha: 99, yhaqqeq: 101, hadaf: 102,
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
