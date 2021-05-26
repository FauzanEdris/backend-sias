const express = require('express');
const pendaftaranController = require('../controllers/pendaftaran');

const router = express.Router();

router.post('/', pendaftaranController.add_registration);

module.exports = router;
