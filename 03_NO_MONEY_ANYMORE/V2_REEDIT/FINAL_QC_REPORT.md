# Final QC report: V2 re-edit of «المصاري رح يبطل إلها قيمة»

- **File:** `FINAL_V2_REEDIT.mp4`
- **SHA-256:** `b3fcede341aa8d19ac1917b84242f866e5d954d6787632f4d5d375f9daee405a`
- **V1:** `../05_OUTPUT/NO_MONEY_ANYMORE_FINAL.mp4`. Its SHA-256 `ef0d20cc…7560f5` is unchanged, so V1 was not touched.

## 1. Measured on the exported file
| Check | Result |
|---|---|
| Streams | H.264 High, yuv420p (tv range, bt709), 1080×1920, 30 fps, timescale 15360 (as V1) · AAC-LC 44.1 kHz stereo 267 kb/s · 59.50 s · faststart |
| Frame count (decoded) | **1785**, the same as V1 |
| Black frames (`blackdetect` d=0.05, pix_th 0.06) | **0** |
| Frozen video (`freezedetect` n=0.002, ≥1 s) | **0** |
| Audio vs V1 | **Bit-identical.** Packet MD5 and decoded-PCM MD5 both match (`AUDIO_PRESERVATION.md`) |
| Changed frames vs V1 (PSNR < 40 dB) | 290 frames, in 0–81, 276–294, 827–869, 990–1081 and 1730–1784. These are exactly the planned windows |
| Unchanged frames vs V1 | 1495 frames at 40.6–55 dB (mean 48.2 dB). That is re-encode noise only |
| Seams inside continuing shots (f295, f870, f1730) | Before splicing, the V2 renders of unchanged frames were compared with V1's intermediate picture: 44.6 / 42.9 / 43.9 dB minimum. These are encoder-noise levels, so there is no visible jump |
| Visual pass | Contact sheets of every new segment and of each seam, plus `comparison/*.jpg`. Arabic is shaped and RTL, the captions are unclipped, and every real-media credit is kept. No people, no placeholders, no watermarks |

## 2. How V2 was produced (non-destructive)
1. **New composition.** `NoMoneyAnymoreV2` lives in `_BRAND_SYSTEM/src/episodes/no-money-v2/`, with a snapshot in `EDITABLE_SOURCE/`.
   - It reuses V1's `ep.ts`, which holds the word timings, captions and scene boundaries.
   - It reuses every unchanged V1 scene component directly.
   - V1's source files were not edited. The only shared-file change is one added `<Composition>` line in `Root.tsx`.
2. **Changed ranges only.** Only the changed frame ranges were rendered: `_BRAND_SYSTEM/out/v2_chunks/sA, sD, sG, sH, sM`.
3. **Splice and encode.** Those ranges were spliced, frame-accurately, with V1's own intermediate picture (`_BRAND_SYSTEM/out/chunks/picture_v2.mp4`, the source of the V1 final).
   - The encode used V1's settings: libx264 slow, CRF 16, pc→tv range and bt709 tags.
4. **Audio.** The AAC track was stream-copied from the V1 master.

### Rebuild
```bash
# in D:/Content/_BRAND_SYSTEM
npx remotion bundle src/index.ts --out-dir=out/bundle_v2
npx remotion render out/bundle_v2 NoMoneyAnymoreV2 out/v2_chunks/sA.mp4 --frames=0-81 --muted --concurrency=1
#   sD 276-325 · sG 827-885 · sH 990-1081 · sM 1690-1784
# splice: [sA 0-81][V1pic 82-275][sD 0-29][V1pic 306-826][sG 0-44][V1pic 872-989][sH 0-91][V1pic 1082-1728][sM 39-94]
#   → scale=in_range=pc:out_range=tv,format=yuv420p, libx264 -preset slow -crf 16, bt709 tags, -an
ffmpeg -i v2_picture_final.mp4 -i NO_MONEY_ANYMORE_FINAL.mp4 -map 0:v -map 1:a -c copy -video_track_timescale 15360 -movflags +faststart FINAL_V2_REEDIT.mp4
```
Alternatively, the full `NoMoneyAnymoreV2` composition renders the whole V2 directly. A seam check showed that the current code reproduces V1's unchanged frames.

## 3. V1 vs V2 comparison (judgement, not measurement)
- **Opening:** stronger.
  - V1's frame 0 was empty. V2's frame 0 carries the word «اصرف» and a full frame of motion.
  - The robot arm introduces the video's subject in the first 2 s.
- **Middle:** all three changes remove empty or weak beats.
  - The car and chain changes are small: about 0.3–0.5 s each.
  - The «everything» board is the largest middle change: it is clearer and better balanced.
- **Ending:** the thesis is shown, not only written.
  - The gear powers the production ring and stops on the ratchet.
  - V1's fast reverse-spin artefact in the final second is gone.
- **Identity:** everything is unchanged.
  - **Palette:** the same, with yellow for productive capacity.
  - **Fonts, paper textures, shadows, grade and captions:** the same.
  - **Real-media treatment:** the same; the same four clips with their credits.
- **Changed share:** about 16 % of frames, against a target of about 5–10 %.
  - The extra share is mainly the full 2.7 s opening shot and the 3 s «everything» scene, which had to change as whole shots.
  - All other shots, cuts and pacing are untouched.

## 4. Not verified
- **Listening.** I cannot listen. The audio is proven identical to V1 by MD5, so it sounds exactly like the published version. Whether the new visuals feel right against the existing effects was judged from cue timings only.
- **Phone and Instagram playback:** not tested in the app.
- **Licences.** The real media is the same as in V1, so `../LICENSES.md` still applies. No new external assets were downloaded.
