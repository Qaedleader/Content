// Episode 03 — «المصاري رح يبطل إلها قيمة» (No Money Anymore)
// Every frame number below is derived from the verified word timings of the ORIGINAL narration (data/words.json).
import data from './data/words.json';
import {autoChunks, CaptionChunk, makeTimeline, Word} from '../../brand/timing';

export const WORDS = (data as {words: Word[]}).words;
export const T = makeTimeline(WORDS);
export const wf = T.wf;
export const we = T.we;

export const AUDIO_SECONDS = 58.58; // decoded narration length
export const TAIL_FRAMES = 27; // 0.9 s visual tail after the narration ends (ending settles; audio untouched)
export const DURATION = Math.ceil(AUDIO_SECONDS * 30) + TAIL_FRAMES; // 1785

// Scene in/out frames (cuts land on phrase onsets)
export const S = {
	A: [0, 81],
	B: [82, 131],
	C: [132, 275],
	D: [276, 578],
	E: [579, 718],
	F: [719, 826],
	G: [827, 989],
	H: [990, 1081],
	I: [1082, 1201],
	JK: [1202, 1447],
	L: [1448, 1598],
	M: [1599, DURATION - 1],
} as const;

// Caption chunks: automatic phrase chunking, with a few hand overrides so meaning-units stay together.
const auto = autoChunks(WORDS, 3, 0.22, 24);
const override: CaptionChunk[] = [];
export const CHUNKS: CaptionChunk[] = override.length ? override : auto;

// Words set on the signature-yellow strip (meaning carriers)
export const EMPHASIS = new Set<number>([3, 7, 11, 19, 24, 27, 29, 30, 33, 35, 37, 43, 47, 49, 54, 56, 61, 66, 72, 76, 77, 78, 79, 82, 84, 89, 94, 107, 108, 109, 118, 125, 133, 137, 139]);

// Captions are hidden where a hero word on screen already says the same thing.
export const CAPTION_HIDDEN: [number, number][] = [[wf(137) - 1, DURATION]];
