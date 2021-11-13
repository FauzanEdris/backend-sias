const userModel = require('../models/users')

module.exports = {
  getById: function (req, res, next) {
    console.log(req.body)
    userModel.findById(req.params.userId, { password: 0 }, function (err, userInfo) {
      if (err) {
        next(err)
      } else {
        res.json({ status: 'success', msg: 'User Ditemukan!', data: userInfo })
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
        res.json({ status: 'success', message: 'Data ditemukan!', users: userList })
      }
    })
  },
  updateById: function (req, res, next) {
    userModel.findByIdAndUpdate(req.body.id, { nama: req.body.nama, role: req.body.role, status: req.body.status, email: req.body.email }, function (err, movieInfo) {
      if (err) {
        res.json({ status: 'error', message: err, data: null })
        next(err)
      } else {
        res.json({ status: 'success', message: 'AYAM!!!', data: null })
      }
    })
  },
  deleteById: function (req, res, next) {
    userModel.findByIdAndRemove(req.params.userId, function (err, movieInfo) {
      if (err) {
        next(err)
      } else {
        res.json({ status: 'success', message: 'Movie deleted successfully!!!', data: null })
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
  }
}
