import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useUser } from "../components/UserContext";

const RuangKelas = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [kelas, setKelas] = useState([]);
  const [enrolledKelas, setEnrolledKelas] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKelas, setNewKelas] = useState({ nama: "", jurusan: "" });
  const [showModulModal, setShowModulModal] = useState(false);
  const [newModul, setNewModul] = useState({ judul: "", isi: "", kelasId: "" });
  const [showUjianModal, setShowUjianModal] = useState(false);
  const [newUjian, setNewUjian] = useState({
    level: "",
    soal: [{ pertanyaan: "", opsi: ["", "", "", ""], jawaban_benar: "" }],
    min_score: 70
  });
  const [showEnrolled, setShowEnrolled] = useState(false);
  const [selectedKelasId, setSelectedKelasId] = useState("");

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadKelas();
    if (user?.role === "siswa") {
      loadEnrolledKelas();
    }
  }, [user]);

  useEffect(() => {
    if (kelas.length === 1) {
      setSelectedKelasId(kelas[0]._id);
    }
  }, [kelas]);

  const loadKelas = async () => {
    try {
      console.log('Loading kelas with user:', user);
      const res = await axios.get("http://localhost:5000/api/kelas", {
        params: {
          userId: user._id,
          role: user.role
        }
      });
      console.log('Loaded kelas data:', res.data);
      setKelas(res.data);
    } catch (error) {
      console.error("Error loading kelas:", error);
    }
  };

  const loadEnrolledKelas = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/kelas/enrolled/${user._id}`);
      setEnrolledKelas(res.data);
    } catch (error) {
      console.error("Error loading enrolled kelas:", error);
    }
  };

  const handleJoinKelas = async (kelas) => {
    try {
      await axios.post("http://localhost:5000/api/kelas/join", {
        userId: user._id,
        kode: kelas.kode
      });
      alert("Berhasil bergabung ke kelas!");
      loadEnrolledKelas();
    } catch (error) {
      console.error("Error joining kelas:", error);
      alert(error.response?.data?.message || "Gagal bergabung ke kelas");
    }
  };

  const handleCreateKelas = async () => {
    try {
      if (!newKelas.nama || !newKelas.jurusan) {
        alert("Mohon isi nama kelas dan jurusan!");
        return;
      }
      
      const kelasData = {
        nama: newKelas.nama,
        jurusan: newKelas.jurusan,
        guruId: user._id
      };
      
      const res = await axios.post("http://localhost:5000/api/kelas", kelasData);
      if (res.data) {
        alert(res.data.message);
        setShowCreateModal(false);
        loadKelas();
        setNewKelas({ nama: "", jurusan: "" });
      }
    } catch (error) {
      console.error("Error creating kelas:", error);
      alert("Gagal membuat kelas: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateModul = async () => {
    try {
      await axios.post("http://localhost:5000/api/modul", newModul);
      setShowModulModal(false);
      setNewModul({ judul: "", isi: "", kelasId: "" });
    } catch (error) {
      console.error("Error creating modul:", error);
    }
  };

  const handleCreateUjian = async () => {
    try {
      if (!selectedKelasId) {
        alert("Pilih kelas terlebih dahulu!");
        return;
      }
      // Validasi semua soal terisi
      for (const soal of newUjian.soal) {
        if (!soal.pertanyaan || soal.opsi.some(o => !o) || !soal.jawaban_benar) {
          alert("Semua field soal, opsi, dan jawaban benar harus diisi!");
          return;
        }
        if (!soal.opsi.includes(soal.jawaban_benar)) {
          alert("Jawaban benar harus salah satu dari opsi!");
          return;
        }
      }
      await axios.post(`http://localhost:5000/api/kelas/${selectedKelasId}/ujian`, newUjian);
      setShowUjianModal(false);
      setNewUjian({
        level: "",
        soal: [{ pertanyaan: "", opsi: ["", "", "", ""], jawaban_benar: "" }],
        min_score: 70
      });
      setSelectedKelasId("");
    } catch (error) {
      console.error("Error creating ujian:", error);
      alert("Gagal membuat ujian: " + (error.response?.data?.message || error.message));
    }
  };

  const handleAccessRoom = (kelasId) => {
    navigate(`/kelas/${kelasId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Ruang Kelas</h1>
            {user?.role === "guru" && (
              <div className="space-x-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Buat Kelas
                </button>
              </div>
            )}
          </div>

          {/* Tabs for students */}
          {user?.role === "siswa" && (
            <div className="mb-6">
              <div className="border-b">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setShowEnrolled(false)}
                    className={`py-2 px-1 border-b-2 ${
                      !showEnrolled
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Semua Kelas
                  </button>
                  <button
                    onClick={() => setShowEnrolled(true)}
                    className={`py-2 px-1 border-b-2 ${
                      showEnrolled
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Kelas Saya
                  </button>
                </nav>
              </div>
            </div>
          )}

          {/* Daftar Kelas dengan Scroll */}
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(showEnrolled ? enrolledKelas : kelas).map((item) => (
                <div key={item._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-lg">{item.nama}</h3>
                  <p className="text-gray-600">Kode: {item.kode}</p>
                  <p className="text-gray-600">Jurusan: {item.jurusan}</p>
                  {user?.role === "siswa" && !showEnrolled && (
                    <button
                      onClick={() => handleJoinKelas(item)}
                      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Gabung Kelas
                    </button>
                  )}
                  {showEnrolled && (
                    <button
                      onClick={() => handleAccessRoom(item._id)}
                      className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Masuk Kelas
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Buat Kelas */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Buat Kelas Baru</h2>
                <input
                  type="text"
                  placeholder="Nama Kelas"
                  className="input mb-2 w-full"
                  value={newKelas.nama}
                  onChange={(e) => setNewKelas({ ...newKelas, nama: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Jurusan"
                  className="input mb-4 w-full"
                  value={newKelas.jurusan}
                  onChange={(e) => setNewKelas({ ...newKelas, jurusan: e.target.value })}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleCreateKelas}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Tambah Modul */}
          {showModulModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Tambah Modul</h2>
                <input
                  type="text"
                  placeholder="Judul Modul"
                  className="input mb-2 w-full"
                  value={newModul.judul}
                  onChange={(e) => setNewModul({ ...newModul, judul: e.target.value })}
                />
                <textarea
                  placeholder="Isi Modul"
                  className="input mb-2 w-full h-32"
                  value={newModul.isi}
                  onChange={(e) => setNewModul({ ...newModul, isi: e.target.value })}
                />
                <select
                  className="input mb-4 w-full"
                  value={newModul.kelasId}
                  onChange={(e) => setNewModul({ ...newModul, kelasId: e.target.value })}
                >
                  <option value="">Pilih Kelas</option>
                  {kelas.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.nama}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowModulModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleCreateModul}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Buat Ujian */}
          {showUjianModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Buat Ujian</h2>
                {kelas.length === 0 ? (
                  <div className="mb-4 text-red-600 font-semibold">Buat kelas terlebih dahulu sebelum membuat ujian.</div>
                ) : (
                  <select
                    className="input mb-2 w-full"
                    value={selectedKelasId}
                    onChange={e => setSelectedKelasId(e.target.value)}
                  >
                    <option value="">Pilih Kelas</option>
                    {kelas.map(item => (
                      <option key={item._id} value={item._id}>{item.nama}</option>
                    ))}
                  </select>
                )}
                <input
                  type="text"
                  placeholder="Level (contoh: SMK-1)"
                  className="input mb-2 w-full"
                  value={newUjian.level}
                  onChange={e => setNewUjian({ ...newUjian, level: e.target.value })}
                  disabled={kelas.length === 0}
                />
                {newUjian.soal.map((soal, index) => (
                  <div key={index} className="mb-4">
                    <input
                      type="text"
                      placeholder="Pertanyaan"
                      className="input mb-2 w-full"
                      value={soal.pertanyaan}
                      onChange={(e) => {
                        const updatedSoal = [...newUjian.soal];
                        updatedSoal[index].pertanyaan = e.target.value;
                        setNewUjian({ ...newUjian, soal: updatedSoal });
                      }}
                    />
                    {soal.opsi.map((opsi, opsiIndex) => (
                      <input
                        key={opsiIndex}
                        type="text"
                        placeholder={`Opsi ${opsiIndex + 1}`}
                        className="input mb-2 w-full"
                        value={opsi}
                        onChange={(e) => {
                          const updatedSoal = [...newUjian.soal];
                          updatedSoal[index].opsi[opsiIndex] = e.target.value;
                          setNewUjian({ ...newUjian, soal: updatedSoal });
                        }}
                      />
                    ))}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jawaban Benar
                      </label>
                      <select
                        className="input mb-2 w-full p-2 border rounded"
                        value={soal.jawaban_benar}
                        onChange={(e) => {
                          const updatedSoal = [...newUjian.soal];
                          updatedSoal[index].jawaban_benar = e.target.value;
                          setNewUjian({ ...newUjian, soal: updatedSoal });
                        }}
                      >
                        <option value="">Pilih Jawaban Benar</option>
                        {soal.opsi.map((opsi, opsiIdx) => (
                          opsi && (
                            <option key={opsiIdx} value={opsi}>
                              {opsi}
                            </option>
                          )
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setNewUjian({
                    ...newUjian,
                    soal: [...newUjian.soal, { pertanyaan: "", opsi: ["", "", "", ""], jawaban_benar: "" }]
                  })}
                  className="mb-4 px-4 py-2 border rounded hover:bg-gray-100 w-full"
                >
                  Tambah Soal
                </button>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowUjianModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleCreateUjian}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RuangKelas;
