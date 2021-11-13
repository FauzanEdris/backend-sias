const userModel = require('../models/users')
const semesterModel = require('../models/semester')

module.exports = {
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
  updateById: function (req, res, next) {
    semesterModel.findOneAndUpdate(req.params.movieId, { name: req.body.name }, function (err, movieInfo) {
      if (err) {
        res.status(400)
        next(err)
      } else {
        res.json({ status: 'success', message: 'Movie updated successfully!!!', data: null })
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
  statusSemester: async function (req, res, next) {
    await semesterModel.updateMany({}, { $set: { status: false, status_jadwal_dosen: false, status_jadwal_asdos: false, status_pendaftaran: false } })
    semesterModel.findOneAndUpdate({ _id: req.body.id }, { $set: { status: req.body.status } }, { new: 1 }, async function (err, result) {
      if (err) {
        res.status(400)
        res.json({ status: 'error', message: 'Data Gagal Ditambah.' })
      } else {
        if (result.status === false) {
          await semesterModel.findOneAndUpdate({ _id: req.body.id }, { $set: { status_jadwal_asdos: false, status_jadwal_dosen: false, status_pendaftaran: false } }, { new: 1 })
        }
        res.json({ status: 'success', message: 'Data Berhasil Di Update.', data: result })
      }
    })
  },
  statusJadwalAsdos: function (req, res, next) {
    semesterModel.updateOne({ _id: req.body.id }, { $set: { status_jadwal_asdos: req.body.status } }, { multi: false }, function (err, ayam) {
      if (err) {
        res.status(400)
        res.json({ status: 'error', message: 'Data Gagal Ditambah.' })
      } else {
        res.json({ status: 'success', message: 'Data Berhasil Di Update.', data: null })
      }
    })
  },
  statusJadwalDosen: function (req, res, next) {
    semesterModel.updateOne({ _id: req.body.id }, { $set: { status_jadwal_dosen: req.body.status } }, { multi: false }, function (err, ayam) {
      if (err) {
        res.status(400)
        res.json({ status: 'error', message: 'Data Gagal Ditambah.' })
      } else {
        res.json({ status: 'success', message: 'Data Berhasil Di Update.', data: null })
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
    semesterModel.updateMany({}, { $set: { status: false, status_jadwal_dosen: false, status_jadwal_asdos: false, status_pendaftaran: false } }, function (err, result) {
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
