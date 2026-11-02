# 5: Huawei Share (هواوي شير)

The final video is `07_OUTPUT/HUAWEI_SHARE_FINAL.mp4`: 1080×1920, 30 fps, 42.80 s, with the original AAC narration stream-copied. Evidence is in `FINAL_PRODUCTION_REPORT.md`.

The supplied recording is untouched in this folder, and a read-only byte-identical copy is in `01_AUDIO/Original/Huawei_Share_VO.m4a.mp4` (sha256 `2fd6b3ec…`).

| Folder | Contents |
|---|---|
| `02_TIMING/` | `transcribe.py` (faster-whisper), `whisper_words.json`, `build_words.py` → `words_display.json` (display spelling, emphasis, caption chunks) |
| `03_MEDIA/` | `raw/`: official Huawei downloads · `frames/`: extracted segments · `review/`: selection sheets · `ASSET_SOURCES.md` |
| `04_PRODUCTION/scripts/` | `brand.py` (Paper Workshop toolkit, copied unchanged from Video 4), `episode.py` (editable composition: timeline, scenes, captions), `prep_media.py`, `render.py`, `sheet.py`, `clip_sheet.py` |
| `05_PREVIEW/`, `06_QC/` | Review stills, audio evidence, final contact sheets |

## Rebuild (Python + ffmpeg only, one process at a time)

```bash
PY=D:/Content/02_NEURALINK/07_PROJECT/.venv/Scripts/python.exe
FF=D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe
cd 04_PRODUCTION/scripts
$PY -I prep_media.py
$PY -I -X utf8 render.py chunk 0 149 ../chunks/c01.mp4      # … 150-frame chunks up to frame 1283 (~6 min each)
cd ../chunks
$FF -f concat -safe 0 -i list.txt -c copy picture.mp4
$FF -i picture.mp4 -i "../../01_AUDIO/Original/Huawei_Share_VO.m4a.mp4" -map 0:v -map 1:a -c copy \
    -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0 \
    -movflags +faststart ../../07_OUTPUT/HUAWEI_SHARE_FINAL.mp4
```

The m4a's edit list skips 2112 priming samples, so the narration starts at presentation 0 (`AUDIO_PTS = 0`). Never add `-itsoffset`.
