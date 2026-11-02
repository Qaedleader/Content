import sys
from faster_whisper import WhisperModel
m = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8', cpu_threads=4, download_root=r'D:/Content/02_NEURALINK/07_PROJECT/.models')
for f in sys.argv[1:]:
    for t in (0.0, 0.4):
        segs, _ = m.transcribe(f, language='ar', beam_size=5, temperature=t, vad_filter=False)
        print(f, t, ' | '.join(s.text for s in segs), flush=True)
