let {query_blog,query} = require('../database'),
uuid = require('node-uuid'), //生成唯一id
moment = require('moment');//时间工具函数


let Message = {}

Message.postMessage = function(userId,projectId,type=0,content='您有一个待审批项目请及时处理!'){
    return query_blog(`insert into Pub_Message(UserId,ProjectId,MessageId,Content,MessageType,ReadStatus,CreateTime) values('${userId}','${projectId}','${uuid.v4().replace(/\-/g,'')}','${content}',${type},0,'${moment().format('YYYY-MM-DD HH:mm:ss')}')`)
}


Message.updateMessage = function(messageId,projectId){
    return query_blog(`update Pub_Message set ReadStatus=1 where MessageId='${messageId}' or ProjectId='${projectId}'`)
}























module.exports = {Message}