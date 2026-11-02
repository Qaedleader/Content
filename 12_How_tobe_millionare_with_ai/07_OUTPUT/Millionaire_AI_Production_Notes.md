# Millionaire × AI — production notes (Video 12, 2026-11-02)

## Deliverables
| File | Content | Size | sha256 |
|---|---|---|---|
| `Millionaire_AI_Final_With_Audio.mp4` | Version 1: original voice + subtle original music + 39 light SFX | 50 545 677 B | `86ddd1d9…aee83b` |
| `Millionaire_AI_Final_Silent.mp4` | Version 2: identical picture, **no audio stream** | 49 013 257 B | `3780cc6e…e776f` |
| `Millionaire_AI_Thumbnail.png` | Selected cover (concept B «two worlds»), 1080×1920 PNG | 3 404 653 B | `4959f4ab…6fd46922` |
| `thumbnail_alternatives/…Alt_A_GoldNeural.png`, `…Alt_C_PaperMinimal.png` | Optional alternative covers (local only) | — | see `06_QC/sha256_outputs.txt` |

- **Duration:** 1467 frames = **48.900 s**. The decoded narration is 2 155 456 samples = 48.877 s; its last word ends at 48.64 s.
- **Video:** 1080×1920 (9:16), **30 fps** (house standard; the source is audio-only, so 60 fps would add nothing), H.264 High, yuv420p, bt709, tv range, CRF 16, faststart.
- **Version 1 audio:** AAC-LC, 256 kb/s, 44.1 kHz stereo.

## Voice preservation and audio verification (`06_QC/audio/qc_audio_report.json`)
- **Source file:** `How to be millionaire with Ai.m4a.mp4`, sha256 `d52b1a63…cdd8aa3`. It is **unchanged** (same hash before and after), and a byte copy is kept in `01_AUDIO/Original/`.
- **Voice in the mix:** the narration was decoded once to float and added at **unity gain**. The stem is bit-identical to the source decode. There was no trim, fade, EQ, compression, normalisation, pitch or time change, and no word or pause was removed. The picture was timed to the voice.
- **Null test on the exported file:**
  - voice gain estimate **0.9993**
  - added layers −24.0 dB relative to the voice
  - AAC coding residual −43.8 dB
- **Sync:** lag between source and mix = **0 samples** at 1 s, 24 s and 47 s.
- **Full length:** the mix decodes 2 156 544 samples, covering all 2 155 456 source samples. The last word «تتعلموه» is present at the same level.
- **Levels (EBU R128):**
  - voice −13.6 LUFS
  - music bed −38.6 LUFS, which is **25.0 LU under the voice** (brief: 22–28)
  - SFX 42 LU under the voice, peak −40 dBTP
  - music ducked under speech
  - 0 samples where the added layers push past the ceiling
- **Source peaks:** the original recording has a sample peak of 1.03 (+0.3 dBTP). That is a property of the source file, left untouched as required.
- **Silent version:** **0 audio streams** (the video stream only).
- **Identical picture:** in both files, all 1467 frames have identical packet md5 **and** identical decoded-frame md5.
- **Listening:** I cannot listen to audio. The mix was checked only by measurement (loudness gap, ducking, null test). Please give it one listen on a phone before posting.

## Financial accuracy
- **Projection:** $500 deposited at the end of every month, 10 %/yr effective, compounded monthly, over 30 years.
  - Result: **$1,031,422** from **$180,000** paid in.
  - With nominal 10 %/12 it would be $1.13 M. The conservative figure is shown.
  - Either way the narration's «أكثر من مليون دولار» holds under its own assumption.
- **On-screen treatment:**
  - The chart is labelled «hypothetical projection», and the 10 % is labelled «متوسط تاريخي تقريبي · مش وعد».
  - The disclaimer «العوائد التاريخية لا تضمن النتائج المستقبلية» stays on screen throughout the projection, with the method line «سيناريو افتراضي … قبل الرسوم والضرائب والتضخم».
- **«99%»:** this is the narrator's expression. It is tagged «تعبير الراوي · مش احتمال محسوب».
- **«S&P 500»:** described as «حوالي 500 من أكبر الشركات الأمريكية».
- **Trading tile:** carries «تحليل بمساعدة AI · مش ربح مضمون».
- **One-person company:** carries «الأدوات بتضاعف قدرتك · النجاح مش مضمون، وبعض الأدوار بتضل بحاجة لناس».

