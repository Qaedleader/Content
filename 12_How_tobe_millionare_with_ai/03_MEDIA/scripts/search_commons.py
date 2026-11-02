"""Search Wikimedia Commons (File namespace) and build a review contact sheet of candidates with licence info.
Usage: python search_commons.py out_prefix "query1" "query2" ..."""
import sys, json, io, time, urllib.parse, urllib.request
from PIL import Image, ImageDraw
UA = 'MillionaireAIReel/1.0 (editorial documentary; contact YOUR_CONTACT_EMAIL) python-urllib'
def get(url):
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=120) as r: return r.read()
        except Exception:
            if i == 2: raise
            time.sleep(5)
def api(**p):
    p['format'] = 'json'; return json.loads(get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(p)))
FT = 'bitmap'
prefix, qs = sys.argv[1], sys.argv[2:]
if prefix.startswith('V_'): FT = 'video'
if prefix.startswith('S_'): FT = 'drawing'
rows = []
for q in qs:
    d = api(action='query', generator='search', gsrsearch=q + (' filetype:' + FT), gsrnamespace=6, gsrlimit=8, prop='imageinfo', iiprop='url|size|extmetadata', iiurlwidth=360)
    pages = sorted(d.get('query', {}).get('pages', {}).values(), key=lambda p: p.get('index', 0))
    for p in pages:
        ii = p['imageinfo'][0]; em = ii.get('extmetadata', {})
        lic = (em.get('LicenseShortName') or {}).get('value', '?')
        rows.append({'q': q, 'title': p['title'], 'lic': lic, 'w': ii.get('width'), 'h': ii.get('height'), 'thumb': ii.get('thumburl')})
    time.sleep(0.5)
json.dump(rows, open(f'review/{prefix}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
cols = 8; tw, th = 360, 270
sheet = Image.new('RGB', (cols * tw, ((len(rows) + cols - 1) // cols) * (th + 40)), 'white'); dr = ImageDraw.Draw(sheet)
for k, r in enumerate(rows):
    x, y = (k % cols) * tw, (k // cols) * (th + 40)
    try:
        im = Image.open(io.BytesIO(get(r['thumb']))).convert('RGB'); im.thumbnail((tw - 6, th)); sheet.paste(im, (x + 3, y + 36))
    except Exception: pass
    dr.text((x + 3, y + 2), f"{k} {r['lic']} {r['w']}x{r['h']}", fill='red'); dr.text((x + 3, y + 16), r['title'][5:60], fill='black')
    time.sleep(0.15)
sheet.save(f'review/{prefix}.jpg', quality=82); print(len(rows))
