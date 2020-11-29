const adminService = require('../services/admin')

const { view_users } = adminService

module.exports = {
    view_users: async (req, res, next) => {
      const { skip, limit } = req.query
      try {
        const data = await view_users({ skip, limit })
        // other service call (or same service, different function can go here)
        // i.e. - await generateBlogpostPreview()
  
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