"""Prepare render copies in _BRAND_SYSTEM/public/episodes/millionaire/media from 03_MEDIA/raw/commons (originals untouched).
Stills: long side <= 2600 px JPEG q92. Clips: trimmed, 1920x1080, 30 fps, H.264 CRF 16, no audio."""
import glob, os, subprocess, sys
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
RAW = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'raw', 'commons'))
OUT = r'D:/Content/_BRAND_SYSTEM/public/episodes/millionaire/media'
os.makedirs(OUT, exist_ok=True)
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
src = lambda pre: [f for f in glob.glob(os.path.join(RAW, pre + '_*')) if not f.endswith('.json')][0]
STILLS = {'m_nyse': 'fin_07', 'm_wallst_flags': 'fin_02', 'm_nyse_flag': 'fin_04', 'm_wallsign': 'fin_18', 'm_ticker': 'fin_25', 'm_tse': 'fin_24',
          'm_nasdaq': 'fin_34', 'm_candle': 'fin_27', 'm_nyse_floor': 'fin_08', 'm_nyse2': 'fin_03', 'm_vscode': 'tech_10', 'm_vscode2': 'tech_09',
          'm_rust': 'tech_18', 'm_laptop_code': 'tech_22', 'm_dgx_b200': 'tech_30', 'm_gb200': 'tech_29', 'm_dgx': 'tech_26', 'm_synapse': 'tech_34',
          'm_vscode3': 'tech_13', 'm_ocado': 'biz_02', 'm_amazon_bot': 'biz_00', 'm_kdenlive': 'biz_14', 'm_blender': 'biz_23', 'm_blender2': 'biz_21',
          'm_kdenlive2': 'biz_10'}
CLIPS = {'v_code': ('V_vid_27', 11.0, 1.9), 'v_typing': ('V_vid_27', 184.5, 10.0), 'v_dc_aisle': ('V_vid_17', 40.0, 5.5),
         'v_cables': ('V_vid_17', 46.0, 5.5), 'v_blue': ('V_vid_17', 892.0, 8.0), 'v_drives': ('V_vid_36', 17.0, 4.0)}
only = set(sys.argv[1:]); want = lambda n: not only or n in only
for n, p in STILLS.items():
    if not want(n): continue
    im = Image.open(src(p)).convert('RGB'); im.thumbnail((2600, 2600), Image.LANCZOS); im.save(os.path.join(OUT, n + '.jpg'), quality=92)
    print('still', n, im.size, flush=True)
for n, (p, ss, d) in CLIPS.items():
    if not want(n): continue
    subprocess.run([FF, '-nostdin', '-y', '-v', 'error', '-ss', str(ss), '-i', src(p), '-t', str(d), '-an',
                    '-vf', 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,format=yuv420p',
                    '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-movflags', '+faststart', os.path.join(OUT, n + '.mp4')], check=True)
    print('clip', n, flush=True)
print('done')
