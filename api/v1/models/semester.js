const mongoose = require('mongoose')
const { Schema, model, Types } = mongoose

const semesterSchema = new Schema({
  _id: Types.ObjectId,
  tahun: { type: Number, required: true, sparse: true },
  semester: { type: String, trim: true, required: true },
  status_semester: { type: Number, required: true, default: -100 },
  status_pendaftaran: { type: Number, required: true, default: -100 },
  status_jadwal_asdos: { type: Number, required: true, default: -100 },
  status_jadwal_dosen: { type: Number, required: true, default: -100  }
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
})

// eslint-disable-next-line no-unused-vars
const semesterModel = model('pendaftaran_asdos', semesterSchema)