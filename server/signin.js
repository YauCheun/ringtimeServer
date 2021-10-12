const dbserver = require('../dao/dbserver')

// 登录
exports.signIn = function (req, res) {
  let { data, psw } = req.body
  dbserver.userMatch(data, psw, res)
}
