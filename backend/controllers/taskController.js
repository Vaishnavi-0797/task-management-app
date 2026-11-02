const db = require('../database/db');
const HttpError = require('../utils/httpError');
const { validateTask } = require('../utils/validators');

// Every query includes "user_id = ?" so a user can only ever touch their own tasks.
function findOwnTask(id, userId) {
  return db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId);
}

function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, 'Invalid task id.');
  return id;
}

function listTasks(req, res) {
  const tasks = db
    .prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC, id DESC')
    .all(req.user.id);
  res.json({ tasks });
}

function getTask(req, res) {
  const task = findOwnTask(parseId(req.params.id), req.user.id);
  if (!task) throw new HttpError(404, 'Task not found.');
  res.json({ task });
}

function createTask(req, res) {
  const { errors, data } = validateTask(req.body);
  if (errors.length) throw new HttpError(400, errors[0], errors);

  const result = db
    .prepare(
      `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(req.user.id, data.title, data.description, data.status, data.priority, data.due_date);

  res.status(201).json({ task: findOwnTask(result.lastInsertRowid, req.user.id) });
}

function updateTask(req, res) {
  const id = parseId(req.params.id);
  const existing = findOwnTask(id, req.user.id);
  if (!existing) throw new HttpError(404, 'Task not found.');

  const { errors, data } = validateTask(req.body, existing);
  if (errors.length) throw new HttpError(400, errors[0], errors);

  db.prepare(
    `UPDATE tasks
     SET title = ?, description = ?, status = ?, priority = ?, due_date = ?,
         updated_at = datetime('now')
     WHERE id = ? AND user_id = ?`
  ).run(data.title, data.description, data.status, data.priority, data.due_date, id, req.user.id);

  res.json({ task: findOwnTask(id, req.user.id) });
}

function deleteTask(req, res) {
  const id = parseId(req.params.id);
  const result = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(id, req.user.id);
  if (result.changes === 0) throw new HttpError(404, 'Task not found.');
  res.json({ message: 'Task deleted.' });
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
