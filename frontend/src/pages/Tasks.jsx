import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import TaskList from '../components/TaskList.jsx';
import TaskModal from '../components/TaskModal.jsx';
import Spinner from '../components/Spinner.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useTasks from '../hooks/useTasks.js';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../utils/constants.js';

export default function Tasks() {
  const { showToast } = useToast();
  const { tasks, loading, error, reload, createTask, updateTask, deleteTask } = useTasks();
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sort, setSort] = useState('created'); // created | due_asc | due_desc

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = tasks.filter((t) =>
      (status === 'all' || t.status === status) &&
      (priority === 'all' || t.priority === priority) &&
      (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    );
    if (sort === 'created') return list; // server already sends newest first
    // Tasks without a due date always go to the bottom.
    return [...list].sort((a, b) => {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return sort === 'due_asc' ? a.due_date.localeCompare(b.due_date) : b.due_date.localeCompare(a.due_date);
    });
  }, [tasks, search, status, priority, sort]);

  const filtersActive = search || status !== 'all' || priority !== 'all';
  const clearFilters = () => { setSearch(''); setStatus('all'); setPriority('all'); };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>All tasks</h1>
          <p className="muted">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}><Plus size={18} /> Add new task</button>
      </div>

      <div className="toolbar card">
        <label className="search">
          <Search size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks" aria-label="Search tasks" />
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Filter by priority">
          <option value="all">All priorities</option>
          {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort tasks">
          <option value="created">Newest first</option>
          <option value="due_asc">Due date: earliest</option>
          <option value="due_desc">Due date: latest</option>
        </select>
      </div>

      {loading ? <Spinner label="Loading your tasks..." /> : error ? (
        <div className="card empty">
          <p>{error}</p>
          <button className="btn btn-ghost" onClick={reload}>Try again</button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="card empty">
          <p>No tasks yet. Create one to get started.</p>
          <button className="btn btn-primary" onClick={() => setCreating(true)}><Plus size={18} /> Add new task</button>
        </div>
      ) : visible.length === 0 ? (
        <div className="card empty">
          <p>No tasks match your search or filters.</p>
          {filtersActive && <button className="btn btn-ghost" onClick={clearFilters}>Clear filters</button>}
        </div>
      ) : (
        <TaskList tasks={visible} updateTask={updateTask} deleteTask={deleteTask} />
      )}

      {creating && (
        <TaskModal
          onClose={() => setCreating(false)}
          onSave={async (data) => {
            await createTask(data);
            showToast('Task created.');
          }}
        />
      )}
    </>
  );
}
