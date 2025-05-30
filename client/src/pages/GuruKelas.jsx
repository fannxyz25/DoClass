import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useUser } from "../components/UserContext";

// Set default baseURL for axios
axios.defaults.baseURL = 'http://localhost:5173';

const GuruKelas = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [kelas, setKelas] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKelas, setNewKelas] = useState({ nama: "" });
  const [showModulModal, setShowModulModal] = useState(false);
  const [newModul, setNewModul] = useState({ judul: "", isi: "", kelasId: "", file: null });
  const [showUjianModal, setShowUjianModal] = useState(false);
  const [newUjian, setNewUjian] = useState({
    level: "",
    soal: [{ pertanyaan: "", opsi: ["", "", "", ""], jawaban_benar: "" }],
    min_score: 70
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (user.role !== 'guru') {
      navigate('/kelas');
      return;
    }

    // Check if we're on the old route
    if (window.location.pathname === '/ruang-kelas') {
      navigate('/guru/kelas');
      return;
    }

    loadKelas();
  }, [user]);

  const loadKelas = async () => {
    try {
      if (!user || !user._id) {
        console.log('No user data found');
        navigate('/');
        return;
      }

      const res = await axios.get(`http://localhost:5000/api/kelas?userId=${user._id}&role=${user.role}`);
      console.log('Loaded kelas:', res.data);
      setKelas(res.data);
    } catch (error) {
      console.error("Error loading kelas:", error);
      alert("Gagal memuat daftar kelas");
    }
  };

  const handleCreateKelas = async () => {
    try {
      // Validasi input
      if (!newKelas.nama?.trim()) {
        alert("Nama kelas harus diisi!");
        return;
      }

      // Validasi user
      if (!user?._id) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        navigate('/');
        return;
      }

      // Tampilkan loading state
      setIsLoading(true);

      console.log('Attempting to create kelas:', {
        ...newKelas,
        guruId: user._id
      });
      
      const res = await axios.post("http://localhost:5000/api/kelas", {
        ...newKelas,
        guruId: user._id
      });

      console.log('Create kelas response:', res.data);

      if (res.data) {
        alert(res.data.message);
        setShowCreateModal(false);
        await loadKelas(); // Reload daftar kelas
        setNewKelas({ nama: "" });
      }
    } catch (error) {
      console.error('Error creating kelas:', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      alert(error.response?.data?.message || "Gagal membuat kelas. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateModul = async () => {
    try {
      console.log('Form data:', newModul);

      if (!newModul.judul || !newModul.isi || !newModul.kelasId || !newModul.file) {
        alert("Semua field harus diisi!");
        console.log('Missing fields:', {
          judul: !newModul.judul,
          isi: !newModul.isi,
          kelasId: !newModul.kelasId,
          file: !newModul.file
        });
        return;
      }

      const formData = new FormData();
      formData.append('judul', newModul.judul);
      formData.append('deskripsi', newModul.isi);
      formData.append('file', newModul.file);
      formData.append('userId', user._id);

      // Debug log
      const apiUrl = `/api/modul/kelas/${newModul.kelasId}`;
      console.log('Sending request to:', apiUrl);
      console.log('FormData contents:', {
        judul: newModul.judul,
        deskripsi: newModul.isi,
        file: newModul.file.name,
        userId: user._id,
        kelasId: newModul.kelasId
      });

      try {
        const response = await axios.post(
          apiUrl,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        console.log('Server response:', response.data);

        if (response.data) {
          setShowModulModal(false);
          setNewModul({ judul: "", isi: "", kelasId: "", file: null });
          alert("Modul berhasil ditambahkan!");
        }
      } catch (error) {
        console.error('Network error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
        throw error;
      }
    } catch (error) {
      console.error("Error creating modul:", error);
      alert(error.response?.data?.message || "Gagal membuat modul! Periksa console untuk detail error.");
    }
  };

  const handleCreateUjian = async () => {
    try {
      await axios.post("http://localhost:5000/api/ujian", newUjian);
      setShowUjianModal(false);
      setNewUjian({
        level: "",
        soal: [{ pertanyaan: "", opsi: ["", "", "", ""], jawaban_benar: "" }],
        min_score: 70
      });
      alert("Ujian berhasil dibuat!");
    } catch (error) {
      console.error("Error creating ujian:", error);
      alert("Gagal membuat ujian!");
    }
  };

  const handleManageKelas = (kelasId) => {
    navigate(`/guru/kelas/${kelasId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Kelola Kelas</h1>
            <div className="space-x-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Buat Kelas
              </button>
            </div>
          </div>

          {/* Daftar Kelas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kelas.map((item) => (
              <div key={item._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
                <h3 className="font-bold text-lg text-gray-800">{item.nama}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600">
                    <span className="font-medium">Kode:</span> {item.kode}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Siswa:</span> {item.enrolledStudents?.length || 0} orang
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Dibuat:</span> {new Date(item.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleManageKelas(item._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Kelola Kelas
                  </button>
                </div>
              </div>
            ))}
            {kelas.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                Belum ada kelas yang dibuat. Klik tombol "Buat Kelas" untuk membuat kelas baru.
              </div>
            )}
          </div>

          {/* Modal Buat Kelas */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Buat Kelas Baru</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Kode kelas akan dibuat otomatis saat kelas dibuat.
                </p>
                <input
                  type="text"
                  placeholder="Nama Kelas"
                  className="input mb-2 w-full"
                  value={newKelas.nama}
                  onChange={(e) => setNewKelas({ ...newKelas, nama: e.target.value.trim() })}
                  disabled={isLoading}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleCreateKelas}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Membuat...
                      </>
                    ) : (
                      'Simpan'
                    )}
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
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  await handleCreateModul();
                }}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Judul Modul
                    </label>
                    <input
                      type="text"
                      placeholder="Judul Modul"
                      className="input mb-2 w-full p-2 border rounded"
                      value={newModul.judul}
                      onChange={(e) => setNewModul({ ...newModul, judul: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Deskripsi Modul
                    </label>
                    <textarea
                      placeholder="Deskripsi Modul"
                      className="input mb-2 w-full h-32 p-2 border rounded"
                      value={newModul.isi}
                      onChange={(e) => setNewModul({ ...newModul, isi: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      File Modul
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                      onChange={e => setNewModul({ ...newModul, file: e.target.files[0] })}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Format yang didukung: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT (Max 10MB)
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Pilih Kelas
                    </label>
                    <select
                      className="input w-full p-2 border rounded"
                      value={newModul.kelasId}
                      onChange={(e) => setNewModul({ ...newModul, kelasId: e.target.value })}
                      required
                    >
                      <option value="">Pilih Kelas</option>
                      {kelas.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowModulModal(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Buat Ujian */}
          {showUjianModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Buat Ujian</h2>
                <input
                  type="text"
                  placeholder="Level (contoh: Level 0)"
                  className="input mb-2 w-full"
                  value={newUjian.level}
                  onChange={(e) => setNewUjian({ ...newUjian, level: e.target.value })}
                />
                {newUjian.soal.map((soal, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <h3 className="font-medium mb-2">Soal {index + 1}</h3>
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
                    <input
                      type="text"
                      placeholder="Jawaban Benar"
                      className="input mb-2 w-full"
                      value={soal.jawaban_benar}
                      onChange={(e) => {
                        const updatedSoal = [...newUjian.soal];
                        updatedSoal[index].jawaban_benar = e.target.value;
                        setNewUjian({ ...newUjian, soal: updatedSoal });
                      }}
                    />
                    <button
                      onClick={() => {
                        const updatedSoal = newUjian.soal.filter((_, i) => i !== index);
                        setNewUjian({ ...newUjian, soal: updatedSoal });
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Hapus Soal
                    </button>
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

export default GuruKelas; 