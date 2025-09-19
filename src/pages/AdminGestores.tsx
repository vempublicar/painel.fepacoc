import AdminLayout from "../layouts/AdminLayout";
import Card from "../components/Card";

export default function AdminGestores() {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">Gestores</h2>

      {/* Aqui entra seu formulário de convite + listas de convites e ativos */}
      <Card>
        <p>Formulário de convite + listas vão aqui...</p>
      </Card>
    </AdminLayout>
  );
}
