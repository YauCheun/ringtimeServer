const findUser = require('../dao/dbserver')
const { emailSignUp } = require('../dao/emailserver')
const signup = require('../server/signup')
// console.log(findUser)
module.exports = function (app) {
	app.get('/test', (req, res) => {
		findUser(res)
	})
	app.post('/mail', (req, res) => {
		let mail = req.body
		emailSignUp(mail.email, res)
		// res.send(mail)
	})
	// 注册页面
	app.post('/signup/add',(req,res)=>{
		signup.signUp(req,res)
	})
	// 用户或邮箱是否占用判断
	app.post('/signup/judge',(req,res)=>{
		signup.judgeValue(req,res)
	})
}