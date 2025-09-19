import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import Card from "../components/Card";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminEmpresas() {
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar convites pendentes
  const fetchInvites = async () => {
    const q = query(
      collection(db, "invites"),
      where("role", "==", "empresa"),
      where("status", "==", "pending")
    );
    const snap = await getDocs(q);
    setInvites(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  // Buscar empresas ativas
  const fetchEmpresas = async () => {
    const q = query(collection(db, "users"), where("role", "==", "empresa"));
    const snap = await getDocs(q);
    setEmpresas(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchInvites();
    fetchEmpresas();
  }, []);

  // Criar convite
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "invites"), {
        email,
        role: "empresa",
        status: "pending",
        created_at: serverTimestamp(),
        token: crypto.randomUUID(),
        expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        invited_by: "adminUID",
      });
      setEmail("");
      await fetchInvites();
    } catch (err) {
      console.error("Erro ao criar convite", err);
    } finally {
      setLoading(false);
    }
  };

  // Cancelar convite
  const handleCancelInvite = async (id: string) => {
    try {
      await updateDoc(doc(db, "invites", id), { status: "expired" });
      await fetchInvites();
    } catch (err) {
      console.error("Erro ao cancelar convite", err);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">Empresas</h2>

      {/* Form de convite */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">Convidar nova Empresa</h3>
        <form onSubmit={handleInvite} className="flex gap-4">
          <input
            type="email"
            placeholder="empresa@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Enviando..." : "Convidar"}
          </button>
        </form>
      </Card>

      {/* Convites pendentes */}
      <Card>
        <h3 className="text-lg font-bold mb-4">Convites Pendentes</h3>
        {invites.length === 0 ? (
          <p className="text-gray-500">Nenhum convite pendente.</p>
        ) : (
          <ul className="space-y-2">
            {invites.map((invite) => (
              <li
                key={invite.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
              >
                <span>{invite.email}</span>
                <span className="text-sm text-gray-500">
                  Expira em:{" "}
                  {invite.expiration_date?.toDate?.().toLocaleDateString?.() ??
                    "—"}
                </span>
                <button
                  onClick={() => handleCancelInvite(invite.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Cancelar
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Empresas ativas */}
      <Card>
        <h3 className="text-lg font-bold mb-4">Empresas Ativas</h3>
        {empresas.length === 0 ? (
          <p className="text-gray-500">Nenhuma empresa cadastrada.</p>
        ) : (
          <ul className="space-y-2">
            {empresas.map((empresa) => (
              <li
                key={empresa.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
              >
                <span>{empresa.email}</span>
                <span className="text-sm text-gray-500">
                  Status: {empresa.status || "pendente"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AdminLayout>
  );
}
