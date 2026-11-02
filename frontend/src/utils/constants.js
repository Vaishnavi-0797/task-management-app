export const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const statusLabel = (v) => STATUS_OPTIONS.find((o) => o.value === v)?.label ?? v;
export const priorityLabel = (v) => PRIORITY_OPTIONS.find((o) => o.value === v)?.label ?? v;
