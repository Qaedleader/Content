"""Cut the used segments of each licensed clip into 1080x1920 / 30 fps H.264 proxies for the Remotion episode, plus 9:16 stills.
Crop = scale to 1920 px height, then a 1080 px window centred at cx (fraction of the scaled width). No audio is kept.
Usage: python -I prep_media.py"""
import os, subprocess, json
FF = r'D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe'
R = r'D:/Content/8_Instagram_Algorotim/03_MEDIA/raw/'
MX = R + 'mixkit/'
OUT = r'D:/Content/_BRAND_SYSTEM/public/episodes/igalgo/media/'
SEG = [  # name, source, start s, duration s, crop centre (None = native 9:16), extra filter
    ('o_bg', MX + 'raindrops-on-glass-with-blurred-city-lights-in-the-background-99834.mp4', 14.0, 1.6, 0.45, ''),
    ('o_eye', MX + 'eye-of-a-woman-looking-at-a-tablet-41180.mp4', 7.3, 4.5, 0.51, ''),
    ('b_bokeh', MX + 'raindrops-on-glass-with-blurred-city-lights-in-the-background-99834.mp4', 1.0, 1.7, 0.30, ''),
    ('b_cafe', MX + 'urban-coffee-shop-4350.mp4', 4.0, 2.0, 0.45, ''),
    ('b_rain', MX + 'raindrops-on-glass-with-blurred-city-lights-in-the-background-99834.mp4', 8.0, 2.0, 0.62, ''),
    ('c_apt', MX + 'beautifully-decorated-hotel-room-4030.mp4', 1.5, 1.8, 0.30, ''),
    ('d_train1', R + 'commons/landwasser_1080p.webm', 73.5, 1.3, 0.42, ''),
    ('d_train2', R + 'commons/landwasser_1080p.webm', 136.0, 1.2, 0.50, ''),
    ('e_window', MX + 'train-trip-through-nature-3024.mp4', 1.5, 2.3, 0.45, ''),
    ('f_alarm', MX + 'woman-turning-off-her-alarm-clock-in-the-morning-28899.mp4', 6.0, 0.9, 0.72, ''),
    ('f_bed', MX + 'girl-checking-her-cell-phone-in-her-bed-upon-waking-31406.mp4', 0.2, 1.2, 0.33, ''),
    ('f_paris', MX + 'a-calm-street-in-paris-4348.mp4', 2.0, 3.6, 0.50, ''),
    ('f_bg', MX + 'european-style-buildings-4352.mp4', 2.0, 3.6, 0.50, ''),
    ('g_hands1', MX + 'hands-of-a-person-typing-on-a-cell-phone-4915.mp4', 1.0, 1.0, 0.60, ''),
    ('g_scroll', MX + 'man-texting-on-whatsapp-41173.mp4', 0.0, 3.0, None, ''),
    ('g_hands2', MX + 'hands-of-a-person-typing-on-a-cell-phone-4915.mp4', 6.0, 2.0, 0.60, ''),
    ('j_bg', MX + 'paris-rooftops-4354.mp4', 2.0, 3.3, 0.50, ''),
    ('k_ams', MX + 'canal-and-street-scene-in-amsterdam-4015.mp4', 2.0, 1.2, 0.62, ''),
    ('k_office', MX + 'open-office-space-914.mp4', 3.0, 1.1, 0.50, ''),
    ('k_lib', MX + 'girl-doing-homework-in-a-library-4531.mp4', 13.0, 0.8, 0.60, ''),
    ('k_shop', MX + 'woman-exploring-an-online-sales-page-on-her-cell-phone-42136.mp4', 3.5, 0.8, None, ''),
    ('k_run', MX + 'silhouette-of-a-runner-in-the-city-608.mp4', 8.0, 0.6, 0.55, ''),
    ('k_fruit', MX + 'slow-motion-video-of-a-fruit-and-veggie-stand-991.mp4', 5.0, 0.6, 0.40, ''),
    ('k_flor', MX + 'italys-iconic-city-4161.mp4', 10.5, 0.7, 0.72, ''),
    ('l_curtain', MX + 'view-of-a-window-with-a-curtain-3977.mp4', 2.0, 1.4, 0.80, ''),
    ('l_night', MX + 'view-from-a-window-of-the-night-outside-3978.mp4', 1.0, 4.0, 0.50, ''),
]
STILL = [  # feed thumbnails (opening scroll + history cards): name, source, t, cx
    ('t_dome', MX + 'italys-iconic-city-4161.mp4', 12, 0.72), ('t_fruit', MX + 'slow-motion-video-of-a-fruit-and-veggie-stand-991.mp4', 9, 0.4),
    ('t_books', MX + 'a-hand-runs-through-the-book-spines-in-the-library-50726.mp4', 4, 0.6), ('t_redtrain', MX + 'passenger-train-passing-3025.mp4', 1.2, 0.35),
    ('t_room', MX + 'a-look-inside-of-an-small-hotel-room-4197.mp4', 8.5, 0.5), ('t_desk', MX + 'office-workers-hands-typing-on-their-devices-4835.mp4', 8, 0.35),
    ('t_ams', MX + 'canal-and-street-scene-in-amsterdam-4015.mp4', 6, 0.55), ('t_terrace', MX + 'interior-of-a-room-with-terrace-4029.mp4', 26, 0.3),
    ('t_runner', MX + 'silhouette-of-a-runner-in-the-city-608.mp4', 14, 0.55), ('t_roofs', MX + 'paris-rooftops-4354.mp4', 10, 0.5),
    ('t_cafe', MX + 'urban-coffee-shop-4350.mp4', 5, 0.45), ('t_apt', MX + 'beautifully-decorated-hotel-room-4030.mp4', 2, 0.3),
    ('t_train', R + 'commons/landwasser_1080p.webm', 74.5, 0.42), ('t_paris', MX + 'a-calm-street-in-paris-4348.mp4', 4, 0.5),
    ('t_office', MX + 'open-office-space-914.mp4', 5, 0.5), ('t_lib', MX + 'girl-doing-homework-in-a-library-4531.mp4', 15, 0.6),
    ('t_shop', MX + 'woman-exploring-an-online-sales-page-on-her-cell-phone-42136.mp4', 4, None),
]
def vf(cx, w=1080, h=1920):
    if cx is None: return f'scale={w}:{h}:flags=lanczos,setsar=1'
    return f"scale=-2:{h}:flags=lanczos,crop={w}:{h}:'max(0,min(iw-{w},iw*{cx}-{w}/2))':0,setsar=1"
for n, src, t, d, cx, extra in SEG:
    subprocess.run([FF, '-nostdin', '-y', '-v', 'error', '-ss', str(t), '-i', src, '-t', str(d), '-an', '-vf', vf(cx) + ',fps=30' + extra,
                    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT + n + '.mp4'], check=True)
    print('seg', n, flush=True)
for n, src, t, cx in STILL:
    subprocess.run([FF, '-nostdin', '-y', '-v', 'error', '-ss', str(t), '-i', src, '-frames:v', '1', '-vf', vf(cx, 540, 960), '-q:v', '3', OUT + n + '.jpg'], check=True)
print('stills', len(STILL))
json.dump([s[:5] for s in SEG], open(r'D:/Content/8_Instagram_Algorotim/04_PRODUCTION/media_prep/segments.json', 'w'), indent=1)
