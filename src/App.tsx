import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

// Páginas
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import GestorDashboard from "./pages/GestorDashboard";
import EmpresaDashboard from "./pages/EmpresaDashboard";
import RegisterGestor from "./pages/RegisterGestor";
import AdminGestores from "./pages/AdminGestores";
import AdminEmpresas from "./pages/AdminEmpresas";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <p className="animate-pulse">Carregando...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

function RoleRedirect() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setRole(data.role || null);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (role === "admin") navigate("/dashboard/admin");
      else if (role === "gestor") navigate("/dashboard/gestor");
      else if (role === "empresa") navigate("/dashboard/empresa");
      else navigate("/login"); // fallback
    }
  }, [role, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <p className="animate-pulse">Carregando...</p>
      </div>
    );
  }

  return null; // redireciona automaticamente
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/gestor" element={<RegisterGestor />} />

        {/* Rota de decisão: verifica role e manda pro dashboard certo */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <RoleRedirect />
            </PrivateRoute>
          }
        />

        {/* Dashboards individuais */}
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/gestor"
          element={
            <PrivateRoute>
              <GestorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/empresa"
          element={
            <PrivateRoute>
              <EmpresaDashboard />
            </PrivateRoute>
          }
        />

        {/* Sub-rotas do Admin */}
        <Route
          path="/dashboard/admin/gestores"
          element={
            <PrivateRoute>
              <AdminGestores />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin/empresas"
          element={
            <PrivateRoute>
              <AdminEmpresas />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
