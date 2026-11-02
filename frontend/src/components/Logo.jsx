import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="logo" aria-label="TaskFlow home">
      <span className="logo-mark"><Check size={18} strokeWidth={3} /></span>
      <span>TaskFlow</span>
    </Link>
  );
}
