import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginForm from './components/LoginForm';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <div className="min-h-screen w-full">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate
                  to={user.type === 'teacher' ? '/teacher' : '/student'}
                  replace
                />
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/teacher"
            element={
              user?.type === 'teacher' ? (
                <TeacherDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/student"
            element={
              user?.type === 'student' ? (
                <StudentDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
