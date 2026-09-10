import verifier from '../admin-verifier.json';

const SESSION_KEY = 'azumi-admin-unlocked-v1';

function base64UrlToBytes(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

function bytesToBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyPassword(password) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: base64UrlToBytes(verifier.salt),
      iterations: verifier.iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  const actual = bytesToBase64Url(new Uint8Array(derivedBits));
  return constantTimeEqual(actual, verifier.hash);
}

export function isAdminUnlocked() {
  try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
}
export function unlockAdmin() {
  try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
}
export function lockAdmin() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}
