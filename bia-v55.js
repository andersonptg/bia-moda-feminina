/* BIA V5.5 - move controles fixos para body e abre parceiros como modal. */
(()=>{'use strict';
const nav=document.querySelector('#next-screen .v5-bottom');
const support=document.querySelector('#next-screen #v5-support');
const partners=document.getElementById('parceiros');
const open=document.getElementById('bia-show-partners');
const close=document.getElementById('bia-close-partners');
if(!nav||!support||!partners||!open||!close)return;
nav.classList.add('bia-v55-nav');support.classList.add('bia-v55-float');partners.classList.add('bia-v55-overlay');
document.body.append(nav,support,partners);
const sync=()=>{const shop=!!document.querySelector('#next-screen:not([hidden])');document.body.classList.toggle('bia-v55-shop',shop);nav.hidden=!shop;support.hidden=!shop;};
const observer=new MutationObserver(sync);observer.observe(document.getElementById('next-screen'),{attributes:true,attributeFilter:['hidden']});sync();
function show(){partners.hidden=false;document.body.classList.add('bia-v55-modal');open.setAttribute('aria-expanded','true');close.focus({preventScroll:true});}
function hide(){partners.hidden=true;document.body.classList.remove('bia-v55-modal');open.setAttribute('aria-expanded','false');open.focus({preventScroll:true});}
open.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();show();},true);
close.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();hide();},true);
partners.addEventListener('click',e=>{if(e.target===partners)hide()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!partners.hidden)hide()});
})();
