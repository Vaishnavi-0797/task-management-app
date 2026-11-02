import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatDateTime } from '../utils/format.js';

export default function Profile() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('You have been logged out.');
    navigate('/login');
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Profile</h1>
          <p className="muted">Your account information.</p>
        </div>
      </div>

      <section className="card profile-card">
        <span className="avatar avatar-lg">{user.name.charAt(0).toUpperCase()}</span>
        <dl className="detail-list">
          <div><dt>Name</dt><dd>{user.name}</dd></div>
          <div><dt>Email address</dt><dd>{user.email}</dd></div>
          <div><dt>Member since</dt><dd>{formatDateTime(user.created_at)}</dd></div>
          <div><dt>Account ID</dt><dd>#{user.id}</dd></div>
        </dl>
        <button className="btn btn-danger" onClick={handleLogout}><LogOut size={16} /> Log out</button>
      </section>
    </>
  );
}
