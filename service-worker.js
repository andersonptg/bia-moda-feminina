/* Cache apenas da interface pública; não guarda senhas, tokens nem dados pessoais. */
const CACHE='bia-moda-feminina-v5.0.0';
const APP_SHELL=[
  './','./index.html','./styles.css','./app.js','./loja-v5.js','./adm/v5-admin.js','./manifest.webmanifest',
  './assets/logo-otimizada.webp','./assets/icon-192.png','./assets/icon-512.png',
  './assets/salto-cristal-transparente.png','./assets/instagram-neon-transparente.png','./assets/selo-oficial-da-loja.png',
  './assets/olho-exibir-senha.png','./assets/olho-ocultar-senha.png',
  './firebase-config.js','./auth-service.js'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith('/firebase-config.js'))return; // configuração atualizada sempre na rede
  // Sem autenticação offline: o Firebase nunca é emulado em cache.
  event.respondWith(fetch(request).then(response=>{
    if(response.ok && response.type==='basic'){
      const copy=response.clone();
      event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));
    }
    return response;
  }).catch(async()=>{
    const found=await caches.match(request);
    return found|| (request.mode==='navigate'?caches.match('./index.html'):Response.error());
  }));
});
