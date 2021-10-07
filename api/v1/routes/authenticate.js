const express = require('express');
const authController = require('../controllers/authenticate');

const router = express.Router();

router.post('/me', authController.me);
router.post('/logout', authController.logout);
router.post('/authecticate', authController.authenticate);

module.exports = router;
