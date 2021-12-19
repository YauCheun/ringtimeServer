const multer = require('multer')
const mkdir = require('../dao/mkdir')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let url = req.body.url
    mkdir.mkdir('../upload/' + url, err => {
      console.log(err)
    })
    cb(null, './upload/' + url)
  },
  filename: function (req, file, cb) {
    // let name = req.body.name
    // 获取文件后缀
    let type = file.originalname.replace(/.+\./, '.')
    cb(null, Date.now() + type)
  }
})

const upload = multer({ storage: storage })

module.exports = function (app) {
  
		/**
* @api {post}	/file/upload 上传文件
* @apiDescription 制定目录 上传文件
* @apiName upload
* @apiGroup file
* @apiParam {string} url  用户id
* @apiParam {string} name  文件名（保证唯一）
* @apiParam {file} files  文件流
* @apiSuccess {string} status 状态码
* @apiSuccessExample {json} Success-Response:
*  {
*   "status" : "200",
*  }
* @apiSampleRequest http://localhost:3000/file/upload 
* @apiVersion 1.0.0
*/
  app.post('/file/upload', upload.array('files', 10), function (req, res, next) {
    // req.files 是 `photos` 文件数组的信息
    let data = req.files
    res.send(data)
    // req.body 将具有文本域数据，如果存在的话
  })
}