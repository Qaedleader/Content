# Backup report — Content production system (2026-11-02)

**Scope:** a production-system backup of `D:\Content` (about 24 GB locally) to the public repository `Qaedleader/Content`, branch `main`. Only what is needed to reproduce the workflow and the brand is committed; raw media, voice recordings, tools and renders stay local (see `CONTENT_PRODUCTION_HANDBOOK.md` §I).

## Contents of the backup commit

- **Brand system:** `_BRAND_SYSTEM/`, all source (`src/brand/*`, all 9 episode folders: no-money v1–v3, neuralink, asml, igalgo, aiagent, binance, ramgold, millionaire), `package.json`, `package-lock.json`, `remotion.config.ts`, `tsconfig.json`, `tools/` (sfxlib, make_textures, stills), fonts (5 × SIL OFL) and paper textures.
- **Episode pipelines:** for every episode folder (01–12), the Python and TypeScript scripts, timing data (`words.json`, Whisper output), media search/fetch/prep scripts, licence sidecar JSON, asset manifests, audio design scripts and mix reports, QC scripts and reports, production reports and READMEs.
- **Identity research:** `00_VISUAL_IDENTITY_RESEARCH/VISUAL_IDENTITY_REPORT.md`, analysis scripts, palette board and contrast data.
- **Reference videos (2):** `12_How_tobe_millionare_with_ai/07_OUTPUT/Millionaire_AI_Final_With_Audio.mp4` (50,545,677 B) and `11_RAM_GOLD/07_OUTPUT/RAM_GOLD_FINAL_CINEMATIC.mp4` (70,354,493 B), both 1080×1920, 30 fps, H.264 + AAC, fully decoded without errors by FFmpeg before commit. Both are below GitHub's 100 MB per-file limit, so Git LFS was not needed.
- **Thumbnails:** `Millionaire_AI_Thumbnail.png` (+ the two alternatives) and `RAM_GOLD_THUMBNAIL.png`; contact sheets `06_QC/final_sheet.jpg` of both episodes.
- **Docs:** `README.md`, `CONTENT_PRODUCTION_HANDBOOK.md`, this report, `.gitignore`.

Total: 850 files, about 142 MB.

## Excluded on purpose

`node_modules/`, Python virtual environments, `__pycache__`, `out/` renders and chunks, the Whisper model weights (`.models/`), the portable Blender install and its zip, all `.exe`/`.dll`/`.pdb`, raw downloaded media (`03_MEDIA/raw/**` except the licence JSON), Mixkit and Pexels stock files, `_BRAND_SYSTEM/public/episodes/` (render copies, logos, private narration copies), every voiceover and audio stem, older and review renders, third-party reference images (`Familiar style/`), saved web pages and press kits, upload scratch parts.

## Pre-push checks

- Secret scan of every committed text file (GitHub/OpenAI/AWS/Google/Slack token patterns, private keys, `api_key`/`password`/`secret` assignments, `Authorization` headers): **no matches** (only the scene name `secret` in `Millionaire.tsx`).
- No `.env`, key, credential or token files exist in the selection.
- The creator's personal email appeared in the Wikimedia User-Agent string of 13 media scripts. It was replaced with the placeholder `YOUR_CONTACT_EMAIL` in those scripts before committing (the only edit to existing project files).
- No Mixkit or Pexels media files are committed (only their licence metadata JSON and the search scripts).
- `npx tsc --noEmit` in `_BRAND_SYSTEM`: **passed**. No build was run.
- Repository visibility and settings were not changed.

## Remote verification

See the section appended after the push.
