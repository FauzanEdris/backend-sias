const express = require('express')
const router = express.Router()
const userController = require('../app/api/controllers/users')

const auth = function (req, res, next) {
  req.helpers.auth('Admin', {req, res, next})
}

router.get('/', auth, userController.getAll)
router.post('/', auth, userController.create)
router.get('/:userId', auth, userController.getById)
router.put('/:userId', auth, userController.updateById)
router.put('/password/:userId', auth, userController.updatePassword)
router.delete('/:userId', auth, userController.deleteById)

module.exports = router
