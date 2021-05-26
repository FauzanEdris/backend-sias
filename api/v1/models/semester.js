const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const semesterSchema = new Schema(
  {
    _id: Types.ObjectId,
    tahun: { type: Number, required: true, sparse: true },
    semester: { type: String, trim: true, required: true },
    status_semester: { type: Boolean, default: false },
    status_pendaftaran: { type: Boolean, default: false },
    status_jadwal_asdos: { type: Boolean, default: false },
    status_jadwal_dosen: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'update_at' },
  },
);

// eslint-disable-next-line no-unused-vars
const semesterModel = model('semesters', semesterSchema);

/** Semester Model */
module.exports = {
  view_all: async ({ projection, skip, limit }) => {
    try {
      skip = skip > 0 ? limit * (skip - 1) : 0;
      limit = limit || 5;
      const data = await semesterModel
        .find({}, projection)
        .skip(parseInt(skip))
        .limit(parseInt(limit));
      return data;
    } catch (e) {
      console.log(e);
      return e.message;
    }
  },
  view_by_id: async ({ id, projection = {} }) => {
    try {
      projection._id = projection._id ?? 0;
      const data = await semesterModel.findOne({ _id: id }, projection);
      return data;
    } catch (e) {
      return e.message;
    }
  },
  add_semester: async ({
    tahun,
    semester,
    status_semester,
    status_pendaftaran,
    status_jadwal_asdos = false,
    status_jadwal_dosen = false,
  }) => {
    try {
      await semesterModel.create([
        {
          tahun,
          semester,
          status_semester,
          status_pendaftaran,
          status_jadwal_asdos,
          status_jadwal_dosen,
        },
      ]);
      return true;
    } catch (e) {
      return e.message;
    }
  },
  update_semester: async ({ id, value }) => {
    try {
      const {
        tahun,
        semester,
        status_semester,
        status_pendaftaran,
        status_jadwal_asdos,
        status_jadwal_dosen,
      } = value;
      await semesterModel.updateOne([
        { _id: id },
        {
          $set: {
            tahun,
            semester,
            status_semester,
            status_pendaftaran,
            status_jadwal_asdos,
            status_jadwal_dosen,
          },
        },
      ]);
      return true;
    } catch (e) {
      return { error: e.message };
    }
  },
  delete_semester: async ({ id }) => {
    try {
      await semesterModel.deleteOne({ _id: id });
      return true;
    } catch (e) {
      return { error: e.message };
    }
  },
};
