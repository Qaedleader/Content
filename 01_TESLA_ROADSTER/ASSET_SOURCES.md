# ASSET_SOURCES — Tesla Roadster: The Impossible Machine

Status (18 Oct 2026): **every footage slot is filled.** The full per-file licence manifest is `TESLA_ROADSTER_EDITABLE_PROJECT/footage_in/LICENSES.md`, and the shot-by-shot framing is `TESLA_ROADSTER_EDITABLE_PROJECT/footage_plan.json`.

## Assets in the edit now

| Asset | Origin | Licence / rights | Attribution required |
|---|---|---|---|
| Narration `voiceover_ORIGINAL.m4a` (79.11 s, SHA-256 `02b34052…7768`) | Supplied by you | Yours | — |
| IBM Plex Sans Arabic (Thin/Light/Regular/Medium/SemiBold/Bold) | github.com/IBM/plex, `packages/plex-sans-arabic/fonts/complete/ttf` | SIL Open Font License 1.1 (licence copied to `fonts/LICENSE.txt`) | Not required on screen |
| 3D engineering visualisations (car volume, fans, airflow, tanks, nozzles, plumes) | Original, procedurally generated in Python/skia (`scripts/gfx.py`, `scripts/scenes.py`) | Original work, yours to use | None. The model is a **generic Roadster-inspired volume, not Tesla geometry**, and is labelled "محاكاة توضيحية" |
| Motion graphics, typography, infographics | Original (`scripts/overlays.py`, `scripts/scenes.py`) | Original | — |
| Music (4 phases) | Original, synthesised from scratch in `scripts/audio_design.py`, with no samples or loops | Original | — |
| Sound effects (whooshes, fan whirr, gas hiss, impacts, UI ticks, fallback suction) | Original synthesis, same script | Original | — |
| Whisper-small ONNX (used only to time and transcribe your voice; not in the video) | Pre-supplied in `dl/whisper` (Xenova/whisper-small, Apache-2.0) | Apache-2.0 | — |

## Real-footage slots (filled)

| Slot | Timeline (s) | Visual used | Source | Rights basis | On-screen credit / label |
|---|---|---|---|---|---|
| A1a | 0.00–1.52 | Roadster hovering on thrusters (event) | Tesla press kit Roadster_53 | Tesla media terms (editorial, credit required) | Courtesy of Tesla, Inc. · صورة حقيقية من العرض |
| A1b | 1.52–2.22 | Driving up the curved ramp (event) | Roadster_57 | same | same |
| A1c | 2.22–2.94 | Inverted at the top of the ramp (event) | Roadster_55 (tight) | same | same |
| A2a / A2a_freeze | 2.94–5.84 | Upside-down above the parked Teslas, then a freeze | Roadster_58 | same | same |
| A1d | 5.84–7.32 | Inverted leaving the ramp edge | Roadster_56 | same | same |
| B1 | 13.41–15.47 | Vacuum nozzle on a carpet | Pexels 9472818 (Liliana Drew) | Pexels License | Pexels · Liliana Drew · تشبيه توضيحي |
| A1e | 16.75–18.21 | Full ramp with the car at the top | Roadster_55 (wide) | Tesla media terms | Courtesy of Tesla, Inc. |
| A2b | 18.21–19.95 | Hovering on 4 thruster plumes | Roadster_54 | same | same |
| A2c | 24.35–25.06 | Rotating mid-air with gas trails | Roadster_59 | same | same |
| C1 | 25.06–26.92 | Dragon Draco thrusters firing, ISS | NASA iss073e0814070 | Public domain (NASA guidelines) | NASA · مركبة فضائية — صورة ناسا |
| C2 | 26.92–28.30 | Artemis I SLS liftoff | NASA Artemis I CU tracking (NASA/Sam Lott) | Public domain | NASA · للمقارنة — ليست تسلا |
| A6 | 28.30–30.00 | Venue: ramp tower + hovering car | Roadster_54 (wide pan) | Tesla media terms | Courtesy of Tesla, Inc. |
| D1 | 31.52–33.20 | GT car cornering (not a Roadster) | Pexels 13866430 (Jaxon Matthew Willis) | Pexels License | لقطة توضيحية — ليست رودستر |
| A5a | 35.42–37.08 | Rear thrusters firing | Roadster_94 (press image) | Tesla media terms | صورة رسمية من تسلا |
| A5b | 37.08–41.56 | Car at speed, night | Roadster_95 (press image) | same | same |
| A2d | 41.56–44.58 | Mid-air rotation inside the attitude dial | Roadster_59 (tight) | same | صورة حقيقية من العرض |
| A3a | 44.58–46.52 | Front, doors open | Roadster_78 | same | صورة رسمية من تسلا |
| A3b | 46.52–49.42 | Front 3/4 (Performance card) | Roadster_87 | same | same |
| A5c | 49.42–52.78 | Rear nozzles (Thrust card) | Roadster_73 | same | same |
| A2e | 52.78–57.46 | Hovering on thrusters (Rocket card) | Roadster_53 | same | صورة حقيقية من العرض |
| A4 | 66.44–71.32 | Rear wing, then suspension detail | Roadster_72, Roadster_60 | same | صورة رسمية من تسلا |
| A2f | 71.32–73.98 | Jump over the vehicles, wide pan (callback) | Roadster_58 | same | صورة حقيقية من العرض |
| A3c | 75.80–79.11 | Rear, doors open, night sky | Roadster_97 | same | صورة رسمية من تسلا |

**No Tesla video footage is used.** Tesla's event videos are on YouTube and X under their standard terms, with no download licence and no official download, so the reel uses Tesla's officially downloadable 4K press photographs instead. To use the moving footage, get written permission from Tesla (press/media contact). Replacing a still slot with a licensed video only means changing that slot's entry in `footage_plan.json`.
