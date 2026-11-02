"""Whisper-small (ONNX, local) transcription + word-level alignment via cross-attention DTW.
Reads the 16 kHz analysis copy of the narration only; never touches the original.
Usage: python3 transcribe_align.py <wav16k> <model_dir> <out_json> chunk_bounds...
"""
import sys, json, numpy as np, soundfile as sf, onnxruntime as ort
from tokenizers import Tokenizer

wav, mdir, out = sys.argv[1], sys.argv[2], sys.argv[3]
bounds = [float(x) for x in sys.argv[4:]]
SR = 16000
audio, sr = sf.read(wav); assert sr == SR
if audio.ndim > 1: audio = audio.mean(1)
total = len(audio) / SR
if not bounds: bounds = [0, total]
if bounds[-1] < total: bounds.append(total)

def hz2mel(f):  # slaney
    f = np.asarray(f, float); m = f / (200.0 / 3)
    lo = f >= 1000.0
    m = np.where(lo, 15 + np.log(np.maximum(f, 1e-9) / 1000.0) / (np.log(6.4) / 27.0), m)
    return m
def mel2hz(m):
    m = np.asarray(m, float); f = m * 200.0 / 3
    lo = m >= 15
    return np.where(lo, 1000.0 * np.exp((np.log(6.4) / 27.0) * (m - 15)), f)
