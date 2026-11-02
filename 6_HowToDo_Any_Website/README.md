# 6: How to do any website (كيف تعمل أي موقع)

The final video is `07_OUTPUT/HOW_TO_DO_ANY_WEBSITE_FINAL.mp4`: 1080×1920, 30 fps CFR, exactly 900 frames / 30.000 s, with the original AAC voice stream-copied. Evidence is in `FINAL_PRODUCTION_REPORT.md`.

The supplied recording is untouched in this folder, and a read-only byte-identical copy is in `01_AUDIO/Original/Website_VO.m4a.mp4` (sha256 `e3052d25…`).

| Folder | Contents |
|---|---|
| `02_TIMING/` | `transcribe.py`, `whisper_words.json`, `build_words.py` → `words_display.json` |
| `03_MEDIA/` | `raw/`: official screenshots and the Claude Code demo · `frames/`: extracted GIF segments · `ASSET_SOURCES.md` |
| `04_PRODUCTION/scripts/` | `brand.py` (Paper Workshop toolkit, unchanged from Videos 4–5), **`episode.py` (editable composition)**, `prep_media.py`, `render.py`, `sheet.py`, `clip_sheet.py` |
| `05_PREVIEW/`, `06_QC/` | Review stills, audio evidence, final contact sheets |

## Rebuild (Python + ffmpeg only, one render at a time)

```bash
PY=D:/Content/02_NEURALINK/07_PROJECT/.venv/Scripts/python.exe
FF=D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe
cd 04_PRODUCTION/scripts
$PY -I prep_media.py
$PY -I -X utf8 render.py chunk 0 149 ../chunks/c01.mp4    # … keep chunks <= 150 frames (75 is safer: ~3.5 s/frame)
cd ../chunks   # list.txt = c01 c02 c03 c04a c04b c05 c06a c06b
$FF -f concat -safe 0 -i list.txt -c copy picture.mp4
$FF -i picture.mp4 -i "../../01_AUDIO/Original/Website_VO.m4a.mp4" -map 0:v -map 1:a -c copy \
    -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0 \
    -movflags +faststart ../../07_OUTPUT/HOW_TO_DO_ANY_WEBSITE_FINAL.mp4
```

The m4a's edit list skips 2112 priming samples, so the voice starts at presentation 0. Never add `-itsoffset`.
