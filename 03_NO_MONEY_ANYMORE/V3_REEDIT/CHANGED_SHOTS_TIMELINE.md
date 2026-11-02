# V3: changed-shot timeline (as delivered)

**Measured method:** every frame of V3 was compared with the same frame of V1 and of V2 (PSNR, `qc/psnr_v1_v3.log`, `qc/psnr_v2_v3.log`). Frames below 40 dB count as changed.

| Comparison | Changed frames | Share | Changed ranges | Unchanged frames |
|---|---|---|---|---|
| V3 vs V1 | **1388 / 1785** | **77.8 %** | 0–1201, 1599–1784 | 1202–1598 match V1 at ≥ 41.9 dB (re-encode noise) |
| V3 vs V2 | **1388 / 1785** | **77.8 %** | 0–1201, 1599–1784 | as above |

Pixel difference alone does not prove a redesign. The "Composition" column below states what is actually new in each shot. `comparison/*.jpg` shows V1, V2 and V3 side by side at the same frames.

| Shot | Frames | Time | Narration | Status | Composition (V1/V2 → V3) | Real media in V3 |
|---|---|---|---|---|---|---|
| 01 | 0–81 | 0.00–2.70 | اصرف مصاريك… إلها قيمة | **Replaced** | Banknote on a table → **production machine**. Goods stream out, notes drop into its hopper, the «قيمة» gauge falls, crate stacks dwarf the money, and the rollers tear the note | — |
| 02 | 82–131 | 2.73–4.37 | احضر الفيديو لتعرف ليش | **Replaced** | Progress bar → shelf of goods, "watch" ring token, torn note on the floor, «ليش؟» | — |
| 03 | 132–275 | 4.40–9.17 | تخيّل… 99.9% من كل إشي | **Replaced** | Pop-up landscape → **1,000-tile task board**. AI chip and robots arrive, a yellow wave flips 999 tiles, and one «0.1%» tile remains | — |
| 04 | 276–578 | 9.20–19.27 | بدك سيارة؟ … لباب بيتك | **Replaced** | Horizontal pans with a stepper → **vertical production map** with a serpentine yellow road and six stations, each a real photo window plus paper machinery. One object transforms along the road (design file → ore → ingot → panels → car → truck) | Brockman 4 mining equipment · blast-furnace footage · hot-rolling mill · robotic welding line · Waymo driverless car |
| 05 | 579–718 | 19.30–23.93 | طب مين بصنع الروبوتات… الذكاء الاصطناعي | **Replaced** | Lone arm → 5×5 grid → **robot cell**. Robot parts on a line; two arms build a new arm joint by joint («تصنيع»). A separate «تطوير» board shows AI iterating v1→v2→v3 and feeding the line | Stäubli robot footage · autonomous-lab footage |
| 06 | 719–826 | 23.97–27.53 | وحتى الطاقة… صيانة | **Replaced** | Wind footage → diorama becomes a **cross-section with an energy foundation**: three real infrastructure windows feed factories through yellow lines; robots place panels; a surge and a maintenance card | Power station · 750 kV switchyard · solar plant |
| 07 | 827–989 | 27.57–32.97 | يعني من أول مادة خام… بدون بشر تقريباً | **Replaced** | Zig-zag path → **elevator through layers** (ore → mine → furnace → factory → road → home) with a drawn spine. Then a **20-tile staff board** flips to robots in four waves; one worker stays («تقريباً») | — |
| 08 | 990–1081 | 33.00–36.03 | ونفس الإشي بالأكل والبيوت والملابس والدوا | **Replaced** | Four prints (V1) / four slots (V2) → **four full-frame pages**, each with its own process: harvest → crates → truck; floors → house; fabric → shirt; tablets → blister | Harvester, greenhouse · cranes, 3D-printed house · knitting machine, looms · tablet press |
| 09 | 1082–1201 | 36.07–40.03 | الإنتاج بصير هائل… إلها قيمة | **Replaced** | Crate stack, arrow and cost line → **the opening's machine returns**. 15 goods = 15 impact cues build a pyramid, the «الإنتاج» meter fills, the «التكلفة» tag snaps and crashes off, and the banknote shrinks and greys | — |
| 10 | 1202–1447 | 40.07–48.23 | فالحق حالك… الكتلة والطاقة والقدرة | **Kept (V1)** | The bank → balance metaphor clearly frames the speaker's opinion | (V1) |
| 11 | 1448–1598 | 48.27–53.27 | يعني مثلاً معادن… ملايين الروبوتات | **Kept (V1)** | Real ingots and pylon prints with a concrete example | p_al_ingots, p_pylon (V1) |
| 12 | 1599–1784 | 53.30–59.47 | لأنه بهالعالم الأهم… القدرة على الإنتاج | **Replaced** | Industrial landscape → spinning gear becomes **the production world assembling**. Note struck and dropped; nine production pieces fly into a radial ecosystem around a factory; flows lock on the impact; the words land beneath; a yellow frame snaps around it on the ratchet. **No gear** | — |

**Audio cue alignment:** every new visual beat is placed on an existing cue of the locked mix. The cue frame of each event is listed in the header comment of each scene file (`EDITABLE_SOURCE/no-money-v3/scenes/*.tsx`) and in `STORYBOARD_V3.md`.
