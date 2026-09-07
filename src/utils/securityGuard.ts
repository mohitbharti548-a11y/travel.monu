/**
 * Rust-inspired Zero-Trust Security & Firewall Module
 * Provides timing-safe comparisons, input sanitization, anti-tamper session integrity,
 * prototype pollution protection, and brute-force defenses.
 */

// Master Passkey
const MASTER_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY || '963210';
const INTEGRITY_SALT = 'hn_nomad_sec_salt_2026_spiti';

/**
 * Constant-time string comparison to prevent side-channel timing attacks.
 * Emulates Rust's subtle::ConstantTimeEq.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  const strA = String(a || '');
  const strB = String(b || '');
  
  const lenA = strA.length;
  const lenB = strB.length;
  let result = lenA ^ lenB;

  const maxLen = Math.max(lenA, lenB);
  for (let i = 0; i < maxLen; i++) {
    const charA = i < lenA ? strA.charCodeAt(i) : 0;
    const charB = i < lenB ? strB.charCodeAt(i) : 0;
    result |= charA ^ charB;
  }

  return result === 0;
}

/**
 * Validates the admin passkey with timing-attack immunity.
 */
export function verifyAdminPasskey(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return timingSafeEqual(input.trim(), MASTER_PASSKEY);
}

/**
 * Fast DJB2 hash generator with salt for integrity check.
 */
function computeIntegrityHash(payload: string): string {
  let hash = 5381;
  const combined = `${payload}:${INTEGRITY_SALT}`;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) + hash) + combined.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return (hash >>> 0).toString(16);
}

/**
 * Creates a tamper-evident signed session token.
 */
export function createSignedAdminSession(adminName: string = 'Monu (Master Creator)'): {
  role: 'super_admin';
  adminName: string;
  loginTime: string;
  token: string;
  sig: string;
} {
  const now = new Date().toISOString();
  const randomEntropy = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  const token = `HN-MASTER-${Date.now()}-${randomEntropy}`;
  const sig = computeIntegrityHash(`${token}:${now}:super_admin`);

  return {
    role: 'super_admin',
    adminName,
    loginTime: now,
    token,
    sig
  };
}

/**
 * Validates session integrity, token structure, and expiration (< 8 hours).
 */
export function validateAdminSession(session: any): boolean {
  if (!session || typeof session !== 'object') return false;
  if (session.role !== 'super_admin') return false;
  if (!session.token || !session.token.startsWith('HN-MASTER-')) return false;
  if (!session.loginTime || !session.sig) return false;

  // Check signature
  const expectedSig = computeIntegrityHash(`${session.token}:${session.loginTime}:super_admin`);
  if (!timingSafeEqual(session.sig, expectedSig)) {
    console.warn('[SECURITY] Session signature mismatch. Potential tampering detected.');
    return false;
  }

  // Check 8-hour expiry
  const loginTime = new Date(session.loginTime).getTime();
  const now = Date.now();
  if (isNaN(loginTime) || now - loginTime > 8 * 60 * 60 * 1000 || loginTime > now + 60000) {
    return false;
  }

  return true;
}

/**
 * Input sanitization & attack signature detection (XSS, SQLi, Null Bytes, Path Traversal)
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/\0/g, '') // Remove null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '') // Remove inline handlers like onclick=
    .trim();
}

/**
 * Deep object sanitizer against prototype pollution (__proto__, constructor)
 */
export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as any;
  }

  const clean: any = {};
  for (const key of Object.keys(obj as any)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue; // Block prototype pollution vectors
    }
    const val = (obj as any)[key];
    clean[key] = (typeof val === 'object' && val !== null) ? sanitizeObject(val) : val;
  }
  return clean as T;
}

/**
 * Clickjacking & Frame Busting protection
 */
export function enforceFrameIsolation(): void {
  if (typeof window !== 'undefined' && window.top && window.top !== window.self) {
    try {
      window.top.location = window.self.location;
    } catch {
      // Sandboxed iframe blocked redirection
      document.body.innerHTML = '<div style="padding:40px;background:#030712;color:#f87171;font-family:sans-serif;text-align:center;"><h2>Security Violation: Framing not allowed.</h2></div>';
    }
  }
}