## Captions
- **Transcription:** local faster-whisper large-v3-turbo with word timestamps, plus a targeted re-listening pass (`02_TIMING/recheck.py`).
- **Corrected misreads** (display text only; timings are Whisper's):
  - «دجارة» → **تجارة**
  - «شركي» → **شركة**
  - «رح أ / سأبدأ» → **رح أبدأ**
  - the ending → **«شو أول شي بدكم تتعلموه؟»**
- **Display:** word-synced paper strips (RTL, Baloo Bhaijaan 2), 1–3 words per chunk, with key words highlighted in brand yellow. When a hero word already shows the same words, the captions step aside. The final question card shows the requested «شو أول إشي بدكم تتعلموه بالذكاء الاصطناعي؟».

## Visual identity references used
- **Brand system:** `_BRAND_SYSTEM`, Remotion 4.0.537. Palette: yellow `#F2B630`, cream, charcoal, navy.
- **Fonts:** Alexandria, Lalezar, Baloo Bhaijaan 2, IBM Plex Arabic, JetBrains Mono.
- **Pixel details:** PixelCut transitions, PixelMask reveals and PixelRow progress bars.
- **Editorial elements:** index-card titles, paper hero words, credit tags on all real media.
- **Reused parts:** the cinematic layer from Video 7 (ASML), the Stage/Stream parts from Video 10 (Binance), and EdTag/Note/GoldDust from Video 11 (RAM_GOLD).
- **Cover:** follows the Video 10/11 cover system: series tag → hero headline strip → focal figure → label strip, all inside the 4:5 grid-safe band.
- **New for this episode:**
  - extruded gold money typography
  - product-style UI panels
  - the projection chart
  - the flip calendar
  - the pixel neural net
  - a cool AI accent (`#7FD6FF`), used only from the AI reveal onwards

## Storyboard (narration → visuals)
| s | Narration | Visual |
|---|---|---|
| 0.0–1.8 | بدك تصير مليونير؟ | $1,000,000 extruded gold counter rolls up over a dark NYSE façade, gold dust, «مليونير؟» slam |
| 1.8–4.3 | رح أعطيك استراتيجية 99% رح تخليك مليونير | The counter rises; a strategy dossier with 3 pixel-redacted steps; «99%» + narrator tag; «الهدف: مليون» stamp |
| 4.3–7.1 | كل اللي عليك تعمله إنك تستثمر 500 دولار كل شهر | Auto-invest dashboard: toggle ON, «$500 / month», a coin drops into each of 12 months, yearly total |
| 7.1–10.2 | بصندوق بيتبع مؤشر S&P 500 الأمريكي | Real NYSE → «S&P 500» plate, a fund box filling 500 pixel cells, «~500 of the largest US companies» |
| 10.2–15.9 | بعد 30 سنة … حوالي 10% سنوياً | Projection panel: years 0→30, counter to $1,031,422, paid-in line $180,000, «≈10% سنوياً» + historical-average badge, disclaimer |
| 15.9–19.0 | بس في مشكلة.. مين فينا عنده صبر يستنى 30 سنة؟ | Energy drops: the figure drains to grey, «مشكلة», a tear-off calendar flips 2026→2056 (slow, then rushing), «30 سنة؟» |
| 19.0–22.4 | عشان هيك، إذا بدك تسرع طريقك للثروة بوقتنا الحالي | Path diagram: winding 30-year road vs a straight «أسرع» path to $, which turns AI-cyan with «NOW · 2026» |
| 22.4–24.4 | لازم تتعلم تستخدم الذكاء الاصطناعي | Pixel-mosaic dissolve to a real NVIDIA DGX B200 with a neural-net overlay, «الذكاء الاصطناعي» |
| 24.4–27.7 | اللي رح يتقنوا هاي التكنولوجيا … أسياد المستقبل | Real typing footage + AI-agent workflow panel completing tasks → real data-centre aisle, «أسياد المستقبل» |
| 27.7–33.1 | برمجة، تسويق، مبيعات، تداول، تحليل أسواق، صناعة محتوى، تجارة إلكترونية، أي إشي | 7 distinct treatments (code footage + AI prompt, campaign dashboard, CRM pipeline, candlesticks + no-guarantee badge, real ticker board, real Kdenlive timeline, real Ocado robot warehouse + order card) → mosaic «أي إشي» |
| 33.1–36.2 | الذكاء الاصطناعي صار يخليك لحالك تعمل شغل شركة كاملة | One operator in a neural halo, «شخص واحد», 8 departments linked by data streams into one system, «شغل شركة كاملة» |
| 36.2–41.3 | بس السر مش بالأداة … يستخدموها صح | Cream paper: «إنك تملك أدوات AI» crossed out vs «إنك تعرف تستخدمها صح» with a check; skills: مهارة · حكم صحيح · تنفيذ · فهم; stamp «الأداة لحالها مش ميزة» |
| 41.3–46.4 | تابعوني.. رح أبدأ سلسلة … بالذكاء الاصطناعي | «تابعوني» + follow button tapped → «سلسلة جديدة» with 5 episode cards cycling |
| 46.4–48.9 | اكتبوا لي بالتعليقات شو أول شي بدكم تتعلموه؟ | Question card typing «شو أول إشي بدكم تتعلموه بالذكاء الاصطناعي؟», comment field, prompt chips, final «$1M + AI» lockup |

## Thumbnail selection
I made three concepts at 1080×1920:
- **A «gold & neural»:** a $1,000,000 hero over a projection curve with a neural net. Clean, but abstract.
- **B «two worlds» (selected):** a real NYSE façade above and a real NVIDIA DGX B200 below, split by a brand pixel seam, with a gold $1,000,000 bridging them. It shows wealth + AI + the investing→AI story in one glance, has the highest contrast, and uses real objects instead of cash piles.
- **C «paper minimal»:** a charcoal $1M on cream paper. The calmest of the three, but the weakest at feed size.

The headline «كيف تصير مليونير؟» and the $1,000,000 both sit inside the 4:5 grid-safe band (y ≈ 300–1400).

## External assets and licences
All are from Wikimedia Commons; the full table is in `03_MEDIA/ASSET_MANIFEST.md`.
- **Used:**
  - NYSE photos: 颐园居 CC BY-SA 4.0; Arild Vågen CC BY-SA 4.0; Carlos Delgado CC BY-SA 3.0
  - E-ticker: public domain
  - Qtstalker chart: CC0
  - VS Code screenshot: MIT
  - Kdenlive: CC BY 3.0
  - Blender: CC0
  - Ocado bots: Techwords CC BY-SA 4.0
  - NVIDIA DGX B200: Pokiiri CC BY-SA 4.0
  - Footage: Gyasi Linje CC BY 3.0; Lawrence Systems CC BY 3.0
- **Original work:** the music and SFX (synthesis) and all graphics.

## Rebuild
- **Composition:** `Millionaire`, plus `MillionaireCover` with prop `variant` A|B|C, in `D:/Content/_BRAND_SYSTEM/src/episodes/millionaire/`. A snapshot is in `05_PROJECT/remotion_episode_millionaire/`.
- **Steps:**
  1. Run `npx tsc --noEmit`.
  2. Bundle to `out/bundle_ma`.
  3. Render 5 muted chunks of 300 frames each (about 70 s per chunk).
  4. Concat them by stream copy.
  5. Re-encode once pc→tv range (`out/ma_chunks/picture_tv.mp4`).
  6. Run `python -I 04_PRODUCTION/audio/audio_design.py` with the venv python.
  7. Mux the picture with `final_mix.wav` (AAC 256k) for Version 1, and mux the picture alone with `-an` for Version 2.
  8. Run `python -I 06_QC/audio/qc_audio.py`.

## Google Drive delivery
- **Destination:** My Drive › Content › **How to be Millionaire with AI**, a new folder (`1VeB4-brYHh47uGXFaj6FONELStCoIQqJ`). No existing content was modified or deleted, and no sharing settings were changed; the files inherit the Content folder's sharing.
- **Upload method:** the Drive connector still returns "Insufficient scope", so I uploaded through Chrome.
  - Each video was split into 9 MB parts and reassembled in the page.
  - The SHA-256 of each reassembled file matched the local file before upload.
  - One drop; Drive reported «اكتملت 3 عمليات تحميل» (3 uploads complete).
- **Verification:** the folder listing shows exactly 3 files and no duplicates.
- **Files:**
  - `Millionaire_AI_Final_With_Audio.mp4`: https://drive.google.com/file/d/1EyzD88h-1n3BtdQbdkZOjpKUM3tpR3kv/view
  - `Millionaire_AI_Final_Silent.mp4`: https://drive.google.com/file/d/1tk19kUddIyU0PtvgPJt8bnQttSq_yuXq/view
  - `Millionaire_AI_Thumbnail.png`: https://drive.google.com/file/d/1W_GPntYrymPVmPZqDx0WZnNOMN7pIGbU/view
- **Not uploaded:** the alternative thumbnails and these notes stay local only, as the brief asked.

## Remaining limitations
- **Final mix not listened to:** see «Listening» above.
- **Real media share:** about 33 % of the runtime (about 16 s) is led by real photos or footage; the rest is motion graphics (dashboards, charts, diagrams). Commons has no licensed footage of real marketing, CRM or trading product screens, so those are original illustrative UIs, labelled as such.
- **Industry montage pacing:** each of the seven field beats lasts only as long as its spoken word (about 0.44–0.94 s), so the montage is deliberately fast.
- **Frame rate:** 30 fps (house standard), not 60.
- **Packages and builds:** no packages were installed. There was no `npm run build`; only `tsc --noEmit`, plus the Remotion bundle and render this production needed.
- **Publishing:** nothing was published to social platforms.
