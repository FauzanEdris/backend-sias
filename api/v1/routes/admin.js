const express = require('express')
const { authenticate } = require('../controllers/admin')
const router = express.Router()

router.get('/users', authenticate)
router.post('/users', authenticate)
router.put('/users', authenticate)
router.patch('/users', authenticate)
router.delete('/users', authenticate)

module.exports = router
