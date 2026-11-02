import Logo from './Logo.jsx';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-card card">
        <Logo />
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
        <p className="auth-footer">{footer}</p>
      </div>
    </div>
  );
}
