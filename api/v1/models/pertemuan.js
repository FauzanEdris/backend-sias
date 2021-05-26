const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const pertemuanSchema = new Schema(
  {
    _id: Types.ObjectId,
    id_jadwal: { type: Types.ObjectId, required: true, sparse: true },
    pertemuan_ke: { type: Number, required: true },
    tgl: { type: Date, required: true },
    materi: { type: String, trim: true, required: true },
    status_akademik: { type: Boolean, default: false },
    status_keuangan: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'update_at' },
  },
);

// eslint-disable-next-line no-unused-vars
const pertemuanModel = model('pendaftaran_asdos', pertemuanSchema);

module.exports = {
  view_pertemuan: async ({ projection, skip, limit }) => {
    try {
      skip = skip > 0 ? limit * (skip - 1) : 0;
      limit = limit || 5;
      const data = await pertemuanModel
        .find({}, projection)
        .skip(parseInt(skip))
        .limit(parseInt(limit));
      return data;
    } catch (e) {
      console.log(e);
      return e.message;
    }
  },
  view_pertemuan_by_id: async ({ id, projection = {} }) => {
    try {
      projection._id = projection._id ?? 0;
      const data = await pertemuanModel.findOne({ id_user: id }, projection);
      return data;
    } catch (e) {
      return e.message;
    }
  },
  add_pertemuan: async ({
    id_jadwal,
    pertemuan_ke,
    tgl,
    materi,
    status_akademik = false,
    status_keuangan = false,
  }) => {
    try {
      await pertemuanModel.create([
        {
          id_jadwal,
          pertemuan_ke,
          tgl,
          materi,
          status_akademik,
          status_keuangan,
        },
      ]);
    } catch (e) {
      return e.message;
    }
  },
  update_pertemuan: async ({ id, value }) => {
    try {
      const {
        id_jadwal,
        pertemuan_ke,
        tgl,
        materi,
        status_akademik,
        status_keuangan,
      } = value;
      await pertemuanModel.updateOne([
        { id_jadwal: id },
        {
          $set: {
            id_jadwal,
            pertemuan_ke,
            tgl,
            materi,
            status_akademik,
            status_keuangan,
          },
        },
      ]);
      return true;
    } catch (e) {
      return { error: e.message };
    }
  },
  delete_pertemuan: async ({ id }) => {
    try {
      await pertemuanModel.deleteOne({ id_jadwal: id });
      return true;
    } catch (e) {
      return { error: e.message };
    }
  },
};
