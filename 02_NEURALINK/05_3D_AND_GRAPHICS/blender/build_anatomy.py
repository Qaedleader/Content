# Builds anatomy.blend: BodyParts3D brain + skull (CC BY 4.0, DBCLS) + illustrative implant.
# Run: blender -b --factory-startup -P build_anatomy.py
# Raw BodyParts3D axes are kept (no axis conversion): X lateral, Y antero-posterior, Z height (mm).
import bpy, os, sys, math, bmesh, mathutils
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(HERE), 'source_models', 'bodyparts3d')
OBJ = os.path.join(SRC, 'obj')

def part_ids(fma):
    ids = []
    for ln in open(os.path.join(SRC, 'partof_element_parts.txt'), encoding='utf-8'):
        p = ln.rstrip('\n').split('\t')
        if p[0] == fma: ids.append(p[2])
    return sorted(set(ids))

BRAIN, SKULL = part_ids('FMA50801'), part_ids('FMA46565')
LEFT_PRECENTRAL = 'FJ1800'

bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene

def imp(ids, name):
    objs = []
    for i in ids:
        bpy.ops.wm.obj_import(filepath=os.path.join(OBJ, i + '.obj'), forward_axis='Y', up_axis='Z')
        o = bpy.context.selected_objects[0]; o.name = i; objs.append(o)
    return objs

def join(objs, name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    if len(objs) > 1: bpy.ops.object.join()
    o = bpy.context.view_layer.objects.active; o.name = name; o.data.name = name
    bpy.ops.object.shade_smooth()
    me = o.data
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.05); bm.to_mesh(me); bm.free()
    return o

brain_parts = imp(BRAIN, 'brain')
motor = [o for o in brain_parts if o.name == LEFT_PRECENTRAL]
motor_c = sum((motor[0].matrix_world @ mathutils.Vector(v.co) for v in motor[0].data.vertices), mathutils.Vector()) / len(motor[0].data.vertices)
# outer surface of the left precentral gyrus ~30-45 mm from the midline (hand-knob neighbourhood)
mv = [motor[0].matrix_world @ v.co for v in motor[0].data.vertices]
band = sorted((p for p in mv if 30 <= p.x <= 45), key=lambda p: -(p.z + 0.6 * p.x))
dorsal = sum(band[:30], mathutils.Vector()) / 30
brain = join(brain_parts, 'Brain')
skull = join(imp(SKULL, 'skull'), 'Skull')

for o in (brain, skull):
    m = o.modifiers.new('subd', 'SUBSURF'); m.levels = 0; m.render_levels = 1  # smooths the low-poly BodyParts3D meshes

def bbox(o):
    pts = [o.matrix_world @ mathutils.Vector(c) for c in o.bound_box]
    return mathutils.Vector([min(p[i] for p in pts) for i in range(3)]), mathutils.Vector([max(p[i] for p in pts) for i in range(3)])
bmn, bmx = bbox(brain); smn, smx = bbox(skull)
print('BRAIN', tuple(map(lambda v: round(v, 1), bmn)), tuple(map(lambda v: round(v, 1), bmx)))
print('SKULL', tuple(map(lambda v: round(v, 1), smn)), tuple(map(lambda v: round(v, 1), smx)))
print('MOTOR_CENTROID', tuple(round(v, 1) for v in motor_c), 'DORSAL', tuple(round(v, 1) for v in dorsal))

# ---------- materials ----------
def node_mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    return m, m.node_tree.nodes, m.node_tree.links

