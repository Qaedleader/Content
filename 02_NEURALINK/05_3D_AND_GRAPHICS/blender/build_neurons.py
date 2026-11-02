# Procedural cortical "neuron forest" + recording thread (illustrative, not anatomical data).
# Builds neurons.blend and (optionally) renders shot C: slow dolly, action potentials travel outward from each soma,
# contacts on the recording thread flicker when activity passes.
# blender -b --factory-startup -P build_neurons.py -- <out_dir|-> [scale%] [first last]
import bpy, sys, os, math, random, mathutils
V = mathutils.Vector
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['-']
out_dir = argv[0]; scale = int(argv[1]) if len(argv) > 1 else 80
first = int(argv[2]) if len(argv) > 2 else 1; last = int(argv[3]) if len(argv) > 3 else 60
HERE = os.path.dirname(os.path.abspath(__file__))
random.seed(11)
bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene; D = bpy.data
N_FRAMES = 60

def mat_neuron():
    m = D.materials.new('Neuron'); m.use_nodes = True; nt = m.node_tree; n, l = nt.nodes, nt.links
    b = n['Principled BSDF']
    b.inputs['Base Color'].default_value = (0.42, 0.38, 0.40, 1); b.inputs['Roughness'].default_value = 0.55
    b.inputs['Subsurface Weight'].default_value = 0.6; b.inputs['Subsurface Radius'].default_value = (1.0, 0.6, 0.45)
    b.inputs['Subsurface Scale'].default_value = 3.0; b.inputs['Coat Weight'].default_value = 0.0
    b.inputs['Specular IOR Level'].default_value = 0.25
    # pulse ring: d = |object coord| ; phase = fract(time*speed + rand) ; emission = gain*exp(-((d - phase*L)/w)^2)
    tc = n.new('ShaderNodeTexCoord'); ln = n.new('ShaderNodeVectorMath'); ln.operation = 'LENGTH'
    l.new(tc.outputs['Object'], ln.inputs[0])
    oi = n.new('ShaderNodeObjectInfo')
    tm = n.new('ShaderNodeValue'); tm.name = 'time'
    sp = n.new('ShaderNodeMath'); sp.operation = 'MULTIPLY'; sp.inputs[1].default_value = 1.6; l.new(tm.outputs[0], sp.inputs[0])
    ad = n.new('ShaderNodeMath'); ad.operation = 'ADD'; l.new(sp.outputs[0], ad.inputs[0]); l.new(oi.outputs['Random'], ad.inputs[1])
    fr = n.new('ShaderNodeMath'); fr.operation = 'FRACT'; l.new(ad.outputs[0], fr.inputs[0])
    rr = n.new('ShaderNodeMath'); rr.operation = 'MULTIPLY'; rr.inputs[1].default_value = 260.0; l.new(fr.outputs[0], rr.inputs[0])
    df = n.new('ShaderNodeMath'); df.operation = 'SUBTRACT'; l.new(ln.outputs['Value'], df.inputs[0]); l.new(rr.outputs[0], df.inputs[1])
    dv = n.new('ShaderNodeMath'); dv.operation = 'DIVIDE'; dv.inputs[1].default_value = 7.0; l.new(df.outputs[0], dv.inputs[0])
    sq = n.new('ShaderNodeMath'); sq.operation = 'MULTIPLY'; l.new(dv.outputs[0], sq.inputs[0]); l.new(dv.outputs[0], sq.inputs[1])
    ng = n.new('ShaderNodeMath'); ng.operation = 'MULTIPLY'; ng.inputs[1].default_value = -1.0; l.new(sq.outputs[0], ng.inputs[0])
    ex = n.new('ShaderNodeMath'); ex.operation = 'EXPONENT'; l.new(ng.outputs[0], ex.inputs[0])
    gn = n.new('ShaderNodeMath'); gn.operation = 'MULTIPLY'; gn.inputs[1].default_value = 7.0; l.new(ex.outputs[0], gn.inputs[0])
    b.inputs['Emission Color'].default_value = (1.0, 0.42, 0.10, 1)
    l.new(gn.outputs[0], b.inputs['Emission Strength'])
    # depth fog: far geometry dissolves into the ink-navy backdrop
    cam = n.new('ShaderNodeCameraData'); fogr = n.new('ShaderNodeMapRange')
    fogr.inputs['From Min'].default_value = 260; fogr.inputs['From Max'].default_value = 820
    l.new(cam.outputs['View Distance'], fogr.inputs['Value'])
    em = n.new('ShaderNodeEmission'); em.inputs['Color'].default_value = (0.018, 0.022, 0.05, 1); em.inputs['Strength'].default_value = 1.0
    mx = n.new('ShaderNodeMixShader'); l.new(fogr.outputs['Result'], mx.inputs['Fac'])
    l.new(b.outputs['BSDF'], mx.inputs[1]); l.new(em.outputs['Emission'], mx.inputs[2])
    l.new(mx.outputs['Shader'], n['Material Output'].inputs['Surface'])
    tm.outputs[0].default_value = 0.0; tm.outputs[0].keyframe_insert('default_value', frame=1)
    tm.outputs[0].default_value = N_FRAMES / 30.0; tm.outputs[0].keyframe_insert('default_value', frame=N_FRAMES + 1)
    for fc in nt.animation_data.action.fcurves:
        for k in fc.keyframe_points: k.interpolation = 'LINEAR'
    return m

