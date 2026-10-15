import express from 'express';
import { db } from '../config/db.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with RSVP indicators and attendee counts
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const events = await db.getEvents({ userId });
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/events
// @desc    Admin creates a new college event
router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const {
      title,
      description,
      event_date,
      event_time,
      location,
      event_type,
      capacity,
      banner_url,
      is_virtual,
      meeting_link
    } = req.body;

    if (!title || !description || !event_date || !location) {
      return res.status(400).json({ success: false, message: 'Title, description, date, and location are required.' });
    }

    const newEvent = await db.createEvent({
      title,
      description,
      event_date,
      event_time: event_time || '10:00 AM',
      location,
      event_type: event_type || 'Reunion',
      capacity: capacity ? parseInt(capacity, 10) : 100,
      banner_url: banner_url || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80',
      is_virtual: Boolean(is_virtual),
      meeting_link: meeting_link || '',
      created_by: req.user.id
    });

    await db.logActivity(req.user.fullName || 'Admin', 'Created Event', title);

    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      data: newEvent
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/events/:id
// @desc    Admin updates an event
router.put('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const updated = await db.updateEvent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    await db.logActivity(req.user.fullName || 'Admin', 'Updated Event', updated.title);

    res.json({
      success: true,
      message: 'Event updated successfully!',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/events/:id
// @desc    Admin deletes an event
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    await db.deleteEvent(req.params.id);
    await db.logActivity(req.user.fullName || 'Admin', 'Deleted Event', req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/events/:id/rsvp
// @desc    Toggle RSVP for logged-in user
router.post('/:id/rsvp', requireAuth, async (req, res, next) => {
  try {
    const result = await db.toggleRsvp(req.params.id, req.user.id);
    await db.logActivity(req.user.fullName || req.user.email, result.attending ? 'RSVP Attending' : 'Cancelled RSVP', `Event ID: ${req.params.id}`);

    res.json({
      success: true,
      message: result.attending ? 'RSVP confirmed! See you at the event.' : 'RSVP cancelled.',
      is_attending: result.attending
    });
  } catch (err) {
    next(err);
  }
});

export default router;
