const mongoose = require('mongoose')
const { Schema, model, Types } = mongoose

const pertemuanSchema = new Schema({
  _id: Types.ObjectId,
  id_jadwal: { type: Types.ObjectId, required: true, sparse: true },
  pertemuan_ke: { type: Number, required: true },
  tgl: { type:Date, required: true },
  materi: { type:String, trim: true, required: true },
  status_akademik: { type: Boolean, default: false  },
  status_keuangan: { type: Boolean, default: false  }
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
})

// eslint-disable-next-line no-unused-vars
const pertemuanModel = model('pendaftaran_asdos', pertemuanSchema)

module.exports = {
  view_pertemuan: async () => {
    //
  },
  view_pertemuan_by_id: async () => {
    //
  },
  add_pertemuan: async () => {
    //
  },
  update_pertemuan: async () => {
    //
  },
  delete_pertemuan: async () => {
    //
  }
}