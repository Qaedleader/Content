# RAM_GOLD — Video 11 — production & QA report (2026-11-01)

## Deliverables (`D:\Content\11_RAM_GOLD\07_OUTPUT\`)
| File | Content | Size | sha256 |
|---|---|---|---|
| `RAM_GOLD_FINAL_CINEMATIC.mp4` | Version A: original voice + very quiet original music bed + 23 soft SFX | 70 354 493 B | `32300282…1ad88b` |
| `RAM_GOLD_FINAL_VOICE_ONLY.mp4` | Version B: original voice only (original AAC stream, stream-copied) | 69 363 147 B | `3938abff…3f4c19` |
| `RAM_GOLD_THUMBNAIL.png` | Cover 1080×1920: «الرام صار ذهب؟», half-gold real DDR5 module, «DRAM +80%», «حرب الذاكرة العالمية», source line | 1080×1920 | `9b84d191…5e3d71` |
| `RAM_GOLD_THUMBNAIL_CLEAN.png` | Same composition, no text (fully gold module) | 1080×1920 | `4ce8d0ca…862ad0` |

Both MP4s: 1080×1920, 30 fps (house standard), 1549 frames = 51.633 s, H.264 High yuv420p bt709 tv-range CRF 16, faststart.
Full hashes: `06_QC/sha256_outputs.txt`.

## Voice preservation (`06_QC/audio/`)
- Source `RAM GOLD.m4a.mp4` sha256 `779799ac…964828` — **unchanged** before/after (`sha256_before.txt` / `sha256_after.txt`); read-only byte copy in `01_AUDIO/Original/`.
- **B (VOICE_ONLY):** AAC muxed with `-c copy`: 2223/2223 packets identical, 0 duration differences, decoded PCM md5 `58d35f3a7c05563a07af68d20a07a175` = source (2 274 240 samples = 51.570 s). One audio stream, nothing added.
- **A (CINEMATIC):** narration decoded once to float and added at **unity gain** — the narration stem is bit-identical to the source decode. No trim/fade/EQ/compression/normalisation/time change. Only the added layers are ducked and anti-clip limited. Music bed 32.0 LU under the voice, SFX 41.2 LU under (cues: low hits, dull whooshes, ticks, pulses, shimmers; no risers/alarms). Null test on the exported file: voice gain estimate 0.997, added layers −30.2 dB rel. voice, AAC 256k coding residual −35 dB (unavoidable once anything is mixed — B is the bit-exact version).
- **Sync:** cross-correlation lag between source and A = **0 samples** at 1 s, 25 s and 48 s (`sync_lag.json`). A codec note: A is the only re-encode (AAC 256 k from the float mix); B keeps the original stream.
- The source voice decodes to a float sample peak of 1.059 (> 0 dBFS, a property of the original file); left untouched as required.
- Video bitstreams of A and B are identical (framemd5 of all 1549 frames).

## Fact check (what the screen claims)
| Narration | Verification | On-screen treatment |
|---|---|---|
| «سام ألتمان … كأنه بيحكي لا تبيعوا هذه القطعة للناس العاديين، خلوها لنا لحالنا» | **Not a quote.** No outlet reports Altman saying companies should stop selling RAM to consumers (XDA calls its own reading "inference and speculation"). | Typeset as the narrator's words with badge «تفسير الراوي لكلامه · مش اقتباس حرفي» and note «صياغة الراوي · لم يقلها ألتمان بهذا النص». No interview footage, no fake lip-sync. |
| «اعتبر من السيء جداً توزيع مورد عالمي نادر على أجهزة ما بتستخدمه إلا جزء بسيط من الوقت» | Real remark, Cheeky Pint (Stripe) interview, reported by XDA (30 Oct 2026) and Engadget (31 Oct 2026): *"From a global allocation perspective, actually, it's quite terrible to have everybody have a bunch of the world's limited supply of DRAM sitting in their own computer, and being used maybe 5% of the time."* | Verbatim English quote card + source line; «≈ 5%» labelled «تقدير ألتمان نفسه ("maybe 5%") · مش قياس». |
| «الشركة اللي صنعت ChatGPT» | OpenAI / ChatGPT. | OpenAI + ChatGPT logos. |
| RAM → DRAM → HBM | DRAM is a type of RAM; HBM is stacked DRAM placed next to the processor. | Nested sets (HBM ⊂ DRAM ⊂ RAM), stacking animation, real AMD Fiji package with 4 HBM stacks labelled «مثال حقيقي: AMD Fiji (2015)», GH200 (HBM3) and B200 (HBM3E) for "powerful AI processors". |
| «كميات هائلة» | OpenAI (1 Oct 2025): Samsung & SK partnerships "targeting 900,000 DRAM wafer starts per month" — letters of intent. | «900,000 رقاقة DRAM شهرياً · هدف معلن … خطابات نوايا (هدف، مش إنتاج فعلي)». |
| «أسعار الذاكرة ارتفعت بشكل كبير» | TrendForce, **DRAM contract prices, QoQ**: 1Q26 forecast +55–60% (5 Jan 2026 release); ≈ +80% 2Q26, ≈ +40% 3Q26, ≈ +20% 4Q26 forecast (20 Oct 2026 note). | Bar chart, forecast bars hatched «توقّع», «أسعار عقود الشركات، مش أسعار المتاجر». No retail/spot figures shown (none verified). |
| «المصانع مش قادر يتوسع … بنفس سرعة الطلب» / «بتحتاج لسنوات» | General industry fact; no figure used. | Concept chart labelled «رسم توضيحي للفكرة · بدون أرقام»; «بناء وتجهيز مصنع رقائق بياخد عادةً سنين». |
| «الرام مثل الذهب» | Metaphor. | «تشبيه بصري · مش توقّع ولا نصيحة استثمارية». |