# Cortex: soft, slightly wet tissue — subsurface, pale rose-grey with darker sulci (pointiness-free: AO node)
m, n, l = node_mat('Cortex')
bsdf = n['Principled BSDF']
bsdf.inputs['Base Color'].default_value = (0.78, 0.60, 0.56, 1)
bsdf.inputs['Roughness'].default_value = 0.42
bsdf.inputs['Subsurface Weight'].default_value = 0.35
bsdf.inputs['Subsurface Radius'].default_value = (1.0, 0.35, 0.25)
bsdf.inputs['Subsurface Scale'].default_value = 2.0
bsdf.inputs['Coat Weight'].default_value = 0.25
bsdf.inputs['Coat Roughness'].default_value = 0.18
ao = n.new('ShaderNodeAmbientOcclusion'); ao.inputs['Distance'].default_value = 6.0
ramp = n.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].position = 0.2; ramp.color_ramp.elements[0].color = (0.36, 0.17, 0.15, 1)
ramp.color_ramp.elements[1].position = 0.9; ramp.color_ramp.elements[1].color = (0.96, 0.68, 0.57, 1)
l.new(ao.outputs['AO'], ramp.inputs['Fac']); l.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])
noise = n.new('ShaderNodeTexNoise'); noise.inputs['Scale'].default_value = 0.6; noise.inputs['Detail'].default_value = 8
bump = n.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.12; bump.inputs['Distance'].default_value = 0.4
l.new(noise.outputs['Fac'], bump.inputs['Height']); l.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
# signal ripple (emission) driven by a value node "ripple_r" around the implant site; "ripple_col" sets colour
tc = n.new('ShaderNodeNewGeometry')
site = n.new('ShaderNodeCombineXYZ'); site.name = 'site'
for i, k in enumerate('XYZ'): site.inputs[k].default_value = dorsal[i]
dist = n.new('ShaderNodeVectorMath'); dist.operation = 'DISTANCE'
l.new(tc.outputs['Position'], dist.inputs[0]); l.new(site.outputs['Vector'], dist.inputs[1])
rr = n.new('ShaderNodeValue'); rr.name = 'ripple_r'; rr.outputs[0].default_value = -100
sub = n.new('ShaderNodeMath'); sub.operation = 'SUBTRACT'; l.new(dist.outputs['Value'], sub.inputs[0]); l.new(rr.outputs[0], sub.inputs[1])
ab = n.new('ShaderNodeMath'); ab.operation = 'ABSOLUTE'; l.new(sub.outputs[0], ab.inputs[0])
ring = n.new('ShaderNodeMapRange'); ring.inputs['From Min'].default_value = 0; ring.inputs['From Max'].default_value = 1.1
ring.inputs['To Min'].default_value = 1; ring.inputs['To Max'].default_value = 0; l.new(ab.outputs[0], ring.inputs['Value'])
gain = n.new('ShaderNodeValue'); gain.name = 'ripple_gain'; gain.outputs[0].default_value = 0.0
mul = n.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; l.new(ring.outputs[0], mul.inputs[0]); l.new(gain.outputs[0], mul.inputs[1])
col = n.new('ShaderNodeRGB'); col.name = 'ripple_col'; col.outputs[0].default_value = (1.0, 0.62, 0.25, 1)
l.new(col.outputs[0], bsdf.inputs['Emission Color']); l.new(mul.outputs[0], bsdf.inputs['Emission Strength'])
brain.data.materials.clear(); brain.data.materials.append(m)

# Skull: aged ivory bone with an animatable "glass" mix (value node 'glass': 0 = bone, 1 = glass shell)
m, n, l = node_mat('Bone'); m.blend_method = 'BLEND' if hasattr(m, 'blend_method') else None
m.surface_render_method = 'DITHERED'; m.use_backface_culling = False
bsdf = n['Principled BSDF']
bsdf.inputs['Base Color'].default_value = (0.90, 0.80, 0.64, 1); bsdf.inputs['Roughness'].default_value = 0.5
bsdf.inputs['Subsurface Weight'].default_value = 0.15; bsdf.inputs['Subsurface Radius'].default_value = (1, 0.8, 0.6)
nz = n.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 0.35; nz.inputs['Detail'].default_value = 10
bp = n.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.2; l.new(nz.outputs['Fac'], bp.inputs['Height']); l.new(bp.outputs['Normal'], bsdf.inputs['Normal'])
glass = n.new('ShaderNodeValue'); glass.name = 'glass'; glass.outputs[0].default_value = 0.0
lw = n.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.35
# alpha = mix(1, fresnel_rim*0.55, glass)
rim = n.new('ShaderNodeMath'); rim.operation = 'MULTIPLY'; rim.inputs[1].default_value = 0.6; l.new(lw.outputs['Facing'], rim.inputs[0])
mix = n.new('ShaderNodeMix'); mix.data_type = 'FLOAT'; mix.inputs['A'].default_value = 1.0
l.new(glass.outputs[0], mix.inputs['Factor']); l.new(rim.outputs[0], mix.inputs['B'])
l.new(mix.outputs['Result'], bsdf.inputs['Alpha'])
skull.data.materials.clear(); skull.data.materials.append(m)

