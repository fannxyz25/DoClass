import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../components/UserContext';
import axios from 'axios';
import { motion } from 'framer-motion';
// import Logo from '../../assets/Logo.png'; // Assuming Logo is in assets

function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalKelas: 0,
    totalMateri: 0,
    totalTugas: 0
  });

  useEffect(() => {
    if (!user || user.role !== 'siswa') {
      navigate('/login');
      return;
    }

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/siswa/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        // Optional: add a small delay to see the initial animation
        // await new Promise(resolve => setTimeout(resolve, 100));
      }
    };

    fetchStats();
  }, [user, navigate]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
      transition: {
        duration: 0.3
      }
    }
  };

   const buttonVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(9, 132, 227, 0.3)",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.97
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-blue-800 mb-2">Selamat Datang, {user?.username || 'Siswa'}! 👋</h1>
              <p className="text-gray-600 text-lg">Dashboard Pembelajaran Anda</p>
            </div>
            <button
              onClick={() => navigate('/kelas')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-3 text-lg font-semibold"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Lihat Kelas
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium">Total Kelas</h3>
                <p className="text-3xl font-bold text-blue-800">{stats.totalKelas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium">Total Materi</h3>
                <p className="text-3xl font-bold text-blue-800">{stats.totalMateri}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium">Total Tugas</h3>
                <p className="text-3xl font-bold text-blue-800">{stats.totalTugas}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/kelas')}
              className="flex items-center gap-4 p-6 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all duration-300 border border-blue-200"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-blue-800 font-semibold text-lg">Lihat Kelas</h3>
                <p className="text-sm text-blue-600">Akses kelas dan materi pembelajaran</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/materi')}
              className="flex items-center gap-4 p-6 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all duration-300 border border-blue-200"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-blue-800 font-semibold text-lg">Materi Pembelajaran</h3>
                <p className="text-sm text-blue-600">Pelajari materi sesuai level Anda</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/tugas')}
              className="flex items-center gap-4 p-6 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all duration-300 border border-blue-200"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-blue-800 font-semibold text-lg">Tugas & Ujian</h3>
                <p className="text-sm text-blue-600">Kerjakan tugas dan ujian untuk naik level</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 