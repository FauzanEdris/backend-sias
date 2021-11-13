const express = require('express')
const router = express.Router()
const userModel = require('../app/api/models/users')
const asdosController = require('../app/api/controllers/asdos')
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
        } else if (user.role === 'Asdos') {
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
