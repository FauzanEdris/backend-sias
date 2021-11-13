const express = require('express')
const router = express.Router()
const authController = require('../app/api/controllers/auths')
const jwt = require('jsonwebtoken')

const auth = function (req, res, next) {
  try {
    // const cookie = req.cookies['x-access-token'].split(' ')
    const x = req.cookies.x.split(' ')
    const access = req.cookies.access.split(' ')
    const token = req.cookies.token.split(' ')
    if ((x[0] === 'Ayam' && x[2] === 'Bebek') && (access[0] === 'Ayam' && access[2] === 'Bebek') && (token[0] === 'Ayam' && token[2] === 'Bebek')) {
      jwt.verify(x[1] + '.' + access[1] + '.' + token[1], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
          res.status(401)
          res.json({ status: 'error', msg: 'Harap Login', data: null })
          // res.redirect('/')
        } else if (decoded.role === 'Akademik') {
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

router.post('/register', authController.create)
router.post('/authenticate', authController.authenticate)
// router.get('/user', authController.user)
router.post('/logout', authController.logout)

module.exports = router
