"""Download licensed media listed in media_sources.json and record provenance.
- Wikimedia Commons: URL + licence are taken live from the Commons API (extmetadata) and saved next to the file.
- Pexels: official download endpoint; licence = Pexels License.
Every file gets a sidecar <name>.source.json (page, url, licence, author, sha256, fetched-at).
Usage: python fetch_media.py [key ...]   (no keys = everything not yet downloaded)"""
import os, sys, json, hashlib, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NL = os.path.dirname(ROOT)
UA = 'NeuralinkReelProduction/1.0 (editorial documentary; contact YOUR_CONTACT_EMAIL) python-urllib'
SRC = json.load(open(os.path.join(ROOT, 'media_sources.json'), encoding='utf-8'))

def get(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*'})
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read(), r.geturl()
        except Exception as e:
            if i == tries - 1: raise
            time.sleep(3 + 5 * i)

def commons_info(fname):
    q = urllib.parse.urlencode({'action': 'query', 'titles': 'File:' + fname, 'prop': 'imageinfo',
                                'iiprop': 'url|size|extmetadata|mime', 'format': 'json'})
    d = json.loads(get('https://commons.wikimedia.org/w/api.php?' + q)[0])
    page = next(iter(d['query']['pages'].values()))
    ii = page['imageinfo'][0]; em = ii.get('extmetadata', {})
    val = lambda k: (em.get(k) or {}).get('value')
    return {'page': ii.get('descriptionurl'), 'url': ii['url'], 'width': ii.get('width'), 'height': ii.get('height'),
            'mime': ii.get('mime'), 'licence': val('LicenseShortName'), 'licence_url': val('LicenseUrl'),
            'author': val('Artist'), 'credit': val('Credit'), 'attribution_required': val('AttributionRequired'),
            'usage_terms': val('UsageTerms'), 'description': val('ImageDescription')}

keys = sys.argv[1:] or list(SRC)
for k in keys:
    e = SRC[k]; dest = os.path.join(NL, e['dest']); os.makedirs(os.path.dirname(dest), exist_ok=True)
    if os.path.exists(dest) and os.path.exists(dest + '.source.json'):
        continue
    try:
        if e['src'] == 'commons':
            meta = commons_info(e['file']); url = meta['url']
        else:  # pexels
            url = e['url']; meta = {'page': e['page'], 'url': url, 'licence': 'Pexels License',
                                    'licence_url': 'https://www.pexels.com/license/', 'author': e.get('author')}
        data, final = get(url)
        if len(data) < 5000 or data[:15].lower().startswith(b'<!doctype html'):
            raise RuntimeError(f'not a media file ({len(data)} bytes)')
        open(dest, 'wb').write(data)
        meta.update({'key': k, 'what': e.get('what'), 'final_url': final, 'bytes': len(data),
                     'sha256': hashlib.sha256(data).hexdigest(), 'fetched': time.strftime('%Y-%m-%dT%H:%M:%S')})
        json.dump(meta, open(dest + '.source.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(f'OK   {k:28s} {len(data)/1e6:7.2f} MB  {meta.get("licence")}', flush=True)
    except Exception as ex:
        print(f'FAIL {k:28s} {ex}', flush=True)
    time.sleep(1.0)
