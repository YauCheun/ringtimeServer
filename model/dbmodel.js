const mongoose = require('mongoose')

let db = require('../config/db')
// console.log(db)
let Schema = mongoose.Schema

// 用户表
let SchemaUser = new Schema()

module.exports = db.model('User', SchemaUser)