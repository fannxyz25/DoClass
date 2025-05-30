import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useUser } from '../components/UserContext';

const DetailKelas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [kelas, setKelas] = useState(null);
  const [moduls, setModuls] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState('modul');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModulForm, setShowModulForm] = useState(false);
  const [showUjianModal, setShowUjianModal] = useState(false);
  const [ujianList, setUjianList] = useState([]);
  const [jawabanSiswa, setJawabanSiswa] = useState({});
  const [newUjian, setNewUjian] = useState({
    level: "",
    soal: [{ pertanyaan: "", opsi: ["", "", "", ""], jawaban_benar: "" }],
    min_score: 70
  });
  const [modulForm, setModulForm] = useState({
    judul: '',
    deskripsi: '',
    file: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hasilUjian, setHasilUjian] = useState([]);
  const [showHasilUjian, setShowHasilUjian] = useState(false);
  const [hasilUjianSiswa, setHasilUjianSiswa] = useState(null);
  const [hasilUjianMap, setHasilUjianMap] = useState({});

  // State for announcements
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ judul: '', isi: '' });
  const [broadcastAll, setBroadcastAll] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetOption, setResetOption] = useState('all');
  const [selectedUjianId, setSelectedUjianId] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    loadKelasDetail();
    loadUjianList();
    loadHasilUjian();
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const loadKelasDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`http://localhost:5000/api/kelas/${id}`);
      setKelas(res.data);
      
      try {
        const modulRes = await axios.get(`http://localhost:5000/api/modul/kelas/${id}`);
        setModuls(modulRes.data || []);
      } catch (err) {
        console.error('Error loading modules:', err);
        setModuls([]);
      }

      try {
        const announcementRes = await axios.get(`http://localhost:5000/api/announcement/kelas/${id}`);
        setAnnouncements(announcementRes.data || []);
      } catch (err) {
        console.error('Error loading announcements:', err);
        setAnnouncements([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading kelas detail:', error);
      setError(error.response?.data?.message || 'Gagal memuat detail kelas');
      setLoading(false);
    }
  };

  const loadUjianList = async () => {
    try {
      let url = `http://localhost:5000/api/kelas/${id}/ujian`;
      if (user.role === 'siswa' && user.current_level) {
        url += `?level=${encodeURIComponent(user.current_level)}`;
      }
      const res = await axios.get(url);
      const ujianArr = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      setUjianList(ujianArr);
      console.log('Ujian list:', ujianArr);
      loadHasilUjian();
    } catch (error) {
      console.error('Error loading ujian:', error);
      setUjianList([]);
    }
  };

  // Add useEffect to reload exams periodically
  useEffect(() => {
    loadUjianList();
    loadHasilUjian(); // Pastikan hasil ujian juga di-refresh
    // Set up interval to refresh exams and hasil ujian every 30 seconds
    const intervalId = setInterval(() => {
      loadUjianList();
      loadHasilUjian();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [id]);

  const loadHasilUjian = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/kelas/${id}/ujian/hasil`);
      // Buat map hasil ujian: { [ujianId]: hasilUjianSiswa }
      const map = {};
      if (user.role === 'siswa') {
        res.data.forEach(h => {
          if (h.siswa && (h.siswa === user._id || h.siswa._id === user._id)) {
            map[h.ujianId] = h;
          }
        });
      }
      setHasilUjian(res.data);
      setHasilUjianMap(map);
    } catch (error) {
      setHasilUjian([]);
      setHasilUjianMap({});
    }
  };

  const handleJawabUjian = async (ujianId) => {
    try {
      const jawabanArr = jawabanSiswa[ujianId] ? Object.values(jawabanSiswa[ujianId]) : [];
      console.log('Submitting ujian with data:', { ujianId, jawaban: jawabanArr, userId: user._id, nama: user.username });
      const res = await axios.post(`http://localhost:5000/api/kelas/${id}/ujian/submit`, {
        ujianId,
        jawaban: jawabanArr,
        userId: user._id,
        nama: user.username
      });
      console.log('Ujian submitted successfully, response:', res.data);
      
      // *** Tambahkan panggilan untuk update ranking setelah ujian selesai ***
      console.log('Attempting to update ranking...');
      try {
          const rankingUpdateRes = await axios.post('http://localhost:5000/api/ranking/update-points', {
              studentId: user._id,
              classId: id,
              quizId: ujianId,
              score: res.data.score
          }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          console.log('Ranking updated successfully:', rankingUpdateRes.data);
          
          // Show level up message if it exists
          if (rankingUpdateRes.data.levelUpMessage) {
              alert(rankingUpdateRes.data.levelUpMessage);
          }
          
          // Show exam result
          alert(`Nilai Anda: ${res.data.score}. ${res.data.passed ? 'Anda lulus!' : 'Anda belum lulus.'}`);
      } catch (rankingError) {
          console.error('Error updating ranking:', rankingError);
      }

      loadUjianList(); // Refresh daftar ujian dan hasil ujian
    } catch (error) {
      console.error('Error submitting ujian:', error);
      alert('Gagal mengirim jawaban ujian');
    }
  };

  // Function to handle creating an announcement
  const handleCreateAnnouncement = async () => {
    try {
      if (!newAnnouncement.judul.trim() || !newAnnouncement.isi.trim()) {
        alert("Judul dan isi pengumuman tidak boleh kosong!");
        return;
      }
      const res = await axios.post(`http://localhost:5000/api/announcement/kelas/${id}`, {
        ...newAnnouncement,
        createdBy: user._id
      });
      if (res.data) {
        alert("Pengumuman berhasil dibuat!");
        setShowAnnouncementModal(false);
        setNewAnnouncement({ judul: '', isi: '' });
        loadKelasDetail(); // Refresh announcements list
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert(error.response?.data?.message || "Gagal membuat pengumuman!");
    }
  };

  const handleResetNilaiSiswa = async () => {
    setIsResetting(true);
    try {
      if (resetOption === 'all') {
        await axios.delete(`http://localhost:5000/api/kelas/${id}/ujian/hasil`);
      } else if (resetOption === 'ujian' && selectedUjianId) {
        await axios.delete(`http://localhost:5000/api/kelas/${id}/ujian/${selectedUjianId}/hasil`);
      }
      setShowResetModal(false);
      setSelectedUjianId('');
      setResetOption('all');
      loadHasilUjian();
      alert('Nilai siswa berhasil dihapus!');
    } catch (error) {
      alert('Gagal menghapus nilai siswa');
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data kelas...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header Kelas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{kelas.nama}</h1>
              <p className="text-gray-600">Kode Kelas: {kelas.kode}</p>
              <p className="text-gray-600">Jurusan: {kelas.jurusan}</p>
              <p className="text-gray-600">
                Pengajar: {kelas.guru?.username || 'Tidak tersedia'}
              </p>
              <p className="text-gray-600">
                Jumlah Siswa: {kelas.enrolledStudents?.length || 0}
              </p>
            </div>
            {user.role === 'guru' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAnnouncementModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Buat Pengumuman
                </button>
                <button
                  onClick={() => setShowModulForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Tambah Modul
                </button>
                <button
                  onClick={() => { console.log('Klik Buat Ujian'); setShowUjianModal(true); }}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Buat Ujian
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 ${
                activeTab === 'modul'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('modul')}
            >
              Modul
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'announcement'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('announcement')}
            >
              Pengumuman
            </button>
            {(user.role === 'siswa' || user.role === 'guru') && (
              <button
                className={`px-4 py-2 ${
                  activeTab === 'progress'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('progress')}
              >
                Progress
              </button>
            )}
            <button
              className={`px-4 py-2 ${
                activeTab === 'ujian'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('ujian')}
            >
              Ujian
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'ujian' && (
              <div>
                {/* Guru: tombol dan tabel hasil ujian */}
                {user?.role === 'guru' && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold mb-2">Daftar Soal Ujian yang Sudah Dibuat</h3>
                    {ujianList.length === 0 ? (
                      <div className="text-gray-500">Belum ada ujian yang dibuat.</div>
                    ) : (
                      ujianList.map((ujian, idx) => (
                        <div key={ujian._id || idx} className="mb-6 p-4 border rounded bg-gray-50">
                          {(ujian.level || ujian.min_score) && (
                            <div className="font-semibold mb-2 bg-blue-100 text-blue-900 rounded px-2 py-1 inline-block">
                              {ujian.level && <>Level: {ujian.level}</>} {ujian.level && ujian.min_score && '|'} {ujian.min_score && <>Nilai Minimum: {ujian.min_score}</>}
                            </div>
                          )}
                          {ujian.soal.map((soal, sIdx) => (
                            <div key={sIdx} className="mb-2">
                              <div className="font-bold text-gray-900 mb-1">{sIdx + 1}. {soal.pertanyaan}</div>
                              <ul className="ml-4">
                                {soal.opsi.map((opsi, oIdx) => (
                                  <li key={oIdx} className={
                                    opsi === soal.jawaban_benar
                                      ? "bg-green-100 text-green-800 font-bold rounded px-1"
                                      : "text-gray-800"
                                  }>
                                    {String.fromCharCode(65 + oIdx)}. {opsi}
                                  </li>
                                ))}
                              </ul>
                              <div className="text-sm text-blue-700">Jawaban Benar: {soal.jawaban_benar}</div>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                    {/* Tombol dan tabel hasil ujian */}
                    <button
                      className="mb-4 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
                      onClick={() => setShowHasilUjian((prev) => !prev)}
                    >
                      {showHasilUjian ? 'Sembunyikan Nilai Siswa' : 'Lihat Nilai Siswa'}
                    </button>
                    <button
                      className="mb-4 ml-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                      onClick={() => setShowResetModal(true)}
                    >
                      Reset/Hapus Nilai Siswa
                    </button>
                    {showResetModal && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                          <h2 className="text-xl font-bold mb-4 text-gray-800">Reset/Hapus Nilai Siswa</h2>
                          <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-800">Pilih Opsi:</label>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="resetOption"
                                  value="all"
                                  checked={resetOption === 'all'}
                                  onChange={() => setResetOption('all')}
                                  className="mr-2"
                                />
                                <span className="text-gray-900">Hapus semua nilai siswa untuk semua ujian di kelas ini</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="resetOption"
                                  value="ujian"
                                  checked={resetOption === 'ujian'}
                                  onChange={() => setResetOption('ujian')}
                                  className="mr-2"
                                />
                                <span className="text-gray-900">Hapus nilai siswa untuk ujian tertentu saja</span>
                              </label>
                            </div>
                          </div>
                          {resetOption === 'ujian' && (
                            <div className="mb-4">
                              <label className="block mb-2 font-medium text-gray-800">Pilih Ujian:</label>
                              <select
                                className="w-full border rounded px-3 py-2"
                                value={selectedUjianId}
                                onChange={e => setSelectedUjianId(e.target.value)}
                              >
                                <option value="">-- Pilih Ujian --</option>
                                {ujianList.map((ujian) => (
                                  <option key={ujian._id} value={ujian._id}>
                                    {ujian.level ? `Level: ${ujian.level}` : ''} {ujian.soal[0]?.pertanyaan ? `- ${ujian.soal[0].pertanyaan.substring(0, 30)}...` : ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          <div className="flex justify-end space-x-3 mt-6">
                            <button
                              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                              onClick={() => setShowResetModal(false)}
                              disabled={isResetting}
                            >
                              Batal
                            </button>
                            <button
                              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
                              onClick={handleResetNilaiSiswa}
                              disabled={isResetting || (resetOption === 'ujian' && !selectedUjianId)}
                            >
                              {isResetting ? 'Menghapus...' : 'Hapus Nilai'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {showHasilUjian && hasilUjian.length > 0 && (
                      <div className="overflow-x-auto">
                        <h3 className="text-lg font-bold mb-2">Hasil Ujian Siswa</h3>
                        <table className="min-w-full border border-gray-300 text-sm bg-white rounded-lg overflow-hidden">
                          <thead>
                            <tr className="bg-gray-200 text-gray-900 font-bold">
                              <th className="border border-gray-300 px-4 py-2">Nama Siswa</th>
                              <th className="border border-gray-300 px-4 py-2">Nilai</th>
                              <th className="border border-gray-300 px-4 py-2">Status</th>
                              <th className="border border-gray-300 px-4 py-2">Waktu</th>
                            </tr>
                          </thead>
                          <tbody>
                            {hasilUjian.map((hasil, idx) => (
                              <tr key={idx} className="text-center hover:bg-gray-50">
                                <td className="border border-gray-200 px-4 py-2 text-gray-800">{hasil.nama || hasil.siswa?.username || '-'}</td>
                                <td className="border border-gray-200 px-4 py-2 text-gray-800">{hasil.score}</td>
                                <td className="border border-gray-200 px-4 py-2 text-gray-800">
                                  {hasil.passed ? <span className="text-green-600 font-semibold">Lulus</span> : <span className="text-red-600 font-semibold">Tidak Lulus</span>}
                                </td>
                                <td className="border border-gray-200 px-4 py-2 text-gray-800">{new Date(hasil.waktu).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                {/* Siswa: hasil ujian jika sudah mengerjakan */}
                {user?.role === 'siswa' && hasilUjianSiswa && (
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mt-6 max-w-xl mx-auto">
                    <h3 className="text-lg font-bold mb-2 text-gray-900">Anda sudah mengerjakan ujian</h3>
                    <p className="mb-2 text-gray-800">Nilai Anda: <span className="font-bold">{hasilUjianSiswa.score}</span></p>
                    <p className="mb-2 text-gray-800">Status: {hasilUjianSiswa.passed ? <span className="text-green-600 font-semibold">Lulus</span> : <span className="text-red-600 font-semibold">Tidak Lulus</span>}</p>
                    <p className="text-gray-500 text-sm">Dikerjakan pada: {new Date(hasilUjianSiswa.waktu).toLocaleString()}</p>
                  </div>
                )}
                {/* Siswa: form ujian jika belum mengerjakan */}
                {user?.role === 'siswa' && ujianList.length === 0 && (
                  <div className="text-center text-gray-500 py-8">Belum ada ujian untuk level Anda.</div>
                )}
                {user?.role === 'siswa' && ujianList.map((ujian, ujianIndex) => {
                  const ujianKey = ujian._id?.toString();
                  const hasilSiswa = hasilUjianMap[ujianKey];
                  console.log('Render ujian:', ujianKey, ujian, 'Hasil siswa:', hasilSiswa);
                  return (
                    <div key={ujianKey} className="space-y-6">
                      {hasilSiswa ? (
                        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mt-6 max-w-xl mx-auto">
                          <h3 className="text-lg font-bold mb-2 text-gray-900">Anda sudah mengerjakan ujian</h3>
                          <p className="mb-2 text-gray-800">Nilai Anda: <span className="font-bold">{hasilSiswa.score}</span></p>
                          <p className="mb-2 text-gray-800">Status: {hasilSiswa.passed ? <span className="text-green-600 font-semibold">Lulus</span> : <span className="text-red-600 font-semibold">Tidak Lulus</span>}</p>
                          <p className="text-gray-500 text-sm">Dikerjakan pada: {new Date(hasilSiswa.waktu).toLocaleString()}</p>
                        </div>
                      ) : (
                        ujian.soal.map((soal, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-lg font-medium text-gray-900 mb-4">
                            {index + 1}. {soal.pertanyaan}
                          </p>
                          <div className="space-y-3">
                            {soal.opsi.map((opsi, opsiIndex) => (
                              <label key={opsiIndex} className="flex items-center space-x-3 p-2 rounded hover:bg-white">
                                <input
                                  type="radio"
                                  name={`ujian-${ujianKey}-soal-${index}`}
                                  value={opsi}
                                  checked={jawabanSiswa[ujianKey]?.[index] === opsi}
                                  onChange={(e) => {
                                    const newJawaban = {
                                      ...jawabanSiswa,
                                      [ujianKey]: {
                                        ...(jawabanSiswa[ujianKey] || {}),
                                        [index]: e.target.value
                                      }
                                    };
                                    setJawabanSiswa(newJawaban);
                                  }}
                                  className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="text-gray-900">{opsi}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        ))
                      )}
                      {!hasilSiswa && (
                      <div className="mt-6">
                        <button
                            onClick={() => handleJawabUjian(ujianKey)}
                          className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Submit Jawaban
                        </button>
                      </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'modul' && (
              <div>
                <h3 className="text-lg font-bold mb-4">Daftar Modul</h3>
                {moduls.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {moduls.map((modul) => (
                      <div key={modul._id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-lg mb-2">{modul.judul}</h4>
                            <p className="text-sm text-gray-600 mb-3">{modul.deskripsi}</p>
                            
                            {modul.fileUrl && (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center space-x-2">
                                  {/* File type icon */}
                                  <div className="text-blue-600">
                                    {modul.fileName?.toLowerCase().endsWith('.pdf') ? (
                                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                      </svg>
                                    ) : modul.fileName?.toLowerCase().match(/\.(doc|docx)$/) ? (
                                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    ) : modul.fileName?.toLowerCase().match(/\.(ppt|pptx)$/) ? (
                                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    ) : modul.fileName?.toLowerCase().match(/\.(xls|xlsx)$/) ? (
                                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    ) : (
                                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                      </svg>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {modul.fileName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {Math.round(modul.fileSize / 1024)} KB
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <a
                                    href={`http://localhost:5000/${modul.fileUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Lihat
                                  </a>
                                  <a
                                    href={`http://localhost:5000/${modul.fileUrl}`}
                                    download
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Unduh
                                  </a>
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-3 flex items-center text-xs text-gray-500">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Ditambahkan: {new Date(modul.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada modul</h3>
                    <p className="mt-1 text-sm text-gray-500">Guru belum menambahkan modul pembelajaran.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'progress' && user.role === 'guru' && (
              <div>
                <h3 className="text-lg font-bold mb-4">Daftar Siswa & Level</h3>
                {kelas.enrolledStudents && kelas.enrolledStudents.length > 0 ? (
                  <table className="min-w-full border border-gray-300 text-sm bg-white rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-200 text-gray-900 font-bold">
                        <th className="border border-gray-300 px-4 py-2">Nama Siswa</th>
                        <th className="border border-gray-300 px-4 py-2">Level</th>
                        <th className="border border-gray-300 px-4 py-2">Total Poin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kelas.enrolledStudents.map((siswa, idx) => (
                        <tr key={siswa._id || idx} className="text-center hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2 text-gray-800">{siswa.username || '-'}</td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-800">{siswa.current_level || '-'}</td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-800">
                            {siswa.points || 0} poin
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-gray-500 py-8">Belum ada siswa yang terdaftar di kelas ini.</div>
                )}
              </div>
            )}

            {activeTab === 'announcement' && (
              <div>
                <h3 className="text-lg font-bold mb-4">Daftar Pengumuman</h3>
                {announcements.length === 0 ? (
                  <div className="text-gray-500">Belum ada pengumuman.</div>
                ) : (
                  announcements.map((a, idx) => (
                    <div key={a._id || idx} className="mb-4 p-4 border rounded bg-yellow-50">
                      <div className="font-semibold text-yellow-900 mb-1">{a.judul}</div>
                      <div className="text-gray-800 mb-2 whitespace-pre-line">{a.isi}</div>
                      <div className="text-xs text-gray-500">
                        {a.createdBy?.username ? (
                          <>Oleh: {a.createdBy.username} | {new Date(a.createdAt).toLocaleString()}</>
                        ) : (
                          <>Oleh Guru | {new Date(a.createdAt).toLocaleString()}</>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {showUjianModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowUjianModal(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Buat Ujian</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await axios.post(`http://localhost:5000/api/kelas/${id}/ujian`, newUjian);
                    setShowUjianModal(false);
                    setNewUjian({ soal: [{ pertanyaan: '', opsi: ['', '', '', ''], jawaban_benar: '' }], min_score: 70 });
                    loadUjianList();
                    alert('Ujian berhasil dibuat!');
                  } catch (err) {
                    alert('Gagal membuat ujian!');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nilai Minimum</label>
                  <input
                    type="number"
                    className="input w-full border rounded px-3 py-2 mt-1"
                    value={newUjian.min_score}
                    onChange={e => setNewUjian({ ...newUjian, min_score: Number(e.target.value) })}
                    min={0}
                    max={100}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Soal</label>
                  {newUjian.soal.map((soal, idx) => (
                    <div key={idx} className="border rounded p-3 mb-4 bg-gray-50">
                      <input
                        type="text"
                        className="input w-full border rounded px-3 py-2 mb-2"
                        placeholder={`Pertanyaan ${idx + 1}`}
                        value={soal.pertanyaan}
                        onChange={e => {
                          const soalBaru = [...newUjian.soal];
                          soalBaru[idx].pertanyaan = e.target.value;
                          setNewUjian({ ...newUjian, soal: soalBaru });
                        }}
                        required
                      />
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        {soal.opsi.map((opsi, opsiIdx) => (
                          <input
                            key={opsiIdx}
                            type="text"
                            className="input w-full border rounded px-3 py-2"
                            placeholder={`Opsi ${String.fromCharCode(65 + opsiIdx)}`}
                            value={opsi}
                            onChange={e => {
                              const soalBaru = [...newUjian.soal];
                              soalBaru[idx].opsi[opsiIdx] = e.target.value;
                              setNewUjian({ ...newUjian, soal: soalBaru });
                            }}
                            required
                          />
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Jawaban Benar</label>
                        <select
                          className="input w-full border rounded px-3 py-2 mt-1"
                          value={soal.jawaban_benar}
                          onChange={e => {
                            const soalBaru = [...newUjian.soal];
                            soalBaru[idx].jawaban_benar = e.target.value;
                            setNewUjian({ ...newUjian, soal: soalBaru });
                          }}
                          required
                        >
                          <option value="">Pilih Jawaban Benar</option>
                          {soal.opsi.map((opsi, opsiIdx) => (
                            <option key={opsiIdx} value={opsi}>{opsi || `Opsi ${String.fromCharCode(65 + opsiIdx)}`}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {newUjian.soal.length > 1 && (
                          <button
                            type="button"
                            className="text-red-600 hover:underline"
                            onClick={() => {
                              const soalBaru = newUjian.soal.filter((_, i) => i !== idx);
                              setNewUjian({ ...newUjian, soal: soalBaru });
                            }}
                          >
                            Hapus Soal
                          </button>
                        )}
                        {idx === newUjian.soal.length - 1 && (
                          <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() => {
                              setNewUjian({
                                ...newUjian,
                                soal: [...newUjian.soal, { pertanyaan: '', opsi: ['', '', '', ''], jawaban_benar: '' }]
                              });
                            }}
                          >
                            Tambah Soal
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                    onClick={() => setShowUjianModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Simpan Ujian
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Tambah Modul */}
        {showModulForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModulForm(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Tambah Modul</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  // Call the handleCreateModul function
                  const formData = new FormData();
                  formData.append('judul', modulForm.judul);
                  formData.append('deskripsi', modulForm.deskripsi);
                  if (modulForm.file) {
                    formData.append('file', modulForm.file);
                  }

                  // Add the userId to the formData
                  formData.append('userId', user._id);

                  try {
                    await axios.post(`http://localhost:5000/api/modul/kelas/${id}`, formData, {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      },
                      onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                      }
                    });
                    alert('Modul berhasil ditambahkan!');
                    setShowModulForm(false);
                    setModulForm({ judul: '', deskripsi: '', file: null });
                    setUploadProgress(0);
                    loadKelasDetail(); // Refresh modules list
                  } catch (error) {
                    console.error('Error creating modul:', error);
                    alert(error.response?.data?.message || 'Gagal membuat modul!');
                    setUploadProgress(0);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">Judul Modul</label>
                  <input
                    type="text"
                    className="input w-full border rounded px-3 py-2 mt-1"
                    value={modulForm.judul}
                    onChange={e => setModulForm({ ...modulForm, judul: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                  <textarea
                    className="input w-full border rounded px-3 py-2 mt-1"
                    value={modulForm.deskripsi}
                    onChange={e => setModulForm({ ...modulForm, deskripsi: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">File</label>
                  <input
                    type="file"
                    className="input w-full border rounded px-3 py-2 mt-1"
                    onChange={e => setModulForm({ ...modulForm, file: e.target.files[0] })}
                    required
                  />
                   {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  )}
                </div>
                {modulForm.file && (
                  <p className="text-sm text-gray-600 mt-1">File terpilih: {modulForm.file.name}</p>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                    onClick={() => setShowModulForm(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Simpan Modul
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
            aria-label="Scroll ke atas"
          >
            ↑
          </button>
        )}

        {showAnnouncementModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowAnnouncementModal(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Buat Pengumuman</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    let url = "http://localhost:5000/api/announcement";
                    let payload = {
                      ...newAnnouncement,
                      createdBy: user._id,
                    };
                    if (!broadcastAll) {
                      payload.kelasIds = [id];
                    } else {
                      payload.kelasIds = [];
                    }
                    await axios.post(url, payload);
                    setShowAnnouncementModal(false);
                    setNewAnnouncement({ judul: '', isi: '' });
                    setBroadcastAll(false);
                    loadKelasDetail();
                    alert('Pengumuman berhasil dibuat!');
                  } catch (err) {
                    alert('Gagal membuat pengumuman!');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">Judul Pengumuman</label>
                  <input
                    type="text"
                    className="input w-full border rounded px-3 py-2 mt-1"
                    value={newAnnouncement.judul}
                    onChange={e => setNewAnnouncement({ ...newAnnouncement, judul: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Isi Pengumuman</label>
                  <textarea
                    className="input w-full border rounded px-3 py-2 mt-1"
                    value={newAnnouncement.isi}
                    onChange={e => setNewAnnouncement({ ...newAnnouncement, isi: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="broadcastAll"
                    checked={broadcastAll}
                    onChange={e => setBroadcastAll(e.target.checked)}
                  />
                  <label htmlFor="broadcastAll" className="text-sm text-gray-900">Broadcast ke semua kelas</label>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                    onClick={() => setShowAnnouncementModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                  >
                    Simpan Pengumuman
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DetailKelas; 