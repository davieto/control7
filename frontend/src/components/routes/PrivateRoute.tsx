import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

// 1. Mude a tipagem de { children: JSX.Element } para ReactNode
interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    // Um loading simples para não piscar o login
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Envolva o children em um Fragmento (<>...</>)
  // Isso garante que, mesmo se houver múltiplos filhos, o retorno seja um único objeto JSX válido
  return <>{children}</>;
}