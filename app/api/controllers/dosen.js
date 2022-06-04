const userModel = require('../models/users')
const semesterModel = require('../models/semester')
const fs = require('fs')
const path = require('path')

module.exports = {
  getCalon: function (req, res, next) {
    semesterModel.find({ status: true, 'pendaftaran._id_dosen': req.body.id }, { pendaftaran: 1 }, function (err, dataPendaftaran) {
      if (err) {
        res.status(400)
        next(err)
      } else {
        if (dataPendaftaran.length === 0) {
          res.json({ status: 'success', message: 'Tidak ada Pendaftar.', data: null })
        } else {
          res.json({ status: 'success', message: 'Data ditemukan.', data: { id: dataPendaftaran[0].id, asdos: dataPendaftaran[0].pendaftaran } })
        }
      }
    })
  },
  getTranskip: function (req, res, next) {
    res.setHeader("content-type", "application/pdf");
    fs.createReadStream(path.join(__dirname, '../src/transkip/') + req.params.transkip).pipe(res);
  },
  getAsdos: async function (req, res, next) {
    try {
      const idAsdos = []
      const namaAsdos = []
      await userModel.find({ $and: [{ status: true, role: 'Asdos' }] }, { password: 0 }, function (err, userInfo) {
        if (err) {
          res.status(400)
          // next(err)
        } else {
          for (const user of userInfo) {
            // userList.push({ id: user._id, id_user: user.id, nama: user.nama, role: user.role, status: user.status, email: user.email })
            idAsdos.push(user.id)
            namaAsdos.push(user.nama)
          }
          res.json({ status: 'success', message: 'Data ditemukan!', users: { id: idAsdos, nama: namaAsdos } })
        }
      })
    } catch (error) {
      res.status(400)
    }
  },
  idAsdos: async function (req, res, next) {
    try {
      userModel.findOne({ id: req.params.idAsdos, status: true }, { password: 0 }, function (err, userInfo) {
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
  namaAsdos: async function (req, res, next) {
    try {
      userModel.findOne({ nama: req.params.namaAsdos, status: true }, { password: 0 }, function (err, userInfo) {
        if (err || userInfo === null) {
          // res.status(400)
          res.json({ status: 'error', message: 'Tidak ada user.', data: null })
        } else {
          res.json({ status: 'success', msg: 'User Ditemukan!', data: userInfo })
        }
      })
    } catch (error) {
      res.status(400)
    }
  },
  hapusCalon: function (req, res, next) {
    semesterModel.updateOne({ status: true, 'pendaftaran._id': req.params.idCalon }, { $pull: { pendaftaran: { _id: req.params.idCalon } } }, function (err, result) {
      if (err) {
        res.status(400)
        // next(err)
      } else {
        res.json({ status: 'success', message: 'Pendaftar di Tolak..', data: null })
      }
    })
  },
  terimaCalon: function (req, res, next) {
    semesterModel.updateOne({ status: true, 'pendaftaran._id': req.body.id }, { $set: { 'pendaftaran.$.status_acc': true } }, function (err, result) {
      if (err) {
        res.status(400)
        // next(err)
      } else {
        userModel.updateOne({ id: req.body.id }, { $set: { status: true } }, function (err, result) {
          if (err) {
            res.json({ status: 'success', message: 'Pendaftar di Tolak..', data: null })
          } else {
            res.json({ status: 'success', message: 'Pendaftar di Terima', data: null })
          }
        })
      }
    })
  },
  getJadwal: async function (req, res, next) {
    try {
      // const listJadwal = []
      await semesterModel.find({ status: true, status_jadwal_dosen: true }, { jadwal: 1 }, function (err, dataJadwal) {
        if (err) {
          res.status(400)
        } else if (dataJadwal.length === 0 || dataJadwal[0].jadwal.length === 0) {
          console.log(dataJadwal)
          res.json({ status: 'error', message: 'Tidak ada jadwal untuk ditampilkan.', data: null })
        } else {
          res.json({ status: 'success', message: 'Data Jadwal.', data: dataJadwal })
        }
      })
    } catch (error) {
      res.status(400)
    }
  },
  editJadwal: async function (req, res, next) {
    try {
      const a = await semesterModel.aggregate([
        { $match: { status: true } },
        { $unwind: '$jadwal' },
        { $match: { 'jadwal.id_asdos': req.body.id_asdos } },
        { $group: { _id: '$_id', sks: { $push: '$jadwal.sks' } } }
      ])
      console.log(a)
      let sum = a.length !== 0 ? (a[0].sks.reduce((total, value) => Number(total) + Number(value), 0)) : 0
      console.log(sum)
      sum = sum + Number(req.body.sks)
      if (sum >= 0 && sum <= 12) {
        const mongoose = require('mongoose')
        semesterModel.updateOne({ _id: mongoose.Types.ObjectId(req.params.idSemester), status: true, 'pendaftaran._id': req.body.id_asdos }, { $set: { 'pendaftaran.$.total_sks': sum } })
          .then((result) => {
            console.log(result)
            if (result.nModified === 1) {
              semesterModel.updateOne({ _id: req.params.idSemester, status: true, 'jadwal._id': req.body.id }, { $set: { 'jadwal.$.nama_asdos': req.body.nama_asdos, 'jadwal.$._id_asdos': req.body._id_asdos, 'jadwal.$.id_asdos': req.body.id_asdos, 'jadwal.$.status_asdos': req.body.status_asdos, 'jadwal.$.email_asdos': req.body.email_asdos } }, { multi: false }, function (err, ayam) {
                if (err) {
                  res.status(400)
                  res.json({ status: 'error', message: 'Data Gagal Ditambah.', data: err })
                } else {
                  res.json({ status: 'success', message: 'Data Berhasil Di Update.', data: a })
                }
              })
            } else {
              res.json({ status: 'error', message: 'Harap Ulangi.', data: null })
            }
          })
      } else {
        res.json({ status: 'success', message: 'Data Berhasil Di Update.', data: sum })
      }
    } catch (error) {
      console.log(error)
    }
  },
  batalBooking: async function (req, res, next) {
    try {
      const mongoose = require('mongoose')
      const a = await semesterModel.aggregate([
        { $match: { status: true } },
        { $unwind: '$jadwal' },
        { $match: { 'jadwal._id': mongoose.Types.ObjectId(req.body.id) } },
        { $group: { _id: '$_id', jadwal: { $push: '$jadwal' } } }
      ])
      const b = await semesterModel.aggregate([
        { $match: { status: true } },
        { $unwind: '$jadwal' },
        { $match: { 'jadwal._id_asdos': a[0].jadwal[0]._id_asdos } },
        { $group: { _id: '$_id', sks: { $push: '$jadwal.sks' } } }
      ])
      console.log(a)
      console.log(b)
      // res.json({ status: 'success', message: 'Data Berhasil Di Update.', a: a, b: b })
      let sum = b.length !== 0 ? (b[0].sks.reduce((total, value) => Number(total) + Number(value), 0)) : 0
      sum = sum - Number(a[0].jadwal[0].sks)
      console.log(sum)
      if (sum >= 0 && sum <= 12) {
        const mongoose = require('mongoose')
        semesterModel.updateOne({ _id: mongoose.Types.ObjectId(req.params.idSemester), status: true, 'pendaftaran._id': a[0].jadwal[0].id_asdos }, { $set: { 'pendaftaran.$.total_sks': sum } })
          .then((result) => {
            console.log(result)
            if (result.nModified === 1) {
              semesterModel.updateOne({ _id: req.params.idSemester, 'jadwal._id': req.body.id }, { $set: { 'jadwal.$.nama_asdos': null, 'jadwal.$._id_asdos': null, 'jadwal.$.id_asdos': null, 'jadwal.$.status_asdos': null, 'jadwal.$.email_asdos': null } }, { multi: false }, function (err, ayam) {
                if (err) {
                  res.status(400)
                  res.json({ status: 'error', message: 'Data Gagal Diubah.', data: err })
                } else {
                  res.json({ status: 'success', message: 'Data Berhasil Di Update.', data: req.body })
                }
              })
            } else {
              res.json({ status: 'error', message: 'Harap Ulangi.', data: null })
            }
          })
      } else {
        res.json({ status: 'success', message: 'Data Berhasil Di Update.', data: sum })
      }
    } catch (error) {
      console.log(error)
    }
  },
  getAll: function (req, res, next) {
    const listSemester = []
    semesterModel.find({}, null, { sort: { $natural: -1 } }, function (err, dataSemester) {
      if (err) {
        res.status(400)
        next(err)
      } else {
        for (const data of dataSemester) {
          listSemester.push({ id: data._id, semester: data.semester, tahun: data.tahun, status: data.status, status_jadwal_asdos: data.status_jadwal_asdos, status_jadwal_dosen: data.status_jadwal_dosen, status_pendaftaran: data.status_pendaftaran })
        }
        res.json({ status: 'success', message: 'Data ditemukan.', semester: listSemester })
      }
    })
  },
  deleteById: function (req, res, next) {
    semesterModel.findOneAndDelete({ _id: req.params.semesterId }, function (err, movieInfo) {
      if (err) {
        res.status(400)
        next(err)
      } else {
        res.json({ status: 'success', message: 'Data Semester Telah Di Hapus.', data: null })
      }
    })
  },
  statusSemester: function (req, res, next) {
    semesterModel.findOneAndUpdate({ _id: req.body.id }, { $set: { status: req.body.status } }, { multi: false }, function (err, ayam) {
      if (err) {
        res.status(400)
        res.json({ status: 'error', message: 'Data Gagal Ditambah.' })
      } else {
        res.json({ status: 'success', message: 'Data Berhasil Di Update.', data: ayam })
        console.log(ayam)
      }
    })
  },
  statusJadwalAsdos: function (req, res, next) {
    semesterModel.findOneAndUpdate({ _id: req.body.id }, { $set: { status_jadwal_asdos: req.body.status } }, { multi: false }, function (err, ayam) {
      if (err) {
        res.status(400)
        res.json({ status: 'error', message: 'Data Gagal Ditambah.' })
      } else {
        res.json({ status: 'success', message: 'Data Berhasil Di Update.', data: ayam })
      }
    })
  },
  statusJadwalDosen: function (req, res, next) {
    semesterModel.findOneAndUpdate({ _id: req.body.id }, { $set: { status_jadwal_dosen: req.body.status } }, { multi: false }, function (err, ayam) {
      if (err) {
        res.status(400)
        res.json({ status: 'error', message: 'Data Gagal Ditambah.' })
      } else {
        res.json({ status: 'success', message: 'Data Berhasil Di Update.', data: ayam })
      }
    })
  },
  statusPendaftaran: function (req, res, next) {
    semesterModel.findOneAndUpdate({ _id: req.body.id }, { $set: { status_pendaftaran: req.body.status } }, { multi: false }, function (err, ayam) {
      if (err) {
        res.status(400)
        res.json({ status: 'error', message: 'Data Gagal Ditambah.' })
      } else {
        res.json({ status: 'success', message: 'Data Berhasil Di Update.', data: ayam })
      }
    })
  },
  create: function (req, res, next) {
    semesterModel.updateMany({}, { $set: { status: false } }, function (err, result) {
      if (err) {
        res.status(400)
        res.json({ status: 'error', message: 'Data Gagal Ditambah.' })
      } else {
        userModel.updateMany({ role: 'Asdos' }, { $set: { status: false } }, function (err, result) {
          if (err) {
            res.json({ status: 'error', message: 'Data Gagal Ditambah.' })
          } else {
            semesterModel.collection.insertOne({ semester: req.body.semester, tahun: req.body.tahun, status: req.body.status }, function (err, result) {
              if (err) {
                console.log(err)
                res.status(400)
                res.json({ status: 'error', message: 'Semester Baru Gagal di Tambah.' })
              } else {
                res.status(200)
                res.json({ status: 'success', message: 'Semester Baru telah di Buka.' })
              }
            })
          }
        })
      }
    })
  }
}
