import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../components/UserContext";

function Beranda() {
  const { user, updateUser } = useUser();
  const [stats, setStats] = useState({
    totalKelas: 0,
    totalSiswa: 0,
    totalModul: 0
  });
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
          updateUser(res.data);
        } catch (error) {
          console.error('Error fetching user data for Beranda:', error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
    };

    fetchUser();

    if (user?.role === "guru") {
      loadGuruStats();
    }
  }, [user, updateUser]);

  const loadGuruStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stats/guru");
      setStats(res.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const GuruDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">Selamat Datang, {currentUser?.name}! 👋</h1>
        <p className="text-gray-600 text-lg">Dashboard Pengajar Anda</p>
      </div>

      {/* Stats Grid */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Total Siswa</h3>
              <p className="text-3xl font-bold text-blue-800">{stats.totalSiswa}</p>
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
              <h3 className="text-gray-600 text-sm font-medium">Total Modul</h3>
              <p className="text-3xl font-bold text-blue-800">{stats.totalModul}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Menu Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => window.location.href = '/ruang-kelas'}
            className="flex items-center gap-4 p-6 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all duration-300 border border-blue-200"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-blue-800 font-semibold text-lg">Kelola Kelas</h3>
              <p className="text-sm text-blue-600">Buat dan atur kelas, tambah modul dan ujian</p>
            </div>
          </button>

          <button
            onClick={() => window.location.href = '/modul'}
            className="flex items-center gap-4 p-6 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all duration-300 border border-blue-200"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="text-blue-800 font-semibold text-lg">Kelola Modul</h3>
              <p className="text-sm text-blue-600">Buat dan edit modul pembelajaran</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const SiswaDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">Selamat Datang, {currentUser?.name}! 👋</h1>
        <p className="text-gray-600 text-lg">Level Anda: <span className="font-semibold text-blue-600">{currentUser?.current_level}</span></p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => window.location.href = '/modul'}
          className="flex items-center gap-4 p-6 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all duration-300 border border-blue-200"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 className="text-blue-800 font-semibold text-lg">Modul Pembelajaran</h3>
            <p className="text-sm text-blue-600">Akses materi pembelajaran sesuai level Anda</p>
          </div>
        </button>

        <button
          onClick={() => window.location.href = '/ujian'}
          className="flex items-center gap-4 p-6 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all duration-300 border border-blue-200"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 className="text-blue-800 font-semibold text-lg">Ujian Kenaikan Level</h3>
            <p className="text-sm text-blue-600">Uji kemampuan dan naik ke level berikutnya</p>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      <Navbar />
      <main className="container mx-auto px-4 py-8 relative z-10">
        {currentUser?.role === "guru" ? <GuruDashboard /> : <SiswaDashboard />}
      </main>
    </div>
  );
}

export default Beranda;
