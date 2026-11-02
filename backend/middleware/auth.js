const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { jwtSecret } = require('../config/env');
const HttpError = require('../utils/httpError');

// Runs before every protected route. Puts the logged-in user on req.user.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new HttpError(401, 'You must be logged in.'));
  }
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = db
      .prepare('SELECT id, name, email, created_at FROM users WHERE id = ?')
      .get(payload.id);
    if (!user) return next(new HttpError(401, 'Account no longer exists.'));
    req.user = user;
    next();
  } catch {
    next(new HttpError(401, 'Your session is invalid or has expired. Please log in again.'));
  }
}

module.exports = requireAuth;
