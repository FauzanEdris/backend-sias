const pendaftaranAsdosModel = require('../models/pendaftaran_asdos');
/*
 * if you need to make calls to additional tables, data stores (Redis, for example),
 * or call an external endpoint as part of creating the blogpost, add them to this service
 */

/** pendaftaran Services */
module.exports = {
  add_registration: async (data) => {
    try {
      return await pendaftaranAsdosModel.add_registration(data);
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
