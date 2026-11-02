# Visual Refinement Report: Replacing Irrelevant People

**Date:** 18 Oct 2026
**Revised video:** `08_RENDERS/NEURALINK_FINAL_CINEMATIC_REVISED.mp4`
**Approved original:** `08_RENDERS/NEURALINK_FINAL_CINEMATIC.mp4`. It was not modified; its SHA-256 is still `c9920829…6cd13a89`.

## What changed, in short
- Nine shots used anonymous stock models as filler: a side face, a dark portrait used four times, a woman on a phone, a shocked woman, a thinking woman, and a man with his hands on his face. Each was replaced with imagery tied to the subject.
- Six memory-print slots in the shared print pool were also stock portraits. They were swapped in place for relevant imagery.
- No new external media was downloaded. Every replacement is a real photo or a 3D render that was already in the project, with a verified licence sidecar and an existing entry in `LICENSES.md`.
- The only source file edited is `07_PROJECT/scripts/nl/scenes.py`. The timeline, subtitles, audio, transitions, shot order and durations are unchanged.

## Modified shots

| Time (s) | Scene id | Narration | Original visual | Why it was irrelevant | Replacement | Type | Source / licence |
|---|---|---|---|---|---|---|---|
| 2.52–3.40 | `portrait` | «أول إشي، رح نركّب» | Pexels stock side profile of a man (Kindel Media) | Anonymous model, unrelated to the subject | A real DTI tractography scan of a human brain. The camera pushes in on the motor cortex (top of the corticospinal tract), with the reticle and the «القشرة الحركية · MOTOR CORTEX» label kept. Badge: «رنين مغناطيسي حقيقي». | Real scientific image + motion graphics | Thomas Schultz, Wikimedia Commons, **CC BY-SA 3.0** (credit on screen) |
| 7.94–9.42 | `think_face` | «لمّا تفكّر، مخّك بيطلّع إشارات كهربائية» | Pexels stock portrait of a woman (khezez) | Anonymous model. The shot was already about Hans Berger's EEG trace, yet showed a stranger's face. | An archival print of **Hans Berger** (1873–1941), the inventor of the human EEG. The original 1924 EEG trace still draws on below it. Badge: «صورة أرشيفية». | Archival photo + existing motion graphics | Univ. Jena photo, Wikimedia Commons, **Public domain** |
| 20.48–22.56 | `to_data` | «أو حتى بتفكّر فيه، بنحوّله لبيانات» | Same stock portrait dissolving into data cells | Anonymous model | The project's own 3D brain with the implant (last frame of shot D) dissolves into the same rising data-cell mosaic | Existing 3D render + existing motion graphics | BodyParts3D © DBCLS, **CC BY 4.0**. The implant is labelled illustrative. |
| 25.56–26.84 | `seven_years` (second half) | «بتسمع عن هاي التقنية» | Pexels stock woman on a phone (Anna Tarazevich) | Anonymous model | The existing phone-frame graphic (also used in `callback`) shows the real 2019 photo of **Elon Musk unveiling Neuralink**, with a NEURALINK wordmark. The 2026→2033 counter and the city opening are unchanged. | Real photo inside motion graphics | Steve Jurvetson, **CC BY 2.0** |
| 26.80–27.66 | `wait` | «وبتحكي: لحظة!» | Pexels stock shocked woman (Pavel Danilyuk) | Anonymous reaction face | The same phone freezes. The «لحظة!» punch-in, white flash and dim are unchanged. | Real photo inside motion graphics | Steve Jurvetson, **CC BY 2.0** |
| 27.60–29.76 | `who_told` | «أنا سامع عنها من قبل، بس مين حكالي؟» | Pexels stock woman thinking (Tima Miroshnichenko) | Anonymous model | The NIH image «Cracking the brain's memory codes» (electrical recordings of how the human brain stores and retrieves memories), shown as a print. The drifting memory prints and «مين حكالي؟» are kept. New caption: «صورة حقيقية: أبحاث NIH…». | Real research image | Zaghloul lab, NINDS / NIH, **Public domain** |
| 39.78–41.22 | `other_body` | «أو حتى بجسم تاني» | Pexels stock man with his hands on his face (Norma Mortenson) | Anonymous model | 3D shot A frames 6–19 (the anatomical skull turns translucent and a brain appears inside), with the original robot double-exposure and «جسم تاني» kept. It stops before the implant appears. | Existing 3D render | BodyParts3D © DBCLS, **CC BY 4.0**. Robot: Magda Ehlers / Pexels (unchanged). |
| 41.16–42.84 | `clone` | «يعني باختصار، بنعملّك استنساخ» | A growing grid of the stock portrait | Anonymous model | The same growing grid, now copies of the 3D brain with the implant | Existing 3D render | BodyParts3D, **CC BY 4.0** |
| 42.78–46.92 | `not_simple` | «لا، بمزح! … نسخ ذكرياتك إشي، ونقل وعيك إشي تاني» | The stock-portrait grid collapses, and the stock face appears in the «نقل الوعي» circle | Anonymous model | The brain grid collapses the same way, and the 3D brain (monochrome) fills the «نقل الوعي» circle | Existing 3D render | BodyParts3D, **CC BY 4.0** |

