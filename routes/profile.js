const express = require('express')
const router = express.Router()
const userModel = require('../app/api/models/users')
const userController = require('../app/api/controllers/users')
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
        } else if (['Admin', 'Operator', 'Asdos', 'Dosen', 'Akademik', 'Keuangan'].includes(user.role)) {
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

// router.get('/', auth, userController.getAll)
// router.post('/', auth, userController.create)
// router.get('/:userId', auth, userController.getById)
// router.put('/:userId', auth, userController.updateById)
// router.delete('/:userId', auth, userController.deleteById)

router.put('/me', auth, userController.updateProfile)
router.put('/me/password', auth, userController.updateProfilePassword)

module.exports = router