# ---------- illustrative implant (published outline only: ~23 mm diameter x ~8 mm disc) ----------
# Placed flush with the skull surface above the dorsal left motor cortex. Not a reproduction of the real device.
skull_top_dir = (dorsal - mathutils.Vector(((bmn.x + bmx.x) / 2, (bmn.y + bmx.y) / 2, (bmn.z + bmx.z) / 2 - 15))).normalized()
bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=11.5, depth=8.0)
imp_o = bpy.context.active_object; imp_o.name = 'Implant'
bev = imp_o.modifiers.new('bevel', 'BEVEL'); bev.width = 1.4; bev.segments = 6; bev.limit_method = 'ANGLE'
bpy.ops.object.shade_smooth()
# find skull surface point along the normal from the dorsal motor site (ray cast)
dg = bpy.context.evaluated_depsgraph_get()
hit, loc, nor, idx, ob, mtx = scn.ray_cast(dg, dorsal + skull_top_dir * 80, -skull_top_dir)
surf = loc if hit and ob and ob.name == 'Skull' else dorsal + skull_top_dir * 9
imp_o.location = surf - skull_top_dir * 2.5
imp_o.rotation_euler = skull_top_dir.to_track_quat('Z', 'Y').to_euler()
m, n, l = node_mat('ImplantMetal'); b = n['Principled BSDF']
b.inputs['Base Color'].default_value = (0.86, 0.87, 0.90, 1); b.inputs['Metallic'].default_value = 1.0; b.inputs['Roughness'].default_value = 0.30
b.inputs['Anisotropic'].default_value = 0.6
imp_o.data.materials.append(m)
print('IMPLANT_LOC', tuple(round(v, 2) for v in imp_o.location), 'DIR', tuple(round(v, 3) for v in skull_top_dir), 'HIT', hit, ob.name if ob else None)

# ---------- threads: 64 thin curves from the implant underside into cortex (illustrative) ----------
import random
random.seed(7)
thr_mat, n, l = node_mat('Thread'); b = n['Principled BSDF']
b.inputs['Base Color'].default_value = (0.95, 0.80, 0.55, 1); b.inputs['Roughness'].default_value = 0.3
b.inputs['Emission Color'].default_value = (1.0, 0.62, 0.25, 1); b.inputs['Emission Strength'].default_value = 0.6
LIFT = 14.0  # shot B shows the device lifted (exploded view) so the threads are visible
q = skull_top_dir.to_track_quat('Z', 'Y')
threads = []
for k in range(64):
    a = random.uniform(0, 2 * math.pi); r = random.uniform(1.5, 9.5)
    start = imp_o.location + skull_top_dir * (LIFT - 4.0) + q @ mathutils.Vector((math.cos(a) * r * 0.5, math.sin(a) * r * 0.5, 0))
    spread = q @ mathutils.Vector((math.cos(a) * (r + random.uniform(3, 10)), math.sin(a) * (r + random.uniform(3, 10)), 0))
    # ray to cortex surface below the spread point
    target0 = imp_o.location + spread * 0.7 - skull_top_dir * 2
    h2, cl, cn, *_ = scn.ray_cast(dg, target0, -skull_top_dir)
    end = (cl if h2 else target0 - skull_top_dir * 10) - skull_top_dir * random.uniform(1.5, 3.0)
    cu = bpy.data.curves.new(f'thread{k:02d}', 'CURVE'); cu.dimensions = '3D'
    cu.bevel_depth = 0.09; cu.bevel_resolution = 2; cu.use_fill_caps = True
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(1)
    p0, p1 = sp.bezier_points
    p0.co = start; p0.handle_left = start; p0.handle_right = start + spread * 0.6 - skull_top_dir * 1.0
    p1.co = end; p1.handle_left = end + skull_top_dir * 4.0; p1.handle_right = end - skull_top_dir
    cu.bevel_factor_mapping_end = 'SPLINE'; cu.bevel_factor_end = 1.0
    o = bpy.data.objects.new(f'Thread{k:02d}', cu); scn.collection.objects.link(o); o.data.materials.append(thr_mat)
    threads.append(o)
bpy.ops.object.select_all(action='DESELECT')

# markers for the shot scripts
em = bpy.data.objects.new('MotorSite', None); em.location = dorsal; scn.collection.objects.link(em)
em2 = bpy.data.objects.new('SkullUp', None); em2.location = dorsal + skull_top_dir * 100; scn.collection.objects.link(em2)
cen = bpy.data.objects.new('BrainCenter', None); cen.location = (bmn + bmx) / 2; scn.collection.objects.link(cen)
hc = bpy.data.objects.new('HeadCenter', None); hc.location = (smn + smx) / 2; scn.collection.objects.link(hc)

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, 'anatomy.blend'))
print('SAVED anatomy.blend')
