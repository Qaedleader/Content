"""Build the verified word list (words.json) from Whisper output + region re-checks + silencedetect.
Text fixes keep the narrator's own Levantine wording; only Whisper mis-hearings are corrected (see TRANSCRIPT.md)."""
import json
d = json.load(open('whisper_words.json', encoding='utf-8'))
W = [dict(w) for s in d['segments'] for w in s['words']]
fix_text = {1: 'مصاريك،', 13: 'تخيّل', 33: 'الحديد', 39: 'بتجمّع', 44: 'بتوصّلها', 49: 'بصنع', 52: 'روبوتات',
            55: 'بطوّرها؟', 60: 'الروبوتات', 76: 'تقريباً.', 88: 'والمصاري', 100: 'تفكّر', 120: 'مثلاً',
            126: 'بتشغّل', 129: 'الروبوتات.', 136: 'مصاري،', 82: 'والدوا.', 57: 'الاصطناعي.'}
fix_time = {51: (None, 20.87), 52: (21.07, None), 129: (None, 53.06), 130: (53.45, None)}
for i, t in fix_text.items(): W[i]['w'] = t
for i, (s, e) in fix_time.items():
    if s is not None: W[i]['s'] = s
    if e is not None: W[i]['e'] = e
# merge "اللي"+"تعرف" -> "لتعرف" (region re-check: short proclitic, not a separate word) and "99"+".9"+"%" -> "99.9%"
W[10:12] = [{'w': 'لتعرف', 's': W[10]['s'], 'e': W[11]['e'], 'p': min(W[10]['p'], W[11]['p'])}]
i = next(k for k, w in enumerate(W) if w['w'] == '99')
W[i:i + 3] = [{'w': '99.9%', 's': W[i]['s'], 'e': W[i + 2]['e'], 'p': W[i]['p']}]
out = [{'i': k, 'w': w['w'], 's': round(w['s'], 3), 'e': round(w['e'], 3), 'p': w['p']} for k, w in enumerate(W)]
json.dump({'source': 'narration_original.m4a (decoded, 0 s = first decoded sample)', 'duration': 58.58, 'words': out},
          open('words.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for w in out: print(w['i'], w['s'], w['e'], w['w'])
