// Importa seus provedores
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Importa o Roteador
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- ADIÇÕES PARA O LOGIN (Com caminhos corretos) ---
import { AuthProvider } from "@/contexts/AuthContext";      // Corrigido com @/
import PrivateRoute from "@/components/routes/PrivateRoute"; // Corrigido (sem {})
import { LoginPage } from "@/pages/Login";                 // Corrigido (arquivo é Login.tsx)
// ---------------------------------------------------

// Importa suas páginas (Padronizado com @/)
import Dashboard from "@/pages/Dashboard";
import Clientes from "@/pages/Clientes";
import Fornecedores from "@/pages/Fornecedores";
import Funcionarios from "@/pages/Funcionarios";
import Produtos from "@/pages/Produtos";
import Vendas from "@/pages/Vendas";
import Relatorios from "@/pages/Relatorios";
import Configuracoes from "@/pages/Configuracoes";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      {/* --- ORDEM CORRIGIDA --- */}
      <BrowserRouter>   {/* 1. O Roteador vem PRIMEIRO */}
        <AuthProvider>    {/* 2. A Autenticação vem DEPOIS (agora pode usar useNavigate) */}
          <Routes>
            {/* Rota Pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rotas Privadas */}
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
            <Route path="/fornecedores" element={<PrivateRoute><Fornecedores /></PrivateRoute>} />
            <Route path="/funcionarios" element={<PrivateRoute><Funcionarios /></PrivateRoute>} />
            <Route path="/produtos" element={<PrivateRoute><Produtos /></PrivateRoute>} />
            <Route path="/vendas" element={<PrivateRoute><Vendas /></PrivateRoute>} />
            <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
            <Route path="/configuracoes" element={<PrivateRoute><Configuracoes /></PrivateRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      {/* --- FIM DA CORREÇÃO --- */}

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;