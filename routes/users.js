const express = require('express')
const router = express.Router()
const userController = require('../app/api/controllers/users')
const jwt = require('jsonwebtoken')

const auth = function (req, res, next) {
  console.time('handler name')

  const check = jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'))

  // if (check.role === 'Admin' || check.id === req.body.id) {
  if (check.role === 'Admin') {
    next()
  } else {
    res.status(400)
  }
  console.timeEnd('handler name')
}

router.get('/', auth, userController.getAll)
router.post('/', auth, userController.create)
router.get('/:userId', auth, userController.getById)
router.put('/:userId', auth, userController.updateById)
router.delete('/:userId', auth, userController.deleteById)

module.exports = router
