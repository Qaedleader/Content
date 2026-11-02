import os, sys, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter
OUT = sys.argv[1]; FD = r'D:/Content/02_NEURALINK/05_3D_AND_GRAPHICS/fonts'
P = {
 'P1 Saffron Workshop': [('Saffron yellow','#F2B630'),('Yellow shade','#C98F12'),('Cream paper','#F4ECDD'),('Kraft','#A57C52'),('Charcoal ink','#262321'),('Night navy','#1F2C3F'),('Teal','#2F7C78'),('Terracotta','#C65A3E'),('Sage','#9FB08B')],
 'P2 Signal Navy':      [('Signal yellow','#FFCB2E'),('Off-white','#F7F3EA'),('Navy','#13213A'),('Midnight','#0B1324'),('Steel blue','#3A5576'),('Cyan','#46C2CB'),('Coral','#FF6A4D'),('Fog','#C9CFD8')],
 'P3 Editorial Mid-century': [('Mustard','#E0A93B'),('Bone','#EEE4D0'),('Charcoal','#2E2C29'),('Forest','#2E5A4C'),('Brick','#B24A32'),('Dusty blue','#7393A7'),('Walnut','#5C4030'),('Plum','#6A4A6B')],
}
def rgb(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def lum(h):
    c=[v/255 for v in rgb(h)]; c=[x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
    return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
def cr(a,b):
    la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+0.05)/(lb+0.05)
pairs = {
 'P1 Saffron Workshop': [('#262321','#F4ECDD'),('#262321','#F2B630'),('#F2B630','#1F2C3F'),('#F4ECDD','#1F2C3F'),('#F4ECDD','#2F7C78'),('#F4ECDD','#C65A3E'),('#262321','#9FB08B'),('#F2B630','#F4ECDD'),('#F2B630','#2F7C78'),('#F2B630','#A57C52'),('#FFFFFF','#F2B630')],
 'P2 Signal Navy': [('#13213A','#F7F3EA'),('#0B1324','#FFCB2E'),('#FFCB2E','#13213A'),('#F7F3EA','#13213A'),('#46C2CB','#0B1324'),('#F7F3EA','#FF6A4D'),('#0B1324','#FF6A4D'),('#F7F3EA','#3A5576'),('#FFCB2E','#F7F3EA')],
 'P3 Editorial Mid-century': [('#2E2C29','#EEE4D0'),('#2E2C29','#E0A93B'),('#E0A93B','#2E5A4C'),('#EEE4D0','#2E5A4C'),('#EEE4D0','#B24A32'),('#EEE4D0','#5C4030'),('#2E2C29','#7393A7'),('#EEE4D0','#6A4A6B'),('#E0A93B','#EEE4D0')],
}
res = {k:[(fg,bg,round(cr(fg,bg),2)) for fg,bg in v] for k,v in pairs.items()}
json.dump(res, open(os.path.join(OUT,'palette_contrast.json'),'w'), indent=1)
for k,v in res.items():
    print(k); [print(f'   {fg} on {bg}: {r}:1') for fg,bg,r in v]
# board
fA = ImageFont.truetype(os.path.join(FD,'Alexandria[wght].ttf'), 46, layout_engine=ImageFont.Layout.RAQM); fA.set_variation_by_axes([800])
fL = ImageFont.truetype(os.path.join(FD,'Alexandria[wght].ttf'), 22, layout_engine=ImageFont.Layout.RAQM); fL.set_variation_by_axes([500])
fT = ImageFont.truetype(os.path.join(FD,'Alexandria[wght].ttf'), 30, layout_engine=ImageFont.Layout.RAQM); fT.set_variation_by_axes([700])
W=1800; rowh=430; im=Image.new('RGB',(W,rowh*3+40),'#FFFFFF'); d=ImageDraw.Draw(im)
def strip(base, x, y, word, fg, bg, rot):
    l,t,r,b = d.textbbox((0,0), word, font=fA, direction='rtl', language='ar')
    w,h = r-l+44, (b-t)+40
    s = Image.new('RGBA',(w+30,h+30),(0,0,0,0)); sd=ImageDraw.Draw(s)
    sh = Image.new('RGBA',(w+30,h+30),(0,0,0,0)); ImageDraw.Draw(sh).rectangle((15,21,15+w,21+h),fill=(0,0,0,110)); sh=sh.filter(ImageFilter.GaussianBlur(5))
    s.alpha_composite(sh); sd.rectangle((15,15,15+w,15+h),fill=rgb(bg)+(255,))
    sd.text((15+22-l,15+20-t), word, font=fA, fill=rgb(fg)+(255,), direction='rtl', language='ar')
    s = s.rotate(rot, resample=Image.BICUBIC, expand=True); base.paste(s,(x,y),s); return s.width
for i,(name,cols) in enumerate(P.items()):
    y0=20+i*rowh; d.text((30,y0),name,font=fT,fill='#111111')
    sw=(W-60)//len(cols)
    for j,(cn,hx) in enumerate(cols):
        x=30+j*sw; d.rectangle((x,y0+50,x+sw-12,y0+200),fill=hx,outline='#00000022')
        d.text((x+4,y0+206),cn,font=fL,fill='#222222'); d.text((x+4,y0+234),hx,font=fL,fill='#555555')
    # sample stage: backdrop + floor + caption strips (RTL order: first word at right)
    bgc, floor, cap_bg, cap_fg, hi_bg, hi_fg = {
      0:('#2F7C78','#A57C52','#F4ECDD','#262321','#F2B630','#262321'),
      1:('#13213A','#3A5576','#F7F3EA','#13213A','#FFCB2E','#0B1324'),
      2:('#2E5A4C','#5C4030','#EEE4D0','#2E2C29','#E0A93B','#2E2C29')}[i]
    sx=30; sy=y0+270; d.rectangle((sx,sy,W-30,sy+140),fill=bgc); d.rectangle((sx,sy+105,W-30,sy+140),fill=floor)
    words=[('الذكاء',cap_fg,cap_bg,-2),('الاصطناعي',hi_fg,hi_bg,1.5),('بيقرّر',cap_fg,cap_bg,-1)]
    x=W-60
    for wd,fg,bg,rot in words:
        l,t,r,b=d.textbbox((0,0),wd,font=fA,direction='rtl',language='ar'); w=r-l+44+40
        x-=w; strip(im,x,sy+8,wd,fg,bg,rot); x-=6
im.save(os.path.join(OUT,'palette_board.png'))
print('board saved')
