const express = require('express')
const adminController = require('../controllers/admin')
const router = express.Router()

router.get('/users', adminController.view_users)
router.post('/users')
router.put('/users')
router.patch('/users')
router.delete('/users')

module.exports = router
