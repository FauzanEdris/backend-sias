const express = require('express')
const router = express.Router()
const userModel = require('../app/api/models/users')
const semesterController = require('../app/api/controllers/semester')
const jadwalController = require('../app/api/controllers/jadwal')
const jwt = require('jsonwebtoken')

const auth = function (req, res, next) {
  req.helpers.auth('Operator', {req, res, next})
}

// SEMESTER
router.get('/semester', auth, semesterController.getAll)
router.post('/semester', auth, semesterController.create)
router.post('/semester/status', auth, semesterController.statusSemester)
router.post('/semester/statusjadwalasdos', auth, semesterController.statusJadwalAsdos)
router.post('/semester/statusjadwaldosen', auth, semesterController.statusJadwalDosen)
router.post('/semester/statuspendaftaran', auth, semesterController.statusPendaftaran)
router.delete('/semester/:semesterId', auth, semesterController.deleteById)

// JADWAL
router.get('/asdos', auth, jadwalController.getAsdos)
router.get('/asdos/id=:idAsdos', auth, jadwalController.idAsdos)
router.get('/asdos/nama=:namaAsdos', auth, jadwalController.namaAsdos)
router.get('/jadwal', auth, jadwalController.getAll)
router.get('/jadwal/export', auth, jadwalController.export)
router.post('/jadwal', auth, jadwalController.create)
router.put('/jadwal/:idSemester', auth, jadwalController.updateById)
router.delete('/jadwal/:jadwalId', auth, jadwalController.deleteById)

module.exports = router
