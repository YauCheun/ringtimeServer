const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tmp/files')
  },
  filename: function (req, file, cb) {
    // 获取文件后缀
    let type = file.originalname.replace(/.+\./, '.')
    cb(null, Date.now() + type)
  }
})

const upload = multer({ storage: storage })

module.exports = function (app) {
  app.post('/file/upload', upload.array('files', 10), function (req, res, next) {
    // req.files 是 `photos` 文件数组的信息
    let data = req.files
    res.send(data)
    // req.body 将具有文本域数据，如果存在的话
  })
}