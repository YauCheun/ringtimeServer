const express = require('express')
const app = express()
const port = 3000
require('./router/index')(app)
app.get('/', (req, res) => {
	res.send('Hello World!')
})
// app.use(require('cors')())
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
