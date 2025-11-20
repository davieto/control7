import React, { createContext, useEffect, useState, ReactNode } from "react"; 
// REMOVIDO: import { useNavigate } from "react-router-dom"; <--- REMOVIDO

type AuthContextType = {
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// Tipagem correta para o children
export function AuthProvider({ children }: { children: ReactNode }) { 
  // Padronizado: Busca por 'access_token'
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("access_token"));
  
  // REMOVIDO: const navigate = useNavigate(); <--- REMOVIDO

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("access_token"));
  }, []);

  function login(accessToken: string, refreshToken?: string) {
    // Padronizado: Salva como 'access_token'
    localStorage.setItem("access_token", accessToken);
    
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
    
    setIsAuthenticated(true);
    // REMOVIDO: navigate("/"); <--- REMOVIDO
  }

  function logout() {
    // Padronizado: Remove os tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    // REMOVIDO: navigate("/login"); <--- REMOVIDO
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}