const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;
const bcrypt = require("bcrypt");
const saltRounds = 12;

const usersSchema = new Schema(
  {
    _id: { type: Types.ObjectId, required: false },
    id_user: { type: Number, required: true, unique: true, sparse: true },
    name: { type: String, trim: true, required: true },
    username: {
      type: String,
      trim: true,
      required: true,
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
      required: true,
      default: "@asdosstikombali"
    },
    status: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "update_at" },
  }
);

// hash user password before saving into database
usersSchema.pre("save", async function (next) {
  this.password = await bcrypt.hashSync(this.password, saltRounds);
  next();
});

const userModel = model("users", usersSchema);

module.exports = {
  view_all: async ({ projection, skip, limit }) => {
    skip = skip > 0 ? limit * (skip - 1) : 0;
    const data = await userModel
      .find({}, projection)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return data;
  },
  view_by_id: async ({ id, projection = { _id: 0, password: 0 } }) => {
    const data = await userModel.findOne({ id }, projection);
    return data;
  },
  add_user: async ({ id_user, name, username, email, password, status = false, role }) => {
    const session = mongoose.startSession();
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
    };

    (await session).withTransaction(async () => {
      try {
        await userModel.create({ id_user, name, username, email, password, status }, { session: session })
        .then((data) => {
          console.log(data);
        });
      } catch(error) {
        console.log(error);
      }
    }, transactionOptions);

    (await session).endSession();
    
    return { id_user, name, username, email, password, status, role };
  },
  update_user: async ({ id, value }) => {
    const data = await userModel.model.updateOne(id, value);
    return data;
  },
};
