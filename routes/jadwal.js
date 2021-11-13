const express = require('express')
const router = express.Router()
const jadwalController = require('../app/api/controllers/jadwal')
const jwt = require('jsonwebtoken')

const auth = function (req, res, next) {
  const check = jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'))

  if (check.role === 'Operator' || check.id === req.body.id) {
    next()
  } else {
    res.status(400)
  }
}

router.get('/', auth, jadwalController.getAll)
router.post('/', auth, jadwalController.create)
router.put('/:jadwalId', auth, jadwalController.updateById)
router.delete('/:jadwalId', auth, jadwalController.deleteById)

module.exports = router