Sources: [OpenAI – Samsung and SK join Stargate](https://openai.com/index/samsung-and-sk-join-stargate) · [TrendForce 20 Oct 2026](https://www.trendforce.com/news/2026/10/20/news-dram-prices-seen-rising-20-qoq-in-4q26-despite-slower-gains-ai-demand-tight-supply-support-outlook/) · [TrendForce 5 Jan 2026](https://www.trendforce.com/presscenter/news/20260105-12860.html) · [XDA](https://www.xda-developers.com/sam-altman-says-its-quite-terrible-that-people-have-ram-in-their-pcs-during-a-shortage/) · [Engadget](https://www.engadget.com/2303266/sam-altman-says-its-terrible-dram-computer/)

**Shelf life:** the quote and price figures are from late October 2026; re-check TrendForce if publishing much later.

## Transcript corrections (subtitles only; timings are Whisper's, unchanged)
Targeted re-listening passes (`02_TIMING/recheck.py`) fixed ASR errors: «HGBT» → **ChatGPT** («الشركة اللي صنعت ChatGPT»), «هذه الرام» → **DRAM** (one spoken term; the merged word spans both original timings), «لا حال» → «لها حل». Dialect spellings kept as spoken.

## Narration → visuals
| s | Narration | Visual |
|---|---|---|
| 0.0–0.7 | تعرف إنه في | Real SK hynix DRAM chip macro + light sweep, tag «حرب الذاكرة» |
| 0.7–1.4 | حرب عالمية | Frontier supercomputer, hero «حرب عالمية» |
| 1.4–2.8 | بين شركات الذكاء الاصطناعي | Real data-centre footage, OpenAI / NVIDIA logo cards |
| 2.8–4.2 | لإشي موجود عندك إنت؟ | Personal RGB gaming PC, brackets lock on its RAM sticks, «داخل جهازك» «؟» |
| 4.2–7.1 | سام ألتمان، رئيس الشركة اللي صنعت ChatGPT | Altman (CC BY 2.0) + name plate, OpenAI, ChatGPT |
| 7.1–11.2 | من كلامه كأنه بيحكي: لا تبيعوا… خلوها لنا لحالنا | Grey-graded portrait, word-synced kinetic typography, interpretation badge |
| 11.2–13.2 | هذه القطعة هي الرام | Pixel-masked module dissolves → real DDR5 RDIMM, hero «الرام» |
| 13.2–16.9 | الذاكرة اللي جهازك بيستخدمها… بسرعة | Real RAM being installed; diagram SSD → RAM ⇄ CPU with pixel data packets |
| 16.9–19.9 | ومن أهم أنواع DRAM، وفي منها نوع مطور اسمه HBM | Nested sets RAM ⊃ DRAM ⊃ HBM, DRAM layers stack into HBM |
| 19.9–22.6 | بتستخدمه معالجات الذكاء الاصطناعي القوية | Fiji package anatomy (GPU + 4 HBM), GH200 footage, B200, hero «القوية» |
| 22.6–26.1 | مع انفجار الذكاء الاصطناعي… كميات هائلة منها | Aisle push + «انفجار», AI racks with multiplying chip field, OpenAI 900,000-wafer target card |
| 26.1–30.0 | والمشكلة إنه المصانع… بنفس سرعة الطلب | Micron fab Taiwan, cleanroom footage, demand-vs-supply concept chart |
| 30.0–33.3 | لدرجة إنه سام ألتمان اعتبر من السيء جداً | Altman portrait → verbatim quote card with source |
| 33.3–37.5 | توزيع مورد عالمي نادر… جزء بسيط من الوقت | Global DRAM pool (pixel grid) splits into PCs; each usage meter ≈ 5 % lit |
| 37.5–40.5 | والنتيجة أسعار الذاكرة ارتفعت بشكل كبير | TrendForce contract-price bars per quarter |
| 40.5–43.9 | وصارت من أهم الموارد… شركات التكنولوجيا | DRAM makers (Samsung, SK hynix, Micron) above, buyers (OpenAI, NVIDIA) pulling below, module gilding |
| 43.9–47.4 | وحتى لو قرروا يبنوا مصانع جديدة… لسنوات | Real fab construction (Dresden 2026), 4-stage build bar, hero «سنوات» |
| 47.4–51.6 | فهل رح نوصل… الرام مثل الذهب، ولا رح يلاقوا لها حل؟ | Dark stage, real module turns to gold (wipe + speculars + gold motes), «الرام = ذهب؟», final question card |

Real media share: about 60 % of the runtime is real photo/footage-led; the rest is diagrams, charts and the gold finale, which itself is built from a real photo. That is a little under the 65–70 % target; the explanation beats (RAM/DRAM/HBM, quote, allocation, prices) read better as graphics.

## Visual QC
- blackdetect (d ≥ 0.1 s): **0** black segments; freezedetect (≥ 1.2 s): **0** frozen segments.
- Contact sheet of every 30th frame of the export: `06_QC/final_sheet.jpg`. A low-res preview pass found and fixed: overlapping kinetic lines in the interpretation scene, brackets that missed the RAM in the PC photo, and a finale module that was too small (now a large diagonal hero).
- Arabic shaping/RTL checked on the sheets for captions, labels and hero words; RAM / DRAM / HBM / OpenAI / ChatGPT spelled correctly.
- Information stays above y ≈ 1560 and away from the right button column except corner credits.

## Rebuild
Composition `RamGold` (+ `RamGoldCover`, prop `clean`) in `D:/Content/_BRAND_SYSTEM/src/episodes/ramgold/` (snapshot in `05_PROJECT/remotion_episode_ramgold/`). Media prep: `03_MEDIA/scripts/prep_media.py` (venv python).
```bash
cd D:/Content/_BRAND_SYSTEM
npx tsc --noEmit
npx remotion bundle src/index.ts --out-dir=out/bundle_rg
npx remotion render out/bundle_rg RamGold out/rg_chunks/c01.mp4 --frames=0-299 --muted --concurrency=1 --crf=14   # c02 300-599 … c06 1500-1548 (~75 s each)
FF=D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe
$FF -f concat -safe 0 -i out/rg_chunks/list.txt -c copy out/rg_chunks/picture.mp4
$FF -i out/rg_chunks/picture.mp4 -vf "scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p" -c:v libx264 -preset slow -crf 16 -profile:v high -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -an out/rg_chunks/picture_tv.mp4
python -I D:/Content/11_RAM_GOLD/04_PRODUCTION/audio/audio_design.py      # venv python (numpy/scipy/soundfile)
$FF -i out/rg_chunks/picture_tv.mp4 -i "D:/Content/11_RAM_GOLD/01_AUDIO/Original/RAM GOLD.m4a.mp4" -map 0:v -map 1:a -c copy -movflags +faststart 07_OUTPUT/RAM_GOLD_FINAL_VOICE_ONLY.mp4
$FF -i out/rg_chunks/picture_tv.mp4 -i 04_PRODUCTION/audio/final_mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -movflags +faststart 07_OUTPUT/RAM_GOLD_FINAL_CINEMATIC.mp4
npx remotion still out/bundle_rg RamGoldCover 07_OUTPUT/RAM_GOLD_THUMBNAIL.png ; … --props='{"clean":true}' RAM_GOLD_THUMBNAIL_CLEAN.png
python -I 06_QC/audio/qc_audio.py
```

## Not done / limits
- No `npm run build`. Only `tsc --noEmit` plus the Remotion bundle and render needed to produce the video.
- No packages installed. Nothing published to social platforms.
- **Google Drive (requested by the user):** uploaded to My Drive › Content › **RAM_GOLD** (folder `1xAZTfKspyPaDLrROfYRtbgA7cwwKzxFy`) via the Chrome split-upload workaround, because the Drive connector returns "Insufficient scope". The file reassembled in the browser matched each local sha256 before upload. Drive reported «اكتملت 4 عمليات تحميل» (4 uploads complete), with no duplicates: `RAM_GOLD_FINAL_CINEMATIC.mp4` (`18JUf_G4XAUiVrxrKkvv43SUX2KwnBhbR`), `RAM_GOLD_FINAL_VOICE_ONLY.mp4` (`1kNhOlfH0Ac_FS_nW5uRsI1DIUet0hCMv`), `RAM_GOLD_THUMBNAIL.png` (`1czyXE4aPCcKX7m9RsohzosYCHrEZaEnx`), `RAM_GOLD_THUMBNAIL_CLEAN.png` (`1K9fxT-Gu-lh7VtTGoVtiPW2ee43oaKbO`). The files inherit the Content folder's sharing; no sharing settings were changed.
- `11_RAM_GOLD/_upload_parts/` (16 temporary split parts, ~139 MB) could not be deleted: Claude Code's safety check blocked the `rm`. It is safe to delete by hand.
- No original Altman interview footage was used, because YouTube gives no reuse right.
- No official manufacturer press video or images were used. Every real asset is openly licensed from Commons.
- Real media is about 60 % of runtime, slightly below the 65–70 % target.
