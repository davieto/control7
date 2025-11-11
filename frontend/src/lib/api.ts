export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const token = localStorage.getItem("token"); 
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: headers,
  });

if (!res.ok) {
  let errorData;

  try {
    // Tenta ler como JSON
    errorData = await res.json();
  } catch {
    // Se falhar (não é JSON), lê como texto
    const text = await res.text();
    errorData = { detail: text || `Erro HTTP ${res.status}` };
  }

  // Lança o erro em formato consistente
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
