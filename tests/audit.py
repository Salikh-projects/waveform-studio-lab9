from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote
import json,re,subprocess,wave
root=Path(__file__).resolve().parents[1]
class Audit(HTMLParser):
 def __init__(self):super().__init__();self.ids=set();self.dupes=[];self.links=[];self.tags={};self.inputs=[];self.labels=set()
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);self.tags[tag]=self.tags.get(tag,0)+1
  if 'id' in a:
   if a['id'] in self.ids:self.dupes.append(a['id'])
   self.ids.add(a['id'])
  if tag=='label' and 'for' in a:self.labels.add(a['for'])
  for key in ['href','src']:
   if key in a:self.links.append(a[key])
  if tag in ['input','select']:self.inputs.append(a)
a=Audit();a.feed((root/'index.html').read_text(encoding='utf-8-sig'))
errors=[]
for link in a.links:
 u=urlparse(link)
 if u.scheme or u.netloc:continue
 if not u.path:
  if u.fragment and u.fragment not in a.ids:errors.append('Missing anchor '+link)
 elif not (root/unquote(u.path)).is_file():errors.append('Missing asset '+link)
for tag in ['header','nav','main','section','article','footer']:
 if not a.tags.get(tag):errors.append('Missing semantic tag '+tag)
if a.tags.get('div'):errors.append('Unexpected div')
if a.dupes:errors.append('Duplicate ids')
css=(root/'style.css').read_text(encoding='utf-8')
if re.search(r'(?<![\w-])(?:width|margin|padding)[^:]*:\s*[^;}]*\dpx',css):errors.append('Fixed pixel content metrics')
if '@media(min-width:1024px)' not in css:errors.append('Missing 1024px breakpoint')
patterns=[x['pattern'] for x in a.inputs if 'pattern' in x]
# Patterns are checked by tests/behavior.cjs.
def luminance(h):
 c=[int(h[i:i+2],16)/255 for i in (1,3,5)];c=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in c];return .2126*c[0]+.7152*c[1]+.0722*c[2]
def contrast(a,b):
 l=sorted([luminance(a),luminance(b)]);return round((l[1]+.05)/(l[0]+.05),2)
pairs=[]
for theme,bg,surface,fg,muted,acc,at in [('Dark','#101110','#191b19','#f4f5ef','#afb5ab','#d5ff70','#17200b'),('Light','#f5f6ef','#ffffff','#171c14','#515c4a','#324c0c','#ffffff')]:
 for name,f,b in [('Body / background',fg,bg),('Secondary / background',muted,bg),('Secondary / card',muted,surface),('Accent / background',acc,bg),('Button label',at,acc)]:
  ratio=contrast(f,b);pairs.append(dict(theme=theme,pair=name,foreground=f,background=b,ratio=ratio,AA=ratio>=4.5))
  if ratio<4.5:errors.append('Contrast failure '+theme+name)
for wav in root.glob('images/*.wav'):
 with wave.open(str(wav),'rb') as w:
  if w.getnframes()/w.getframerate()!=12:errors.append('Audio duration error')
result=dict(staticChecks='PASS' if not errors else 'FAIL',errors=errors,semanticTags=a.tags,localReferencesChecked=len(a.links),contrast=pairs,browserVerification='NOT PERFORMED: Windows browser-control stopped because URL could not be reliably determined.',figmaCloudFile='NOT CREATED',githubPages='NOT DEPLOYED',responsiveReviewRequired=[320,360,390,480,768,1024,1440])
(root/'docs/verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
assert not errors
