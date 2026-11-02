"""Word-level timing for the approved Neuralink narration.
Text = the verified subtitle chunks of the original production (07_PROJECT/scripts/nl/timeline.py SUBS, speaker's own wording).
For each chunk, the 16 kHz analysis audio slice [start-0.12, end+0.12] is re-transcribed with word timestamps
(faster-whisper large-v3-turbo, prompt = chunk text). If Whisper returns the same number of words, its timings are used;
otherwise words are spread over the chunk proportionally to their length. Chunk boundaries are kept as anchors."""
import sys, json, importlib.util, numpy as np, soundfile as sf
from faster_whisper import WhisperModel
spec = importlib.util.spec_from_file_location('tl', r'D:/Content/02_NEURALINK/07_PROJECT/scripts/nl/timeline.py')
tl = importlib.util.module_from_spec(spec); spec.loader.exec_module(tl)
m = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8', cpu_threads=4, download_root=r'D:/Content/02_NEURALINK/07_PROJECT/.models')
a, sr = sf.read('vo_16k_analysis.wav', dtype='float32')
words, log = [], []
for ci, (s, e, text, emph) in enumerate(tl.SUBS):
    toks = text.split()
    t0 = max(0, s - 0.12); seg = a[int(t0 * sr):int((e + 0.12) * sr)]
    segs, _ = m.transcribe(seg, language='ar', word_timestamps=True, beam_size=5, initial_prompt=text, condition_on_previous_text=False, vad_filter=False)
    ww = [w for sg in segs for w in sg.words]
    if len(ww) == len(toks):
        times = [(max(s, w.start + t0), min(e, w.end + t0)) for w in ww]; how = 'whisper'
    else:
        L = np.array([len(t) + 1 for t in toks], float); c = np.concatenate([[0], np.cumsum(L)]) / L.sum()
        times = [(s + (e - s) * c[k], s + (e - s) * c[k + 1]) for k in range(len(toks))]; how = f'proportional (whisper gave {len(ww)} vs {len(toks)})'
    # monotonic clean-up
    for k, (tok, (ts, te)) in enumerate(zip(toks, times)):
        if words and ts < words[-1]['e']: ts = words[-1]['e']
        te = max(te, ts + 0.06)
        words.append({'i': len(words), 'w': tok, 's': round(ts, 3), 'e': round(te, 3), 'chunk': ci, 'emph': tok in emph})
    log.append({'chunk': ci, 'text': text, 'method': how, 'heard': ' '.join(w.word.strip() for w in ww)})
    print(ci, how, '|', text, '|', ' '.join(w.word.strip() for w in ww), flush=True)
json.dump({'source': 'NeuralLink chip vid 2.m4a.mp4 (approved master, sha256 EBE79AD1…1C44FCE), 0 s = first decoded sample',
           'duration': 71.168, 'words': words}, open('words.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(log, open('word_align_log.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('words', len(words))
