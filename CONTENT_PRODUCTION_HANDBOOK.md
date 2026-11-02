# Content Production Handbook

This handbook describes how our vertical Arabic documentary Reels are made, and how to make new ones that look and sound like the existing ones. Every value here was read from the source in this repository; file paths are relative to the repository root. Where something is **not** in the repository (raw media, voice recordings, tools), §I says so.

> **Golden rule:** do not invent a new style. Reuse `_BRAND_SYSTEM/src/brand/*` and the latest episode kits. When in doubt, open `_BRAND_SYSTEM/src/episodes/millionaire/` (Video 12, the newest) and copy its patterns.

---

## A. Project overview

**What we make:** 9:16 vertical videos (1080×1920, 30 fps, about 45–60 s), narrated in Levantine Arabic by the creator, with captions in Arabic. Topics: technology, AI, finance, companies. The channel identity is called **"Paper Workshop"**: a paper-diorama, editorial cut-out look combined with real-world photos and footage presented as *evidence*.

**How a video is produced:**

```
locked voiceover (never edited)
   │  faster-whisper → word timestamps (02_TIMING/words.json)
   ▼
ep.ts: scene ranges + caption chunks, all anchored to word indices
   │
   ▼
Remotion composition (React/TypeScript) in _BRAND_SYSTEM/src/episodes/<slug>/
   │  rendered MUTED, in 300-frame chunks, concurrency 1
   ▼
picture.mp4  ──┐
               ├─ ffmpeg mux ──► FINAL (voice + subtle music + light SFX)
Python mix  ───┘                 CLEAN / SILENT version (same picture)
(04_PRODUCTION/audio/audio_design.py: voice at unity gain, music + SFX ducked under it)
   │
   ▼
QC scripts (06_QC): identical frames between versions, voice null test, sync lag, contact sheets
```

**Folder layout of an episode** (the convention used since Video 7):

| Folder | Content |
|---|---|
| `NN_Name/` root | the creator's voiceover file (not in GitHub, private) and `PRODUCTION_REPORT.md` or notes |
| `01_AUDIO/Original/` | byte copy of the voiceover (not in GitHub) |
| `02_TIMING/` | `transcribe.py`, `recheck.py`, `build_words.py`, `whisper_words.json`, `words.json` |
| `03_MEDIA/` | `scripts/` (Commons search, fetch, prep), `raw/` (downloads + licence sidecar JSON; only the JSON is in GitHub), `ASSET_MANIFEST.md` |
| `04_PRODUCTION/audio/` | `audio_design.py`, `mix_report.json` (stems and the mix are not in GitHub) |
| `05_PROJECT/` | snapshot of that episode's Remotion code |
| `06_QC/` | QC scripts, reports, contact sheets |
| `07_OUTPUT/` | final deliverables (only two reference videos are in GitHub, see §H) |

**Production history** (oldest → newest): 01 Tesla Roadster and 02 Neuralink (Python + Blender pipeline, before the brand system), 03 No Money Anymore (the first episode on the brand system; plus V2/V3 re-edits), 04 Micro Duck, 05 Huawei Share, 06 How to do any website (Python port of the brand), 07 ASML, 08 Instagram algorithm, 09 AI vs AI agent, 10 Binance, 11 RAM Gold, 12 Millionaire with AI (all Remotion).

---

## B. Brand identity

Source of truth: `_BRAND_SYSTEM/src/brand/tokens.ts`. Design research: `00_VISUAL_IDENTITY_RESEARCH/VISUAL_IDENTITY_REPORT.md` (Arabic), palette contrast data in `00_VISUAL_IDENTITY_RESEARCH/palette/`.

### B.1 Palette (`C` in `tokens.ts`)

| Token | Hex | Role |
|---|---|---|
| `yellow` | `#F2B630` | **Signature accent.** Marks productive capacity / the key idea: hero words, emphasised caption words, counters, binder clips. **Never a full background.** |
| `yellowShade` / `yellowLight` | `#C98F12` / `#F8D27A` | depth/highlight of yellow |
| `paper` | `#F4ECDD` | cream paper: caption strips, light backdrops |
| `paperShade` / `paperWhite` | `#E6DAC4` / `#FBF8F1` | paper shading / index cards, labels |
| `kraft` / `kraftDark` | `#A57C52` / `#7A5A3A` | cardboard, crates |
| `charcoal` / `charcoalSoft` | `#262321` / `#3A3532` | text, dark cut layer of hero words |
| `navy` / `navyDeep` / `navyLight` | `#1F2C3F` / `#141E2D` / `#2E4260` | dark stages (`navyDeep` is the default composition background) |
| `teal`, `terracotta`, `sage`, `steel`, `fire` | `#2F7C78`, `#C65A3E`, `#9FB08B`, `#9AA5AE`, `#F07B2A` | secondary illustration colours |

