const express = require('express')
const router = express.Router()
const authController = require('../app/api/controllers/auths')
const jwt = require('jsonwebtoken')

const auth = function (req, res, next) {
  req.helpers.auth('Keuangan', {req, res, next})
}

router.post('/register', authController.create)
router.post('/authenticate', authController.authenticate)
// router.get('/user', authController.user)
router.post('/logout', authController.logout)

module.exports = router
