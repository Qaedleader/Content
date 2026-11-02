"""whisper_words.json -> words.json for the Remotion episode (display spelling + emphasis).
Word timings are unchanged; two Whisper mis-splits are merged (start of first, end of second)."""
import json
d = json.load(open('whisper_words.json', encoding='utf-8'))
raw = [w for s in d['segments'] for w in s['words']]
FIX = {11: 'بكرا', 36: 'بكرا', 52: 'وقف', 67: 'بحلل', 68: 'تصرفاتك', 84: 'وبناءً', 96: 'قيسوا', 1: 'الإنستغرام', 38: 'الإنستغرام', 107: 'إنستغرام'}
MERGE = {64: (65, 'الذكاء'), 90: (91, 'يجذبك')}          # raw index -> (absorbed index, display text)
SKIP = {m[0] for m in MERGE.values()}
EMPH = {'أفكارك؟', 'بكرا', 'المطر،', 'شقة', 'قطار', 'السفر،', 'بأوروبا،', 'إشارات،', 'الذكاء', 'ملايين', 'الأنماط', 'بالمستقبل،', 'الشغل', 'والدراسة', 'والشراء', 'الأخطر', 'خلاك'}
words = []
for k, w in enumerate(raw):
    if k in SKIP: continue
    text, e = FIX.get(k, w['w']), w['e']
    if k in MERGE:
        j, text = MERGE[k]; e = raw[j]['e']
    i = len(words)
    words.append({'i': i, 'w': text, 's': w['s'], 'e': e, 'p': w['p'], 'emph': text in EMPH})
out = {'source': 'Instagram algorithm.m4a.mp4 (faster-whisper large-v3-turbo word timestamps, unchanged)', 'decoded_seconds': 2118592 / 44100, 'words': words}
for p in ('words.json', r'D:/Content/_BRAND_SYSTEM/src/episodes/igalgo/data/words.json'):
    json.dump(out, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for w in words: print(w['i'], round(w['s'] * 30), w['w'], '*' if w['emph'] else '')
