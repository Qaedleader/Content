# Content — Paper Workshop video production system

This repository is the **production-system backup** for our vertical Arabic documentary Reels: the brand design system, the reusable motion-graphics and animation code, the timing, caption, audio and QC pipelines, the thumbnail system, and two finished reference videos. It is not a raw-media archive (raw footage, voice recordings and tools are deliberately excluded; see the handbook §I).

**Start here → [`CONTENT_PRODUCTION_HANDBOOK.md`](CONTENT_PRODUCTION_HANDBOOK.md)** (brand, animation, step-by-step workflow, setup, standards).

## What is where

| Path | Content |
|---|---|
| `_BRAND_SYSTEM/` | **The brand system.** Remotion 4.0.537 + React 18 + TypeScript project. `src/brand/` = shared identity (tokens, fonts, animation, timing, paper, type, media, props, diagrams); `src/episodes/<slug>/` = each episode's composition, kit, scenes, word timings and cover; `public/brand/` = fonts (SIL OFL) and paper textures; `tools/` = SFX synthesis library, texture generator, QC stills. See `_BRAND_SYSTEM/README.md`. |
| `00_VISUAL_IDENTITY_RESEARCH/` | the original identity research report (Arabic), palette board and contrast data |
| `NN_<Episode>/` | one folder per episode: `02_TIMING` (transcription scripts, word timings), `03_MEDIA` (Commons search/fetch/prep scripts, licence sidecars, `ASSET_MANIFEST.md`), `04_PRODUCTION` (audio design scripts, mix reports), `05_PROJECT` (code snapshot), `06_QC` (QC scripts and reports), production reports |
| `12_How_tobe_millionare_with_ai/07_OUTPUT/` | **reference video 1** (latest) + its thumbnail and two alternative covers |
| `11_RAM_GOLD/07_OUTPUT/` | **reference video 2** (previous) + its thumbnail |
| `4_MicroDuck_Robot/04_PRODUCTION/scripts/brand.py` | Python port of the brand (no Node needed; used by Videos 4–6) |
| `BACKUP_REPORT.md` | what this backup contains and how it was verified |

## Set up on a new computer

```bash
git clone https://github.com/Qaedleader/Content.git
cd Content/_BRAND_SYSTEM
npm ci                 # Node 22; installs the pinned Remotion/React/TypeScript versions
npx tsc --noEmit       # typecheck
npm run studio         # preview compositions in Remotion Studio
```

Python 3.11 with `numpy scipy soundfile faster-whisper pillow`, and FFmpeg 7 on PATH, are needed for transcription, audio mixing and QC. Many scripts hardcode `D:/Content/...` tool paths; see handbook §G.5.

## Make a new video (summary)

1. Put the creator's locked voiceover in a new `NN_Name/` folder (never edit it).
2. Transcribe with `02_TIMING/transcribe.py` → `words.json`.
3. Copy `_BRAND_SYSTEM/src/episodes/millionaire/` to a new slug, replace `data/words.json`, write scenes anchored to word frames, register it in `src/Root.tsx`.
4. Fetch openly licensed media with the episode's `03_MEDIA/scripts/` (set your own contact email in the `UA` string).
5. Render muted chunks, mix audio with `04_PRODUCTION/audio/audio_design.py` (voice at unity gain, music 25 LU under), mux the full and clean versions, run QC.
6. Render the cover with the episode's `Cover.tsx` composition.

The full, detailed procedure is in the handbook §E.

## Thumbnail system

Covers are Remotion compositions rendered as 1080×1920 stills: `_BRAND_SYSTEM/src/episodes/millionaire/Cover.tsx` (`MillionaireCover`, variants A/B/C) and `_BRAND_SYSTEM/src/episodes/ramgold/Cover.tsx` (`RamGoldCover`). Layout rules are in handbook §J.4.

```bash
npx remotion still src/index.ts MillionaireCover cover.png --props='{"variant":"B"}'
```

## Licences and privacy

- Code and graphics are original work of this channel. Fonts are SIL OFL 1.1. Remotion is used under its Free License (see remotion.dev/license).
- Real media in the reference videos comes from Wikimedia Commons under the licences listed in each episode's `03_MEDIA/ASSET_MANIFEST.md`, credited on screen.
- No raw stock footage, voice recordings, credentials or tokens are stored here.
