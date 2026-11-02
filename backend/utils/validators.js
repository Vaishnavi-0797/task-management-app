const STATUSES = ['todo', 'in_progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// Each validator returns { errors: [...], data: {...cleaned values...} }
function validateRegister(body = {}) {
  const errors = [];
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (name.length < 2 || name.length > 60) errors.push('Name must be 2 to 60 characters.');
  if (!EMAIL_RE.test(email) || email.length > 120) errors.push('Enter a valid email address.');
  if (password.length < 8 || password.length > 72) errors.push('Password must be 8 to 72 characters.');
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
    errors.push('Password must contain at least one letter and one number.');

  return { errors, data: { name, email, password } };
}

function validateLogin(body = {}) {
  const errors = [];
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email) errors.push('Email is required.');
  if (!password) errors.push('Password is required.');
  return { errors, data: { email, password } };
}

// `existing` is the current task when updating, so omitted fields keep their old value.
function validateTask(body = {}, existing = {}) {
  const errors = [];
  const pick = (key, fallback) => (body[key] !== undefined ? body[key] : existing[key] ?? fallback);

  const title = String(pick('title', '')).trim();
  const description = String(pick('description', '')).trim();
  const status = pick('status', 'todo');
  const priority = pick('priority', 'medium');
  let dueDate = pick('due_date', null);
  if (dueDate === '') dueDate = null;

  if (!title) errors.push('Title is required.');
  else if (title.length > 100) errors.push('Title must be 100 characters or fewer.');
  if (description.length > 1000) errors.push('Description must be 1000 characters or fewer.');
  if (!STATUSES.includes(status)) errors.push('Status must be todo, in_progress or completed.');
  if (!PRIORITIES.includes(priority)) errors.push('Priority must be low, medium or high.');
  if (dueDate !== null && !isValidDate(dueDate)) errors.push('Due date must be a valid date (YYYY-MM-DD).');

  return { errors, data: { title, description, status, priority, due_date: dueDate } };
}

module.exports = { validateRegister, validateLogin, validateTask };
