import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from './Spinner.jsx';

// Pages inside this route can only be seen when logged in.
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner label="Checking your session..." />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
