let {query_blog,query} = require('../database'),
uuid = require('node-uuid'), //生成唯一id
moment = require('moment'),//时间工具函数

queryProject = (req,res) => {
    let userId = req.query.userId
    let type = req.query.type
    let status = req.query.status
    let projector = req.query.projector
    let str
    if(status){
        if(projector){
            str = `select * from pub_approval_workflow where (${type} = '${userId}' and CurrentNode = ${status} and (ProjectStatus!=4 and ProjectStatus!=5) ) or (ProjectStatus=1 and YLCode is null )`
        }else{
            str = `select * from pub_approval_workflow where ${type} = '${userId}' and CurrentNode = ${status}`
        }
        
    }else{
        str = `select * from pub_approval_workflow where ${type} = '${userId}'`
    }
    query_blog(str).then( (r) => {
        res.send({
            items:r
        })
    })
},

addProject = (req,res) => {
    let reData = req.body
    let projectId = uuid.v4().replace(/\-/g,'')
    
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


editProject = (req,res) => {
    let reData = req.body
    
    query_blog(`update Pub_approval_Workflow set ProjectStatus=2,CurrentNode=${reData.status} ,ProjectorUserId='${reData.projectorId}',OperatorUserId='${reData.operatorId}',ProductionInfo='${reData.proInfo}',ProductorRemark='${reData.remarks}' where ProjectId = '${reData.projectId}'`).then( (r) => {
        res.send({
            errorCode:100046,
            message:'项目修改成功!'
        })
    },error => {
        res.send({
            errorCode:100047,
            message:'项目修改失败!'
        })
    })
},

queryRoleUser = (req,res) => {
    let roles = req.query.roles.split(',')
    let str = ''
    for(let i=0; i<roles.length; i++){
        str += `RoleId = ${roles[i]} ${i === roles.length-1?'':' or '}`
    }
    query(`select UserId,UserName,Cname from Pub_User where ${str}`).then( (r) => {
        res.send({
            roles:r
        })
    })
    
},

queryUserById = (req,res) => {
    let ids = req.query.ids.split(',')
    let str = ''
    for(let i=0; i<ids.length; i++){
        str += `UserId = '${ids[i]}' ${i === ids.length-1?'':' or '}`
    }
    query(`select UserId,UserName,Cname from Pub_User where ${str}`).then( (r) => {
        res.send({
            users:r
        })
    })
},

approvalProject = (req,res) => {
    let reData = req.body
    let str = ''
    if(reData.type==='Projector'){
        str = `update Pub_approval_Workflow set CurrentNode = 1 ,ProjectName = '${reData.projectName}',ProjectorRemark = '${reData.remark}',ProjectorApprovalTime = '${moment().format('YYYY-MM-DD HH:mm:ss')}' where ProjectId = '${reData.id}'`
    }else if(reData.type==='Operator'){
        str = `update Pub_approval_Workflow set CurrentNode = 2 ,Sku = '${reData.sku}', Asin = '${reData.asin}',ParentAsin = '${reData.parentAsin}',ProjectStatus=1,ProjectName = '${reData.projectName}',OperatorRemark = '${reData.remark}',OperatorApprovalTime = '${moment().format('YYYY-MM-DD HH:mm:ss')}' where ProjectId = '${reData.id}'`
    }else{
        str = `update Pub_approval_Workflow set YLCode = '${reData.ylCode}',EndTime='${moment().format('YYYY-MM-DD HH:mm:ss')}' where ProjectId = '${reData.id}'`
    }
    query_blog(str).then( (r) => {
        res.send({
            errorCode:100048
        })
    },error => {
        res.send({
            errorCode:100049
        })
    })
},

rejectApproval = (req,res) => {
    let projectId = req.body.projectId
    let status = req.body.status
    query_blog(`update Pub_approval_Workflow set CurrentNode=-1,ProjectStatus=${status} where ProjectId = '${projectId}'`).then( (r) => {
        res.send({
            errorCode:100050
        })
    },error => {
        res.send({
            errorCode:100051
        })
    })
}

module.exports = {
    queryProject,
    addProject,
    queryRoleUser,
    queryUserById,
    editProject,
    approvalProject,
    rejectApproval
}