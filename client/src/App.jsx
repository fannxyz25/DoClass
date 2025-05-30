import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import GuruKelas from './components/GuruKelas';

function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Router>
        <div className="w-full flex items-center justify-center">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/guru/kelas" element={<GuruKelas />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
