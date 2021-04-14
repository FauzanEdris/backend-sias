const express = require('express');
// const db = require('./config/database');
const app = express();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/authenticate');
const adminRouter = require('./routes/admin');
const operatorRouter = require('./routes/operator');
const asdosRouter = require('./routes/asdos');
const dosenRouter = require('./routes/dosen');
const akaRouter = require('./routes/akademik');
const keuRouter = require('./routes/keuangan');
const pendaftaranRouter = require('./routes/pendaftaran');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/operator', operatorRouter);
app.use('/asdos', asdosRouter);
app.use('/dosen', dosenRouter);
app.use('/aka', akaRouter);
app.use('/keu', keuRouter);
app.use('/pendaftaran', pendaftaranRouter);

module.exports = app;
