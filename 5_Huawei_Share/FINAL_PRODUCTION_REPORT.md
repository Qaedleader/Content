# Huawei Share (video 5): final production report

**Final video:** `D:\Content\5_Huawei_Share\07_OUTPUT\HUAWEI_SHARE_FINAL.mp4`, sha256 `e18284c183355e8d94ee61e6260004ce7094713a1cd6ba8fec8ac7eb98106590`, 34,816,197 bytes.

## Technical (verified with ffmpeg on the exported file)

| Property | Value |
|---|---|
| Video | H.264 High, 1080×1920, 30 fps, yuv420p, bt709 tv range, **1284 frames**, 42.80 s, CRF 14 (same settings as Video 4) |
| Audio | AAC-LC 44.1 kHz stereo, **stream-copied** from the supplied m4a (no re-encode) |
| Container | MP4, fast-start |

## Audio lock (evidence in `06_QC/audio/`)

| Check | Result |
|---|---|
| Source file sha256, before work and after export | `2fd6b3ec…b446` both times. The original and the read-only copy are identical. |
| Ordered AAC packet payload MD5s, source vs final (`framemd5 -c copy`) | **all identical** (1843 packets) |
| pts, dts and skip-samples side data | identical. The first packet keeps its 2112-sample priming skip. The only difference is the container *duration* field of the last packet (1024 → 1047), which is mux metadata and also occurred in Video 4. |
| Decoded PCM MD5 | `c5ce53a5…` = `c5ce53a5…`, 7,540,480 bytes each (bit-exact, so no speed, pitch or level change) |
| Length | The audio ends at 42.746 s and the picture at 42.800 s. The last frame holds; nothing is truncated. |

No music, SFX, denoise, EQ, compression, normalisation or fades were applied. The original stream was copied.

## Narration (Whisper large-v3-turbo, word timings in `02_TIMING/`)

> كلنا شفنا فيديوهات هواوي، ناس بيسحبوا صورة بإيدهم، وبفتحوا إيدهم قدام التلفون الثاني وبتوصل. بس ما حد شرح لنا كيف؟ الموضوع بسيط: الجهاز بيتعرّف على حركة الإيد. لمّا الشخص يسكّر إيده قدام الجهاز، الجهاز بفهم إنه بيرسل هذا الملف أو هاي الصورة، زي كأنه كبس كبسة الإرسال. ولمّا يفتح إيده قدام الجهاز الثاني، بفهم إنه بيستقبل عليه، زي كبسة الاستقبال. وبعد موافقات النظام، الملف بينتقل لاسلكياً بين الجهازين، زي فكرة AirDrop اللي بيستخدم البلوتوث لاكتشاف الأجهزة والواي فاي دايركت لنقل الملف. يعني الصورة ما تخزّنت بإيده، وإيده ما حملتها، هو بس أعطى أمر النقل بطريقة ثانية. وهون شطارة الماركتنج: مشاركة ملفات قدّموها بحركة بتحسّس الشخص إنه ماسك الصورة بإيده.

**Display corrections of Whisper mishearings (captions only):**

- «له سلكيا» → «لاسلكياً»
- «Air» (p = 0.02) → «AirDrop»
- «أك إنه» → «كأنه»

## Storyboard as built (narration seconds)

| Time | Beat | Visual |
|---|---|---|
| 0–8.1 | Opening demos | Real official footage from frame 0, in four cuts. Pura 80: hand closes over a phone and a PDF lifts. Mate 70: fist grabs the dinosaur picture. Mate 70: hand opens above a tablet and the picture lands on «وبتوصل». Mate 80: hand opens over a phone and a page arrives. Headline «صورة بتنتقل بحركة إيد» from 1.9 s, then «بس… كيف؟». |
| 8.1–10.0 | Hand recognition | Paper phone and paper hand. A camera dot lights up, yellow viewfinder brackets with a scan line appear, and «كف مفتوح» / «قبضة» chips show. Badge «رسم توضيحي». |
| 10.0–16.7 | Closing hand = send | Mate 80 footage of the fist closing, then the diagram: «هذا الملف» / «هاي الصورة» on the phone, «[قبضة] = [إرسال]». The button presses on «كبس» and «كبسة», and the picture flies off on «الإرسال». |
| 16.7–22.2 | Opening hand = receive | Pura 80 footage of the hand opening over the second phone, then the diagram: the picture drops onto the receiver, «[كف] = [استقبال]» under the dimmed send row, and the press lands on «كبسة». |
| 22.2–25.9 | Wireless transfer | Two phones and a «موافقات النظام ✓» stamp (no invented dialog). The picture travels along a Wi-Fi arc with no hand in shot. Hero word «لاسلكياً». |
| 25.9–31.0 | AirDrop comparison | «فكرة شبيهة بـ AirDrop», labelled «AirDrop: ميزة مشاركة من Apple». Step 1: Bluetooth radar discovers the device. Step 2: Wi-Fi Direct beam carries the file. Caveat line under the steps. |
| 31.0–36.4 | Not stored in the hand | A ghost picture inside the fist, an x-ray scan, a red ✗, «الإيد فاضية». Then a split: the hand sends only a dashed command («أمر فقط») while the picture travels phone → phone («الملف: بين الجهازين»). |
| 36.4–42.8 | Marketing conclusion | Echo of the opening Mate 70 grab and receive, then the Mate 80 release. Under the print: «مشاركة ملفات = [إرسال] [استقبال]». Stamp «تصميم تفاعل ذكي», hero «ماسك الصورة». Captions run to the last word. |

## Visual identity

This is the same Paper Workshop system as Video 4. `brand.py` is copied unchanged and the caption code is identical:

- navy and cream graph-paper stages with a kraft floor
- saffron yellow only for emphasis
- Alexandria index-card titles with a binder clip
- Baloo Bhaijaan 2 RTL word-strip captions, key words on yellow
- Lalezar hero words on torn strips
- taped prints with dark credit tags
- rubber-stamp badges
- the Video 4 rev 2 print geometry for footage (1000×750)

## Checks actually performed

- **Automated:** ffprobe stream and format checks; audio packet, side-data and PCM comparisons; source sha256 before and after; frame count; fast-start; `blackdetect` (none).
- **Freeze detection:** `freezedetect` (n = 0.002, d = 0.5 s). The first export flagged static holds at 16.2–16.7 s and 21.4–22.1 s. I added motion (the picture is sent off-screen, and the receive pulse keeps going), re-rendered chunks c04–c05, and the final file shows **no freezes**.
- **Visual review:** 3 fps contact sheets of the entire final export (`06_QC/final_sheets/`, 128 frames). I checked the opening action, every cut, caption timing and RTL shaping, crops (hand and screen both kept), the end frame, and spacing against the caption and Reel-UI zone.
- **Not performed:** I cannot listen to audio. Audio integrity and sync are shown by the bit-exact packet and PCM checks and by visuals keyed to the Whisper word timings, not by ear.

## Not done

No upload or posting, no purchases, no package installs, no Node, no app build.
