import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useUser();
  const location = useLocation();

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if current route is a class detail route
  const isClassDetailRoute = location.pathname.match(/^\/kelas\/[^/]+$/);
  const isClassManageRoute = location.pathname.match(/^\/kelas\/[^/]+\/manage$/);

  // If accessing class detail routes, handle them specially
  if (isClassDetailRoute || isClassManageRoute) {
    // Teachers should use manage route, students should use detail route
    if (user.role === 'guru' && isClassDetailRoute) {
      return <Navigate to={`${location.pathname}/manage`} replace />;
    }
    if (user.role === 'siswa' && isClassManageRoute) {
      return <Navigate to={location.pathname.replace('/manage', '')} replace />;
    }
  }

  // For other routes, check role permissions
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === 'guru' ? '/guru/kelas' : '/kelas';
    // Only redirect if not already on the correct dashboard
    if (location.pathname !== redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 