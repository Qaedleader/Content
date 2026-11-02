# Binance security incident — Video 10 — production report (2026-10-30)

## Exports (`D:\Content\10_BinanceAttack\07_OUTPUT\`)
| File | Content | Size | sha256 |
|---|---|---|---|
| `BINANCE_ATTACK_SUBTLE_SFX.mp4` | Version A: voice + barely audible bed + 15 soft SFX | 32 867 620 B | `6a58c904…cfb1` |
| `BINANCE_ATTACK_CLEAN.mp4` | Version B: original voice only | 32 114 710 B | `aba83080…9c1f` |
| `BINANCE_ATTACK_COVER.png` | Cover: frame 45, showing the Binance logo, «أكبر سرقة», $6,300,000,000 and «في تاريخ العملات الرقمية» | 1080×1920 | `d8c3d18d…9c17` |

Both MP4s are 1080×1920, 30 fps, 1229 frames, 40.967 s. Video is H.264 High, yuv420p, bt709 tv range, CRF 16, faststart.
- The source container is 40.94 s and the decoded narration is 40.889 s. The difference is frame rounding up to whole frames.
- Audio is AAC-LC 44.1 kHz stereo: the original 107 kb/s stream in B, a 256 kb/s mix in A.
- Full hashes are in `06_QC/sha256_outputs.txt`.

## Fact verification
Checked on 2026-10-30 against Binance's own announcement plus TRM Labs, CoinDesk, NBC News, Al Jazeera and TechCrunch. CNBC returned 403 and was not used.

| Claim in the narration | Finding | On-screen treatment |
|---|---|---|
| Incident is real, "hours ago" | Binance announcement (2026-10-30 02:23); first outflow 29 Oct 20:05 UTC, most of it within ~20 min, across 10 chains (TRM). | «عاجل · 29 أكتوبر 2026», 20:05 UTC clock, «≈ ٢٠ دقيقة» (source TRM Labs) |
| $6.3B | Binance: "estimated total impact sits at around $6.3B". TRM ≈ $6.36B at transfer time; Chainalysis ≈ $5.9B; early estimates were lower. **It is an estimate.** | «تقدير Binance للأثر الإجمالي» + «TRM Labs: ≈ $6.36B · الأرقام قابلة للتعديل» |
| Largest crypto theft / "maybe largest theft in history" | About 4× the $1.5B Bybit hack (Feb 2025), which was the previous crypto record. "Largest ever" overall is not established, and the narration itself hedges with «ممكن». | Bybit vs Binance bars + badge «"الأكبر بالتاريخ" توصيف محتمل · غير محسوم» |
| Engineer's laptop → internal withdrawal system | Binance: initial investigation "may involve a compromised DevOps engineer's laptop … access to a service container and submit unauthorized withdrawal transactions". This is **preliminary**. TRM describes the hot-wallet signing infrastructure and notes there is no root cause yet. Binance says it found no private-key leak. | «حسب التحقيق الأولي», «نتيجة أولية · قد تتغيّر», «رسم توضيحي», "DevOps engineer · per Binance" |
| North Korea | TRM: TraderTraitor (Lazarus-linked), "high confidence". Chainalysis reaches a similar conclusion, and ZachXBT says "likely Lazarus". **Binance has not attributed, and there is no government attribution.** | «الجهة المرجّحة», rows TRM / Chainalysis / «Binance: لم تحدّد الجهة رسمياً», stamp «إسناد أولي · غير مؤكَّد رسمياً». No individual is named. |
| ~$3B frozen | Binance: "~$3 billion frozen on-chain so far", up from $2.54B earlier. TRM had ≈ $2.7B at 00:30 UTC. Mostly frozen by Tether (≈ $1.57B) and Circle (≈ $0.8B). | «مجمّد ≈ $3B», breakdown line, «مجمّد ≠ مُسترجَع» |
| Compensation from emergency fund + company money | Binance: "will cover all losses from the SAFU fund and the company's funds. User funds are safe." No payouts reported yet. | Shield «وعد بتغطية كل الخسائر · لم يُعلَن عن صرف تعويضات بعد»; SAFU shown as «احتياطي داخلي لدى Binance · ليس تأميناً خارجياً» |
| Remainder unknown | Reporting puts ~$3.3B as not frozen. | «الباقي ≈ $3.3B · مصيره غير معروف بعد» |

