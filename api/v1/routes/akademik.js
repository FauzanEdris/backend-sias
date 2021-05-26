const express = require('express');
// const { authenticate } = require('../controllers/authenticate')
const router = express.Router();

router.get('/asdos');

router.get('/kegiatan');
router.put('/kegiatan/terima');
router.put('/kegiatan/tolak');

module.exports = router;
