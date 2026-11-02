"""List Pexels search results (id, size, duration, author, title) from the public search page's embedded data.
Usage: python pexels_search.py videos|photos "<query>" [portrait|landscape]"""
import sys, re, json, urllib.request, urllib.parse
kind, q = sys.argv[1], sys.argv[2]
ori = sys.argv[3] if len(sys.argv) > 3 else 'portrait'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
url = f"https://www.pexels.com/search/{'videos/' if kind == 'videos' else ''}{urllib.parse.quote(q)}/?orientation={ori}"
html = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read().decode('utf-8', 'ignore')
m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html, re.S)
data = json.loads(m.group(1))
found = []
def walk(o):
    if isinstance(o, dict):
        a = o.get('attributes')
        if isinstance(a, dict) and 'id' in a and ('slug' in a or 'title' in a):
            found.append(a)
        for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
walk(data)
seen = set()
for a in found:
    if a['id'] in seen: continue
    seen.add(a['id'])
    vid = a.get('video') or {}
    print(a['id'], f"{a.get('width')}x{a.get('height')}", vid.get('duration', ''), '|', (a.get('user') or {}).get('first_name', ''), (a.get('user') or {}).get('last_name', '') or '', '|', (a.get('title') or a.get('slug') or '')[:80])