def mat_simple(name, col, rough, metal=0.0, emis=None, strength=0.0):
    m = D.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if emis: b.inputs['Emission Color'].default_value = (*emis, 1); b.inputs['Emission Strength'].default_value = strength
    return m

NEU = mat_neuron()

def curve_obj(name, pts, r0, r1, parent_loc):
    cu = D.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 1.0; cu.bevel_resolution = 3; cu.use_fill_caps = True
    sp = cu.splines.new('NURBS'); sp.points.add(len(pts) - 1); sp.use_endpoint_u = True; sp.order_u = 3
    for i, p in enumerate(pts):
        q = p - parent_loc; sp.points[i].co = (q.x, q.y, q.z, 1)
        sp.points[i].radius = r0 + (r1 - r0) * i / (len(pts) - 1)
    return cu

def branch(start, direction, length, r0, depth, out):
    pts = [start]; d = direction.normalized(); p = start
    steps = 6
    for i in range(steps):
        d = (d + V((random.gauss(0, .28), random.gauss(0, .28), random.gauss(0, .28)))).normalized()
        p = p + d * (length / steps); pts.append(p)
    out.append((pts, r0, r0 * 0.25))
    if depth > 0:
        for _ in range(random.randint(1, 2)):
            k = random.randint(2, steps - 1)
            nd = (d + V((random.gauss(0, .8), random.gauss(0, .8), random.gauss(0, .5)))).normalized()
            branch(pts[k], nd, length * random.uniform(0.45, 0.7), r0 * 0.55, depth - 1, out)

def neuron(loc, size, tilt):
    """Pyramidal-like neuron: teardrop soma, apical dendrite up, basal dendrites, thin axon down. Origin = soma."""
    up = V((random.gauss(0, tilt), random.gauss(0, tilt), 1)).normalized()
    parts = []
    branch(loc + up * size * 0.9, up, size * 9, size * 0.42, 2, parts)                      # apical
    for _ in range(5):                                                                         # basal
        dd = V((random.gauss(0, 1), random.gauss(0, 1), random.uniform(-0.7, 0.1))).normalized()
        branch(loc + dd * size * 0.7, dd, size * random.uniform(3.5, 5.5), size * 0.28, 1, parts)
    ax = []; branch(loc - up * size * 0.9, -up, size * 12, size * 0.12, 0, ax)                 # axon
    parts += ax
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=size, location=loc)
    soma = bpy.context.active_object; soma.scale = (1, 1, 1.35)
    soma.rotation_euler = up.to_track_quat('Z', 'Y').to_euler(); bpy.ops.object.shade_smooth()
    soma.data.materials.append(NEU); soma.name = 'soma'
    for i, (pts, a, b) in enumerate(parts):
        cu = curve_obj(f'den{i}', pts, a, b, loc); o = D.objects.new(f'den{i}', cu); scn.collection.objects.link(o)
        o.location = loc; o.data.materials.append(NEU)
        o.parent = soma; o.matrix_parent_inverse = soma.matrix_world.inverted()
    return soma

somas = []
for i in range(16):
    loc = V((random.uniform(-260, 260), random.uniform(-80, 520), random.uniform(-200, 160)))
    s = neuron(loc, random.uniform(9, 14), 0.25)
    somas.append(s)
# all parts of a neuron share the soma's Object Info random via parenting? (no: random is per object) -> copy pass_index
# Use the soma location as each child's origin so 'Object' coords measure distance from the soma.

