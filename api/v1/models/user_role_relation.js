const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const rolesRelationsSchema = new Schema(
  {
    id_user: { 
      type: Number,
      required: [true, 'NIM/NIK dibutuhakan!'],
      sparse: true
    },
    role: { 
      type: String,
      required: [true, 'ID Role dibutuhkan!'],
      sparse: true
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "update_at" },
  }
);

module.exports = model("user_role_relation", rolesRelationsSchema);
