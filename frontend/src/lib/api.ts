// URL base da API Django
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Erro HTTP ${res.status}`);
  }

  // ✅ não tenta parsear JSON em respostas vazias (DELETE 204)
  if (res.status === 204) return null;

  return res.json();
}