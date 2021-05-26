const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const rolesSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      unique: [true, 'ID Role dibutuhkan!'],
      sparse: true,
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Nama Role dibutuhan!'],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'update_at' },
  },
);

module.exports = model('roles', rolesSchema);
