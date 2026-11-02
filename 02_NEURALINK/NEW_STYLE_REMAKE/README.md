# Neuralink: new Content Studio style remake

The final video is `05_OUTPUT/NEURALINK_NEW_STYLE_FINAL.mp4`: 1080×1920, 30 fps, 72.0 s, H.264 + AAC.

The original production is untouched and kept for comparison:
- `../08_RENDERS/NEURALINK_FINAL_CINEMATIC*.mp4`
- `../01_AUDIO/Original/` (read-only master)

| Folder | Contents |
|---|---|
| `01_AUDIO/` | `narration_original.m4a`: a byte-identical copy of the approved master (sha256 `EBE79AD1…1C44FCE`) |
| `02_TIMING/` | `word_align.py` → `words_v1.json` → `refine_proportional.py` → **`words.json`** (187 words, verified). Also `word_align_log.json`, `refine_log.json` and `vo_16k_analysis.wav` (analysis copy) |
| `03_MEDIA/` | `raw/`: new Commons downloads with sidecars · `scripts/fetch_commons.py`, `make_licenses.py` · `review/`: selection sheets. Reused originals stay in `../03_REAL_FOOTAGE`, `../04_PHOTOS` |
| `04_SFX_MUSIC/` | `audio_design.py` (cue sheet, music, mix), stems, `final_mix.wav`, `mix_report.json`, `qc_audio.py`, `qc_audio_report.json` |
| `05_OUTPUT/` | The final MP4 · `qc/` keyframes · `review/`: intermediate exports and 1 fps QC sheets |
| (root) | `STORYBOARD_TIMING_MAP.md`, `LICENSES.md`, `FINAL_QC_REPORT.md` |

## Where the editable project lives
The editable project is in `D:/Content/_BRAND_SYSTEM`:
- **Composition:** `NeuralinkRemake`.
- **Episode code:** `src/episodes/neuralink/`.
- **New reusable science components:** `src/brand/science.tsx`. It contains the paper brain and brain-archive cabinet, the implant, neurons, the signal strip, memory cards, the archive rail, the paper cloud, a paper figure, the flip year, the chess monitor, the paper phone, pins and gears.
- **Media copies:** `public/episodes/neuralink/`.

## Rebuild
Run every step one at a time (8 GB RAM).

```bash
python -X utf8 04_SFX_MUSIC/audio_design.py                         # -> final_mix.wav (72.0 s)
# in _BRAND_SYSTEM:
npx remotion bundle src/index.ts --out-dir=out/bundle
npx remotion render out/bundle NeuralinkRemake out/nl_chunks/n01.mp4 --frames=0-299 --muted --concurrency=1
#   … n02 300-599 · n03 600-899 · n04 900-1199 · n05 1200-1499 · n06 1500-1799 · n07 1800-2159
ffmpeg -f concat -safe 0 -i out/nl_chunks/list.txt -c copy picture.mp4
ffmpeg -i picture.mp4 -i 04_SFX_MUSIC/final_mix.wav -map 0:v -map 1:a -vf "scale=in_range=pc:out_range=tv,format=yuv420p" \
  -c:v libx264 -preset slow -crf 16 -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 320k -movflags +faststart 05_OUTPUT/NEURALINK_NEW_STYLE_vN.mp4
```
