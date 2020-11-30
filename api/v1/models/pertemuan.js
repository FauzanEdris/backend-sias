const mongoose = require('mongoose')
const { Schema, model, Types } = mongoose

const pertemuanSchema = new Schema({
  _id: Types.ObjectId,
  id_jadwal: { type: Types.ObjectId, required: true, sparse: true },
  pertemuan_ke: { type: Number, required: true },
  tgl: { type:Date, required: true },
  materi: { type:String, trim: true, required: true },
  status_akademik: { type: Number, required: true, default: 0  },
  status_keuangan: { type: Number, required: true, default: 0  }
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
})

// eslint-disable-next-line no-unused-vars
const pertemuanModel = model('pendaftaran_asdos', pertemuanSchema)