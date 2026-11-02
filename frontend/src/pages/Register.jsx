import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getErrorMessage } from '../services/api.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f) {
  const errors = {};
  if (f.name.trim().length < 2) errors.name = 'Enter your full name (at least 2 characters).';
  if (!EMAIL_RE.test(f.email.trim())) errors.email = 'Enter a valid email address.';
  if (f.password.length < 8) errors.password = 'Use at least 8 characters.';
  else if (!/[A-Za-z]/.test(f.password) || !/\d/.test(f.password)) errors.password = 'Include at least one letter and one number.';
  if (f.confirm !== f.password) errors.confirm = 'Passwords do not match.';
  return errors;
}

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setServerError('');
    if (Object.keys(found).length) return;

    setBusy(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      showToast('Account created. Welcome to TaskFlow!');
      navigate('/dashboard');
    } catch (err) {
      setServerError(getErrorMessage(err));
      setBusy(false);
    }
  };

  const Field = ({ name, label, type = 'text', autoComplete }) => (
    <label className="field">
      <span>{label}</span>
      <input type={type} name={name} value={form[name]} onChange={change} autoComplete={autoComplete} aria-invalid={Boolean(errors[name])} />
      {errors[name] && <small className="field-error">{errors[name]}</small>}
    </label>
  );

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free, and ready in under a minute."
      footer={<>Already registered? <Link to="/login">Log in</Link></>}
    >
      <form onSubmit={submit} noValidate>
        {serverError && <div className="form-error" role="alert">{serverError}</div>}
        {Field({ name: 'name', label: 'Full name', autoComplete: 'name' })}
        {Field({ name: 'email', label: 'Email address', type: 'email', autoComplete: 'email' })}
        {Field({ name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' })}
        {Field({ name: 'confirm', label: 'Confirm password', type: 'password', autoComplete: 'new-password' })}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Creating account...' : 'Register'}</button>
      </form>
    </AuthShell>
  );
}
