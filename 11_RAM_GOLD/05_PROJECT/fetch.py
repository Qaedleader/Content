"""Download picked Commons files (+ licence sidecar JSON). Images: max 4000 px wide rendition; videos: 1080p VP9 transcode if offered, else original."""
import json, os, re, sys, time, urllib.parse, urllib.request
sys.stdout.reconfigure(encoding='utf-8')
UA = 'RamGoldReel/1.0 (editorial documentary; contact YOUR_CONTACT_EMAIL) python-urllib'
RAW = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'raw', 'commons'))
os.makedirs(RAW, exist_ok=True)
def get(url):
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=300) as r: return r.read()
        except Exception as e:
            if i == 3: raise
            time.sleep(6)
def api(**p):
    p['format'] = 'json'; return json.loads(get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(p)))
picks = json.load(open('picks.json', encoding='utf-8'))
clean = lambda s: re.sub('<[^>]+>', '', s or '').strip()
for o in picks:
    t = o['title']
    safe = re.sub(r'[^\w.\-]+', '_', t[5:])[:90]
    dst = os.path.join(RAW, f"{o['set']}_{o['i']:02d}_{safe}")
    if os.path.exists(dst + '.json'): continue
    d = api(action='query', titles=t, prop='imageinfo|videoinfo', iiprop='url|size|extmetadata|mime', iiurlwidth=4000, viprop='derivatives', )
    p = list(d['query']['pages'].values())[0]; ii = p['imageinfo'][0]; em = ii['extmetadata']
    mime = ii.get('mime', '')
    url = ii['url']
    if mime.startswith('video') or t.lower().endswith(('.webm', '.ogv')):
        ders = p.get('videoinfo', [{}])[0].get('derivatives', [])
        c = [x for x in ders if x.get('transcodekey') in ('1080p.vp9.webm', '1080p.webm')]
        if c: url = c[0]['src']
    elif not t.lower().endswith('.svg') and ii.get('width', 0) > 4000:
        url = ii['thumburl']
    ext = os.path.splitext(urllib.parse.urlparse(url).path)[1] or os.path.splitext(t)[1]
    data = get(url)
    open(dst + ext, 'wb').write(data)
    side = {'title': t, 'page': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(t.replace(' ', '_')), 'download_url': url,
            'artist': clean(em.get('Artist', {}).get('value')), 'credit': clean(em.get('Credit', {}).get('value')),
            'license': clean(em.get('LicenseShortName', {}).get('value')), 'license_url': clean(em.get('LicenseUrl', {}).get('value')),
            'attribution_required': clean(em.get('AttributionRequired', {}).get('value')), 'orig_size': [ii.get('width'), ii.get('height')], 'bytes': len(data)}
    json.dump(side, open(dst + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"{o['set']}_{o['i']:02d} {side['license']} | {side['artist'][:50]} | {len(data)//1024} KB{ext}", flush=True)
    time.sleep(1)