Nothing in the recording contradicts the verified reporting, so the audio needed no change and nothing was held back.
Some figures conflict between sources: the frozen total ($2.54B, then $2.7B, then ~$3B), Bybit at $1.4B vs $1.5B, and Circle's freeze. The video uses Binance's latest figures and labels them as such.

Sources:
- Binance announcement: https://www.binance.com/en/support/announcement/detail/c5a8729a97ac486d963784d96c5642d7
- TRM Labs: https://www.trmlabs.com/resources/blog/north-korea-steals-usd-6-36-billion-from-binance-in-the-largest-hack-in-history
- CoinDesk: https://www.coindesk.com/business/2026/10/29/potential-multi-billion-binance-hack-hitting-crypto-markets
- NBC News: https://www.nbcnews.com/business/markets/binance-hack-tether-circle-stablecoins-rcna606445
- Al Jazeera: https://www.aljazeera.com/economy/2026/10/30/binance-says-2-54bn-in-crypto-funds-frozen-amid-potential-security-issue
- TechCrunch: https://techcrunch.com/2026/10/29/binance-pauses-withdrawals-as-hackers-suspected-of-stealing-billions-in-crypto/

**Shelf life:** the narration says «قبل ساعات فقط» and the figures are early. Publish soon or re-check them first. The closing frame says «أرقام أولية من Binance · القصة ما زالت تتطور».

## Audio integrity (`06_QC/audio/qc_audio_report.json`)
- The source `Binance attack.m4a.mp4` has sha256 `f3d769f6…1045` and is unchanged before and after. A byte copy is in `01_AUDIO/Original/`.
- **CLEAN (B):** the AAC stream was muxed with `-c copy`. All 1763 packets have identical payloads and durations. Decoded PCM md5 is `23b6f8c7…aae3` for both source and output (1 803 200 samples). There is one audio stream and no added audio.
- **SUBTLE_SFX (A):**
  - The narration was decoded to float and added at unity gain. The narration stem equals the original decode, bit for bit.
  - Nothing was trimmed, faded, given EQ or compression, normalised, gain-changed or time-changed.
  - Only the added layers are ducked and limited to avoid clipping.
  - Bed: 32 LU under the voice. SFX: 43 LU under the voice. The SFX are 15 soft cues: low hits, dull whooshes, a tick, pulses and a shimmer. There are no alarms or risers.
  - Null test on the exported file: estimated voice gain 0.997, and the added layers sit 30.8 dB below the voice.
  - Re-encoding the mix to AAC 256k leaves a coding residual 38 dB below the voice. This is unavoidable once anything is added to the voice; B is the bit-exact version.
  - The source voice decodes to a sample peak of 1.026 (above 0 dBFS in float). It was left as is.

## Visual QC
- Both versions carry the same H.264 bitstream: the framemd5 of all 1229 frames is identical.
- blackdetect found 0 black segments.
- Contact sheets are `06_QC/final_sheet.jpg` (every 41st frame of the export) and `06_QC/transitions_sheet.jpg`.
- Arabic shaping and RTL were checked on every caption and label.
- No clipping at the frame edges after the fixes listed below.
- Information stays above y 1560 and left of the Reels button column, except the corner badges and source lines.

Issues found and fixed:
- Dead lower third in the hook and incident scenes (layout moved down and enlarged).
- The «عاجل» tag collided with the title card.
- The attacker marker was clipped at the frame edge, then overlapped a card.
- The attribution and funds scenes opened on empty frames.

