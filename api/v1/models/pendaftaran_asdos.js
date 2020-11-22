const mongoose = require('mongoose')
const { Schema, model, Types } = mongoose

const pendaftaranAsdosSchema = new Schema({
  _id: Types.ObjectId,
  id_user: { type: Number, required: true, unique: true, sparse: true },
  id_user_name: { type: String, trim: true, required: true },
  name: { type:String, trim: true, required: true },
  transkip: { type:String, trim: true, required: true, default: null },
  id_dosen: { type: Number, required: true },
  id_semester: { type: Number, required: true  },
  status: { type: Number, required: true, default: -200 },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
})

const userModel = model('pendaftaran_asdos', pendaftaranAsdosSchema)

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
  }
}