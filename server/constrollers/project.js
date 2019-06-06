let {query_blog} = require('../database'),
uuid = require('node-uuid'), //生成唯一id
moment = require('moment'),//时间工具函数

queryProject = (req,res) => {
    query_blog(`select * from pub_approval_workflow`).then( (r) => {
        res.send({
            items:r
        })
    })
},

addProject = (req,res) => {
    let reData = req.body
    console.log(reData)
    var projectId = uuid.v4().replace(/\-/g,'')
    
    Promise.all([query_blog(`insert into pub_approval_workflow(ProjectId,ProjectStatus,CreateUserId,CurrentNode,ProductionInfo,CreateTime) values('${projectId}',${reData.status},'${reData.userId}',${reData.curNode},'${reData.proInfo}','${moment().format('YYYY-MM-DD HH:mm:ss')}')`),query_blog(`insert into pub_workflow_node(NodeId,ProjectId,NodeType,NodeStatus) values('${uuid.v4().replace(/\-/g,'')}','${projectId}',1,1),('${uuid.v4().replace(/\-/g,'')}','${projectId}',2,2),('${uuid.v4().replace(/\-/g,'')}','${projectId}',3,3)`)]).then( (r) => {
        res.send({
            items:r
        })
    })
}


module.exports = {
    queryProject,
    addProject,
}