import sys, numpy as np, soundfile as sf
sys.stdout.reconfigure(encoding='utf-8')
from faster_whisper import WhisperModel
m = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8', cpu_threads=4, download_root=r'D:/Content/02_NEURALINK/07_PROJECT/.models')
a, sr = sf.read('vo_16k_analysis.wav')
for (s,e) in [(41.0,44.3),(46.2,48.9),(31.0,32.6),(34.9,36.5),(0.0,1.4)]:
    seg = a[int(s*sr):int(min(e*sr,len(a)))].astype(np.float32)
    for pr in ['تابعوني، رح أبدأ سلسلة، شو أول إشي بدكم تتعلموه، تجارة إلكترونية، شركة كاملة، بدك تصير مليونير', None]:
        segs,_ = m.transcribe(seg, language='ar', word_timestamps=True, beam_size=5, initial_prompt=pr)
        print(s,e,bool(pr),[(w.word, round(w.start+s,2), round(w.end+s,2), round(w.probability,2)) for x in segs for w in x.words], flush=True)
