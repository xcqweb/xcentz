var express = require('express'),
    router = express.Router(),
    constroller = require('../constrollers/user');

    
router.post('/login', constroller.login)

      //重置密码
      .get('/resetPassword',constroller.resetPassword)

      //退出登录
      .get('/loginOut',constroller.loginOut)

      //校验用户
      .get('/checkUser',constroller.checkUser)

      //注册账号
      .post('/register', constroller.register)

      //
      .get('/checkAuth', constroller.checkAuth)

      //获取图片验证码
      .get('/getCode', constroller.getCode)
      
      .get('/checkCode', constroller.checkCode)

      //获取邮箱验证码
      .get('/getEmailCode', constroller.getEmailCode)

      //校验邮箱验证码
      .get('/checkEmailCode', constroller.checkEmailCode)

      //获取用户列表
      .get('/user',constroller.user_get)

      //新增用户
      .post('/user',constroller.user_post)

      //删除用户
      .delete('/user',constroller.user_delete)


      //查询菜单
      .get('/menu',constroller.menu_get)

      //查询权限菜单
      .get('/menuAuth',constroller.menuAuth_get)

      //配置权限菜单
      .put('/menuAuth',constroller.menuAuth_put)


      //新增菜单
      .post('/menu',constroller.menu_post)

      //删除菜单
      .delete('/menu',constroller.menu_delete)


      //修改菜单
      .put('/menu',constroller.menu_put)

      //获取角色列表
      .get('/role',constroller.role_get)

      //新增角色
      .post('/role',constroller.role_post)

      //编辑角色
      .put('/role',constroller.role_put)

      //删除角色
      .delete('/role',constroller.role_delete)

      //分配角色
      .put('/assignRole',constroller.assignRole)


      //新增模块
      .post('/module',constroller.module_post)

      //查询模块
      .get('/module',constroller.module_get)

      //编辑模块
      .put('/module',constroller.module_put)

      //删除模块
      .delete('/module',constroller.module_delete)

      // 权限模块查询
      .get('/authModule',constroller.authModule_get)

      //权限模块配置
      .put('/authModule',constroller.authModule_put)








  module.exports = router;

