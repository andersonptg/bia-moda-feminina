import { verifyFirebase, json, fail } from './_auth.js';
const EDITORS = new Set(['owner', 'tech_owner', 'admin1', 'admin2', 'catalogo']);
const MIME = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_SIZE = 8 * 1024 * 1024;
export async function onRequestPost({ request, env }) {
  let user;
  try { user = await verifyFirebase(request); } catch (error) { return fail(error); }
  if (!EDITORS.has(user.biaRole)) return json({ error: 'Cargo sem permissao' }, 403);
  if (!env.BIA_MEDIA) return json({ error: 'R2 nao configurado' }, 503);
  if (!/^multipart\/form-data\s*;/i.test(request.headers.get('content-type') || '')) return json({ error: 'Formato invalido' }, 400);
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > MAX_SIZE + 1024 * 1024) return json({ error: 'Arquivo muito grande' }, 413);
  let form;
  try { form = await request.formData(); } catch { return json({ error: 'Formulario invalido' }, 400); }
  const file = form.get('file'), folder = form.get('folder');
  if (!file || typeof file.arrayBuffer !== 'function' || !Number.isFinite(file.size) || file.size < 12 || file.size > MAX_SIZE)
    return json({ error: 'Imagem invalida ou maior que 8 MB' }, 400);
  const ext = MIME[file.type];
  if (!ext || !['products', 'banners'].includes(folder)) return json({ error: 'Formato ou pasta invalidos' }, 400);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const png = [137, 80, 78, 71, 13, 10, 26, 10];
  const valid = ext === 'jpg' ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 && bytes.at(-2) === 255 && bytes.at(-1) === 217
    : ext === 'png' ? png.every((v, i) => bytes[i] === v)
    : String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  if (!valid) return json({ error: 'Conteudo nao corresponde ao formato da imagem' }, 400);
  const key = `shop/${folder}/${crypto.randomUUID()}.${ext}`;
  try {
    await env.BIA_MEDIA.put(key, bytes, { httpMetadata: { contentType: file.type }, customMetadata: { authorUid: user.sub } });
  } catch { return json({ error: 'Nao foi possivel salvar a imagem' }, 503); }
  return json({ url: `/api/media/${key}`, key }, 201);
}
