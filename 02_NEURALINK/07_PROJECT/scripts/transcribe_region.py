"""Re-transcribe one region of the 16 kHz analysis copy (word timestamps are returned in absolute time).
Usage: python transcribe_region.py <t0> <t1> [model] [prompt]"""
import os, sys, json, numpy as np, soundfile as sf
from faster_whisper import WhisperModel

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
t0, t1 = float(sys.argv[1]), float(sys.argv[2])
model_name = sys.argv[3] if len(sys.argv) > 3 else 'large-v3-turbo'
prompt = sys.argv[4] if len(sys.argv) > 4 else None
x, sr = sf.read(os.path.join(ROOT, 'timing', 'vo_16k_analysis.wav'), dtype='float32')
clip = x[int(t0 * sr):int(t1 * sr)]
m = WhisperModel(model_name, device='cpu', compute_type='int8', cpu_threads=4, download_root=os.path.join(ROOT, '.models'))
segs, _ = m.transcribe(clip, language='ar', word_timestamps=True, beam_size=5, vad_filter=False, initial_prompt=prompt)
res = []
for s in segs:
    words = [{'w': w.word.strip(), 's': round(w.start + t0, 3), 'e': round(w.end + t0, 3), 'p': round(w.probability, 3)} for w in s.words]
    res.append({'start': s.start + t0, 'end': s.end + t0, 'text': s.text.strip(), 'words': words})
    print(f"{s.start + t0:6.2f}-{s.end + t0:6.2f} {s.text.strip()}", flush=True)
    print('   ', ' '.join(f"{w['w']}@{w['s']:.2f}" for w in words), flush=True)
out = os.path.join(ROOT, 'timing', f'region_{t0:.1f}_{t1:.1f}.json')
json.dump(res, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
