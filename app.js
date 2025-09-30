const express = require('express');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');

const connectDB = require('./config/db');

// Import routes + middleware
const authRoutes = require('./routes/authRoutes');
const statsRoutes = require('./routes/statsRoutes');
const logsRoutes = require('./routes/logsRoutes');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());



connectDB();

// Security + parsing
app.use(helmet());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/logs', logsRoutes);

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// ✅ Serve static files
app.use(express.static(path.join(__dirname, 'public')));


// ✅ 404 route
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Central error handler
app.use(errorHandler);

module.exports = app;
