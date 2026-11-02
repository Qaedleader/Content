"""Audio QC: (1) narration alignment in the exported MP4 vs the original decode (cross-correlation lag),
(2) residual check: exported audio minus (music+sfx stems) vs original voice * master gain,
(3) masking check: during spoken words, how close do music+sfx get to the voice level."""
import sys, json, subprocess, numpy as np, soundfile as sf
from scipy import signal
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
mp4 = sys.argv[1]
SR = 44100
dec = subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-i', mp4, '-map', '0:a', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
out = np.frombuffer(dec, np.float32).reshape(-1, 2).astype(np.float64)
vo, _ = sf.read('narration_decoded_f32.wav', dtype='float64', always_2d=True)
mus, _ = sf.read('music_stem.wav', dtype='float64', always_2d=True)
sfx, _ = sf.read('sfx_stem.wav', dtype='float64', always_2d=True)
rep = json.load(open('mix_report.json'))
g = 10 ** (rep['master_gain_dB'] / 20)
n = min(len(out), len(mus))
# (1) lag via cross-correlation on first 20 s (mono)
a = out[:20 * SR].mean(1); b = (vo[:20 * SR] * g).mean(1)
c = signal.correlate(a, b, mode='full', method='fft'); lag = int(np.argmax(c) - (len(b) - 1))
# (2) residual: out - stems vs voice*g (AAC encode means not bit-exact; report correlation + SNR)
est_voice = out[:n] - mus[:n] - sfx[:n]
ref = np.zeros((n, 2)); m = min(n, len(vo)); ref[:m] = vo[:m] * g
err = est_voice - ref
snr = 10 * np.log10(np.sum(ref ** 2) / np.sum(err ** 2))
corr = np.corrcoef(est_voice[:m].mean(1), ref[:m].mean(1))[0, 1]
# (3) masking during words
words = json.load(open('../02_TIMING/words.json', encoding='utf-8'))['words']
sb = signal.butter(4, [200, 4000], 'bandpass', fs=SR, output='sos')
bed = signal.sosfilt(sb, (mus[:n] + sfx[:n]).mean(1)); v = signal.sosfilt(sb, ref.mean(1))  # speech band
worst = []
for w in words:
    s0, s1 = int(w['s'] * SR), int(w['e'] * SR)
    rv = np.sqrt(np.mean(v[s0:s1] ** 2)) + 1e-9; rb = np.sqrt(np.mean(bed[s0:s1] ** 2)) + 1e-9
    worst.append((20 * np.log10(rb / rv), w['i'], w['w'], w['s']))
worst.sort(reverse=True)
res = {'lag_samples': lag, 'lag_ms': lag / SR * 1000, 'voice_recovery_snr_dB': round(snr, 1), 'voice_recovery_corr': round(corr, 5),
       'bed_vs_voice_during_words_dB_median': round(float(np.median([x[0] for x in worst])), 1),
       'worst_5_words_bed_minus_voice_dB': [(round(x[0], 1), x[1], x[2], x[3]) for x in worst[:5]],
       'duration_s': len(out) / SR}
print(json.dumps(res, ensure_ascii=False, indent=1))
json.dump(res, open('qc_audio_report.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
