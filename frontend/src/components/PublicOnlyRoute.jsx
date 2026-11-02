import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from './Spinner.jsx';

// Login/Register are hidden from users who are already logged in.
export default function PublicOnlyRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner label="Checking your session..." />;
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
