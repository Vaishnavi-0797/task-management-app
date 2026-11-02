require('dotenv').config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error(
    '\nERROR: JWT_SECRET is missing or too short.\n' +
      'Copy backend/.env.example to backend/.env and set JWT_SECRET.\n'
  );
  process.exit(1);
}

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  dbPath: process.env.DB_PATH || 'database/taskmanager.db',
};
