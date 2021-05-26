const express = require('express');
const operatorController = require('../controllers/operator');

const router = express.Router();

router.get('/semester', operatorController.view_semester);
router.post('/semester', operatorController.add_semester);
router.put('/semester', operatorController.update_semester);
router.delete('/semester', operatorController.delete_semester);

router.put('/status/pendaftaran');
router.put('/status/asdos');
router.put('/status/dosen');

router.get('/jadwal');
router.post('/jadwal');

router.get('/jadwal/download');

module.exports = router;
