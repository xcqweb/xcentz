let {query} = require('../database'),
    schedule = require('node-schedule');

    //定时任务(更新数据到redis)
let scheduleTask = function(){
    function update(){
        query('select * from Pub_User').then( (r) => {
            redis.set('userList',JSON.stringify(r))
        })
    }
    update()
    schedule.scheduleJob('0 0 3 * * *', function(){//每天凌晨3点更新,确保redis数据与数据库同步
        update()
    });
}

module.exports = scheduleTask