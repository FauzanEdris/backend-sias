const express = require('express');
const { authenticate } = require('../controllers/authenticate')
const router = express.Router();

router.get('/login', authenticate);

module.exports = router;
