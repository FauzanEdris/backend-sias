const { view_all } = require('../models/users')

/*
  * if you need to make calls to additional tables, data stores (Redis, for example), 
  * or call an external endpoint as part of creating the blogpost, add them to this service
*/

module.exports = {
  view_users: async ({ skip, limit }) => {
    try {
      const projection = { name: 1, email: 1, status: 1 }
      return await view_all({ projection, skip, limit })
    } catch(e) {
      throw new Error(e.message)
    }
  }
}