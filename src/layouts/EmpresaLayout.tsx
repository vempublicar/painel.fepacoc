import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function EmpresaLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar Empresa */}
      <Sidebar role="empresa" collapsed={collapsed} />

      {/* Conteúdo principal */}
      <main className="flex-1">
        <Header email="empresa@exemplo.com" onToggle={() => setCollapsed(!collapsed)} />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
