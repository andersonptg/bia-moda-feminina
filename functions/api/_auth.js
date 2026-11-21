// Firebase ID tokens: Google public keys, WebCrypto, no service-account secrets.
const PROJECT = 'bia-moda-feminina';
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const encoder = new TextEncoder();
function decodeBase64Url(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('Token invalido');
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}
function parsePart(value) { return JSON.parse(new TextDecoder().decode(decodeBase64Url(value))); }
export async function verifyFirebase(request) {
  const auth = request.headers.get('authorization') || '';
  if (auth.length > 8192) throw new Error('Token invalido');
  const token = /^Bearer ([A-Za-z0-9._-]+)$/.exec(auth)?.[1];
  if (!token) throw new Error('Token ausente');
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Token invalido');
  let header, payload;
  try { header = parsePart(parts[0]); payload = parsePart(parts[1]); }
  catch { throw new Error('Token invalido'); }
  const now = Math.floor(Date.now() / 1000);
  if (header?.alg !== 'RS256' || typeof header.kid !== 'string' || !header.kid ||
      payload?.aud !== PROJECT || payload.iss !== `https://securetoken.google.com/${PROJECT}` ||
      typeof payload.sub !== 'string' || !payload.sub || payload.sub.length > 128 ||
      !Number.isInteger(payload.exp) || payload.exp <= now ||
      !Number.isInteger(payload.iat) || payload.iat > now ||
      !Number.isInteger(payload.auth_time) || payload.auth_time > now ||
      payload.iat < payload.auth_time) throw new Error('Token invalido');
  let keys;
  try {
    const response = await fetch(JWKS_URL, { cf: { cacheTtl: 300, cacheEverything: true } });
    if (!response.ok) throw new Error();
    keys = (await response.json()).keys;
    if (!Array.isArray(keys)) throw new Error();
  } catch { throw new Error('Verificacao indisponivel'); }
  const jwk = keys.find(k => k.kid === header.kid && k.kty === 'RSA' && k.use === 'sig' && k.alg === 'RS256');
  if (!jwk) throw new Error('Token invalido');
  let valid = false;
  try {
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decodeBase64Url(parts[2]), encoder.encode(parts[0] + '.' + parts[1]));
  } catch { throw new Error('Token invalido'); }
  if (!valid) throw new Error('Token invalido');
  return payload;
}
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
}
export function fail(error) {
  const unavailable = error?.message === 'Verificacao indisponivel';
  return json({ error: unavailable ? 'Servico de autenticacao indisponivel' : 'Acesso negado' }, unavailable ? 503 : 401);
}
