import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getErrorMessage } from '../services/api.js';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) return setError('Enter your email and password.');
    setBusy(true);
    setError('');
    try {
      await login(form.email.trim(), form.password);
      showToast('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Log in"
      subtitle="Pick up where you left off."
      footer={<>New here? <Link to="/register">Create an account</Link></>}
    >
      <form onSubmit={submit} noValidate>
        {error && <div className="form-error" role="alert">{error}</div>}
        <label className="field">
          <span>Email address</span>
          <input type="email" name="email" value={form.email} onChange={change} autoComplete="email" autoFocus />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" name="password" value={form.password} onChange={change} autoComplete="current-password" />
        </label>
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
      </form>
    </AuthShell>
  );
}
