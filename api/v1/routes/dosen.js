const express = require('express')
const { authenticate } = require('../controllers/authenticate')
const router = express.Router()

router.get('/login', authenticate)

router.get('/pendaftaran')
router.get('/pendaftaran/download')
router.put('/pendaftaran/terima')
router.put('/pendaftaran/tolak')

router.put('/booking/tambah/asdos')
router.put('/booking/batal/asdos')

module.exports = router
