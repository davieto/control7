import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Settings,
  Warehouse,
  UserCog
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Clientes", path: "/clientes" },
  { icon: Warehouse, label: "Fornecedores", path: "/fornecedores" },
  { icon: UserCog, label: "Funcionários", path: "/funcionarios", restrito: true },
  { icon: Package, label: "Produtos", path: "/produtos" },
  { icon: ShoppingCart, label: "Vendas", path: "/vendas" },
  { icon: TrendingUp, label: "Relatórios", path: "/relatorios" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

export const Sidebar = () => {
  const location = useLocation();

  // 1. TRUQUE: Tenta ler do LocalStorage primeiro. Se tiver lá, carrega instantâneo.
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("user_nivel");
    const nomeSalvo = localStorage.getItem("user_nome");
    return {
      nome: nomeSalvo || "Carregando...",
      nivel: salvo || "", // Se tiver 'admin' salvo, o botão já aparece na hora
      iniciais: "..."
    };
  });

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const data = await apiFetch("/configuracoes/usuario/");
        if (data) {
          const nomeCompleto = data.first_name || data.username || "Usuário";
          const nivel = data.nivel_acesso || "";

          // Lógica iniciais
          const partesNome = nomeCompleto.trim().split(" ");
          const inicial1 = partesNome[0] ? partesNome[0][0].toUpperCase() : "";
          const inicial2 = partesNome.length > 1 ? partesNome[partesNome.length - 1][0].toUpperCase() : "";
          
          // 2. Salva no LocalStorage para a próxima vez ser instantâneo
          localStorage.setItem("user_nivel", nivel);
          localStorage.setItem("user_nome", nomeCompleto);

          setUsuario({
            nome: nomeCompleto,
            nivel: nivel,
            iniciais: inicial1 + inicial2 || inicial1
          });
        }
      } catch (error) {
        console.error("Erro sidebar:", error);
      }
    };

    carregarDadosUsuario();
  }, []);

  // --- LÓGICA DE FILTRO ---
  const menuFiltrado = menuItems.filter((item) => {
    if (item.restrito) {
      // Se o nível for vazio (primeiro acesso da vida), ele esconde.
      // Mas se já acessou antes, o localStorage garante que não pisque.
      if (!usuario.nivel) return false; 
      
      const nivel = usuario.nivel.toLowerCase();
      return nivel === "admin" || nivel === "administrador";
    }
    return true;
  });

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-foreground">
          Sistema de Vendas
        </h1>
        <p className="text-sm text-sidebar-foreground/60 mt-1">Gestão Completa</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuFiltrado.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-medium"
                  : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold text-sm">
            {usuario.iniciais}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-sidebar-foreground truncate" title={usuario.nome}>
              {usuario.nome}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate capitalize">
              {usuario.nivel || "..."}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

