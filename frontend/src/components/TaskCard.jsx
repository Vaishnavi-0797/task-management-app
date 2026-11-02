import { CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { PriorityBadge } from './Badges.jsx';
import { STATUS_OPTIONS } from '../utils/constants.js';
import { formatDate, isOverdue } from '../utils/format.js';

export default function TaskCard({ task, onView, onEdit, onDelete, onStatusChange }) {
  const overdue = isOverdue(task);
  return (
    <article className={`card task-card priority-bar-${task.priority} ${task.status === 'completed' ? 'is-done' : ''}`}>
      <div className="task-top">
        <button className="task-title" onClick={() => onView(task)}>{task.title}</button>
        <div className="task-actions">
          <button className="icon-btn" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}><Pencil size={16} /></button>
          <button className="icon-btn danger" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}><Trash2 size={16} /></button>
        </div>
      </div>

      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="badge-row">
        <PriorityBadge priority={task.priority} />
        <span className={`due ${overdue ? 'overdue' : ''}`}>
          <CalendarDays size={14} /> {formatDate(task.due_date)}{overdue && ' (overdue)'}
        </span>
      </div>

      <select
        className={`status-select status-${task.status}`}
        value={task.status}
        onChange={(e) => onStatusChange(task, e.target.value)}
        aria-label={`Change status of ${task.title}`}
      >
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </article>
  );
}
