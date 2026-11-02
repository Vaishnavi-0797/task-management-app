// due_date looks like "2026-11-30"; created_at looks like "2026-11-02 09:15:00" (UTC).
export function formatDate(dateStr) {
  if (!dateStr) return 'No due date';
  const d = new Date(`${dateStr.slice(0, 10)}T00:00:00`);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(sqlDateTime) {
  if (!sqlDateTime) return '';
  const d = new Date(sqlDateTime.replace(' ', 'T') + 'Z');
  return d.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function todayString() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function isOverdue(task) {
  return Boolean(task.due_date) && task.status !== 'completed' && task.due_date < todayString();
}

export function computeStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const pending = tasks.filter((t) => t.status === 'todo').length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, inProgress, pending, percent };
}