### Memory-print pool (`PRINT_POOL`)
The pool feeds the small floating prints in `hook_prints`, `who_told`, `search`, `robot`, `not_simple` and `cloud_storage`. Only slots 10, 15, 17, 21, 22 and 23 held stock portraits, and only `search` (29.70–32.92) and `robot` (35.70–39.82) draw those slots. Each was replaced in place, so no other print changes position or content.

| Slot | Was | Now (licence) |
|---|---|---|
| 10 | Pexels thinking woman | Cajal's Purkinje-cell drawing (PD) |
| 15 | Pexels side face | Golgi-stained hippocampal pyramidal neuron, MethoxyRoxy (CC BY-SA 2.5) |
| 17 | Pexels woman on phone | 2022 Neuralink "Show and Tell", Steve Jurvetson (CC BY 2.0) |
| 21 | Pexels dark portrait | Cortical neurons, Demarchi / Bertocchi / Oberto (CC BY-SA 4.0) |
| 22 | Pexels wheelchair user with laptop (implied a BCI user who was not one) | EEG recording cap, Chris Hope (CC BY 2.0) |
| 23 | Pexels shocked woman | DTI tractography, Thomas Schultz (CC BY-SA 3.0) |

### Badges and credits
- Two shots gained a label under the existing labelling policy: `portrait` → «رنين مغناطيسي حقيقي», `think_face` → «صورة أرشيفية».
- The on-screen credit lines for the nine changed shots now name the new sources.

## People who stay, and why
| Time (s) | Shot | Person | Reason kept |
|---|---|---|---|
| 0.00–1.30, 66.52–71.20 | `hook_eye`, `outro`, and the `callback` phone | Extreme eye macro (Pexels) | No identifiable person. The eye is the film's memory/vision motif and the visual callback ("this very video"). |
| 17.45–20.52 | `imagine_see`, `imagine_hear` | Eye and ear macros (Pexels) | Sensory organs that illustrate «بتشوفه / بتسمعه». No portrait. |
| 11.36–14.46 | `decode` | EEG-cap participant steering a cursor | Real BCI experiment (Laurens R. Krol, CC BY 4.0) |
| 48.64–50.74 | `neuralink_stage` | Elon Musk presenting the Neuralink master plan, 2019 | Directly relevant: Neuralink's co-founder, while the narration names «شركة نيورالينك تبعت إيلون ماسك» |
| 52.06–54.32 | `noland` | Noland Arbaugh | The first Neuralink participant, shown while the narration describes people controlling a computer by thought |
| 54.26–59.84 | `ecog_arm`, `ecog_highfive` | Pittsburgh ECoG BCI participant | Real BCI demonstration, already labelled «ليست نيورالينك» |
| 59.78–63.00 | `future_memories` | Elderly hands holding an old photograph (no face) | Hands and a photograph as a memory metaphor for «حفظ ذكرياتك», not a portrait |
| prints in `hook_prints` etc. | pool slots 0, 6 | Old family photographs (Pexels) | Generic "memories" as objects, and small. Left unchanged under the minimal-diff rule. |
| 35.70–41.22 | `robot` | Humanoid robot | Not a person |

## Verification of the revised MP4 (commands actually run)
| Check | Result |
|---|---|
| Container / streams | H.264 High, **1080×1920, 30 fps**; AAC LC 44.1 kHz stereo |
| Duration | **71.20 s**, identical to the original (71.20 s) |
| Frame count | **2136**, identical to `FRAMES` in `timeline.py` |
| Full decode (`ffmpeg -xerror -f null`) | No errors |
| Black frames (`blackdetect d=0.03 pix_th=0.06`) | None in the revised file (none in the original either) |
| Audio stream packets, MD5 (`-c copy -f md5`) | `93aa0ce1…` in **both** files: identical, because the audio was stream-copied from the approved MP4 and not re-encoded |
| Decoded audio PCM, MD5 | `01dff39b…` in **both** files: identical |
| VO master `01_AUDIO/Original/NeuralLink chip vid 2.m4a.mp4` | SHA-256 `ebe79ad1…71c44fce`, unchanged (also the copy in `01_AUDIO/`) |
| `07_PROJECT/audio/final_mix.wav` | SHA-256 `9d0f1a5d…6f5b0`, unchanged |
| Frame-by-frame picture diff vs the original (gray, 270×480, mean abs diff / 255) | See below |

