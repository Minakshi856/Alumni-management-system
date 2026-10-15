import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/alumni
// @desc    Get alumni list with search and filters (Open or authenticated)
router.get('/', async (req, res, next) => {
  try {
    const { search, department, batch, status } = req.query;
    const alumniList = await db.getAlumniList({ search, department, batch, status });
    res.json({
      success: true,
      count: alumniList.length,
      data: alumniList
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/alumni/:id
// @desc    Get alumni by ID
router.get('/:id', async (req, res, next) => {
  try {
    const alumni = await db.getAlumniById(req.params.id);
    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni record not found.' });
    }
    res.json({ success: true, data: alumni });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/alumni
// @desc    Admin adds a new alumni record manually
router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const {
      email,
      fullName,
      graduationYear,
      department,
      degree,
      currentCompany,
      jobTitle,
      location,
      phone,
      linkedinUrl,
      githubUrl,
      bio,
      avatarUrl,
      skills,
      status
    } = req.body;

    if (!fullName || !department || !graduationYear) {
      return res.status(400).json({ success: false, message: 'Full name, department, and graduation year are required.' });
    }

    // If an email is provided, create a corresponding user or check duplicate
    let userId = null;
    if (email) {
      const existingUser = await db.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An alumni with this email already exists.' });
      }
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash('alumni123', salt);
      const user = await db.createUser({ email, password_hash, role: 'alumni' });
      userId = user.id;
    }

    const newProfile = await db.createAlumniProfile({
      user_id: userId,
      full_name: fullName,
      email: email || '',
      graduation_year: parseInt(graduationYear, 10),
      department,
      degree: degree || 'B.Tech',
      current_company: currentCompany || '',
      job_title: jobTitle || '',
      location: location || '',
      phone: phone || '',
      linkedin_url: linkedinUrl || '',
      github_url: githubUrl || '',
      bio: bio || '',
      avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      skills: skills || [],
      is_verified: true,
      status: status || 'Active'
    });

    await db.logActivity(req.user.fullName || 'Admin', 'Added Alumni Record', fullName);

    res.status(201).json({
      success: true,
      message: 'Alumni record created successfully!',
      data: newProfile
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/alumni/:id
// @desc    Update alumni profile (Admin or the Alumni itself)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const profile = await db.getAlumniById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Alumni profile not found.' });
    }

    // Role check: Only admin or the profile owner
    if (req.user.role !== 'admin' && profile.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this profile.' });
    }

    const {
      full_name,
      graduation_year,
      department,
      degree,
      current_company,
      job_title,
      location,
      phone,
      linkedin_url,
      github_url,
      portfolio_url,
      bio,
      avatar_url,
      skills,
      status,
      is_verified
    } = req.body;

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (graduation_year !== undefined) updates.graduation_year = parseInt(graduation_year, 10);
    if (department !== undefined) updates.department = department;
    if (degree !== undefined) updates.degree = degree;
    if (current_company !== undefined) updates.current_company = current_company;
    if (job_title !== undefined) updates.job_title = job_title;
    if (location !== undefined) updates.location = location;
    if (phone !== undefined) updates.phone = phone;
    if (linkedin_url !== undefined) updates.linkedin_url = linkedin_url;
    if (github_url !== undefined) updates.github_url = github_url;
    if (portfolio_url !== undefined) updates.portfolio_url = portfolio_url;
    if (bio !== undefined) updates.bio = bio;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (skills !== undefined) updates.skills = skills;

    // Only admin can change verification and status
    if (req.user.role === 'admin') {
      if (status !== undefined) updates.status = status;
      if (is_verified !== undefined) updates.is_verified = is_verified;
    }

    const updated = await db.updateAlumniProfile(req.params.id, updates);

    await db.logActivity(req.user.fullName || 'User', 'Updated Profile', updated.full_name);

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/alumni/:id/status
// @desc    Admin update alumni verification and status
router.patch('/:id/status', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { status, is_verified } = req.body;
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (is_verified !== undefined) updates.is_verified = Boolean(is_verified);

    const updated = await db.updateAlumniProfile(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Alumni record not found.' });
    }

    await db.logActivity(req.user.fullName || 'Admin', 'Updated Alumni Status', `${updated.full_name} (${status || 'Verified'})`);

    res.json({
      success: true,
      message: 'Status updated successfully!',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/alumni/:id
// @desc    Admin deletes alumni record
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const profile = await db.getAlumniById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Alumni not found.' });
    }

    await db.deleteAlumniProfile(req.params.id);
    await db.logActivity(req.user.fullName || 'Admin', 'Deleted Alumni Record', profile.full_name);

    res.json({
      success: true,
      message: `Alumni record for ${profile.full_name} deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
});

export default router;
