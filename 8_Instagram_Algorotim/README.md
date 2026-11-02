# Instagram Algorithm Video 8 (final)

**Final:** `07_OUTPUT/INSTAGRAM_ALGORITHM_FINAL.mp4` · 1080×1920 · 30 fps · 1442 frames (48.067 s) · H.264 High (yuv420p, bt709 tv range) · AAC-LC 256 kb/s 44.1 kHz stereo · sha256 `f409194353e413267cf324df0cb4f0e8329c42b80bbaf827a5d30bff5714dafc`.

**Narration:** `Instagram algorithm.m4a.mp4`, untouched (sha256 `3930b050…6b01` before and after; byte copies in `01_AUDIO/Original/` and `_BRAND_SYSTEM/public/episodes/igalgo/audio/`). Decoded length 48.041 s (2 118 592 samples). The source voice peaks at +0.21 dBFS (1.025 float); this is left as recorded.

## Pipeline (Remotion brand system)
- Composition **`IgAlgo`** in `D:/Content/_BRAND_SYSTEM/src/episodes/igalgo/`: `ep.ts` (timeline + named word indices), `ui.tsx` (illustrative feed card, phone, signal chips, icons), `scenes/*.tsx`, `IgAlgo.tsx`. Reuses the ASML kit (`../asml/kit`: Shot, PixelCut, PixelRow) unchanged.
- Timing: `02_TIMING/transcribe.py` (faster-whisper large-v3-turbo) → `whisper_words.json` → `build_words.py` → `words.json` (display spelling; two Whisper mis-splits merged; timings unchanged).
- Media prep: `04_PRODUCTION/media_prep/key_phone.py` (green-screen key + screen tracking → `public/episodes/igalgo/phone/*.png` + `data/phone_track.json`), `prep_media.py` (trimmed 9:16 proxies + stills).
- Audio: `04_PRODUCTION/audio/audio_design.py`: the voice is decoded and added at unity gain (no edit of any kind); an original synthesised bed sits 32.0 LU under the voice and 24 quiet SFX cues sit 39.1 LU under it, both ducked under speech and anti-clip-limited (on the added layers only).

```bash
cd D:/Content/_BRAND_SYSTEM
npx tsc --noEmit
npx remotion bundle src/index.ts --out-dir=out/bundle_ig
npx remotion render out/bundle_ig IgAlgo out/ig_chunks/c01.mp4 --frames=0-299 --muted --concurrency=1   # … c05 = 1200-1441 (2–5 min each)
FF=D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe
$FF -f concat -safe 0 -i out/ig_chunks/list.txt -c copy out/ig_chunks/picture.mp4
$FF -i out/ig_chunks/picture.mp4 -i D:/Content/8_Instagram_Algorotim/04_PRODUCTION/audio/final_mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k \
    -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0 -movflags +faststart -shortest \
    D:/Content/8_Instagram_Algorotim/07_OUTPUT/INSTAGRAM_ALGORITHM_FINAL.mp4
python -I D:/Content/8_Instagram_Algorotim/06_QC/audio/qc_audio.py
```
QC stills without a full render: `node tools/stills_fast.mjs out/bundle_ig IgAlgo <name> <frames…>` then `python -I tools/tile_stills.py <name> <frames…>`.

## Narration → visuals
| Time (s) | Narration | Visual |
|---|---|---|
| 0.00–1.33 | هل الإنستغرام فعلياً | Real hands (keyed green-screen clip) swipe through a brand feed tracked onto the phone screen |
| 1.33–3.67 | بقرأ أفكارك؟ وكيف ممكن يعرف | Scroll freezes → 4K eye macro with the screen reflected in it, hero «بقرأ أفكارك؟!», reading rings around the iris |
| 3.67–5.57 | بكرا قبل ما إنت نفسك تفكر فيه | Tear-off calendar flips «اليوم» → «بكرا» while the eye closes |
| 5.57–8.53 | تخيل بالليل حضرت فيديو لمقهى تحت المطر | Rain on glass with city bokeh, «بالليل · ١١:٤٧ م» → night café seen through rain, which morphs into a feed card; signal «توقّف وكمّله للآخر» |
| 8.53–9.97 | بعده شقة صغيرة | Feed scrolls: apartment card; café drops into «سجل الليلة»; «أعاد المشاهدة» |
| 9.97–11.73 | وبعده قطار بأوروبا | Landwasser Viaduct (red Rhaetian train): aerial + side angle; strip fills café → apartment → train |
| 11.73–13.63 | ولا مرة بحثت عن السفر | Train-window landscape, stamp «ولا مرة!», search box typing «السفر» with empty history, «صفر عمليات بحث» |
| 13.63–15.30 | بكرا بتفتح الإنستغرام | Alarm clock → morning phone; «الليلة ● ─ ● بكرا» day line |
| 15.30–18.67 | بتلاقي فيديو … بأوروبا | Illustrative phone (badge «مثال توضيحي») with «مقترح لك» reel «كيف تبدأ حياة جديدة بأوروبا؟»; last night's 3 videos connect to it, «بدون ولا عملية بحث» |
| 18.67–25.47 | طب كيف عرف؟ … كلها إشارات | Real phone footage + chips توقف / إعادة / تخطي and a running «مدة المشاهدة» bar → chips gather into signal streams |
| 25.47–28.88 | الذكاء الاصطناعي بحلل تصرفاتك وتوقيتها وترتيبها | Sequence table (5 videos incl. 2 skipped): behaviour / time / order rows light up on each word, wired into «نموذج التوصية» |
| 28.88–34.70 | وبتعلم من ملايين الأنماط … بعدين | One sequence («أنت») zooms out to 204 sequences; similar ones light up and link; their later interest (travel) appears; badge «النموذج تعلّم علاقات إحصائية من سلوك سابق» |
| 34.70–37.83 | وبناءً على هيك بتوقع … بالمستقبل | Inputs → 4 candidate topics scored; «الحياة في أوروبا» re-ranks to #1; «ترتيب حسب الاحتمال · مش يقين» |
| 37.83–42.87 | وهذا مجرد مثال … بحياتك | Amsterdam → office «الشغل» → library «الدراسة» → shopping «الشراء» → runner / market / Florence «وكل إشي بحياتك» |
| 42.87–44.13 | بس السؤال الأخطر | Curtain light, «السؤال الأخطر» |
| 44.13–48.07 | إنستغرام توقع … ولا هو اللي خلاك تفكر فيه؟ | Two panels «توقّع اهتمامك؟» vs «ولا صنعه؟» → they close into a rotating loop (أنت ⇄ الخوارزمية), final «توقّعك / ولا أثّر عليك؟» |

Coverage (by frames, by what dominates the frame): real footage ≈ 915 f (**63 %**; includes the keyed-hands opener and feed cards whose content is real footage), motion graphics ≈ 527 f (**37 %**; signals stream, analysis table, pattern field, ranking over a dimmed real background, finale panels over dimmed real footage).

Sources and licences: `03_MEDIA/ASSET_MANIFEST.md`. QC: `06_QC/audio/qc_audio_report.json`, `06_QC/final_sheet.jpg`.
