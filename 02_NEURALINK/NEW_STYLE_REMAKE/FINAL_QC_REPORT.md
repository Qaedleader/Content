# Final QC report: Neuralink remake

**File:** `05_OUTPUT/NEURALINK_NEW_STYLE_FINAL.mp4`
**SHA-256:** `a54b1ad83d1a9dca7a3e1a6140b338700eb818cbd54f4eaa204cf78038157652`

## Measured on the exported file

| Check | Result |
|---|---|
| Streams | H.264 High, yuv420p (tv range, bt709), 1080×1920, 30 fps · AAC-LC 44.1 kHz stereo, ≈276 kb/s · 72.00 s |
| Frame count | **2160** (2136 narration frames + 24 tail frames) |
| Black frames (`blackdetect` 0.05 s) | **0** |
| Frozen video ≥ 1 s (`freezedetect`) | **0** |
| Loudness (`ebur128`) | **−15.0 LUFS**, LRA 2.2 LU, true peak **−1.0 dBTP** |
| Narration sync (cross-correlation against the approved master) | Lag **0 samples** |
| Narration integrity (export − music/SFX stems vs. voice × master gain) | Correlation **0.99997**, SNR **41.5 dB** (the AAC limit). No edits, trims, or tempo or pitch change |
| Voice processing | One constant gain of **−2.0 dB** on the whole mix, because the master itself peaks at +0.2 dBTP. Nothing else |
| Effects under speech (speech band 200–4000 Hz, per word) | Median **−17.8 dB**. Closest words: «قائد» −4.2, «استنساخ» −4.4, «بس» −5.2, «الميموري» −5.4, «بتفتّش» −5.8 dB |
| Visual pass on the export | 72 frames at 1 fps plus 22 keyframes at critical moments (`05_OUTPUT/review/qc/`, `05_OUTPUT/qc/`). All scenes render. Arabic is shaped correctly and laid out RTL. No clipped captions. No placeholders or watermarks. Every real image is credited. No unrelated people appear |

## Defects found and fixed
1. **Composition:** in N2 (threads), N4 (the decoder overlapped the brain), N5 (sources too small) and N11 (TV too small). Enlarged or re-laid out.
2. **Evidence board:** credit lines were clipped at the left edge. Shortened.
3. **Memory search box:** it overlapped the speculative badge and the phone. Moved down, and it now fades out.
4. **N11 title:** it did not match the narration. Changed to «صرنا نقدر نتحكّم».
5. **Word timing.** Ten short chunks had been timed proportionally. One flagged «يعني» as masked although the voice was actually silent there.
   - All ten were re-anchored to the measured speech onset and offset (`02_TIMING/refine_proportional.py`), with overlaps clamped.
   - Captions, visual anchors and sound cues were then re-rendered and re-mixed.
6. **SFX over words:** effects landed on «يعني», «الميموري», «وهذا» and «تسمعها». Those cues were moved or lowered.

The `review/` folder keeps every intermediate export:
- `review_v1`: the first export.
- `review_v2_audio1`: the first final.
- `review_v3`: audio fix 1.
- `review_v4`: timing refinement, before the last audio fix.

## Not verified
- **Listening:** I cannot listen. The music and SFX were judged by measurement only.
- **Phone playback:** not tested on a phone or inside the Instagram or TikTok apps.
- **«قائد» (33.4 s):** both the original production and this pass hear it this way. It is presented as the source's name on a paper card. If the spelling differs, only the caption and card text change.
- **Word timing inside 10 short chunks:** placed proportionally between measured onsets and offsets, accurate to roughly ±0.15 s. The other 42 chunks use Whisper word timestamps.
