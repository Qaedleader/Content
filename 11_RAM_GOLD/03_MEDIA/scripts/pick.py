import json,sys
sel={'ram':[5,12,16,7,22,31,29],'hbm':[12,8,9,14,17,23,0],'altman':[7,0,12,33],'dc':[10,12,13,14,1,2,8,16],'fab':[16,15,9,18,26,24],'gold':[9,0,1,22],
'V_vid':[0,1,24,25,23],'S_logo':[1,3,9,16,24,25,31],'pc2':[7,8,12,11],'V_vid2':[11,16,21,18]}
out=[]
for k,ix in sel.items():
    rows=json.load(open(f'review/{k}.json',encoding='utf-8'))
    for i in ix: out.append({'set':k,'i':i,'title':rows[i]['title'],'lic':rows[i]['lic']})
json.dump(out,open('picks.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
for o in out: print(o['set'],o['i'],o['lic'],o['title'])
