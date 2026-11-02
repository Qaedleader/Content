# Verified narration transcript — «المصاري رح يبطل إلها قيمة»

**Source:** `01_AUDIO/Original/narration_original.m4a` (AAC 44.1 kHz stereo, 58.58 s, sha256 `88004a14a519896fa67bbf60d8f06eda1c7b4349310dd4902fd20a8426d67051`). The only audio file in the folder; no ambiguity between recordings.

**Method:** faster-whisper large-v3-turbo (local, CPU int8) with word timestamps (`whisper_words.json`) → independent re-transcription of 4 uncertain regions with no context/prompt (`region_checks.json`) → silencedetect at −38 dB to refine boundaries → `build_words.py` writes `words.json` (140 words). Times are seconds from the first decoded sample (the same zero used by the video and the mix).

The narrator's Levantine wording is preserved. Corrections only fix Whisper mis-hearings or spelling, never content.

## Full text with timings

| # | start | end | sentence |
|---|---|---|---|
| 1 | 0.00 | 2.64 | اصرف مصاريك، لأنه المصاري رح يبطل إلها قيمة. |
| 2 | 2.78 | 4.28 | احضر الفيديو لتعرف ليش. |
| 3 | 4.44 | 8.96 | تخيّل عالم الذكاء الاصطناعي والروبوتات بيعملوا فيه 99.9% من كل إشي. |
| 4 | 9.24 | 10.10 | بدك سيارة؟ |
| 5 | 10.10 | 11.46 | الذكاء الاصطناعي بيصممها. |
| 6 | 11.74 | 13.28 | الروبوتات بتستخرج الحديد من الأرض. |
| 7 | 13.56 | 14.06 | تصهره. |
| 8 | 14.30 | 15.12 | بتصنع القطع. |
| 9 | 15.22 | 16.26 | بتجمّع السيارة. |
| 10 | 16.48 | 18.98 | وشاحنات ذاتية القيادة بتوصّلها لباب بيتك. |
| 11 | 19.38 | 20.87 | طب مين بصنع الروبوتات نفسها؟ |
| 12 | 21.07 | 21.80 | روبوتات ثانية. |
| 13 | 21.96 | 22.82 | ومين بطوّرها؟ |
| 14 | 22.82 | 23.68 | الذكاء الاصطناعي. |
| 15 | 24.04 | 27.52 | وحتى الطاقة الروبوتات بتبني محطاتها وبتعملها صيانة. |
| 16 | 27.58 | 32.86 | يعني من أول مادة خام بالأرض لآخر منتج ببيتك بدون بشر تقريباً. |
| 17 | 33.04 | 35.90 | ونفس الإشي بالأكل والبيوت والملابس والدوا. |
| 18 | 36.08 | 37.42 | الإنتاج بصير هائل. |
| 19 | 37.52 | 38.54 | والتكلفة بتنهار. |
| 20 | 38.62 | 39.96 | والمصاري رح يبطل إلها قيمة. |
| 21 | 40.14 | 44.76 | فالحق حالك إذا عندك كاش بالبنك لازم تفكّر شو الإشي اللي رح يضل إله قيمة. |
| 22 | 44.86 | 48.18 | أنا برأيي الكتلة والطاقة والقدرة هم اللي رح يضل إلهم قيمة. |
| 23 | 48.34 | 50.58 | يعني مثلاً معادن بتصنع منها أشياء. |
| 24 | 50.96 | 53.06 | وطاقة بتشغّل فيها ملايين الروبوتات. |
| 25 | 53.45 | 58.28 | لأنه بهالعالم الأهم مش قديش معك مصاري، الأهم مين بملك القدرة على الإنتاج. |

## Corrections and remaining uncertainty

| word # | Whisper heard | used | basis |
|---|---|---|---|
| 10 | «اللي تعرف» | «لتعرف» | 0.10 s proclitic; region re-check heard «لا»/«ل». **Uncertain:** may be «لـ» or «اللي»; meaning identical. |
| 19 | «99» «.9» «%» | «99.9%» | merged into one caption unit |
| 30 | «لحديد» | «الحديد» | spelling of the same spoken word |
| 46 | «بيصنع» | «بصنع» | creator's own wording in the brief; both are the same spoken bi- prefix |
| 49 | «الروبوتات ثانية» | «روبوتات ثانية» | creator's wording; **uncertain** whether the article is audible (onset after 0.2 s pause at 21.07 s) |
| 52 | «بيطورها» | «بطوّرها» | creator's wording |
| 57 | «الروبوت» | «الروبوتات» | region re-check (0.89) |
| 85 | «والمصار» | «والمصاري» | both passes truncated the final ي; meaning certain |
| 126 | «الروبوت» | «الروبوتات» | region re-check (0.97) |
| 127 | starts 52.88 | starts 53.45 | silencedetect: pause 53.06–53.45 |
| 48/49 | 20.48–21.02 | 20.48–20.87 / 21.07 | silencedetect: pause 20.87–21.07 |

Pauses longer than 0.25 s (silencedetect): 2.58–3.06, 4.31–4.62, 8.96–9.36, 10.04–10.28, 11.46–11.76, 13.29–13.62, 14.04–14.37, 18.98–19.48, 23.68–24.08, 27.47–27.97, 35.89–36.14, 40.89–41.20, 50.54–50.94, 53.06–53.45. None was removed.
