"""Cut + reframe supplied footage into 1080x1920 30 fps intermediates (no stretching).
Reads footage_plan.json:
 { "A1a": {"src": "footage_in/roadster_event.mp4", "tc_in": "06:12.40", "dur": 2.0,
           "mode": "crop" | "fit_blur", "cx": 0.5 | [[0,0.45],[2.0,0.55]], "cy": 0.5, "zoom": 1.0, "speed": 1.0,
           "credit": "Tesla — Roadster Event, 15 Oct 2026"} , ... }
Writes renders/footage/<slot>.mp4 and footage_map.json used by render.py."""
import json, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
plan = json.load(open(os.path.join(ROOT, 'footage_plan.json')))
os.makedirs(os.path.join(ROOT, 'renders', 'footage'), exist_ok=True)

def tc(s):
    if isinstance(s, (int, float)): return float(s)
    p = [float(x) for x in s.split(':')]; v = 0.0
    for x in p: v = v * 60 + x
    return v

def cx_expr(cx, dur):
    if isinstance(cx, (int, float)): return str(cx)
    # piecewise-linear keyframes over output time t (seconds)
    e = str(cx[-1][1])
    for (t0, v0), (t1, v1) in reversed(list(zip(cx[:-1], cx[1:]))):
        e = f"if(lt(t,{t1}),{v0}+({v1}-{v0})*(t-{t0})/({t1}-{t0}),{e})"
    return f"if(lt(t,{cx[0][0]}),{cx[0][1]},{e})"

fmap = {}
for slot, m in plan.items():
    src = os.path.join(ROOT, m['src']); out = os.path.join('renders', 'footage', f'{slot}.mp4')
    speed = m.get('speed', 1.0); dur = m['dur']
    zoom = m.get('zoom', 1.0); mode = m.get('mode', 'crop')
    pre = f"setpts=(PTS-STARTPTS)/{speed},fps=30"
    if mode == 'crop':
        cw = f"min(iw,ih*9/16/{zoom})"; ch = f"min(ih,iw*16/9/{zoom})"
        x = f"({cx_expr(m.get('cx', 0.5), dur)})*iw-{cw}/2"
        y = f"{m.get('cy', 0.5)}*ih-{ch}/2"
        vf = (f"{pre},crop=w='{cw}':h='{ch}':x='max(0,min(iw-{cw},{x}))':y='max(0,min(ih-{ch},{y}))':exact=1,"
              f"scale=1080:1920:flags=lanczos,setsar=1")
        fc = ['-vf', vf]
    else:  # fit_blur: full 16:9 frame enlarged, over a blurred cover of itself (designed background, not letterbox bars)
        fz = m.get('fit_zoom', 1.35)
        vf = (f"[0:v]{pre},split[a][b];"
              f"[a]scale=-2:1920:flags=bicubic,crop=1080:1920,boxblur=40:2,eq=brightness=-0.12:saturation=0.8[bg];"
              f"[b]scale={int(1080*fz)}:-2:flags=lanczos,crop=1080:ih[fg];"
              f"[bg][fg]overlay=(W-w)/2:(H-h)/2*{m.get('fy', 1.0)},setsar=1")
        fc = ['-filter_complex', vf]
    cmd = ['ffmpeg', '-y', '-v', 'error', '-ss', str(tc(m['tc_in'])), '-t', str(dur / speed + 0.5), '-i', src] + fc + \
          ['-t', str(dur + 0.2), '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '10', '-g', '1', '-pix_fmt', 'yuv420p', out]
    print(slot, ' '.join(cmd[:8]), '...', flush=True)
    subprocess.run(cmd, check=True)
    entry = {'file': out, 'in': 0.0, 'credit': m.get('credit', '')}
    if 'freeze' in m: entry['freeze'] = m['freeze']
    fmap[slot] = entry
for slot, m in plan.items():
    if 'freeze_of' in m: pass
json.dump(fmap, open(os.path.join(ROOT, 'footage_map.json'), 'w'), ensure_ascii=False, indent=1)
print('footage_map.json written:', len(fmap), 'slots')
