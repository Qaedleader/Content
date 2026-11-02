"""whisper_words.json -> words.json for the Remotion episode (display spelling + emphasis). Timings are unchanged."""
import json
d = json.load(open('whisper_words.json', encoding='utf-8'))
FIX = {}
EMPH = {0, 1, 8, 12, 15, 20, 22, 25, 26, 39, 40, 46, 50, 57, 58, 66, 71, 73, 74, 82, 90, 103, 104}
words = []
for s in d['segments']:
    for w in s['words']:
        i = len(words)
        words.append({'i': i, 'w': FIX.get(w['w'], w['w']), 's': w['s'], 'e': w['e'], 'p': w['p'], 'emph': i in EMPH})
out = {'source': 'Binance attack.m4a.mp4 (faster-whisper large-v3-turbo word timestamps, unchanged)', 'decoded_seconds': 1803200 / 44100, 'words': words}
for p in ('words.json', r'D:/Content/_BRAND_SYSTEM/src/episodes/binance/data/words.json'):
    json.dump(out, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(words))
