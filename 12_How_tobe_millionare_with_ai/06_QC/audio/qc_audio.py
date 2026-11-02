"""QC for both exports (Video 12). Run: python -I qc_audio.py -> qc_audio_report.json
- identical video bitstreams (packet md5) AND identical decoded frames (decoded framemd5) between WITH_AUDIO and SILENT
- SILENT has no audio stream at all
- WITH_AUDIO: narration unaltered (null test + gain estimate), sync lag 0, full narration length present
- source voice file unchanged (sha256 before/after)"""
import hashlib, json, os, subprocess, sys
import numpy as np
import soundfile as sf
sys.stdout.reconfigure(encoding='utf-8')
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
ROOT = r'D:/Content/12_How_tobe_millionare_with_ai'
SRC = os.path.join(ROOT, 'How to be millionaire with Ai.m4a.mp4')
A = os.path.join(ROOT, '07_OUTPUT', 'Millionaire_AI_Final_With_Audio.mp4')
S = os.path.join(ROOT, '07_OUTPUT', 'Millionaire_AI_Final_Silent.mp4')
AUD = os.path.join(ROOT, '04_PRODUCTION', 'audio')
run = lambda *a: subprocess.run([FF, '-nostdin', '-v', 'error', *a], capture_output=True, check=True).stdout
def probe(p): return subprocess.run([FF, '-hide_banner', '-i', p], capture_output=True, text=True, encoding='utf-8', errors='ignore').stderr
def md5rows(p, sel, copy=True):
    args = ['-i', p, '-map', sel] + (['-c', 'copy'] if copy else []) + ['-f', 'framemd5', '-']
    return [l.split(',')[-1].strip() for l in run(*args).decode().splitlines() if not l.startswith('#')]
def pcm(p): return np.frombuffer(run('-i', p, '-map', '0:a', '-f', 'f32le', '-c:a', 'pcm_f32le', '-'), np.float32).reshape(-1, 2).astype(np.float64)
rep = {}
pa, ps = probe(A), probe(S)
rep['streams'] = {'with_audio': [l.strip() for l in pa.splitlines() if 'Stream #' in l], 'silent': [l.strip() for l in ps.splitlines() if 'Stream #' in l],
                  'silent_audio_streams': ps.count('Audio:'), 'with_audio_audio_streams': pa.count('Audio:'),
                  'durations': {'with_audio': pa.split('Duration: ')[1].split(',')[0], 'silent': ps.split('Duration: ')[1].split(',')[0]}}
va, vs = md5rows(A, '0:v'), md5rows(S, '0:v')
da, ds = md5rows(A, '0:v', False), md5rows(S, '0:v', False)
rep['video'] = {'frames_with_audio': len(va), 'frames_silent': len(vs), 'packets_identical': va == vs, 'decoded_frames_identical': da == ds}
vo = pcm(SRC); mix = pcm(A)
mus, _ = sf.read(os.path.join(AUD, 'music_stem.wav')); sfx, _ = sf.read(os.path.join(AUD, 'sfx_stem.wav')); nar, _ = sf.read(os.path.join(AUD, 'narration_stem.wav'))
n = min(len(mix), len(vo))
added = (mus + sfx)[:n]; resid = mix[:n] - vo[:n]; err = resid - added
rms = lambda x: float(np.sqrt(np.mean(x ** 2)) + 1e-20)
dbr = lambda a, b: 20 * np.log10(rms(a) / rms(b))
def lag(t):
    i = int(t * 44100); w = 44100
    a = vo[i:i + w, 0]; b = mix[i - 2000:i + w + 2000, 0]
    c = np.correlate(b, a, 'valid'); return int(np.argmax(c) - 2000)
last = slice(int(48.0 * 44100), int(48.64 * 44100))   # last word «تتعلموه»
rep['with_audio'] = {'source_decoded_samples': len(vo), 'mix_decoded_samples': len(mix), 'mix_covers_full_narration': len(mix) >= len(vo),
                     'narration_stem_equals_source_decode': bool(np.array_equal(nar[:len(vo)].astype(np.float32), vo.astype(np.float32))),
                     'voice_gain_estimate': float(np.sum(mix[:n] * vo[:n]) / np.sum(vo[:n] ** 2)),
                     'added_layers_rel_voice_db': dbr(added, vo[:n]), 'aac_coding_error_rel_voice_db': dbr(err, vo[:n]),
                     'sync_lag_samples': {str(t): lag(t) for t in (1.0, 24.0, 47.0)},
                     'last_word_voice_rms_db': 20 * np.log10(rms(vo[last])), 'last_word_mix_rms_db': 20 * np.log10(rms(mix[last]))}
h = hashlib.sha256(open(SRC, 'rb').read()).hexdigest()
open(os.path.join(ROOT, '06_QC', 'audio', 'sha256_after.txt'), 'w').write(f'{h} *How to be millionaire with Ai.m4a.mp4\n')
rep['source_sha256_after'] = h
rep['source_sha256_before'] = open(os.path.join(ROOT, '06_QC', 'audio', 'sha256_before.txt')).read().split()[0]
rep['source_unchanged'] = rep['source_sha256_after'] == rep['source_sha256_before']
json.dump(rep, open(os.path.join(ROOT, '06_QC', 'audio', 'qc_audio_report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps(rep, indent=1, ensure_ascii=False))
