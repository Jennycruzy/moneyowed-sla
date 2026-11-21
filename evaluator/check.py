# Checks a pairs file against the pool row rules and drops prompts too close to an earlier kept one (node rejects at 0.85; this uses 0.80).
# usage: python3 evaluator/check.py in.jsonl out.jsonl
import json,difflib,re,unicodedata,sys
src,dst=sys.argv[1],sys.argv[2]
rows=[json.loads(l) for l in open(src)]
norm=lambda s:re.sub(r'\s+',' ',unicodedata.normalize('NFC',s)).strip()
keep=[];dropped=[];bad=[]
for i,r in enumerate(rows):
  p,c,j=norm(r['prompt']),norm(r['chosen']),norm(r['rejected'])
  if not(16<=len(p)<=16000) or not(8<=len(c)<=32000) or not(8<=len(j)<=32000) or c==j or len(json.dumps(r).encode())>65536 or '\x00' in json.dumps(r):
    bad.append(i); continue
  if 'uptime_pct' not in json.loads(r['chosen']): bad.append(i); continue
  m=max([difflib.SequenceMatcher(None,p,norm(k['prompt']),autojunk=False).ratio() for k in keep] or [0])
  if m>=0.80: dropped.append((i,round(m,3))); continue
  keep.append(r)
open(dst,'w').write(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in keep))
cl=[len(r['chosen']) for r in keep]; rl=[len(r['rejected']) for r in keep]
print(f"in {len(rows)} kept {len(keep)} bad {bad} dropped {len(dropped)} {dropped[:8]}")
print('chosen longer in',sum(a>b for a,b in zip(cl,rl)),'of',len(keep),'| verdict differs in',sum(json.loads(r['chosen'])['compliant']!=json.loads(r['rejected']).get('compliant') for r in keep))
print('provenance',{k:sum(r['provenance']['source_kind']==k for r in keep) for k in ('human','computed')})
