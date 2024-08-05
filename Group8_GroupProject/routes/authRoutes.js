const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController'); 

router.get('/login', authController.renderLogin);
router.get('/signup', authController.renderSignup);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
