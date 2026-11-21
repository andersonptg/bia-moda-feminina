export async function onRequestGet({params,env}){
 if(!env.BIA_MEDIA)return new Response('Armazenamento indisponível',{status:503});
 const path=Array.isArray(params.path)?params.path.join('/'):String(params.path||'');
 if(!/^shop\/(products|banners)\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(path))return new Response('Não encontrado',{status:404});
 const obj=await env.BIA_MEDIA.get(path);if(!obj)return new Response('Não encontrado',{status:404});
 const headers=new Headers();obj.writeHttpMetadata(headers);headers.set('cache-control','public, max-age=3600');headers.set('x-content-type-options','nosniff');
 return new Response(obj.body,{headers});
}
