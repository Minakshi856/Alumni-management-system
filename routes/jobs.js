import express from 'express';
import { db } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all job postings with filters
router.get('/', async (req, res, next) => {
  try {
    const { search, job_type } = req.query;
    const jobs = await db.getJobs({ search, job_type });
    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/jobs
// @desc    Post a new job opening (Admin or Alumni)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      job_type,
      experience_level,
      salary_range,
      description,
      requirements,
      apply_url,
      contact_email
    } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({ success: false, message: 'Title, company, location, and description are required.' });
    }

    const newJob = await db.createJob({
      title,
      company,
      location,
      job_type: job_type || 'Full-time',
      experience_level: experience_level || 'Mid-Level',
      salary_range: salary_range || 'Competitive',
      description,
      requirements: requirements || '',
      apply_url: apply_url || '',
      contact_email: contact_email || req.user.email,
      posted_by: req.user.id
    });

    await db.logActivity(req.user.fullName || req.user.email, 'Posted Job Opening', `${title} at ${company}`);

    res.status(201).json({
      success: true,
      message: 'Job opening posted successfully!',
      data: newJob
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job opening (Admin or poster)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const updated = await db.updateJob(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    await db.logActivity(req.user.fullName || 'User', 'Updated Job', updated.title);

    res.json({
      success: true,
      message: 'Job posting updated successfully!',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job opening (Admin or poster)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await db.deleteJob(req.params.id);
    await db.logActivity(req.user.fullName || 'User', 'Deleted Job Posting', req.params.id);

    res.json({
      success: true,
      message: 'Job posting deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply to a job posting
router.post('/:id/apply', requireAuth, async (req, res, next) => {
  try {
    const { applicant_name, applicant_phone, resume_url, cover_note } = req.body;

    const application = await db.applyToJob({
      job_id: req.params.id,
      user_id: req.user.id,
      applicant_name: applicant_name || req.user.fullName || 'Applicant',
      applicant_email: req.user.email,
      applicant_phone: applicant_phone || '',
      resume_url: resume_url || '',
      cover_note: cover_note || ''
    });

    await db.logActivity(req.user.fullName || req.user.email, 'Applied for Job', `Job ID: ${req.params.id}`);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! The recruiter will review your profile.',
      data: application
    });
  } catch (err) {
    next(err);
  }
});

export default router;
