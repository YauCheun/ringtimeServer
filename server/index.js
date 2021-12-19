const dbserver = require('../dao/dbserver')

// 获取好友列表
exports.getUserList = function (req, res) {
  let data = req.body
  dbserver.getUserList(data, res)
}
