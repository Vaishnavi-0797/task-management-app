import { CalendarDays } from 'lucide-react';
import Modal from './Modal.jsx';
import { PriorityBadge, StatusBadge } from './Badges.jsx';
import { formatDate, formatDateTime } from '../utils/format.js';

export default function TaskDetailsModal({ task, onClose, onEdit }) {
  return (
    <Modal title="Task details" onClose={onClose}>
      <h3 className="detail-title">{task.title}</h3>
      <div className="badge-row">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>
      <p className="detail-desc">{task.description || 'No description added.'}</p>
      <dl className="detail-list">
        <div><dt>Due date</dt><dd><CalendarDays size={14} /> {formatDate(task.due_date)}</dd></div>
        <div><dt>Created</dt><dd>{formatDateTime(task.created_at)}</dd></div>
        <div><dt>Last updated</dt><dd>{formatDateTime(task.updated_at)}</dd></div>
      </dl>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>Close</button>
        <button className="btn btn-primary" onClick={onEdit}>Edit task</button>
      </div>
    </Modal>
  );
}
