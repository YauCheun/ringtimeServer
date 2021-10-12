const findUser = require('../dao/dbserver')
const { emailSignUp } = require('../dao/emailserver')
const signup = require('../server/signup')
const signin = require('../server/signin')
const searchUser = require('../server/searchFriend')


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
		* @apiSuccess {json} data 
		* @apiSuccess {string} status 状态码
		* @apiSuccess {boolean} success 执行成功或失败
		* @apiSuccessExample {json} Success-Response:
		*  {
		*    "status" : "200",
		*    "success": true  
		*  }
		* @apiSampleRequest http://localhost:3000/signup/add
		* @apiVersion 1.0.0
	*/
	app.post('/signup/add', (req, res) => {
		signup.signUp(req, res)
	})


	/**
		* @api {post}	/signup/judge 用户或邮箱是否存在
		* @apiDescription 用户或邮箱是否存在
		* @apiName judge
		* @apiGroup User
		* @apiParam {string} data 邮箱/用户名
		* @apiParam {string="name","email"} type  判断类型
		* @apiSuccess {string} status 状态码
		* @apiSuccess {string} result 0为不存在，大于0为存在
		* @apiSuccess {boolean} success 执行成功或失败
		* @apiSuccessExample {json} Success-Response:
		*  {
		*   "status" : "200",
		*		"result": "0",
		*   "success": true  
		*  }
		* @apiSampleRequest http://localhost:3000/signup/judge
		* @apiVersion 1.0.0
	*/
	app.post('/signup/judge', (req, res) => {
		signup.judgeValue(req, res)
	})

	/**
	* @api {post}	/signin/login 用户登录
	* @apiDescription 用户名或邮箱登录验证
	* @apiName login
	* @apiGroup User
	* @apiParam {string} data 邮箱/用户名
	* @apiParam {string} psw  密码
	* @apiSuccess {string} status 状态码
	* @apiSuccess {object} data 返回值
	* @apiSuccess {boolean} success 执行成功或失败
	* @apiSuccessExample {json} Success-Response:
	*  {
	*   "status" : "200",
	*		"data": {
	*    "id": "614b2f73ce3bef9d31a064bf",
	*    "name": "zhangyou",
	*    "imgurl": "user.png",
	*    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNGIyZjczY2UzYmVmOWQzMWEwNjRiZiIsImlhdCI6MTYzNDAzNjU2MCwiZXhwIjoxNjQ0NDA0NTYwfQ.fmwllXNVFjWOtVSTkMduAibx7DykT6kz_QgvJyqhY0w"
	*  },
	*   "success": true
	*  }
	* @apiSampleRequest http://localhost:3000/signin/login
	* @apiVersion 1.0.0
*/
	app.post('/signin/login', (req, res) => {
		signin.signIn(req, res)
	})

		/**
	* @api {post}	/searchUser/search 搜索用户
	* @apiDescription 通过关键词搜索用户好友
	* @apiName search
	* @apiGroup Search
	* @apiParam {string} keyword 关键词
	* @apiParam {string} uid  用户id
	* @apiSuccess {string} status 状态码
	* @apiSuccess {array} data 返回值
	* @apiSuccess {boolean} success 执行成功或失败
	* @apiSuccessExample {json} Success-Response:
	*  {
	*   "status" : "200",
	*		"data": {
	*    "id": "614b2f73ce3bef9d31a064bf",
	*    "name": "zhangyou",
	*    "imgurl": "user.png",
	*    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNGIyZjczY2UzYmVmOWQzMWEwNjRiZiIsImlhdCI6MTYzNDAzNjU2MCwiZXhwIjoxNjQ0NDA0NTYwfQ.fmwllXNVFjWOtVSTkMduAibx7DykT6kz_QgvJyqhY0w"
	*  },
	*   "success": true
	*  }
	* @apiSampleRequest http://localhost:3000/searchUser/search
	* @apiVersion 1.0.0
*/
app.post('/searchUser/search', (req, res) => {
	searchUser.searchUser(req, res)
})
}