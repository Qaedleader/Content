"""Download Mixkit clips ONLY if the item page states the Mixkit Stock Video Free License (data-license="videoFree").
Saves raw/mixkit/<id>_<slug>.mp4 (largest available of 2160/1080/720) + .json sidecar. Usage: python -I fetch_mixkit.py id1 id2 ..."""
import sys, json, os, re, time, urllib.request
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'raw', 'mixkit')
idx = {}
REV = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'review')
for f in os.listdir(REV):
    if f.startswith('mk_') and f.endswith('.json'):
        for r in json.load(open(os.path.join(REV, f), encoding='utf-8')): idx[r['id']] = r
def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=180) as r: return r.read()
for a in sys.argv[1:]:
    i = int(a); r = idx.get(i)
    if not r: print('unknown id', i); continue
    slug = r['url'].rstrip('/').split('/')[-1]
    dst = os.path.join(OUT, f'{slug}.mp4')
    if os.path.exists(dst): print('have', slug); continue
    page = get(r['url']).decode('utf-8', 'ignore')
    lic = re.findall(r'data-license="([a-zA-Z]+)"', page)
    if lic != ['videoFree']: print('SKIP licence', slug, lic); continue
    data = None
    m = re.findall(r'(https://assets\.mixkit\.co/active_storage/video_items/%d/\d+/%d-video)-(?:360|720)\.mp4' % (i, i), page)
    bases = ([m[0] + '-'] if m else []) + [f'https://assets.mixkit.co/videos/{i}/{i}-']
    for q in (2160, 1080, 720):
        for b in bases:
            try: data = get(f'{b}{q}.mp4'); url = f'{b}{q}.mp4'; break
            except Exception: continue
        if data: break
    if not data: print('FAIL', slug); continue
    open(dst, 'wb').write(data)
    json.dump({'source_page': r['url'], 'asset_url': url, 'title': r['title'], 'licence': 'Mixkit Stock Video Free License (item page data-license="videoFree")',
               'licence_url': 'https://mixkit.co/license/#videoFree', 'attribution': 'Not required; credit "Mixkit" given on screen', 'downloaded': time.strftime('%Y-%m-%d'), 'resolution_tag': q},
              open(dst[:-4] + '.json', 'w'), indent=1)
    print('ok', q, slug, len(data) // 1024, 'KB', flush=True); time.sleep(0.5)