Episode-specific accents live in each episode `kit.tsx` (for example Video 12 `K.ai = '#7FD6FF'`, used only from the AI reveal onwards; `K.ink = '#07090C'` dark stage; green `#3FBF7F` / red `#E5484D` for gains and losses). Add an accent only per episode, never to `tokens.ts`.

### B.2 Typography (`FONT` in `tokens.ts`, loaded by `src/brand/fonts.ts`)

All fonts are local files in `_BRAND_SYSTEM/public/brand/fonts/` (SIL Open Font License 1.1, so they are included in the repository). `ensureFonts()` blocks rendering until every face is loaded.

| Role | Family | Use |
|---|---|---|
| `display` | Alexandria (100–900) | index-card titles, weight 800 |
| `caption` | Baloo Bhaijaan 2 (400–800) | word-strip captions |
| `hero` | Lalezar | big two-layer paper-cut hero words |
| `label` | IBM Plex Sans Arabic Bold (700) | labels, credits, disclaimers |
| `mono` | JetBrains Mono | numbers on counters and UI |

Arabic rules: RTL (`dir="rtl"`), **no letter-spacing** on Arabic, keep the narrator's dialect in captions, Western digits (0–9) on counters and numbers.

### B.3 Layout and safe zones (`SAFE` in `tokens.ts`, 1080×1920)

| Key | Value | Meaning |
|---|---|---|
| `titleY` | 205 | centre of the index-card title |
| `stageTop` → `stageBottom` | 330 → 1250 | main visual stage |
| `captionY` | 1395 | centre line of caption strips |
| `uiBottom` | 1560 | below this, Instagram/TikTok UI covers the frame: no information |
| `uiRight` | 950 | right of this are like/comment buttons: no information |

Thumbnails/covers keep the headline and focal object inside the **4:5 grid-safe band** (y ≈ 285–1635; see `episodes/millionaire/Cover.tsx` header comment).

### B.4 Shadows, borders, textures

- `SHADOW.contact`, `SHADOW.lifted`, `SHADOW.soft` (warm brown `rgba(20,14,8,…)` drop shadows) in `tokens.ts`. Paper always casts a contact shadow; lifted elements use `lifted`.
- Paper edges are hand-cut polygons: `roughPolygon()` and `tornPolygon()` in `src/brand/paper.tsx`. Corners are slightly uneven (`borderRadius: '5px 3px 6px 2px'` on index cards).
- Textures: `public/brand/textures/paper_grain.png`, `paper_fibers.png`, `kraft.png`, generated by `tools/make_textures.py` (original, tileable).
- **`PaperGrade`** (`paper.tsx`) is laid over every frame: multiply grain that jumps every 3 frames (stop-motion "boil"), a warm radial vignette and a soft-light top-light gradient. Episodes pass `strength` about 0.4–0.85 and `vignette` about 0.25–0.42.
- Backdrops: `Backdrop` with patterns `stripes | grid | dots | rays | blueprint | tiles`.

### B.5 Pixel-inspired language (from Video 7 onwards)

Defined in `_BRAND_SYSTEM/src/episodes/asml/kit.tsx` and re-exported by later kits:
- **`PixelCut`**: scene-cut transition. A grid of 90 px cells (55 % density) sweeps diagonally across ±5 frames around the cut. Cells are 22 % yellow, 8 % paper-white, the rest near-black `rgba(10,12,16,0.92)`.
- **`PixelMask`**: 28 px mosaic that dissolves to reveal an image over about 9 frames (cells yellow / `#2a2f38` / `#171b22`).
- **`PixelRow`**: row of 16 px squares as a progress or section marker.
- Covers use a **pixel seam** (rows of 30 px squares) to join two images (`millionaire/Cover.tsx`, variant B).

### B.6 Editorial identity elements

- **Index-card title** (`TitleCard`, `type.tsx`): ruled cream card, red margin line, yellow binder clip, drops in from above with a spring.
- **Hero word** (`HeroWord`): Lalezar, coloured face over a charcoal cut layer offset by `depth` (default 9 px), with an optional torn paper strip behind it.
- **Real media is evidence** (`media.tsx`): `PhotoPrint` / `FootagePrint` (taped prints with Ken Burns movement) and `PaperScreen`, always with a `Credit` tag (default kind «صورة حقيقية»). Later episodes use `Shot` (asml kit) for full-bleed cinematic real footage, still with credits.
- **Labels and badges** (`Label`, `Badge`): hypothetical or speculative claims always get a badge (for example «سيناريو افتراضي · مش وعد», «تعبير الراوي · مش احتمال محسوب»).
- **EdTag** (ramgold kit): editorial series tag with date at the top of covers and openings.
- **No mascot**, and **no random people or stock models**. Real people appear only when they are the subject.

