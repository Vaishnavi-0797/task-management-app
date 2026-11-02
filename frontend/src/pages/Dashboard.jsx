import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Hourglass, ListTodo, Plus } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import TaskList from '../components/TaskList.jsx';
import TaskModal from '../components/TaskModal.jsx';
import Spinner from '../components/Spinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useTasks from '../hooks/useTasks.js';
import { computeStats } from '../utils/format.js';

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { tasks, loading, error, reload, createTask, updateTask, deleteTask } = useTasks();
  const [creating, setCreating] = useState(false);

  const stats = computeStats(tasks);
  const recent = tasks.slice(0, 6); // list is already newest-first

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="muted">Here is where your work stands today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}><Plus size={18} /> Add new task</button>
      </div>

      {loading ? <Spinner label="Loading your tasks..." /> : error ? (
        <div className="card empty">
          <p>{error}</p>
          <button className="btn btn-ghost" onClick={reload}>Try again</button>
        </div>
      ) : (
        <>
          <section className="stat-grid" aria-label="Task statistics">
            <StatCard icon={ListTodo} label="Total tasks" value={stats.total} tone="primary" />
            <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} tone="green" />
            <StatCard icon={Clock} label="In progress" value={stats.inProgress} tone="amber" />
            <StatCard icon={Hourglass} label="Pending (to do)" value={stats.pending} tone="slate" />
          </section>

          <section className="card progress-card">
            <div className="progress-head">
              <strong>Completion</strong>
              <span>{stats.percent}%</span>
            </div>
            <div className="progress" role="progressbar" aria-valuenow={stats.percent} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${stats.percent}%` }} />
            </div>
            <small className="muted">{stats.completed} of {stats.total} tasks completed</small>
          </section>

          <div className="section-head">
            <h2>Recent tasks</h2>
            {tasks.length > 0 && <Link to="/tasks">View all tasks</Link>}
          </div>

          {recent.length === 0 ? (
            <div className="card empty">
              <p>You have no tasks yet. Add your first one to start tracking progress.</p>
              <button className="btn btn-primary" onClick={() => setCreating(true)}><Plus size={18} /> Add new task</button>
            </div>
          ) : (
            <TaskList tasks={recent} updateTask={updateTask} deleteTask={deleteTask} />
          )}
        </>
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
