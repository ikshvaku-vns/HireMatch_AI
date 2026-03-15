import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze';

dotenv.config({ path: '../.env' }); // Load .env from project root

const app = express();
const PORT = process.env.PORT || 3000;

// CORS: allow frontend origin(s). Set FRONTEND_ORIGIN (or FRONTEND_ORIGINS for multiple, comma-separated) in .env to restrict; omit to allow all origins.
const allowedOrigins = process.env.FRONTEND_ORIGINS
  ? process.env.FRONTEND_ORIGINS.split(',').map((o) => o.trim())
  : process.env.FRONTEND_ORIGIN
    ? [process.env.FRONTEND_ORIGIN.trim()]
    : undefined;

app.use(
  cors({
    ...(allowedOrigins && allowedOrigins.length > 0
      ? { origin: allowedOrigins }
      : {}),
  })
);
app.use(express.json());

app.use('/api', analyzeRouter);

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment.");
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
