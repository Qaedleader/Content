"""Print the licence of Mixkit items (by id, from review/mk_*.json) without downloading. Usage: python -I check_mixkit.py id ..."""
import sys, json, os, re, urllib.request
REV = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'review'); idx = {}
for f in os.listdir(REV):
    if f.startswith('mk_') and f.endswith('.json'):
        for r in json.load(open(os.path.join(REV, f), encoding='utf-8')): idx[r['id']] = r
for a in sys.argv[1:]:
    r = idx.get(int(a))
    if not r: print(a, 'unknown'); continue
    p = urllib.request.urlopen(urllib.request.Request(r['url'], headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read().decode('utf-8', 'ignore')
    print(a, re.findall(r'data-license="([a-zA-Z]+)"', p), r['title'], flush=True)
