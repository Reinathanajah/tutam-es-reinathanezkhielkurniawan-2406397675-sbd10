import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import entryRoutes from './routes/entryRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
let isConnected = false;
const connectDB = async (req, res, next) => {
  if (isConnected) return next();
  try {
    const db = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4
    });
    isConnected = db.connections[0].readyState === 1;
    next();
  } catch (err) {
    console.error('MongoDB Error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
};
app.use(connectDB);

app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
