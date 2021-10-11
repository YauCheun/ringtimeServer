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
	/**
		* @api {post}	/signup/add 用户注册
		* @apiDescription 用户注册
		* @apiName add
		* @apiGroup User
		* @apiParam {string} email 邮箱
		* @apiParam {string} name 用户名
		* @apiParam {string} psw 密码
		* @apiSuccess {json} result
		* @apiSuccessExample {json} Success-Response:
		*  {
		*      "status" : "200"
		*  }
		* @apiSampleRequest http://localhost:3000/signup/add
		* @apiVersion 1.0.0
	*/
	app.post('/signup/add', (req, res) => {
		signup.signUp(req, res)
	})
	// 用户或邮箱是否占用判断
	app.post('/signup/judge', (req, res) => {
		signup.judgeValue(req, res)
	})
}