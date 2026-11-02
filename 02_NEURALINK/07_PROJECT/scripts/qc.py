"""Quality control of the exported MP4 (reads the actual file, not the project).
Checks: container/streams, decode errors, frame count, black frames, frozen runs, 1-fps contact sheets,
audio vs master narration (lag + correlation per 5 s window), audio vs final mix, loudness/true peak.
Usage: python qc.py <final.mp4> <out_dir>"""
import sys, os, subprocess, json, re
import numpy as np, cv2, soundfile as sf
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FF = os.path.join(ROOT, '.venv', 'bin', 'ffmpeg.exe')
mp4, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
R = {'file': mp4, 'bytes': os.path.getsize(mp4)}

info = subprocess.run([FF, '-hide_banner', '-i', mp4], capture_output=True, text=True).stderr
R['streams'] = [l.strip() for l in info.splitlines() if 'Stream #' in l or 'Duration' in l]
dec = subprocess.run([FF, '-v', 'error', '-i', mp4, '-f', 'null', '-'], capture_output=True, text=True).stderr.strip()
R['decode_errors'] = dec[:2000] if dec else 'none'

cap = cv2.VideoCapture(mp4)
R['cv2_fps'] = cap.get(cv2.CAP_PROP_FPS); R['cv2_size'] = (int(cap.get(3)), int(cap.get(4)))
means, black, prev, frozen_runs, run, n = [], [], None, [], 0, 0
thumbs = []
while True:
    ok, f = cap.read()
    if not ok: break
    small = cv2.resize(f, (108, 192), interpolation=cv2.INTER_AREA).astype(np.float32)
    m = small.mean(); means.append(m)
    if m < 6: black.append(n)
    if prev is not None:
        d = np.abs(small - prev).mean()
        if d < 0.35: run += 1
        else:
            if run >= 12: frozen_runs.append((n - run - 1, n - 1))
            run = 0
    prev = small
    if n % 30 == 15: thumbs.append((n, cv2.cvtColor(cv2.resize(f, (270, 480), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2RGB)))
    n += 1
if run >= 12: frozen_runs.append((n - run - 1, n - 1))
R['frames_decoded'] = n; R['duration_video_s'] = n / 30.0
R['black_frames(mean<6)'] = black; R['frozen_runs(>=12 near-identical frames)'] = frozen_runs
R['luma_mean_min_max'] = (float(min(means)), float(max(means)))
# contact sheets: 1 fps
per = 24
for s in range(0, len(thumbs), per):
    chunk = thumbs[s:s + per]; cols = 8; rows = (len(chunk) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * 270, rows * 500), (30, 30, 30)); d = ImageDraw.Draw(sheet)
    for i, (fn, im) in enumerate(chunk):
        x, y = (i % cols) * 270, (i // cols) * 500
        sheet.paste(Image.fromarray(im), (x, y + 20)); d.text((x + 4, y + 3), f't={fn / 30:.1f}s', fill=(255, 255, 0))
    sheet.save(os.path.join(out, f'sheet_{s // per:02d}.jpg'), quality=85)

# audio
wav = os.path.join(out, 'final_audio.wav')
subprocess.run([FF, '-v', 'error', '-y', '-i', mp4, '-map', '0:a:0', '-c:a', 'pcm_f32le', wav], check=True)
a, sr = sf.read(wav, dtype='float32', always_2d=True)
vo, sr2 = sf.read(os.path.join(ROOT, 'timing', 'vo_decoded_f32.wav'), dtype='float32', always_2d=True)
mix, sr3 = sf.read(os.path.join(ROOT, 'audio', 'final_mix.wav'), dtype='float32', always_2d=True)
R['audio_sr'] = sr; R['audio_channels'] = a.shape[1]; R['audio_duration_s'] = len(a) / sr
R['vo_duration_s'] = len(vo) / sr2
def lag_corr(x, y, maxlag=4000):
    x = x[:min(len(x), len(y))]; y = y[:len(x)]
    seg = slice(int(5 * sr), int(25 * sr))
    xs, ys = x[seg], y[seg]
    best = max(range(-maxlag, maxlag + 1, 1), key=lambda L: np.dot(xs[max(0, L):len(xs) + min(0, L)], ys[max(0, -L):len(ys) - max(0, L)])) if False else None
    c = np.fft.irfft(np.fft.rfft(xs, 2 * len(xs)) * np.conj(np.fft.rfft(ys, 2 * len(xs))))
    c = np.concatenate([c[-maxlag:], c[:maxlag + 1]]); L = int(np.argmax(c)) - maxlag
    return L
am, vm, mm = a.mean(1), vo.mean(1), mix.mean(1)
R['lag_samples_audio_vs_vo'] = lag_corr(am, vm); R['lag_samples_audio_vs_mix'] = lag_corr(am, mm)
L = min(len(am), len(mm)); R['corr_audio_vs_final_mix'] = float(np.corrcoef(am[:L], mm[:L])[0, 1])
L = min(len(am), len(vm)); R['corr_audio_vs_vo_full'] = float(np.corrcoef(am[:L], vm[:L])[0, 1])
win = []
for s0 in np.arange(0, L / sr - 0.5, 5.0):
    i0, i1 = int(s0 * sr), int(min(L, (s0 + 5) * sr))
    if np.std(vm[i0:i1]) < 1e-4: win.append((float(s0), None)); continue
    win.append((float(s0), round(float(np.corrcoef(am[i0:i1], vm[i0:i1])[0, 1]), 3)))
R['corr_audio_vs_vo_per_5s'] = win
eb = subprocess.run([FF, '-hide_banner', '-nostats', '-i', mp4, '-map', '0:a:0', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
summ = eb[eb.rfind('Summary:'):]
R['loudness_summary'] = ' '.join(summ.split())
R['sample_peak_dbfs'] = float(20 * np.log10(np.abs(a).max() + 1e-12))
R['clipped_samples(|x|>=0.999)'] = int((np.abs(a) >= 0.999).sum())
json.dump(R, open(os.path.join(out, 'qc_report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in R.items() if k != 'corr_audio_vs_vo_per_5s'}, ensure_ascii=False, indent=1))
print('per-5s VO corr:', [w[1] for w in win])
