# 03 — «المصاري رح يبطل إلها قيمة» (NO MONEY ANYMORE)

The final video is `05_OUTPUT/NO_MONEY_ANYMORE_FINAL.mp4`: 1080×1920, 30 fps, 59.5 s, H.264 + AAC.

## Folders
| Folder | Contents |
|---|---|
| (root) | The narration as supplied (unchanged), plus `LICENSES.md`, `FINAL_QC_REPORT.md` and this README |
| `01_AUDIO/Original/` | `narration_original.m4a`: a byte-identical, read-only copy (sha256 `88004a14…67051`) |
| `02_TIMING/` | `transcribe_ar.py`, `region_check.py`, `build_words.py` → `words.json` (verified), `TRANSCRIPT.md`, `SCENE_TIMING_MAP.md` |
| `03_MEDIA/` | `raw/`: original downloads, each with a `*.source.json` licence sidecar · `scripts/fetch_commons.py`, `make_licenses.py` · `review/`: selection sheets |
| `04_SFX_MUSIC/` | `audio_design.py` (original SFX, music and the mix), `sfx_stem.wav`, `music_stem.wav`, `final_mix.wav`, `mix_report.json`, `qc_audio.py`, `qc_audio_report.json` |
| `05_OUTPUT/` | The final MP4 · `qc/` keyframes · `review/`: the first full review render (v1, superseded) and its 1 fps QC sheets |

The editable motion-design project lives in `../_BRAND_SYSTEM`. The episode code is in `src/episodes/no-money/` and the reusable components are in `src/brand/`.

## Rebuild
Run every step one at a time (8 GB RAM).

```bash
# 1) sound (writes final_mix.wav, 59.5 s)
D:/Content/02_NEURALINK/07_PROJECT/.venv/Scripts/python.exe -X utf8 04_SFX_MUSIC/audio_design.py

# 2) picture (in ../_BRAND_SYSTEM)
npx remotion bundle src/index.ts --out-dir=out/bundle
npx remotion render out/bundle NoMoneyAnymore out/chunks/c01.mp4 --frames=0-199 --muted --concurrency=1
#   … then c02 200-499, c03 500-799, c04 800-1099, c05 1100-1399, c06 1400-1784
ffmpeg -f concat -safe 0 -i out/chunks/list.txt -c copy out/chunks/picture_v2.mp4

# 3) final encode + mux
ffmpeg -i picture_v2.mp4 -i 04_SFX_MUSIC/final_mix.wav -map 0:v -map 1:a \
  -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 16 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 320k -movflags +faststart 05_OUTPUT/NO_MONEY_ANYMORE_vN.mp4
```

If you change one scene, re-render only the chunks that cover its frames (see `02_TIMING/SCENE_TIMING_MAP.md`), then concat and run the final encode again.
