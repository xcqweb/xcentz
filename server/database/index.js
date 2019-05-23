const mysql = require('mysql')
const config = require('./config')

const pool = mysql.createPool({
	host: config.HOST,
	user: config.USERNAME,
	password: config.PASSWORD,
	database: config.DATABASE,
	multipleStatements:true,
	dateStrings:true,
})

let query = function(sql, values) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				connection.query(sql, values, (err, rows) => {
					connection.release() //release将连接返回池中  供他们再次调用
					if (err) {
						reject(err)	
					} else {
						resolve(rows)
					}
				})
			}
		})
	})
}









module.exports = {
	query
}
