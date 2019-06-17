let {query_blog,query} = require('../database'),
uuid = require('node-uuid'), //生成唯一id
moment = require('moment'),//时间工具函数
{Message} = require('./query'),

queryProject = (req,res) => {
    let userId = req.query.userId
    let type = req.query.type
    let status = req.query.status
    let projector = req.query.projector
    let str
    let key = req.query.key || ''
    let curPage = Number(req.query.currentPage) || 1
    let pageSize = Number(req.query.pageSize) || 15
    if(status){
        if(projector){
            if(status==20){
                str = `select * from pub_approval_workflow where (${type} = '${userId}' and (CurrentNode = 2 or CurrentNode = 0) and (ProjectStatus!=4 and ProjectStatus!=5) ) or (ProjectStatus=1 and YLCode is null )`
            }else{
                str = `select * from pub_approval_workflow where (${type} = '${userId}' and CurrentNode = ${status} and (ProjectStatus!=4 and ProjectStatus!=5) ) or (ProjectStatus=1 and YLCode is null )`
            }
            
        }else{
            str = `select * from pub_approval_workflow where ${type} = '${userId}' and CurrentNode = ${status}`
        }
        
    }else{
        str = `select * from pub_approval_workflow where ${type} = '${userId}' AND CONCAT(pub_approval_workflow.ProductorName,pub_approval_workflow.ProjectorName,pub_approval_workflow.OperatorName,pub_approval_workflow.ProjectName) LIKE '%${key}%'
        LIMIT ${(curPage-1)*pageSize},${pageSize};
        SELECT COUNT(*) AS total FROM pub_approval_workflow where ${type} = '${userId}'`
    }
    query_blog(str).then( (r) => {
        if(req.query.currentPage || req.query.pageSize){
            res.send({
                items:r[0],
                total:r[1][0].total
            })
        }else{
           res.send({
                items:r,
            }) 
        }
        
    })
},

addProject = (req,res) => {
    let reData = req.body
    let projectId = uuid.v4().replace(/\-/g,'')
    
    query_blog(`insert into Pub_approval_Workflow(ProjectId,ProjectStatus,ProductorUserId,ProjectorUserId,OperatorUserId,ProductorName,ProjectorName,OperatorName,CurrentNode,ProductionInfo,ProductorRemark,CreateTime) values('${projectId}',${reData.status},'${reData.userId}','${reData.projectorId}','${reData.operatorId}','${reData.productorName}','${reData.projectorName}','${reData.operatorName}',${reData.curNode},'${reData.proInfo}','${reData.remarks}','${moment().format('YYYY-MM-DD HH:mm:ss')}')`).then( (r) => {
        //发送消息
        Message.postMessage(reData.projectorId,projectId)
        res.send({
            errorCode:100044,
            message:'项目创建成功!'
        })
    },error => {
        res.status(500).send({
            errorCode:100045,
            message:'项目创建失败!'
        })
    })
},


editProject = (req,res) => {
    let reData = req.body
    let str = ''
    if(reData.reset){
        str = `update Pub_approval_Workflow set ProjectStatus=2,ProjectName=null,ProjectorApprovalTime=null,ProjectorRemark=null,CurrentNode=${reData.status} ,ProjectorUserId='${reData.projectorId}',OperatorUserId='${reData.operatorId}',ProductorName='${reData.productorName}',ProjectorName='${reData.projectorName}',OperatorName='${reData.operatorName}',ProductionInfo='${reData.proInfo}',ProductorRemark='${reData.remarks}' where ProjectId = '${reData.projectId}'`
    }else{
        str = `update Pub_approval_Workflow set ProjectStatus=2,CurrentNode=${reData.status} ,ProjectorUserId='${reData.projectorId}',OperatorUserId='${reData.operatorId}',ProductorName='${reData.productorName}',ProjectorName='${reData.projectorName}',OperatorName='${reData.operatorName}',ProductionInfo='${reData.proInfo}',ProductorRemark='${reData.remarks}' where ProjectId = '${reData.projectId}'`
    }
    query_blog(str).then( (r) => {
        res.send({
            errorCode:100046,
            message:'项目修改成功!'
        })
    },error => {
        res.status(500).send({
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
        str = `update Pub_approval_Workflow set CurrentNode = 2 ,Sku = '${reData.sku}', Asin = '${reData.asin}',ParentAsin = '${reData.parentAsin}',OperatorRemark = '${reData.remark}',OperatorApprovalTime = '${moment().format('YYYY-MM-DD HH:mm:ss')}' where ProjectId = '${reData.id}'`
    }else{
        str = `update Pub_approval_Workflow set YLCode = '${reData.ylCode}',CurrentNode = 3,ProjectStatus=1,EndTime='${moment().format('YYYY-MM-DD HH:mm:ss')}' where ProjectId = '${reData.id}'`
    }
    query_blog(str).then( (r) => { 
        Message.updateMessage('',reData.id).then( () => {
            if(reData.type==='Projector'){
                //发送消息
                Message.postMessage(reData.operatorId,reData.id)
            }else if(reData.type==='Operator'){
                //发送消息
                Message.postMessage(reData.projectorId,reData.id,0,'项目审批已完成,请及时填写宇龙编码')
            }
        })
       
        res.send({
            errorCode:100048
        })
    },error => {
        res.status(500).send({
            errorCode:100049
        })
    })
},

rejectApproval = (req,res) => {
    let projectId = req.body.projectId
    let status = req.body.status
    let str = ''
    if(status == 4){
        str = `update Pub_approval_Workflow set CurrentNode=-1,ProjectStatus=${status}, ProjectorApprovalTime = '${moment().format('YYYY-MM-DD HH:mm:ss')}' where ProjectId = '${projectId}'`
    }else{
        str = `update Pub_approval_Workflow set CurrentNode=-1,ProjectStatus=${status}, OperatorApprovalTime = '${moment().format('YYYY-MM-DD HH:mm:ss')}' where ProjectId = '${projectId}'`
    }
    query_blog(str).then( (r) => {
        res.send({
            errorCode:100050
        })
    },error => {
        res.status(500).send({
            errorCode:100051
        })
    })
},

notifyApproval = (req,res) => {
    let reData = req.query
    //发送消息
    Message.updateMessage('',reData.projectId).then( () => {
        Message.postMessage(reData.userId,reData.projectId,0,'您有一个待审批项目,请及时处理!').then( () => {
            res.send({
                errorCode:100052
            })
        })
        
    },error => {
        res.status(500).send({
            errorCode:100053
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
    rejectApproval,
    notifyApproval
}