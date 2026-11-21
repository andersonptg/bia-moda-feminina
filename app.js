(()=>{
'use strict';
const $=(s)=>document.querySelector(s);
const $$=(s)=>[...document.querySelectorAll(s)];
const ui={
  app:$('#app'),splash:$('#splash'),pct:$('#loading-pct'),progress:$('#loading-track'),fill:$('#loading-fill'),runner:$('#loading-runner'),loadingLabel:$('#loading-label'),
  auth:$('#auth-screen'),welcome:$('#welcome-screen'),next:$('#next-screen'),notice:$('#auth-notice'),toast:$('#toast'),
  google:$('#google-btn'),connection:$('#connection-state'),connectionLabel:$('#connection-label')
};
let backend=null, currentUser=null, currentView='login', signupStep=0, busy=false, registering=false;
let installPrompt=null, toastTimeout=null;
const forms={login:$('#login-form'),signup:$('#signup-form'),forgot:$('#forgot-form')};
const config=window.BIA_FIREBASE_CONFIG||{};
const configured=['apiKey','authDomain','projectId','appId'].every(k=>typeof config[k]==='string' && config[k].trim() && !/PREENCHA|COLE_AQUI/i.test(config[k]));

function progress(n,label){
  const safe=Math.max(0,Math.min(100,Math.round(n)));
  ui.pct.textContent=`${safe}%`;
  ui.fill.style.width=`${safe}%`;
  ui.progress.setAttribute('aria-valuenow',String(safe));
  ui.loadingLabel.textContent=label;
  if(ui.runner){
    const edge=safe===0?0:safe===100?100:safe;
    ui.runner.style.left=`${8+edge*0.84}%`;
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
function toast(message,type='success',ms=4200){
  clearTimeout(toastTimeout);
  $('#toast-icon').textContent=type==='error'?'!':type==='notice'?'i':'✓';
  $('#toast-text').textContent=message;
  ui.toast.classList.toggle('error',type==='error');ui.toast.classList.toggle('notice',type==='notice');
  ui.toast.hidden=false;
  toastTimeout=setTimeout(()=>{ui.toast.hidden=true},ms);
}
$('#toast-close').addEventListener('click',()=>{clearTimeout(toastTimeout);ui.toast.hidden=true});
function showNotice(message){ui.notice.hidden=false;ui.notice.textContent=message;}
function hideNotice(){ui.notice.hidden=true;ui.notice.textContent='';}
function busyState(v,button){
  busy=v;for(const el of $$('.primary-btn, .google-btn, .back-btn')){el.disabled=v|| (el.id==='continue-btn' && (!$('#check-privacy').checked||!$('#check-terms').checked))||(!configured && ['login-submit','signup-submit','forgot-submit','google-btn'].includes(el.id));}
  if(button){if(v){button.dataset.oldText=button.innerHTML;button.textContent='Aguarde…';}else if(button.dataset.oldText){button.innerHTML=button.dataset.oldText;delete button.dataset.oldText;}}
}
function showScreen(which){ui.auth.hidden=which!=='auth';ui.welcome.hidden=which!=='welcome';ui.next.hidden=which!=='next';window.scrollTo({top:0,behavior:'instant'});}
function showView(view){if(busy)return;currentView=view;hideNotice();for(const v of ['login','signup','forgot']){$(`#${v}-view`).hidden=v!==view;}showScreen('auth');if(view==='signup'){signupStep=0;updateSteps();}if(view==='forgot'){$('#forgot-email').value=$('#login-email').value||$('#signup-email').value;}}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
$$('.toggle-password').forEach(b=>b.addEventListener('click',()=>{
  const input=document.getElementById(b.dataset.target);
  input.type=input.type==='password'?'text':'password';b.setAttribute('aria-label',input.type==='password'?'Mostrar senha':'Ocultar senha');b.setAttribute('aria-pressed',String(input.type==='text'));const eye=b.querySelector('img');if(eye)eye.src=input.type==='password'?'./assets/olho-exibir-senha.png':'./assets/olho-ocultar-senha.png';
}));
function updateSteps(){
  $$('.signup-step').forEach((el,i)=>{el.hidden=i!==signupStep;});
  $$('.stepper .step').forEach((el,i)=>{el.classList.toggle('active',i===signupStep);el.classList.toggle('done',i<signupStep);if(i===signupStep){el.setAttribute('aria-current','step')}else{el.removeAttribute('aria-current')}});
  $('#signup-back').textContent=signupStep===0?'← Voltar ao login':'← Voltar';
  $('#signup-next').hidden=signupStep===3;$('#signup-submit').hidden=signupStep!==3;
}
function emailValid(s){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());}
function validateStep(i){
  const name=$('#signup-name').value.trim(), email=$('#signup-email').value.trim(), password=$('#signup-password').value;
  switch(i){
    case 0:if(name.length<2){toast('Informe seu nome completo.', 'error');return false;}return true;
    case 1:if(!emailValid(email)){toast('Informe um e-mail válido.', 'error');return false;}return true;
    case 2:if(password.length<8|| !/[A-Za-zÀ-ÿ]/.test(password)|| !/\d/.test(password)){toast('A senha precisa ter pelo menos 8 caracteres, letras e números.','error');return false;}return true;
    case 3:if($('#signup-confirm').value!==password){toast('As senhas não são iguais. Confira novamente.','error');return false;}return true;
    default:return false;
  }
}
$('#signup-next').addEventListener('click',()=>{if(!busy&&validateStep(signupStep)){signupStep=Math.min(3,signupStep+1);updateSteps();}});
$('#signup-back').addEventListener('click',()=>{if(busy)return;if(signupStep===0)showView('login');else{signupStep--;updateSteps();}});
function readableError(error){
  const messages={
    'auth/invalid-email':'O endereço de e-mail informado não é válido.',
    'auth/email-already-in-use':'Esse e-mail já está cadastrado. Entre ou recupere sua senha.',
    'auth/invalid-credential':'E-mail ou senha incorretos. Confira seus dados.',
    'auth/wrong-password':'E-mail ou senha incorretos. Confira seus dados.',
    'auth/weak-password':'Escolha uma senha mais forte.',
    'auth/too-many-requests':'Muitas tentativas. Aguarde um pouco antes de tentar novamente.',
    'auth/popup-closed-by-user':'A entrada com Google foi cancelada.',
    'auth/cancelled-popup-request':'Outra janela de autenticação foi aberta.',
    'auth/account-exists-with-different-credential':'Esse e-mail já está ligado a outro método. Entre com seu método original.',
    'auth/unauthorized-domain':'Este domínio ainda precisa ser autorizado no Firebase.',
    'auth/network-request-failed':'Não foi possível conectar. Verifique sua internet.',
    'permission-denied':'Não foi possível registrar a confirmação. Revise as regras do banco de dados.',
    'auth/operation-not-allowed':'Ative esse tipo de login nas configurações do Firebase.'
  };
  return messages[error?.code]||'Não foi possível concluir a operação. Tente novamente.';
}
forms.login.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  const email=$('#login-email').value.trim(),password=$('#login-password').value;
  if(!emailValid(email)||!password){toast('Preencha seu e-mail e senha corretamente.','error');return;}
  if(!backend){toast('O login será liberado após configurar o Firebase.','notice');return;}
  const btn=$('#login-submit');busyState(true,btn);
  try{await backend.login(email,password);$('#login-password').value='';}
  catch(error){toast(readableError(error),'error');}
  finally{busyState(false,btn);}
});
forms.signup.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  for(let i=0;i<4;i++){if(!validateStep(i)){signupStep=i;updateSteps();return;}}
  if(!backend){toast('Ative a autenticação antes de cadastrar contas reais.','notice');return;}
  const email=$('#signup-email').value.trim(),name=$('#signup-name').value.trim();
  const password=$('#signup-password').value;
  const btn=$('#signup-submit');registering=true;busyState(true,btn);
  try{
    await backend.register(name,email,password);
    $('#signup-password').value='';$('#signup-confirm').value='';
    try{sessionStorage.setItem('bia_recent_registration',email);}catch(_){/* bloqueio de armazenamento privado */}
    toast('Cadastro realizado com sucesso! Você será direcionada ao login.','success',2900);
    // Reinicia a página, como no fluxo VITRYS, exigindo um novo acesso.
    setTimeout(()=>{window.location.replace(window.location.pathname+window.location.search);},2300);
  }catch(error){registering=false;toast(readableError(error),'error');}
  finally{busyState(false,btn);}
});
forms.forgot.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  const email=$('#forgot-email').value.trim();if(!emailValid(email)){toast('Informe um e-mail válido.','error');return;}
  if(!backend){toast('A recuperação será liberada após configurar o Firebase.','notice');return;}
  const btn=$('#forgot-submit');busyState(true,btn);
  try{await backend.resetPassword(email);toast('Se o e-mail estiver cadastrado, as instruções de recuperação serão enviadas.','success',6300);$('#login-email').value=email;setTimeout(()=>showView('login'),950);}
  catch(error){if(error.code==='auth/user-not-found'){toast('Se o e-mail estiver cadastrado, as instruções serão enviadas.');}else{toast(readableError(error),'error');}}
  finally{busyState(false,btn);}
});
ui.google.addEventListener('click',async()=>{
  if(busy)return;if(!backend){toast('A entrada com Google será liberada depois da configuração.','notice');return;}
  busyState(true,ui.google);
  try{await backend.googleLogin();}
  catch(error){toast(readableError(error),'error');}
  finally{busyState(false,ui.google);}
});
function updateContinue(){if(!busy)$('#continue-btn').disabled=!($('#check-privacy').checked&&$('#check-terms').checked)||!backend;}
$('#check-privacy').addEventListener('change',updateContinue);
$('#check-terms').addEventListener('change',updateContinue);
async function signedIn(user){
  if(registering)return;
  currentUser=user;
  $('#welcome-greeting').textContent=user.displayName?`É uma alegria receber você, ${user.displayName.split(' ')[0]}!`:'É uma alegria receber você!';
  $('#check-privacy').checked=false;$('#check-terms').checked=false;updateContinue();
  showScreen('welcome');
  if(window.location.protocol!=='https:' && window.location.hostname!=='localhost'){
    $('#security-status').querySelector('span').textContent='A conexão HTTPS será necessária na publicação. Não utilize dados reais em conexões inseguras.';
  }
  try{if(await backend.readConsent(user.uid)){$('#check-privacy').checked=true;$('#check-terms').checked=true;updateContinue();}}
  catch(error){console.warn('Consentimento ainda não disponível:',error.code||'erro');}
}
$('#continue-btn').addEventListener('click',async()=>{
  if(busy||!backend||!currentUser||!$('#check-privacy').checked||!$('#check-terms').checked)return;
  const btn=$('#continue-btn');busyState(true,btn);
  try{await backend.acceptConsent(currentUser.uid);toast('Confirmações registradas. Seja bem-vinda!');showScreen('next');}
  catch(error){toast(readableError(error),'error');}
  finally{busyState(false,btn);}
});
$$('[data-action="logout"]').forEach(el=>el.addEventListener('click',async()=>{
  if(!backend)return;try{await backend.logout();currentUser=null;showView('login');toast('Você saiu da sua conta com segurança.');}
  catch(error){toast(readableError(error),'error');}
}));

