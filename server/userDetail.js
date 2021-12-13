const dbserver = require('../dao/dbserver')

// 获取用户详情
exports.getUserInfo = function (req, res) {
  let id = req.body.id
  dbserver.getUserInfo(id, res)
}


// 修改用户信息
exports.updateUserInfo = function (req, res) {
  let data = req.body
  dbserver.updateUserInfo(data, res)
}

// 修改好友备注 
exports.makeFriendName = function (req, res) {
  let data = req.body
  dbserver.makeFriendName(data, res)
}

// 获取好友备注 
exports.getFriendName = function (req, res) {
  let data = req.body
  dbserver.getFriendName(data, res)
}