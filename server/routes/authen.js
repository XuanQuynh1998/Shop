const express = require('express');
const passport = require('passport');
const router = express.Router();

const AuthenController = require('../controllers/AuthenController');

router.post('/register', AuthenController.register);
router.post('/login',  AuthenController.login);
router.get('/logout', AuthenController.logout);

module.exports = router;