import AdminLayout from "../layouts/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Bem-vindo, Admin!</h2>
      <p>Gerencie gestores, empresas e visualize relatórios globais.</p>
    </AdminLayout>
  );
}
