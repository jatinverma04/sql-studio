require('express-async-errors');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectMongo } = require('./config/db');
const assignmentRoutes = require('./routes/assignments');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & parsing middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || /^http:\/\/localhost:\d+$/,
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));


app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use('/api/assignments', assignmentRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

app.use(errorHandler);

// Start server
connectMongo().then(() => {
    app.listen(PORT, () => {
        console.log(`CipherSQLStudio backend running on http://localhost:${PORT}`);
    });
});
