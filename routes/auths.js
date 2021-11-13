const express = require('express')
const router = express.Router()
const authController = require('../app/api/controllers/auths')
// const cors = require('cors')

router.post('/register', authController.create)
router.post('/authenticate', authController.authenticate)
router.post('/me', authController.me)
router.post('/logout', authController.logout)

module.exports = router