---

## C. Motion graphics library (where to find what)

All under `_BRAND_SYSTEM/src/`. Import from these files; do not copy-paste them into a new style.

| Need | Component / function | File |
|---|---|---|
| Kinetic captions | `CaptionTrack`, `PaperWord` | `brand/type.tsx` |
| Titles / hero type | `TitleCard`, `HeroWord`, `CutText`, `Label`, `Badge`, `typed()`, `fadeUp()` | `brand/type.tsx`, `brand/props.tsx` |
| Number counters | `PaperCounter` (odometer tiles); `Counter` (binance kit); `Money3D` (extruded gold numbers, millionaire kit) | `brand/diagram.tsx`, `episodes/binance/kit.tsx`, `episodes/millionaire/kit.tsx` |
| Charts / data viz | `GrowthChart` (projection curve), `CalendarBlock` (flip calendar), `Panel` (product-style UI window) | `episodes/millionaire/kit.tsx` |
| Tech graphics | `NeuralNet`, `GridStage`, `Scan`, `Ico` glyphs | `episodes/millionaire/kit.tsx` |
| | `Stage` (dark tech stage), `Stream` (data packets), `SysNode`, `Ring`, `Glyph`, `Laptop`, `NewsTag`, `Source` | `episodes/binance/kit.tsx` |
| | `RamCut`, `Brackets`, `Sweep` (specular sweep), `GoldDust` (particles), `Packets`, `Note`, `EdTag`, `LogoCard` | `episodes/ramgold/kit.tsx` |
| | `Shot`, `PixelCut`, `PixelMask`, `PixelRow`, `IdentityPlate`, `TechTag`, `Flag` | `episodes/asml/kit.tsx` |
| Diagrams / camera | `Camera`, `Stage` (SVG 1080×1920), `PaperWipe`; `FlowPath`, `Sparks` | `brand/diagram.tsx`, `brand/props.tsx` |
| Agent / flow diagrams | `camAt` (keyframed camera), `Pulse`, `along`, `ToolPlate`, `AiCore`, `Figure` | `episodes/aiagent/kit.tsx` |
| Paper props | `RobotArm`, `Factory`, `Car`, `Truck`, `Chip`, `Bank`, `Banknote`, `Gear`, `Icon`, `WindTurbine`, `SolarPanel` and more | `brand/props.tsx` |
| Science props | `PaperBrain`, `Neuron`, `SignalStrip`, `MemoryCard`, `PaperPhone`, `FlipYear` | `brand/science.tsx` |
| Pop-up world | `IndustrialWorld` | `brand/scenes/IndustrialWorld.tsx` |
| Social UI | `ReelCard`, `PhoneFrame`, `SignalChip`, `WatchBar` | `episodes/igalgo/ui.tsx` |
| Backgrounds / grade | `Backdrop`, `Paper`, `PaperGrade` | `brand/paper.tsx` |

A new episode `kit.tsx` should **re-export** what it needs from earlier kits (see the top of `episodes/millionaire/kit.tsx`, which re-exports from `asml`, `binance` and `ramgold`) and add only the new parts.

---

## D. Animation system

Source: `_BRAND_SYSTEM/src/brand/anim.ts` and `timing.ts`. Frame rate is fixed at **30 fps** (`FPS` in `tokens.ts`). Every animation is a pure function of the current frame, so renders are deterministic.

### D.1 Easing and interpolation (`EASE`, `prog`, `kf`)

| Name | Definition | Typical use |
|---|---|---|
| `EASE.io` | `Easing.inOut(Easing.cubic)` | default for moves |
| `EASE.out` | `Easing.out(Easing.cubic)` | entrances |
| `EASE.out5` | `Easing.out(Easing.poly(5))` | fast-settling camera pushes |
| `EASE.in` | `Easing.in(Easing.cubic)` | exits |
| `EASE.back` | `Easing.out(Easing.back(1.7))` | playful overshoot |

- `prog(f, a, b, ease)`: clamped 0→1 between frames a and b.
- `kf(f, frames[], values[], ease)`: clamped piecewise keyframes.
- `env(f, a, b, fin = 6, fout = 6)`: visibility envelope with 6-frame ramps.

### D.2 Springs

| Function | Config | Use |
|---|---|---|
| `pop(f, at)` | damping 11, stiffness 190, mass 0.7 | paper "pop" entrance with overshoot |
| `slam(f, at)` | damping 14, stiffness 260, mass 0.9 | heavy drops, impacts |
| caption words | `pop` with damping 12, stiffness 320, mass 0.55 | each caption word |
| `TitleCard` | damping 13, stiffness 210, mass 0.8 | title drops 260 px from above, rotates in from −6° |
| `chipIn` (aiagent kit) | damping 12, stiffness 260, mass 0.6 | chips and tags |

