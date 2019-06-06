let express = require('express'),
    router = express.Router(),
    constroller = require('../constrollers/project');





        
router.get('/queryProject',constroller.queryProject)//查询项目信息
      .post('/addProject',constroller.addProject)//新增项目
      .get('/queryRoleUser',constroller.queryRoleUser)//存续角色用户















module.exports = router