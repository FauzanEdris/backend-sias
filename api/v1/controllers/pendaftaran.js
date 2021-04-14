const pendaftaranServices = require('../services/pendaftaran');

/** Pendaftaran Controllers */
module.exports = {
	/**
	 * 
	 * Add New Registration
	 * 
	 */
	add_registration: async (req, res, next) => {
		const data = req.body;
		try {
			if (!data.staff && data.transkip === null) {
				res.json({ error: 'Mahasiswa wajib memberikan Transkip Nilai!'});
			}
			const result = await pendaftaranServices.add_registration(data);
			res.json(result);
			next();
		} catch (e) {
			//
		}
	},
};
