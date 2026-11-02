# Microduck (video 4): final production report

**Final video:** `07_OUTPUT/MICRO_DUCK_ROBOT_FINAL.mp4`, sha256 `eea757a997f5946ac60ffdcdeb2605c5bbc4441e081c4f742381a93b8c704b6a`, 40,683,573 bytes.

**Google Drive:** My Drive › Content › Video 4 Micro Duck Robot › `MICRO_DUCK_ROBOT_FINAL.mp4`

- Link: https://drive.google.com/file/d/1SfTOWkRvxyQaa4-S9RAyjAJupo2X_0TE/view
- Folder ID: `1YECPfB1I2ZwMBk6wGqqE6yKKvvHO9ez8`
- Content folder ID: `1Gphlf3c1VYyv-aNa1vLQ4ej11h5b72Nm`

## Technical (verified with ffprobe on the exported file)

| Property | Value |
|---|---|
| Video | H.264 High @ L4.0, 1080×1920, 30/1 fps, yuv420p, bt709 tv range, 1173 frames, 39.100 s, CRF 14 |
| Audio | AAC-LC, 44.1 kHz, stereo, 1679 packets, **stream-copied** from the source |
| Container | MP4, fast-start (`moov` before `mdat`) |

## Audio preservation (automated checks, `06_QC/audio/`)

| Check | Result |
|---|---|
| Ordered per-packet payload MD5, source vs final (`framemd5 -c copy`) | 1679 / 1679 identical |
| pts, dts and skip-samples side data per packet | identical. The only difference is the container *duration* field of the last packet (1024 → 1050): mux metadata, not audio data. |
| Whole-stream packet MD5 | `b7b39c6a…` = `b7b39c6a…` |
| Decoded PCM MD5 | `5b79ae6d…` = `5b79ae6d…`, 6,868,736 bytes each (bit-exact) |
| Source file | untouched. sha256 `8f48ba92…` for both `D:\downloads\MicroDuck robot.m4a.mp4` and the read-only copy in `01_AUDIO/Original/` |

The video (39.10 s) is 0.16 s longer than the narration (38.94 s presented). The last frame holds; the audio is not stretched.

## Narration (Whisper large-v3-turbo, word timings in `02_TIMING/`)

> الروبوت صغير انت بتعلمه اللي بدك ياه بعالم افتراضي وبعدين ينفذ اللي تعلمه قدامك. اسمه مايكرو دك من شركة Pollen Robotics التابعة لـ Hugging Face. طوله 25 سنتي. وجواته 15 محرك وكاميرا وحساسات للحركة والمسافة. وكمبيوتر صغير بيشغل ذكاء الحركة محلياً. يمشي ويقعد ويقدر يقوم بعد الوقعة. وحتى بتتزحلق بملحق عجلات. والأحلى برمجياته Open Source يعني مفتوحة المصدر. تقدر تدرب نسخة افتراضية منه على مهارات جديدة وبعدين تنقل النموذج لجسمه الحقيقي. يعني عندك مختبر روبوتات صغير بتقدر تطوره بيدك. وسعره حوالي 400 دولار للحجز المسبق قبل الشحن والضرائب. انت لو عندك واحد شو أول حركة بتعلّمه إياها؟

## Storyboard as built (narration seconds)

| Time | Beat | Visual |
|---|---|---|
| 0–5.0 | Hook | The official sim2real film: simulated twin, then a yellow scan-wipe on «وبعدين ينفّذ» to the real robot at the same timecode. Labelled «نسخة افتراضية» and then «الروبوت الحقيقي». |
| 5.0–10.8 | Name, maker, size | Official cut-out on the paper stage, hero «مايكرو دك», unaltered wordmark, Pollen Robotics and Hugging Face cards with real logos, then a 25-tick yellow ruler with «25 سم». |
| 10.8–14.7 | Components | Press close-up print; «15 محرّك» counter with 15 pixel squares; then camera (marker on the lens), motion sensors (IMU ×2), distance sensor (LiDAR 8×8), one at a time. |
| 14.7–17.3 | Onboard computer | Illustrated RK3566 chip badged «رسم توضيحي», a link to the robot, a 50 Hz policy-loop meter, and the hero word «محلياً». |
| 17.3–21.9 | Skills (real footage only) | Walks, sits, gets back up (launch film, sticker cropped out), roller-skates, then the wheel attachment. Each cut lands on the spoken word, with a numbered tag. |
| 21.9–24.7 | Open source | The two real repositories as paper windows, the Apache 2.0 stamp, «Open Source», «مفتوحة المصدر». |
| 24.7–27.8 | Training | 4×4 grid built from the official simulation footage, labelled as an explanation, with a note that the repository example trains 4096 copies. Pixel progress bar; tiles get ticks on «مهارات جديدة». |
| 27.8–29.5 | Sim → real | Sim print («التدريب: على كمبيوتر خارجي») passes a policy.onnx file card to the real print («التنفيذ: على الروبوت نفسه»). Both play the same timecode. |
| 29.5–32.6 | Small lab | Real desk press photo, live sim-twin inset, policy file, and the real `uv run train …` command from microduck_rl. |
| 32.6–36.6 | Price | Hanging tag: «حوالي 400$», «السعر المعلن: 399$», «حجز مسبق» stamp, «لا يشمل الشحن والضرائب», and «الإطلاق في أمريكا الشمالية وأوروبا · التسليم غير فوري». |
| 36.6–39.1 | Closing question | «انت لو عندك واحد… / شو أوّل حركة / بتعلّمه إياها؟» in large type over the walking cut-out. Captions are hidden here. |

## Visual identity applied

This video uses the approved **Paper Workshop** system, from the most recent approved episode, No Money V3 (2026-10-23):

