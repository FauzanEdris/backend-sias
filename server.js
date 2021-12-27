require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
// const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
// const path = require('path')
const helmet = require('helmet')

// const users = require('./routes/users')
const auths = require('./routes/auths')
const pendaftaran = require('./routes/pendaftaran')
// const semester = require('./routes/semester')
// const jadwal = require('./routes/jadwal')

const admin = require('./routes/admin')
const operator = require('./routes/operator')
const dosen = require('./routes/dosen')
const asdos = require('./routes/asdos')
const profile = require('./routes/profile')

const jwt = require('jsonwebtoken')

// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'http://xxx.com')
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With')
//   next()
// })

// const whitelist = ['http://localhost:3000', 'http://localhost:8080']
// // const whitelist = ['http://example1.com', 'http://example2.com']
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
// const options = {
//   origin: 'http://localhost:8080',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// cors
// app.use(cors(corsOptions))

app.use(helmet())

const mongoose = require('./config/database') // database configuration

app.set('secretKey', process.env.SECRET_KEY) // jwt secret token
// app.set('socket.io', io)
// app.use(function (req, res, next) {
//   req.io = io
//   next()
// })

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

// enable files upload
app.use(fileUpload({
  createParentPath: true
}))

app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(express.json())
// app.use(express.urlencoded())
app.use(cookieParser())
// io.use(function (req, res, next) {
//
// })
app.use(function (req, res, next) {
  req.io = io
  next()
})

// viewed at http://localhost:3000
// app.get('/api/a', function (req, res) {
//   // res.sendFile(path.join(__dirname, '/index.html'))
//   console.log('b')
//   req.io.on('connection', (socket) => {
//     console.log('a user connected on :' + socket.id)
//     // socket.broadcast.emit('hi')
//     socket.on('chat message', async (msg) => {
//       // const semesterModel = require('./app/api/models/semester')
//       // const data = await semesterModel.find()
//       // io.emit('chat message', data)
//       // console.log('message: ' + data)
//       console.log('message: ' + msg)
//       req.io.emit('chat message', msg)
//     })
//     socket.on('disconnect', () => {
//       console.log('user disconnected')
//     })
//   })
// })

app.get('/api', function (req, res) {
  res.json({ tutorial: 'Build REST API with node.js' })
  // console.log(req.io)
})

// app.get('/api/auth/user', (req, res, next) => {
//   jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
//     // add user id to request
//     // req.body.userId = decoded.id
//     if (err) {
//       res.status(400)
//     } else {
//       res.json({ user: decoded })
//     }
//     // res.json({ user: decoded })
//   })
// })

// public route
app.use('/api/auths', auths)
app.use('/api/pendaftaran', pendaftaran)

// private route
app.use('/api/admin', admin)
app.use('/api/operator', operator)
app.use('/api/dosen', dosen)
app.use('/api/asdos', asdos)
app.use('/api/profile', profile)

// private route
// app.use('/api/users', validateUser, users)
// app.use('/api/semester', validateUser, semester)
// app.use('/api/jadwal', validateUser, jadwal)

app.get('/api/favicon.ico', function (req, res) {
  res.sendStatus(204)
})

// function validateUser (req, res, next) {
//   jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
//     if (err) {
//       // res.json({ status: 'error', message: err.message, data: null, ayam: req.headers })
//       // res.status(400)
//       // next(err)
//       res.status(err)
//     } else {
//       // add user id to request
//       req.body.userId = decoded.id
//       next()
//     }
//   })
// }

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// handle errors
app.use(function (err, req, res, next) {
  // console.log(err)
  if (err.status === 404) {
    res.status(404).json({ message: 'Not found' })
  } else {
    res.status(500).json({ message: 'Something looks wrong :( !!!' })
  }
})

// io.on('connection', (socket) => {
//   console.log('a user connected')
//   socket.broadcast.emit('hi')
//   socket.on('method1', (msg) => {
//     // const semesterModel = require('./app/api/models/semester')
//     // const data = await semesterModel.find()
//     // io.emit('chat message', data)
//     // console.log('message: ' + data)
//     console.log('message: ' + msg)
//     io.emit('someEvent', msg)
//   })
//   socket.on('disconnect', () => {
//     console.log('user disconnected')
//   })
// })

const semesterModel = require('./app/api/models/semester')
const userModel = require('./app/api/models/users')
const cookie = require('cookie')
const { throws } = require('assert')
io.on('connection', (socket) => {
  console.log('a user connected')
  // socket.broadcast.emit('hi')
  // const data = socket.handshake.headers.cookie
  // const dataCookie = cookie.parse(data)

  // const x = dataCookie.x.split(' ')
  // const access = dataCookie.access.split(' ')
  // const token = dataCookie.token.split(' ')
  // if ((x[0] === 'Ayam' && x[2] === 'Bebek') && (access[0] === 'Ayam' && access[2] === 'Bebek') && (token[0] === 'Ayam' && token[2] === 'Bebek')) {
  //   jwt.verify(x[1] + '.' + access[1] + '.' + token[1], app.get('secretKey'), async function (err, decoded) {
  //     const user = await userModel.findOne({ _id: decoded.id }, { password: 0 })
  //     if (err) {
  //       console.log('Error')
  //     } else if (user.role === 'Asdos') {
  //     } else {
  //       console.log('User Lain')
  //     }
  //   })
  // } else {
  //   console.log('Exp')
  // }

  socket.on('method1', (msg) => {
    // const semesterModel = require('./app/api/models/semester')
    // const data = await semesterModel.find()
    // io.emit('chat message', data)
    // console.log('message: ' + data)
    console.log('message: ' + msg)
    io.emit('someEvent', msg)
  })

  // socket.on('dataJadwal', (msg) => {
  //   // const semesterModel = require('./app/api/models/semester')
  //   // const data = await semesterModel.find()
  //   // io.emit('chat message', data)
  //   // console.log('message: ' + data)
  //   console.log('message: ' + msg)
  //   io.emit('someEvent', msg)
  // })

  semesterModel.find({ status: true, status_jadwal_asdos: true }, { jadwal: 1 }, function (err, dataJadwal) {
    if (err) {
      // res.status(400)
      // socket.emit('dataJadwal', { status: 'success', message: 'Data Jadwal.', data: dataJadwal })
    } else if (dataJadwal.length === 0 || dataJadwal[0].jadwal.length === 0) {
      // res.json({ status: 'error', message: 'Tidak ada jadwal untuk ditampilkan.', data: null })
      io.emit('dataJadwal', { status: 'error', message: 'Tidak ada jadwal untuk ditampilkan.', data: null })
    } else {
      // res.json({ status: 'success', message: 'Data Jadwal.', data: dataJadwal })
      io.emit('dataJadwal', { status: 'success', message: 'Data Jadwal.', data: dataJadwal })
    }
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(process.env.PORT || 80, function () {
  console.log('Node server listening on port 3000')
})
