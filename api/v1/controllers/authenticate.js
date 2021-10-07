const authService = require('../services/authenticate');

module.exports = {
  authenticate: async (req, res, next) => {
    // const {user, content} = req.body
    try {
      const dataUser = await authService.checkUser(req.body, req);
      // other service call (or same service, different function can go here)
      // i.e. - await generateBlogpostPreview()
      res.json(dataUser);
      next();
    } catch (e) {
      console.log(e.message);
      // res.sendStatus(500) && next(error)
    }
  },
  me: async (req, res, next) => {
    // const {user, content} = req.body
    try {
      const data = await login();
      // other service call (or same service, different function can go here)
      // i.e. - await generateBlogpostPreview()
      res.json(data);
      next();
    } catch (e) {
      console.log(e.message);
      // res.sendStatus(500) && next(error)
    }
  },
  logout: async (req, res, next) => {
    // const {user, content} = req.body
    try {
      const data = await login();
      // other service call (or same service, different function can go here)
      // i.e. - await generateBlogpostPreview()
      res.json(data);
      next();
    } catch (e) {
      console.log(e.message);
      // res.sendStatus(500) && next(error)
    }
  },
};
