const mongoose = require('mongoose')
const { Schema, model, Types } = mongoose
const bcrypt = require('bcrypt')
const saltRounds = 12

const usersSchema = new Schema({
  _id: Types.ObjectId,
  id_user: { type: Number, required: true, unique: true, sparse: true },
  id_user_name: { type: String, trim: true, required: true },
  name: { type:String, trim: true, required: true },
  username: { type:String, trim: true, required: true, unique: true, sparse: true },
  email: { type:String, trim: true, required: true, unique: true, sparse: true },
  password: { type:String, trim: true, required: true, default: '@asdosstikombali',  },
  status: { type: Number, required: true },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
})

// hash user password before saving into database
usersSchema.pre('save', async function (next) {
  this.password = await bcrypt.hashSync(this.password, saltRounds)
  next()
})

const userModel = model('users', usersSchema)

module.exports = {
  blogpostDb: async () => {
    /*
     * put code to call database here
     * this can be either an ORM model or code to call the database through a driver or querybuilder
     * i.e.-
      INSERT INTO blogposts (user_name, blogpost_body)
      VALUES (user, content);
    */
  
    const data = await userModel.find()
    return data //just a dummy return as we aren't calling db right now
  },
  view_all: async ({ skip, limit }) => {
    skip = skip > 0 ? limit * (skip - 1) : 0
    const data = await userModel.find().skip(parseInt(skip)).limit(parseInt(limit))
    return data
  }
}