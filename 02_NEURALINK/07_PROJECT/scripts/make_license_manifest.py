"""Builds 02_NEURALINK/LICENSES.md from the *.source.json provenance sidecars written by fetch_media.py,
marking which assets are used in the final edit (scanned from scenes.py)."""
import os, json, glob, re, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); NL = os.path.dirname(ROOT)
SRC = json.load(open(os.path.join(ROOT, 'media_sources.json'), encoding='utf-8'))
code = open(os.path.join(ROOT, 'scripts', 'nl', 'scenes.py'), encoding='utf-8').read()
used = {k for k in SRC if re.search(r"['\"]" + re.escape(k) + r"['\"]", code)}

def clean(s):
    s = re.sub(r'<[^>]+>', '', s or ''); return html.unescape(s).strip().replace('\n', ' ').replace('|', '/')[:140]

rows = []
for k, e in SRC.items():
    p = os.path.join(NL, e['dest']) + '.source.json'
    if not os.path.exists(p): continue
    m = json.load(open(p, encoding='utf-8'))
    rows.append((k in used, e['src'], k, e['dest'], m))

out = ['# Media sources & licences — NEURALINK reel', '',
       'Built automatically from the provenance sidecar files (`*.source.json`) saved next to every downloaded file. '
       'The licence for each Wikimedia Commons file was taken from the Commons API (`extmetadata`) when it was downloaded. '
       'For Pexels files the licence is the Pexels License (https://www.pexels.com/license/).', '',
       '**Not used:** no official Neuralink photos, renders or videos. Neuralink\'s website terms of use (last updated 25 Oct 2022) '
       'forbid reproducing its site media, and Neuralink publishes no press kit with media terms. All Neuralink-related '
       'photos come from third-party photographers on Wikimedia Commons, under free licences.', '']
for used_flag, title in ((True, 'Used in the final video'), (False, 'Downloaded for review, not used')):
    out += [f'## {title}', '', '| Key | File | What it shows | Licence | Author / credit | Source page | SHA-256 (first 16) |', '|---|---|---|---|---|---|---|']
    for u, src, k, dest, m in sorted(rows, key=lambda r: (r[1], r[2])):
        if u != used_flag: continue
        out.append(f"| {k} | `{dest}` | {clean(m.get('what'))} | {clean(m.get('licence'))} | {clean(m.get('author'))} | {m.get('page')} | {m.get('sha256', '')[:16]} |")
    out.append('')
out += ['## 3D source data', '',
        '| Asset | Licence | Attribution |', '|---|---|---|',
        '| BodyParts3D brain + skull meshes (`05_3D_AND_GRAPHICS/source_models/bodyparts3d/`) | CC BY 4.0 | "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International" — https://dbarchive.biosciencedbc.jp/en/bodyparts3d/ |',
        '| Implant disc, threads, neuron forest, materials, lighting, camera moves | Original work for this production | — |', '',
        '## Fonts (SIL Open Font License 1.1)', '', 'Alexandria, Amiri, Noto Naskh Arabic, JetBrains Mono — from github.com/google/fonts. The licence texts are in `05_3D_AND_GRAPHICS/fonts/`.', '',
        '## Music & sound', '', 'All of it is original, synthesised by `07_PROJECT/scripts/audio_design.py`. No third-party music or samples were used.', '',
        '## Notes on use', '',
        '- **CC BY-SA files** (for example the Neuralink robot photo, the neuron micrograph and the DBS render): the credit is shown on screen. The video is a composite work, and anyone reusing those images on their own must keep the same licence.',
        '- **Identifiable people:**',
        '  - Elon Musk appears in event photos by Steve Jurvetson, CC BY 2.0.',
        '  - Noland Arbaugh appears in a CC BY 3.0 still.',
        '  - The University of Pittsburgh study participant appears in a CC BY 2.5 PLoS ONE video.',
        '  - Each is shown factually, and none implies endorsement.',
        '- **Pexels clips** are used as illustration and carry the "تصوّر مستقبلي" label in speculative scenes. They do not show Neuralink participants.']
open(os.path.join(NL, 'LICENSES.md'), 'w', encoding='utf-8').write('\n'.join(out))
print('used', len(used), 'of', len(SRC))
