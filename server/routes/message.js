let express = require('express'),
    router = express.Router(),
    constroller = require('../constrollers/message');





        
router.get('/msg',constroller.queryMsg)//查询未读消息
      .put('/msg',constroller.readMsg)//查询未读消息
      





      

module.exports = router