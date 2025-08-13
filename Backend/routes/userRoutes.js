const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');

router.post('/signup', ctrl.signup);           // POST /api/users/signup
router.get('/roles', ctrl.getRolesForEmail);   // GET  /api/users/roles  (now returns distinct roles from DB)
router.post('/login', ctrl.login);             // POST /api/users/login

module.exports = router;
