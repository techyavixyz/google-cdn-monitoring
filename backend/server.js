import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import metricsRoutes from './routes/metrics.js';
import analyticsRoutes from './routes/analytics.js';
import { initializeSchema } from './utils/initSchema.js';
import { initializeAdminUser } from './utils/initAdmin.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, async () => {
  console.log(`🚀 KloudScope Backend running on http://localhost:${port}`);
  console.log(`📊 CDN Analytics API ready`);
  console.log(`🔐 Authentication enabled`);

  // Initialize DB schema before anything else
  await initializeSchema();

  // Then initialize default admin user
  await initializeAdminUser();
});
