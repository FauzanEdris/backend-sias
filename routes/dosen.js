const express = require('express')
const router = express.Router()
const userModel = require('../app/api/models/users')
const dosenController = require('../app/api/controllers/dosen')
const jwt = require('jsonwebtoken')

const auth = function (req, res, next) {
  req.helpers.auth('Dosen', {req, res, next})
}

// Rekomendasi Dosen
router.post('/calon', auth, dosenController.getCalon)
router.put('/calon', auth, dosenController.terimaCalon)
router.delete('/calon/:idCalon', auth, dosenController.hapusCalon)

// Booking Asdos
router.get('/jadwal', auth, dosenController.getJadwal)
router.get('/asdos', auth, dosenController.getAsdos)
router.get('/asdos/id=:idAsdos', auth, dosenController.idAsdos)
router.get('/asdos/nama=:namaAsdos', auth, dosenController.namaAsdos)
router.put('/jadwal/:idSemester', auth, dosenController.editJadwal)
router.put('/jadwal/batal/:idSemester', auth, dosenController.batalBooking)

module.exports = router
