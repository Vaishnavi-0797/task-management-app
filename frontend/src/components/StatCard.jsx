export default function StatCard({ icon: Icon, label, value, tone = 'primary' }) {
  return (
    <div className="card stat-card">
      <span className={`stat-icon tone-${tone}`}><Icon size={20} /></span>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
