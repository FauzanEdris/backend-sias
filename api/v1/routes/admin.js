const express = require('express');
const { authenticate } = require('../controllers/admin')
const router = express.Router();

router.get('/', authenticate);

module.exports = router;
