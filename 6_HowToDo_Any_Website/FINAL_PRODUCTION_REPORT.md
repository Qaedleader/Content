# How to do any website (video 6): final production report

**Final video:** `D:\Content\6_HowToDo_Any_Website\07_OUTPUT\HOW_TO_DO_ANY_WEBSITE_FINAL.mp4`, sha256 `50dd011a3396e18a04873cdd926b493ae341ba291dd02f9420462609e70d1c88`, 29,745,865 bytes.

## Technical (verified with ffmpeg and an MP4 box parse of the exported file)

| Property | Value |
|---|---|
| Video | H.264 High, 1080×1920, **30 fps CFR**, **900 frames** (pts 0 … 899×512 @ 1/15360), yuv420p bt709 tv range, CRF 14 |
| Duration | movie header **30.000 s**; video track 30.000 s |
| Audio | original AAC-LC 44.1 kHz stereo, **stream-copied**; track 29.651 s including priming. The voice (1,306,624 samples = 29.629 s) starts at t = 0 and ends before the picture. |
| Container | MP4, fast-start |

The supplied recording measures 29.70 s in its container (29.629 s of actual audio after the 2112-sample priming), so there is no conflict with the 30 s target. No padding was needed: the picture simply runs past the end of the voice.

## Voice preservation (evidence in `06_QC/audio/`)

| Check | Result |
|---|---|
| Source sha256, before and after | `e3052d25…63a9`, unchanged. The read-only copy is identical. |
| AAC packet payload MD5s, source vs final | **1279 / 1279 identical**, in order. pts, dts and the priming skip are identical. The only difference is the container duration field of the last packet (1024 → 1049), the same as in Videos 4–5. |
| Decoded PCM MD5 | `6407558a…` both, 5,230,336 bytes each (bit-exact, so no speed, pitch, gain or processing change) |
| Level (volumedetect) | mean −17.1 dB, max −0.0 dB, identical to the source (unity gain) |

**Sound effects:** none were used, and there is no music. Any effect would have required mixing and re-encoding the voice, and the brief puts voice preservation first. Keeping the original encoded stream bit-exact was the safer choice.

## Transcript (Whisper large-v3-turbo; display spelling corrected, timings unchanged)

> بثلاثين ثانية بشرح لك كيف تعمل الموقع اللي ببالك وتخليه Live. أول شي خطّط فكرتك مع ChatGPT وحدّد شو بدك بالموقع. بعدين افتح VS Code على جهازك وافتح التيرمنال، ثبّت Claude Code وسجّل دخولك وشغّله داخل مجلد المشروع. ارجع لـ ChatGPT وقل له اعمل لي برومبت شامل لكلود كود ينفّذ هاي الفكرة كاملة. بعدين انسخ البرومبت أعطيه لكلود وخلّيه يكتب المشروع. بعدين ارفع الكود على GitHub، اربط بـ Vercel، واضغط Deploy. بعد ما ينجح النشر صار عندك رابط لموقعك بتقدر تبعثه لأي حدا.

## Storyboard as built

| Time | Step | Visual |
|---|---|---|
| 0–3.5 | Hook | The finished example site from frame 0: desktop browser `sukkar-coffee.vercel.app` and phone. A 30-second pixel timer; hero «Live» on «Live». |
| 3.5–7.2 | ١ Planning | ChatGPT window (explanatory): «بدي موقع لمقهى «سُكّر»», then a plan with three bullets. |
| 7.2–13.6 | ٢ Editor | **Real VS Code** screenshot, then the **real integrated terminal** (TERMINAL tab bracketed). Terminal card: `npm install -g @anthropic-ai/claude-code`, `claude`, `/login`, `cd sukkar-coffee`, `claude`. Then the **real Claude Code** welcome screen, labelled «داخل مجلد المشروع». |
| 13.6–18.5 | ٣ Prompt | ChatGPT: «اعمل لي برومبت شامل لـ Claude Code». A prompt card builds line by line; hero «شامل»; «جاهز» stamp on «كاملة». |
| 18.5–21.9 | ٤ Build | Ctrl+C on the prompt card, which flies into **real Claude Code footage** (working). File tree `index.html / menu.html / styles.css / script.js` ticks in; a `localhost:3000` preview with «راجع النتيجة». |
| 21.9–23.5 | ٥ GitHub | **Real GitHub Docs** "New repository" screenshot and `git add/commit/push` terminal card. |
| 23.5–25.6 | Vercel | **Real Vercel Docs** "Import Git Repository" screenshot, our `sukkar-coffee [Import]` row, Deploy button pressed on «Deploy». |
| 25.6–30.0 | ٦ Live | Building… → Ready, «تم النشر» stamp, then the same site reveal as the hook with a `sukkar-coffee.vercel.app` link chip. The link flies to three chats on «تبعثه لأي حدا». Slow push-in hold through frame 899. |

## Style references actually inspected

- **Video 4:** `4_MicroDuck_Robot/07_OUTPUT/MICRO_DUCK_ROBOT_FINAL_REV2.mp4`, 0.5 fps contact sheet of the whole video (`03_MEDIA/review/ref_v4rev2.jpg`), plus its source `brand.py` and `episode.py`.
- **Video 5:** `5_Huawei_Share` (Huawei Share), source and final contact sheets.
- **Reused unchanged:** `brand.py` (tokens, fonts, paper textures, title cards, captions, prints, credits, badges, hero words, pixel details) and the caption system. The phone prop comes from Video 5.

## Checks performed on the exported MP4

- **ffmpeg / ffprobe:** frame count, pts, box-level durations, full decode with no errors, `blackdetect` (none), `freezedetect` (none).
  - The first export had static holds at 17.8–18.5 s and 29.4–30.0 s. I added gated motion, re-rendered chunks c04 and c06, and re-checked: none remain.
- **Audio:** packet, PCM and level comparisons, as above.
- **Visual:** 3 fps contact sheets of the whole export (`06_QC/final_sheets/`) and full-resolution stills of each section. I checked Arabic shaping and RTL, mixed Arabic/English names, caption timing, the caption safe zone, legibility, crops and the final frame.
  - A missing «✓» glyph in the badge font was caught and removed before the final render.

**Not available:** listening. I cannot hear audio; voice integrity is proven by bit-exact packet and PCM equality, not by ear.

## Scope notes

- The example site and its URL are illustrative and labelled «مثال توضيحي».
- No account was created, nothing was deployed, and no live project was touched.
- No build, Node, dev server, package installation or paid asset was used.

## Google Drive

- **Upload:** My Drive › Content › **How to do a new website** › `HOW_TO_DO_ANY_WEBSITE_FINAL.mp4`.
- **Duplicate:** a double drop briefly created two identical copies. The extra copy was moved to Drive Trash (recoverable), not permanently deleted.
- **Sharing:** unchanged. The file inherits the existing sharing of the Content folder.
