const findUser = require('../dao/dbserver')
const { emailSignUp } = require('../dao/emailserver')
const signup = require('../server/signup')
const signin = require('../server/signin')
const searchUser = require('../server/searchFriend')
const userDetail = require('../server/userDetail')
const friend = require('../server/friend')
const index = require('../server/index')
const chat = require('../server/chat')

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
* @api {post}	/searchUser/search 搜索用户或群
* @apiDescription 通过关键词搜索用户或群,并判断是否为好友以及是否在群内
* @apiName search
* @apiGroup Search
* @apiParam {string} keyword 关键词
* @apiParam {string} uid  用户id
* @apiSuccess {string} status 状态码
* @apiSuccess {object} data 返回值
* @apiSuccess {boolean} success 执行成功或失败
* @apiSuccessExample {json} Success-Response:
*  {
*   "status" : "200",
*		"data": {
*        "friends": [
*            {
*                "_id": "61658f08cab2e6c5b2fbf6c3",
*                "name": "test1",
*                "imgurl": "user.png",
*                "isFriend": false
*            },
*            {
*                "_id": "6165903ecab2e6c5b2fbf6c5",
*                "name": "test",
*                "imgurl": "user.png",
*                "isFriend": true
*            }
*        ],
*        "groups": [
*            {
*                "imgurl": "group.png",
*                "_id": "617aa274d0977faa7d2dd594",
*                "name": "testGroup",
*                "isGroup": false
*            },
*            {
*                "imgurl": "group.png",
*                "_id": "617aa33fd0977faa7d2dd595",
*                "name": "testGrp",
*                "isGroup": true
*            }
*        ]
*    },
*   "success": true
*  }
* @apiSampleRequest http://localhost:3000/searchUser/search
* @apiVersion 1.0.0
*/
	app.post('/searchUser/search', (req, res) => {
		searchUser.searchUser(req, res)
	})



	/**
* @api {post}	/user/getUserInfo 获取用户详情
* @apiDescription 通过用户主键检索用户详情信息
* @apiName getUserInfo
* @apiGroup User
* @apiParam {string} id  用户id
* @apiSuccess {string} status 状态码
* @apiSuccess {object} data 返回值
* @apiSuccess {boolean} success 执行成功或失败
* @apiSuccessExample {json} Success-Response:
*  {
*   "status" : "200",
*		"data": {
*		    "_id": "6165903ecab2e6c5b2fbf6c5",
*		    "name": "test",
*		    "sex": "unknown",
*		    "imgurl": "user.png",
*		    "createtime": "2021-10-12T13:40:14.846Z",
*		    "__v": 0
*		 },
*   "success": true
*  }
* @apiSampleRequest http://localhost:3000/user/getUserInfo
* @apiVersion 1.0.0
*/
	app.post('/user/getUserInfo', (req, res) => {
		userDetail.getUserInfo(req, res)
	})


	/**
* @api {post}	/user/updateUserInfo 修改用户信息
* @apiDescription 修改用户信息包括邮箱密码等
* @apiName updateUserInfo
* @apiGroup User
* @apiParam {string} id  用户id
* @apiParam {string} type  修改类型
* @apiParam {string} oldPsw  如果修改密码时的老密码
* @apiParam {string} data  修改值
* @apiSuccess {string} status 状态码  500请求失败  400 密码错误 300 已存在不可修改  200请求成功
* @apiSuccess {object} data 返回值
* @apiSuccess {boolean} success 执行成功或失败
* @apiSuccessExample {json} Success-Response:
*  {
*   "status" : "200"
*  }
* @apiSampleRequest http://localhost:3000/user/updateUserInfo
* @apiVersion 1.0.0
*/
	app.post('/user/updateUserInfo', (req, res) => {
		userDetail.updateUserInfo(req, res)
	})


	/**
* @api {post}	/user/makeFriendName 修改好友昵称
* @apiDescription 修改用户好友备注
* @apiName makeFriendName
* @apiGroup User
* @apiParam {string} uid  用户id
* @apiParam {string} fid  好友用户id
* @apiParam {string} nickname  要修改的好友名称
* @apiSuccess {string} status 状态码
* @apiSuccessExample {json} Success-Response:
*  {
*   "status" : "200"
*  }
* @apiSampleRequest http://localhost:3000/user/makeFriendName
* @apiVersion 1.0.0
*/
	app.post('/user/makeFriendName', (req, res) => {
		userDetail.makeFriendName(req, res)
	})


	/**
* @api {post}	/user/getFriendName 获取好友昵称
* @apiDescription 获取用户好友备注
* @apiName getFriendName
* @apiGroup User
* @apiParam {string} uid  用户id
* @apiParam {string} fid  好友用户id
* @apiSuccess {string} status 状态码
* @apiSuccessExample {json} Success-Response:
*  {
*   "status" : "200",
*   "data": "nicename"
*  }
* @apiSampleRequest http://localhost:3000/user/getFriendName
* @apiVersion 1.0.0
*/
	app.post('/user/getFriendName', (req, res) => {
		userDetail.getFriendName(req, res)
	})

	/**
* @api {post}	/friend/applyFriend 申请好友
* @apiDescription 发送好友申请
* @apiName applyFriend
* @apiGroup Friend
* @apiParam {string} uid  用户id
* @apiParam {string} fid  好友用户id
* @apiParam {string} msg  申请描述内容
* @apiSuccess {string} status 状态码
* @apiSuccessExample {json} Success-Response:
*  {
*   "status" : "200",
*  }
* @apiSampleRequest http://localhost:3000/friend/applyFriend
* @apiVersion 1.0.0
*/
	app.post('/friend/applyFriend', (req, res) => {
		friend.applyFriend(req, res)
	})

	/**
* @api {post}	/friend/updateFriendState 同意好友申请
* @apiDescription 同意好友申请
* @apiName updateFriendState
* @apiGroup Friend
* @apiParam {string} uid  用户id
* @apiParam {string} fid  好友用户id
* @apiSuccess {string} status 状态码
* @apiSuccessExample {json} Success-Response:
*  {
*   "status" : "200",
*  }
* @apiSampleRequest http://localhost:3000/friend/updateFriendState
* @apiVersion 1.0.0
*/
	app.post('/friend/updateFriendState', (req, res) => {
		friend.updateFriendState(req, res)
	})


	/**
* @api {post}	/friend/forbidOrDelFriend 拒绝或删除好友
* @apiDescription 拒绝好友申请或者删除好友
* @apiName forbidOrDelFriend
* @apiGroup Friend
* @apiParam {string} uid  用户id
* @apiParam {string} fid  好友用户id
* @apiSuccess {string} status 状态码
* @apiSuccessExample {json} Success-Response:
*  {
*   "status" : "200",
*  }
* @apiSampleRequest http://localhost:3000/friend/forbidOrDelFriend
* @apiVersion 1.0.0
*/
	app.post('/friend/forbidOrDelFriend', (req, res) => {
		friend.forbidOrDelFriend(req, res)
	})

	/**
* @api {post}	/index/getUserList 获取好友列表
* @apiDescription 根据条件获取好友信息列表
* @apiName getUserList
* @apiGroup Index
* @apiParam {string} uid  用户id
* @apiParam {number} state  好友状态
* @apiSuccess {string} status 状态码
* @apiSuccessExample {json} Success-Response:
*{
*    "status": 200,
*    "data": [
*        {
*            "id": "61658f08cab2e6c5b2fbf6c3",
*            "name": "哈巴",
*            "imgurl": "user.png",
*            "lastMsgTime": "2021-12-19T02:37:44.973Z",
*            "msgUnReadCount": 1,
*            "lastMsgContent": "test11",
*            "sendtime": "2021-12-19T02:37:44.986Z",
*            "types": "0"
*        },
*        {
*            "id": "6165903ecab2e6c5b2fbf6c5",
*            "name": "test",
*            "nickname": "哈巴",
*            "imgurl": "user.png",
*            "lastMsgTime": "2021-12-19T02:30:39.896Z",
*            "msgUnReadCount": 1,
*            "lastMsgContent": "test",
*            "sendtime": "2021-12-19T02:30:39.897Z",
*            "types": "0"
*        }
*    ]
*}
* @apiSampleRequest http://localhost:3000/index/getUserList
* @apiVersion 1.0.0
*/
	app.post('/index/getUserList', (req, res) => {
		index.getUserList(req, res)
	})


	/**
* @api {post}	/friend/updateReadMsd 更新已读好友消息状态
* @apiDescription 更新与好友的消息状态，将未读消息状态改为已读消息
* @apiName updateReadMsd
* @apiGroup Friend
* @apiParam {string} uid  用户id
* @apiParam {string} fid  好友id
* @apiSuccess {string} status 状态码
* @apiSuccessExample {json} Success-Response:
*{
*    "status": 200
*}
* @apiSampleRequest http://localhost:3000/friend/updateReadMsd
* @apiVersion 1.0.0
*/
	app.post('/friend/updateReadMsd', (req, res) => {
		friend.updateReadMsd(req, res)
	})



	/**
* @api {post}	/index/getGroupList 获取群列表
* @apiDescription 根据条件获取群信息列表
* @apiName getGroupList
* @apiGroup Index
* @apiParam {string} uid  用户id
* @apiSuccess {string} status 状态码
* @apiSuccessExample {json} Success-Response:
*{
*    "status": 200,
*    "data": [
*        {
*            "id": "61658f08cab2e6c5b2fbf6c3",
*            "name": "哈巴",
*            "imgurl": "user.png",
*            "lastMsgTime": "2021-12-19T02:37:44.973Z",
*            "msgUnReadCount": 1,
*            "lastMsgContent": "test11",
*            "sendtime": "2021-12-19T02:37:44.986Z",
*            "types": "0"
*        }
*    ]
*}
* @apiSampleRequest http://localhost:3000/index/getGroupList
* @apiVersion 1.0.0
*/
	app.post('/index/getGroupList', (req, res) => {
		index.getGroupList(req, res)
	})

	/**
* @api {post}	/group/updateGroupReadMsd 更新已读群消息状态
* @apiDescription 更新群的消息状态，将未读消息状态改为已读消息
* @apiName updateGroupReadMsd
* @apiGroup Group
* @apiParam {string} uid  用户id
* @apiParam {string} gid  群id
* @apiSuccess {string} status 状态码
* @apiSuccessExample {json} Success-Response:
*{
*    "status": 200
*}
* @apiSampleRequest http://localhost:3000/group/updateGroupReadMsd
* @apiVersion 1.0.0
*/
	app.post('/group/updateGroupReadMsd', (req, res) => {
		group.updateGroupReadMsd(req, res)
	})

		/**
* @api {post}	/chat/getMsg 分页获取聊天信息
* @apiDescription 分页获取与好友的聊天信息
* @apiName getMsg
* @apiGroup Chat
* @apiParam {string} uid  用户id
* @apiParam {string} fid  好友id
* @apiParam {string} page  页码
* @apiParam {string} pageSize 信息个数
* @apiSuccess {string} status 状态码
* @apiSuccessExample {json} Success-Response:
*{
*    "status": 200
*}
* @apiSampleRequest http://localhost:3000/chat/getMsg
* @apiVersion 1.0.0
*/
app.post('/chat/getMsg', (req, res) => {
	chat.getMsg(req, res)
})
}