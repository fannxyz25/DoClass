import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useUser } from "../components/UserContext";

const SiswaKelas = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [kelas, setKelas] = useState([]);
  const [enrolledKelas, setEnrolledKelas] = useState([]);
  const [showEnrolled, setShowEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joinByCode, setJoinByCode] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    // Debug user data
    console.log('User data:', user);
    
    if (!user || !user._id) {
      console.log('Invalid user data, redirecting to login');
      navigate('/');
      return;
    }
    
    if (user.role !== 'siswa') {
      navigate('/guru/kelas');
      return;
    }

    // Check if we're on the old route
    if (window.location.pathname === '/ruang-kelas') {
      navigate('/kelas');
      return;
    }

    loadKelas();
    loadEnrolledKelas();
  }, [user, navigate]);

  const loadKelas = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/kelas");
      const kelasData = res.data;
      
      // Mark enrolled classes
      const kelasWithStatus = kelasData.map(k => ({
        ...k,
        enrolled: enrolledKelas.some(ek => ek._id === k._id)
      }));
      
      setKelas(kelasWithStatus);
      setLoading(false);
    } catch (error) {
      console.error("Error loading kelas:", error);
      setLoading(false);
    }
  };

  const loadEnrolledKelas = async () => {
    if (!user?._id) return;
    
    try {
      const res = await axios.get(`http://localhost:5000/api/kelas/enrolled/${user._id}`);
      setEnrolledKelas(res.data);
      
      // Update enrolled status in kelas list
      setKelas(prevKelas => prevKelas.map(k => ({
        ...k,
        enrolled: res.data.some(ek => ek._id === k._id)
      })));
    } catch (error) {
      console.error("Error loading enrolled kelas:", error);
    }
  };

  const handleJoinClass = async (kodeKelas) => {
    try {
      const response = await axios.post("http://localhost:5000/api/kelas/join", {
        userId: user._id,
        kode: kodeKelas
      });

      if (response.data.kelas) {
        await loadKelas();
        await loadEnrolledKelas();
        setShowJoinModal(false);
        setJoinByCode("");
      }
    } catch (error) {
      console.error("Error joining class:", error);
      alert(error.response?.data?.message || "Gagal bergabung ke kelas");
    }
  };

  const handleJoinKelas = async (kodeKelas) => {
    try {
      const res = await axios.post("http://localhost:5000/api/kelas/join", {
        userId: user._id,
        kode: kodeKelas
      });

      // Update the enrolled status in the kelas list
      setKelas(prevKelas => prevKelas.map(k => 
        k.kode === kodeKelas ? { ...k, enrolled: true } : k
      ));

      // Add the joined kelas to enrolledKelas
      const joinedKelas = kelas.find(k => k.kode === kodeKelas);
      if (joinedKelas) {
        setEnrolledKelas(prev => [...prev, joinedKelas]);
      }

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Gagal bergabung ke kelas");
    }
  };

  const handleAccessRoom = (kelasId) => {
    navigate(`/kelas/${kelasId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Ruang Kelas</h1>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setShowJoinModal(true)}
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
              >
                Gabung dengan Kode
              </button>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowEnrolled(false)}
                  className={`px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors ${
                    !showEnrolled
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Semua Kelas
                </button>
                <button
                  onClick={() => setShowEnrolled(true)}
                  className={`px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors ${
                    showEnrolled
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Kelas Saya
                </button>
              </div>
            </div>
          </div>

          {/* Join by Code Modal */}
          {showJoinModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Gabung Kelas dengan Kode</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleJoinClass(joinByCode); }}>
                  <input
                    type="text"
                    value={joinByCode}
                    onChange={(e) => setJoinByCode(e.target.value)}
                    placeholder="Masukkan kode kelas"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
                    required
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowJoinModal(false)}
                      className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Gabung
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Daftar Kelas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showEnrolled ? enrolledKelas : kelas).map((item) => (
              <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-2">{item.nama}</h3>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium text-gray-700">Kode:</span> {item.kode}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium text-gray-700">Jurusan:</span> {item.jurusan}
                    </p>
                    {item.guru && (
                      <p className="text-gray-600">
                        <span className="font-medium text-gray-700">Guru:</span> {item.guru.username}
                      </p>
                    )}
                  </div>
                  {item.enrolled && (
                    <span className="bg-emerald-100 text-emerald-800 text-sm px-3 py-1 rounded-full font-medium">
                      Terdaftar
                    </span>
                  )}
                </div>
                <div className="mt-6 flex justify-end">
                  {showEnrolled ? (
                    <button
                      onClick={() => handleAccessRoom(item._id)}
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Masuk Kelas
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinKelas(item.kode)}
                      className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                        item.enrolled
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                      disabled={item.enrolled}
                    >
                      {item.enrolled ? "Sudah Terdaftar" : "Gabung Kelas"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {((showEnrolled && enrolledKelas.length === 0) || (!showEnrolled && kelas.length === 0)) && (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="text-gray-400 text-6xl mb-4">
                {showEnrolled ? "📚" : "🎓"}
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                {showEnrolled ? "Belum Ada Kelas" : "Tidak Ada Kelas Tersedia"}
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                {showEnrolled
                  ? "Anda belum bergabung dengan kelas apapun. Silakan gabung ke kelas terlebih dahulu."
                  : "Tidak ada kelas yang tersedia saat ini."}
              </p>
              {showEnrolled && (
                <button
                  onClick={() => setShowEnrolled(false)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-lg"
                >
                  Lihat Semua Kelas
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SiswaKelas; 