import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
import authRoutes from './routes/authRoutes';
import ngoRoutes from './routes/ngoRoutes';
import eventRoutes from './routes/eventRoutes';
import volunteerRoutes from './routes/volunteerRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/volunteers', volunteerRoutes);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'ImpactHub API is running' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});