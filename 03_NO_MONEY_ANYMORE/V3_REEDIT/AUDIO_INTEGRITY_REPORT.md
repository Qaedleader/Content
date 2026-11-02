# Audio integrity report: V3

**Method:** the soundtrack was not regenerated, re-mixed or re-encoded. The AAC stream of the approved V1 master (`../05_OUTPUT/NO_MONEY_ANYMORE_FINAL.mp4`, sha256 `ef0d20cc…7560f5`) was **stream-copied** (`-c copy`) into V3 together with the newly encoded picture.

## Measured (ffmpeg 7.1, on the exported files)
| Check | V1 | V3 | Result |
|---|---|---|---|
| Audio stream | AAC-LC, 44.1 kHz, stereo, 267 kb/s | AAC-LC, 44.1 kHz, stereo, 267 kb/s | Same |
| MD5 of the encoded audio packets (`-map 0:a -c copy -f md5`) | `3f3e0de2f8f7da983408752d6b4f87f8` | `3f3e0de2f8f7da983408752d6b4f87f8` | **Identical** |
| MD5 of the decoded PCM samples (`-map 0:a -f md5`) | `4446deee56d033ec6df568a0bc68c15e` | `4446deee56d033ec6df568a0bc68c15e` | **Identical, bit-exact** |
| Container duration | 59.50 s | 59.50 s | Same |
| Video frames | 1785 | 1785 | Same timeline, so sync is unchanged |

**Conclusion:** the narration, music, sound effects, pauses and timing in V3 are bit-identical to the published V1 soundtrack (and therefore to V2). Nothing was shortened, extended, re-pitched or re-timed.

The narration-integrity checks from V1 still apply (`../FINAL_QC_REPORT.md`): lag of 0 samples and correlation of 0.99997 against the original recording.
