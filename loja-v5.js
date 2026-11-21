import {getApp,getApps} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged,updateProfile,deleteUser,signOut} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
import {getFirestore,collection,getDocs,query,where,doc,getDoc,setDoc,addDoc,serverTimestamp,orderBy,limit,updateDoc} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n)||0);
let db,auth,user,products=[],banners=[],settings={},category='Todas',cart=[],tab='loja',timer,ticketId=null;
const storeKey=()=>`bia-cart-${user?.uid||'guest'}`;
function readCart(){try{cart=JSON.parse(localStorage.getItem(storeKey())||'[]');if(!Array.isArray(cart))cart=[];}catch{cart=[];}cart=cart.filter(x=>typeof x.id==='string'&&Number.isInteger(x.qty)&&x.qty>0)}
function saveCart(){localStorage.setItem(storeKey(),JSON.stringify(cart));$('#v5-cart-count').textContent=cart.reduce((n,x)=>n+x.qty,0);$('#v51-bag-count').textContent=cart.reduce((n,x)=>n+x.qty,0)}
async function init(){try{const app=await new Promise((resolve,reject)=>{let n=0;const timer=setInterval(()=>{const app=getApps().find(x=>x.name==='[DEFAULT]');if(app){clearInterval(timer);resolve(app)}else if(++n>120){clearInterval(timer);reject(Error('Firebase indisponível'))}},250)});auth=getAuth(app);db=getFirestore(app);onAuthStateChanged(auth,async u=>{user=u;$('#v51-avatar').textContent=(u?.displayName||u?.email||'B').trim().charAt(0).toUpperCase();readCart();saveCart();$('#v5-admin-link').hidden=true;if(u){try{const t=await u.getIdTokenResult();$('#v5-admin-link').hidden=!['tech_owner','owner','admin1','admin2','suporte','catalogo','analista'].includes(t.claims.biaRole)}catch{}}await load()});}catch(e){console.warn('BIA V5 Firebase indisponível',e.code||e.message)}}
async function load(){
 const results=await Promise.allSettled([
  getDocs(query(collection(db,'admin_products'),where('status','==','ativo'))),
  getDocs(query(collection(db,'shop_banners'),where('active','==',true))),
  getDoc(doc(db,'shop_settings','main'))
 ]);
 if(results[0].status==='fulfilled'){
  products=results[0].value.docs.map(x=>({id:x.id,...x.data()})).filter(x=>x.status==='ativo'&&Number(x.stock)>0&&Array.isArray(x.images)&&x.images.length);
  $('#v5-products').removeAttribute('data-error');
 }else{
  products=[];$('#v5-products').dataset.error='true';
  console.warn('Catalogo:',results[0].reason?.code||results[0].reason);
 }
 if(results[1].status==='fulfilled')banners=results[1].value.docs.map(x=>({id:x.id,...x.data()})).filter(x=>x.active&&x.image).sort((a,b)=>(a.order||0)-(b.order||0));
 else {banners=[];console.warn('Banners:',results[1].reason?.code||results[1].reason)}
 if(results[2].status==='fulfilled')settings=results[2].value.exists()?results[2].value.data():{};
 render();
 if(results[0].status==='rejected')$('#v5-products').textContent='Não foi possível consultar a vitrine. Verifique as permissões de publicação.';
}
function renderBanner(){clearInterval(timer);const el=$('#v5-banner');el.hidden=!banners.length;if(!banners.length)return;let i=0;const draw=()=>{const b=banners[i];el.replaceChildren();const img=document.createElement('img');img.src=b.image;img.alt=b.title||'Banner da loja';el.append(img);if(b.link&&/^https:\/\//i.test(b.link)){const a=document.createElement('a');a.href=b.link;a.textContent=b.button||'Saiba mais';if(/^https?:/.test(b.link)){a.target='_blank';a.rel='noopener noreferrer'}el.append(a)}};draw();if(banners.length>1)timer=setInterval(()=>{i=(i+1)%banners.length;draw()},Math.max(2,Math.min(60,Number(settings.bannerSeconds)||5))*1000)}
function render(){renderBanner();const cats=['Todas',...new Set(products.map(p=>p.category).filter(Boolean))];if(!cats.includes(category))category='Todas';const c=$('#v5-categories');c.hidden=!products.length;c.replaceChildren();cats.forEach(v=>{const b=document.createElement('button');b.textContent=v;b.className=category===v?'active':'';b.onclick=()=>{category=v;renderProducts();renderCategories()};c.append(b)});renderProducts();showTab(tab)}
function renderCategories(){[...$('#v5-categories').children].forEach(x=>x.classList.toggle('active',x.textContent===category))}
function renderProducts(){const el=$('#v5-products');el.replaceChildren();for(const p of products.filter(x=>category==='Todas'||x.category===category)){const card=document.createElement('article');card.className='v5-product';card.innerHTML=`<img loading="lazy" alt="${esc(p.name)}" src="${esc(p.images[0])}"><div class="v5-product-body"><h3>${esc(p.name)}</h3><p>${fmt(p.price)}</p><p class="v5-muted">${esc(p.category||'')}</p><button type="button">Ver peça</button></div>`;card.querySelector('button').onclick=()=>detail(p.id);el.append(card)}}
function detail(id){const p=products.find(x=>x.id===id);if(!p)return;tab='detalhe';const el=$('#v5-panel');el.hidden=false;el.innerHTML=`<button id="v5-back">← Voltar</button><h2>${esc(p.name)}</h2><div class="v5-gallery">${p.images.map(u=>`<img loading="lazy" src="${esc(u)}" alt="${esc(p.name)}">`).join('')}</div><p>${esc(p.description||'')}</p><h3>${fmt(p.price)}</h3><label>Tamanho<select id="v5-size">${(p.sizes?.length?p.sizes:['Único']).map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><label>Cor<select id="v5-color">${(p.colors?.length?p.colors:['Padrão']).map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><button id="v5-add">Adicionar ao carrinho</button>`;$('#v5-back').onclick=()=>showTab('loja');$('#v5-add').onclick=()=>{const size=$('#v5-size').value,color=$('#v5-color').value;const item=cart.find(x=>x.id===id&&x.size===size&&x.color===color);const qty=(item?.qty||0)+1;if(qty>p.stock)return alert('Quantidade indisponível.');if(item)item.qty=qty;else cart.push({id,size,color,qty});saveCart();showTab('carrinho')};showTab('detalhe')}
function showTab(t){tab=t;const el=$('#v5-panel');el.className='v5-panel';$('#v5-banner').style.display=t==='loja'?'':'none';$('#v5-categories').style.display=t==='loja'?'':'none';$('#v5-products').style.display=t==='loja'?'':'none';document.querySelectorAll('[data-v5-tab]').forEach(b=>b.classList.toggle('active',b.dataset.v5Tab===t));if(t==='loja'){el.hidden=true;return}el.hidden=false;if(t==='detalhe')return;if(t==='carrinho')return renderCart();if(t==='perfil')return renderProfile();if(t==='suporte')return renderSupport()}
function renderCart(){
 const el=$('#v5-panel');el.className='v5-panel v51-cart';let total=0;
 el.innerHTML='<div class="v51-screen-title"><button data-back aria-label="Voltar">←</button><h2>Minha sacola</h2></div>';
 el.querySelector('[data-back]').onclick=()=>showTab('loja');
 const valid=cart.filter(x=>products.some(p=>p.id===x.id));
 for(const x of valid){const p=products.find(p=>p.id===x.id);total+=Number(p.price)*x.qty;
 const line=document.createElement('article');line.className='v51-cart-line';
 line.innerHTML=`<img src="${esc(p.images[0])}" alt="${esc(p.name)}"><div><h3>${esc(p.name)}</h3><p>${esc(x.size)} · ${esc(x.color)}</p><strong>${fmt(p.price*x.qty)}</strong><div class="v51-qty"><button data-minus aria-label="Diminuir">−</button><span>${x.qty}</span><button data-plus aria-label="Aumentar">+</button><button data-remove aria-label="Remover">Remover</button></div></div>`;
 line.querySelector('[data-minus]').onclick=()=>{x.qty--;if(x.qty===0)cart.splice(cart.indexOf(x),1);saveCart();renderCart()};
 line.querySelector('[data-plus]').onclick=()=>{if(x.qty>=Number(p.stock))return alert('Limite de estoque atingido.');x.qty++;saveCart();renderCart()};
 line.querySelector('[data-remove]').onclick=()=>{cart.splice(cart.indexOf(x),1);saveCart();renderCart()};el.append(line)}
 if(!valid.length){el.insertAdjacentHTML('beforeend','<div class="v51-empty"><span>♧</span><h3>Sua sacola está vazia</h3><p>Os produtos escolhidos aparecerão aqui.</p><button id="v51-continue">Ver produtos</button></div>');$('#v51-continue').onclick=()=>showTab('loja');return}
 const sum=document.createElement('section');sum.className='v51-summary';sum.innerHTML=`<div><span>Subtotal</span><strong>${fmt(total)}</strong></div><small>Frete e disponibilidade serão confirmados pela loja.</small>`;el.append(sum);
 const btn=document.createElement('button');btn.className='v51-checkout';btn.textContent='Continuar pedido pelo WhatsApp';btn.onclick=()=>{const tel=String(settings.whatsapp||'').replace(/\D/g,'');if(!/^55\d{10,11}$/.test(tel))return alert('A loja ainda não configurou o WhatsApp para pedidos.');const lines=valid.map(x=>{const p=products.find(p=>p.id===x.id);return `${p.name} | ${x.size} | ${x.color} | ${x.qty} un. | ${fmt(p.price*x.qty)}`});const msg=`Olá! Gostaria de consultar este pedido na BIA MODA FEMININA:\n${lines.join('\n')}\nSubtotal: ${fmt(total)}\nCliente: ${user?.displayName||'Não informado'}\nAguardando confirmação de estoque e entrega.`;window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer')};el.append(btn)
}
function renderProfile(){
 const el=$('#v5-panel');el.className='v5-panel v51-profile';
 el.innerHTML=`<div class="v51-screen-title"><button data-back aria-label="Voltar">←</button><h2>Meu perfil</h2></div><div class="v51-profile-head"><div class="v51-profile-avatar">${esc((user?.displayName||user?.email||'B').charAt(0).toUpperCase())}</div><h3>${esc(user?.displayName||'Minha conta')}</h3><p>${esc(user?.email||'')}</p></div><form id="v51-profile-form"><label>Nome completo<input id="v5-name" maxlength="90" autocomplete="name" value="${esc(user?.displayName||'')}"></label><button type="submit">Salvar alterações</button></form><div class="v51-profile-options"><a href="./privacidade.html">Privacidade e dados <span>›</span></a><a href="./termos.html">Termos de uso <span>›</span></a><button id="v51-logout">Sair da conta <span>›</span></button><button id="v5-delete-account" class="v51-danger">Excluir minha conta <span>›</span></button></div>`;
 el.querySelector('[data-back]').onclick=()=>showTab('loja');
 $('#v51-profile-form').onsubmit=async e=>{e.preventDefault();try{await updateProfile(user,{displayName:$('#v5-name').value.trim()});$('#v51-avatar').textContent=(user.displayName||'B').charAt(0).toUpperCase();renderProfile();alert('Nome atualizado.')}catch{alert('Não foi possível atualizar o nome.')}};
 $('#v51-logout').onclick=()=>signOut(auth).catch(()=>alert('Não foi possível sair.'));
 $('#v5-delete-account').onclick=async()=>{if(!confirm('Excluir sua conta de autenticação? A exclusão de dados associados requer tratamento separado.'))return;try{await deleteUser(user);alert('Conta de autenticação excluída. Solicite à loja a exclusão dos dados associados.')}catch{alert('Entre novamente para confirmar a exclusão da conta.')}}
}
async function renderSupport(){
 const el=$('#v5-panel');el.className='v5-panel v51-support';el.innerHTML='<div class="v51-screen-title"><button data-back>←</button><h2>Atendimento BIA</h2></div><div class="v51-chat-status"><span>●</span> Atendimento da loja <small>Respostas enviadas pela equipe</small></div><div id="v51-messages" class="v51-messages" role="log" aria-live="polite"><p class="v51-chat-notice">Envie uma mensagem para iniciar seu atendimento.</p></div><form id="v51-chat-form"><textarea id="v5-message" maxlength="4000" rows="1" placeholder="Digite sua mensagem..." required></textarea><button type="submit" aria-label="Enviar mensagem">➤</button></form><p id="v51-chat-feedback" role="status"></p>';
 el.querySelector('[data-back]').onclick=()=>showTab('loja');
 try{
  const snapshot=await getDocs(query(collection(db,'support_tickets'),where('clientUid','==',user.uid)));
  const tickets=snapshot.docs.map(d=>({id:d.id,...d.data()})).filter(x=>!['resolvido','fechado','encerrado'].includes(x.status)).sort((a,b)=>(b.updatedAt?.seconds||0)-(a.updatedAt?.seconds||0));
  ticketId=tickets[0]?.id||null;
  if(ticketId){const ticket=tickets[0];const msgs=await getDocs(collection(db,'support_tickets',ticketId,'messages'));const items=msgs.docs.map(d=>d.data()).sort((a,b)=>(a.createdAt?.seconds||0)-(b.createdAt?.seconds||0));const box=$('#v51-messages');if(!box)return;box.replaceChildren();const initial=document.createElement('div');initial.className='v51-bubble client';initial.textContent=ticket.description||'';box.append(initial);for(const m of items){const bubble=document.createElement('div');bubble.className='v51-bubble '+(m.kind==='staff'?'staff':'client');bubble.textContent=m.text||'';box.append(bubble)}box.scrollTop=box.scrollHeight;}
 }catch(e){console.warn('Suporte:',e.code||e.message);$('#v51-chat-feedback').textContent='Não foi possível carregar conversas anteriores.'}
 $('#v51-chat-form').onsubmit=async e=>{e.preventDefault();const field=$('#v5-message'),msg=field.value.trim(),button=e.target.querySelector('button');if(msg.length<2)return;button.disabled=true;try{
  if(!ticketId){const ref=await addDoc(collection(db,'support_tickets'),{clientName:user.displayName||'',clientEmail:user.email||'',clientUid:user.uid,subject:'Atendimento pelo site',description:msg,priority:'normal',status:'aberto',createdAt:serverTimestamp(),updatedAt:serverTimestamp()});ticketId=ref.id;}
  else {await addDoc(collection(db,'support_tickets',ticketId,'messages'),{text:msg,authorUid:user.uid,authorName:user.displayName||'Cliente',kind:'client',createdAt:serverTimestamp()});await updateDoc(doc(db,'support_tickets',ticketId),{updatedAt:serverTimestamp()})}
  const bubble=document.createElement('div');bubble.className='v51-bubble client';bubble.textContent=msg;const box=$('#v51-messages');box.querySelector('.v51-chat-notice')?.remove();box.append(bubble);box.scrollTop=box.scrollHeight;field.value='';$('#v51-chat-feedback').textContent='Mensagem registrada.';
 }catch(err){$('#v51-chat-feedback').textContent='Não foi possível enviar: '+(err.code||'verifique sua conexão')}finally{button.disabled=false}}
}
document.querySelectorAll('[data-v5-tab]').forEach(b=>b.onclick=()=>showTab(b.dataset.v5Tab));$('#v5-support').onclick=()=>showTab('suporte');$('#v51-profile').onclick=()=>showTab('perfil');$('#v51-bag').onclick=()=>showTab('carrinho');document.querySelector('[data-v51-home]').onclick=e=>{e.preventDefault();showTab('loja')};init();
