const dbserver = require('../dao/dbserver')

// 登录
exports.getMsg = function (req, res) {
  let data = req.body
  dbserver.getMsg(data, res)
}
