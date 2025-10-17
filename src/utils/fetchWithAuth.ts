const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = new Headers(init.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const fullUrl = `${API_BASE_URL}${input}`;
  return fetch(fullUrl, { ...init, headers });
}