# Audio preservation verification

**Method:** V2's audio track was **not** re-mixed or re-encoded. The AAC stream of the V1 master was **stream-copied** (`-c copy`) into V2.
- No new voice, music or effects were generated.
- No sound cue was moved.

Every new visual was timed to land on an existing cue of the V1 mix:
- **Opening:** the impact at f5, the paper slides on «مصاريك», the stamp on «المصاري», the scribble on «رح» (the robot arm's marker), the pop on «قيمة» and the tear.
- **Car:** the pop at f278.
- **Chain:** the pencil at f831.
- **Everything scene:** the four impacts on the four words.
- **Ending:** the ratchet at 58.75 s, now the gear's click-stop.

## Measured (ffmpeg 7.1)
| Check | V1 `NO_MONEY_ANYMORE_FINAL.mp4` | V2 `FINAL_V2_REEDIT.mp4` | Result |
|---|---|---|---|
| Audio stream | AAC-LC 44.1 kHz stereo, 267 kb/s | AAC-LC 44.1 kHz stereo, 267 kb/s | Same |
| MD5 of the audio packets (`-map 0:a -c copy -f md5`) | `3f3e0de2f8f7da983408752d6b4f87f8` | `3f3e0de2f8f7da983408752d6b4f87f8` | **Identical** |
| MD5 of the decoded PCM (`-map 0:a -f md5`) | `4446deee56d033ec6df568a0bc68c15e` | `4446deee56d033ec6df568a0bc68c15e` | **Identical (bit-exact samples)** |
| Duration | 59.50 s | 59.50 s | Same |
| Video frames | 1785 | 1785 | Same; picture and audio share the same timeline |

**Conclusion:** the narration, music and sound effects in V2 are bit-identical to the published V1. Nothing about the voice changed: not its pitch, tempo, words, pauses or level.

V1's own narration-integrity checks still apply unchanged (`../FINAL_QC_REPORT.md`):
- lag 0 samples against the original recording;
- correlation 0.99997.
