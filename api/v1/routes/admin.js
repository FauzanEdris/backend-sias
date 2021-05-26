const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/users', adminController.view_users);
router.get('/users/:id', adminController.view_by_id);
router.post('/users', adminController.add_user);
router.put('/users/:id', adminController.update_users);
router.delete('/users/:id', adminController.delete_users);

module.exports = router;
