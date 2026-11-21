from pathlib import Path
import re

base = Path('.')

# =========================
# index.html
# =========================
index_path = base / 'index.html'
index = index_path.read_text(encoding='utf-8')

old_track = '<div id="loading-track" class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Carregamento"><div id="loading-fill"></div></div>'
new_track = '''<div id="loading-track" class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Carregamento da splash">
        <div id="loading-fill"></div>
        <div id="loading-runner" class="progress-runner" aria-hidden="true">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M13 42c4-1 9-6 12-13 2-4 4-8 9-9 6-2 12 1 15 5l7 8c1 1 1 2 0 3-1 1-2 1-3 0l-7-5-5 10c-2 4-5 6-9 6H18c-4 0-6-3-5-5z" fill="currentColor" stroke="none"></path>
            <path d="M43 20c2-5 7-8 11-8" stroke="currentColor" stroke-width="3"></path>
            <circle cx="46" cy="17" r="2" fill="#ffe8dc" stroke="none"></circle>
          </svg>
        </div>
      </div>'''

if old_track not in index:
    raise SystemExit('Não encontrei o bloco antigo da barra de loading em index.html.')

index = index.replace(old_track, new_track)
index_path.write_text(index, encoding='utf-8')

# =========================
# styles.css
# =========================
styles_path = base / 'styles.css'
styles = styles_path.read_text(encoding='utf-8')

new_splash_block = r'''/* splash */
.splash{position:fixed;inset:0;z-index:300;background:#000;display:grid;place-items:center;overflow:hidden;padding:30px;color:#f7e4e1;transition:opacity .46s ease,visibility .46s ease}
.splash.is-done{opacity:0;visibility:hidden;pointer-events:none}
.splash::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 28%,rgba(237,171,179,.11),transparent 26%),radial-gradient(circle at 50% 82%,rgba(241,191,176,.06),transparent 24%);pointer-events:none}
.splash-core{display:grid;place-items:center;gap:8px;transform:translateY(-10%);position:relative;z-index:1}
.splash-halo{display:grid;place-items:center;width:min(64vw,285px);aspect-ratio:1;border-radius:50%;filter:drop-shadow(0 0 28px rgba(236,162,168,.15));animation:reveal 1s both}
.splash-halo img{width:100%;height:100%}
.splash-tag{letter-spacing:.27em;font-size:10px;color:#d3b5b6;font-weight:700;text-align:center;animation:reveal .9s .15s both}
.splash-bottom{position:absolute;bottom:max(42px,env(safe-area-inset-bottom) + 22px);left:50%;transform:translateX(-50%);width:min(290px,calc(100vw - 84px));display:grid;gap:12px;z-index:1}
.progress-meta{display:flex;justify-content:space-between;gap:20px;font-size:12px;color:#d4bec0}
.progress-meta #loading-pct{font-size:13px;letter-spacing:.04em;font-weight:700;font-variant-numeric:tabular-nums;color:var(--pink)}
.progress-track{position:relative;height:10px;overflow:visible;border-radius:999px;background:linear-gradient(180deg,#20191f,#120f14);border:1px solid rgba(242,200,207,.15);box-shadow:inset 0 1px 3px rgba(255,255,255,.04),0 8px 20px rgba(0,0,0,.35)}
.progress-track #loading-fill{position:absolute;left:0;top:0;height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,#8c4e60 0%,#c98793 50%,#ffe1d5 100%);box-shadow:0 0 12px rgba(233,188,157,.26);transition:width .18s linear}
.progress-runner{position:absolute;top:-20px;left:0;width:30px;height:30px;display:grid;place-items:center;color:#f6d8d5;filter:drop-shadow(0 4px 12px rgba(227,168,173,.35));transform:translateX(-6px);transition:left .18s linear,transform .18s ease}
.progress-runner svg{width:100%;height:100%}
.progress-runner.is-moving{animation:runnerBounce .55s ease-in-out infinite}
.loading-caption{font-size:8px;letter-spacing:.19em;color:#7e6f76;text-align:center;margin-top:4px}
@keyframes reveal{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes runnerBounce{0%,100%{translate:0 0}50%{translate:0 -3px}}
'''

styles_new = re.sub(
    r'/\* splash \*/.*?@keyframes reveal\{from\{opacity:0;transform:translateY\(12px\) scale\(\.97\)\}to\{opacity:1;transform:translateY\(0\) scale\(1\)\}\}',
    new_splash_block,
    styles,
    flags=re.S
)

if styles_new == styles:
    raise SystemExit('Não consegui atualizar o bloco da splash em styles.css.')

styles_path.write_text(styles_new, encoding='utf-8')

