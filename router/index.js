const findUser = require('../dao/dbserver')
// console.log(findUser)
module.exports = function(app){
	app.get('/test',(req,res)=>{
		findUser(res)
	})
}