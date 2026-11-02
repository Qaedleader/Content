"""Local Arabic transcription with word timestamps (faster-whisper, CPU int8).
Reads only the 16 kHz analysis copy of the narration; never touches the master.
Usage: python transcribe.py [model]   ->  timing/whisper_words.json"""
import os, sys, json
from faster_whisper import WhisperModel

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_name = sys.argv[1] if len(sys.argv) > 1 else 'large-v3-turbo'
m = WhisperModel(model_name, device='cpu', compute_type='int8', cpu_threads=4,
                 download_root=os.path.join(ROOT, '.models'))
segs, info = m.transcribe(os.path.join(ROOT, 'timing', 'vo_16k_analysis.wav'), language='ar',
                          word_timestamps=True, beam_size=5, vad_filter=False,
                          condition_on_previous_text=True)
out = {'model': model_name, 'duration': info.duration, 'segments': []}
for s in segs:
    out['segments'].append({'start': s.start, 'end': s.end, 'text': s.text.strip(),
                            'words': [{'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3),
                                       'p': round(w.probability, 3)} for w in s.words]})
    print(f"{s.start:6.2f}-{s.end:6.2f} {s.text.strip()}", flush=True)
json.dump(out, open(os.path.join(ROOT, 'timing', 'whisper_words.json'), 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)
