"""whisper_words.json -> words.json for the Remotion episode (display spelling + emphasis).
Word timings are unchanged. Spelling fixes were checked by re-transcribing short segments (check_seg.py):
«ومخك» (Whisper: ومخها), «هون» ×2, «جبنا هالمخ» (Whisper: جبناها المخ). Two Latin pairs are merged (start of first, end of second)."""
import json
d = json.load(open('whisper_words.json', encoding='utf-8'))
raw = [w for s in d['segments'] for w in s['words']]
FIX = {5: 'و AI Agent', 19: 'حلّلها', 26: 'يشوّتها،', 31: 'وتشوّت', 33: 'هون', 37: 'ومخك', 43: 'بالـ AI،', 57: 'جبنا', 58: 'هالمخ',
       70: 'حلّل', 77: 'هون', 79: 'بحلّل', 92: 'AI Agent'}
MERGE = {5: (6, 'و AI Agent'), 92: (93, 'AI Agent')}   # raw index -> (absorbed index, display text)
SKIP = {m[0] for m in MERGE.values()}
EMPH = {'كرة', 'عينك', 'ودماغك', 'قرر', 'لإجرك', 'ومخك', 'وإجرك', 'نفذت.', 'ChatGPT', 'وكلود', 'وجيميناي', 'مخك.', 'بأدوات', 'إيميل',
        'حلّل', 'تعليماتي.', 'بحلّل', 'ويقرر', 'يستقبل', 'ويبعث', 'وكيل', 'أدوات', 'هدف.'}
words = []
for k, w in enumerate(raw):
    if k in SKIP: continue
    text, e = FIX.get(k, w['w']), w['e']
    if k in MERGE:
        j, text = MERGE[k]; e = raw[j]['e']
    i = len(words)
    words.append({'i': i, 'w': text, 's': w['s'], 'e': e, 'p': w['p'], 'emph': text in EMPH})
out = {'source': 'Ai vs Ai Agent.m4a.mp4 (faster-whisper large-v3-turbo word timestamps, unchanged)', 'words': words}
for p in ('words.json', r'D:/Content/_BRAND_SYSTEM/src/episodes/aiagent/data/words.json'):
    json.dump(out, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for w in words: print(w['i'], round(w['s'] * 30), round(w['e'] * 30), w['w'], '*' if w['emph'] else '')
