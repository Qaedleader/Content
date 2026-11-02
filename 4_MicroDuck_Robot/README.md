# 4: Microduck robot (مايكرو دك)

The final video is `07_OUTPUT/MICRO_DUCK_ROBOT_FINAL.mp4`: 1080×1920, 30 fps, 39.1 s, with the original AAC narration stream-copied. For QC and delivery evidence, see `FINAL_PRODUCTION_REPORT.md`.

| Folder | Contents |
|---|---|
| `01_AUDIO/Original/` | The narration as supplied, as a read-only, byte-identical copy (sha256 `8f48ba92…`) |
| `02_TIMING/` | `transcribe.py` (faster-whisper), `whisper_words.json`, `build_words.py` → `words_display.json` (display spelling, emphasis, caption chunks) |
| `03_MEDIA/` | `raw/`: official downloads (unmodified) · `frames/`: extracted clip segments · `review/`: selection sheets · `ASSET_SOURCES.md` (URLs, usage conditions, crops, labels) |
| `04_PRODUCTION/scripts/` | `brand.py` (Paper Workshop toolkit, Python port of `_BRAND_SYSTEM`), `episode.py` (timeline, scenes, captions), `prep_media.py`, `render.py`, `sheet.py` |
| `05_PREVIEW/` | Review stills and sheets |
| `06_QC/` | Audio packet/PCM evidence, final contact sheets, keyframes |
| `07_OUTPUT/` | The final MP4 |

## Rebuild (Python + ffmpeg only, one process at a time)

```bash
PY=D:/Content/02_NEURALINK/07_PROJECT/.venv/Scripts/python.exe
FF=D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe
cd 04_PRODUCTION/scripts
$PY -I prep_media.py
$PY -I -X utf8 render.py chunk 0 149 ../chunks/c01.mp4      # … 150-frame chunks up to frame 1172 (about 6 min each)
# concat the chunks with stream copy, then mux the ORIGINAL audio, also stream copy (no -itsoffset):
$FF -f concat -safe 0 -i ../chunks/list.txt -c copy ../chunks/picture.mp4
$FF -i ../chunks/picture.mp4 -i "../../01_AUDIO/Original/MicroDuck robot.m4a.mp4" -map 0:v -map 1:a -c copy -movflags +faststart ../../07_OUTPUT/MICRO_DUCK_ROBOT_FINAL.mp4
```

The source m4a's edit list skips 2112 priming samples, so the narration starts at presentation time 0. That is why `AUDIO_PTS = 0` in `episode.py`. Do not add `-itsoffset`: it drops the priming skip.
