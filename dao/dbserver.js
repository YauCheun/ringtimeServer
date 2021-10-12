let dbmodel = require('../model/dbmodel')
let bcrypt = require('./bcrypt')
let User = dbmodel.model('User')
let jwt = require('./jwt')
// console.log(User)
// function findUser(res) {
//   User.find(function (err, val) {
//     if (err) {
//       console.log('用户数据查找失败' + err)
//     } else {
//       res.send(val)
//     }
//   })
// }


// 新建用户
exports.buildUser = function (name, mail, psw, res) {
  // 密码加密
  let password = bcrypt.encryption(psw)
  let data = {
    name: name,
    email: mail,
    psw: password,
    createtime: new Date()
  }
  let user = new User(data)

  user.save(function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200,success: true })
    }
  })
}

// p匹配用户表元素个数
exports.countUserValue = function (data, type, res) {
  let wherestr = {}
  wherestr[type] = data
  User.countDocuments(wherestr, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ stauts: 200, result,success: true })
    }
  })
}

//用户登录验证
exports.userMatch = function (data, psw, res) {
  let wherestr = { $or: [{ 'name': data }, { 'email': data }] }
  let print = {'name': 1,'imgurl': 1,'psw': 1}
  User.find(wherestr,print, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      if(result==''){
        res.send({stauts: 200,resultmsg: '无此账号信息',success: false})
      }else{
        result.map(e=>{
          const pswMatch = bcrypt.verification(psw, e.psw)
          if(pswMatch){
            let token = jwt.generateToken(e._id)
            let backData = {
              id: e._id,
              name: e.name,
              imgurl: e.imgurl,
              token: token
            }
            res.send({stauts: 200,data:backData,success: true})
          }else{
            res.send({stauts: 200, resultmsg: '用户名密码错误！',success: false})
          }
        })
      }
      
    }
  })
}
// module.exports = findUser