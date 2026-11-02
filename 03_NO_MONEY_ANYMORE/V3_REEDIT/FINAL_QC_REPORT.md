# Final QC report: V3 re-edit of «المصاري رح يبطل إلها قيمة»

- **File:** `FINAL_V3_REEDIT.mp4`
- **SHA-256:** `a3548bd929026185576c7e522a8e9e4fd5dabe5207bc923c98deb1d8470512a6`
- **V1 untouched:** `../05_OUTPUT/NO_MONEY_ANYMORE_FINAL.mp4`, sha256 `ef0d20cc…7560f5`, unchanged.
- **V2 untouched:** `../V2_REEDIT/FINAL_V2_REEDIT.mp4`, sha256 `b3fcede3…ee405a`, unchanged. The V1 and V2 source files were not edited.

## 1. Measured on the exported file
| Check | Result |
|---|---|
| Streams | H.264 High, yuv420p (tv range, bt709), **1080×1920, 30 fps**, timescale 15360 · AAC-LC 44.1 kHz stereo 267 kb/s · **59.50 s** (same as V1) · faststart |
| Frame count (decoded) | **1785**, the same as V1 and V2 |
| Black frames (`blackdetect` d=0.05, pix_th 0.06) | **0** |
| Frozen video (`freezedetect` n=0.002, ≥1 s) | **0** |
| Audio | **Bit-identical to V1** (encoded-packet MD5 and decoded-PCM MD5 both match). See `AUDIO_INTEGRITY_REPORT.md` |
| Visual change vs V1 | **1388 / 1785 frames = 77.8 %** changed (PSNR < 40 dB) in 0–1201 and 1599–1784. Kept shots 10–11 (1202–1598) match V1 at ≥ 41.9 dB, i.e. re-encode noise only |
| Visual change vs V2 | **77.8 %**, the same ranges. V3 shares no redesigned composition with V2 |
| Arabic typography | Checked at higher resolution (`qc/arabic_typography_check.jpg`) and on a 1 fps pass of the whole export (`qc/v3_1fps_sheet.jpg`). Letters are joined correctly and text is RTL. The narrator's dialect is kept on cards. No clipped caption strips. Western digits on counters |
| Real media | Every photo or clip carries an on-screen credit (author · licence). Each new asset is listed in `ASSET_SOURCE_MANIFEST.md`. No random people or faces |
| Placeholders / watermarks / broken assets | None seen in the 1 fps pass or in the per-chunk review sheets (every 6–12 frames of every chunk) |
| Hypothetical framing | Kept or added: «سيناريو مستقبلي افتراضي», «سيناريو افتراضي», «حفّارة روبوتية · تصوّر», «شاحنة ذاتية القيادة · تصوّر مستقبلي», «تصوّر افتراضي — التصنيع الذاتي الكامل مش واقع اليوم», «روبوتات بتبني · تصوّر», «لقطات من اليوم — الأتمتة الكاملة لسّا مش واقع», «رسم توضيحي — مش بيانات حقيقية», «توقّع المتحدث — مش حقيقة مثبتة». The V1 opinion badge is kept in shot 10. No statistics were invented: the meters and bars carry no numbers, and «99.9%» and «0.1%» restate the narration |

## 2. Defects found during review and fixed before the final export
1. **Shot 01:** the hero word covered the hopper and banknotes. The stage was lowered 150 px and the notes enlarged.
2. **Shot 04:** the production road crossed the photo windows. It was rerouted as an edge-hugging serpentine. The first frame was empty, so the design card now enters before the cut. The truck stopped short of the house, so it now drives to the door. A mismatched blue ground band was replaced with kraft.
3. **Shot 05:** too much empty floor. The line was lowered, the «؟» enlarged, and the «تصنيع» label moved (it was cropped during the push-in). The badge was moved off the line.
4. **Shot 07:** layer labels collided with the caption strip. They now fade below y 1150. On the «بدون بشر» board the robot tiles were yellow-on-yellow, so they became charcoal tiles.
5. **Shot 08:** the "four copies" intro appeared too late to read. It now starts at the cut. Hero words, the house, the ribbon/shirt and the blister were re-laid out so they no longer overlap the photo windows.
6. **Shot 12:** the first frame was empty, so the note now enters before the cut. The final frame clipped the turbine, so it was enlarged.

