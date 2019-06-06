let {query_blog,query} = require('../database'),
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
    
    query_blog(`insert into Pub_approval_Workflow(ProjectId,ProjectStatus,ProductorUserId,ProjectorUserId,OperatorUserId,CurrentNode,ProductionInfo,ProductorRemark,CreateTime) values('${projectId}',${reData.status},'${reData.userId}','${reData.projectorId}','${reData.operatorId}',${reData.curNode},'${reData.proInfo}','${reData.remarks}','${moment().format('YYYY-MM-DD HH:mm:ss')}')`).then( (r) => {
        res.send({
            errorCode:100044,
            message:'项目创建成功!'
        })
    },error => {
        res.send({
            errorCode:100045,
            message:'项目创建失败!'
        })
    })
},

queryRoleUser = (req,res) => {
    let roles = req.query.roles.split(',')
    query(`select UserId,UserName,Cname from Pub_User where RoleId = ${roles[0]};select UserId,UserName,Cname from Pub_User where RoleId = ${roles[1]}`).then( (r) => {
        res.send({
            roles:r
        })
    })
    
}


module.exports = {
    queryProject,
    addProject,
    queryRoleUser
}