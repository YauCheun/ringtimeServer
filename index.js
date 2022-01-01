const express = require('express')
const app = express()
const port = 3000

// 设置跨域访问
// app.all("*", function (req, res, next) {
// 	//设置允许跨域的域名，*代表允许任意域名跨域
// 	res.header("Access-Control-Allow-Origin", "*");
// 	//允许的header类型
// 	res.header("Access-Control-Allow-Headers", "content-type");
// 	//跨域允许的请求方式 
// 	res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
// 	if (req.method.toLowerCase() == 'options')
// 		res.send({ status: 200 });  //让options尝试请求快速结束
// 	else
// 		next();
// })

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
	res.header("Access-Control-Max-Age", "86400");
  if (req.method.toLowerCase() == 'options')
	  res.send({ status: 200 });  //让options尝试请求快速结束
	else
		next();
});

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ limit: '50mb', extended: false }))
require('./routes/index')(app)
require('./routes/files')(app)
// apidoc存放的位置
app.use('/public',express.static('public'))
// 上传文件存放的位置
app.use('/public',express.static('upload'))

app.get('/', (req, res) => {
	res.send('Hello World!')
})

//设置跨域访问
// app.all("*", function (req, res, next) {
// 	//设置允许跨域的域名，*代表允许任意域名跨域
// 	res.header("Access-Control-Allow-Origin", "*");
// 	//允许的header类型
// 	res.header("Access-Control-Allow-Headers", "content-type");
// 	//跨域允许的请求方式 
// 	res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
// 	if (req.method.toLowerCase() == 'options')
// 		res.send(200);  //让options尝试请求快速结束
// 	else
// 		next();
// })


// 404处理
app.use(function (req, res, next) {
	let err = new Error("not found")
	err.status = 404
	next(err)
})
// 出现错误处理
app.use(function (err, req, res, next) {
	res.status(err.status || 500)
	res.send(err.message)
	next(err)
})
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
