// Set up mongoose connection
const mongoose = require('mongoose')
const mongoDB = process.env.DB_HOST

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = global.Promise

mongoose.set('useFindAndModify', false);

module.exports = mongoose