# =========================
# app.js
# =========================
app_path = base / 'app.js'
app = app_path.read_text(encoding='utf-8')

old_ui = "app:$('#app'),splash:$('#splash'),pct:$('#loading-pct'),progress:$('#loading-track'),fill:$('#loading-fill'),loadingLabel:$('#loading-label'),"
new_ui = "app:$('#app'),splash:$('#splash'),pct:$('#loading-pct'),progress:$('#loading-track'),fill:$('#loading-fill'),runner:$('#loading-runner'),loadingLabel:$('#loading-label'),"

if old_ui not in app:
    raise SystemExit('Não encontrei o objeto ui esperado em app.js.')

app = app.replace(old_ui, new_ui)

app = re.sub(
    r"function progress\(n,label\)\{.*?\}\n",
    """function progress(n,label){
  const safe=Math.max(0,Math.min(100,Math.round(n)));
  ui.pct.textContent=`${safe}%`;
  ui.fill.style.width=`${safe}%`;
  ui.progress.setAttribute('aria-valuenow',String(safe));
  ui.loadingLabel.textContent=label;
  if(ui.runner){
    const edge=safe===0?0:safe===100?100:safe;
    ui.runner.style.left=`calc(${edge}% - 10px)`;
    ui.runner.classList.toggle('is-moving',safe>0 && safe<100);
  }
}
const splashStages=[
  {until:14,label:'Aquecendo a vitrine'},
  {until:28,label:'Iluminando a identidade visual'},
  {until:44,label:'Organizando os detalhes da coleção'},
  {until:62,label:'Preparando sua experiência'},
  {until:79,label:'Ajustando a elegância da loja'},
  {until:92,label:'Protegendo sua conta'},
  {until:100,label:'Experiência pronta'}
];
function splashLabel(value){
  return splashStages.find(stage=>value<=stage.until)?.label||'Experiência pronta';
}
function animateSplash(totalMs=10000){
  const startTime=performance.now();
  progress(0,splashLabel(0));
  return new Promise(resolve=>{
    const tick=(now)=>{
      const elapsed=now-startTime;
      const ratio=Math.min(elapsed/totalMs,1);
      const eased=1-Math.pow(1-ratio,2.2);
      const value=Math.round(eased*100);
      progress(value,splashLabel(value));
      if(ratio<1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}
""",
    app,
    flags=re.S
)

app = re.sub(
    r"async function start\(\)\{.*?\n\}\nstart\(\)",
    """async function start(){
  const splashTimer=animateSplash(10000);
  const logo=$('.splash-halo img');
  await Promise.race([
    new Promise(resolve=>{
      if(logo.complete)return resolve();
      logo.addEventListener('load',resolve,{once:true});
      logo.addEventListener('error',resolve,{once:true});
    }),
    new Promise(resolve=>setTimeout(resolve,1800))
  ]);

  if('serviceWorker' in navigator && location.protocol!=='file:'){
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  }

  let recent=null;
  try{
    recent=sessionStorage.getItem('bia_recent_registration');
    if(recent)sessionStorage.removeItem('bia_recent_registration');
  }catch(_){}
  if(recent)$('#login-email').value=recent;

  if(configured){
    try{
      const module=await import('./auth-service.js');
      backend=module.createAuthService(config,user=>{
        if(user){signedIn(user);}
        else if(!registering){currentUser=null;showView('login');}
      });
      ui.connection.classList.add('ready');
      ui.connectionLabel.textContent='Conta protegida';
      await Promise.race([backend.redirectResult,new Promise(resolve=>setTimeout(resolve,1100))]);
    }catch(error){
      console.warn('Inicialização do Firebase indisponível:',error.code||error.message);
      showNotice('O serviço de contas ainda não está disponível. Confira a configuração Firebase e a conexão à internet.');
      ui.connection.classList.add('warn');
      ui.connectionLabel.textContent='Configuração pendente';
    }
  }else{
    ui.connection.classList.add('warn');
    ui.connectionLabel.textContent='Prévia visual';
    showNotice('Prévia visual: configure o Firebase para ativar cadastro, Google, recuperação de senha e login real.');
  }

  for(const id of ['login-submit','signup-submit','forgot-submit','google-btn']){
    document.getElementById(id).disabled=!backend;
  }

  await splashTimer;
  progress(100,'Experiência pronta');
  await new Promise(resolve=>setTimeout(resolve,420));

  ui.app.hidden=false;
  ui.splash.classList.add('is-done');
  setTimeout(()=>{ui.splash.hidden=true;},510);
}
start()""",
    app,
    flags=re.S
)

app_path.write_text(app, encoding='utf-8')

print('OK: Splash atualizada com sucesso.')
print('Arquivos alterados: index.html, styles.css e app.js')
