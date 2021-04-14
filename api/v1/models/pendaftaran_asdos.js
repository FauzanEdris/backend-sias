const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const pendaftaranAsdosSchema = new Schema({
	id_user: { type: Number, required: true, unique: true, sparse: true },
	name: { type: String, trim: true, required: true },
	staff: { type: Boolean, required: true },
	transkip: { type: String, trim: true, default: null },
	id_dosen: { type: Number, required: true },
	id_semester: { type: Number, required: true  },
	status: { type: Boolean, default: false },
},
{
	timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
});

const pendaftaranModel = model('pendaftaran_asdos', pendaftaranAsdosSchema);

module.exports = {
	add_registration: async ({ id_user, name, staff, transkip = null, id_dosen, id_semester }) => {
		try {
			if (!staff && transkip === null) {
				return { error: 'Mahasiswa wajib memberikan Transkip Nilai!'};
			}

			pendaftaranModel.create({ id_user, name, staff, transkip, id_dosen, id_semester });
			return true;
		} catch (e) {
			return { error: e.message };
		}
	},
	// upload_transkip: async ({ name }) => {
	// //	
	// }
}