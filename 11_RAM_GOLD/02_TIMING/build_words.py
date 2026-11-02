"""whisper_words.json -> words.json (display spelling + emphasis). Timings are Whisper's, unchanged; only display text is corrected
after targeted re-listening passes (recheck.py): «اللي صنعت ChatGPT», «DRAM», dialect spellings. Two words are merged where Whisper
split one spoken term (هذه+الرام -> DRAM): the merged word spans both original timings."""
import json, sys
sys.stdout.reconfigure(encoding='utf-8')
d = json.load(open('whisper_words.json', encoding='utf-8'))
raw = [w for s in d['segments'] for w in s['words']]
FIX = {0: 'تعرف', 1: 'إنه', 9: 'لإشي', 12: 'إنت؟', 13: 'لدرجة', 14: 'إنه', 16: 'ألتمان،', 19: 'اللي صنعت', 20: 'ChatGPT،',
       39: 'اللي جهازك', 72: 'منها.', 74: 'إنه', 76: 'مش', 84: 'إنه', 90: 'جداً',
       128: 'لسنوات.', 141: 'لها', 142: 'حل؟', 37: 'الرام:', 46: 'بسرعة.', 62: 'القوية.', 103: 'الوقت.', 109: 'كبير'}
MERGE = {50: (51, 'DRAM،')}   # «هذه الرام» (Whisper) = spoken «DRAM» (recheck: «دي رام» / «ديرام»)
words = []
skip = set()
for k, w in enumerate(raw):
    if k in skip: continue
    txt, e = FIX.get(k, w['w']), w['e']
    if k in MERGE:
        j, txt = MERGE[k]; e = raw[j]['e']; skip.add(j)
    words.append({'i': len(words), 'raw_i': k, 'w': txt, 's': w['s'], 'e': e, 'p': w['p'], 'emph': False})
EMPH_TXT = {'حرب', 'عالمية', 'عندك', 'سام', 'ألتمان،', 'للناس', 'العاديين،', 'الرام:', 'DRAM،', 'HBM', 'انفجار', 'هائلة', 'المصانع', 'الطلب،',
            'نادر', 'أسعار', 'ارتفعت', 'الموارد', 'لسنوات.', 'الذهب،', 'ChatGPT،'}
for w in words: w['emph'] = w['w'] in EMPH_TXT
out = {'source': 'RAM GOLD.m4a.mp4 (faster-whisper large-v3-turbo word timestamps, unchanged)', 'decoded_seconds': 2274240 / 44100, 'words': words}
for p in ('words.json', r'D:/Content/_BRAND_SYSTEM/src/episodes/ramgold/data/words.json'):
    import os; os.makedirs(os.path.dirname(p) or '.', exist_ok=True)
    json.dump(out, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(' '.join(f"{w['i']}:{w['w']}" for w in words))
