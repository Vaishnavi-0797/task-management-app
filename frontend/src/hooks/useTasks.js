import { useCallback, useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api.js';

// Loads the logged-in user's tasks and offers create / update / delete helpers.
// After each change the local list is updated, so dashboard numbers update instantly.
export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.tasks);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createTask = async (data) => {
    const res = await api.post('/tasks', data);
    setTasks((prev) => [res.data.task, ...prev]);
    return res.data.task;
  };

  const updateTask = async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data.task : t)));
    return res.data.task;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, reload: load, createTask, updateTask, deleteTask };
}
