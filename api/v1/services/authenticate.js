const { find } = require('../models/users')

module.exports = {
  login: async () => {
    try {
      const data = {}

      return await find(data)
    } catch(e) {
      throw new Error(e.message)
    }
  }
}
