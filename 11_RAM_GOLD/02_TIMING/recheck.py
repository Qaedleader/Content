import numpy as np, soundfile as sf
from faster_whisper import WhisperModel
m = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8', cpu_threads=4, download_root=r'D:/Content/02_NEURALINK/07_PROJECT/.models')
a, sr = sf.read('vo_16k_analysis.wav')
for (s,e) in [(5.3,7.4),(16.7,19.5),(12.3,13.4)]:
    seg = a[int(s*sr):int(e*sr)].astype(np.float32)
    for lang, pr in [('ar','ChatGPT، OpenAI، DRAM، دي رام، الرام'),('en','ChatGPT, OpenAI, DRAM, RAM, HBM')]:
        segs,_ = m.transcribe(seg, language=lang, word_timestamps=True, beam_size=5, initial_prompt=pr)
        print(s,e,lang,[(w.word, round(w.start+s,2), round(w.end+s,2), round(w.probability,2)) for x in segs for w in x.words], flush=True)
