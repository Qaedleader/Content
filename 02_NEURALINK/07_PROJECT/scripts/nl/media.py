"""Media access for the compositor: real video clips (streamed through ffmpeg at 30 fps), photos, 3D PNG sequences.
All paths are relative to 02_NEURALINK. Clips are decoded on demand and streamed sequentially (the renderer walks
frames in order), so only one decoded frame per active clip is held in memory."""
import os, subprocess, functools, json
import numpy as np, skia, cv2
from .gfx import NL, ROOT, W, H, FPS, to_skimage, load_image

FFMPEG = os.path.join(ROOT, '.venv', 'bin', 'ffmpeg.exe')
SOURCES = json.load(open(os.path.join(ROOT, 'media_sources.json'), encoding='utf-8'))

def path_of(key):
    if key in SOURCES: return os.path.join(NL, SOURCES[key]['dest'])
    return os.path.join(NL, key)

def photo(key, max_dim=2600):
    return load_image(path_of(key), max_dim)

@functools.lru_cache(40)
def thumb(key, max_dim=760):
    """small copies for collage prints (own cache, so they don't evict full-size photos)"""
    from PIL import Image, ImageOps
    import numpy as np
    im = Image.open(path_of(key)); im.draft('RGB', (max_dim * 2, max_dim * 2))
    im = ImageOps.exif_transpose(im).convert('RGBA'); im.thumbnail((max_dim, max_dim), Image.LANCZOS)
    return to_skimage(np.array(im))

def probe_size(path):
    cap = cv2.VideoCapture(path); w, h = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)); cap.release()
    return w, h

class Clip:
    """A source video segment conformed to 30 fps. get(t) returns a skia.Image for clip-local time t (s).
    tc_in: source in-point (s); speed: playback speed (0.5 = half speed); width: decode width (keeps aspect);
    hold: freeze on the last decoded frame past 'dur'."""
    _live = {}

    def __init__(self, key, tc_in=0.0, speed=1.0, width=1440, dur=None, vflip=False):
        self.key, self.tc_in, self.speed, self.width, self.dur = key, tc_in, speed, width, dur
        self.path = path_of(key)
        sw, sh = probe_size(self.path)
        self.w = width - width % 2; self.h = int(round(sh * self.w / sw / 2)) * 2
        self.proc = None; self.next = 0; self.last = None; self.vflip = vflip

    def _open(self, n):
        self.close()
        t0 = self.tc_in + n / FPS * self.speed
        vf = f"setpts=(PTS-STARTPTS)/{self.speed},fps={FPS},scale={self.w}:{self.h}:flags=lanczos"
        cmd = [FFMPEG, '-v', 'error', '-ss', f'{t0:.4f}', '-i', self.path, '-an', '-vf', vf,
               '-f', 'rawvideo', '-pix_fmt', 'rgba', '-']
        self.proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, bufsize=self.w * self.h * 4 * 2)
        self.next = n

    def _read(self):
        nb = self.w * self.h * 4
        buf = self.proc.stdout.read(nb)
        if len(buf) < nb: return None
        return np.frombuffer(buf, np.uint8).reshape(self.h, self.w, 4)

    def get(self, t):
        n = max(0, int(round(t * FPS)))
        if self.dur is not None: n = min(n, int(self.dur * FPS))
        if self.last is not None and n == self.next - 1: return self.last
        if self.proc is None or n < self.next or n > self.next + 45: self._open(n)
        arr = None
        while self.next <= n:
            a = self._read()
            if a is None: break
            arr = a; self.next += 1
        if arr is not None:
            self.last = to_skimage(arr.copy())
        return self.last

    def close(self):
        if self.proc:
            try: self.proc.stdout.close(); self.proc.kill(); self.proc.wait(timeout=5)
            except Exception: pass
        self.proc = None

_CLIPS = {}
_USED = {}
TICK = [0]
def clip(name, key, **kw):
    """Named clip registry so each scene keeps its own decoder."""
    c = _CLIPS.get(name)
    if c is None: c = _CLIPS[name] = Clip(key, **kw)
    _USED[name] = TICK[0]
    return c

def gc(frame, idle=12):
    """close decoders not used during the last `idle` frames (keeps RAM flat on the 8 GB machine)"""
    TICK[0] = frame
    for k in list(_CLIPS):
        if frame - _USED.get(k, frame) > idle:
            _CLIPS[k].close(); del _CLIPS[k]; _USED.pop(k, None)

def close_clips(keep=()):
    for k in list(_CLIPS):
        if k not in keep: _CLIPS[k].close(); del _CLIPS[k]

@functools.lru_cache(3)
def seq_frame(shot, f):
    """3D render frame (RGBA PNG) -> skia.Image, or None if missing."""
    p = os.path.join(NL, '05_3D_AND_GRAPHICS', 'renders', shot, f'{shot}_{f:03d}.png')
    if not os.path.exists(p): return None
    a = cv2.imread(p, cv2.IMREAD_UNCHANGED)
    if a is None: return None
    a = cv2.cvtColor(a, cv2.COLOR_BGRA2RGBA) if a.shape[2] == 4 else cv2.cvtColor(a, cv2.COLOR_BGR2RGBA)
    return to_skimage(a)

def seq_len(shot):
    d = os.path.join(NL, '05_3D_AND_GRAPHICS', 'renders', shot)
    return len([f for f in os.listdir(d) if f.endswith('.png')]) if os.path.isdir(d) else 0
