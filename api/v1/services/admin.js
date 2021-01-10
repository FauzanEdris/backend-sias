const userModel = require("../models/users");

/*
 * if you need to make calls to additional tables, data stores (Redis, for example),
 * or call an external endpoint as part of creating the blogpost, add them to this service
 */

module.exports = {
  view_users: async ({ skip, limit }) => {
    try {
      const projection = { name: 1, email: 1, status: 1 };
      return await userModel.view_all({ projection, skip, limit });
    } catch (e) {
      throw new Error(e.message);
    }
  },
  view_spesific_user: async ({ id }) => {
    try {
      const projection = { password: 0 };
      return await userModel.view_by_id({ id, projection });
    } catch (e) {
      throw new Error(e.message);
    }
  },
  add_user: async (data) => {
    try {
      return await userModel.add_user(data);
    } catch (e) {
      throw new Error(e.message);
    }
  },
  update_user: async (value, options) => {
    try {
      const { matchedCount, modifiedCount } = await userModel.update_user(value);
      if (matchedCount === 1 && modifiedCount === 1) {
        return this.view_users(options);
      }
      return false;
    } catch (e) {
      throw new Error(e.message);
    }
  },
  delete_user: async ({ id }) => {
    try {
      const projection = { password: 0 };
      return await userModel.view_by_id({ id, projection });
    } catch (e) {
      throw new Error(e.message);
    }
  }
};
