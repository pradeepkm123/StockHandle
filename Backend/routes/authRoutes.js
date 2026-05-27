// routes/authRoutes.js
const express = require('express');
const { signUp, login, getRoles } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/roles', getRoles);

module.exports = router;
