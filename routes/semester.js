const express = require('express')
const router = express.Router()
const semesterController = require('../app/api/controllers/semester')
const jwt = require('jsonwebtoken')

const auth = function (req, res, next) {
  const check = jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'))

  if (check.role === 'Operator' || check.id === req.body.id) {
    next()
  } else {
    res.status(400)
  }
}

router.get('/', auth, semesterController.getAll)
router.post('/', auth, semesterController.create)
router.put('/:semesterId', auth, semesterController.updateById)
router.delete('/:semesterId', auth, semesterController.deleteById)

module.exports = router
