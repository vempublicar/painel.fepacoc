import { Link, useLocation } from "react-router-dom";
import {
  FiHome, FiUsers, FiSettings, FiBarChart2, FiCheckCircle, FiClipboard, FiBriefcase, FiLogOut 
} from "react-icons/fi";

export default function Sidebar({ role, collapsed = false }: { role: string; collapsed?: boolean }) {
  const location = useLocation();

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
      location.pathname === path
        ? "bg-white/20 text-white font-semibold"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside
      className={`bg-gradient-to-b from-indigo-600 to-purple-700 text-white min-h-screen p-4 transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo/Título */}
      <h2 className={`text-2xl font-bold mb-6 ${collapsed ? "hidden" : "block"}`}>
        Fepacoc
      </h2>

      <nav className="space-y-2">
        {/* Admin */}
        {role === "admin" && (
          <>
            <Link to="/dashboard/admin" className={linkClass("/dashboard/admin")}>
              <FiHome size={20} />
              {!collapsed && "Visão Geral"}
            </Link>
            <Link to="/dashboard/admin/gestores" className={linkClass("/dashboard/admin/gestores")}>
              <FiUsers size={20} />
              {!collapsed && "Gestores"}
            </Link>
            <Link to="/dashboard/admin/empresas" className={linkClass("/dashboard/admin/empresas")}>
              <FiBriefcase size={20} />
              {!collapsed && "Empresas"}
            </Link>
            <Link to="/dashboard/admin/config" className={linkClass("/dashboard/admin/config")}>
              <FiSettings size={20} />
              {!collapsed && "Configurações"}
            </Link>
          </>
        )}

        {/* Gestor */}
        {role === "gestor" && (
          <>
            <Link to="/dashboard/gestor" className={linkClass("/dashboard/gestor")}>
              <FiHome size={20} />
              {!collapsed && "Visão Geral"}
            </Link>
            <Link to="/dashboard/gestor/empresas" className={linkClass("/dashboard/gestor/empresas")}>
              <FiBriefcase size={20} />
              {!collapsed && "Empresas Vinculadas"}
            </Link>
            <Link to="/dashboard/gestor/ia" className={linkClass("/dashboard/gestor/ia")}>
              <FiBarChart2 size={20} />
              {!collapsed && "IA Consultiva"}
            </Link>
            <Link to="/dashboard/gestor/config" className={linkClass("/dashboard/gestor/config")}>
              <FiSettings size={20} />
              {!collapsed && "Configurações"}
            </Link>
          </>
        )}

        {/* Empresa */}
        {role === "empresa" && (
          <>
            <Link to="/dashboard/empresa" className={linkClass("/dashboard/empresa")}>
              <FiHome size={20} />
              {!collapsed && "Resumo"}
            </Link>
            <Link to="/dashboard/empresa/planejamento" className={linkClass("/dashboard/empresa/planejamento")}>
              <FiClipboard size={20} />
              {!collapsed && "Planejamento"}
            </Link>
            <Link to="/dashboard/empresa/execucao" className={linkClass("/dashboard/empresa/execucao")}>
              <FiCheckCircle size={20} />
              {!collapsed && "Execução (OKRs)"}
            </Link>
            <Link to="/dashboard/empresa/resultados" className={linkClass("/dashboard/empresa/resultados")}>
              <FiBarChart2 size={20} />
              {!collapsed && "Resultados"}
            </Link>
            <Link to="/dashboard/empresa/funcionarios" className={linkClass("/dashboard/empresa/funcionarios")}>
              <FiUsers size={20} />
              {!collapsed && "Funcionários"}
            </Link>
            <Link to="/dashboard/empresa/ia" className={linkClass("/dashboard/empresa/ia")}>
              <FiSettings size={20} />
              {!collapsed && "IA Consultiva"}
            </Link>
          </>
        )}
      </nav>
            {/* Rodapé com botão de sair */}
      <div className="absolute bottom-4 left-0 w-full px-4">
        <button
          onClick={async () => {
            await import("../firebase").then(({ auth }) => auth.signOut());
            window.location.href = "/";
          }}
          className="flex items-center gap-3 w-full px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all"
        >
          <FiLogOut size={20} />
          {!collapsed && "Sair"}
        </button>
      </div>

    </aside>
  );
}
