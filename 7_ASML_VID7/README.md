# ASML Video 7 — EUV (final)

**Final:** `07_OUTPUT/ASML_EUV_FINAL.mp4` · 1080×1920 · 30 fps · 1621 frames (54.033 s) · H.264 High (yuv420p, bt709 tv range) · AAC-LC 256 kb/s 44.1 kHz stereo · sha256 `7a31818c4f152f0a8a363937f883f67f36500dd4048d06b4ab261aa97d9511f6`.

**Narration:** `ASML.m4a.mp4` — untouched (sha256 `04f4fd09…36e2` before and after; byte copy in `01_AUDIO/Original/`). Decoded length 53.985 s (2 380 736 samples); the container reports 54.03 s including AAC priming.

## Pipeline (Remotion brand system)
- Composition **`Asml`** in `D:/Content/_BRAND_SYSTEM/src/episodes/asml/` (`ep.ts` timeline, `kit.tsx` cinematic Shot / PixelCut / PixelMask / IdentityPlate, `scenes/Story.tsx`, `scenes/EuvProcess.tsx`, `Asml.tsx`). Media copies: `_BRAND_SYSTEM/public/episodes/asml/media/`.
- Timing: `02_TIMING/transcribe.py` (faster-whisper large-v3-turbo) → `whisper_words.json` → `build_words.py` → `words.json` (display spelling + emphasis; timings unchanged).
- Audio: `04_PRODUCTION/audio/audio_design.py` — voice decoded and added at unity gain (no edit of any kind); original synthesised ambient bed 27 LU under the voice, 17 SFX cues (SFX layer 34 LU under the voice), both ducked under speech and anti-clip-limited (added layers only).

```bash
cd D:/Content/_BRAND_SYSTEM
npx tsc --noEmit
npx remotion bundle src/index.ts --out-dir=out/bundle_asml
npx remotion render out/bundle_asml Asml out/asml_chunks/c01.mp4 --frames=0-299 --muted --concurrency=1   # … c06 = 1500-1620 (~65 s each)
FF=D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe
$FF -f concat -safe 0 -i out/asml_chunks/list.txt -c copy out/asml_chunks/picture.mp4
$FF -i out/asml_chunks/picture.mp4 -i D:/Content/7_ASML_VID7/04_PRODUCTION/audio/final_mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k \
    -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0 -movflags +faststart -shortest \
    D:/Content/7_ASML_VID7/07_OUTPUT/ASML_EUV_FINAL.mp4
python -I D:/Content/7_ASML_VID7/06_QC/audio/qc_audio.py
```

## Narration → visuals
| Time (s) | Narration | Visual |
|---|---|---|
| 0.00–1.30 | تعرفوا إنه فيه | Intel D1X: ASML EXE:5000 High-NA with engineers (push-in) |
| 1.30–2.80 | شركة تعتبر جزء | EUV Alpha Demo Tool internals, engineer, amber cleanroom |
| 2.80–4.40 | أساسي من تطور الذكاء الاصطناعي | 8K EXE:5200B pan + index-card title, company name pixel-masked |
| 4.40–6.50 | وممكن تكون من أخطر الشركات بالعالم؟ | High-NA system in dark studio (official video still), hero «أخطر الشركات؟» |
| 6.50–11.4 | بده ثلاث شغلات: معالجات، مراكز بيانات، طاقة | Three slots fill on each word: NVIDIA Blackwell, server racks, pylon |
| 11.4–13.1 | بس المعالجات هي المفاجأة | Processor slot grows full-frame, hero «المفاجأة!» |
| 13.1–14.6 | فيه شركة هولندية اسمها | ASML HQ Veldhoven + Netherlands flag |
| 14.7–17.4 | ASML هي الوحيدة بالعالم | Logo resolves through pixel cells over the High-NA top-module lift; «الوحيدة بالعالم» |
| 17.4–18.9 | اللي بتصنع آلات طباعة ضوئية | EUV source vessels in ASML cleanroom, «LITHOGRAPHY» |
| 18.9–21.0 | بتقنية اسمها EUV | Official ASML render of the EUV light path, hero «EUV / Extreme Ultraviolet» |
| 21.0–21.8 | كيف بتشتغل؟ | Push into official laser-and-tin source render |
| 21.8–33.9 | بتضرب قطرات قصدير … على رقائق | Animation: droplets → CO₂ pre-pulse + main pulse → plasma → «≈50,000 نبضة بالثانية» → 13.5 nm EUV → collector → mirrors in vacuum → reticle → projection mirrors → wafer → cross-section: light changes photoresist, «وبعدها خطوات حفر وترسيب» |
| 33.9–35.0 | السيليكون | Real wafer inside a tool (IBM Research) |
| 35.0–39.6 | وهذه تقنية أساسية … أقوى المعالجات | Fab tool + engineer, chip close-up (IBM); badge «EUV خطوة طباعة النمط · من مئات خطوات التصنيع» |
| 39.6–44.0 | حتى شركات مثل TSMC و إنفيديا بتعتمد عليها | Yellow-light fab (Terra X) → TSMC logo/building + Taiwan flag → NVIDIA die + US flag → chain: NVIDIA تصمّم ← TSMC تصنّع ← ASML تبيعها آلات EUV |
| 44.0–48.5 | والأخطر … منافسة تجارياً | High-NA cleanroom, engineers inside a system; «مورّد تجاري واحد لآلات EUV بالعالم», «ONE COMMERCIAL EUV SUPPLIER», «آلات EUV تحديداً · مش كل معدّات صناعة الرقائق» |
| 48.5–54.0 | تخيلوا … شركة واحدة؟ | Intel EXE:5000 wide pan → dimmed EXE:5000 + ASML logo + hero «شركة واحدة؟» |

Coverage (by frames): real footage/photography 1137 f = **70.1 %** (of which 212 f moving footage, 87 f labelled official ASML renders); motion graphics 484 f = **29.9 %** (empty slots 81 f, EUV animation 362 f, company chain 41 f).

Sources and licences: `03_MEDIA/ASSET_MANIFEST.md` (raw files + sidecars in `03_MEDIA/raw/`). QC: `06_QC/audio/qc_audio_report.json`, `06_QC/final_sheet.jpg`.
