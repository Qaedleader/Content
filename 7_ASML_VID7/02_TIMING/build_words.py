"""whisper_words.json -> words.json for the Remotion episode (display spelling + emphasis). Timings are unchanged."""
import json, os
d = json.load(open('whisper_words.json', encoding='utf-8'))
FIX = {'الذكال': 'الذكاء', 'جدا': 'جداً', 'تجاريا،': 'تجارياً،', 'EUV.': 'EUV', 'و': 'و'}
EMPH = {16, 25, 27, 28, 32, 37, 39, 48, 53, 54, 62, 67, 77, 90, 92, 103, 117}
words = []
for s in d['segments']:
    for w in s['words']:
        i = len(words)
        words.append({'i': i, 'w': FIX.get(w['w'], w['w']), 's': w['s'], 'e': w['e'], 'p': w['p'], 'emph': i in EMPH})
out = {'source': 'ASML.m4a.mp4 (faster-whisper large-v3-turbo word timestamps, unchanged)', 'decoded_seconds': 2380736 / 44100, 'words': words}
for p in ('words.json', r'D:/Content/_BRAND_SYSTEM/src/episodes/asml/data/words.json'):
    json.dump(out, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(' '.join(w['w'] for w in words))
