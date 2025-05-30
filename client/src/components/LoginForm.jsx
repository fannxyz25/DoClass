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
      console.log('Attempting to login with:', formData.email);
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('Login response:', response.data);
      
      const { message, user, token } = response.data;
      
      if (user && user._id) {
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Keep the original user data structure
        const userData = {
          _id: user._id, // Keep _id as is
          username: user.username,
          email: user.email,
          role: user.role,
          enrolledKelas: user.enrolledKelas || [],
          current_level: user.current_level
        };
        
        console.log('Processing user data:', userData);
        
        // Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Update user context and handle navigation
        updateUser(userData);
        
        // Navigate based on role
        const userRole = userData.role.toLowerCase();
        console.log('Redirecting user with role:', userRole);
        
        if (userRole === 'guru') {
          navigate('/guru/kelas');
        } else if (userRole === 'siswa') {
          navigate('/kelas');
        } else {
          navigate('/beranda');
        }
      } else {
        console.error('Invalid user data received:', response.data);
        setError('Login gagal - data pengguna tidak valid');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(err.response.data.message || 'Login gagal. Mohon cek kembali email dan password Anda.');
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Tidak ada respon dari server. Mohon cek koneksi Anda.');
      } else {
        console.error('Error setting up request:', err.message);
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
    setError(''); // Clear error when user types
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
      <div className="bg-white rounded-[40px] shadow-xl w-[1000px] h-[600px] flex overflow-hidden">
        {/* Left side - Login Form */}
        <div className="w-1/2 p-12 flex flex-col">
          <div className="mb-4">
            <img src={Logo} alt="Logo" className="w-[64px] h-[64px] object-contain" />
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Log In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="Masukkan email anda"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="Masukkan password anda"
                required
                disabled={isLoading}
              />
            </div>

            <div className="text-sm">
              <span className="text-gray-600">Belum mempunyai akun? </span>
              <a href="/register" className="text-blue-500 hover:text-blue-600">Registrasi</a>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#2D7EF8] text-white py-2.5 rounded-[4px] hover:bg-blue-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
        
        {/* Right side - Welcome Message */}
        <div className="w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-800">Selamat Datang!</h1>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
