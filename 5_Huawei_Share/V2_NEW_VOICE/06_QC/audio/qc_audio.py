"""Narration-preservation and mix QC for HUAWEI_SHARE_NEW_VOICE_FINAL.mp4.  python -I qc_audio.py"""
import subprocess, hashlib, json, os
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
SRC = os.path.join(os.path.dirname(ROOT), 'Huawei share New Vid.m4a.mp4')          # the supplied file itself
AUD = os.path.join(ROOT, '04_PRODUCTION', 'audio'); OUT = os.path.join(ROOT, '07_OUTPUT', 'HUAWEI_SHARE_NEW_VOICE_FINAL.mp4')
dec = lambda p: np.frombuffer(subprocess.run([FF, '-nostdin', '-v', 'error', '-i', p, '-map', '0:a', '-f', 'f32le', '-c:a', 'pcm_f32le', '-'],
                                             capture_output=True, check=True).stdout, np.float32).reshape(-1, 2)
md5 = lambda a: hashlib.md5(np.ascontiguousarray(a).tobytes()).hexdigest()
src = dec(SRC); n = len(src)
narr = sf.read(os.path.join(AUD, 'narration_stem.wav'), dtype='float32')[0]
mus = sf.read(os.path.join(AUD, 'music_stem.wav'), dtype='float32')[0]; sfx = sf.read(os.path.join(AUD, 'sfx_stem.wav'), dtype='float32')[0]
mix = sf.read(os.path.join(AUD, 'final_mix.wav'), dtype='float32')[0]
r = {}
r['source_decoded_samples'] = n; r['source_decoded_seconds'] = n / 44100
r['source_pcm_md5'] = md5(src); r['stem_pcm_md5_first_n'] = md5(narr[:n])
r['stem_tail_after_source_is_silence'] = bool(np.all(narr[n:] == 0)); r['stem_tail_samples'] = len(narr) - n
r['narration_stem_bit_identical_to_source_decode'] = r['source_pcm_md5'] == r['stem_pcm_md5_first_n']
r['mix_minus_stems_max_abs'] = float(np.abs(mix - (narr + mus + sfx)).max())
fin = dec(OUT); r['final_decoded_seconds'] = len(fin) / 44100
L = min(len(fin), len(narr)); v = narr[:L].mean(1); f = fin[:L].mean(1)
# sync: cross-correlation lag of the final soundtrack against the narration over +-50 ms, start / middle / end
def lag(a, b, s, e, maxlag=2205):
    a, b = a[s:e], b[s - maxlag:e + maxlag] if s >= maxlag else np.pad(b[:e + maxlag], (maxlag - s, 0))
    c = np.correlate(b, a, 'valid'); return int(np.argmax(c) - maxlag)
for name, s in (('start', 44100 * 1), ('middle', 44100 * 22), ('end', 44100 * 43)):
    r[f'sync_lag_samples_{name}'] = lag(v, f, s, s + 44100 * 2)
# level of everything that is not the narration (music + SFX + AAC coding error) relative to the voice, per 400 ms window
w = 17640; k = L // w
vr = np.sqrt((v[:k * w].reshape(k, w) ** 2).mean(1)); dr = np.sqrt(((f - v)[:k * w].reshape(k, w) ** 2).mean(1))
sp = vr > 10 ** (-35 / 20)
rel = 20 * np.log10(dr[sp] / vr[sp])
r['speech_windows'] = int(sp.sum()); r['nonvoice_vs_voice_dB_median'] = float(np.median(rel)); r['nonvoice_vs_voice_dB_max'] = float(rel.max())
r['final_sample_peak'] = float(np.abs(fin).max()); r['final_samples_over_1.0'] = int((np.abs(fin) > 1.0).sum())
r['source_sha256_after'] = hashlib.sha256(open(SRC, 'rb').read()).hexdigest()
r['copy_sha256'] = hashlib.sha256(open(os.path.join(ROOT, '01_AUDIO', 'Original', 'Huawei_share_New_Vid.m4a.mp4'), 'rb').read()).hexdigest()
json.dump(r, open(os.path.join(HERE, 'qc_audio_report.json'), 'w'), indent=1); print(json.dumps(r, indent=1))
