import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function RegisterGestor() {
  const [params] = useSearchParams();
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const token = params.get("token");

  // Valida token
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setError("Token inválido.");
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "invites", token));
      if (!snap.exists()) {
        setError("Convite não encontrado.");
        setLoading(false);
        return;
      }

      const data = snap.data();
      if (data.status !== "pending") {
        setError("Convite já utilizado ou expirado.");
        setLoading(false);
        return;
      }

      setInvite({ id: snap.id, ...data });
      setLoading(false);
    };
    checkToken();
  }, [token]);

  // Cadastrar usuário
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite) return;

    try {
      const cred = await createUserWithEmailAndPassword(auth, invite.email, password);

      // Cria perfil em users
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email: invite.email,
        role: "gestor",
        invite_id: invite.id,
        created_at: serverTimestamp(),
      });

      // Marca convite como usado
      await updateDoc(doc(db, "invites", invite.id), {
        status: "used",
        used_at: serverTimestamp(),
      });

      navigate("/dashboard/gestor");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p className="p-6">Carregando...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Registro de Gestor</h1>
        <p className="mb-6 text-gray-600">Convite para: {invite.email}</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Senha</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
