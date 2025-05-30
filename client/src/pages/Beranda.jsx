import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../components/UserContext";

function Beranda() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalKelas: 0,
    totalSiswa: 0,
    totalModul: 0
  });

  useEffect(() => {
    if (user?.role === "guru") {
      loadGuruStats();
    }
  }, [user]);

  const loadGuruStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stats/guru");
      setStats(res.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const GuruDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Kelas</h3>
          <p className="text-2xl font-bold text-blue-900">{stats.totalKelas}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Total Siswa</h3>
          <p className="text-2xl font-bold text-green-900">{stats.totalSiswa}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Total Modul</h3>
          <p className="text-2xl font-bold text-purple-900">{stats.totalModul}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Menu Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/ruang-kelas" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100">
            <h3 className="font-semibold text-green-800">Kelola Kelas</h3>
            <p className="text-sm text-green-600">Buat dan atur kelas, tambah modul dan ujian</p>
          </a>
          <a href="/modul" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
            <h3 className="font-semibold text-blue-800">Kelola Modul</h3>
            <p className="text-sm text-blue-600">Buat dan edit modul pembelajaran</p>
          </a>
        </div>
      </div>
    </div>
  );

  const SiswaDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">
          Selamat datang, <span className="text-green-700">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-600 mb-2">
          Level kamu saat ini: <span className="font-medium text-indigo-600">{user?.current_level}</span>
        </p>
        <p className="text-sm text-gray-500">
          Silakan mulai belajar dari modul, dan ikuti ujian jika siap naik kelas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/modul" className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100">
          <h3 className="font-semibold text-blue-800 text-lg">Modul Pembelajaran</h3>
          <p className="text-sm text-blue-600">Akses materi pembelajaran sesuai level kamu</p>
        </a>
        <a href="/ujian" className="block p-6 bg-green-50 rounded-lg hover:bg-green-100">
          <h3 className="font-semibold text-green-800 text-lg">Ujian Kenaikan Level</h3>
          <p className="text-sm text-green-600">Uji kemampuanmu dan naik ke level berikutnya</p>
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {user?.role === "guru" ? <GuruDashboard /> : <SiswaDashboard />}
      </main>
    </div>
  );
}

export default Beranda;
