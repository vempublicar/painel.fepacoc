import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  doc, getDoc, collection, query, where, getDocs, setDoc, // opcional deleteDoc
} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // 1) tenta users/{uid}
      let snap = await getDoc(doc(db, "users", uid));

      // 2) fallback: procura por campo uid (caso o doc tenha sido criado com ID aleatório)
      if (!snap.exists()) {
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const qs = await getDocs(q);

        if (!qs.empty) {
          const data = qs.docs[0].data();

          // Migra para users/{uid} (padroniza para o futuro)
          await setDoc(doc(db, "users", uid), data, { merge: true });

          // Opcional: deletar o antigo
          // await deleteDoc(qs.docs[0].ref);

          snap = await getDoc(doc(db, "users", uid));
        } else {
          throw new Error("USER_DOC_MISSING");
        }
      }

      const user = snap.data() as any;
      const role = user?.role || "empresa";

      if (role === "admin") navigate("/dashboard/admin");
      else if (role === "gestor") navigate("/dashboard/gestor");
      else navigate("/dashboard/empresa");

    } catch (err: any) {
      // Mensagens mais úteis
      const code = err?.code || err?.message || String(err);
      if (code.includes("auth/invalid-credential") || code.includes("auth/invalid-email") || code.includes("auth/wrong-password")) {
        setError("E-mail ou senha inválidos.");
      } else if (code.includes("USER_DOC_MISSING")) {
        setError("Sua conta foi autenticada, mas não possui perfil no Firestore. Fale com o admin.");
      } else if (code.includes("permission-denied")) {
        setError("Sem permissão para ler seu perfil. Verifique as regras do Firestore.");
      } else {
        setError("Não foi possível entrar. " + code);
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Coluna da esquerda */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center">
        <div className="text-center text-white px-8">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo de volta!</h1>
          <p className="text-lg opacity-90">
            Acesse seu painel e continue de onde parou 🚀
          </p>
        </div>
      </div>

      {/* Coluna da direita */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Login na sua conta
          </h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Entrar
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
