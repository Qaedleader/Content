"""Build words_display.json for the NEW recording: Whisper word timings (unchanged) with display spelling,
emphasis flags and caption chunks.  Display-only corrections of Whisper spellings (audio untouched):
  «التيرفون» -> «التلفون» (x2) · [70] «بنتق» -> «بينتقل» · [71] «اللاسلكيا» -> «لاسلكياً» · [76] «الأيردروب» -> «AirDrop»
  plus shadda / tanween / question marks for readability."""
import json
d = json.load(open('whisper_words.json', encoding='utf-8'))
ws = [w for s in d['segments'] for w in s['words']]
DISP = {3: 'هواوي', 23: 'هالحركتين؟', 9: 'قدّام', 10: 'التلفون', 12: 'وبتوصل', 16: 'فعلاً', 18: 'بتتخزّن', 19: 'بإيده؟', 26: 'بالإيد',
        30: 'بيشوفه', 31: 'لمّا', 33: 'يسكّر', 34: 'إيده', 36: 'بيتعرّف', 38: 'الحركة', 47: 'الملف', 52: 'الإرسال',
        53: 'ولمّا', 55: 'قدّام', 56: 'التلفون', 57: 'الثاني', 65: 'استقبال', 68: 'النظام', 70: 'بينتقل', 71: 'لاسلكياً',
        76: 'AirDrop', 82: 'بإيده', 85: 'لاسلكياً', 91: 'الإيد', 95: 'الماركتينج', 98: 'قدّموها', 100: 'بتحسّس'}
HI = {3, 5, 7, 8, 12, 14, 18, 23, 25, 26, 29, 30, 33, 38, 42, 52, 54, 61, 65, 71, 76, 81, 85, 86, 90, 91, 94, 95, 99, 103, 105}
tokens = []
for i, w in enumerate(ws):
    txt = DISP.get(i, w['w'].strip('،,.؟?'))
    tokens.append({'w': txt, 's': w['s'], 'e': w['e'], 'hi': i in HI, 'src': w['w']})
# caption chunk starts (indices), clause-aligned
STARTS = [0, 3, 4, 6, 8, 10, 12, 13, 15, 17, 20, 22, 24, 27, 29, 31, 33, 35, 37, 39, 42, 45, 48, 50, 53, 55, 58, 61, 63, 66,
          69, 71, 72, 74, 77, 79, 83, 86, 87, 90, 92, 94, 96, 98, 100, 103]
CH = [(a, (STARTS[k + 1] - 1 if k + 1 < len(STARTS) else len(tokens) - 1)) for k, a in enumerate(STARTS)]
json.dump({'note': 'times = narration seconds (decoded audio; 0 = first sample = presentation 0 after the edit list)',
           'tokens': tokens, 'chunks': CH}, open('words_display.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(tokens), 'tokens', len(CH), 'chunks')
for k, (a, b) in enumerate(CH):
    print(f"{k:2d} [{a:3d}] {tokens[a]['s']:6.2f}-{tokens[b]['e']:6.2f}  " + ' '.join(tokens[i]['w'] for i in range(a, b + 1)))
