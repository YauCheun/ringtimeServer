const jwt = require('jsonwebtoken')
const secret = 'ringtime'
// 生成token
exports.generateToken = function (e) {
  let payload = { id: e, time: new Date() }
  let token = jwt.sign(payload, secret, {
    expiresIn: 60 * 60 * 24 * 120 //秒到期时间
  })
  return token
}

// 解析token
exports.verifyToken = function (e) {
  let payload = jwt.verify(e, secret)
  return payload
}