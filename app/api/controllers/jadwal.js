// const jadwalModel = require('../models/jadwal')
const semesterModel = require('../models/semester')
const userModel = require('../models/users')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const csv = require('fast-csv')
const excel = require('mongo-xlsx')

module.exports = {
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
  getAll: async function (req, res, next) {
    try {
      await semesterModel.find({ status: true }, { jadwal: 1 }, function (err, dataJadwal) {
        if (err) {
          res.status(400)
        } else if (dataJadwal.length === 0 || dataJadwal[0].jadwal.length === 0) {
          res.json({ status: 'error', message: 'Tidak ditemukan data. Silahkan tambahkan semester atau jadwal baru.', data: null })
        } else {
          res.json({ status: 'success', message: 'Data Jadwal.', data: dataJadwal })
        }
      })
    } catch (error) {
      res.status(400)
    }
  },
  updateById: function (req, res, next) {
    semesterModel.updateOne({ _id: req.params.idSemester, 'jadwal._id': req.body.id }, { $set: { 'jadwal.$.hari': req.body.hari, 'jadwal.$.jam_kuliah': req.body.jam_kuliah, 'jadwal.$.kode_mk': req.body.kode_mk, 'jadwal.$.nama_mk': req.body.nama_mk, 'jadwal.$.sks': req.body.sks, 'jadwal.$.kelas': req.body.kelas, 'jadwal.$.ruangan': req.body.ruangan, 'jadwal.$.smt': req.body.smt, 'jadwal.$.nama_dosen': req.body.nama_dosen, 'jadwal.$.peserta': req.body.peserta, 'jadwal.$.kurikulum': req.body.kurikulum, 'jadwal.$.jml_pertemuan': req.body.jml_pertemuan, 'jadwal.$.konsentrasi': req.body.konsentrasi, 'jadwal.$.waktu_kelas': req.body.waktu_kelas, 'jadwal.$.nama_asdos': req.body.nama_asdos, 'jadwal.$._id_asdos': req.body._id_asdos, 'jadwal.$.id_asdos': req.body.id_asdos, 'jadwal.$.status_asdos': req.body.status_asdos, 'jadwal.$.email_asdos': req.body.email_asdos } }, { multi: false }, function (err, ayam) {
      if (err) {
        res.status(400)
        res.json({ status: 'error', message: 'Data Gagal Ditambah.', data: err })
      } else {
        res.json({ status: 'success', message: 'Data Berhasil Di Update.', data: ayam })
      }
    })
  },
  deleteById: function (req, res, next) {
    const data = req.params.jadwalId.split(' ')
    // console.log(data[0])
    // console.log(data[1])
    // res.status(200)
    const id = mongoose.Types.ObjectId(data[0])
    const id2 = mongoose.Types.ObjectId(data[1])
    // console.log(id + ' ' + id2)
    semesterModel.updateOne({ _id: id }, { $pull: { jadwal: { _id: id2 } } }, function (err, dataJadwal) {
      if (err) {
        res.status(400)
        res.json({ ayam: err })
        next(err)
      } else {
        res.json({ status: 'success', message: 'Movie deleted successfully!!!', data: dataJadwal })
      }
    })
  },
  export: async function (req, res, next) {
    try {
      // const listJadwal = []
      await semesterModel.find({ status: true }, { jadwal: 1 }).lean().exec({}, function (err, dataJadwal) {
        if (err) {
          res.status(400)
        } else if (dataJadwal.length === 0) {
          res.json({ status: 'error', message: 'Tidak ditemukan data. Silahkan tambahkan semester atau jadwal baru.', data: null })
        } else {
          // res.json({ status: 'success', message: 'Data Jadwal.', data: dataJadwal })
          // console.log(dataJadwal[0].jadwal)
          const listJadwal = dataJadwal[0].jadwal
          // res.json({ status: 'success', message: 'Data Jadwal.', data: listJadwal })
          // csv
          //   .write(data, { headers: true })
          //   .on('finish', function () {
          //     res.json({ status: 'success', message: 'Data Jadwal.', data: dataJadwal })
          //   })
          //   .pipe(ws)
          const model = excel.buildDynamicModel(listJadwal)
          excel.mongoData2Xlsx(listJadwal, model, function (_err, data) {
            console.log('File saved at:', data.fullPath)
            const dir = path.resolve(data.fullPath)
            console.log(dir)
            // const ws = fs.createReadStream(dir)
            // ws.pipe(res)
            res.sendFile(dir, function () {
              fs.unlinkSync(dir)
            })
          })
        }
      })
    } catch (error) {
      res.status(400)
    }
  },
  create: async function (req, res, next) {
    try {
      const jadwal = await req.files.jadwal
      const dir = await path.join(__dirname, '../src/jadwal/') + jadwal.name
      await jadwal.mv(dir)
      const dataArray = []
      await csv
        .parseFile(dir)
        .on('data', function (data) {
          dataArray.push({
            _id: new mongoose.Types.ObjectId(),
            no: data[0],
            hari: data[1],
            jam_kuliah: data[2],
            kode_mk: data[3],
            nama_mk: data[4],
            sks: data[5],
            kelas: data[6],
            ruangan: data[7],
            smt: data[8],
            nama_dosen: data[9],
            peserta: data[10],
            kurikulum: data[11],
            jml_pertemuan: data[12],
            konsentrasi: data[13],
            waktu_kelas: data[14],
            nama_asdos: '',
            _id_asdos: '',
            id_asdos: '',
            status_asdos: '',
            email_asdos: ''
          })
        })
        .on('end', async function () {
        // hapus data pertama
          console.log(dataArray)
          await dataArray.shift()
          await semesterModel.collection.updateOne({ status: true }, { $set: { jadwal: dataArray } }, function (err, result) {
            if (err || dataArray === 0) {
              res.status(400)
              res.json({ status: 'error', message: 'Data Gagal Ditambah.' })
              // next(err)
            } else {
              res.status(200)
              res.json({ status: 'success', message: dataArray.length + ' Jadwal berhasil ditambah.', data: result })
            }
          })
        })
      // jadwalModel.collection.updateMany(dataArray, function (err, result) {
      // jadwalModel.insertMany({ no: dataArray.no, hari: dataArray.hari, jam_kuliah: dataArray.jam_kuliah, kode_mk: dataArray.kode_mk, nama_mk: dataArray.nama_mk, sks: dataArray.sks, kelas: dataArray.kelas, ruangan: dataArray.ruangan, smt: dataArray.smt, nama_dosen: dataArray.nama_dosen, peserta: dataArray.peserta, kurikulum: dataArray.kurikulum, jml_pertemuan: dataArray.jml_pertemuan, konsentrasi: dataArray.konsentrasi, waktu_kelas: dataArray.waktu_kelas }, function (err, result) {
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
  }
}
