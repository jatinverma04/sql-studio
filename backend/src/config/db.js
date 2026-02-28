const { Pool } = require('pg');
const mongoose = require('mongoose');

// PostgreSQL pool (sandbox for query execution)
const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,  
  ssl: process.env.POSTGRES_URL?.includes('neon.tech') || process.env.POSTGRES_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : false,
});

pgPool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error', err);
});

// MongoDB connection (persistence - assignments, users, attempts)
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = { pgPool, connectMongo };
