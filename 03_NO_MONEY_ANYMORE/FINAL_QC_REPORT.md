# Final QC report — «المصاري رح يبطل إلها قيمة» (NO MONEY ANYMORE)

**Final video:** `05_OUTPUT/NO_MONEY_ANYMORE_FINAL.mp4`
**SHA-256:** `ef0d20cc602a8ef2c3d515f76e73580298b8f84d3277c3ba379e740c7d7560f5`

## 1. Checks on the exported file

| Check | Method | Result |
|---|---|---|
| Container and streams | ffmpeg probe | H.264 High, yuv420p (tv range, bt709), 1080×1920, 30 fps · AAC-LC 44.1 kHz stereo, about 267 kb/s · duration 59.50 s |
| Frame count | decoded every frame | **1785** frames = 1758 narration frames + 27 tail frames, as designed |
| Black frames | `blackdetect` (d=0.05 s, pix_th 0.06) | **0 segments** |
| Frozen video | `freezedetect` (noise 0.002, ≥1.0 s) | **0 segments** |
| Loudness | `ebur128` | Integrated **−18.9 LUFS**, LRA 4.3 LU, true peak **−1.0 dBTP** |
| Narration sync | `04_SFX_MUSIC/qc_audio.py`: cross-correlation of the exported audio against the original decode | Lag **0 samples** |
| Narration integrity | Exported audio minus the music and SFX stems, compared with the original voice × master gain | Correlation **0.99997**, SNR **41.1 dB**, which is the AAC encoding limit. No edits, trims or time or pitch change |
| Effects under speech | Speech band (200–4000 Hz) RMS of music + SFX vs voice, per spoken word | Median **−15.5 dB**. Worst words, all intentional accents on the word itself: «ثانية» −3.5, «تصهره» −3.5, «والروبوتات» −3.8, «السيارة» −4.0, «الذكاء» −4.2 dB |
| Visual pass | 60 frames at 1 fps from the export, plus 15 keyframes at the critical moments (`05_OUTPUT/qc/`, `05_OUTPUT/review/qc/`) | All scenes render. Arabic is shaped correctly and laid out RTL. No clipped captions. No placeholders or watermarks. Every real image carries a credit |

## 2. Defects found and fixed during QC
1. **Banknote tear seam:** a zig-zag seam showed before the tear. Fixed by rendering the note whole until the tear starts.
2. **Banknote text:** «مصاري» on the note was clipped by RTL anchoring. Fixed.
3. **Caption punctuation:** trailing «.» «،» showed on word strips. Now stripped from captions only (the transcript keeps them).
4. **Scenario badge:** it overlapped the caption zone. Moved to the top.
5. **Scene C layout:** the world sat too high and the icon row collided with the counter. Recomposed.
6. **Scene D press station:** too sparse. Real industrial-robot footage added, and the truck–house overlap fixed.
7. **Scene D camera dip:** the move at 16 s exposed a navy strip beyond the canvas. The background was extended. Confirmed fixed in the export.
8. **Scene H:** 0.7 s of near-empty frame. A bridge row of chain icons was added. Confirmed in the export.
9. **Scene L:** the robot grid layout was broken at the 3×3 level. Rewritten.
10. **Effects over the voice:** five words initially had effects at or above voice level. Cues were lowered or moved, and gentle sidechain ducking was added. Now every word clears by at least 3.5 dB.

Chunks 2–4 were re-rendered after fixes 7–8. The final encode came from the full concatenation.

## 3. What was not verified
- **Listening:** I cannot listen. The sound design was checked only by measurement (sync, levels, masking). Taste, timbre and whether the music fits must be judged by ear.
- **Phone playback:** I did not test playback on a phone or inside the Instagram or TikTok apps.
- **Two words:** «لتعرف» (word 10) and «روبوتات» (word 49, whether the article is spoken) are marked uncertain in `02_TIMING/TRANSCRIPT.md`. The audio is unaffected; only the subtitle text could differ.
- **Licences:** licence obligations for ShareAlike media in a commercial context are noted in `LICENSES.md` §4. Legal review was not performed.
