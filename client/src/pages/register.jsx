import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { useUser } from "../components/UserContext"

function Register() {
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    role: "siswa" 
  })
  const navigate = useNavigate()
  const { updateUser } = useUser()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      // Validate form
      if (!form.username || !form.email || !form.password) {
        alert("Mohon isi semua field")
        return
      }

      const res = await axios.post("http://localhost:5000/api/auth/register", form)
      
      if (res.data && res.data.user) {
        // Store user data in context and localStorage
        updateUser(res.data.user)
        
        alert("Registrasi berhasil")
        
        // Redirect based on role
        if (res.data.user.role === "guru") {
          navigate("/guru/kelas")
        } else {
          navigate("/kelas")
        }
      }
    } catch (error) {
      console.error("Register error:", error)
      alert(error.response?.data?.message || "Gagal registrasi")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md p-6 rounded w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Daftar DoClass</h2>
        <form onSubmit={handleRegister}>
          <input 
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 mb-2" 
            placeholder="Username" 
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} 
            required
          />
          <input 
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 mb-2" 
            type="email"
            placeholder="Email" 
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
            required
          />
          <input 
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 mb-2" 
            type="password" 
            placeholder="Password" 
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} 
            required
            minLength={6}
          />
          <select 
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 mb-4"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
          </select>
          <button 
            type="submit"
            className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
          >
            Daftar
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Sudah punya akun? <Link to="/" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
