"""Refine chunks that word_align.py timed proportionally: snap them to the measured speech onset/offset
(20 ms RMS above -34 dBFS) inside the chunk window, then redistribute words by length. Writes words.json in place
(original kept as words_v1.json) and logs every change to refine_log.json."""
import json, shutil, numpy as np, soundfile as sf
log = json.load(open('word_align_log.json', encoding='utf-8'))
prop = {c['chunk'] for c in log if c['method'].startswith('proportional')}
shutil.copy('words_v1.json', 'words.json')  # always start from the word_align output
d = json.load(open('words_v1.json', encoding='utf-8')); W = d['words']
a, sr = sf.read('vo_16k_analysis.wav', dtype='float32')
hop = int(0.02 * sr)
def active(t0, t1):
    seg = a[int(t0 * sr):int(t1 * sr)]
    n = len(seg) // hop
    rms = 20 * np.log10(np.sqrt(np.mean(seg[:n * hop].reshape(n, hop) ** 2, axis=1)) + 1e-9)
    loud = rms > -34
    idx = np.where(loud)[0]
    if not len(idx): return (t0, t1)
    start = idx[0]
    # if the window opens on the tail of the previous word, speech starts after the first >=100 ms silence (<-45 dBFS)
    quiet = rms < -45; run = 0
    for i in range(min(n, int(0.7 / 0.02))):
        run = run + 1 if quiet[i] else 0
        if run >= 5:
            nxt = np.where(loud[i:])[0]
            if len(nxt): start = i + nxt[0]
            break
    return (t0 + start * 0.02, t0 + (idx[-1] + 1) * 0.02)
changes = []
for c in sorted(prop):
    ws = [w for w in W if w['chunk'] == c]
    s0, e0 = ws[0]['s'], ws[-1]['e']
    s1, e1 = active(max(0, s0 - 0.05), e0 + 0.15)
    L = np.array([len(w['w']) + 1 for w in ws], float); cum = np.concatenate([[0], np.cumsum(L)]) / L.sum()
    for k, w in enumerate(ws):
        w['s'] = round(s1 + (e1 - s1) * cum[k], 3); w['e'] = round(s1 + (e1 - s1) * cum[k + 1], 3)
    changes.append({'chunk': c, 'text': ' '.join(w['w'] for w in ws), 'before': [s0, e0], 'after': [round(s1, 3), round(e1, 3)]})
    print(c, ' '.join(w['w'] for w in ws), (s0, e0), '->', (round(s1, 2), round(e1, 2)))
# keep chunks strictly ordered: if a refined chunk now overlaps its neighbour, end it just before the next onset
chunks = sorted({w['chunk'] for w in W})
for c, nc in zip(chunks, chunks[1:]):
    cw = [w for w in W if w['chunk'] == c]; nxt = [w for w in W if w['chunk'] == nc][0]
    if cw[-1]['e'] > nxt['s'] - 0.02:
        s1, e1 = cw[0]['s'], nxt['s'] - 0.02
        L = np.array([len(w['w']) + 1 for w in cw], float); cum = np.concatenate([[0], np.cumsum(L)]) / L.sum()
        for k, w in enumerate(cw):
            w['s'] = round(s1 + (e1 - s1) * cum[k], 3); w['e'] = round(s1 + (e1 - s1) * cum[k + 1], 3)
        print('clamped chunk', c, 'to end', round(e1, 2))
assert all(W[i]['s'] >= W[i - 1]['s'] for i in range(1, len(W))), 'non-monotonic'
json.dump(d, open('words.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(changes, open('refine_log.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
