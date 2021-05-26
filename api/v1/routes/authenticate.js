const express = require('express');
const { authenticate } = require('../controllers/authenticate');

const router = express.Router();

router.get('/login', authenticate);
router.get('/logout', authenticate);
router.get('/authecticate', authenticate);

module.exports = router;
