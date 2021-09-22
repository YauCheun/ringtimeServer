const dbserver = require('../dao/dbserver')

// 注册
exports.signUp = function (req, res) {
  let { name, mail, psw } = req.body
  dbserver.buildUser(name, mail, psw, res)
}

// 用户或邮箱是否占用判断
exports.judgeValue = function (req, res) {
  let { data, type } = req.body
  dbserver.countUserValue(data, type, res)
}