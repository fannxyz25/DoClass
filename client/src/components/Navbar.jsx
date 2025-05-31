import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    const fetchUser = async () => {
      if (user && user._id) {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`http://localhost:5000/api/users/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(res.data);
          // Also update the user in the context and local storage
          updateUser(res.data);
        } catch (error) {
          console.error('Error fetching user data for Navbar:', error);
          // If fetching fails, use the user data from the context
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
    };

    fetchUser();

  }, [user, updateUser]); // Re-fetch if user in context changes

  const handleLogout = () => {
    updateUser(null);
    navigate('/');
  };

  const getKelasRoute = () => {
    if (!user) return '/';
    return user.role === 'guru' ? '/guru/kelas' : '/kelas';
  };

  return (
    <nav className="text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to={getKelasRoute()} className="text-xl font-bold">
              DoClass
            </Link>
            {/* Removed navigation links as requested */}
            {/* <Link
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
            </Link> */}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-black font-sans">
              {currentUser ? 
                `${currentUser.username} (${currentUser.role}${currentUser.role !== 'guru' && (currentUser.current_level === 'SMK-1' || (currentUser.points !== undefined && currentUser.points === 0)) ? ' | Level 0' : (currentUser.role !== 'guru' && currentUser.current_level ? ' | ' + currentUser.current_level : '')})`
               : ''}
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
