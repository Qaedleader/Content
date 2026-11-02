"""whisper_words.json -> words.json. Timings are Whisper's (unchanged); only display spelling corrected after recheck.py
re-listening: «تجارة» (ASR: دجارة), «شركة» (ASR: شركي), «رح أبدأ» (ASR: رح أ + سأبدأ, merged span), ending «شو أول شي بدكم تتعلموه»
(word timings from the recheck pass, which split the span 47.70-48.64 into three words)."""
import json, sys, os
sys.stdout.reconfigure(encoding='utf-8')
d = json.load(open('whisper_words.json', encoding='utf-8'))
raw = [w for s in d['segments'] for w in s['words']]
FIX = {2: 'مليونير؟', 6: '99%', 10: 'مليونير.', 15: 'إنك', 27: 'الأمريكي.', 37: 'دولار،', 43: '10%', 47: 'في', 48: 'مشكلة..', 57: 'هيك،',
       81: 'برمجة،', 89: 'تجارة', 92: 'إشي..', 100: 'شركة', 101: 'كاملة.', 105: 'بالأداة..', 107: 'إنك', 117: 'صح.', 118: 'تابعوني..',
       114: 'فعلاً', 126: 'فعلاً', 129: 'إشي', 135: 'شو', 136: 'أول', 25: '&P', 24: 'S'}
DROP = {7, 44}        # «%» tokens folded into the number words (span extended)
MERGE = {6: 7, 43: 44, 120: 121}
words = []; skip = set()
for k, w in enumerate(raw):
    if k in skip or k in (137, 138): 
        if k == 137:
            for t, s, e in [('شي', 47.70, 47.80), ('بدكم', 47.80, 48.06), ('تتعلموه؟', 48.06, 48.64)]:
                words.append({'w': t, 's': s, 'e': e, 'p': 0.9})
        continue
    txt, e = FIX.get(k, w['w']), w['e']
    if k in MERGE:
        j = MERGE[k]; e = raw[j]['e']; skip.add(j)
        if k == 120: txt = 'أبدأ'
    words.append({'w': txt, 's': w['s'], 'e': e, 'p': w['p']})
# S + &P + 500 -> one display token
out_w = []
i = 0
while i < len(words):
    if words[i]['w'] == 'S' and words[i+1]['w'] == '&P':
        out_w.append({'w': 'S&P 500', 's': words[i]['s'], 'e': words[i+2]['e'], 'p': words[i+2]['p']}); i += 3; continue
    out_w.append(words[i]); i += 1
for n, w in enumerate(out_w): w['i'] = n
EMPH = {'مليونير؟', 'مليونير.', '99%', '500', 'S&P 500', '30', 'مليون', '10%', 'مشكلة..', 'صبر', 'للثروة', 'الذكاء', 'الاصطناعي',
        'أسياد', 'المستقبل', 'لحالك', 'شركة', 'كاملة.', 'السر', 'بالأداة..', 'صح', 'صح.', 'تابعوني..', 'سلسلة', 'بالتعليقات'}
for w in out_w: w['emph'] = w['w'] in EMPH
out = {'source': 'How to be millionaire with Ai.m4a.mp4 (faster-whisper large-v3-turbo word timestamps)', 'decoded_samples': 2155456,
       'decoded_seconds': 2155456 / 44100, 'words': out_w}
for p in ('words.json', r'D:/Content/_BRAND_SYSTEM/src/episodes/millionaire/data/words.json'):
    os.makedirs(os.path.dirname(p) or '.', exist_ok=True)
    json.dump(out, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(' '.join(f"{w['i']}:{w['w']}[{w['s']:.2f}]" for w in out_w))
