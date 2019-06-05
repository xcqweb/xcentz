let {query} = require('../database'),
    schedule = require('node-schedule');

let scheduleTask = function(){
    function update(){
        query('select * from Pub_User').then( (r) => {
            redis.set('userList',JSON.stringify(r))
        })
    }
    update()
    schedule.scheduleJob('0 0 3 * * *', function(){
        update()
    });
}

module.exports = scheduleTask