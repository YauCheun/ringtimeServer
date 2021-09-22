const mongoose = require('mongoose')

let db = mongoose.createConnection('mongodb://localhost:27017/user', { useNewUrlParser: true, useUnifiedTopology: true })
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	// we're connected!
	console.info('数据库连接成功')
});

module.exports = db
