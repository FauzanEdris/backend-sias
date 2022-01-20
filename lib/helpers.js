const userModel = require('../app/api/models/users')
const jwt = require('jsonwebtoken')

module.exports = {
	log: function(param) {
		console.log(param)
	},
	auth: function (role, args) {
		const { req, res, next } = args
		try {
			// req.helpers.log('hallo')
			// const cookie = req.cookies['x-access-token'].split(' ')
			console.log(role)
			const x = req.cookies.x.split(' ')
			const access = req.cookies.access.split(' ')
			const token = req.cookies.token.split(' ')
			if ((x[0] === 'Ayam' && x[2] === 'Bebek') && (access[0] === 'Ayam' && access[2] === 'Bebek') && (token[0] === 'Ayam' && token[2] === 'Bebek')) {
				jwt.verify(x[1] + '.' + access[1] + '.' + token[1], req.app.get('secretKey'), async function (err, decoded) {
					const user = await userModel.findOne({ _id: decoded.id }, { password: 0 })
					if (err) {
						res.status(401)
						res.json({ status: 'error', msg: 'Harap Login', data: null })
						// res.redirect('/')
					} else if (user.role === role || ('All' === role && ['Admin', 'Operator', 'Asdos', 'Dosen', 'Akademik', 'Keuangan'].includes(user.role))) {
						next()
					} else {
						res.status(401)
						res.json({ status: 'error', msg: 'Harap Login', data: null })
						// res.redirect('/')
					}
				})
			} else {
				res.status(401)
				res.json({ status: 'error', msg: 'Harap Login', data: null })
			}
		} catch (error) {
			res.status(401)
			res.json({ status: 'error', msg: 'Harap Login', data: null })
		}
	}
}