const userModel = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
  getById: function (req, res, next) {
    console.log(req.body)
    userModel.findById(req.params.userId, { password: 0 }, function (err, userInfo) {
      if (err) {
        next(err)
      } else {
        res.json({ status: 'success', msg: 'Data User Ditemukan.', data: userInfo })
      }
    })
  },
  getAll: function (req, res, next) {
    const userList = []
    userModel.find({}, { password: 0 }, function (err, userInfo) {
      if (err) {
        res.status(400)
        // next(err)
      } else {
        for (const user of userInfo) {
          userList.push({ id: user._id, id_user: user.id, nama: user.nama, role: user.role, status: user.status, email: user.email })
        }
        res.json({ status: 'success', message: 'List Semua Data User.', users: userList })
      }
    })
  },
  updateById: function (req, res, next) {
    userModel.findByIdAndUpdate(req.body.id, { nama: req.body.nama, role: req.body.role, status: req.body.status, email: req.body.email }, function (err, movieInfo) {
      if (err) {
        res.json({ status: 'error', message: err, data: null })
        next(err)
      } else {
        res.json({ status: 'success', message: 'Data User Berhasil Terupdate.', data: null })
      }
    })
  },
  updatePassword: function (req, res, next) {
    userModel.findByIdAndUpdate(req.body.id, { password: req.body.password }, function (err, movieInfo) {
      if (err) {
        res.json({ status: 'error', message: err, data: null })
        next(err)
      } else {
        res.json({ status: 'success', message: 'Password Berhasil Diubah.', data: null })
      }
    })
  },
  deleteById: function (req, res, next) {
    userModel.findByIdAndRemove(req.params.userId, function (err, movieInfo) {
      if (err) {
        next(err)
      } else {
        res.json({ status: 'success', message: 'Data User Berhasil Terhapus.', data: null })
        console.log(req.params.id)
      }
    })
  },
  create: function (req, res, next) {
    userModel.create({ id: req.body.id_user, nama: req.body.nama, role: req.body.role, status: req.body.status, email: req.body.email, password: req.body.password }, function (err, result) {
      if (err) {
        res.json({ status: 'error', message: err, data: null })
        next(err)
        // next(err)
      } else {
        res.json({ status: 'success', message: 'Movie added successfully!!!', data: null })
      }
    })
  },
  updateProfile: function (req, res, next) {
    userModel.findByIdAndUpdate(req.body.id, { password: req.body.password }, function (err, movieInfo) {
      if (err) {
        res.json({ status: 'error', message: err, data: null })
        next(err)
      } else {
        res.json({ status: 'success', message: 'Password Berhasil Diubah.', data: null })
      }
    })
  },
  updateProfilePassword: function (req, res, next) {
    err = false
    const x = req.cookies.x.split(' ')
    const access = req.cookies.access.split(' ')
    const token = req.cookies.token.split(' ')
    if ((x[0] === 'Ayam' && x[2] === 'Bebek') && (access[0] === 'Ayam' && access[2] === 'Bebek') && (token[0] === 'Ayam' && token[2] === 'Bebek')) {
      jwt.verify(x[1] + '.' + access[1] + '.' + token[1], req.app.get('secretKey'), async function (err, decoded) {
        const user = await userModel.findOne({ _id: decoded.id }, { password: 1 })
        if (bcrypt.compareSync(req.body.old_password, user.password)) {
          if ( req.body.new_password === req.body.confirm_password ) {
            const pass = bcrypt.hashSync(req.body.new_password, 10)
            userModel.findByIdAndUpdate(user._id, { password: pass }, function (err, movieInfo) {
              if (err) {
                res.json({ status: 'error', message: err, data: null })
                next(err)
              } else {
                res.json({ status: 'success', message: 'Password Berhasil Diubah.', data: null })
              }
            })
          } else {
            res.json({ status: 'error', message: 'Konfirmasi Password tidak sama dengan yang baru.', data: null })
          }
        } else {
          res.json({ status: 'error', message: 'Password Lama Salah.', data: null })
        }
      })
    } else {
      res.json({ status: 'error', message: 'Password Gagal Diubah.', data: null })
    }
  },
}