## 3. Comparison (judgement, see `comparison/*.jpg`)
- **Opening:** V1/V2 were a banknote on a table. V3 is a running production machine from frame 0. Money is literally fed into production and dwarfed by output, so the subject is stated visually before the word "robots".
- **Car chain:** V1/V2 used horizontal pans with a stepper. V3 is a vertical production map with real windows for mining equipment, a blast furnace, a rolling mill, a robotic welding line and a real driverless car, plus one object that transforms along the road.
- **Robots, energy, chain, industries, costs:** each is a new concept and composition (robot cell vs development board; energy foundation cross-section; elevator through layers plus staff board; four distinct pages; the multiplying machine). Manufacturing vs development and "almost without people" are now shown explicitly.
- **Ending:** the spinning gear is gone. The production ecosystem assembles around a factory, locks on the impact, and is framed on the ratchet under «القدرة على الإنتاج».
- **Identity:** palette (yellow = productive capacity, cream, charcoal, navy), paper textures, contact shadows, the Alexandria / Baloo Bhaijaan 2 / Lalezar fonts, word-strip captions, taped credited prints, badges and the paper grade are all unchanged.
- **Kept:** shots 10–11 (J+K balance and L examples), about 22 %. Both are clear, already use real media, and replacing them would not improve the story.

## 4. How it was built
- **Composition:** `NoMoneyAnymoreV3` lives in `_BRAND_SYSTEM/src/episodes/no-money-v3/` (snapshot in `EDITABLE_SOURCE/`).
  - It reuses only shared brand components plus V1's timeline (`ep.ts`) and the two kept scenes.
  - The only shared-file change is one `<Composition>` line added to `src/Root.tsx`. No shared brand component was modified.
- **Render:** a full render in six muted chunks (`_BRAND_SYSTEM/out/v3_chunks/v01…v06`, concurrency 1) and a stream-copy concat.
- **Encode:** the final encode matches V1 (libx264 slow, CRF 16, pc→tv range, bt709).
- **Audio:** the V1 AAC track was muxed by stream copy.

### Rebuild
```bash
# in D:/Content/_BRAND_SYSTEM
npx tsc --noEmit
npx remotion bundle src/index.ts --out-dir=out/bundle_v3
npx remotion render out/bundle_v3 NoMoneyAnymoreV3 out/v3_chunks/v01.mp4 --frames=0-275 --muted --concurrency=1
#   v02 276-578 · v03 579-826 · v04 827-1081 · v05 1082-1447 · v06 1448-1784
ffmpeg -f concat -safe 0 -i out/v3_chunks/list.txt -c copy out/v3_chunks/picture_v3.mp4
ffmpeg -i picture_v3.mp4 -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 16 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -an v3_picture_final.mp4
ffmpeg -i v3_picture_final.mp4 -i ../03_NO_MONEY_ANYMORE/05_OUTPUT/NO_MONEY_ANYMORE_FINAL.mp4 -map 0:v -map 1:a -c copy \
  -video_track_timescale 15360 -movflags +faststart FINAL_V3_REEDIT.mp4
```

## 5. Not verified
- **Listening.** I cannot listen. The audio is proven bit-identical to V1. Whether each new visual *feels* right against the existing effects was judged only from cue timings.
- **Phone and Instagram playback:** not tested.
- **Every single frame:** not inspected one by one. Review covered 1 fps of the whole export, every 6–12 frames of every chunk, and full-resolution checks of text-heavy frames.
- **Licences.** Only free Commons licences (CC0, PD, CC BY, CC BY-SA) were used and credited on screen. As in V1, the ShareAlike obligations in a commercial context have not been legally reviewed.
- **Robotic welding line photo.** `n_kuka_line` shows a real robotic welding line at a **railcar** plant (Tikhvin). It is labelled on screen only as «خط لحام روبوتي» (a robotic welding line), which is accurate, but it is not a car factory.
- **Share above target.** At 77.8 %, the redesign share is slightly above the requested 60–75 %, because every weak section was replaced and only the two strongest were kept.
