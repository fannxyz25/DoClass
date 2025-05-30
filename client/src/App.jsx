import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login' 
import Register from './pages/register'
import GuruKelas from "./pages/GuruKelas";
import SiswaKelas from "./pages/SiswaKelas";
import DetailKelas from "./pages/DetailKelas";
import Beranda from './pages/Beranda'
import Modul from './pages/modul'
// import TambahModul from './pages/TambahModul'
import Ujian from './pages/Ujian'
import RankingPage from './pages/RankingPage'
import ProtectedRoute from './components/ProtectedRoute'
import { UserProvider } from './components/UserContext'
import LoginForm from './components/LoginForm'

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Guru Routes */}
          <Route 
            path="/guru/kelas" 
            element={
              <ProtectedRoute allowedRoles={['guru']}>
                <GuruKelas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/guru/kelas/:id" 
            element={
              <ProtectedRoute allowedRoles={['guru']}>
                <DetailKelas />
              </ProtectedRoute>
            } 
          />

          {/* Protected Siswa Routes */}
          <Route 
            path="/kelas" 
            element={
              <ProtectedRoute allowedRoles={['siswa']}>
                <SiswaKelas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/kelas/:id" 
            element={
              <ProtectedRoute allowedRoles={['siswa']}>
                <DetailKelas />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes for Both Roles */}
          {/* Removed Beranda route */}
          {/* <Route 
            path="/beranda" 
            element={
              <ProtectedRoute allowedRoles={['guru', 'siswa']}>
                <Beranda />
              </ProtectedRoute>
            } 
          /> */}
          <Route 
            path="/modul" 
            element={
              <ProtectedRoute allowedRoles={['guru', 'siswa']}>
                <Modul />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ujian" 
            element={
              <ProtectedRoute allowedRoles={['guru', 'siswa']}>
                <Ujian />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ranking" 
            element={
              <ProtectedRoute allowedRoles={['guru', 'siswa']}>
                <RankingPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App