"""Prepare render copies in _BRAND_SYSTEM/public/episodes/ramgold/media from 03_MEDIA/raw/commons (originals untouched).
Stills: long side <= 2600 px JPEG q92. Logos: SVG copied. RAM hero: white background keyed to alpha (edge flood fill) + gold gradient-map twin.
Clips: trimmed, 1920x1080, 30 fps, H.264 CRF 16, no audio."""
import glob, os, shutil, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
Image.MAX_IMAGE_PIXELS = None
RAW = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'raw', 'commons'))
OUT = r'D:/Content/_BRAND_SYSTEM/public/episodes/ramgold/media'
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
src = lambda pre: [f for f in glob.glob(os.path.join(RAW, pre + '_*')) if not f.endswith('.json')][0]
STILLS = {'m_ram_chip': 'fab_15', 'm_dram_ic': 'pc2_11', 'm_frontier': 'dc_12', 'm_frontier2': 'dc_10', 'm_frontier3': 'dc_14', 'm_pleiades': 'dc_02',
          'm_gamingpc': 'pc2_12', 'm_altman_ted': 'altman_07', 'm_altman_tc': 'altman_00', 'm_altman_vg': 'altman_12', 'm_altman_tc17': 'altman_33',
          'm_fiji': 'hbm_12', 'm_p100': 'hbm_08', 'm_vega_hbm': 'hbm_09', 'm_h100': 'hbm_17', 'm_h100b': 'hbm_14', 'm_b200': 'hbm_23', 'm_gb200': 'pc2_07',
          'm_hgx': 'pc2_08', 'm_sodimm_skh': 'ram_16', 'm_sodimm_micron': 'ram_12', 'm_ddr4_samsung': 'ram_07', 'm_dram_die': 'ram_22', 'm_samsung_pkg': 'ram_31',
          'm_die_micro': 'ram_29', 'm_micron_fab': 'fab_16', 'm_mrdimm': 'fab_09', 'm_wafer': 'fab_18', 'm_mostek': 'fab_26', 'm_nv_ir': 'fab_24',
          'm_build1': 'fab_04', 'm_build2': 'fab_06', 'm_gold_bars': 'gold_09', 'm_gold_ingot': 'gold_00', 'm_jupiter': 'dc_08', 'm_frontier4': 'dc_16'}
LOGOS = {'logo_openai': 'S_logo_01', 'logo_openai_sym': 'S_logo_03', 'logo_chatgpt': 'S_logo_09', 'logo_samsung': 'S_logo_16', 'logo_skhynix': 'S_logo_24',
         'logo_micron': 'S_logo_25', 'logo_nvidia_w': 'S_logo_31'}
CLIPS = {  # name: (raw prefix, start s, duration s)
    'v_ram_in1': ('V_vid2_11', 515.0, 2.7), 'v_ram_in2': ('V_vid2_11', 527.4, 2.4), 'v_dc_aisle': ('V_vid_01', 6.5, 3.4),
    'v_dc_trays': ('V_vid_01', 38.0, 8.0), 'v_dc_cables': ('V_vid_01', 47.0, 5.5), 'v_gh200': ('V_vid2_16', 10.0, 9.0),
    'v_fab_yellow': ('V_vid_25', 84.0, 10.0), 'v_fab_y2': ('V_vid_25', 50.0, 5.0), 'v_wafer': ('V_vid_25', 25.0, 13.0),
    'v_st_fab': ('V_vid_24', 30.0, 6.0), 'v_st_auto': ('V_vid_24', 90.0, 5.0), 'v_st_clean': ('V_vid_24', 190.0, 9.0), 'v_st_chips': ('V_vid_24', 112.0, 6.0),
    'v_st_wafer': ('V_vid_24', 233.0, 12.0), 'v_st_build': ('V_vid_24', 220.0, 10.0), 'v_gt218': ('V_vid2_18', 0.0, 12.0)}
only = set(sys.argv[1:])
want = lambda n: not only or n in only
for n, p in STILLS.items():
    if not want(n): continue
    im = Image.open(src(p)).convert('RGB'); im.thumbnail((2600, 2600), Image.LANCZOS); im.save(os.path.join(OUT, n + '.jpg'), quality=92)
for n, p in LOGOS.items():
    if want(n): shutil.copyfile(src(p), os.path.join(OUT, n + '.svg'))
if want('ram_hero'):
    im = np.asarray(Image.open(src('ram_05')).convert('RGB')).astype(np.float32) / 255
    white = (im.min(axis=2) > 0.93)
    lab, _ = ndimage.label(white)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(edge))
    a = 1 - ndimage.gaussian_filter(ndimage.binary_dilation(bg, iterations=1).astype(np.float32), 1.2)
    rgba = np.dstack([im, a]); Image.fromarray((rgba * 255).astype(np.uint8), 'RGBA').save(os.path.join(OUT, 'ram_hero.png'))
    # gold gradient map on luminance (deep bronze -> gold -> pale highlight) with contrast for metallic read
    L = (0.3 * im[..., 0] + 0.59 * im[..., 1] + 0.11 * im[..., 2])
    L = np.clip((L - 0.16) / 0.62, 0, 1); L = L * L * (3 - 2 * L)
    stops = np.array([0, 0.28, 0.55, 0.8, 1.0]); cols = np.array([[22, 11, 3], [104, 62, 12], [214, 156, 42], [252, 220, 128], [255, 252, 236]]) / 255
    g = np.stack([np.interp(L, stops, cols[:, c]) for c in range(3)], axis=2)
    Image.fromarray((np.dstack([g, a]) * 255).astype(np.uint8), 'RGBA').save(os.path.join(OUT, 'ram_hero_gold.png'))
for n, (p, ss, d) in CLIPS.items():
    if not want(n): continue
    subprocess.run([FF, '-nostdin', '-y', '-v', 'error', '-ss', str(ss), '-i', src(p), '-t', str(d), '-an',
                    '-vf', 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,format=yuv420p',
                    '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-movflags', '+faststart', os.path.join(OUT, n + '.mp4')], check=True)
    print('clip', n, flush=True)
print('done')
