# Camera choreography + rendering for the anatomy shots (opens anatomy.blend).
# blender -b anatomy.blend -P shots.py -- <shot> <out_dir> [first last] [scale%]
# Shots (30 fps, frame 1 = first frame of the shot):
#   A  reveal  : lateral skull -> glass skull -> brain -> implant settles above left motor cortex   (51 f)
#   B  threads : close grazing view, 64 threads extend from the implant into the cortex             (38 f)
#   D  write   : wide 3/4 view, a cool wave spreads outwards from the implant site (future stimulation) (45 f)
import bpy, sys, os, math, mathutils
argv = sys.argv[sys.argv.index('--') + 1:]
shot, out_dir = argv[0], argv[1]
first = int(argv[2]) if len(argv) > 2 else None
last = int(argv[3]) if len(argv) > 3 else None
scale = int(argv[4]) if len(argv) > 4 else 100
V = mathutils.Vector
scn = bpy.context.scene; D = bpy.data
brain, skull, imp = D.objects['Brain'], D.objects['Skull'], D.objects['Implant']
threads = [o for o in D.objects if o.name.startswith('Thread')]
site = D.objects['MotorSite'].location.copy(); up = (D.objects['SkullUp'].location - site).normalized()
head = D.objects['HeadCenter'].location.copy(); bc = D.objects['BrainCenter'].location.copy()
imp_home = imp.location.copy()
for o in (brain, skull):  # render-time subdivision exhausts RAM on this 8 GB machine; meshes are ~160k verts already
    for m in o.modifiers:
        if m.type == 'SUBSURF': m.render_levels = 0
side = V((1, 0, 0)).cross(up).normalized()  # roughly antero-posterior tangent
lat = up.cross(side).normalized()           # lateral tangent

# ---------- render settings ----------
r = scn.render; r.engine = 'BLENDER_EEVEE_NEXT'
r.resolution_x, r.resolution_y, r.resolution_percentage = 1080, 1920, scale
r.film_transparent = True; r.fps = 30
r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGBA'; r.image_settings.color_depth = '8'
e = scn.eevee; e.taa_render_samples = 24
try: e.use_shadows = True
except Exception: pass
scn.view_settings.view_transform = 'AgX'; scn.view_settings.look = 'AgX - Medium High Contrast'
w = D.worlds.new('w'); scn.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.035, 0.045, 0.085, 1)
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 1.0
# vertical gradient world (only reflections/ambient — film is transparent): dark horizon, soft grey 'sky' for metal
wn, wl = w.node_tree.nodes, w.node_tree.links
tco = wn.new('ShaderNodeTexCoord'); sep = wn.new('ShaderNodeSeparateXYZ'); wl.new(tco.outputs['Generated'], sep.inputs[0])
wr = wn.new('ShaderNodeValToRGB'); wr.color_ramp.elements[0].position = 0.45; wr.color_ramp.elements[0].color = (0.02, 0.022, 0.035, 1)
wr.color_ramp.elements[1].position = 0.95; wr.color_ramp.elements[1].color = (0.55, 0.56, 0.60, 1)
wl.new(sep.outputs['Z'], wr.inputs['Fac']); wl.new(wr.outputs['Color'], wn['Background'].inputs['Color'])

def area(name, loc, target, energy, color, size):
    L = D.lights.new(name, 'AREA'); L.energy = energy; L.color = color; L.size = size; L.shape = 'DISK'
    o = D.objects.new(name, L); scn.collection.objects.link(o); o.location = loc
    o.rotation_euler = (V(target) - V(loc)).to_track_quat('-Z', 'Y').to_euler(); return o
# key: soft warm-neutral from upper front-left; rim: cool violet-blue from behind; fill: low warm bounce
area('key', head + V((260, -420, 430)), head, 1.1e6, (1.0, 0.92, 0.82), 240)
area('rim', head + V((-260, 420, 160)), head, 1.4e6, (0.55, 0.62, 1.0), 220)
area('rim2', head + V((420, 380, -40)), head, 5.0e5, (0.62, 0.50, 1.0), 200)
area('fill', head + V((420, -100, -260)), head, 0.6e5, (1.0, 0.78, 0.62), 300)

cam_d = D.cameras.new('cam'); cam = D.objects.new('cam', cam_d); scn.collection.objects.link(cam); scn.camera = cam
cam_d.clip_start = 1; cam_d.clip_end = 5000; cam_d.sensor_fit = 'VERTICAL'; cam_d.sensor_height = 36
tgt = D.objects.new('tgt', None); scn.collection.objects.link(tgt)
c = cam.constraints.new('TRACK_TO'); c.target = tgt; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'

def ease(x): x = max(0.0, min(1.0, x)); return x * x * (3 - 2 * x)
def key_cam(f, loc, target, lens, fstop=None, focus=None):
    cam.location = loc; cam.keyframe_insert('location', frame=f)
    tgt.location = target; tgt.keyframe_insert('location', frame=f)
    cam_d.lens = lens; cam_d.keyframe_insert('lens', frame=f)
    if fstop:
        cam_d.dof.use_dof = True; cam_d.dof.aperture_fstop = fstop; cam_d.dof.keyframe_insert('aperture_fstop', frame=f)
        cam_d.dof.focus_distance = focus if focus else (V(loc) - V(target)).length; cam_d.dof.keyframe_insert('focus_distance', frame=f)

