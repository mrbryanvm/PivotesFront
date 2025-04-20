'use Client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Logo */}
      <Link href="/">
        <div className="text-2xl font-bold text-orange-500">REDIBO</div>
      </Link>

      {/* Ícono de usuario */}
      <div className="flex items-center">
        <Link href="/profile">
          <div className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center">
            <span className="text-orange-500">👤</span>
          </div>
        </Link>
      </div>
    </header>
  );
}