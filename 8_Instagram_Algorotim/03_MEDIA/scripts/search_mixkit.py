"""Collect Mixkit free stock video items from listing pages and build a contact sheet (Mixkit Stock Video Free License).
Usage: python -I search_mixkit.py out_prefix page_path1 page_path2 ...  (e.g. free-stock-video/rain/ or free-stock-video/discover/cafe/)"""
import sys, json, io, os, re, time, urllib.request
from PIL import Image, ImageDraw
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
REV = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'review')
def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60) as r: return r.read()
prefix, pages = sys.argv[1], sys.argv[2:]
seen, rows = set(), []
for pg in pages:
    try: html = get('https://mixkit.co/' + pg.strip('/') + '/').decode('utf-8', 'ignore')
    except Exception as e: print('fail', pg, e); continue
    for slug, vid in re.findall(r'href="/free-stock-video/([a-z0-9-]+)-(\d+)/"', html):
        if vid in seen: continue
        seen.add(vid); rows.append({'page': pg, 'id': int(vid), 'title': slug.replace('-', ' '), 'url': f'https://mixkit.co/free-stock-video/{slug}-{vid}/'})
    time.sleep(0.3)
json.dump(rows, open(os.path.join(REV, f'{prefix}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
cols = 6; tw, th = 360, 203
sheet = Image.new('RGB', (cols * tw, max(1, (len(rows) + cols - 1) // cols) * (th + 22)), 'white'); dr = ImageDraw.Draw(sheet)
for k, r in enumerate(rows):
    x, y = (k % cols) * tw, (k // cols) * (th + 22)
    for t in (0, 1):
        try:
            im = Image.open(io.BytesIO(get(f"https://assets.mixkit.co/videos/{r['id']}/{r['id']}-thumb-360-{t}.jpg"))).convert('RGB'); im.thumbnail((tw - 4, th)); sheet.paste(im, (x + 2, y + 20)); break
        except Exception: pass
    dr.text((x + 3, y + 3), f"{k} #{r['id']} {r['title'][:46]}", fill='red')
sheet.save(os.path.join(REV, f'{prefix}.jpg'), quality=80); print(prefix, len(rows))
