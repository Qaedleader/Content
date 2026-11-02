import sys, json
from faster_whisper import WhisperModel
m = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8', cpu_threads=4,
                 download_root=r'D:/Content/02_NEURALINK/07_PROJECT/.models')
segs, info = m.transcribe(sys.argv[1], language='en', word_timestamps=True, beam_size=5)
out=[]
for s in segs:
    for w in s.words: out.append((round(w.start,2), round(w.end,2), w.word.strip()))
    print(f"{s.start:6.2f}-{s.end:6.2f} {s.text.strip()}", flush=True)
json.dump(out, open(sys.argv[2],'w'), indent=0)
