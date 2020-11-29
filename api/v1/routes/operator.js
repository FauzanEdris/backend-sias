const express = require('express')
// const { authenticate } = require('../controllers/authenticate')
const router = express.Router()

router.get('/semester')
router.post('/semester')
router.put('/semester')
router.delete('/semester')

router.patch('/status/pendaftaran')
router.patch('/status/asdos')
router.patch('/status/dosen')

router.get('/jadwal')
router.post('/jadwal')

router.get('/jadwal/download')

module.exports = router
