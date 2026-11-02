import { useState } from 'react';
import TaskCard from './TaskCard.jsx';
import TaskModal from './TaskModal.jsx';
import TaskDetailsModal from './TaskDetailsModal.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getErrorMessage } from '../services/api.js';

// Shows task cards and owns the edit / details / delete dialogs.
// Used by both the Dashboard (recent tasks) and the All Tasks page.
export default function TaskList({ tasks, updateTask, deleteTask }) {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const changeStatus = async (task, status) => {
    try {
      await updateTask(task.id, { status });
      showToast('Status updated.');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(deleting.id);
      showToast('Task deleted.');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
    setDeleting(null);
  };

  return (
    <>
      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onView={setViewing}
            onEdit={setEditing}
            onDelete={setDeleting}
            onStatusChange={changeStatus}
          />
        ))}
      </div>

      {viewing && (
        <TaskDetailsModal
          task={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null); }}
        />
      )}
      {editing && (
        <TaskModal
          task={editing}
          onClose={() => setEditing(null)}
          onSave={async (data) => {
            await updateTask(editing.id, data);
            showToast('Task updated.');
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete this task?"
          message={`"${deleting.title}" will be permanently removed. This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}
