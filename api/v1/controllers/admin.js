const { view_users, view_spesific_user, update_user } = require("../services/admin");

module.exports = {
  view_users: async (req, res, next) => {
    const { skip, limit } = req.query;
    try {
      const data = await view_users({ skip, limit });
      // other service call (or same service, different function can go here)
      // i.e. - await generateBlogpostPreview()

      res.json(data);
      next();
    } catch (e) {
      console.log(e.message);
      // res.sendStatus(500) && next(error)
    }
  },
  view_by_id: async (req, res, next) =>{
    const { id } = req.params;
    try {
      const data = await view_spesific_user({ id });
      // other service call (or same service, different function can go here)
      // i.e. - await generateBlogpostPreview()

      res.json(data);
      next();
    } catch (e) {
      console.log(e.message);
      // res.sendStatus(500) && next(error)
    }
  },
  add_users: async (req, res, next) => {
    const { data } = req.body;
    try {
      //
      res.json(data);
      next();
    } catch (e) {
      //
    }
  },
  update_users: async (req, res, next) => {
    const { skip, limit } = req.query;
    const { id, value } = req.body;
    try {
      const data = await update_user({ id, value }, { skip, limit });
      res.json(data);
      next();
    } catch (e) {
      //
    }
  },
  delete_users: async (req, res, next) => {
    const { data } = req.body;
    try {
      //
      res.json(data);
      next();
    } catch (e) {
      //
    }
  },
};
