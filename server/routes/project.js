let express = require('express'),
    router = express.Router(),
    constroller = require('../constrollers/project');





        
router.get('/queryProject',constroller.queryProject)//查询项目信息
      .post('/addProject',constroller.addProject)//新增项目
      .get('/queryRoleUser',constroller.queryRoleUser)//查询角色用户 By RoleId
      .get('/queryUserById',constroller.queryUserById)//查询角色用户 By UserId
      .put('/editProject',constroller.editProject)// 编辑项目
      .put('/approvalProject',constroller.approvalProject)// 审批项目
      .put('/rejectApproval',constroller.rejectApproval)// 审批不通过
      .get('/notifyApproval',constroller.notifyApproval)// 审批不通过
      .get('/validateName',constroller.validateName)// 校验项目名称


      
      

      

module.exports = router