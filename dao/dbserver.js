let dbmodel = require('../model/dbmodel')
let bcrypt = require('./bcrypt')
let User = dbmodel.model('User')
let Friend = dbmodel.model('Friend')
let Group = dbmodel.model('Group')
let GroupUser = dbmodel.model('GroupUser')
let jwt = require('./jwt')
const async = require('async')
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
      res.send({ status: 200, success: true })
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
      res.send({ stauts: 200, result, success: true })
    }
  })
}

//用户登录验证
exports.userMatch = function (data, psw, res) {
  let wherestr = { $or: [{ 'name': data }, { 'email': data }] }
  let print = { 'name': 1, 'imgurl': 1, 'psw': 1 }
  User.find(wherestr, print, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      if (result == '') {
        res.send({ stauts: 200, resultmsg: '无此账号信息', success: false })
      } else {
        result.map(e => {
          const pswMatch = bcrypt.verification(psw, e.psw)
          if (pswMatch) {
            let token = jwt.generateToken(e._id)
            let backData = {
              _id: e._id,
              name: e.name,
              imgurl: e.imgurl,
              token: token
            }
            res.send({ stauts: 200, data: backData, success: true })
          } else {
            res.send({ stauts: 200, resultmsg: '用户名密码错误！', success: false })
          }
        })
      }

    }
  })
}

// 关键词搜索出用户或群，并判断是否为好友以及是否在群里
exports.searchUser = async function (keyword, uid, res) {
  // =========用户========
  let wherestr = { $or: [{ 'name': { $regex: keyword } }, { 'email': { $regex: keyword } }] }
  let print = {
    'name': 1,
    'email': 1,
    'imgurl': 1
  }
  let result = await new Promise((resolve, reject) => {
    User.find(wherestr, print, async function (err, result) {
      if (err) {
        res.send({ status: 500 })
      } else {
        resolve(result)
      }
    })
  })
  let friendIDs = []
  let str
  for (let i = 0; i < result.length; i++) {
    str = { 'userID': uid, 'friendID': result[i]._id, 'state': 0 }
    let temp = await Friend.findOne(str)
    if (temp) friendIDs.push(temp.friendID.toString())
  }
  let finalRes = {
    friends: [],
    groups: []
  }
  result.forEach(e => {
    finalRes.friends.push({ ...e._doc, isFriend: friendIDs.includes(e.id) })
  })
  // =====群==========
  let wheregroupstr = { 'name': { $regex: keyword } }
  let printgroup = {
    'name': 1,
    'imgurl': 1
  }
  let groupresult = await new Promise((resolve, reject) => {
    Group.find(wheregroupstr, printgroup, async function (err, result) {
      if (err) {
        res.send({ status: 500 })
      } else {
        resolve(result)
      }
    })
  })
  let GroupIDs = []
  let groupstr
  for (let i = 0; i < groupresult.length; i++) {
    groupstr = { 'userID': uid, 'groupID': groupresult[i]._id, 'state': 0 }
    let tempgroup = await GroupUser.findOne(groupstr)
    if (tempgroup) GroupIDs.push(tempgroup.groupID.toString())
  }
  groupresult.forEach(e => {
    finalRes.groups.push({ ...e._doc, isGroup: GroupIDs.includes(e.id) })
  })
  res.send({ stauts: 200, data: finalRes, success: true })

}

// 获取用户详情
exports.getUserInfo = function (id, res) {
  let wherestr = {"_id":id}
  let out = {'psw': 0}
  User.findOne(wherestr,out, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ stauts: 200, data: result, success: true })
    }
  })
}
// module.exports = findUser