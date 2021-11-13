const express = require('express')
const router = express.Router()
const userModel = require('../app/api/models/users')
const semesterController = require('../app/api/controllers/semester')
const jadwalController = require('../app/api/controllers/jadwal')
const jwt = require('jsonwebtoken')

const auth = function (req, res, next) {
  try {
    // const cookie = req.cookies['x-access-token'].split(' ')
    const x = req.cookies.x.split(' ')
    const access = req.cookies.access.split(' ')
    const token = req.cookies.token.split(' ')
    if ((x[0] === 'Ayam' && x[2] === 'Bebek') && (access[0] === 'Ayam' && access[2] === 'Bebek') && (token[0] === 'Ayam' && token[2] === 'Bebek')) {
      jwt.verify(x[1] + '.' + access[1] + '.' + token[1], req.app.get('secretKey'), async function (err, decoded) {
        const user = await userModel.findOne({ _id: decoded.id }, { password: 0 })
        if (err) {
          res.status(401)
          res.json({ status: 'error', msg: 'Harap Login', data: null })
          // res.redirect('/')
        } else if (user.role === 'Operator') {
          next()
        } else {
          res.status(401)
          res.json({ status: 'error', msg: 'Harap Login', data: null })
          // res.redirect('/')
        }
      })
    } else {
      res.status(401)
      res.json({ status: 'error', msg: 'Harap Login', data: null })
    }
  } catch (error) {
    res.status(401)
    res.json({ status: 'error', msg: 'Harap Login', data: null })
  }
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
