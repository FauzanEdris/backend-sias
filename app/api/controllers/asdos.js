const userModel = require('../models/users')
const semesterModel = require('../models/semester')
const mongoose = require('mongoose')

module.exports = {
  // Polling Jadwal
  getJadwal: async function (req, res, next) {
    try {
      const check = await semesterModel.aggregate([
        { $match: { status: true } },
        { $unwind: '$pendaftaran' },
        { $match: { 'pendaftaran._id': req.params.idAsdos } },
        { $project: { 'pendaftaran.status_kuliah': 1 } }
      ])
      if (check[0].pendaftaran.status_kuliah === false) {
        await semesterModel.find({ status: true, status_jadwal_asdos: true }, { jadwal: 1 }, function (err, dataJadwal) {
          if (err) {
            res.status(400)
          } else if (dataJadwal.length === 0 || dataJadwal[0].jadwal.length === 0) {
            res.json({ status: 'error', message: 'Tidak ada jadwal untuk ditampilkan.', data: null })
          } else {
            res.json({ status: 'success', message: 'Data Jadwal.', data: dataJadwal })
            req.io.emit('dataJadwal', { status: 'success', message: 'Data Jadwal.', data: dataJadwal })
          }
        })
      } else {
        res.json({ status: 'error', message: 'Tidak ada jadwal untuk ditampilkan.', data: null })
      }
    } catch (error) {
      res.status(400)
    }
  },
  updatePolling: async function (req, res, next) {
    const user = await userModel.findOne({ _id: req.body.id_user }, { password: 0 })
    const userId = user !== null ? user.id : req.body.id
    const data = await semesterModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.idSemester), status: true, 'pendaftaran._id': userId, 'jadwal._id': mongoose.Types.ObjectId(req.body.id_jadwal) } },
      { $unwind: { path: '$pendaftaran', includeArrayIndex: 'a' } },
      { $unwind: { path: '$jadwal', includeArrayIndex: 'b' } },
      { $match: { 'pendaftaran._id': userId, 'jadwal._id': mongoose.Types.ObjectId(req.body.id_jadwal) } },
      { $project: { 'pendaftaran.total_sks': 1, 'jadwal.sks': 1, 'jadwal._id_asdos': 1 } }
    ])
    if (data[0].jadwal._id_asdos === (req.body.id_user === null ? data[0].jadwal._id_asdos : req.body.id_user) || data[0].jadwal._id_asdos === null || data[0].jadwal._id_asdos === '') {
      const totalSKS = (req.body.id_user) ? (Number(data[0].pendaftaran.total_sks) + Number(data[0].jadwal.sks)) : (Number(data[0].pendaftaran.total_sks) - Number(data[0].jadwal.sks))
      console.log(totalSKS)
      console.log(totalSKS >= 0)
      console.log(totalSKS <= 12)
      console.log(totalSKS === req.body.sks)
      if (totalSKS >= 0 && totalSKS <= 12) {
        semesterModel.updateOne({ _id: req.params.idSemester, status: true, 'pendaftaran._id': userId }, { $set: { 'pendaftaran.$.total_sks': totalSKS } })
          .then((result) => {
            if (result.nModified === 1) {
              semesterModel.updateOne({ _id: req.params.idSemester, status: true, 'jadwal._id': req.body.id_jadwal }, { $set: { 'jadwal.$.nama_asdos': user !== null ? user.nama : '', 'jadwal.$._id_asdos': user !== null ? user._id : null, 'jadwal.$.id_asdos': user !== null ? user.id : '', 'jadwal.$.status_asdos': user !== null ? user.status : '', 'jadwal.$.email_asdos': user !== null ? user.email : null } }, { multi: false }, function (err, ayam) {
                if (err) {
                  res.json({ status: 'error', message: 'Data Gagal Ditambah.', data: err })
                } else {
                  res.json({ status: 'success', message: 'Data Berhasil Di Update.', data: ayam })
                }
              })
            } else {
              res.json({ status: 'error', message: 'Harap Ulangi.', data: null })
            }
          })
      } else {
        res.json({ status: 'error', message: 'Batas SKS sudah tercapai.', data: null })
      }
    } else {
      res.json({ status: 'error', message: 'Asdos lain sudah mengambil jadwal ini.', data: null })
    }
  },
  // Perkuliahan
  getPerkuliahan: async function (req, res, next) {
    try {
      const asdos = await userModel.findById(req.params.idAsdos, { id: 1 })
      const check = await semesterModel.aggregate([
        { $match: { status: true } },
        { $unwind: '$pendaftaran' },
        { $match: { 'pendaftaran._id': asdos.id } },
        { $project: { 'pendaftaran.status_kuliah': 1 } }
      ])
      if (check[0].pendaftaran.status_kuliah === true) {
        await semesterModel.aggregate([
          { $match: { status: true } }, // search
          { $unwind: '$jadwal' }, // pecah
          { $match: { 'jadwal._id_asdos': mongoose.Types.ObjectId(req.params.idAsdos) } }, // matching
          { $group: { _id: '$_id', jadwal: { $push: '$jadwal' } } }, // menyatukan
          { $project: { _id: 1, 'jadwal._id': 1, 'jadwal._id_jadwal': 1, 'jadwal.hari': 1, 'jadwal.jam_kuliah': 1, 'jadwal.nama_mk': 1, 'jadwal.sks': 1, 'jadwal.kelas': 1, 'jadwal.nama_dosen': 1 } } // yang di tampilkan
        ],
          function (err, data) {
            if (err) {
              res.json({ status: 'error', message: 'Tidak ada jadwal untuk ditampilkan.', data: err })
            } else if (data.length === 0 || data[0].jadwal.length === 0) {
              res.json({ status: 'error', message: 'Tidak ada jadwal untuk ditampilkan.', data: null })
            } else {
              res.json({ status: 'success', message: 'Data Jadwal.', data: data })
            }
          })
      } else {
        res.json({ status: 'error', message: 'Tidak ada jadwal untuk ditampilkan.', data: null })
      }
    } catch (error) {
      res.status(400)
    }
  },
  mulaiPerkuliahan: function (req, res, next) {
    try {
      semesterModel.updateOne({ status: true, 'pendaftaran._id': req.params.idAsdos }, { $set: { 'pendaftaran.$.status_kuliah': true } })
        .then((result) => {
          console.log(result)
          if (result.nModified === 1) {
            res.json({ status: 'success', message: 'Berhasil Memulai Perkuliahan.', data: null })
          } else {
            res.json({ status: 'error', message: 'Gagal Memulai Perkuliahan.', data: null })
          }
        })
      // const jadwal = await semesterModel.aggregate([
      //   { $match: { status: true } }, // search
      //   { $unwind: '$jadwal' }, // pecah
      //   { $match: { 'jadwal._id_asdos': mongoose.Types.ObjectId(req.params.idAsdos) } }, // matching
      //   { $group: { _id: '$_id', jadwal: { $push: '$jadwal' } } }, // menyatukan
      //   { $project: { _id: 1, 'jadwal._id': 1, 'jadwal._id_jadwal': 1, 'jadwal.hari': 1, 'jadwal.jam_kuliah': 1, 'jadwal.nama_mk': 1, 'jadwal.sks': 1, 'jadwal.kelas': 1, 'jadwal.nama_dosen': 1 } } // yang di tampilkan
      // ])
      // const asdos = await userModel.findById(req.params.idAsdos, { _id: 1, id: 1, nama: 1 })
      // const check = await semesterModel.findOne({ _id: jadwal[0]._id, status: true, 'perkuliahan._id': req.params.idAsdos })

      // if (jadwal.length === 0 || jadwal[0].jadwal.length === 0) {
      //   res.json({ status: 'error', message: 'Harap Melakukan Polling.', data: null })
      // } else if (check !== null) {
      //   res.json({ status: 'error', message: 'Anda Sudah Melakukan Kegiatan Perkuliahan.', data: null })
      // } else {
      //   await semesterModel.updateOne({ _id: jadwal[0]._id, status: true }, { $addToSet: { perkuliahan: { _id: asdos._id, id_asdos: asdos.id, nama: asdos.nama } } }, async function (err, data) {
      //     if (err) {
      //       res.json({ status: 'error', message: 'Data Gagal Ditambah.', data: err })
      //     } else {
      //       await semesterModel.updateOne({ _id: jadwal[0]._id, status: true, 'perkuliahan._id': req.params.idAsdos }, { $set: { 'perkuliahan.$.laporan': jadwal[0].jadwal } }, function (err, data) {
      //         if (err) {
      //           res.json({ status: 'error', message: 'Data Gagal Ditambah.', data: err })
      //         } else {
      //           res.json({ status: 'success', message: 'Data Berhasil Ditambah.', data: data })
      //         }
      //       })
      //     }
      //   })
      // }
    } catch (error) {
      res.status(400)
    }
  },
  detailPerkuliahan: function (req, res, next) {
    try {
      semesterModel.aggregate([
        { $match: { status: true } }, // search
        { $unwind: '$jadwal' }, // pecah
        { $match: { 'jadwal._id': mongoose.Types.ObjectId(req.params.idJadwal), 'jadwal._id_asdos': mongoose.Types.ObjectId(req.params.idAsdos) } }, // matching
        { $group: { _id: '$_id', perkuliahan: { $push: '$jadwal' } } } // menyatukan
        // { $project: { _id: 1, perkuliahan: 1 } } // yang di tampilkan
      ], function (err, data) {
        if (err) {
          res.json({ status: 'error', message: 'Tidak ada data untuk ditampilkan.', data: err })
        } else if (data.length === 0) {
          res.json({ status: 'error', message: 'Tidak ada data untuk ditampilkan.', data: null })
        } else {
          res.json({ status: 'success', message: 'Data ditemukan.', data: data })
        }
      })
    } catch (error) {
      res.status(400)
    }
  },
  tambahPertemuan: function (req, res, next) {
    try {
      // , 'jadwal._id_asdos': mongoose.Types.ObjectId(req.params.idAsdos)
      semesterModel.updateOne({ status: true, 'jadwal._id': mongoose.Types.ObjectId(req.params.idJadwal) }, { $push: { 'jadwal.$.pertemuan': { $each: [{ ke: req.body.ke, tgl: req.body.tgl, materi: req.body.materi }] } } })
        .then((result) => {
          console.log(result)
          if (result.nModified === 1) {
            semesterModel.aggregate([
              { $match: { status: true } }, // search
              { $unwind: '$jadwal' }, // pecah
              { $match: { 'jadwal._id': mongoose.Types.ObjectId(req.params.idJadwal), 'jadwal._id_asdos': mongoose.Types.ObjectId(req.params.idAsdos) } }, // matching
              // { $group: { _id: '$_id', perkuliahan: { $push: '$jadwal.pertemuan' } } } // menyatukan
              { $project: { _id: 1, 'jadwal._id_asdos': 1, 'jadwal.pertemuan': 1 } } // yang di tampilkan
            ], function (err, data) {
              if (err) {
                res.json({ status: 'error', message: 'Tidak ada data untuk ditampilkan.', data: err })
              } else if (data.length === 0 || (data.jadwal && data.jadwal._id_asdos !== req.params.idAsdos)) {
                res.json({ status: 'error', message: 'Tidak ada data untuk ditampilkan.', data: null })
              } else {
                console.log(req.body)
                console.log(data)
                res.json({ status: 'success', message: 'Data ditemukan.', data: data[0].jadwal.pertemuan })
              }
            })
          } else {
            res.json({ status: 'error', message: 'Gagal Menambah Laporan.', data: null })
          }
        })
    } catch (error) {
      res.status(400)
    }
  }
}
