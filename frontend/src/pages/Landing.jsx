import { Link } from 'react-router-dom';
import { BarChart3, ListChecks, ShieldCheck, Smartphone, Flag, Search } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const FEATURES = [
  { icon: ListChecks, title: 'Create and organize', text: 'Add tasks with a description, due date, status and priority, then edit or delete them any time.' },
  { icon: BarChart3, title: 'See your progress', text: 'A dashboard shows how many tasks are done, in progress or waiting, and your completion rate.' },
  { icon: Search, title: 'Find things fast', text: 'Search by keyword, filter by status or priority, and sort by due date.' },
  { icon: Flag, title: 'Focus on what matters', text: 'Low, medium and high priorities with overdue warnings keep urgent work visible.' },
  { icon: ShieldCheck, title: 'Private by design', text: 'Passwords are hashed and every task is tied to your account. Nobody else can open it.' },
  { icon: Smartphone, title: 'Works on every screen', text: 'The layout adapts from large monitors down to your phone.' },
];

export default function Landing() {
  const { user } = useAuth();
  return (
    <div className="landing">
      <header className="landing-nav">
        <Logo />
        <nav className="landing-links">
          <a href="#features">Features</a>
          {user ? (
            <Link className="btn btn-primary" to="/dashboard">Open dashboard</Link>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">Log in</Link>
              <Link className="btn btn-primary" to="/register">Get started</Link>
            </>
          )}
        </nav>
      </header>

      <section className="hero">
        <h1>Plan the day. Finish the work.</h1>
        <p>TaskFlow keeps every task, deadline and priority in one calm place, so you always know what to do next.</p>
        <div className="hero-actions">
          <Link className="btn btn-primary btn-lg" to={user ? '/dashboard' : '/register'}>Get started</Link>
          {!user && <Link className="btn btn-ghost btn-lg" to="/login">Log in</Link>}
        </div>

        <div className="hero-preview card" aria-hidden="true">
          <div className="preview-row"><span className="dot dot-green" /> Write project report <em>Completed</em></div>
          <div className="preview-row"><span className="dot dot-amber" /> Review pull requests <em>In progress</em></div>
          <div className="preview-row"><span className="dot dot-slate" /> Plan next sprint <em>To do</em></div>
          <div className="progress"><div className="progress-fill" style={{ width: '33%' }} /></div>
        </div>
      </section>

      <section id="features" className="features">
        <h2>Everything you need to stay on track</h2>
        <div className="feature-grid">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div className="card feature" key={title}>
              <span className="stat-icon tone-primary"><Icon size={20} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <Logo />
        <small>Built with React, Express and SQLite. {new Date().getFullYear()}</small>
      </footer>
    </div>
  );
}
