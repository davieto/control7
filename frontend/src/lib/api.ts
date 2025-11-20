// frontend/src/lib/api.ts

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  // 🔑 CORRIGIDO: Busca pela chave padronizada 'access_token'
  const accessToken = localStorage.getItem("access_token"); 
  
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // Garante que o endpoint tenha uma barra inicial, se necessário.
  const finalEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const res = await fetch(`${API_BASE_URL}${finalEndpoint}`, {
    ...options,
    headers: headers,
  });

  if (!res.ok) {
    let errorData;

    try {
      errorData = await res.json();
    } catch {
      const text = await res.text();
      errorData = { detail: text || `Erro HTTP ${res.status}` };
    }

    throw {
      response: {
        status: res.status,
        data: errorData
      }
    };
  }

  if (res.status === 204) return null;

  return res.json();
}