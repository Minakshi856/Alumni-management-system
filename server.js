import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './src/routes/auth.js';
import alumniRoutes from './src/routes/alumni.js';
import eventRoutes from './src/routes/events.js';
import jobRoutes from './src/routes/jobs.js';
import announcementRoutes from './src/routes/announcements.js';
import statsRoutes from './src/routes/stats.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: process.env.USE_SUPABASE === 'true' ? 'Supabase PostgreSQL' : 'Local Persistence Engine',
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/stats', statsRoutes);

// Serve Frontend Static Files if built (client/dist)
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  console.log(`📂 Serving compiled frontend from: ${clientDist}`);
  app.use(express.static(clientDist));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ success: false, message: `API endpoint ${req.originalUrl} not found.` });
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  // Root route fallback if frontend is not built
  app.get('/', (req, res) => {
    res.json({
      message: '🎓 AlumniConnect API is running smoothly.',
      version: '1.0.0',
      health: '/api/health',
      status: 'online'
    });
  });

  // 404 Route handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint ${req.originalUrl} not found.`
    });
  });
}

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 AlumniConnect Server started on port ${PORT}`);
  console.log(`🌐 Website URL: http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Database: ${process.env.USE_SUPABASE === 'true' ? 'Supabase PostgreSQL Cloud' : 'Local Resilient Storage Engine'}`);
  console.log(`====================================================`);
});

export default app;
