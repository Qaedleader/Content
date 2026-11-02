"""Local Arabic transcription with word timestamps (faster-whisper large-v3-turbo, CPU int8).
Reads only the 16 kHz analysis copy; never touches the original narration."""
import sys, json
from faster_whisper import WhisperModel
m = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8', cpu_threads=4,
                 download_root=r'D:/Content/02_NEURALINK/07_PROJECT/.models')
segs, info = m.transcribe('vo_16k_analysis.wav', language='ar', word_timestamps=True, beam_size=5,
                          vad_filter=False, condition_on_previous_text=True,
                          initial_prompt='الذكاء الاصطناعي، وكيل الذكاء الاصطناعي، AI Agent، ChatGPT، Claude، Gemini، الإيميل، الكورة، الدماغ، رجلك.')
out = {'duration': info.duration, 'segments': []}
for s in segs:
    out['segments'].append({'start': s.start, 'end': s.end, 'text': s.text.strip(),
        'words': [{'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3), 'p': round(w.probability, 3)} for w in s.words]})
    print(f"{s.start:6.2f}-{s.end:6.2f} {s.text.strip()}", flush=True)
json.dump(out, open(sys.argv[1] if len(sys.argv) > 1 else 'whisper_words.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
