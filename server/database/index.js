const mysql = require('mysql')
const config = require('./config')

var poolCluster = mysql.createPoolCluster(); //连接多个数据库

let masterConfig = {
    host:'localhost',
    user:'xcq',
    password:'123456',
    database:'project',
    multipleStatements:true,
    dateStrings:true,
    connectTimeout:30000,
    connectionLimit:30
}

poolCluster.add('PROJECT',config);
poolCluster.add('MASTER', masterConfig); 

// const pool = mysql.createPool({
// 	host: config.HOST,
// 	user: config.USERNAME,
// 	password: config.PASSWORD,
//     database: config.DATABASE,
    // multipleStatements:true,
    // dateStrings:true,
    // connectTimeout:30000,
    // connectionLimit:30
// })

let query = function(sql, values) {
	return new Promise((resolve, reject) => {
        poolCluster.getConnection('PROJECT',function(err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (error, rows) => {
                    connection.release() //release将连接返回池中  供他们再次调用
                    if (error) {
                        reject(error)	
                    } else {
                        resolve(rows)
                    }
                })
            }
        })
	})
}


let query_blog = function(sql, values) {
	return new Promise((resolve, reject) => {
        poolCluster.getConnection('MASTER',function(err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (error, rows) => {
                    connection.release() //release将连接返回池中  供他们再次调用
                    if (error) {
                        reject(error)	
                    } else {
                        resolve(rows)
                    }
                })
            }
        })
	})
}

module.exports = {
    query,
    query_blog
}
