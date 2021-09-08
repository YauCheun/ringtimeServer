let dbmodel = require('../model/dbmodel')

let User = dbmodel.model('User')
console.log(User)
function findUser(res) {
  User.find(function (err, val) {
    if (err) {
      console.log('用户数据查找失败' + err)
    } else {
      res.send(val)
    }
  })
}
module.exports = findUser 