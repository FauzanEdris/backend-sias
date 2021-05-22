const mongoose = require("mongoose");
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
    timestamps: { createdAt: "created_at", updatedAt: "update_at" },
  }
);

// eslint-disable-next-line no-unused-vars
const semesterModel = model("pendaftaran_asdos", semesterSchema);

/** Semester Model */
module.exports = {
  view_all: async () => {
    // 
  },
  view_by_id: async () => {
    // 
  },
  add_semester: async () => {
    // 
  },
  update_semester: async () => {
    // 
  },
  delete_semester: async () => {
    // 
  }
}
