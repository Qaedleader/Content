# Asset sources: Microduck (video 4)

All media are **official Pollen Robotics / Hugging Face material**, downloaded on 2026-10-24 into `raw/`. Originals are unmodified. Used segments are extracted by `../04_PRODUCTION/scripts/prep_media.py` into `frames/`.

## Stated usage conditions (verified on the pages)

| Source | What it says |
|---|---|
| https://pollen-robotics.com/microduck/press-kit/ | Press kit: "the launch photos, the die-cut stickers as transparent PNGs, the wordmark and the fact sheet". "The wordmark carries its own outline … please leave its colours and proportions alone. The stickers are free to use in any story about Microduck." |
| Site footer | "© 2026 Pollen Robotics · Open source under Apache 2.0" |
| https://github.com/pollen-robotics/microduck_rl | Software: Apache 2.0. Hardware design files: CC BY-SA-NC. |

The photos, film and gallery clips are used **editorially, with credit, to report on the product**. The wordmark is used unaltered, at its own colours and proportions. No asset was bought, and no watermarked repost was used.

## Assets used in the video

| Use in video | File (raw/) | Original URL | Segment and crop | Nature |
|---|---|---|---|---|
| Hook: sim twin, then real robot (matched timecode); transfer scene; training grid; lab inset | `blog_introducing-microduck_sim2real.mp4` (1600×900) | https://pollen-robotics.com/assets/blog/introducing-microduck/sim2real.mp4 (blog "Introducing Microduck") | 4.9–10.6 s and 10.7–15.3 s. Left half (simulation) and right half (real robot) cropped separately, 800×790. The burned-in subtitle rows (y > 790) are removed. | Official side-by-side simulation vs real footage |
| Skill: walks | `gh_microduck_rl_hero_montage.mov` | https://github.com/user-attachments/assets/50c3d537-8db2-4005-9d9c-3472faeec4d0 (microduck_rl README, "real robot montage") | 0.9–1.9 s, crop 640×480 @ (600, 200). The operator's knees are excluded. | Real footage |
| Skill: sits | `microduck_gallery_squad-standup.mp4` | https://pollen-robotics.com/assets/microduck/gallery/squad-standup.mp4 | 10.85–11.95 s, crop 720×540 @ (60, 120) | Real footage |
| Skill: gets back up after a fall | `microduck_launch-film.mp4` | https://pollen-robotics.com/assets/microduck/launch-film.mp4 | 8.25–10.05 s, crop 960×720 @ (740, 380). This excludes the burned-in "GET UP!" comic sticker. | Real footage (official launch film) |
| Skill: roller-skates | `gh_microduck_it_rolls.mp4` | https://github.com/user-attachments/assets/abfbf250-1b1c-42cb-8430-00267e2b148a (microduck README, "It rolls") | 16.9–18.5 s, crop 960×720 @ (940, 0) | Real footage |
| Skill: wheel attachment close-up | `microduck_microduck-hero.mp4` | https://pollen-robotics.com/assets/microduck/microduck-hero.mp4 | 10.95–11.85 s, crop 1440×1080 @ (240, 0). Only hands are visible. | Real footage |
| Product cut-out (name, size, onboard computer, ending) | `microduck_moves-portrait-alpha_walk.webm` (VP9 + alpha) | https://pollen-robotics.com/assets/microduck/moves-portrait-alpha/walk.webm | Full loop | Official transparent move clip. It appears **rendered**, so it is labelled «تصيير رسمي». |
| Components photo | `presskit/…/PHOTOS/microduck-closeup.jpg` (2047×3640) | https://pollen-robotics.com/assets/microduck/press/microduck-press-kit.zip | Cover crop | Official press photo |
| Lab scene photo | `presskit/…/PHOTOS/microduck-morning.jpg` (4240×2650) | same press kit | Cover crop | Official press photo |
| Wordmark | `presskit/…/BRAND/microduck-wordmark.png` | same press kit | Unaltered | Official logo |
| Four colourways (price scene) | `microduck_squad.webp` (transparent) | https://pollen-robotics.com/assets/microduck/squad.webp | Whole image | Official product image. It appears rendered, so it is labelled «تصيير رسمي». |
| Pollen Robotics mark | `pollen-mark.png` | https://pollen-robotics.com/assets/pollen-mark.png | Unaltered | Official logo |
| Hugging Face logo | `hf-logo.svg` | https://pollen-robotics.com/assets/hf-logo.svg | Rasterised, unaltered | Official logo |

## Facts shown on screen and where they come from

All of these come from `raw/presskit/microduck-press-kit/FACT-SHEET.txt`, the product page, or the GitHub READMEs.

- 25 cm tall.
- 15 motors / 15 degrees of freedom.
- Front camera.
- 2 IMUs (motion sensing) and a compact LiDAR with an 8×8 time-of-flight matrix (range sensing).
- Rockchip RK3566.
- 50 Hz onboard policy loop.
- Training uses MuJoCo + PPO, exports to ONNX, and the README example trains with 4096 parallel environments. The real commands shown are `uv run train Mjlab-Velocity-Flat-MicroDuck` and `scripts/infer_policy.py --walking walk.onnx`.
- Price: $399 before taxes and shipping (introductory); pre-order. Markets at launch: North America and Europe; first deliveries targeted before Christmas 2026.

## Explanatory graphics (labelled as such in the video)

- **Processor chip:** a stylised illustration, badge «رسم توضيحي». It is not a photo of the real board, and its location inside the robot is not depicted.
- **Training grid:** 16 tiles made by repeating the official simulation footage at time offsets. A caption states that it is an explanation and that the repository example trains 4096 copies.
- **policy.onnx file card:** a symbol for the exported policy file.

## Not used

- Jensen Huang / NVIDIA footage: the narration does not mention NVIDIA, so no event footage was needed.
- Press photos showing people's faces (bedroom, playtime, team, watching, screentime): excluded under the "no random faces" rule.
- Launch-film shots with actors or burned-in comic stickers: excluded.
- Hero/launch "grab" shots, where the robot picks up a sock: not used as "getting up", because that is a different skill.
