import type { Property } from '../types';

const TOKEN_KEY = 'adminToken';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
export const setToken = (t: string | null) => {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('isAdmin'); // ancienne clé, plus utilisée
  } catch {
    /* stockage indisponible */
  }
};

export class AuthError extends Error {}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const res = await fetch(url, { ...init, headers });
  if (res.status === 401) {
    setToken(null);
    throw new AuthError('Session expirée, veuillez vous reconnecter.');
  }
  if (!res.ok) {
    let msg = `Erreur ${res.status}`;
    try {
      const data = await res.json();
      msg = data.message || data.error || msg;
    } catch {
      /* réponse non JSON */
    }
    throw new Error(msg);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  async login(username: string, password: string) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.token) throw new Error(data.error || 'Identifiants incorrects');
    setToken(data.token);
  },
  checkSession: () => request<{ ok: boolean }>('/api/session'),
  list: () => request<Property[]>('/api/admin/properties'),
  create: (p: Partial<Property>) => request<Property>('/api/properties', { method: 'POST', body: JSON.stringify(p) }),
  update: (id: string, p: Partial<Property>) => request<Property>(`/api/properties/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  remove: (id: string) => request<void>(`/api/properties/${id}`, { method: 'DELETE' }),
  library: () => request<string[]>('/api/storage/images'),
  async upload(file: File): Promise<string> {
    const fd = new FormData();
    fd.append('image', await compressImage(file));
    const data = await request<{ url: string }>('/api/upload', { method: 'POST', body: fd });
    return data.url;
  },
};

/**
 * Redimensionne et compresse une photo dans le navigateur avant l'envoi
 * (max 2000 px, WebP). Un fichier de 8 Mo devient ~300 Ko : le site se charge bien plus vite.
 */
export async function compressImage(file: File, maxSize = 2000, quality = 0.82): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' });
  } catch {
    return file;
  }
}
