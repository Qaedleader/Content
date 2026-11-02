"""Build words_display.json: Whisper word timings with corrected display spelling, emphasis flags and caption
chunks. Timing values are taken unchanged from whisper_words.json (display text only is corrected):
  [2,3] «سأشرح لك» -> «بشرح لك» (Levantine narration) · [43,44] «عمل لي» -> «اعمل لي» · [45] «برومت» -> «برومبت»
  [67] «بVersel» -> «بـ Vercel» · [68] «وضغط» -> «واضغط» · [69] «deploy» -> «Deploy»
  [70,71] «بعدين انجح» (p 0.21 / 0.64) -> «بعد ما ينجح»"""
import json
d = json.load(open('whisper_words.json', encoding='utf-8'))
ws = [w for s in d['segments'] for w in s['words']]
MAP = [('بثلاثين', [0], 1), ('ثانية', [1], 1), ('بشرح', [2], 0), ('لك', [3], 0), ('كيف', [4], 0), ('تعمل', [5], 0),
 ('الموقع', [6], 1), ('اللي', [7], 0), ('ببالك', [8], 0), ('وتخليه', [9], 0), ('Live', [10], 1),
 ('أول', [11], 0), ('شي', [12], 0), ('خطّط', [13], 1), ('فكرتك', [14], 0), ('مع', [15], 0), ('ChatGPT', [16], 1),
 ('وحدّد', [17], 0), ('شو', [18], 0), ('بدك', [19], 0), ('بالموقع', [20], 0),
 ('بعدين', [21], 0), ('افتح', [22], 0), ('VS Code', [23, 24], 1), ('على', [25], 0), ('جهازك', [26], 0),
 ('وافتح', [27], 0), ('التيرمنال', [28], 1), ('ثبّت', [29], 0), ('Claude Code', [30, 31], 1), ('وسجّل', [32], 0),
 ('دخولك', [33], 0), ('وشغّله', [34], 0), ('داخل', [35], 0), ('مجلد', [36], 0), ('المشروع', [37], 1),
 ('ارجع', [38], 0), ('لـ', [39], 0), ('ChatGPT', [40], 1), ('وقل', [41], 0), ('له', [42], 0), ('اعمل', [43], 0),
 ('لي', [44], 0), ('برومبت', [45], 1), ('شامل', [46], 1), ('لكلود', [47], 0), ('كود', [48], 0), ('ينفّذ', [49], 0),
 ('هاي', [50], 0), ('الفكرة', [51], 0), ('كاملة', [52], 0),
 ('بعدين', [53], 0), ('انسخ', [54], 1), ('البرومبت', [55], 0), ('أعطيه', [56], 0), ('لكلود', [57], 1),
 ('وخلّيه', [58], 0), ('يكتب', [59], 0), ('المشروع', [60], 1),
 ('بعدين', [61], 0), ('ارفع', [62], 0), ('الكود', [63], 0), ('على', [64], 0), ('GitHub', [65], 1), ('اربط', [66], 0),
 ('بـ Vercel', [67], 1), ('واضغط', [68], 0), ('Deploy', [69], 1),
 ('بعد ما', [70], 0), ('ينجح', [71], 0), ('النشر', [72], 0), ('صار', [73], 0), ('عندك', [74], 0), ('رابط', [75], 1),
 ('لموقعك', [76], 1), ('بتقدر', [77], 0), ('تبعثه', [78], 0), ('لأي', [79], 0), ('حدا', [80], 1)]
used = sorted({i for _, ix, _ in MAP for i in ix})
assert used == list(range(len(ws))), 'every Whisper word must be covered'
tokens = [{'w': txt, 's': ws[ix[0]]['s'], 'e': ws[ix[-1]]['e'], 'hi': bool(hi), 'src': [ws[i]['w'] for i in ix]} for txt, ix, hi in MAP]
SIZES = [2, 4, 3, 2, 3, 3, 4, 3, 2, 2, 2, 2, 4, 3, 4, 2, 3, 3, 3, 2, 3, 3, 2, 2, 2, 3, 3, 1, 2, 2]
CH, a = [], 0
for n in SIZES:
    CH.append((a, a + n - 1)); a += n
assert a == len(tokens), (a, len(tokens))
json.dump({'note': 'times = narration seconds (presentation 0 after the edit list)', 'tokens': tokens, 'chunks': CH},
          open('words_display.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(tokens), 'tokens', len(CH), 'chunks')
for k, (a, b) in enumerate(CH):
    print(f"{k:2d} [{a:3d}] {tokens[a]['s']:6.2f}-{tokens[b]['e']:6.2f}  " + ' '.join(tokens[i]['w'] for i in range(a, b + 1)))
