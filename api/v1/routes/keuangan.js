const express = require('express');
// const { authenticate } = require('../controllers/authenticate')
const router = express.Router();

router.put('/kegiatan/terima');
router.put('/kegiatan/tolak');

module.exports = router;
