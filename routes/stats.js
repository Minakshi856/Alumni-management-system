import express from 'express';
import { db } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/stats/dashboard
// @desc    Get comprehensive stats for Admin Dashboard
router.get('/dashboard', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const stats = await db.getDashboardStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/stats/public
// @desc    Public overview stats for Landing Page
router.get('/public', async (req, res, next) => {
  try {
    const stats = await db.getDashboardStats();
    res.json({
      success: true,
      data: {
        totalAlumni: stats.summary.totalAlumni,
        employmentRate: stats.summary.employmentRate,
        totalEvents: stats.summary.totalEvents,
        totalJobs: stats.summary.totalJobs,
        topCompanies: stats.topCompanies
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