### D.3 Stop-motion character

- `boil(f, seed, amp, step = 4)`: value changes every 4 frames (paper jitter). `PaperGrade` moves its grain every 3 frames.
- `shake(f, at, amp = 10, dur = 10)`: decaying camera shake after an impact.
- `rand(seed)`: deterministic hash random. **Never use `Math.random()`**; every random choice is seeded so re-renders match.

### D.4 Text entrance and exit

- Caption words appear **1 frame before** the spoken onset (`lead = 1`), scale from 0.55 → 1, rotate from about +8° extra to a small random tilt (±3°), rise from +24 px; a chunk stays until the next chunk starts or 14 frames after its last word ends.
- Caption size steps by chunk length: 70 px (≤16 chars), 64 px (≤22), 58 px (longer).
- Titles exit with `prog(frame, out, out + 6, EASE.in)` (6 frames up and out). `fadeOut` in the ramgold kit: 6 frames, `EASE.in`.
- `typed(text, frame, at, cps = 26)`: typewriter at 26 characters per second.

### D.5 Narration-driven timing and layer sync

`timing.ts` turns `words.json` into a timeline:
- `wf(i)` = start frame of word *i*, `we(i)` = end frame, `at(sec)` = frame of a time.
- Scene ranges in the master composition are word anchors, for example in `episodes/millionaire/Millionaire.tsx`: `hook: [0, wf(10) - 1]`, `deposit: [wf(10), wf(20) - 1]`, … The `CUTS` array lists the cut frames, where a `PixelCut` plays.
- Caption chunks: `autoChunks(words, maxWords = 3, gap = 0.22, maxChars = 24)` in `timing.ts` (Video 12 uses its own variant in `ep.ts`: ≤3 words, ≤22 chars, break on punctuation or pauses > 0.2 s).
- `EMPHASIS`: word indices flagged `emph` in `words.json` get the yellow caption strip.
- `HIDDEN`: frame ranges where captions step aside because a hero word already says the same words.

**Rule:** every visual event is anchored to `wf(index)` of a word, never to a hand-typed time. Cuts fall on phrase onsets; one main mover at a time; every motion has a visible cause.

### D.6 Scene composition pattern

The master composition (for example `Millionaire.tsx`) is:
1. a background colour (`C.navyDeep`),
2. the narration `<Audio>` (only for preview; the final render is muted and mixed in Python),
3. one scene component per range, mounted only inside its range (`inR(f, a, b)`),
4. `PixelCut`s at `CUTS`,
5. `CaptionTrack` on top,
6. `PaperGrade` last.

---

## E. Creating a new video, step by step

Use Video 12 (`12_How_tobe_millionare_with_ai/` + `_BRAND_SYSTEM/src/episodes/millionaire/`) as the template throughout.

