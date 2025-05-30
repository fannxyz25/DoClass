import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useUser } from "../components/UserContext"

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate()
  const { user, updateUser } = useUser()
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (user && !redirected) {
      setRedirected(true);
      if (user.role === "guru") {
        navigate("/guru/kelas", { replace: true });
      } else {
        navigate("/kelas", { replace: true });
      }
    }
  }, [user, redirected, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      // Validate form
      if (!form.email || !form.password) {
        alert("Mohon isi email dan password")
        return
      }

      const response = await axios.post("http://localhost:5000/api/auth/login", form)
      console.log('Login response:', response.data)

      if (response.data && response.data.user) {
        // Store user data using context
        updateUser(response.data.user)
        setRedirected(false); // Reset flag for next login
        // Clear form
        setForm({ email: "", password: "" })
        // Cek isi localStorage setelah login
        setTimeout(() => {
          console.log('Isi localStorage setelah login:', localStorage.getItem('user'));
        }, 500);
      } else {
        alert("Data login tidak valid")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert(error.response?.data?.message || "Email atau password salah")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login DoClass</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan email anda"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan password anda"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
