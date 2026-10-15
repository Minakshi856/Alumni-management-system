import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'alumniconnect_college_jwt_secret_key_2026_xyz';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// @route   POST /api/auth/register
// @desc    Register a new user (Alumni or Admin)
router.post('/register', async (req, res, next) => {
  try {
    const {
      email,
      password,
      role = 'alumni',
      fullName,
      graduationYear,
      department,
      degree,
      currentCompany,
      jobTitle,
      location,
      phone,
      linkedinUrl,
      skills
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Check if user already exists
    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await db.createUser({
      email,
      password_hash,
      role: role === 'admin' ? 'admin' : 'alumni'
    });

    let profile = null;
    if (newUser.role === 'alumni') {
      profile = await db.createAlumniProfile({
        user_id: newUser.id,
        full_name: fullName || email.split('@')[0],
        email: newUser.email,
        graduation_year: graduationYear ? parseInt(graduationYear, 10) : new Date().getFullYear(),
        department: department || 'Computer Science',
        degree: degree || 'B.Tech',
        current_company: currentCompany || '',
        job_title: jobTitle || '',
        location: location || '',
        phone: phone || '',
        linkedin_url: linkedinUrl || '',
        skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [],
        is_verified: true,
        status: 'Active'
      });
    }

    // Activity log
    await db.logActivity(fullName || email, 'Registered Account', `Role: ${newUser.role}`);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        profileId: profile ? profile.id : null,
        fullName: profile ? profile.full_name : 'Admin'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        profile
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    let profile = null;
    if (user.role === 'alumni') {
      profile = await db.getAlumniByUserId(user.id);
    }

    const fullName = profile ? profile.full_name : (user.role === 'admin' ? 'Administrator' : user.email);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        profileId: profile ? profile.id : null,
        fullName
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName,
        profile
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let profile = null;
    if (user.role === 'alumni') {
      profile = await db.getAlumniByUserId(user.id);
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