# recording thread with contacts (illustrative): passes diagonally through the scene
th_pts = [V((-420, 380, 420)), V((-150, 260, 160)), V((40, 200, -20)), V((180, 160, -240))]
cu = D.curves.new('thread', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 2.2; cu.bevel_resolution = 4
sp = cu.splines.new('NURBS'); sp.points.add(len(th_pts) - 1); sp.use_endpoint_u = True; sp.order_u = 3
for i, p in enumerate(th_pts): sp.points[i].co = (*p, 1)
th = D.objects.new('Thread', cu); scn.collection.objects.link(th)
th.data.materials.append(mat_simple('ThreadMat', (0.92, 0.82, 0.62), 0.25, 0.2))
contact_mat = mat_simple('Contact', (0.9, 0.9, 0.95), 0.2, 1.0, (1.0, 0.65, 0.3), 0.0)
cs = []
for i in range(9):
    t = 0.18 + 0.07 * i
    # approximate point on the NURBS by sampling the evaluated curve later -> use linear blend of control points
    seg = t * (len(th_pts) - 1); k = min(int(seg), len(th_pts) - 2); f = seg - k
    p = th_pts[k].lerp(th_pts[k + 1], f)
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=3.2, depth=1.2, location=p)
    c = bpy.context.active_object; c.name = f'contact{i}'
    c.rotation_euler = (th_pts[k + 1] - th_pts[k]).to_track_quat('Z', 'Y').to_euler()
    m = contact_mat.copy(); c.data.materials.append(m); cs.append((c, m))
    b = m.node_tree.nodes['Principled BSDF'].inputs['Emission Strength']
    for f_ in range(1, N_FRAMES + 1, 3):
        b.default_value = 12.0 if random.random() < 0.22 else 0.0
        b.keyframe_insert('default_value', frame=f_)

# lights / world / camera
w = D.worlds.new('w'); scn.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.02, 0.022, 0.04, 1)
def area(name, loc, target, energy, color, size):
    L = D.lights.new(name, 'AREA'); L.energy = energy; L.color = color; L.size = size
    o = D.objects.new(name, L); scn.collection.objects.link(o); o.location = loc
    o.rotation_euler = (V(target) - V(loc)).to_track_quat('-Z', 'Y').to_euler()
area('key', (500, -300, 500), (0, 200, 0), 6e6, (1.0, 0.9, 0.8), 400)
area('rim', (-500, 900, 200), (0, 200, 0), 9e6, (0.55, 0.55, 1.0), 400)
area('under', (0, 100, -700), (0, 200, 0), 1.5e6, (0.6, 0.45, 1.0), 500)
cd = D.cameras.new('cam'); cam = D.objects.new('cam', cd); scn.collection.objects.link(cam); scn.camera = cam
cd.sensor_fit = 'VERTICAL'; cd.sensor_height = 36; cd.clip_start = 1; cd.clip_end = 20000; cd.lens = 40
cd.dof.use_dof = True; cd.dof.aperture_fstop = 0.06   # scene is modelled at ~100x scale
tgt = D.objects.new('tgt', None); scn.collection.objects.link(tgt)
c = cam.constraints.new('TRACK_TO'); c.target = tgt; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
cd.dof.focus_object = tgt
for f, loc, t in ((1, (-40, -360, 30), (20, 120, 10)), (N_FRAMES, (0, -150, 15), (30, 160, 0))):
    cam.location = loc; cam.keyframe_insert('location', frame=f); tgt.location = t; tgt.keyframe_insert('location', frame=f)

r = scn.render; r.engine = 'BLENDER_EEVEE_NEXT'; r.resolution_x, r.resolution_y, r.resolution_percentage = 1080, 1920, scale
r.film_transparent = True; r.fps = 30; scn.eevee.taa_render_samples = 24
r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGBA'
scn.view_settings.view_transform = 'Standard'; scn.view_settings.look = 'Medium High Contrast'
scn.frame_start, scn.frame_end = 1, N_FRAMES
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, 'neurons.blend'))
print('SAVED neurons.blend', len(D.objects), 'objects')
if out_dir != '-':
    import time
    os.makedirs(out_dir, exist_ok=True)
    for f in range(first, last + 1):
        scn.frame_set(f); r.filepath = os.path.join(out_dir, f'C_{f:03d}.png'); t = time.time()
        bpy.ops.render.render(write_still=True); print(f'FRAME C {f} {time.time() - t:.1f}s', flush=True)