- Tokens and fonts are copied from `_BRAND_SYSTEM/src/brand/tokens.ts`: navy `#1F2C3F` and cream graph-paper stages, kraft floor, saffron `#F2B630` reserved for emphasis.
- Index-card titles with a yellow binder clip.
- Baloo Bhaijaan 2 word-strip captions, right to left, with the emphasis word on yellow.
- Lalezar hero words on torn yellow strips.
- Taped photo prints with dark credit tags.
- Rubber-stamp badges for illustration and simulation.
- Restrained pixel/Y2K details: scan-wipe pixels, pixel counters, pixel cursor, window chrome.

No local Node.js was run. The Remotion components were ported to Python (skia + Pillow/raqm) in `04_PRODUCTION/scripts/brand.py`.

## Checks actually performed

- **Automated:** the ffprobe stream and format checks above; audio packet, side-data and PCM comparisons; `blackdetect` (no black segments); `freezedetect` (n=0.002, d=0.5 s, **no freezes** in the final file); fast-start atom order; sha256 of source, copy and final.
- **Visual inspection (by me, from extracted frames):**
  - 3 fps contact sheets of the entire final export (`06_QC/final_sheets/`, 118 frames).
  - 18 full-resolution keyframes (`06_QC/keyframes/`) covering the first frame, the sim→real wipe, every scene cut, the components, skills, simulation, price and ending.
  - A zoom check of the «399$» bidi rendering.
- **What these checks fixed (in a second full render):**
  - A 1.4-frame audio offset, corrected after verifying the source edit list.
  - The hook running into a different source shot.
  - The «25 سم» overlap.
  - A static hold in the open-source scene.
  - A bidi-flipped «$399».
  - A fatha in «دك» that rendered like ذ.
- **Not performed:** I cannot listen to audio, so I did not "watch with sound". Audio presence and timing are proven by the bit-exact packet and PCM checks and the Whisper word timings, not by listening.

## Google Drive delivery

- **Connector:** the Google Drive connector failed with "Insufficient scope".
- **Browser session:** delivered through the signed-in Chrome session.
  - The `Content` folder was verified by its contents (Tesla First Vid, NeuralLink VIid 2, no moey vid3).
  - `Video 4 Micro Duck Robot` did not exist, so it was created inside `Content`.
  - The extension's upload bridge is limited to 10 MB, so the MP4 was passed in five byte-exact parts and reassembled in the page. Its in-browser SHA-256 matched the local final before upload.
  - It was then given to Drive's own drop-upload.
- **Verified in Drive:** the file listing in the destination folder shows `MICRO_DUCK_ROBOT_FINAL.mp4`, 38.8 MB (= 40,683,573 bytes).
- **Sharing:** no sharing settings were changed. The new folder inherits the existing sharing of `Content`, as Drive does by default.

## Not done

- No social posting.
- No sharing or permission changes.
- No purchases.
- No packages installed.
- No build or Node execution.

---

# Revision 2 (2026-10-24): first two shots replaced with real action footage

**File:** `07_OUTPUT/MICRO_DUCK_ROBOT_FINAL_REV2.mp4`, sha256 `381b2ed254174802f72801fd1d780f300778672783dc61fc1116b2e1db36af6c`, 44,556,536 bytes.

**Drive:** Content › Video 4 Micro Duck Robot › `MICRO_DUCK_ROBOT_FINAL_REV2.mp4`

- Link: https://drive.google.com/file/d/1NsQNLdYNL3_ePFzClfbF5kJ4fSh-v0jp/view
- The previous file `1SfTOWkRvxyQaa4-S9RAyjAJupo2X_0TE` is kept, as is the local `MICRO_DUCK_ROBOT_FINAL.mp4`.

## What changed

| Shot | Frames (same boundaries) | Previous | Revision 2 (real footage, muted, moving from frame 0) |
|---|---|---|---|
| 1 | 0–150 (0–5.03 s) | Sim→real wipe | `gh_microduck_rl_hero_montage.mov` 16.0–21.2 s: two Microducks striding at the camera, one lunging in close. Crop 960×720 @ (160, 0), shown at ~1:1, no upscaling. |
| 2 | 151–323 (5.03–10.80 s) | Rendered cut-out, name cards, ruler | `gh_microduck_it_rolls.mp4` 15.3–21.1 s: Microduck roller-skating toward camera and turning. A 960×720 window follows the measured robot position (no upscaling). |

- **Kept:** title cards (shot 2 now reads «اسمه مايكرو دك», then «طوله 25 سم»), captions, and credit tags.
- **Not shown:** no jumping, because no authentic footage of it exists. No simulation, renders or stills in these shots.

## Verification (automated)

- **Audio:**
  - 1679/1679 ordered packet payload MD5s identical to the source narration.
  - pts, dts and skip side data are identical. The only difference is the container duration field of the last packet, as in V1.
  - Decoded PCM MD5 is `5b79ae6d…` for both.
- **Format:** 1173 frames, 30 fps, 1080×1920, 39.100 s, the same as the previous export.
- **Frames 360–1172 (shot 3 onward):** 813/813 video packets **byte-identical** to the previous export. The decoded PSNR is ∞.
- **Frames 324–359 (first 1.2 s of shot 3):** these sit between the shot boundary and the next keyframe. They were rendered from the unchanged scene code and re-encoded. PSNR against the previous export: average 51.1 dB, minimum 49.7 dB, which is visually indistinguishable.
- **Freezes and black:** `freezedetect` and `blackdetect` over 0–11 s found nothing.
- **Visual review:** a 5 fps sheet of 0–12 s and every frame across the cut into shot 3 (`06_QC/rev2/`).
- **Note:** the montage source is 29 fps. Conversion to 30 fps repeats one frame per second; there is no interpolation and no artificial motion.
