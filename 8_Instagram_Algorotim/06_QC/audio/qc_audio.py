"""Audio integrity QC for INSTAGRAM_ALGORITHM_FINAL.mp4: narration stem == source decode (bit-exact), output aligned at 0 lag,
voice fully present to the last sample, source file untouched (sha256)."""
import hashlib, json, os, subprocess
import numpy as np, soundfile as sf
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
ROOT = r'D:/Content/8_Instagram_Algorotim'
SRC = os.path.join(ROOT, 'Instagram algorithm.m4a.mp4'); OUT = os.path.join(ROOT, '07_OUTPUT', 'INSTAGRAM_ALGORITHM_FINAL.mp4')
dec = lambda p: np.frombuffer(subprocess.run([FF, '-nostdin', '-v', 'error', '-i', p, '-map', '0:a', '-f', 'f32le', '-c:a', 'pcm_f32le', '-'], capture_output=True, check=True).stdout, np.float32).reshape(-1, 2)
src = dec(SRC); out = dec(OUT)
stem, _ = sf.read(os.path.join(ROOT, '04_PRODUCTION', 'audio', 'narration_stem.wav'), dtype='float32')
mix, _ = sf.read(os.path.join(ROOT, '04_PRODUCTION', 'audio', 'final_mix.wav'), dtype='float32')
n = len(src)
r = {}
r['source_samples'] = n; r['source_seconds'] = n / 44100
r['output_audio_samples'] = len(out); r['output_audio_seconds'] = len(out) / 44100
r['stem_equals_source_decode_bitexact'] = bool(np.array_equal(stem[:n], src)) and bool(np.all(stem[n:] == 0))
r['stem_md5'] = hashlib.md5(stem[:n].tobytes()).hexdigest(); r['source_decode_md5'] = hashlib.md5(src.tobytes()).hexdigest()
# lag between output and the source voice (cross-correlation on a 20 s window)
a = src[44100 * 5:44100 * 25, 0].astype(np.float64); b = out[44100 * 5 - 2000:44100 * 25 + 2000, 0].astype(np.float64)
cc = np.correlate(b, a, 'valid'); r['lag_samples'] = int(np.argmax(cc) - 2000)
m = min(len(out), len(mix))
err = out[:m] - mix[:m]
r['aac_vs_mix_SNR_dB'] = float(10 * np.log10((mix[:m] ** 2).sum() / (err ** 2).sum()))
# voice still present at the very end: correlation of output vs source in the last 1.5 s of speech
t0, t1 = int(46.4 * 44100), int(47.9 * 44100)
r['last_words_corr'] = float(np.corrcoef(out[t0:t1, 0], src[t0:t1, 0])[0, 1])
r['voice_presence_full'] = r['output_audio_samples'] >= n
r['source_sha256_after'] = hashlib.sha256(open(SRC, 'rb').read()).hexdigest()
r['source_sha256_before'] = open('sha256_before.txt').read().split()[0]
r['source_untouched'] = r['source_sha256_after'] == r['source_sha256_before']
json.dump(r, open('qc_audio_report.json', 'w'), indent=1); print(json.dumps(r, indent=1))
