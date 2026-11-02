const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const HttpError = require('../utils/httpError');
const { validateRegister, validateLogin } = require('../utils/validators');

function signToken(userId) {
  return jwt.sign({ id: userId }, jwtSecret, { expiresIn: jwtExpiresIn });
}

function register(req, res) {
  const { errors, data } = validateRegister(req.body);
  if (errors.length) throw new HttpError(400, errors[0], errors);

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(data.email);
  if (exists) throw new HttpError(409, 'An account with this email already exists.');

  const hash = bcrypt.hashSync(data.password, 10);
  const result = db
    .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
    .run(data.name, data.email, hash);

  const user = db
    .prepare('SELECT id, name, email, created_at FROM users WHERE id = ?')
    .get(result.lastInsertRowid);
  res.status(201).json({ token: signToken(user.id), user });
}

function login(req, res) {
  const { errors, data } = validateLogin(req.body);
  if (errors.length) throw new HttpError(400, errors[0], errors);

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(data.email);
  // Same message for "no such user" and "wrong password" so attackers can't tell which.
  if (!row || !bcrypt.compareSync(data.password, row.password)) {
    throw new HttpError(401, 'Incorrect email or password.');
  }
  const user = { id: row.id, name: row.name, email: row.email, created_at: row.created_at };
  res.json({ token: signToken(user.id), user });
}

function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, me };
