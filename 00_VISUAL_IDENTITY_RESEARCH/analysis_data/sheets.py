import glob,os,sys
from PIL import Image,ImageDraw
out=sys.argv[1]
fs=sorted(glob.glob(r'D:/Content/Familiar style/*.jpeg'))
with open(os.path.join(out,'index.txt'),'w',encoding='utf8') as f:
  for i,p in enumerate(fs,1): f.write(f'{i:02d}\t{os.path.basename(p)}\n')
W,H=444,960
for s in range(0,len(fs),4):
  sheet=Image.new('RGB',(W*4,H+40),'white'); d=ImageDraw.Draw(sheet)
  for j,p in enumerate(fs[s:s+4]):
    im=Image.open(p).convert('RGB').resize((W,H),Image.LANCZOS)
    sheet.paste(im,(j*W,40)); d.text((j*W+8,10),f'IMG {s+j+1:02d}',fill='red')
  sheet.save(os.path.join(out,f'img_sheet_{s//4+1}.jpg'),quality=90)
