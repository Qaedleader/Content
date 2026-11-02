# Instagram Algorithm Video 8 — asset manifest

Every external item used. Render copies (trimmed 1080×1920/30 fps proxies + 9:16 stills) are in `_BRAND_SYSTEM/public/episodes/igalgo/media/`; originals + JSON sidecars in `raw/`. Cuts are listed in `04_PRODUCTION/media_prep/prep_media.py`.

## Licences
- **Mixkit** clips: each item page was checked by `scripts/fetch_mixkit.py` before download and only items whose page states `data-license="videoFree"` (Mixkit Stock Video Free License) were kept. That licence allows commercial use, modification and social media/YouTube use; attribution not required (credited «Mixkit» on screen anyway). Licence text saved: `review/lic_videoFree.html`. Clips under the **Restricted** licence (personal use only) were skipped: #14771, #14710, #25302, #28088, #35517, #48925, #28743, #21364, #14669, #6302 and others.
- **Landwasserviadukt, aerial video.webm** — Capricorn4049, **CC BY-SA 4.0**, Wikimedia Commons (https://commons.wikimedia.org/wiki/File:Landwasserviadukt,_aerial_video.webm). Used 1080p transcode, cropped/graded/overlaid, audio (Kevin MacLeod) discarded. On-screen credit «Capricorn4049 · CC BY-SA 4.0». Note: CC BY-SA asks that adaptations of the clip be shared under the same licence — standard practice for using Commons footage in a compilation video, flagged here for awareness.
- Music and SFX: original synthesis (`04_PRODUCTION/audio/audio_design.py`), nothing to license.
- Feed UI, icons, diagrams: original drawings in code (no Instagram logo or Meta assets used; the interface is labelled «مثال توضيحي · واجهة مبسّطة»).

| Clip | Source page | Downloaded file | Where used |
|---|---|---|---|
| `a-calm-street-in-paris-4348` | https://mixkit.co/free-stock-video/a-calm-street-in-paris-4348/ | https://assets.mixkit.co/videos/4348/4348-1080.mp4 | Recommended reel content 15.30–18.67 s |
| `a-hand-runs-through-the-book-spines-in-the-library-50726` | https://mixkit.co/free-stock-video/a-hand-runs-through-the-book-spines-in-the-library-50726/ | https://assets.mixkit.co/videos/50726/50726-2160.mp4 | unused (still extracted, not shown) |
| `a-look-inside-of-an-small-hotel-room-4197` | https://mixkit.co/free-stock-video/a-look-inside-of-an-small-hotel-room-4197/ | https://assets.mixkit.co/videos/4197/4197-1080.mp4 | unused (still extracted, not shown) |
| `beautifully-decorated-hotel-room-4030` | https://mixkit.co/free-stock-video/beautifully-decorated-hotel-room-4030/ | https://assets.mixkit.co/videos/4030/4030-1080.mp4 | Apartment card 8.53–9.97 s; history thumbnails |
| `canal-and-street-scene-in-amsterdam-4015` | https://mixkit.co/free-stock-video/canal-and-street-scene-in-amsterdam-4015/ | https://assets.mixkit.co/videos/4015/4015-1080.mp4 | «مجرد مثال» 37.83–38.93 s |
| `european-style-buildings-4352` | https://mixkit.co/free-stock-video/european-style-buildings-4352/ | https://assets.mixkit.co/videos/4352/4352-2160.mp4 | Blurred background 15.30–18.67 s |
| `eye-of-a-woman-looking-at-a-tablet-41180` | https://mixkit.co/free-stock-video/eye-of-a-woman-looking-at-a-tablet-41180/ | https://assets.mixkit.co/videos/41180/41180-2160.mp4 | Eye macro 1.33–5.57 s («بقرأ أفكارك؟!», «بكرا») |
| `girl-checking-her-cell-phone-in-her-bed-upon-waking-31406` | https://mixkit.co/free-stock-video/girl-checking-her-cell-phone-in-her-bed-upon-waking-31406/ | https://assets.mixkit.co/videos/31406/31406-2160.mp4 | Morning phone 14.37–15.30 s |
| `girl-doing-homework-in-a-library-4531` | https://mixkit.co/free-stock-video/girl-doing-homework-in-a-library-4531/ | https://assets.mixkit.co/videos/4531/4531-2160.mp4 | «الدراسة»; opening feed still |
| `hands-of-a-person-typing-on-a-cell-phone-4915` | https://mixkit.co/free-stock-video/hands-of-a-person-typing-on-a-cell-phone-4915/ | https://assets.mixkit.co/videos/4915/4915-2160.mp4 | «طب كيف عرف؟» 18.67–19.47 s; skip signal 22.33–24.67 s |
| `hands-using-a-cellphone-with-tracking-point-on-a-green-28300` | https://mixkit.co/free-stock-video/hands-using-a-cellphone-with-tracking-point-on-a-green-28300/ | https://assets.mixkit.co/videos/28300/28300-1080.mp4 | Opening 0.00–1.30 s: real hands keyed, feed UI tracked onto the screen |
| `interior-of-a-room-with-terrace-4029` | https://mixkit.co/free-stock-video/interior-of-a-room-with-terrace-4029/ | https://assets.mixkit.co/videos/4029/4029-1080.mp4 | unused (still extracted, not shown) |
| `italys-iconic-city-4161` | https://mixkit.co/free-stock-video/italys-iconic-city-4161/ | https://assets.mixkit.co/videos/4161/4161-1080.mp4 | «كل إشي» Florence |
| `looking-out-the-window-of-a-passenger-train-3026` | https://mixkit.co/free-stock-video/looking-out-the-window-of-a-passenger-train-3026/ | https://assets.mixkit.co/videos/3026/3026-1080.mp4 | unused |
| `man-texting-on-whatsapp-41173` | https://mixkit.co/free-stock-video/man-texting-on-whatsapp-41173/ | https://assets.mixkit.co/videos/41173/41173-1080.mp4 | Pause / replay signals 19.47–22.33 s |
| `office-workers-hands-typing-on-their-devices-4835` | https://mixkit.co/free-stock-video/office-workers-hands-typing-on-their-devices-4835/ | https://assets.mixkit.co/videos/4835/4835-2160.mp4 | Analysis table thumbnail (skipped item) |
| `open-office-space-914` | https://mixkit.co/free-stock-video/open-office-space-914/ | https://assets.mixkit.co/videos/914/914-2160.mp4 | «الشغل» |
| `paris-rooftops-4354` | https://mixkit.co/free-stock-video/paris-rooftops-4354/ | https://assets.mixkit.co/videos/4354/4354-2160.mp4 | Prediction background 34.70–37.83 s; opening feed still |
| `passenger-train-passing-3025` | https://mixkit.co/free-stock-video/passenger-train-passing-3025/ | https://assets.mixkit.co/videos/3025/3025-1080.mp4 | unused (still extracted, not shown) |
| `raindrops-on-glass-with-blurred-city-lights-in-the-background-99834` | https://mixkit.co/free-stock-video/raindrops-on-glass-with-blurred-city-lights-in-the-background-99834/ | https://assets.mixkit.co/active_storage/video_items/99834/1717026441/99834-video-2160.mp4 | Opening background (blurred); «تخيل بالليل» 5.57–6.90 s; rain-on-glass layer over the café |
| `silhouette-of-a-runner-in-the-city-608` | https://mixkit.co/free-stock-video/silhouette-of-a-runner-in-the-city-608/ | https://assets.mixkit.co/videos/608/608-2160.mp4 | «كل إشي» runner; opening feed still |
| `slow-motion-video-of-a-fruit-and-veggie-stand-991` | https://mixkit.co/free-stock-video/slow-motion-video-of-a-fruit-and-veggie-stand-991/ | https://assets.mixkit.co/videos/991/991-2160.mp4 | «كل إشي» market; feed stills |
| `train-trip-through-nature-3024` | https://mixkit.co/free-stock-video/train-trip-through-nature-3024/ | https://assets.mixkit.co/videos/3024/3024-1080.mp4 | «ولا مرة بحثت عن السفر» 11.73–13.63 s |
| `urban-coffee-shop-4350` | https://mixkit.co/free-stock-video/urban-coffee-shop-4350/ | https://assets.mixkit.co/videos/4350/4350-1080.mp4 | Night café 6.90–8.53 s (seen through rain) |
| `view-from-a-window-of-the-night-outside-3978` | https://mixkit.co/free-stock-video/view-from-a-window-of-the-night-outside-3978/ | https://assets.mixkit.co/videos/3978/3978-2160.mp4 | Finale background |
| `view-of-a-window-with-a-curtain-3977` | https://mixkit.co/free-stock-video/view-of-a-window-with-a-curtain-3977/ | https://assets.mixkit.co/videos/3977/3977-2160.mp4 | «السؤال الأخطر» |
| `woman-exploring-an-online-sales-page-on-her-cell-phone-42136` | https://mixkit.co/free-stock-video/woman-exploring-an-online-sales-page-on-her-cell-phone-42136/ | https://assets.mixkit.co/videos/42136/42136-1080.mp4 | «الشراء» |
| `woman-turning-off-her-alarm-clock-in-the-morning-28899` | https://mixkit.co/free-stock-video/woman-turning-off-her-alarm-clock-in-the-morning-28899/ | https://assets.mixkit.co/videos/28899/28899-2160.mp4 | Alarm 13.63–14.37 s |
| `landwasser_1080p.webm` | https://commons.wikimedia.org/wiki/File:Landwasserviadukt,_aerial_video.webm | 1080p VP9 transcode | Train 9.97–11.73 s (two angles: 73.5 s and 136 s of the source); history thumbnail |
