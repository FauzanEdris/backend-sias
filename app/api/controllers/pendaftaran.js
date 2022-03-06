const semesterModel = require('../models/semester')
const userModel = require('../models/users')
const path = require('path')
// const mongoose = require('mongoose')

module.exports = {
  getDosen: async function (req, res, next) {
    try {
      const namaDosen = []
      await userModel.find({ role: 'Dosen' }, { _id: 1, id: 1, nama: 1 }, function (err, userInfo) {
        if (err) {
          res.status(400)
          // next(err)
        } else {
          for (const user of userInfo) {
            // userList.push({ id: user._id, id_user: user.id, nama: user.nama, role: user.role, status: user.status, email: user.email })
            namaDosen.push(user.nama)
          }
          res.json({ status: 'success', message: 'Data ditemukan!', users: { nama: namaDosen } })
        }
      })
    } catch (error) {
      res.status(400)
    }
  },
  create: async function (req, res, next) {
    const semester = await semesterModel.find({ status: true })
    const dosen = await userModel.find({ _id: req.body._id_dosen, id: req.body.id_dosen, nama: req.body.dosen, role: 'Dosen' }, { _id: 1, id: 1, nama: 1 })
    if (dosen.length === 0) {
      res.json({ status: 'error', message: 'Dosen tidak ditemukan.', data: null })
    } else {
      await semesterModel.find({ _id: semester[0]._id, status: true, 'pendaftaran._id': req.body.id }, { pendaftaran: { $elemMatch: { _id: req.body.id } } }, function (err, result) {
        if (err) {
          res.json({ status: 'error', message: 'Harap coba lagi!', data: null })
        } else if (result === null || result.length === 0) {
          semesterModel.findOneAndUpdate({ _id: semester[0]._id, status: true }, { $addToSet: { pendaftaran: { _id: req.body.id, nama: req.body.nama, status: req.body.status, email: req.body.email, dosen: req.body.dosen, _id_dosen: req.body._id_dosen, id_dosen: req.body.id_dosen } } }, async function (err, result2) {
            if (err) {
              res.json({ status: 'error', message: 'Gagal. Anda sudah terdaftar!', data: err })
            } else {
              const check = await userModel.find({ id: req.body.id, role: 'Asdos' })
              if (check.length === 0) {
                userModel.create({ id: req.body.id, nama: req.body.nama, role: 'Asdos', status: false, email: req.body.email }, async function (err, result) {
                  if (err) {
                    const hapus = await semesterModel.findOne({ 'pendaftaran._id': req.body.id }, { pendaftaran: { $elemMatch: { _id: req.body.id } } })
                    await semesterModel.updateOne({ status: true, 'pendaftaran._id': hapus.pendaftaran[0]._id }, { $pull: { pendaftaran: { _id: hapus.pendaftaran[0]._id } } })
                    res.json({ status: 'error', message: 'Email Anda sudah ada semester sebelumnya.', data: null })
                  } else {
                    if (req.body.status === 'Mahasiswa') {
                      console.log('data')
                      const data = await semesterModel.aggregate([
                        { $match: { _id: semester[0]._id, status: true, 'pendaftaran._id': req.body.id } },
                        { $unwind: '$pendaftaran' },
                        { $match: { 'pendaftaran._id': req.body.id } },
                        { $project: { 'pendaftaran._id': 1, 'pendaftaran.nama': 1 } }
                      ])
                      console.log(data)
                      // const data = await semesterModel.findOne({ _id: semester[0]._id, status: true, 'pendaftaran._id': req.body.id }, { pendaftaran: { $elemMatch: { _id: req.body.id } } }, { 'pendaftaran._id': 1, 'pendaftaran.nama': 1 })
                      // const data = await semesterModel.findOne({ _id: semester[0]._id, status: true, 'pendaftaran._id': { $eq: req.body.id } }, { 'pendaftaran._id': 1 } )
                      res.json({ status: 'ok', data: { id: semester[0]._id, id2: data[0].pendaftaran._id } })
                    } else {
                      res.json({ status: 'success', message: 'Pendaftaran Berhasil.', data: null })
                    }
                  }
                })
              } else {
                userModel.findOneAndUpdate({ $and: [{ id: req.body.id, role: 'Asdos' }] }, { $set: { id: req.body.id, nama: req.body.nama, role: 'Asdos', status: false, email: req.body.email } }, { password: 0, upsert: true }, async function (err, result3) {
                  if (err) {
                    const hapus = await semesterModel.findOne({ 'pendaftaran._id': req.body.id }, { pendaftaran: { $elemMatch: { _id: req.body.id } } })
                    await semesterModel.updateOne({ status: true, 'pendaftaran._id': hapus.pendaftaran[0]._id }, { $pull: { pendaftaran: { _id: hapus.pendaftaran[0]._id } } })
                    res.json({ status: 'error', message: 'Email Anda sudah ada semester sebelumnya.', data: null, p: err })
                  } else {
                    if (req.body.status === 'Mahasiswa') {
                      console.log('data')
                      const data = await semesterModel.aggregate([
                        { $match: { _id: semester[0]._id, status: true, 'pendaftaran._id': req.body.id } },
                        { $unwind: '$pendaftaran' },
                        { $match: { 'pendaftaran._id': req.body.id } },
                        { $project: { 'pendaftaran._id': 1, 'pendaftaran.nama': 1 } }
                      ])
                      console.log(data)
                      // const data = await semesterModel.findOne({ _id: semester[0]._id, status: true, 'pendaftaran._id': req.body.id }, { pendaftaran: { $elemMatch: { _id: req.body.id } }, 'pendaftaran._id': 1 })
                      res.json({ status: 'ok', data: { id: data[0]._id, id2: data[0].pendaftaran._id } })
                    } else {
                      res.json({ status: 'success', message: 'Pendaftaran Berhasil.', data: null })
                    }
                  }
                })
              }
            }
          })
        } else {
          res.json({ status: 'error', message: 'Anda sudah terdaftar!! ', data: result })
        }
      })
    }
  },
  transkip: async function (req, res, next) {
    // const id = mongoose.Types.ObjectId(req.params.idTranskip)
    const date = new Date()
    const transkip = await req.files.transkip
    // console.log(transkip)
    const dir = await path.join(__dirname, '../src/transkip/') + date.getFullYear() + date.getMonth() + date.getDate() + '__' + transkip.name
    await transkip.mv(dir)
    await semesterModel.findOneAndUpdate({ _id: req.params.idPendaftaran, 'pendaftaran._id': req.params.idUser }, { $set: { 'pendaftaran.$.transkip': dir } }, function (err, result) {
      if (err) {
        res.json({ status: 'error', message: err, data: result })
      } else {
        res.json({ status: 'success', message: 'Pendaftaran Berhasil.', data: null })
      }
    })
  },
  cariDosen: function (req, res, next) {
    try {
      userModel.findOne({ nama: req.params.namaDosen, role: 'Dosen' }, { _id: 1, id: 1, nama: 1 }, function (err, userInfo) {
        if (err || userInfo === null) {
          // res.status(200)
          res.json({ status: 'error', message: 'Tidak ada user.', data: null })
        } else {
          res.json({ status: 'success', msg: 'User Ditemukan!', data: userInfo })
        }
      })
    } catch (error) {
      res.status(400)
    }
  },
  statusPendaftaran: function (req, res, next) {
    try {
      semesterModel.findOne({ status: true, status_pendaftaran: true }, { _id: 0, status_pendaftaran: 1 }, function (err, result) {
        if (err || result === null) {
          res.json({ status: 'error', message: 'Ditutup!.', data: false })
        } else {
          res.json({ status: 'success', msg: 'Dibuka!', data: result.status_pendaftaran })
        }
      })
    } catch (error) {
      res.status(400)
    }
  }
}
