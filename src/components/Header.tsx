import { auth } from "../firebase";
import { FiMenu } from "react-icons/fi";

export default function Header({ email, onToggle }: { email: string; onToggle: () => void }) {
  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="flex justify-between items-center bg-white shadow-sm px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className="text-gray-700 hover:text-indigo-600 transition"
        >
          <FiMenu size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{email}</span>        
      </div>
    </header>
  );
}
