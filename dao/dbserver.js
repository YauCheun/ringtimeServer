let dbmodel = require('../model/dbmodel')
let bcrypt = require('./bcrypt')
let User = dbmodel.model('User')
let Friend = dbmodel.model('Friend')
let Message = dbmodel.model('Message')
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
  let wherestr = { "_id": id }
  let out = { 'psw': 0 }
  User.findOne(wherestr, out, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ stauts: 200, data: result, success: true })
    }
  })
}
// module.exports = findUser

exports.updateUserInfo = function (data, res) {
  let updateStr = {}
  // 存在密码项
  console.log(data)
  if (data.type === 'psw') {
    User.find({ '_id': data.id }, function (err, result) {
      if (err) {
        res.send({ status: 500 })
      } else {
        console.log(result)
        if (result == '') {
          res.send({ status: 400 })
        }
        const pswMatch = bcrypt.verification(data.oldPsw, result[0].psw) //
        if (pswMatch) {
          // 验证成功
          updateStr[data.type] = bcrypt.encryption(data.data)
          User.findByIdAndUpdate(data.id, updateStr, function (err, resu) {
            if (err) {
              res.send({ status: 500 })
            } else {
              res.send({ status: 200 })
            }
          })
        } else {
          res.send({ status: 400 })
        }
      }
    })
  } else if (data.type === 'name' || data.type === 'email') {
    updateStr[data.type] = data.data
    User.countDocuments(updateStr, function (err, result) {
      if (err) {
        res.send({ status: 500 })
      } else {
        if (result === 0) {
          update(data.id, updateStr, res)
        } else {
          // 已存在
          res.send({ status: 300 })
        }
      }
    })
  } else {
    updateStr[data.type] = data.data
    update(data.id, updateStr, res)
  }
}

function update(id, str, res) {
  User.findByIdAndUpdate(id, str, function (err, resu) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200 })
    }
  })
}

// 修改好友昵称
exports.makeFriendName = function (data, res) {
  let whereStr = { 'userID': data.uid, 'friendID': data.fid }
  let updateStr = { 'nickname': data.nickname }
  Friend.updateOne(whereStr, updateStr, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200 })
    }
  })
}


// 获取好友昵称
exports.getFriendName = function (data, res) {
  let whereStr = { 'userID': data.uid, 'friendID': data.fid }
  let out = { 'nickname': 1 }
  Friend.findOne(whereStr, out, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200, data: result })
    }
  })
}


// 更新好友最后通讯时间，用户和好友都修改
exports.updateMsgLastTime = function (data) {
  let wherestr = {
    $or: [{
      'userID': data.uid,
      'friendID': data.fid,
    }, {
      'userID': data.fid,
      'friendID': data.uid,
    }]
  }

  let updatestr = { 'lastMsgTime': new Date() }
  Friend.updateMany(wherestr, updatestr, function (err, result) {
    if (err) {
      console.log('更新通讯时间失败')
    } else {
      console.log('更新通讯时间成功')
    }
  })
}

// 好友操作，添加进好友表
exports.buildFriend = function (uid, fid, state) {
  let data = {
    userID: uid,
    friendID: fid,
    state: state,
    createtime: new Date(),
    lastMsgTime: new Date()
  }
  let friend = new Friend(data)
  friend.save(function (err, result) {
    if (err) {
      console.log('添加好友表失败')
    } else {
      console.log('添加好友表成功')
    }
  })
}

// 添加一对一消息
exports.insertMsg = function (uid, fid, msg, types, res) {
  let data = {
    userID: uid,               // 用户ID
    friendID: fid,             // 好友ID
    message: msg,              // 内容
    types: types,              // 内容类型（0：文字 1：图片连接 2：音频连接）
    sendtime: new Date(),     // 发送时间
    state: 1                 // 状态（0：已读 1：未读）
  }
  let message = new Message(data)
  message.save(function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200 })
    }
  })
}


// 好友申请
exports.applyFriend = function (data, res) {
  // 判断是否已经申请过
  let wherestr = {
    'userID': data.uid,
    'friendID': data.fid,
  }
  Friend.countDocuments(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 })
    } else {
      if (result == 0) {
        // 如果result为0， 则为初次申请
        this.buildFriend(data.uid, data.fid, 2)
        this.buildFriend(data.fid, data.uid, 1)
      } else {
        // 已经申请过好友，则更新通讯时间
        this.updateMsgLastTime(data)
      }
      this.insertMsg(data.uid, data.fid, data.msg, 0, res)
    }
  })
}

// 同意申请，更新好友状态，用户和好友都修改
exports.updateFriendState = function (data, res) {
  let wherestr = {
    $or: [{
      'userID': data.uid,
      'friendID': data.fid,
    }, {
      'userID': data.fid,
      'friendID': data.uid,
    }]
  }

  let updatestr = { 'state': 0 }
  Friend.updateMany(wherestr, updatestr, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200 })
    }
  })
}



// 拒绝或删除好友
exports.forbidOrDelFriend = function (data, res) {
  let wherestr = {
    $or: [{
      'userID': data.uid,
      'friendID': data.fid,
    }, {
      'userID': data.fid,
      'friendID': data.uid,
    }]
  }
  Friend.deleteMany(wherestr, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200 })
    }
  })
}