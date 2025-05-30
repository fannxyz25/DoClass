import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const handleLogout = () => {
    updateUser(null);
    navigate('/');
  };

  const getKelasRoute = () => {
    if (!user) return '/';
    return user.role === 'guru' ? '/guru/kelas' : '/kelas';
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/beranda" className="text-xl font-bold">
              DoClass
            </Link>
            <Link
              to={getKelasRoute()}
              className="hover:text-gray-300 transition-colors"
            >
              Ruang Kelas
            </Link>
            <Link to="/modul" className="hover:text-gray-300 transition-colors">
              Modul
            </Link>
            <Link to="/ujian" className="hover:text-gray-300 transition-colors">
              Ujian
            </Link>
            <Link to="/ranking" className="hover:text-gray-300 transition-colors">
              Peringkat
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {user ? `${user.username} (${user.role})` : ''}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
