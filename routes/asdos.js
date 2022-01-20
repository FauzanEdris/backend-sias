const express = require('express')
const router = express.Router()
const userModel = require('../app/api/models/users')
const asdosController = require('../app/api/controllers/asdos')
const jwt = require('jsonwebtoken')

const auth = function (req, res, next) {
  req.helpers.auth('Asdos', {req, res, next})
}

// Rekomendasi Dosen
// router.post('/calon', auth, dosenController.getCalon)
// router.put('/calon', auth, dosenController.terimaCalon)
// router.delete('/calon/:idCalon', auth, dosenController.hapusCalon)

// Polling Jadwal
router.get('/jadwal/:idAsdos', auth, asdosController.getJadwal)
router.put('/polling/:idSemester', auth, asdosController.updatePolling)

// Perkuliahan
router.get('/perkuliahan/:idAsdos', auth, asdosController.getPerkuliahan)
router.put('/perkuliahan/mulai/:idAsdos', auth, asdosController.mulaiPerkuliahan)

// Detail Perkuliahan
router.get('/perkuliahan/detail/:idJadwal/:idAsdos', auth, asdosController.detailPerkuliahan)

// Laporan
router.post('/perkuliahan/laporan/:idJadwal/:idAsdos', auth, asdosController.tambahPertemuan)

module.exports = router
