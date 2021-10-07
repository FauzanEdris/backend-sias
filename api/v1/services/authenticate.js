const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/users');

module.exports = {
  checkUser: async ({ email, password }, req) => {
    try {
      let flag = { status: false, msg: 'User Not Found!', data: null };
      const projection = { _id: 1 };
      const userInfo = await userModel.view_by_email({ email, projection });

      if (userInfo !== null) {
        const pass = await userModel.get_password(userInfo._id);
        if (bcrypt.compareSync(password, pass)) {
          if (userInfo.status === true) {
            const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' }); // di token berisi data
            const split = token.split('.');
            const dataToken = `${split[2]}.${split[1]}.${split[0]}`;

            flag = { status: false, msg: 'User Found!', data: { token: dataToken } };
          }
        }
      }

      return await flag;
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
