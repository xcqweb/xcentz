let express = require('express'),
    router = express.Router(),
    constroller = require('../constrollers/project');





//查询用户信息
router.get('/queryProject',constroller.queryProject)
      .post('/addProject',constroller.addProject)















module.exports = router