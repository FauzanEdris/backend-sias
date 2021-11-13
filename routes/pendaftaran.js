const express = require('express')
const router = express.Router()
const pendaftaranController = require('../app/api/controllers/pendaftaran')

router.get('/status', pendaftaranController.statusPendaftaran)
router.get('/dosen', pendaftaranController.getDosen)
router.get('/:namaDosen', pendaftaranController.cariDosen)
router.post('/', pendaftaranController.create)
router.post('/:idPendaftaran/:idUser', pendaftaranController.transkip)

module.exports = router
