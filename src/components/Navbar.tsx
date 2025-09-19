import React from 'react';

interface Props {
  onLogout?: () => void;
}

const links = [
  { href: '/login', label: 'Login' },
  { href: '/dashboard', label: 'Dashboard' }
];

const Navbar: React.FC<Props> = ({ onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow">
      <div className="font-semibold text-lg">Admin Panel</div>

      <ul className="flex gap-4">
        {links.map((l) => (
          <li key={l.href}>
            <a className="hover:underline" href={l.href}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      {onLogout && (
        <button
          onClick={onLogout}
          className="bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;