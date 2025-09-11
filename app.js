require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');


const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const statsRoutes = require('./routes/statsRoutes');
const logsRoutes = require('./routes/logsRoutes');
const errorHandler = require('./middleware/errorHandler');


const app = express();


// Security + parsing
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());


// Connect to DB
connectDB();


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/logs', logsRoutes);


// Health
app.get('/', (req, res) => res.json({ ok: true }));


// Central error handler
app.use(errorHandler);


module.exports = app;