function isInstalledMode(){return window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;}
function hideInstallIfInstalled(){
  let saved=false;try{saved=localStorage.getItem('bia_app_installed')==='1';}catch(_){}
  $('#install-btn').hidden=Boolean(isInstalledMode()||saved);
}
window.addEventListener('beforeinstallprompt',event=>{
  event.preventDefault();installPrompt=event;
  // Se a instalação voltou a ser oferecida, permite mostrar botão novamente.
  try{localStorage.removeItem('bia_app_installed')}catch(_){}
  hideInstallIfInstalled();
});
window.addEventListener('appinstalled',()=>{
  installPrompt=null;try{localStorage.setItem('bia_app_installed','1')}catch(_){}
  hideInstallIfInstalled();toast('Aplicativo instalado com sucesso!');
});
window.addEventListener('pageshow',hideInstallIfInstalled);
hideInstallIfInstalled();
$('#install-btn').addEventListener('click',async()=>{
  if(installPrompt){const p=installPrompt;installPrompt=null;await p.prompt();return;}
  const ios=/iPad|iPhone|iPod/i.test(navigator.userAgent);
  $('#install-instructions').textContent=ios?'No Safari, toque em Compartilhar e selecione “Adicionar à Tela de Início”.':'No Chrome, abra o menu ⋮ e procure “Adicionar à tela inicial” ou “Instalar aplicativo”. A instalação exige um site publicado com HTTPS.';
  $('#install-dialog').showModal();
});
$('#install-close').addEventListener('click',()=>$('#install-dialog').close());
$('#install-dialog').addEventListener('click',event=>{if(event.target.id==='install-dialog')event.target.close();});
$('#copyright-year').textContent=new Date().getFullYear();

async function start(){
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
start().catch(()=>{ui.app.hidden=false;ui.splash.hidden=true;showNotice('Não foi possível iniciar todas as funções. Atualize a página.');});
})();
