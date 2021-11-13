const mongoose = require('mongoose')

// Define a schema
const Schema = mongoose.Schema
const JadwalSchema = new Schema({
  no: {
    type: String,
    trim: true
  },
  hari: {
    type: String,
    trim: true
  },
  jam_kuliah: {
    type: String,
    trim: true
  },
  kode_mk: {
    type: String,
    trim: true
  },
  nama_mk: {
    type: String,
    trim: true
  },
  sks: {
    type: String,
    trim: true
  },
  kelas: {
    type: String,
    trim: true
  },
  ruangan: {
    type: String,
    trim: true
  },
  smt: {
    type: String,
    trim: true
  },
  nama_dosen: {
    type: String,
    trim: true
  },
  peserta: {
    type: String,
    trim: true
  },
  kurikulum: {
    type: String,
    trim: true
  },
  jml_pertemuan: {
    type: String,
    trim: true
  },
  konsentrasi: {
    type: String,
    trim: true
  },
  waktu_kelas: {
    type: String,
    trim: true
  },
  nama_asdos: {
    type: String,
    trim: true,
    default: ''
  },
  _id_asdos: {
    type: String,
    trim: true,
    default: ''
  },
  id_asdos: {
    type: String,
    trim: true,
    default: ''
  },
  status_asdos: {
    type: String,
    trim: true,
    default: ''
  },
  email_asdos: {
    type: String,
    trim: true,
    default: ''
  }
})

module.exports = mongoose.model('jadwal', JadwalSchema)
