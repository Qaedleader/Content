"""Generate the brand's original, tileable paper textures (no third-party images).
- paper_grain.png  : multi-scale fibre noise for a multiply overlay (near-white, tileable 1024²)
- paper_fibers.png : sparse long fibres + specks (alpha), for a subtle normal-blend overlay
- kraft.png        : stronger cardboard grain for floors/tables (tileable 1024²)
Run: python make_textures.py <out_dir>"""
import sys, os, numpy as np
from PIL import Image, ImageDraw, ImageFilter
out = sys.argv[1]; rng = np.random.default_rng(7); N = 1024

def periodic_noise(beta):
    """Tileable 1/f^beta noise via FFT (periodic by construction)."""
    f = np.fft.fftfreq(N); fx, fy = np.meshgrid(f, f); r = np.sqrt(fx ** 2 + fy ** 2); r[0, 0] = 1
    spec = (rng.normal(size=(N, N)) + 1j * rng.normal(size=(N, N))) / r ** beta
    n = np.real(np.fft.ifft2(spec)); n = (n - n.mean()) / n.std(); return n

def fibres(img, count, lmin, lmax, width, alpha, col):
    d = ImageDraw.Draw(img, 'RGBA')
    for _ in range(count):
        x, y = rng.uniform(0, N, 2); a = rng.uniform(0, np.pi); L = rng.uniform(lmin, lmax)
        pts = []
        for t in np.linspace(0, 1, 8):
            a += rng.normal(0, 0.15)
            pts.append(((x + np.cos(a) * L * t) % N, (y + np.sin(a) * L * t) % N))
        for p, q in zip(pts[:-1], pts[1:]):
            if abs(p[0] - q[0]) < N / 2 and abs(p[1] - q[1]) < N / 2:
                d.line([p, q], fill=col + (int(alpha * rng.uniform(0.4, 1)),), width=width)

# grain (multiply): mostly 235..255
n = 0.55 * periodic_noise(0.55) + 0.30 * periodic_noise(1.2) + 0.25 * rng.normal(size=(N, N))
g = np.clip(244 + n * 7, 205, 255).astype(np.uint8)
img = Image.fromarray(g, 'L').convert('RGB'); fibres(img, 900, 10, 60, 1, 60, (205, 198, 186))
img.save(os.path.join(out, 'paper_grain.png'))

# fibres/specks (alpha)
fb = Image.new('RGBA', (N, N), (0, 0, 0, 0)); fibres(fb, 260, 20, 110, 1, 70, (255, 255, 255)); fibres(fb, 160, 8, 40, 1, 55, (60, 50, 40))
d = ImageDraw.Draw(fb)
for _ in range(500):
    x, y = rng.uniform(0, N, 2); r = rng.uniform(0.5, 1.6); d.ellipse((x - r, y - r, x + r, y + r), fill=(70, 60, 50, int(rng.uniform(40, 120))))
fb.filter(ImageFilter.GaussianBlur(0.3)).save(os.path.join(out, 'paper_fibers.png'))

# kraft
k = 0.6 * periodic_noise(0.8) + 0.4 * rng.normal(size=(N, N))
streak = np.repeat(periodic_noise(1.6)[:, :1], N, axis=1) * 0.5     # faint corrugation streaks
v = np.clip(232 + (k + streak) * 12, 180, 255).astype(np.uint8)
kimg = Image.fromarray(v, 'L').convert('RGB'); fibres(kimg, 1400, 6, 30, 1, 70, (150, 120, 90))
kimg.save(os.path.join(out, 'kraft.png'))
print('ok')
