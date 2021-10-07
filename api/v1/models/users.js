const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');

const saltRounds = 12;
const transactionOptions = {
  readPreference: 'primary',
  readConcern: { level: 'local' },
  writeConcern: { w: 'majority' },
};

/** User Schema Database */
const usersSchema = new Schema(
  {
    id_user: {
      type: Number,
      required: true,
      unique: [true, 'NIM/NIK dibutuhakan!'],
      sparse: true,
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Nama dibutuhan!'],
    },
    username: {
      type: String,
      trim: true,
      required: [true, 'Username dibutuhkan!'],
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      trim: true,
      default: '@asdosstikombali',
    },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'update_at' },
  },
);

// hash user password before saving into database
usersSchema.pre('save', async function (next) {
  this.password = await bcrypt.hashSync(this.password, saltRounds);
  next();
});

const userModel = model('users', usersSchema);

/** Users Model */
module.exports = {
  view_all: async ({ projection, skip, limit }) => {
    try {
      skip = skip > 0 ? limit * (skip - 1) : 0;
      limit = limit || 5;
      const data = await userModel
        .find({}, projection)
        .skip(parseInt(skip))
        .limit(parseInt(limit));
      return data;
    } catch (e) {
      console.log(e);
      return e.message;
    }
  },
  view_by_id: async (email) => {
    try {
      const data = await userModel.findOne({ email });
      console.log(data);
      return data;
    } catch (e) {
      return e.message;
    }
  },
  view_by_email: async ({ email, projection = {} }) => {
    try {
      projection._id = projection._id ?? 0;
      projection.password = projection.password ?? 0;
      const data = await userModel.findOne({ email }, projection);
      return data;
    } catch (e) {
      return e.message;
    }
  },
  get_password: async (id) => {
    try {
      const data = await userModel.findOne(id, { password: 1 });
      return data.password;
    } catch (e) {
      return e.message;
    }
  },
  add_user: async ({
    id_user, name, username, email, password, status = false, role,
  }) => {
    const roleRelationModel = require('./user_role_relation');
    let result = true;
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        await userModel.create([{
          id_user, name, username, email, password, status,
        }], { session });
        await roleRelationModel.create([{ id_user, role }], { session });
      }, transactionOptions);
    } catch (e) {
      result = e.message;
    } finally {
      await session.endSession();
    }

    return result;
  },
  update_user: async ({ id, value }) => {
    const roleRelationModel = require('./user_role_relation');
    let result = true;
    const {
      id_user, name, username, email, password, status = false, role,
    } = value;
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        await userModel.updateOne({ id_user: id }, {
          $set: {
            id_user, name, username, email, password, status, role,
          },
        }, { runValidators: true, session });
        await roleRelationModel.updateOne({ id_user: id }, { $set: { role } }, { runValidators: true, session });
      }, transactionOptions);
    } catch (e) {
      result = { error: e.message };
    } finally {
      await session.endSession();
    }

    return result;
  },
  delete_user: async ({ id }) => {
    const roleRelationModel = require('./user_role_relation');
    let result = true;
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        console.log(id);
        await userModel.deleteOne({ id_user: id }, { session });
        await roleRelationModel.deleteOne({ id_user: id }, { session });
      }, transactionOptions);
    } catch (e) {
      result = e.message;
    }

    return result;
  },
};
