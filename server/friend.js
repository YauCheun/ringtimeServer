const dbserver = require('../dao/dbserver')

// 好友申请
exports.applyFriend = function (req, res) {
  let data = req.body
  dbserver.applyFriend(data, res)
}

// 同意好友申请
exports.updateFriendState = function (req, res) {
  let data = req.body
  dbserver.updateFriendState(data, res)
}
// 拒绝或删除好友
exports.forbidOrDelFriend  = function (req, res) {
  let data = req.body
  dbserver.forbidOrDelFriend(data, res)
}

//更新与好友的消息状态，将未读消息状态改为已读消息
exports.updateReadMsd  = function (req, res) {
  let data = req.body
  dbserver.updateReadMsd(data, res)
}