var express = require('express');
var router = express.Router();
// var jwtAuth = require('../middleware/jwtAuth')

// router.use(jwtAuth);
// 路由中间件
router.use((req, res, next) => {

  // 任何路由信息都会执行这里面的语句
  console.log(req.path);
  // 把它交给下一个中间件，注意中间件的注册顺序是按序执行
  next();
});



module.exports = router;
