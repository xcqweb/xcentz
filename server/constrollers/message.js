let {query_blog,query} = require('../database'),


queryMsg = (req,res) => {
    let userId = req.query.userId
    let status = req.query.status
    let str = ''
    if(status){
        str = `select * from Pub_Message where UserId = '${userId}';select Count(*) as count from Pub_Message where UserId = '${userId}'`
    }else{
        str = `select * from Pub_Message where UserId = '${userId}' and ReadStatus=0;select Count(*) as count from Pub_Message where UserId = '${userId}' and ReadStatus=0`
    }
    query_blog(str).then( (r) => {
        res.send({
            msgs:r[0],
            count:r[1][0].count
        })
    })
},

readMsg = (req,res) => {
    let msgId = req.body.msgId
    query_blog(`update Pub_Message set ReadStatus=1 where MessageId = '${msgId}';`).then( (r) => {
        res.send({
            message:'消息已读'
        })
    })
}















module.exports = {
    queryMsg,
    readMsg
}