import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('siswa');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Kata sandi tidak cocok!');
      return;
    }

    try {
      if (isLogin) {
        // Login
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password,
          level: userType
        });

        if (response.data.user.level !== userType) {
          setError(`Akun ini terdaftar sebagai ${response.data.user.level}, bukan ${userType}`);
          return;
        }

        onLogin(response.data.user);
      } else {
        // Register
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          level: userType
        });

        if (response.status === 201) {
          setIsLogin(true);
          setError('');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Selamat Datang Kembali!' : 'Buat Akun'}
          </h2>
          <p className="text-gray-600">
            {isLogin ? 'Silakan masuk untuk melanjutkan' : 'Bergabunglah dengan kami untuk memulai'}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setUserType('siswa')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                userType === 'siswa'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Siswa
            </button>
            <button
              onClick={() => setUserType('guru')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                userType === 'guru'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Guru
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan kata sandi"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Kata Sandi
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Konfirmasi kata sandi"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            {isLogin ? 'Masuk' : 'Buat Akun'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            {isLogin
              ? "Belum punya akun? Daftar"
              : 'Sudah punya akun? Masuk'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 