1. **Prepare the idea.** Write a storyboard table: narration line → what proves it visually (real media) or explains it (motion graphic). See the storyboard in `12_How_tobe_millionare_with_ai/07_OUTPUT/Millionaire_AI_Production_Notes.md`. Fact-check every claim; plan labels for hypothetical ones.
2. **Final voiceover.** The creator supplies the final recording. It is **locked**: no trim, fade, EQ, compression, normalisation, pitch or time change, no removed words or pauses, no AI voice. The picture is cut to the voice, never the reverse.
3. **Import without modifying.** Create `NN_Name/`, copy the voice byte-for-byte into `01_AUDIO/Original/`, record its sha256 in `06_QC/audio/sha256_before.txt`. Put a byte copy at `_BRAND_SYSTEM/public/episodes/<slug>/audio/narration_original.m4a` for preview. Make a 16 kHz analysis copy (`02_TIMING/vo_16k_analysis.wav`) for Whisper; never transcribe from the original in place.
4. **Analyse timing.** `02_TIMING/transcribe.py` (faster-whisper `large-v3-turbo`, CPU int8, Arabic, word timestamps, with an `initial_prompt` of topic words) → `whisper_words.json`. `recheck.py` re-listens to doubtful words; `build_words.py` writes `words.json` (fields `i, w, s, e, p, emph`) with corrected **display text only** (timings stay Whisper's) into both `02_TIMING/` and `_BRAND_SYSTEM/src/episodes/<slug>/data/`.
5. **Plan scenes.** Write `src/episodes/<slug>/ep.ts`: `WORDS`, `wf/we`, `DURATION` (frames ≥ decoded audio length; Video 12 = 1467 frames for 48.877 s), `CHUNKS`, `EMPHASIS`, and a media helper `M(name)`. Define scene ranges as word anchors in the master `.tsx`.
6. **Select real footage.** Only openly licensed sources with licence sidecars. Use `03_MEDIA/scripts/search_commons.py` (Wikimedia Commons API → thumbnail contact sheet with licences) and `fetch.py` (downloads originals plus a JSON sidecar with author, licence and URL). **Set your own contact in the `UA` string** of those scripts (`YOUR_CONTACT_EMAIL` placeholder; Wikimedia asks for a contact). `prep_media.py` makes trimmed/resized render copies into `_BRAND_SYSTEM/public/episodes/<slug>/media/`. Record everything in `03_MEDIA/ASSET_MANIFEST.md`. No watermarked media, no random people, no stock models. Pexels blocks automated access; do not work around it.
7. **Build motion graphics.** New `kit.tsx` re-exporting earlier kits; scene files in `scenes/` (Video 12 groups them as `Finance.tsx`, `Shift.tsx`, `Future.tsx`, `Close.tsx`). Build from §C components.
8. **Apply the identity.** Palette tokens only, the five brand fonts, `PaperGrade` over everything, credits on every real image, badges on hypothetical claims, titles in the safe zones, nothing important below y = 1560 or right of x = 950.
9. **Synchronise.** Anchor every event to `wf()`; captions via `CaptionTrack` with `HIDDEN` ranges; `PixelCut` on each cut. Register the composition in `src/Root.tsx`. Preview with `npm run studio`; render QC stills with `tools/stills.sh` (`COMP=<id> tools/stills.sh <name> <frames…>`) or a low-res preview (`--scale=0.4`).
10. **Subtle audio.** Copy `04_PRODUCTION/audio/audio_design.py` from Video 12: the voice is decoded once and added at **unity gain**; an original synthesised music bed sits **25 LU under the voice** (`MUSIC_BELOW_LU = 25.0`; accepted range 22–28) and is ducked under speech by an envelope follower; a short SFX cue sheet (time, sound, peak dBFS, pan) uses `_BRAND_SYSTEM/tools/sfxlib.py` (original numpy/scipy synthesis; Video 12: 39 cues, about 42 LU under the voice, peak −40 dBTP); an anti-clip gain keeps |voice + added| ≤ max(0.97, |voice|). Outputs `final_mix.wav` and `mix_report.json`.
11. **Render.** See §G.4: typecheck, bundle once, render muted 300-frame chunks, concat by stream copy, one encode to tv-range yuv420p, mux the mix as AAC 256k.
12. **Clean version.** Same picture stream, no music or SFX: either `-an` (fully silent, as Video 12 "Silent") or voice-only (as Video 11 "VOICE_ONLY", voice stem only). Never re-render the picture for it.
13. **Thumbnails.** Make a `Cover.tsx` composition with 2–3 variants (`variant` prop or `clean` prop) and render stills at 1080×1920 PNG. Pick one; keep alternatives. See §J.4.
14. **Quality checks.** `06_QC/audio/qc_audio.py` (Video 12): stream lists, identical packet md5 and decoded-frame md5 between the two versions, 0 audio streams in the silent one, voice gain estimate ≈ 1.0, sync lag 0 samples at three points, full narration length present, source sha256 unchanged. Then `blackdetect`/`freezedetect`, a labelled contact sheet (`06_QC/sheet.py`) and a playback check by a human (the mix must be listened to on a phone).

---

## F. Reproducing the style (for a new editor or AI agent)

1. Read this handbook, then `_BRAND_SYSTEM/README.md`, then `_BRAND_SYSTEM/src/brand/tokens.ts`, `anim.ts`, `timing.ts`, `type.tsx`, `paper.tsx`, `media.tsx`.
2. Open the latest episode: `_BRAND_SYSTEM/src/episodes/millionaire/Millionaire.tsx`, `ep.ts`, `kit.tsx`, `scenes/*.tsx`, `Cover.tsx`. Watch `12_How_tobe_millionare_with_ai/07_OUTPUT/Millionaire_AI_Final_With_Audio.mp4` next to it.
3. Start a new episode by copying the `millionaire` folder to `src/episodes/<slug>/`, replacing `data/words.json`, then rewriting scenes. Keep `CaptionTrack`, `PixelCut`, `PaperGrade`, the safe zones and the font roles unchanged.
4. Do not add new fonts, change the palette in `tokens.ts`, add a mascot, use stock people, use yellow as a background, or put information in the Reels UI zones.
5. Keep the audio philosophy: the narrator is the primary element; music and SFX are quiet support.
6. Look at the reference contact sheets (`12_How_tobe_millionare_with_ai/06_QC/final_sheet.jpg`, `11_RAM_GOLD/06_QC/final_sheet.jpg`) to compare your stills against the real look.
7. For a machine without Node, a Python port of the brand (skia + Pillow/raqm) exists in `4_MicroDuck_Robot/04_PRODUCTION/scripts/brand.py` (also used by Videos 5 and 6). It renders about 3 s per frame. The Remotion system is the main path.

---

## G. Technical setup

### G.1 Runtime (versions used on the production PC)

| Tool | Version | Notes |
|---|---|---|
| Node.js | 22.20.0 | for Remotion |
| Remotion | 4.0.537 (`@remotion/cli`, `media-utils`, `shapes`) | pinned in `_BRAND_SYSTEM/package.json`; Remotion Free License (individual / ≤3 employees) |
| React / React DOM | 18.3.1 | |
| TypeScript | 5.6.3 | |
| Python | 3.11.2 | |
| numpy / scipy / soundfile | 1.26.4 / 1.17.1 / 0.14.0 | audio design, QC |
| faster-whisper / ctranslate2 | 1.2.1 / 4.8.3 | transcription (model `large-v3-turbo`, about 1.6 GB, downloaded on first run) |
| Pillow / skia-python / av | 13.0.0 / 144.0.post2 / 18.1.0 | contact sheets, Python brand port |
| FFmpeg | 7.1 (gyan.dev essentials build) | probing, concat, encode, mux, loudness (`ebur128`) |

Hardware: the production PC has 8 GB RAM, so `remotion.config.ts` sets concurrency 1 and renders run one at a time, in the foreground, in chunks.

### G.2 Installation on a fresh computer

```bash
git clone https://github.com/Qaedleader/Content.git
cd Content/_BRAND_SYSTEM
npm ci                       # installs the exact versions from package-lock.json
npx tsc --noEmit             # typecheck

# Python (any folder outside the repo, or a .venv that is git-ignored)
python -m venv .venv
.venv/Scripts/python -m pip install numpy==1.26.4 scipy==1.17.1 soundfile==0.14.0 faster-whisper==1.2.1 pillow==13.0.0
# FFmpeg 7.x on PATH (https://ffmpeg.org)
```

There is no `requirements.txt` in the original project; the list above is what the scripts import.

### G.3 Configuration

- `_BRAND_SYSTEM/remotion.config.ts`: concurrency 1, JPEG frames at quality 95, codec H.264, CRF 16, `yuv420p`, Chromium OpenGL `angle`, OffthreadVideo cache 512 MB.
- `_BRAND_SYSTEM/tsconfig.json`: strict, `resolveJsonModule` (word timings are imported as JSON).
- `src/Root.tsx`: registers every composition at 1080×1920, 30 fps. Compositions: `NoMoneyAnymore`, `NoMoneyAnymoreV2`, `NoMoneyAnymoreV3`, `NeuralinkRemake`, `Asml`, `IgAlgo`, `AiAgent`, `Binance`, `RamGold`, `RamGoldCover`, `Millionaire`, `MillionaireCover`.

### G.4 Rendering commands (as used for Video 12)

```bash
cd _BRAND_SYSTEM
npx tsc --noEmit
npx remotion bundle src/index.ts --out-dir=out/bundle_ma
npx remotion render out/bundle_ma Millionaire out/ma_chunks/c01.mp4 --frames=0-299 --muted --concurrency=1
#   … c02 300-599, c03 600-899, c04 900-1199, c05 1200-1466  (≈70 s per chunk on the 8 GB PC)
ffmpeg -f concat -safe 0 -i out/ma_chunks/list.txt -c copy out/ma_chunks/picture.mp4
# one encode: pc → tv range, H.264 High, yuv420p, bt709, CRF 16, +faststart → out/ma_chunks/picture_tv.mp4
python -I ../12_How_tobe_millionare_with_ai/04_PRODUCTION/audio/audio_design.py      # → final_mix.wav
ffmpeg -i picture_tv.mp4 -i final_mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -movflags +faststart Final_With_Audio.mp4
ffmpeg -i picture_tv.mp4 -map 0:v -c:v copy -an -movflags +faststart Final_Silent.mp4
python -I ../12_How_tobe_millionare_with_ai/06_QC/audio/qc_audio.py

# thumbnails (one still per variant)
npx remotion still out/bundle_ma MillionaireCover cover_B.png --props='{"variant":"B"}'
```

The exact encode flags of the pc→tv step are not stored as a script in the repository; the resulting stream (verified with ffprobe) is H.264 High, yuv420p, tv range, bt709, 30 fps.

### G.5 Portability issues (known, not fixed)

- **Hardcoded Windows paths.** Many Python scripts and `tools/stills.sh` point at `D:/Content/...`, for example FFmpeg at `D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe`, the Python interpreter at `D:/Content/02_NEURALINK/07_PROJECT/.venv/Scripts/python.exe`, and the Whisper model cache at `D:/Content/02_NEURALINK/07_PROJECT/.models`. On another machine, either clone to `D:\Content` and create those tools there, or edit the `FF`, `ROOT` and `download_root` constants at the top of each script.
- **Media is not in the repository** (§I), so every episode composition except the pure-animation parts renders with missing images until the media is re-fetched into `_BRAND_SYSTEM/public/episodes/<slug>/media/` and the narration is placed at `public/episodes/<slug>/audio/narration_original.m4a`.
- **`python -I`** (isolated mode) ignores environment variables, so scripts call `sys.stdout.reconfigure(encoding='utf-8')` for Arabic output.

### G.6 Troubleshooting

- **Out of memory / killed renders:** render in 300-frame chunks, concurrency 1, foreground; close other heavy apps.
- **Fonts fall back:** `ensureFonts()` must run (it is called in `Root.tsx`); the files must exist in `public/brand/fonts/`.
- **Audio drifts or does not null:** the creator's `.m4a` has an edit list (2112 priming samples). Mux with plain `-c copy` and never add `-itsoffset`; verify with `framemd5 -c copy` plus a decoded-PCM md5.
- **Missing media errors in Studio:** re-fetch with the episode's `fetch.py` and `prep_media.py`, or replace with equivalent licensed media (§I).
- **Do not run `npm run build`** (there is none) or any production bundling beyond the Remotion bundle used for rendering.

---

## H. Example videos

| File | Episode | Composition | Notes |
|---|---|---|---|
| `12_How_tobe_millionare_with_ai/07_OUTPUT/Millionaire_AI_Final_With_Audio.mp4` (50.5 MB, 48.9 s, 1080×1920, 30 fps, H.264 + AAC) | Video 12 «كيف تصير مليونير بالذكاء الاصطناعي» (2026-11-02) | `Millionaire` | the latest finished video |
| `12_How_tobe_millionare_with_ai/07_OUTPUT/Millionaire_AI_Thumbnail.png` (+ `thumbnail_alternatives/` A and C) | | `MillionaireCover` variant B (A, C) | selected cover and the two alternatives |
| `11_RAM_GOLD/07_OUTPUT/RAM_GOLD_FINAL_CINEMATIC.mp4` (70.4 MB, 51.6 s, 1080×1920, 30 fps, H.264 + AAC) | Video 11 «RAM Gold», the AI memory war (2026-11-01) | `RamGold` | the previous finished video |
| `11_RAM_GOLD/07_OUTPUT/RAM_GOLD_THUMBNAIL.png` | | `RamGoldCover` (`clean: false`) | selected cover |
| `…/06_QC/final_sheet.jpg` (both episodes) | | | contact sheets of the final frames |

The silent version of Video 12 and the voice-only version of Video 11 are not uploaded: their picture is bit-identical to the files above.

**What in the code produces what you see:**

- *Video 12*, opening: `Money3D` extruded gold `$1,000,000` counter over a dark NYSE photo with `GoldDust` → `scenes/Finance.tsx` (`Hook`). Dashboard and projection: `Panel`, `GrowthChart`, coin drops, disclaimer label → `Finance.tsx` (`Deposit`, `Sp500`, `Growth`). The 30-year problem: `CalendarBlock` flip 2026→2056 → `scenes/Shift.tsx` (`Problem`). AI reveal: `PixelMask` dissolve to the real DGX B200 with `NeuralNet` → `Shift.tsx` (`AiReveal`). Seven industries and one-person company → `scenes/Future.tsx`. "The secret", follow, comment card → `scenes/Close.tsx`. Cuts: `PixelCut` at `CUTS` in `Millionaire.tsx`. Captions: `CaptionTrack` with `HIDDEN` ranges. Cover B: `Cover.tsx` (NYSE above, DGX below, pixel seam, `HeroWord` headline, `Money3D`, `Label`).
- *Video 11*: `episodes/ramgold/` — `RamCut` (DDR5 cut-out with a gold twin revealed by a wipe), `Sweep`, `Brackets`, `EdTag`, `GoldDust`, scenes `Hook`, `Demand`, `Price`, `Quote`, `Tech`, `Gold`; cover in `ramgold/Cover.tsx`.

**Licences of what is visible in these videos:** all real media is from Wikimedia Commons (CC BY, CC BY-SA, CC0, public domain, MIT screenshot) and credited on screen; full tables in `12_How_tobe_millionare_with_ai/03_MEDIA/ASSET_MANIFEST.md` and `11_RAM_GOLD/03_MEDIA/ASSET_MANIFEST.md`. Adapted CC BY-SA images remain under CC BY-SA. Logos shown in Video 11 are trademarks of their owners, used editorially. Music, SFX and all graphics are original. The narration is the creator's own voice. These videos are included as style references for this production system, not as reusable stock.

---

## I. Missing external assets (not in GitHub)

| Not included | Why | How to supply it |
|---|---|---|
| Creator voiceovers (`*.m4a.mp4` in each episode root, `01_AUDIO/`, `public/episodes/*/audio/`) | private recordings | the creator provides the locked voiceover for each new episode |
| Raw downloads (`03_MEDIA/raw/**`, about 15 GB) | size and third-party licences; only the licence sidecar `*.json` files are kept | re-download from the URL in each sidecar with the episode's `fetch.py`, or choose new Commons media with `search_commons.py` |
| Render copies `_BRAND_SYSTEM/public/episodes/` (≈470 MB) | derived from the raw media; includes logos and trademarks | regenerate with each episode's `prep_media.py` |
| Mixkit / Pexels stock (Videos 2, 3, 8) | their licences do not allow redistributing the files | download them yourself from the source under its licence, or substitute Commons media |
| Reference style images (`Familiar style/`), research contact sheets and motion strips, reference-video transcript | third-party material used only for analysis | not needed: the identity is now fully defined in code and §B |
| Earlier final videos, review renders, chunks, `out/` (≈6 GB) | intermediate or older outputs; size | re-render from the compositions |
| Audio stems and mixes (`*.wav`) | regenerable; contain the private voice | rerun `audio_design.py` |
| Whisper model weights, Blender 4.2 portable, Python venvs, `node_modules` | downloadable tools | §G.2; faster-whisper downloads the model on first use; Blender from blender.org (only Videos 1–2 used it) |
| Press kits and saved web pages (Tesla, Micro Duck, ZEISS), 3D source models (BodyParts3D) | third-party | re-obtain from the original source under its terms |
| Some fonts used only by Videos 1–2 (Amiri, Noto Naskh Arabic) | not part of the current brand | Google Fonts (OFL) if those legacy projects are ever re-rendered |

Without these assets, the **brand system, all reusable components, the timing/caption/audio/QC pipelines and the cover system** are fully reproducible from the repository; individual past episodes can be re-rendered only after their media and narration are supplied.

---

## J. Production standards

### J.1 Video

- 1080×1920, 9:16, **30 fps**, H.264 High, yuv420p, bt709, tv range, CRF 16, `+faststart`; AAC-LC 256 kb/s, 44.1 kHz stereo.
- Duration: frames ≥ decoded narration (never cut the last word); Videos 11–12 are 51.6 s and 48.9 s.
- Two deliverables: the full mix and a clean version (silent or voice-only) with a bit-identical picture.

### J.2 Audio balance

- Narrator's original voice at unity gain, untouched (verified by a null test: gain estimate ≈ 1.000, sync lag 0 samples).
- Music: original synthesis, **22–28 LU below the voice (target 25 LU)**, ducked under speech.
- SFX: few, quiet and purposeful (Video 12: 39 cues at about 42 LU under the voice, peak −40 dBTP), from `tools/sfxlib.py`.
- No copyrighted music, no samples.

### J.3 Pacing and motion

- A cut or major change at phrase onsets (Video 12: 12 scenes in 48.9 s; list beats can be as short as the spoken word, about 0.5 s).
- Strong hook in the first 2 s (Video 12: the gold `$1,000,000` counter and «مليونير؟» slam; Video 11: the RAM-as-gold idea).
- One main mover at a time; every motion has a visible cause; springs for entrances, cubic ease for moves, 6-frame exits.
- Real media proves, graphics explain. Videos 11–12 run about 33 % (V12) real media; Video 7 about 70 %.
- Facts: hypothetical numbers carry a badge and a disclaimer (for example «العوائد التاريخية لا تضمن النتائج المستقبلية»); quotes are verbatim with a source.

### J.4 Thumbnails / covers

Covers are Remotion stills (`Cover.tsx`, 1080×1920 PNG), following the system used since Video 10:
1. **Series tag** (`EdTag`) at y ≈ 300,
2. **hero headline** (`HeroWord`, Lalezar, yellow face on a charcoal strip, rotated about −2°) at y ≈ 400,
3. **focal object** (real photo, extruded number or cut-out) in the centre,
4. **label strip** (`Label`) under it,
5. `PaperGrade` on top,

all inside the 4:5 grid-safe band. Make two or three variants, pick the one with the clearest idea and highest contrast at feed size, and keep the alternatives.
