# ASSET_SOURCES — Tesla Roadster: The Impossible Machine

Status: **real footage not yet received.** This workspace can't reach YouTube, Tesla.com, NASA, Wikimedia, Flickr, Pexels or archive.org, so no third-party footage has been downloaded or used. Every row marked *pending* is filled in when you attach the file.

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

## Real-footage slots (pending)

Fill in one row per file you supply. "Rights basis" must be something you can actually show, such as your own recording, the public-domain status of a NASA item, a Pexels/Pixabay licence page, or written permission. "It's on YouTube" doesn't count.

| Slot | Timeline (s) | Needed shot | Suggested source & timecode | Source URL | Author | Source TC used | Rights basis | Attribution |
|---|---|---|---|---|---|---|---|---|
| A1a–e | 0.00–2.94, 5.84–7.32, 16.75–18.21 | Ramp: approach, climb, inverted hold | Tesla "Roadster Event" livestream, youtube.com/watch?v=qt5p-_tE8d0, 06:03–10:55 | pending | Tesla, Inc. | pending | **Not established** (your decision) | "Tesla — Roadster Event, 15 Oct 2026" credit on screen |
| A2a–f | 2.94–5.84, 18.21–19.95, 24.35–25.06, 41.56–44.58, 52.78–57.46, 71.32–73.98 | Kickflip over parked Teslas | Same stream, 10:56–12:43 | pending | Tesla, Inc. | pending | Not established | same |
| A3a–c | 44.58–49.42, 75.80–79.11 | Design / hero shots | Same stream, 12:47–14:38 | pending | Tesla, Inc. | pending | Not established | same |
| A4 | 66.44–71.32 | Aero shots | Same stream, 14:38–15:57 | pending | Tesla, Inc. | pending | Not established | same |
| A5a–c | 35.42–41.56, 49.42–52.78 | 0–60 run with thrusters | Same stream, 15:58–19:26 | pending | Tesla, Inc. | pending | Not established | same |
| A6 | 28.30–30.00 | Venue wide shot (SpaceX McGregor) | Same stream | pending | Tesla, Inc. | pending | Not established | same |
| B1 | 13.41–15.47 | Vacuum nozzle gripping a carpet | Your own phone recording | — | You | — | Own work | — |
| C1 | 25.06–26.92 | Spacecraft RCS thrusters firing | images.nasa.gov (NASA video) | pending | NASA | pending | NASA media guidelines: generally not copyrighted; no NASA endorsement implied; check each item for third-party marks | "NASA" credit on screen |
| C2 | 26.92–28.30 | Large rocket launch (comparison) | images.nasa.gov, e.g. Artemis I SLS launch | pending | NASA | pending | as above | "NASA" |
| D1 | 31.52–33.20 | Car cornering on a racetrack (not a Roadster) | Pexels or Pixabay | pending | pending | pending | Pexels/Pixabay licence (free use, no attribution required, can't be sold unmodified) | Labelled on screen "لقطة توضيحية — ليست رودستر" |

Avoid SpaceX's own Flickr and YouTube media for C1/C2: their licence terms are non-commercial or unclear.
