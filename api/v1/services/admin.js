const userModel = require('../models/users');
/*
 * if you need to make calls to additional tables, data stores (Redis, for example),
 * or call an external endpoint as part of creating the blogpost, add them to this service
 */

/** Admin Services */
module.exports = {
  all: async () => 'a',
  view_users: async ({ skip = null, limit = null }) => {
    try {
      const projection = {
        name: 1, id_user: 1, email: 1, status: 1,
      };
      return await userModel.view_all({ projection, skip, limit });
    } catch (e) {
      // throw new Error(e.message);
      return e.message;
    }
  },
  view_spesific_user: async ({ id }) => {
    try {
      return await userModel.view_by_id({ id });
    } catch (e) {
      // throw new Error(e.message);
      return e.message;
    }
  },
  add_user: async (data) => {
    try {
      return await userModel.add_user(data);
    } catch (e) {
      throw new Error(e.message);
    }
  },
  update_user: async (data, options) => {
    try {
      const result = await userModel.update_user(data, options);
      if (!result.error) {
        const user = module.exports.view_users(options);
        return user;
      }
      return result || 'Tidak ada data terubah!';
    } catch (e) {
      // throw new Error(e.message);
      return e.message;
    }
  },
  delete_user: async ({ id }) => {
    try {
      return await userModel.delete_user({ id });
    } catch (e) {
      // throw new Error(e.message);
      return e.message;
    }
  },
};