Picture diff results:
- **Frames 1420–2135 (47.33 s → end):** max diff **0.0000**. Bit-identical, because the original chunks c06–c08 were reused by stream copy.
- **Frames 0–1419 outside the edited shots:** max diff **0.63** (mean 0.15). This is H.264 re-encode noise, because those chunks were re-rendered with different chunk boundaries. There is no visible change.
- **Every run of frames with diff > 2.0** lies inside an edited shot: 2.57–3.37, 7.97–9.40, 20.50–22.50, 25.60–29.73, 30.70–32.90 (`search` prints), 38.57–39.70 (`robot` prints), 39.80–44.30, 45.60–46.87.
- **Visual QC:** I extracted frames from the revised MP4 at every edited shot and at each transition in and out (2.55, 3.35, 7.98, 9.38, 20.52, 22.54, 25.4–27.62, 29.72, 39.8, 41.18, 42.8, 46.9). The transitions play as before, subtitles are unchanged and readable, and there are no placeholders or broken images.

## How it was produced
1. Backups are in `07_PROJECT/backup_pre_refinement_20261018/`: `scenes.py`, `timeline.py`, and `SHA256_BEFORE.txt`.
2. Edited `scenes.py` only:
   - `PRINT_POOL` slots
   - the new helpers `cover_point` and `brain_3d`
   - the scene functions `portrait`, `think_face`, `to_data`, `seven_years` (phone branch), `wait` (plus `PHONE_Y`, `_news` and `news_screen`), `who_told`, `other_body`, `clone`, `not_simple`
   - the `BADGE` and `CREDIT` entries for those scenes
3. Rendered frames 0–1419 with the existing `scripts/render.py video` command (same encoder settings), in ten sequential foreground chunks (`08_RENDERS/chunks_revised/r00–r09.mp4`). Only one render process ran at a time, and no Blender re-render was needed.
4. Concatenated `r00–r09` with the original `chunks/c06–c08` by stream copy → `08_RENDERS/NEURALINK_picture_only_REVISED.mp4`.
5. Muxed that picture with the **audio stream copied from the approved MP4** (`-map 1:a -c copy`) → `NEURALINK_FINAL_CINEMATIC_REVISED.mp4`.

## Licensing notes
- No new asset was downloaded. All replacement media were fetched during the original production, with `*.source.json` provenance sidecars, and are listed in `LICENSES.md`.
- `LICENSES.md` was **not regenerated**. Its "Used in the final video" table describes the approved original. For the revised version:
  - These assets are now **also used**: `dti_sagittal` (CC BY-SA 3.0, Thomas Schultz), `nl_unveiling` and `nl_monkey_matrix` (CC BY 2.0, Steve Jurvetson), `nih_memory_codes` (PD, NIH/NINDS), `cajal_purkinje` (PD), `pyramidal_40x` (CC BY-SA 2.5, MethoxyRoxy), `cortical_neurons` (CC BY-SA 4.0), `bci_eeg_cap` (CC BY 2.0, Chris Hope).
  - These Pexels clips are **no longer used**: `pv_face_side`, `pv_dark_portrait`, `pv_phone_woman`, `pv_shocked_woman`, `pv_thinking_woman`, `pv_eyes_closed_man`, plus the photo `px_wheelchair_laptop`.
- CC BY-SA images are shown unmodified, apart from grading and cropping inside the composition, and are credited on screen.

## Unresolved items and notes
- Re-running `scripts/make_license_manifest.py` would refresh `LICENSES.md` for the revised cut. I did not run it, so the approved documentation stays as it was. Run it if the revised cut replaces the approved one.
- `other_body` uses an anatomical 3D skull with a brain appearing inside it. It matches the film's existing 3D anatomy style, but it is a creative judgement. Alternatives: a lighter look, or extending the robot shot.
- The `08_RENDERS/chunks_revised/` folder (about 223 MB) is kept so the revised picture can be re-muxed without re-rendering.
