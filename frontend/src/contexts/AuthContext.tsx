import React, { createContext, useEffect, useState, ReactNode } from "react"; 
// REMOVIDO: import { useNavigate } from "react-router-dom"; <--- REMOVIDO

// 1. Adicionei 'loading' na tipagem
type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean; 
  login: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true, // Valor padrão inicial
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 2. Estado de carregamento começa como TRUE
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica o token ao montar o componente
    const recuperarToken = () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        // Aqui você poderia validar o token com a API se quisesse
        setIsAuthenticated(true);
      }
      
      // 3. Finaliza o carregamento (seja logado ou não)
      setLoading(false);
    };

    recuperarToken();
  }, []);

  function login(accessToken: string, refreshToken?: string) {
    // Padronizado: Salva como 'access_token'
    localStorage.setItem("access_token", accessToken);
    
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
    
    setIsAuthenticated(true);
    navigate("/"); // Redireciona para o Dashboard
  }

  function logout() {
    // Padronizado: Remove os tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_nivel"); // Limpa o cache da sidebar tb
    localStorage.removeItem("user_nome");
    
    setIsAuthenticated(false);
    // REMOVIDO: navigate("/login"); <--- REMOVIDO
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}