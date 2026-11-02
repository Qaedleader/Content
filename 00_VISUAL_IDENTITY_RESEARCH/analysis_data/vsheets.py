import glob,os,sys
from PIL import Image,ImageDraw
d=sys.argv[1]; fs=sorted(glob.glob(os.path.join(d,'vframes','f_*.jpg')))
W,H=384,832; per=10
for s in range(0,len(fs),per):
  sh=Image.new('RGB',(W*5,(H+28)*2),'white'); dr=ImageDraw.Draw(sh)
  for j,p in enumerate(fs[s:s+per]):
    x=(j%5)*W; y=(j//5)*(H+28)
    sh.paste(Image.open(p).convert('RGB'),(x,y+28)); dr.text((x+6,y+8),f't={(s+j)*0.5:.1f}s',fill='red')
  sh.save(os.path.join(d,'sheets',f'vid_{s//per+1:02d}.jpg'),quality=88)
