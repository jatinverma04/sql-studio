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


app.use(helmet());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            /^http:\/\/localhost:\d+$/,
            /^https:\/\/.*\.vercel\.app$/
        ];

        const isAllowed = allowedOrigins.some(pattern => pattern.test(origin));

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, true); 
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10kb' }));

// Logger
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));


app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});


app.use('/api/assignments', assignmentRoutes);


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found.`
    });
});




app.use(errorHandler);




connectMongo()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ CipherSQLStudio backend running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    });