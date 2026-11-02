# Huawei Share: new-voice re-edit (V2)

**Final:** `07_OUTPUT/HUAWEI_SHARE_NEW_VOICE_FINAL.mp4`. It is 1080×1920, 30 fps, 1380 frames (46.00 s), H.264 High CRF 14 (bt709, tv range), with AAC-LC 256 kb/s 44.1 kHz stereo. sha256 `db8bff65084da4f4b54429937c433ee7d39df9fa4b9d33ce061e291c14ff88f2`.

The narration source is `../Huawei share New Vid.m4a.mp4`. It is untouched; sha256 `815e61c7…4628`, recorded before and after production in `06_QC/audio/`. A byte copy is in `01_AUDIO/Original/`.

V1 is preserved unchanged: `../07_OUTPUT/HUAWEI_SHARE_FINAL.mp4` (sha256 `e18284c1…`) and `../04_PRODUCTION/scripts/episode.py`.

## Narration → visual beats (seconds of the new recording)

| Time | Narration | Visual |
|---|---|---|
| 0.00–5.58 | كلنا شفنا فيديوهات هواوي، شخص يسحب صورة بإيده ويفتحها قدام التلفون الثاني وبتوصل | Real official footage from frame 0, in three demos: Pura 80 Ultra (fist closes, PDF lifts), Mate 70 (fist grabs the picture), Mate 70 (hand opens over the tablet, picture arrives). Pulse rings and «قبضة» / «كف مفتوح» / «وصلت!» tags. |
| 5.58–9.52 | لكن لحظة، هل فعلاً الصورة بتتخزّن بإيده؟ وشو بصير بين هالحركتين؟ | Rewind to the grab, then a desaturated freeze with a close-up on the fist, a dashed ring and a «؟». The shot then splits into «١ · تسكير» and «٢ · فتح» prints with a «؟» on the dashed link between them. |
| 9.52–12.66 | السر مش بالإيد، السر باللي الجهاز بيشوفه | The paper hand is crossed out. The phone slides in, its camera lights, and viewfinder brackets with a scan line frame the hand. |
| 12.66–14.38 | لمّا الشخص يسكّر إيده | Real Mate 80 footage of the fist closing, with brackets and a «قبضة» tag (badge «تمييز توضيحي»). |
| 14.38–21.12 | الجهاز بيتعرّف على الحركة… زي كأنه كبس زر الإرسال | The hand closes inside the viewfinder and is recognised («قبضة»). Chips «هاي الصورة» / «هذا الملف» appear, then [قبضة] = [إرسال]. The button presses on «كبس» / «زر», and the picture leaves on «الإرسال». |
| 21.12–26.72 | ولمّا يفتحها قدّام التلفون الثاني… زي كبسة استقبال | Real Pura 80 footage of the hand opening, with the receive ring. Then the diagram: the picture drops in, and [كف مفتوح] = [استقبال] sits under the dimmed send row. |
| 26.72–31.82 | وبعد موافقات النظام، الملف بينتقل لاسلكياً بين الجهازين زي فكرة AirDrop | A «موافقات النظام» stamp (no invented dialog). The file travels on a Wi-Fi arc, with the hero word «لاسلكياً». The label «فكرة شبيهة بـ AirDrop» comes with the note «AirDrop ميزة مشاركة من Apple · تشبيه للفكرة فقط». |
| 31.82–39.20 | يعني باختصار الصورة ما انتقلت بإيده، هي انتقلت لاسلكياً، استبدلوا كبسة الإرسال والاستقبال بحركة الإيد | The route through the hand is crossed out («مش عن طريق الإيد»), and the wireless phone-to-phone route replaces it. The «إرسال» / «استقبال» buttons are tapped, then flip into fist and open-hand cards, with «حركة الإيد = الأمر» and «الملف: لاسلكياً بين الجهازين». |
| 39.20–46.00 | بس وهون شطارة الماركتنج… ماسك الصورة بإيده | The demos return (Mate 70 grab and receive, Mate 80 release), now annotated «أمر: إرسال» / «أمر: استقبال» / «الملف: لاسلكياً». Below: «مشاركة ملفات = [إرسال] [استقبال]», the badge «تصميم تفاعل ذكي», and the hero «ماسك الصورة». |

## Folders

| Folder | Contents |
|---|---|
| `02_TIMING/` | `transcribe.py` (faster-whisper large-v3-turbo), `whisper_words.json`, `build_words.py` → `words_display.json` (caption spelling, emphasis, chunks) |
| `03_MEDIA/` | Frame-index review sheets, `ASSET_SOURCES.md`. The footage frames are V1's `../03_MEDIA/frames` (read-only). |
| `04_PRODUCTION/scripts/` | `episode_v2.py` (the editable composition), `brand.py` (byte-identical to V1/Video 4), `render.py`, `sheet.py`, `frames_sheet.py`, `clip_sheet.py` |
| `04_PRODUCTION/audio/` | `audio_design.py`. Separate layers: `narration_stem.wav`, `music_stem.wav`, `sfx_stem.wav`, plus `final_mix.wav` and `mix_report.json`. |
| `04_PRODUCTION/chunks/` | 12 muted picture chunks, `list.txt`, `picture.mp4` |
| `05_PREVIEW/`, `06_QC/` | Preview stills and sheets. `06_QC` holds the audio QC (`qc_audio.py`, `qc_audio_report.json`, sha256 before and after) and the 3 fps contact sheets of the final export. |

## Rebuild (Python + ffmpeg only, one heavy process at a time)

```bash
PY=D:/Content/02_NEURALINK/07_PROJECT/.venv/Scripts/python.exe
FF=D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe
cd 04_PRODUCTION/scripts
$PY -I -X utf8 render.py chunk 0 114 ../chunks/c01.mp4      # … 115-frame chunks up to 1379 (~3-6 min each)
cd ../audio && $PY -I audio_design.py
cd ../chunks && $FF -f concat -safe 0 -i list.txt -c copy picture.mp4
$FF -i picture.mp4 -i ../audio/final_mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k \
    -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0 \
    -movflags +faststart ../../07_OUTPUT/HUAWEI_SHARE_NEW_VOICE_FINAL.mp4
$PY -I ../../06_QC/audio/qc_audio.py
```

## Audio

- **Narration.** The decoded source samples go into the mix at unity gain, with no processing.
- **Music.** An original synthesised bed (pads, plucks and a soft shaker, D major, 96 BPM, no vocals or drums). It sits about 23 LU under the voice (−41.2 vs −18.3 LUFS integrated) and ducks up to −6 dB under speech.
- **SFX.** 18 quiet cues on key beats: the rewind, freeze, button presses, transfers, stamps and the flip. Their peaks are ≤ −26 dBTP, and they duck under speech.
- **Clipping.** An anti-clip gain applies to the added layers only, so voice + added never exceeds max(0.97, |voice|).
- **Source peak.** The source voice itself peaks at 1.0023 (+0.02 dBFS) on a handful of samples. That is inherent to the recording and was left as is.
