import { CheckCircle2, Circle, Clock, Flag } from 'lucide-react';
import { priorityLabel, statusLabel } from '../utils/constants.js';

const STATUS_ICON = { todo: Circle, in_progress: Clock, completed: CheckCircle2 };

export function StatusBadge({ status }) {
  const Icon = STATUS_ICON[status] || Circle;
  return (
    <span className={`badge status-${status}`}>
      <Icon size={13} /> {statusLabel(status)}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`badge priority-${priority}`}>
      <Flag size={13} /> {priorityLabel(priority)}
    </span>
  );
}
