const adminServices = require("../services/admin");

/** Admin Controllers */
module.exports = {
  /**
   * 
   * Get All Users
   * 
   */
  view_users: async (req, res, next) => {
    try {
      const { skip, limit } = req.query;
      const data = await adminServices.view_users({ skip, limit });
      const results = {
        status: 'ok',
        results: data
      };
      res.json(results);
      next();
    } catch (e) {
      console.log(e.message);
      // res.sendStatus(500) && next(error)
    }
  },
  /**
   * 
   * Search Users by ID
   * 
   */
  view_by_id: async (req, res, next) =>{
    const { id } = req.params;
    try {
      const data = await adminServices.view_spesific_user({ id });
      // other service call (or same service, different function can go here)
      // i.e. - await generateBlogpostPreview()

      res.json(data);
      next();
    } catch (e) {
      console.log(e.message);
      // res.sendStatus(500) && next(error)
    }
  },
  /**
   * 
   * Add New Users
   * 
   */
  add_user: async (req, res, next) => {
    const data = req.body;
    try {
      const result = await adminServices.add_user(data);
      res.json(result);
      next();
    } catch (e) {
      //
    }
  },
  /**
   * 
   * Update Users
   * 
   */
  update_users: async (req, res, next) => {
    try {
      const { id } = req.params;
      const value = req.body;
      const { skip, limit } = req.query;
      const result = await adminServices.update_user({ id, value }, { skip, limit });
      res.json(result);
      next();
    } catch (e) {
      return e.message;
    }
  },
  /**
   * 
   * Delete Users
   * 
   */
  delete_users: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await adminServices.delete_user({ id });
      res.json(result);
      next();
    } catch (e) {
      return e.message;
    }
  },
};
