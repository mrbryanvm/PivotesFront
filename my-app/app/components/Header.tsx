'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../lib/authContext';

export default function Header() {
  const { logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Logo */}
      <Link href="/">
        <div className="text-2xl font-bold text-orange-500">REDIBO</div>
      </Link>

      {/* contenedor icono*/}
      <div className="fixed top-4 right-4 flex items-center space-x-2">

        {/* Botón "Cerrar sesión"  */}
        {showLogout && (
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow hover:bg-orange-100 text-black font-medium transition-all duration-300"
          >
            <FiLogOut className="text-xl" />
            <span>Cerrar sesión</span>
          </button>
        )}

        {/* Ícono de usuario*/}
        <button
          onClick={() => setShowLogout(!showLogout)}
          className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center hover:bg-orange-100"
          title="Opciones de usuario"
        >
          <span className="text-orange-500">👤</span>
        </button>
      </div>
    </header>
  );
}