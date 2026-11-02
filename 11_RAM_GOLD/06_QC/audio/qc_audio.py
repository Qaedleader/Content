"""QC for both exports: identical video bitstreams, CLEAN audio = original AAC packets, SUBTLE_SFX narration unaltered (null test).
Run: python -I qc_audio.py   → qc_audio_report.json"""
import hashlib, json, os, subprocess
import numpy as np
import soundfile as sf
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
ROOT = r'D:/Content/11_RAM_GOLD'
SRC = os.path.join(ROOT, 'RAM GOLD.m4a.mp4')
CLEAN = os.path.join(ROOT, '07_OUTPUT', 'RAM_GOLD_FINAL_VOICE_ONLY.mp4')
SUBTLE = os.path.join(ROOT, '07_OUTPUT', 'RAM_GOLD_FINAL_CINEMATIC.mp4')
AUD = os.path.join(ROOT, '04_PRODUCTION', 'audio')
run = lambda *a: subprocess.run([FF, '-nostdin', '-v', 'error', *a], capture_output=True, check=True).stdout
def framemd5(p, sel):
    rows = [l for l in run('-i', p, '-map', sel, '-c', 'copy', '-f', 'framemd5', '-').decode().splitlines() if not l.startswith('#')]
    return [r.split(',')[-1].strip() for r in rows], [r.split(',')[-2].strip() for r in rows]
def pcm(p): return run('-i', p, '-map', '0:a', '-f', 'f32le', '-c:a', 'pcm_f32le', '-')
rep = {}
vc, _ = framemd5(CLEAN, '0:v'); vs, _ = framemd5(SUBTLE, '0:v')
rep['video_frames'] = {'clean': len(vc), 'subtle': len(vs), 'bitstreams_identical': vc == vs}
# CLEAN: packet payloads + decoded PCM vs original
a0, d0 = framemd5(SRC, '0:a'); a1, d1 = framemd5(CLEAN, '0:a')
p0, p1 = pcm(SRC), pcm(CLEAN)
rep['clean'] = {'aac_packets_source': len(a0), 'aac_packets_clean': len(a1), 'packet_payloads_identical': a0 == a1,
                'packet_durations_differing': sum(x != y for x, y in zip(d0, d1)),
                'decoded_pcm_md5_source': hashlib.md5(p0).hexdigest(), 'decoded_pcm_md5_clean': hashlib.md5(p1).hexdigest(),
                'decoded_pcm_identical': p0 == p1, 'decoded_samples': len(p0) // 8, 'audio_streams': 1}
# SUBTLE: decoded mix minus narration should equal the added layers (up to AAC coding error)
mix = np.frombuffer(pcm(SUBTLE), np.float32).reshape(-1, 2).astype(np.float64)
vo = np.frombuffer(p0, np.float32).reshape(-1, 2).astype(np.float64)
mus, _ = sf.read(os.path.join(AUD, 'music_stem.wav')); sfx, _ = sf.read(os.path.join(AUD, 'sfx_stem.wav')); nar, _ = sf.read(os.path.join(AUD, 'narration_stem.wav'))
n = min(len(mix), len(vo))
added = (mus + sfx)[:n]
resid = mix[:n] - vo[:n]
err = resid - added
rms = lambda x: float(np.sqrt(np.mean(x ** 2)) + 1e-20)
dbr = lambda a, b: 20 * np.log10(rms(a) / rms(b))
rep['subtle'] = {'narration_stem_equals_original_decode': bool(np.array_equal(nar[:len(vo)].astype(np.float32), vo.astype(np.float32))),
                 'decoded_samples': len(mix), 'voice_rms_dbfs': 20 * np.log10(rms(vo)),
                 'added_layers_rel_voice_db': dbr(added, vo[:n]),
                 'aac_coding_error_rel_voice_db': dbr(err, vo[:n]),
                 'voice_gain_estimate': float(np.sum(mix[:n] * vo[:n]) / np.sum(vo[:n] ** 2)),
                 'mix_minus_voice_corr_with_added_layers': float(np.corrcoef(resid.ravel(), added.ravel())[0, 1])}
json.dump(rep, open(os.path.join(ROOT, '06_QC', 'audio', 'qc_audio_report.json'), 'w'), indent=1)
print(json.dumps(rep, indent=1))
