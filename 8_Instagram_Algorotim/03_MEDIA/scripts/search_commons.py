"""Search Wikimedia Commons (File namespace) for videos or images and build a review contact sheet with licence info.
Usage: python -I search_commons.py <video|bitmap> out_prefix "query1" "query2" ...   (writes ../review/<prefix>.json/.jpg)"""
import sys, json, io, os, time, urllib.parse, urllib.request
from PIL import Image, ImageDraw
UA = 'InstagramAlgorithmReel/1.0 (editorial documentary; contact YOUR_CONTACT_EMAIL) python-urllib'
REV = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'review')
def get(url):
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=120) as r: return r.read()
        except Exception:
            if i == 2: raise
            time.sleep(5)
def api(**p):
    p['format'] = 'json'; return json.loads(get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(p)))
kind, prefix, qs = sys.argv[1], sys.argv[2], sys.argv[3:]
n = 8 if kind == 'video' else 6
rows = []
for q in qs:
    d = api(action='query', generator='search', gsrsearch=f'{q} filetype:{kind}', gsrnamespace=6, gsrlimit=n, prop='imageinfo|videoinfo',
            iiprop='url|size|extmetadata', iiurlwidth=360, viprop='url|size|derivatives|extmetadata', viurlwidth=360)
    pages = sorted(d.get('query', {}).get('pages', {}).values(), key=lambda p: p.get('index', 0))
    for p in pages:
        ii = (p.get('videoinfo') or p.get('imageinfo') or [{}])[0]; em = ii.get('extmetadata', {})
        lic = (em.get('LicenseShortName') or {}).get('value', '?')
        dur = ii.get('duration')
        ders = [x for x in ii.get('derivatives', []) if x.get('type', '').startswith('video')]
        rows.append({'q': q, 'title': p['title'], 'lic': lic, 'w': ii.get('width'), 'h': ii.get('height'), 'dur': dur, 'thumb': ii.get('thumburl'), 'url': ii.get('url'),
                     'artist': (em.get('Artist') or {}).get('value', ''), 'derivs': [(x.get('width'), x.get('height'), x.get('src')) for x in ders]})
    time.sleep(0.5)
json.dump(rows, open(os.path.join(REV, f'{prefix}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
cols = 6; tw, th = 360, 220
sheet = Image.new('RGB', (cols * tw, max(1, (len(rows) + cols - 1) // cols) * (th + 40)), 'white'); dr = ImageDraw.Draw(sheet)
for k, r in enumerate(rows):
    x, y = (k % cols) * tw, (k // cols) * (th + 40)
    try:
        im = Image.open(io.BytesIO(get(r['thumb']))).convert('RGB'); im.thumbnail((tw - 6, th)); sheet.paste(im, (x + 3, y + 36))
    except Exception: pass
    d = f" {r['dur']:.0f}s" if r['dur'] else ''
    dr.text((x + 3, y + 2), f"{k} {r['lic']} {r['w']}x{r['h']}{d}", fill='red'); dr.text((x + 3, y + 16), r['title'][5:58], fill='black')
    time.sleep(0.15)
sheet.save(os.path.join(REV, f'{prefix}.jpg'), quality=80); print(prefix, len(rows))
