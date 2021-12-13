const mongoose = require('mongoose')

let db = require('../config/db')
// console.log(db)
let Schema = mongoose.Schema

// 用户表
let UserSchema = new Schema({
  name: { type: String },                           // 用户名
  psw: { type: String },                            // 密码
  email: { type: String },                          // 邮箱
  sex: { type: String, default: 'unknown' },        // 性别
  birth: { type: Date },                            // 生日
  phone: { type: Number },                          // 电话
  sign: { type: String },                           // 个性签名
  imgurl: { type: String, default: 'user.png' },    // 头像链接
  createtime: { type: Date }                        // 注册时间
})

// 好友表
let FriendSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },               // 用户ID
  friendID: { type: Schema.Types.ObjectId, ref: 'User' },             // 好友ID
  state: { type: String },                                            // 状态（0：已为好友 1：申请中 2：申请发送方，对方还未同意）
  nickname: { type: String },                                         // 好友备注
  createtime: { type: Date },                                        // 生成时间
  lastMsgTime: { type: Date }                                          // 最后消息时间
})

// 一对一消息表
let MessageSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },               // 用户ID
  friendID: { type: Schema.Types.ObjectId, ref: 'User' },             // 好友ID
  message: { type: String },                                          // 内容
  types: { type: String },                                            // 内容类型（0：文字 1：图片连接 2：音频连接）
  sendtime: { type: Date },                                           // 发送时间
  state: { type: Number }                                             // 状态（0：已读 1：未读）
})

// 群表
let GroupSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },               // 用户ID
  name: { type: String },                                             // 群名
  imgurl: { type: String, default: 'group.png' },                     // 群封面
  notice: { type: String },                                           // 群公告
  createtime: { type: Date },                                         // 创建时间
})

// 群成员表
let GroupUserSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' },             // 群ID
  userID: { type: Schema.Types.ObjectId, ref: 'User' },               // 用户ID
  name: { type: String },                                             // 群内昵称
  tip: { type: Number },                                              // 未读消息数
  shield: { type: Number },                                           // 是否屏蔽群消息（0：不屏蔽 1：屏蔽）
  jointime: { type: Date },                                           // 加入时间
  lastMsgTime: { type: Date }                                          // 最后消息时间
})

// 群消息表
let GroupMessageSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' },             // 群ID
  userID: { type: Schema.Types.ObjectId, ref: 'User' },               // 用户ID
  message: { type: String },                                          // 内容
  types: { type: String },                                            // 内容类型（0：文字 1：图片连接 2：音频连接）
  sendtime: { type: Date }                                           // 发送时间
})

module.exports = db.model('User', UserSchema)
module.exports = db.model('Friend', FriendSchema)
module.exports = db.model('Message', MessageSchema)
module.exports = db.model('Group', GroupSchema)
module.exports = db.model('GroupUser', GroupUserSchema)
module.exports = db.model('GroupMessage', GroupMessageSchema)