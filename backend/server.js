const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { port, clientOrigin } = require('./config/env');
const initDatabase = require('./database/init');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

initDatabase();

const app = express();
app.use(helmet());
app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`API running on http://localhost:${port}`));
