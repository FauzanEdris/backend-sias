const adminService = require('../services/admin')

const { createBlogpost } = adminService

module.exports = {
  authenticate: async (req, res, next) => {
    // const {user, content} = req.body
    try {
      const data = await createBlogpost()
      // other service call (or same service, different function can go here)
      // i.e. - await generateBlogpostPreview()
      // console.log('woi')
      res.json(data)
      next()
    } catch(e) {
      console.log(e.message)
      // res.sendStatus(500) && next(error)
    }
  },
  add_users: async (req, res, next) => {
    const { data } = req.body
    try {
      // 
      res.json(data)
      next()
    } catch (e) {
      // 
    }
  }
}