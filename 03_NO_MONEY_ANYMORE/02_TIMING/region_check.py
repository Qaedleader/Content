"""Re-transcribe short regions (no prompt, no context) to double-check uncertain words."""
import sys, json, numpy as np, soundfile as sf
from faster_whisper import WhisperModel
m = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8', cpu_threads=4,
                 download_root=r'D:/Content/02_NEURALINK/07_PROJECT/.models')
a, sr = sf.read('vo_16k_analysis.wav', dtype='float32')
res = {}
for r in sys.argv[1:]:
    t0, t1 = map(float, r.split('-'))
    seg = a[int(t0 * sr):int(t1 * sr)]
    for beam, temp in ((5, 0.0), (1, 0.4)):
        segs, _ = m.transcribe(seg, language='ar', word_timestamps=True, beam_size=beam, temperature=temp,
                               condition_on_previous_text=False, vad_filter=False)
        words = [(round(w.start + t0, 2), w.word.strip(), round(w.probability, 2)) for s in segs for w in s.words]
        res.setdefault(r, []).append(words)
        print(r, f'beam={beam} T={temp}:', ' '.join(f'{w}[{p}]' for _, w, p in words), flush=True)
json.dump(res, open('region_checks.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
