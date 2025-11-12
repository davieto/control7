import React, { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext"; // Importa o seu contexto
import { Button } from "@/components/ui/button"; // (Opcional: use seu componente de botão)
import { LogOut } from "lucide-react"; // (Opcional: para ícone)

export default function LogoutButton() {
  // Pega a função 'logout' do seu contexto
  const { logout } = useContext(AuthContext);

  return (
    <Button 
      variant="ghost" // (use o variant que preferir)
      size="icon" 
      onClick={logout} // <--- A MÁGICA ACONTECE AQUI
      aria-label="Sair"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}

