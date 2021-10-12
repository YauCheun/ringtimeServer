const dbserver = require('../dao/dbserver')

// 登录
exports.searchUser = function (req, res) {
  let { keyword,uid } = req.body
  dbserver.searchUser(keyword,uid, res)
}
