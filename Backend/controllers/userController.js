const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function signup(req, res, next) {
  try {
    const { name, role, email, password, confirmPassword } = req.body || {};

    if (!name || !name.trim()) return res.status(400).json({ error: 'Full Name is required' });
    if (!role || !role.trim()) return res.status(400).json({ error: 'Role is required' });

    if (!email || !emailRegex.test(String(email).trim().toLowerCase())) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords must match' });
    }

    const exists = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const hash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name: name.trim(),
      role: role.trim(),
      email: String(email).trim().toLowerCase(),
      password: hash
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    next(err);
  }
}

// ✅ UPDATED: roles come from SignUp data (User collection)
async function getRolesForEmail(req, res, next) {
  try {
    const { email } = req.query;
    const DEFAULT_ROLES = ['admin', 'headoffice', 'rajasthan', 'user'];

    // If email provided: return that user's role if exists (optional behavior)
    if (email) {
      const user = await User.findOne({ email: String(email).trim().toLowerCase() }).lean();
      if (user) {
        return res.json({ roles: [user.role] });
      }
      // If not found, continue to return distinct roles below
    }

    // No email (or email not found): return DISTINCT roles from DB (i.e., signup data)
    const roles = await User.distinct('role');
    const cleaned = [...new Set(roles.map(r => String(r).trim()))].filter(Boolean).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );

    if (cleaned.length === 0) {
      return res.json({ roles: DEFAULT_ROLES }); // fallback when DB empty
    }
    return res.json({ roles: cleaned });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password, role } = req.body || {};
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password and role are required' });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // Enforce role match
    if (String(role).trim().toLowerCase() !== String(user.role).trim().toLowerCase()) {
      return res.status(403).json({ error: 'Role not permitted for this account' });
    }

    const token = jwt.sign(
      { sub: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'devsecret',
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, getRolesForEmail, login };
