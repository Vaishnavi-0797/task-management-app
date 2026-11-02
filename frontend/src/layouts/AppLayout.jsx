import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListChecks, LogOut, Menu, UserCircle, X } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'All tasks', icon: ListChecks },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('You have been logged out.');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="mobile-bar">
        <Logo to="/dashboard" />
        <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
      </header>

      {open && <div className="scrim" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-head">
          <Logo to="/dashboard" />
          <button className="icon-btn mobile-only" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="nav">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="user-chip">
            <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
            <div className="user-meta">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-block" onClick={handleLogout}><LogOut size={16} /> Log out</button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
