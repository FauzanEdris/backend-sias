const express = require('express')
const router = express.Router()
const userModel = require('../app/api/models/users')
const userController = require('../app/api/controllers/users')
const jwt = require('jsonwebtoken')

const auth = function (req, res, next) {
  req.helpers.auth('All', {req, res, next})
}

// router.get('/', auth, userController.getAll)
// router.post('/', auth, userController.create)
// router.get('/:userId', auth, userController.getById)
// router.put('/:userId', auth, userController.updateById)
// router.delete('/:userId', auth, userController.deleteById)

router.put('/me', auth, userController.updateProfile)
router.put('/me/password', auth, userController.updateProfilePassword)

module.exports = router
