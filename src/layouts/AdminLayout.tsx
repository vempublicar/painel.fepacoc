import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar Admin */}
      <Sidebar role="admin" collapsed={collapsed} />

      {/* Conteúdo principal */}
      <main className="flex-1">
        <Header email="admin@exemplo.com" onToggle={() => setCollapsed(!collapsed)} />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
