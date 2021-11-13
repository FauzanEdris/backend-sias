const mongoose = require('mongoose')

// Define a schema
const Schema = mongoose.Schema
const PendaftaranSchema = new Schema({
  id: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  nama: {
    type: String,
    trim: true,
    required: true
  },
  status: {
    type: String,
    trim: true,
    required: true
  },
  transkip: {
    type: String,
    trim: true,
    default: null
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  dosen: {
    type: String,
    trim: true,
    required: true
  },
  _id_dosen: {
    type: mongoose.Types.ObjectId,
    trim: true,
    required: true
  },
  id_dosen: {
    type: String,
    trim: true,
    required: true
  }
})

module.exports = mongoose.model('pendaftaran', PendaftaranSchema)
