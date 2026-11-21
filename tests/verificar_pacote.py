from pathlib import Path
from PIL import Image
import json,re

ROOT=Path(__file__).resolve().parents[1]
passed=0

def check(label,condition):
  global passed
  if not condition: raise AssertionError(label)
  passed+=1
  print('OK',label)

index=(ROOT/'index.html').read_text(encoding='utf-8')
js=(ROOT/'app.js').read_text(encoding='utf-8')
auth=(ROOT/'auth-service.js').read_text(encoding='utf-8')
styles=(ROOT/'styles.css').read_text(encoding='utf-8')
manifest=json.loads((ROOT/'manifest.webmanifest').read_text(encoding='utf-8'))
rules=(ROOT/'firestore.rules').read_text(encoding='utf-8')
check('PWA instalável', manifest['display']=='standalone' and len(manifest['icons'])>=4)
check('Splash escuro com progresso', all(x in index for x in ['id="splash"','id="loading-pct"','id="loading-fill"']) and '#000' in styles)
check('Fluxos login/cadastro/esqueci', all(x in index for x in ['id="login-view"','id="signup-view"','id="forgot-view"']))
check('Validação de confirmação de senha',"$('#signup-confirm').value!==password" in js)
check('Cadastro em quatro etapas',len(re.findall(r'class="signup-step"',index))==4)
check('Google, reset, cadastro e login reais',all(x in auth for x in ['signInWithPopup','sendPasswordResetEmail','createUserWithEmailAndPassword','signInWithEmailAndPassword']))
check('Boas-vindas de Beatriz', 'Com carinho,' in index and 'Beatriz' in index)
check('Leitura e aceite de documentos',all(x in index for x in ['check-privacy','check-terms','privacidade.html','termos.html']))
check('Aceite gravado por usuário', 'user_consents' in auth and 'serverTimestamp' in auth and 'request.auth.uid == userId' in rules)
check('Regras padrão fechadas', 'allow read, write: if false;' in rules)
check('Informativos próprios',all((ROOT/p).is_file() for p in ['privacidade.html','termos.html','seguranca.html']))
check('Sem senha persistida em JS', 'localStorage.setItem' not in js and 'sessionStorage.setItem(\'bia_recent_registration\',email)' in js)
check('Design responsivo', '@media(max-width:780px)' in styles)
logo=Image.open(ROOT/'assets/bia-moda-feminina-logo.png')
check('PNG da marca com transparência',logo.mode=='RGBA' and logo.getpixel((0,0))[3]==0 and logo.getpixel((600,600))[3]>0)
check('Instalação e cache', 'beforeinstallprompt' in js and (ROOT/'service-worker.js').exists())
check('Publicação com e-mail noreply', 'users.noreply.github.com' in (ROOT/'PUBLICAR_GITHUB_TERMUX.sh').read_text())
print(f'\n{passed} verificações locais aprovadas')
