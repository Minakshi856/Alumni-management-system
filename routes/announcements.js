import express from 'express';
import { db } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/announcements
// @desc    Get all announcements
router.get('/', async (req, res, next) => {
  try {
    const list = await db.getAnnouncements();
    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/announcements
// @desc    Admin creates an announcement
router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { title, category, content, is_pinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const created = await db.createAnnouncement({
      title,
      category: category || 'News',
      content,
      is_pinned: Boolean(is_pinned),
      created_by: req.user.id
    });

    await db.logActivity(req.user.fullName || 'Admin', 'Published Announcement', title);

    res.status(201).json({
      success: true,
      message: 'Announcement published successfully!',
      data: created
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Admin deletes an announcement
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    await db.deleteAnnouncement(req.params.id);
    await db.logActivity(req.user.fullName || 'Admin', 'Deleted Announcement', req.params.id);

    res.json({
      success: true,
      message: 'Announcement removed successfully.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