## Narration → visuals
| s | Narration | Visual |
|---|---|---|
| 0.0–2.3 | أكبر سرقة في تاريخ العملات الرقمية | Frame 0: Binance logo, «أكبر سرقة», $ ledger rolling to 6,300,000,000, value streaming out |
| 2.3–4.8 | وممكن تكون أكبر سرقة أموال في التاريخ | «أكبر سرقة أموال بالتاريخ؟», Binance $6.3B vs Bybit $1.5B bars, «≈ ٤ أضعاف», "possible characterisation" badge |
| 4.8–6.4 | صارت قبل ساعات فقط | 20:05 UTC clock, «قبل ساعات فقط» |
| 6.6–12.1 | من ساعات منصة Binance تعرضت لاختراق ضخم بقيمة 6 مليار و300 مليون دولار | Hot-wallet ring on 10 chains, breach pulse, outflows, 20-minute timeline, then the ledger lands on 6,000,000,000 and adds 300,000,000 on the spoken words, «٦٫٣ مليار دولار» |
| 12.1–13.0 | شو اللي صار؟ | Hero question |
| 13.0–20.7 | حسب التحقيق الأولي … مليارات الدولارات | Illustrated chain: attacker signal → DevOps laptop compromised → service container → withdrawal system → external wallets; camera follows the path |
| 20.7–25.1 | والتحقيقات بترجح … كوريا الشمالية | Flag (small, desaturated), TraderTraitor card, «إسناد أولي» stamp |
| 25.1–38.0 | طيب رح يتم تعويض المستخدمين … باقي الأموال | Users + «؟» → $6.3B bar: frozen ≈ $3B (ice) vs remainder ≈ $3.3B (hatched) → SAFU + company funds → pledge shield → «مش معروف» |
| 38.0–41.0 | وكل هذا بدأ من اختراق جهاز واحد فقط | Single laptop → red wave across a global network → closing frame: logo, «جهاز واحد», «لابتوب واحد ← ≈ $6.3B» |

## Rebuild
Composition **`Binance`** in `D:/Content/_BRAND_SYSTEM/src/episodes/binance/`: `ep.ts`, `kit.tsx`, `scenes/Hook.tsx`, `scenes/Breach.tsx`, `scenes/Funds.tsx`, `Binance.tsx`. It reuses the brand captions, index cards, hero words, badges, PixelCut and PaperGrade.
Timing comes from `02_TIMING/transcribe.py` (faster-whisper large-v3-turbo), then `whisper_words.json`, then `build_words.py`, then `words.json`. Timings are unchanged.
```bash
cd D:/Content/_BRAND_SYSTEM
npx tsc --noEmit
npx remotion bundle src/index.ts --out-dir=out/bundle_bn
npx remotion render out/bundle_bn Binance out/bn_chunks/c01.mp4 --frames=0-299 --muted --concurrency=1   # c02 300-599, c03 600-899, c04 900-1228 (~2.5 min each)
FF=D:/Content/02_NEURALINK/07_PROJECT/.venv/bin/ffmpeg.exe
$FF -f concat -safe 0 -i out/bn_chunks/list.txt -c copy out/bn_chunks/picture.mp4
$FF -i out/bn_chunks/picture.mp4 -vf "scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p" -c:v libx264 -preset slow -crf 16 -profile:v high -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -an out/bn_chunks/picture_tv.mp4
python -I D:/Content/10_BinanceAttack/04_PRODUCTION/audio/audio_design.py
$FF -i out/bn_chunks/picture_tv.mp4 -i "D:/Content/10_BinanceAttack/01_AUDIO/Original/Binance attack.m4a.mp4" -map 0:v -map 1:a -c copy -movflags +faststart D:/Content/10_BinanceAttack/07_OUTPUT/BINANCE_ATTACK_CLEAN.mp4
$FF -i out/bn_chunks/picture_tv.mp4 -i D:/Content/10_BinanceAttack/04_PRODUCTION/audio/final_mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -movflags +faststart D:/Content/10_BinanceAttack/07_OUTPUT/BINANCE_ATTACK_SUBTLE_SFX.mp4
python -I D:/Content/10_BinanceAttack/06_QC/audio/qc_audio.py
```

## Not done
- Nothing was published or uploaded.
- No Drive upload was made.
- No `npm run build`; only `tsc --noEmit` plus the Remotion bundle and render needed for the export.
- No packages were installed.
