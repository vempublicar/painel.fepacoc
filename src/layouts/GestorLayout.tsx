import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function GestorLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar Gestor */}
      <Sidebar role="gestor" collapsed={collapsed} />

      {/* Conteúdo principal */}
      <main className="flex-1">
        <Header email="gestor@exemplo.com" onToggle={() => setCollapsed(!collapsed)} />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
