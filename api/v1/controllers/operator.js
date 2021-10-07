const operatorService = require('../services/operator');

module.exports = {
  view_semester: async (req, res, next) => {
    const { skip, limit } = req.query;
    try {
      const data = await operatorService.view_semester({ skip, limit });
      // other service call (or same service, different function can go here)
      // i.e. - await generateBlogpostPreview()

      res.json(data);
      next();
    } catch (e) {
      console.log(e.message);
      // res.sendStatus(500) && next(error)
    }
  },
  add_semester: async (req, res, next) => {
    const data = req.body;
    try {
      console.log(data);
      const result = await operatorService.add_semester(data);
      res.json(result);
      next();
    } catch (e) {
      //
    }
  },
  update_semester: async (req, res, next) => {
    const { data } = req.body;
    try {
      //
      res.json(data);
      next();
    } catch (e) {
      //
    }
  },
  delete_semester: async (req, res, next) => {
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
