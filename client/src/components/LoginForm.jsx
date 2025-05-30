import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { useUser } from './UserContext';
import axios from 'axios';

const LoginForm = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      const { message, user, token } = response.data;
      
      if (user && user._id) {
        localStorage.setItem('token', token);
        
        const userData = {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          enrolledKelas: user.enrolledKelas || [],
          current_level: user.current_level
        };
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        updateUser(userData);
        
        const userRole = userData.role.toLowerCase();
        
        if (userRole === 'guru') {
          navigate('/guru/kelas');
        } else if (userRole === 'siswa') {
          navigate('/kelas');
        } else {
          // Fallback for other roles or unexpected scenarios
          navigate('/'); 
        }
      } else {
        setError('Login gagal - data pengguna tidak valid');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Login gagal. Mohon cek kembali email dan password Anda.');
      } else if (err.request) {
        setError('Tidak ada respon dari server. Mohon cek koneksi Anda.');
      } else {
        setError('Gagal terhubung ke server. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#81C4FA] via-[#358BD0] to-[#2D71A7] flex items-center justify-center p-4">
      <div className="w-full max-w-[1256px] h-auto md:h-[833px] flex flex-col md:flex-row rounded-[40px] overflow-hidden relative shadow-2xl">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-16 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#0984E3] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-[32px] font-bold text-[#2D71A7]">MASUK</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-[50px] pl-10 pr-4 rounded-[20px] bg-[#F0F7FF] border border-[#81C4FA] focus:outline-none focus:ring-2 focus:ring-[#0984E3] focus:border-transparent transition-all text-black"
                  required
                  disabled={isLoading}
                  placeholder="Masukkan email Anda"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-[50px] pl-10 pr-4 rounded-[20px] bg-[#F0F7FF] border border-[#81C4FA] focus:outline-none focus:ring-2 focus:ring-[#0984E3] focus:border-transparent transition-all text-black"
                  required
                  disabled={isLoading}
                  placeholder="Masukkan password Anda"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#0984E3] text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#0672c7] transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </div>
                ) : (
                  <>
                    Masuk
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 text-red-500 text-sm p-4 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Right Side - Welcome Message */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#81C4FA] to-[#358BD0] flex flex-col items-center justify-center text-center p-8 md:p-16">
          <div className="mb-8">
            <svg className="w-20 h-20 text-white mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h1 className="text-[32px] font-bold text-white mb-4">Halo, Teman Belajar!</h1>
            <p className="text-xl text-white opacity-90 mb-12">
              Belum punya akun?<br />
              Mari bergabung bersama kami
            </p>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-[#0984E3] px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            Daftar Sekarang
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] bg-white rounded-full p-4 shadow-xl flex items-center justify-center">
          <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