def node(mat, name): return D.materials[mat].node_tree.nodes[name].outputs[0]
def key_val(mat, name, f, v):
    s = node(mat, name); s.default_value = v; s.keyframe_insert('default_value', frame=f)
def set_color(mat, name, rgb): D.materials[mat].node_tree.nodes[name].outputs[0].default_value = (*rgb, 1)
def thread_grow(f0, f1, stagger=0.5):
    for i, o in enumerate(sorted(threads, key=lambda o: o.name)):
        s = f0 + (f1 - f0) * stagger * (i % 16) / 16.0
        o.data.bevel_factor_end = 0.0; o.data.keyframe_insert('bevel_factor_end', frame=int(s))
        o.data.bevel_factor_end = 1.0; o.data.keyframe_insert('bevel_factor_end', frame=int(s + (f1 - f0) * (1 - stagger)))
def threads_visible(v):
    for o in threads: o.hide_render = not v

if shot == 'A':
    n = 51; scn.frame_start, scn.frame_end = 1, n
    threads_visible(False)
    p0 = head + V((700, 10, 40)); t0 = head + V((0, 0, 8))
    p1 = head + V((470, -170, 360)); t1 = (head + site) / 2
    p2 = site + up * 170 + lat * 120 - side * 90; t2 = site
    key_cam(1, p0, t0, 50); key_cam(24, p1, t1, 50); key_cam(n, p2, t2, 55)
    key_val('Bone', 'glass', 1, 0.0); key_val('Bone', 'glass', 7, 0.0); key_val('Bone', 'glass', 26, 1.0)
    imp.scale = (0, 0, 0); imp.keyframe_insert('scale', frame=18)
    imp.scale = (1, 1, 1); imp.keyframe_insert('scale', frame=27)
    imp.location = imp_home + up * 70; imp.keyframe_insert('location', frame=18)
    imp.location = imp_home + up * 55; imp.keyframe_insert('location', frame=24)
    imp.location = imp_home + up * 6; imp.keyframe_insert('location', frame=44)
    imp.location = imp_home; imp.keyframe_insert('location', frame=n)
    key_val('Cortex', 'ripple_gain', 1, 0.0); key_val('Cortex', 'ripple_gain', 46, 0.0); key_val('Cortex', 'ripple_gain', n, 2.4)
    key_val('Cortex', 'ripple_r', 46, 10.0); key_val('Cortex', 'ripple_r', n, 22.0)
elif shot == 'B':
    n = 38; scn.frame_start, scn.frame_end = 1, n
    threads_visible(True); thread_grow(3, 30, stagger=0.55)
    skull.hide_render = True
    imp.location = imp_home + up * 14.0  # exploded view (illustrative)
    tg = site + up * 6
    p0 = site + lat * 92 - side * 26 + up * 12; p1 = site + lat * 66 - side * 16 + up * 9
    key_cam(1, p0, tg, 50, fstop=3.5); key_cam(n, p1, tg, 50, fstop=3.5)
    key_val('Cortex', 'ripple_gain', 1, 0.0); key_val('Cortex', 'ripple_gain', 22, 0.0); key_val('Cortex', 'ripple_gain', 27, 2.2); key_val('Cortex', 'ripple_gain', n, 1.2)
    key_val('Cortex', 'ripple_r', 22, 4.0); key_val('Cortex', 'ripple_r', n, 30.0)
elif shot == 'D':
    n = 45; scn.frame_start, scn.frame_end = 1, n
    threads_visible(False)
    key_val('Bone', 'glass', 1, 1.0)
    set_color('Cortex', 'ripple_col', (0.30, 0.72, 1.0))
    p0 = bc + V((300, -330, 250)); p1 = bc + V((240, -290, 215))
    key_cam(1, p0, bc + V((0, 0, 20)), 50); key_cam(n, p1, bc + V((5, 5, 25)), 50)
    key_val('Cortex', 'ripple_gain', 1, 1.6); key_val('Cortex', 'ripple_gain', n, 1.0)
    key_val('Cortex', 'ripple_r', 1, 0.0); key_val('Cortex', 'ripple_r', n, 120.0)
else:
    raise SystemExit('unknown shot ' + shot)

for fc in (scn.animation_data_create(),):
    pass
# smooth (bezier/auto-clamped) interpolation is Blender's default; make camera moves ease
os.makedirs(out_dir, exist_ok=True)
f0 = first or scn.frame_start; f1 = last or scn.frame_end  # 0 0 = whole shot
import time
for f in range(f0, f1 + 1):
    scn.frame_set(f); r.filepath = os.path.join(out_dir, f'{shot}_{f:03d}.png')
    t = time.time(); bpy.ops.render.render(write_still=True)
    print(f'FRAME {shot} {f} {time.time() - t:.1f}s', flush=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(os.path.dirname(os.path.abspath(bpy.data.filepath)), f'shot_{shot}.blend'), copy=True)
