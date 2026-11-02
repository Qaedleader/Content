"""Download Wikimedia Commons media listed in media_candidates.json and record provenance.
Licence, author and URLs are read live from the Commons API (extmetadata) and saved in a sidecar
<file>.source.json next to each download. Videos use Commons' own 1080p (or best <=1080p) transcode.
Usage: python fetch_commons.py [key ...]"""
import os, sys, json, hashlib, time, urllib.parse, urllib.request
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))          # 03_MEDIA
UA = 'NeuralinkRemake/1.0 (editorial documentary; contact YOUR_CONTACT_EMAIL) python-urllib'
SRC = json.load(open(os.path.join(HERE, 'media_candidates.json'), encoding='utf-8'))

def get(url, tries=3):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=300) as r:
                return r.read(), r.geturl()
        except Exception:
            if i == tries - 1: raise
            time.sleep(4 + 6 * i)

def api(**p):
    p['format'] = 'json'
    return json.loads(get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(p))[0])

def resolve(e):
    if e.get('file'): return 'File:' + e['file']
    d = api(action='query', list='search', srsearch=e['q'], srnamespace=6, srlimit=1)
    return d['query']['search'][0]['title']

def info(title):
    d = api(action='query', titles=title, prop='imageinfo|videoinfo', iiprop='url|size|extmetadata|mime',
            viprop='derivatives|url|size')
    page = next(iter(d['query']['pages'].values()))
    ii = page['imageinfo'][0]; em = ii.get('extmetadata', {})
    val = lambda k: (em.get(k) or {}).get('value')
    meta = {'title': title, 'page': ii.get('descriptionurl'), 'original_url': ii['url'], 'width': ii.get('width'),
            'height': ii.get('height'), 'mime': ii.get('mime'), 'licence': val('LicenseShortName'),
            'licence_url': val('LicenseUrl'), 'author': val('Artist'), 'credit': val('Credit'),
            'attribution_required': val('AttributionRequired'), 'description': (val('ImageDescription') or '')[:600]}
    url = ii['url']
    vi = (page.get('videoinfo') or [{}])[0]
    ders = [x for x in vi.get('derivatives', []) if 'webm' in x.get('type', '') or 'mp4' in x.get('type', '')]
    if ders:
        ders = [x for x in ders if x.get('height') and min(x['width'], x['height']) <= 1080] or ders
        best = max(ders, key=lambda x: (x.get('width', 0) * x.get('height', 0)))
        url = best['src']; meta['downloaded_variant'] = f"Commons transcode {best.get('width')}x{best.get('height')}"
    return meta, url

keys = sys.argv[1:] or list(SRC)
for k in keys:
    e = SRC[k]
    try:
        title = resolve(e); meta, url = info(title)
        ext = os.path.splitext(urllib.parse.urlparse(url).path)[1] or '.bin'
        dest = os.path.join(HERE, 'raw', k + ext); os.makedirs(os.path.dirname(dest), exist_ok=True)
        if os.path.exists(dest) and os.path.exists(dest + '.source.json'):
            print('SKIP', k); continue
        data, final = get(url)
        if len(data) < 5000 or data[:15].lower().startswith(b'<!doctype html'):
            raise RuntimeError(f'not a media file ({len(data)} bytes)')
        open(dest, 'wb').write(data)
        meta.update({'key': k, 'intended_use': e.get('use'), 'download_url': final, 'bytes': len(data),
                     'sha256': hashlib.sha256(data).hexdigest(), 'fetched': time.strftime('%Y-%m-%dT%H:%M:%S'),
                     'local_path': dest})
        json.dump(meta, open(dest + '.source.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(f'OK   {k:22s} {len(data)/1e6:7.2f} MB  {meta["licence"]:14s} {title[5:80]}', flush=True)
    except Exception as ex:
        print(f'FAIL {k:22s} {ex}', flush=True)
    time.sleep(1.0)
