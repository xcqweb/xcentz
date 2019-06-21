let express = require('express'),
    router = express.Router(),
    constroller = require('../constrollers/userCenter');





//查询用户信息
router.get('/queryUser',constroller.queryUser)

        //用户修改密码
        .put('/editPassword',constroller.editPassword)

        //用户修改个人信息
        .put('/edituserInfo',constroller.edituserInfo)
        .post('/uploadAvatar',constroller.uploadAvatar)














module.exports = router