def mel_filters(n_fft=400, n_mels=80):
    fft_f = np.linspace(0, SR / 2, n_fft // 2 + 1)
    mpts = np.linspace(hz2mel(0), hz2mel(8000), n_mels + 2); hz = mel2hz(mpts)
    fd = np.diff(hz); ramps = hz[:, None] - fft_f[None, :]
    W = np.zeros((n_mels, len(fft_f)))
    for i in range(n_mels):
        lo = -ramps[i] / fd[i]; hi = ramps[i + 2] / fd[i + 1]
        W[i] = np.maximum(0, np.minimum(lo, hi))
    W *= (2.0 / (hz[2:n_mels + 2] - hz[:n_mels]))[:, None]
    return W
MEL = mel_filters()
def logmel(x):
    x = np.pad(x, (0, max(0, 480000 - len(x))))[:480000]
    xp = np.pad(x, (200, 200), mode='reflect')
    win = 0.5 - 0.5 * np.cos(2 * np.pi * np.arange(400) / 400)
    n = 1 + (len(xp) - 400) // 160
    fr = np.lib.stride_tricks.as_strided(xp, (n, 400), (xp.strides[0] * 160, xp.strides[0]))
    spec = np.abs(np.fft.rfft(fr * win, axis=1)) ** 2
    spec = spec[:-1].T
    m = MEL @ spec
    lg = np.log10(np.maximum(m, 1e-10)); lg = np.maximum(lg, lg.max() - 8.0)
    return ((lg + 4.0) / 4.0).astype(np.float32)[None]

tok = Tokenizer.from_file(f"{mdir}/tokenizer.json")
gen = json.load(open(f"{mdir}/generation_config.json"))
heads = gen['alignment_heads']
suppress = set(gen['suppress_tokens'])
enc = ort.InferenceSession(f"{mdir}/onnx/encoder_model_quantized.onnx")
dec = ort.InferenceSession(f"{mdir}/onnx/decoder_model_merged_quantized.onnx")
TS0 = 50364; EOT = 50257
PROMPT = [50258, 50272, 50359]  # sot, ar, transcribe (timestamps on)

def decode_chunk(x):
    feats = logmel(x)
    eh = enc.run(['last_hidden_state'], {'input_features': feats})[0]
    past = {}
    for l in range(12):
        for k in ('decoder.key', 'decoder.value', 'encoder.key', 'encoder.value'):
            past[f'past_key_values.{l}.{k}'] = np.zeros((1, 12, 0, 64), np.float32)
    seq = list(PROMPT); ids = np.array([seq], np.int64); first = True
    cross = []  # per step: [layer][1,12,q,1500]
    out_names = [o.name for o in dec.get_outputs()]
    for step in range(440):
        feed = {'input_ids': ids, 'encoder_hidden_states': eh, 'use_cache_branch': np.array([not first])}
        feed.update(past)
        res = dict(zip(out_names, dec.run(None, feed)))
        logits = res['logits'][0, -1].astype(np.float64)
        for l in range(12):
            past[f'past_key_values.{l}.decoder.key'] = res[f'present.{l}.decoder.key']
            past[f'past_key_values.{l}.decoder.value'] = res[f'present.{l}.decoder.value']
            if first:
                past[f'past_key_values.{l}.encoder.key'] = res[f'present.{l}.encoder.key']
                past[f'past_key_values.{l}.encoder.value'] = res[f'present.{l}.encoder.value']
        cross.append([res[f'cross_attentions.{l}'][0] for l in range(12)])
        for s in suppress: logits[s] = -np.inf
        logits[50363] = -np.inf  # no_timestamps
        gen_part = seq[len(PROMPT):]
        if not gen_part: logits[:TS0] = -np.inf; logits[TS0 + 2:] = -np.inf  # start with ts <= 0.02
        else:
            last_ts = gen_part[-1] >= TS0
            prev_ts = len(gen_part) > 1 and gen_part[-2] >= TS0
            if last_ts and prev_ts: logits[TS0:] = -np.inf
            elif last_ts: logits[:EOT] = -np.inf  # after a single ts must come text or ts
            tss = [t for t in gen_part if t >= TS0]
            if tss: logits[TS0:tss[-1] + (0 if last_ts and not prev_ts else 1)] = -np.inf
            # if timestamp prob mass > max text prob, force timestamp
            lp = logits - np.logaddexp.reduce(logits[np.isfinite(logits)])
            ts_mass = np.logaddexp.reduce(lp[TS0:][np.isfinite(lp[TS0:])]) if np.isfinite(lp[TS0:]).any() else -np.inf
            if ts_mass > np.max(lp[:TS0]): logits[:TS0] = -np.inf
        nxt = int(np.argmax(logits))
        seq.append(nxt); first = False
        ids = np.array([[nxt]], np.int64)
        if nxt == EOT: break
    # Build cross-attention matrix [layer,head,token,frame] for all output positions
    rows = []
    for st in cross:
        rows.append(np.stack([a[:, -1, :] for a in st]))  # [12 layers,12 heads,1500] for the query of this step
    # step 0 has queries for all prompt tokens; take its last row which predicts first gen token
    A = np.stack(rows, 2)  # [L,H,T,1500]; T == len(seq)-len(PROMPT)
    return seq[len(PROMPT):], A

def dtw(cost):
    N, M = cost.shape
    D = np.full((N + 1, M + 1), np.inf); D[0, 0] = 0
    tr = np.zeros((N + 1, M + 1), np.int8)
    for i in range(1, N + 1):
        for j in range(1, M + 1):
            c = (D[i - 1, j - 1], D[i - 1, j], D[i, j - 1])
            k = int(np.argmin(c)); D[i, j] = cost[i - 1, j - 1] + c[k]; tr[i, j] = k
    i, j = N, M; path = []
    while i > 0 and j > 0:
        path.append((i - 1, j - 1)); k = tr[i, j]
        if k == 0: i -= 1; j -= 1
        elif k == 1: i -= 1
        else: j -= 1
    return path[::-1]

def medfilt(x, w=7):
    p = w // 2; xp = np.pad(x, ((0, 0), (p, p)), mode='reflect')
    return np.stack([np.median(xp[:, i:i + w], 1) for i in range(x.shape[1])], 1)

results = []
for ci in range(len(bounds) - 1):
    t0, t1 = bounds[ci], bounds[ci + 1]
    x = audio[int(t0 * SR):int(t1 * SR)]
    toks, A = decode_chunk(x)
    nfr = int(round((t1 - t0) / 0.02))
    text_idx = [i for i, t in enumerate(toks) if t < EOT]
    W = np.stack([A[l, h] for l, h in heads])  # [nh, T, 1500]
    # row r holds the query of the token *fed* at step r; generated token i is fed at step i+1
    W = W[:, [i + 1 for i in text_idx], :nfr]
    W = (W - W.mean(1, keepdims=True)) / (W.std(1, keepdims=True) + 1e-9)
    W = np.stack([medfilt(w) for w in W]).mean(0)
    path = dtw(-W)
    tstart = {}
    for ti, fj in path: tstart.setdefault(ti, fj)
    tend = {}
    for ti, fj in path: tend[ti] = fj
    words = []
    for k, i in enumerate(text_idx):
        piece = tok.decode([toks[i]])
        s = t0 + tstart[k] * 0.02; e = t0 + (tend[k] + 1) * 0.02
        if piece.startswith(' ') or not words:
            words.append({'w': piece.strip(), 'start': round(s, 2), 'end': round(e, 2), 'tok': [toks[i]]})
        else:
            words[-1]['tok'].append(toks[i]); words[-1]['end'] = round(e, 2)
    for w in words:
        w['w'] = tok.decode(w.pop('tok')).strip()
    words = [w for w in words if w['w']]
    segs = []; cur = None
    for t in toks:
        if t >= TS0:
            ts = t0 + (t - TS0) * 0.02
            if cur is None: cur = {'start': round(ts, 2), 'tok': []}
            else:
                cur['end'] = round(ts, 2); cur['text'] = tok.decode(cur.pop('tok')).strip(); segs.append(cur); cur = None
        elif t < EOT and cur is not None: cur['tok'].append(t)
    results.append({'chunk': [t0, t1], 'segments': segs, 'words': words})
    print(f'chunk {ci} {t0:.2f}-{t1:.2f}:', ' | '.join(s['text'] for s in segs), flush=True)
json.dump({'audio_duration': total, 'chunks': results}, open(out, 'w'), ensure_ascii=False, indent=1)
