# AI vs AI Agent — Video 9 (final)

**Final:** `07_OUTPUT/AI_VS_AI_AGENT_FINAL.mp4` · 1080×1920 · 30 fps · 1340 frames (44.667 s) · H.264 High (yuv420p, bt709 tv range, CRF 16) · AAC-LC 44.1 kHz stereo (original stream, copied) · 34 926 672 bytes · sha256 `a0766b346ea7aa8e3b24ef7d830dc7dd712d669eb5b11545676895b652554933`.

**Narration:** `Ai vs Ai Agent.m4a.mp4`, untouched (sha256 `34881b67…aaa26` before and after; copies in `01_AUDIO/Original/` and `_BRAND_SYSTEM/public/episodes/aiagent/audio/`). No music, no SFX, no gain — the AAC stream is muxed with `-c copy`.
Audio check: 1923 AAC packets, per-packet payload md5 identical (framemd5 `-c copy`); decoded PCM md5 identical (`8c60e60b…`, 7 868 160 bytes s16le). Only the container's last-packet duration field differs (1024 → 1020 samples, from the source's iTunSMPB end padding); payload and decoded audio are identical.

**Drive:** My Drive › Content › "AI versus AI agent" (`15eZJ-h1joioDz78yP4JGbg-xvBqjOKIP`), file `17zonZn4eLb-vSnvfYqTS10qiatCzjtwu`.

## Pipeline (Remotion brand system, 100 % custom vector animation, no stills)
- Composition **`AiAgent`** in `D:/Content/_BRAND_SYSTEM/src/episodes/aiagent/`: `ep.ts` (timeline + named word indices), `kit.tsx` (camera, articulated figure with leg FK, ball, AI core, tool plates, envelope/plane, pulses), `scenes/Hook.tsx`, `scenes/Human.tsx`, `scenes/AgentWorld.tsx`, `AiAgent.tsx`.
- Colour logic: paper-white = information in, brand yellow = action out.
- Timing: `02_TIMING/transcribe.py` → `whisper_words.json` → `build_words.py` → `words.json` (spelling fixes «ومخك», «هون», «جبنا هالمخ» checked with `check_seg.py`; timings unchanged).

```bash
cd D:/Content/_BRAND_SYSTEM
npx tsc --noEmit
npx remotion bundle src/index.ts --out-dir=out/bundle_aa
npx remotion render out/bundle_aa AiAgent out/aa_chunks/c01.mp4 --frames=0-299 --muted --concurrency=1   # … c05 = 1200-1339 (~70 s each)
FF=D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe
$FF -f concat -safe 0 -i out/aa_chunks/list.txt -c copy out/aa_chunks/picture.mp4
$FF -i out/aa_chunks/picture.mp4 -i "D:/Content/9_AI_VS_AI_Agent/Ai vs Ai Agent.m4a.mp4" -map 0:v -map 1:a -c copy \
    -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0 -movflags +faststart \
    D:/Content/9_AI_VS_AI_Agent/07_OUTPUT/AI_VS_AI_AGENT_FINAL.mp4
```

## Narration → visuals
| Time (s) | Narration | Visual |
|---|---|---|
| 0.00–3.48 | ما هو الفرق بين AI والـAI Agent بأبسط صورة؟ | Frame 0: «ما الفرق؟» + two plates — AI (core answers in a bubble) vs AI Agent (same core wired to inbox/send tools, envelope → plane → target hit) |
| 3.48–5.86 | تخيل حالك كإنسان شفت كرة قدامك | Paper figure stands up, ball rolls in |
| 5.86–7.06 | عينك استقبلت الصورة | Camera pushes in; white light rays + ball image travel into the eye |
| 7.06–9.04 | ودماغك حلّلها وعرف إنها كرة | X-ray head: white signal eye → brain, analysis brackets, «كرة» recognised |
| 9.04–11.14 | وبعدين قرر دماغك يشوّتها | Options «اتركها / امسكها / شوّتها», brain picks «شوّتها» |
| 11.14–13.32 | فأعطى أمر لإجرك تتحرك وتشوّت الكرة | Yellow command runs brain → spine → leg while camera pulls back; wind-up, contact, follow-through, ball flies |
| 13.68–17.12 | هون عينك جابت المعلومة ومخك قرر وإجرك نفذت | Recap callouts ١ العين / ٢ المخ / ٣ الإجر with replayed signals; title «تستقبل ← تقرّر ← تنفّذ» |
| 17.30–22.92 | ونفس المبدأ بالـ AI … ChatGPT وكلود وجيميناي مثل مخك | Brain lifts out of the head and digitises into the AI core; ChatGPT / Claude / Gemini plug in one at a time («كل واحد لحاله»); «مخك = النموذج» + badge «تشبيه للتوضيح» |
| 22.92–28.12 | فعلى سبيل المثال … بأدوات بتقرأ وبتبعث إيميلات | Reader (white) and sender (yellow) tools connect to the core by cables |
| 28.12–32.68 | وقلنا له كل ما يوصلك إيميل حلّل ورد … ضمن تعليماتي | Instructions card → dashed boundary «ضمن تعليماتي»; fictional email «طلب اجتماع» → reader → core → «نوعه: طلب اجتماع» + «حسب تعليماتي: الثلاثاء» → reply «أهلاً! الثلاثاء الساعة ١١ الصبح مناسب؟» → sender → plane out |
| 32.72–36.96 | هون المخ بحلّل ويقرر والأدوات بتخليه يستقبل … ويبعث الردود | «يحلّل», decision card «يرد / يسألني أولاً / يتجاهل» picks «يرد», badge «بدون ما تضغط على كل خطوة», three envelopes in, three planes out |
| 37.06–44.67 | وبهاي الطريقة … AI Agent يعني وكيل ذكاء اصطناعي مخ ومعه أدوات بيستخدمها عشان يحقق هدف | System compacts → «AI Agent» / «وكيل ذكاء اصطناعي» = [مخ] + [أدوات] + [هدف], goal-directed yellow pulse loops to the last frame |
