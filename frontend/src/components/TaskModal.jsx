import { useState } from 'react';
import Modal from './Modal.jsx';
import { getErrorMessage } from '../services/api.js';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../utils/constants.js';

// Used for both "New task" (task = null) and "Edit task".
export default function TaskModal({ task = null, onSave, onClose }) {
  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'todo',
    priority: task?.priority ?? 'medium',
    due_date: task?.due_date ?? '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Give the task a title.');
    setSaving(true);
    setError('');
    try {
      await onSave({ ...form, title: form.title.trim(), due_date: form.due_date || null });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Modal title={task ? 'Edit task' : 'New task'} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        {error && <div className="form-error" role="alert">{error}</div>}

        <label className="field">
          <span>Title</span>
          <input name="title" value={form.title} onChange={change} maxLength={100} autoFocus placeholder="What needs to be done?" />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea name="description" value={form.description} onChange={change} maxLength={1000} rows={4} placeholder="Add details (optional)" />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={change}>
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Priority</span>
            <select name="priority" value={form.priority} onChange={change}>
              {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>

        <label className="field">
          <span>Due date</span>
          <input type="date" name="due_date" value={form.due_date} onChange={change} />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
