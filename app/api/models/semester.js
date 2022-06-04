const mongoose = require('mongoose')

// Define a schema
const Schema = mongoose.Schema

// Jadwal Schema
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
    default: null
  },
  _id_asdos: {
    type: mongoose.Types.ObjectId,
    trim: true,
    default: null
  },
  id_asdos: {
    type: String,
    trim: true,
    default: null
  },
  status_asdos: {
    type: String,
    trim: true,
    default: null
  },
  email_asdos: {
    type: String,
    trim: true,
    default: null
  },
  pertemuan: {
    ke: {
      type: Number,
      trim: true,
      required: true,
      unique: true,
    },
    tgl: {
      type: Date,
      trim: true,
      required: true
    },
    materi: {
      type: String,
      trim: true,
      required: true
    },
    status: {
      type: Boolean,
      trim: true,
      required: true
    },
    keterangan: {
      type: String,
      trim: true,
      required: true
    }
  }
})

// Pendaftaran Schema
const PendaftaranSchema = new Schema({
  _id: {
    type: String,
    trim: true,
    required: true,
    index: true
  },
  nama: {
    type: String,
    trim: true,
    required: true
  },
  status: {
    type: String,
    trim: true
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
  },
  status_acc: {
    type: Boolean,
    trim: true,
    default: false
  },
  total_sks: {
    type: Number,
    trim: true,
    default: 0
  },
  status_kuliah: {
    type: Boolean,
    trim: true,
    default: false
  },
})

// Perkuliahan Scehma
// const PerkuliahanSchema = new Schema({
//   _id: {
//     type: mongoose.Types.ObjectId,
//     trim: true,
//     required: true
//   },
//   id_asdos: {
//     type: String,
//     trim: true,
//     required: true,
//     unique: true
//   },
//   nama: {
//     type: String,
//     trim: true,
//     required: true
//   },
//   laporan: {
//     _id: {
//       type: mongoose.Types.ObjectId,
//       trim: true,
//       required: true
//     },
//     hari: {
//       type: String,
//       trim: true
//     },
//     jam_kuliah: {
//       type: String,
//       trim: true
//     },
//     nama_mk: {
//       type: String,
//       trim: true
//     },
//     sks: {
//       type: String,
//       trim: true
//     },
//     kelas: {
//       type: String,
//       trim: true
//     },
//     pertemuan: {
//       ke: {
//         type: Number,
//         trim: true,
//         required: true
//       },
//       tgl: {
//         type: Date,
//         trim: true,
//         required: true
//       },
//       materi: {
//         type: String,
//         trim: true,
//         required: true
//       }
//     }
//   }
// })

// Semester Schema
const SemesterSchema = new Schema({
  semester: {
    type: String,
    trim: true,
    required: true
  },
  tahun: {
    type: Number,
    trim: true,
    required: true
  },
  status: {
    type: Boolean,
    trim: true,
    required: true,
    default: true
  },
  status_jadwal_asdos: {
    type: Boolean,
    trim: true,
    default: false
  },
  status_jadwal_dosen: {
    type: Boolean,
    trim: true,
    default: false
  },
  status_pendaftaran: {
    type: Boolean,
    trim: true,
    default: false
  },
  jadwal: [JadwalSchema],
  pendaftaran: [PendaftaranSchema]
  // perkuliahan: [PerkuliahanSchema]
})

module.exports = mongoose.model('semesters', SemesterSchema)
