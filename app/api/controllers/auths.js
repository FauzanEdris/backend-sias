const userModel = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  create: function (req, res, next) {
    userModel.create({ id: req.body.id, nama: req.body.nama, role: req.body.role, status: req.body.status, email: req.body.email, password: req.body.password }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.json({ status: 'success', message: 'User added successfully!!!', data: null })
      }
    })
  },
  authenticate: function (req, res, next) {
    userModel.findOne({ email: req.body.username }, function (_err, userInfo) {
      if (userInfo === null) {
        res.json({ status: 'error', msg: 'Invalid Username!', data: null })
      } else {
        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          if (userInfo.status === true) {
            //  create token
            const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' }) // di token berisi data
            const split = token.split('.')
            const dataToken = split[2] + '.' + split[1] + '.' + split[0]
            res.json({ status: 'success', msg: 'user found!!!', data: { token: dataToken } })
            // res.json({ data: 'Bearer' + token })
            // res.cookie('token', token)
          } else {
            res.json({ status: 'error', msg: 'Akun Anda tidak terdaftar!', data: null })
          }
        } else {
          res.json({ status: 'error', msg: 'Invalid Password!', data: null })
        }
      }
    })
  },
  me: function (req, res, next) {
    try {
      // const cookie = req.cookies['x-access-token'].split(' ')
      const x = req.cookies.x.split(' ')
      const access = req.cookies.access.split(' ')
      const token = req.cookies.token.split(' ')
      if ((x[0] === 'Ayam' && x[2] === 'Bebek') && (access[0] === 'Ayam' && access[2] === 'Bebek') && (token[0] === 'Ayam' && token[2] === 'Bebek')) {
        jwt.verify(x[1] + '.' + access[1] + '.' + token[1], req.app.get('secretKey'), async function (err, decoded) {
          if (err) {
            res.status(401)
            res.json({ status: 'error', msg: 'Harap Login', data: null })
          } else {
            const user = await userModel.findOne({ _id: decoded.id }, { password: 0 })
            res.json({ status: 'success', msg: 'me', data: { user, iat: decoded.iat, exp: decoded.exp } })
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
  },
  logout: function (req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
      if (err) {
        res.json({ status: 'error', message: err.message, data: null })
      } else {
        // add user id to request
        req.body.userId = decoded.id
        next()
      }
    })
  }
}
