const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const SALT_ROUNDS = 10;

const normalizeEmail = (e) => (e || '').toLowerCase().trim();

// POST /api/auth/signup
exports.signUp = async (req, res) => {
  try {
    let { name, email, password, confirmpassword, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ error: 'All fields (name, email, password, role) are required.' });
    }

    if (confirmpassword !== undefined && confirmpassword !== password) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    email = normalizeEmail(email);
    role = String(role).trim();

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered.' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name: String(name).trim(), email, password: hash, role });

    return res.status(201).json({
      message: 'User created',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('SIGNUP ERROR', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: normalizeEmail(email) });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials.' });

    // If a role is provided on login, check case-insensitively
    if (
      role &&
      String(role).trim().toLowerCase() !== String(user.role).trim().toLowerCase()
    ) {
      return res
        .status(400)
        .json({ error: 'Role does not match the registered role for this email.' });
    }

    const token = jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('LOGIN ERROR', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/auth/roles?email=someone@example.com
// Returns only the role(s) for the provided email. If email missing/not found -> { roles: [] }.
exports.getRoles = async (req, res) => {
  try {
    const email = req.query.email ? normalizeEmail(req.query.email) : '';

    if (!email) {
      // Do NOT expose global roles
      return res.json({ roles: [] });
    }

    // With unique emails, this will be a single user; still future-proof
    const user = await User.findOne({ email }, 'role');
    const roles = user && user.role ? [String(user.role).trim()] : [];

    // sort case-insensitively just in case
    const sorted = roles.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    return res.json({ roles: sorted });
  } catch (err) {
    console.error('GET ROLES ERROR', err);
    return res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

/* ---- Optional backward-compat alias ---- */

// Some code might still import `signup` (lowercase n)
exports.signup = exports.signUp;
