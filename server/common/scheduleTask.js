let {query} = require('../database'),
    schedule = require('node-schedule');

let scheduleTask = function(){
    console.log(222)
    function update(){
        query('select * from Pub_User').then( (r) => {
            redis.set('userList',JSON.stringify(r))
        })
    }
        update()
    schedule.scheduleJob('0 0 3 * * *', function(){
        console.log(111)
        update()
    });
}

module.exports = scheduleTask