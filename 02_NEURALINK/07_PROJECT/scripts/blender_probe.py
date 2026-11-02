# Blender probe: import BodyParts3D brain + skull, report bounds, render one EEVEE test frame.
# blender -b --factory-startup -P blender_probe.py -- <obj_dir> <out_png>
import bpy, sys, os, mathutils
argv = sys.argv[sys.argv.index('--') + 1:]
obj_dir, out = argv[0], argv[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
for f in sorted(os.listdir(obj_dir)):
    bpy.ops.wm.obj_import(filepath=os.path.join(obj_dir, f))
mn = mathutils.Vector((1e9,) * 3); mx = -mn
for o in bpy.context.scene.objects:
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c)
        mn = mathutils.Vector(map(min, mn, w)); mx = mathutils.Vector(map(max, mx, w))
print('BOUNDS', tuple(round(v, 1) for v in mn), tuple(round(v, 1) for v in mx), 'objects', len(bpy.context.scene.objects))
ctr = (mn + mx) / 2
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); bpy.context.scene.collection.objects.link(cam)
cam.location = ctr + mathutils.Vector((0, -900, 0)) if False else ctr + mathutils.Vector((-700, 0, 0))
cam.rotation_euler = (ctr - cam.location).to_track_quat('-Z', 'Y').to_euler()
cam.data.lens = 50; cam.data.clip_end = 10000
bpy.context.scene.camera = cam
sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sun.rotation_euler = (0.8, 0.2, 0.6)
bpy.context.scene.collection.objects.link(sun)
s = bpy.context.scene; s.render.engine = 'BLENDER_EEVEE_NEXT'
s.render.resolution_x, s.render.resolution_y = 540, 960
s.render.filepath = out
import time; t = time.time(); bpy.ops.render.render(write_still=True); print('RENDER_SEC', round(time.time() - t, 2))
