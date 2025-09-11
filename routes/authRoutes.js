const express = require('express');
const { signup, login, refreshToken, logout } = require('../controllers/authController');

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

module.exports = router;
