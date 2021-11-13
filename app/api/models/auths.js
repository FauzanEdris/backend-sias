const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

// Define a schema
const Schema = mongoose.Schema
const AuthSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  }
})

// hash user password before saving into database
AuthSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds)
  next()
})

module.exports = mongoose.model('Auths', AuthSchema)
