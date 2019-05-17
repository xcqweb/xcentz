let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');  //用来生成token
let session = require('express-session');//回话模块
let captchapng = require('captchapng');//生成图片
const {secretOrPrivateKey} = require('../database/config');
let nodemailer = require('nodemailer');//邮件发送模块
const stringRandom = require('string-random');//生成随机字符串
const {query} = require('../database');
let CryptoJS = require("crypto-js");//加密库
let uuid = require('node-uuid'); //生成唯一id
let {buildTree} = require('../common/untl')
let moment = require('moment')

router.post('/login', function(req, res, next) {
    let username = req.body.username
    let password = req.body.password
    let verifyCode = req.session['captcha']
    let nowDate = +new Date()

    if(parseInt(req.body.code)!==verifyCode){
      res.status(500).send({
        message:'验证码错误！',
        errorCode:'10000'
      })
    }else{
      query(`SELECT * FROM Pub_User WHERE (UserName='${username}' OR Email='${username}') AND PassWord='${password}'`).then( (r) => {
        if(r.length<=0){
          res.status(500).json({
            message:'用户名或密码错误！',
            errorCode:10001
          })
        }else{
          let re = r[0]
          delete re.PassWord
          delete re.Token
            // 这是加密的key（密钥) 
            let token = jwt.sign({username:username,password:password,now:nowDate}, secretOrPrivateKey, {
              expiresIn: 60*60*2  // 2小时过期
            });
            //更新登录时间
            query(`update Pub_User set LoatLoginTime='${ moment().format('YYYY-MM-DD HH:mm:ss')}',Token='${token}' WHERE (UserName='${username}' OR Email='${username}')`)

            res.status(200).json({
              message:'登录成功！',
              token:token,
              user:re,
              errorCode:10005
            })
          }
      })
    }
});

//重置密码
router.get('/resetPassword',function(req, res, next){
  let userId = req.query.userId
  let toEmail = req.query.email
  let newPsw = stringRandom()
  query(`UPDATE Pub_User SET PassWord = '${newPsw}' WHERE UserId ='${userId}'`).then( (r) => {
    var transporter = nodemailer.createTransport({
      //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
      host: 'smtp.exmail.qq.com',
      port: 465, // SMTP 端口
      secure: true,
      auth: {
          user: 'xuchangqian@yulong.com',
          //这里密码不是qq密码，是你设置的smtp密码
          pass: 'Xcq123456'
      }
    });
  
    var mailOptions = {
        from: 'xuchangqian@yulong.com', // 发件地址
        to: toEmail, // 收件列表
        subject: 'xcentz 运营管理系统重置密码', // 标题
        //text和html两者只支持一种
        text: `${toEmail} 用户的新密码为：${newPsw}`, // 标题
        html: `<b>${toEmail} 用户的新密码为：<em style='font-weight:100;text-decoration:underline;'>${newPsw} <br />
              <p style='text-align:right;font-size:12px;'>xcentz</p>
              <p style='text-align:right;font-size:12px;'>${new Date().toLocaleDateString().replace(/\//g, "-") + " " + new Date().toTimeString().substr(0, 8)}</p>
        ` // html 内容
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
          res.send({
            errorCode:100036,
            message:"重置密码失败!"
          })
        }else{
          res.send({
            errorCode:100037,
            message:"重置密码成功!"
          })
        }
    });
  },error =>{

  })
})

//退出登录
router.get('/loginOut',function(req, res, next){
  req.session['token'] = ''
  res.send({
    isLogin:true
  })
})

//校验用户
router.get('/checkUser',function(req, res, next){
  let username = req.query.username
  query(`SELECT * FROM Pub_User WHERE (UserName='${username}' OR Email='${username}')`).then( (r) => {
      res.json({
        user:r
      })
  })
})

//注册账号
router.post('/register', function(req, res, next) {
  let reData = req.body
  if(req.body.code != req.session['verifyEmail'].verifyEmailCode){
    res.status(500).json({
      message:'验证码错误！',
      errorCode:'10000'
    })
  }else if(+new Date() - req.session['verifyEmail'].expires>60*60*1000){
    res.status(500).json({
      message:'验证码过期！',
      errorCode:'10002'
    })
  }else{
    query(`INSERT INTO Pub_User(UserId,UserName,Email,Cname,PassWord,RoleId,Phone,CreateTime) VALUES('${uuid.v1().replace(/\-/g,'')}','${reData.username}','${reData.email}','${reData.cname}','${reData.password}',0,${reData.phone},'${ moment().format('YYYY-MM-DD HH:mm:ss')}')`).then( (r) => {
      
      var transporter = nodemailer.createTransport({
        //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
        host: 'smtp.exmail.qq.com',
        port: 465, // SMTP 端口
        secure: true,
        auth: {
            user: 'xuchangqian@yulong.com',
            //这里密码不是qq密码，是你设置的smtp密码
            // pass: 'fuyatraecdgxbhih'
            pass: 'Xcq123456'
        }
      });
    
      var mailOptions = {
          from: 'xuchangqian@yulong.com', // 发件地址
          to: reData.email, // 收件列表
          subject: 'xcentz 运营管理系统账号注册', // 标题
          //text和html两者只支持一种
          text: `xcentz运营管理系统账号注册`, // 标题
          html: `<b>感谢注册xcentz运营管理系统! 新用户的<em style='font-weight:100;text-decoration:underline;'>账号:${reData.username}或${reData.email} 密码:${reData.password}</em> <br />
                <p style='text-align:right;font-size:12px;'>xcentz</p>
                <p style='text-align:right;font-size:12px;'>${new Date().toLocaleDateString().replace(/\//g, "-") + " " + new Date().toTimeString().substr(0, 8)}</p>
          ` // html 内容
      };
    
      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info){
          if(error){
            
          }else{
            res.status(200).json({
              message:'新增用户成功！',
              errorCode:10004
            })
          }
      });
    },error => {
      res.status(500).json({
        message:'新增用户失败！',
        errorCode:100012
      })
    })
  }
});


//
router.get('/checkAuth', function(req, res, next) {  
  let userId = req.query.userId
  let data = {
    m1:1, //图表1
    m2:0, //表格1
    m3:1 //图表2
  }
  var bytes  = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();
    res.json({
      data:bytes
    })
});

//获取图片验证码
router.get('/getCode', function(req, res, next) {

  var randomNum = parseInt(Math.random()*9000+1000)
  req.session['captcha'] =  randomNum; 
  //保存到cookie 方便前端调用验证
  // res.cookie('captcha', req.session); 
  var p = new captchapng(80,20,randomNum); // width,height,numeric captcha
  p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
  p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
  var img = p.getBase64();
  var imgbase64 = new Buffer(img,'base64');
  res.send(imgbase64)
});


//校验图片验证码
router.get('/checkCode', function(req, res, next) {
  // console.log(req.session['captcha'],req.query.code)
  if(req.session['captcha'] == req.query.code){
    res.json({
      valid:true
    })
  }else{
    res.json({
      valid:false
    })
  }
});

//获取邮箱验证码
router.get('/getEmailCode', function(req, res, next) {
  let toEmail = req.query.email
  let type = req.query.type
  var transporter = nodemailer.createTransport({
    //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    host: 'smtp.exmail.qq.com',
    port: 465, // SMTP 端口
    secure: true,
    auth: {
        user: 'xuchangqian@yulong.com',
        //这里密码不是qq密码，是你设置的smtp密码
        // pass: 'fuyatraecdgxbhih'
        pass: 'Xcq123456'
    }
  });
  let verifyEmail = stringRandom()
  
  req.session['verifyEmail'] =  {verifyEmailCode:verifyEmail,expires:+new Date()}; 
  // console.log(req.session)
  if(type==='edit'){
    var mailOptions = {
      from: 'xuchangqian@yulong.com', // 发件地址
      to: toEmail, // 收件列表
      subject: 'xcentz 运营管理系统验证码', // 标题
      //text和html两者只支持一种
      text: `xcentz 运营系统验证码：${verifyEmail} 一小时内有效`, // 标题
      html: `<b>xcentz 运营系统验证码：<em style='font-weight:100;text-decoration:underline;'>${verifyEmail}<em> 2小时内有效</b> <br />
            <p style='text-align:right;font-size:12px;'>xcentz</p>
            <p style='text-align:right;font-size:12px;'>${new Date().toLocaleDateString().replace(/\//g, "-") + " " + new Date().toTimeString().substr(0, 8)}</p>
      ` // html 内容
    };
  }else{
    var mailOptions = {
      from: 'xuchangqian@yulong.com', // 发件地址
      to: toEmail, // 收件列表
      subject: 'xcentz 运营管理系统注册验证', // 标题
      //text和html两者只支持一种
      text: `xcentz 运营系统注册码：${verifyEmail} 一小时内有效`, // 标题
      html: `<b>xcentz 运营系统注册码：<em style='font-weight:100;text-decoration:underline;'>${verifyEmail}<em> 2小时内有效</b> <br />
            <p style='text-align:right;font-size:12px;'>xcentz</p>
            <p style='text-align:right;font-size:12px;'>${new Date().toLocaleDateString().replace(/\//g, "-") + " " + new Date().toTimeString().substr(0, 8)}</p>
      ` // html 内容
    };
  }
  

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
        res.send({
          errorCode:100033,
          message:"验证码发送失败!"
        })
      }else{
        res.send({
          errorCode:10003,
          message:"验证码发送成功!"
        })
      }
  });
});

//校验邮箱验证码
router.get('/checkEmailCode', function(req, res, next) {
  if(req.session['verifyEmail'].verifyEmailCode == req.query.code){
    res.json({
      valid:true
    })
  }else{
    res.json({
      valid:false
    })
  }
});

//获取用户列表
router.get('/user',function(req,res,next){
  let key = req.query.key || ''
  let curPage = Number(req.query.currentPage) || 1
  let pageSize = Number(req.query.pageSize) || 15
  Promise.all([query(`SELECT
        Pub_User.UserId,
        Pub_User.UserName,
        Pub_User.Email,
        Pub_User.Cname,
        Pub_User.RoleId,
        Pub_User.Phone,
        Pub_Role.Directions,
        Pub_Role.RoleId,
        date_format(Pub_User.CreateTime, '%Y-%m-%d% %H:%i:%s') AS CreateTime,
        date_format(Pub_User.LoatLoginTime, '%Y-%m-%d% %H:%i:%s') AS LoatLoginTime
        FROM 
        Pub_Role,
        Pub_User
        WHERE Pub_Role.RoleId=Pub_User.RoleId AND CONCAT(Pub_User.UserName,Pub_User.Cname,Pub_User.Email,Pub_Role.Directions,Pub_User.Phone) LIKE '%${key}%'
        LIMIT ${(curPage-1)*pageSize},${pageSize}`),
        query('SELECT COUNT(*) AS total FROM Pub_User')]).then( (val) => {
        res.json({
          userList:val[0],
          total:val[1][0].total
        })
      })
})

//新增用户
router.post('/user',function(req,res,next){
  let reData = req.body
  query(`INSERT INTO Pub_User(UserId,UserName,Email,Cname,PassWord,RoleId,Phone,CreateTime) VALUES('${uuid.v1().replace(/\-/g,'')}','${reData.username}','${reData.email}','${reData.cname}','${reData.password}',${reData.role},${reData.phone},'${ moment().format('YYYY-MM-DD HH:mm:ss')}')`).then( (r) => {
   
    var transporter = nodemailer.createTransport({
      //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
      host: 'smtp.exmail.qq.com',
      port: 465, // SMTP 端口
      secure: true,
      auth: {
          user: 'xuchangqian@yulong.com',
          //这里密码不是qq密码，是你设置的smtp密码
          // pass: 'fuyatraecdgxbhih'
          pass: 'Xcq123456'
      }
    });
  
    var mailOptions = {
        from: 'xuchangqian@yulong.com', // 发件地址
        to: reData.email, // 收件列表
        subject: 'xcentz 运营管理系统账号注册', // 标题
        //text和html两者只支持一种
        text: `xcentz运营管理系统账号注册`, // 标题
        html: `<b>感谢注册xcentz运营管理系统! 新用户的账号:<em style='font-weight:100;text-decoration:underline;'>${reData.username}或${reData.email}</em> 密码:<em style='font-weight:100;text-decoration:underline;'>${reData.password}</em> <br />
              <p style='text-align:right;font-size:12px;'>xcentz</p>
              <p style='text-align:right;font-size:12px;'>${new Date().toLocaleDateString().replace(/\//g, "-") + " " + new Date().toTimeString().substr(0, 8)}</p>` // html 内容
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
          
        }else{
          res.send({
            errorCode:100019,
            message:'注册成功!'
          })
        }
    });
  },error =>{
    res.status(500).send({
      errorCode:100020
    })
  })
})

//删除用户
router.delete('/user',function(req,res,next){
  let userId = req.body.userId
  query(`DELETE FROM Pub_User WHERE UserId='${userId}'`).then( (r) => {
    res.send({
      errorCode:100023,
      message:'用户删除成功!'
    })
  },error =>{
    res.status(500).send({
      errorCode:100024,
      message:'用户删除失败!'
    })
  })
})


//查询菜单
router.get('/menu',function(req,res,next){
  let roleId = req.query.roleId
  let isAdmin = req.query.isAdmin
  let str = ''
  if(isAdmin){
    str = `SELECT Pub_Menu.MenuId as id ,1 as expand, MenuName as title,ParentId as parent_id,MenuIconUrl as icon,MenuUrl as route FROM Pub_Menu`
  }else{
    str = `SELECT Pub_Menu.MenuId as id ,1 as expand, MenuName as title,ParentId as parent_id,MenuIconUrl as icon,MenuUrl as route FROM Pub_Menu, Pub_Role_Menu WHERE Pub_Role_Menu.MenuId = Pub_Menu.MenuId AND Pub_Role_Menu.RoleId = ${roleId}`
  }
  query(str).then( (r) => {
    query(`SELECT MAX(MenuId) as maxId FROM Pub_Menu`).then( (response) => {
      res.json({
        maxId:response[0].maxId,
        menuList:buildTree(r)
      })
    })
  })
})

//查询权限菜单
router.get('/menuAuth',function(req,res,next){
  let roleId = req.query.roleId
  query(`SELECT Pub_Menu.MenuId as id ,1 as expand, MenuName as title,ParentId as parent_id,MenuIconUrl as icon,MenuUrl as route, t.checked FROM Pub_Menu LEFT JOIN (SELECT Pub_Role_Menu.RoleId AS checked, Pub_Role_Menu.MenuId FROM Pub_Role_Menu WHERE Pub_Role_Menu.RoleId = ${roleId}) AS t ON t.MenuId = Pub_Menu.MenuId`).then( (r) => {
      res.json({
        menuList:buildTree(r)
      })
  })
})

//配置权限菜单
router.put('/menuAuth',function(req,res,next){
  let str = req.body.str
  let roleId = Number(req.body.roleId)
  query(`DELETE FROM Pub_Role_Menu WHERE RoleId = ${roleId}`).then( (r) => {
    if(!str){
      res.json({
        errorCode:100031,
        message:'菜单权限配置成功!'
      })
    }else{
      query(` INSERT INTO Pub_Role_Menu(RoleId,MenuId) VALUES${str}`).then( () => {
        res.json({
          errorCode:100031,
          message:'菜单权限配置成功!'
        })
      },error => {
        res.status(500).json({
          errorCode:100032,
          message:'菜单权限配置失败!'
        })
      })
    }
  })
})


//新增菜单
router.post('/menu',function(req,res,next){
  let reData = req.body
  // let MenuId = req.body.
  // console.log(uuid.v1().replace(/\-/g,''))
  query(`INSERT INTO Pub_Menu(MenuId,MenuName,ParentId,MenuUrl,MenuIconUrl) VALUES(${reData.menuId},'${reData.menuName}',${reData.parentId},'${reData.route}','${reData.icon}')`).then( (r) => {
      res.json({
        errorCode:10008,
        message:'菜单添加成功!'
      })
  }, error => {
    res.status(500).json({
      errorCode:10009,
      message:'菜单添加失败!'
    })
  })
})

//删除菜单
router.delete('/menu',function(req,res,next){
  let ids = req.body.ids
  query(`DELETE t1,t2 FROM Pub_Menu AS t1 LEFT JOIN Pub_Role_Menu AS t2 ON t1.MenuId = t2.MenuId WHERE ${ids}`).then( (r) => {
      res.json({
        errorCode:10006,
        message:'菜单删除成功!',
      })
  }, error => {
    res.status(500).json({
      errorCode:10007,
      message:'菜单删除失败!',
    })
  })
})


//修改菜单
router.put('/menu',function(req,res,next){
  let reData = req.body

  query(`UPDATE Pub_Menu SET MenuName='${reData.menuName}',MenuUrl='${reData.route}',MenuIconUrl='${reData.icon}' WHERE MenuId = ${reData.id}`).then( (r) => {
      res.json({
        errorCode:100010,
        message:'菜单修改成功!'
      })
  }, error => {
    res.status(500).json({
      errorCode:100011,
      message:'菜单修改失败!'
    })
  })
})

//获取角色列表
router.get('/role',function(req,res,next){
  let key = req.query.key || ''
  let curPage = Number(req.query.currentPage) || 1
  let pageSize = Number(req.query.pageSize) || 10000000
  Promise.all([query(`SELECT * FROM Pub_Role WHERE CONCAT(RoleName,Directions) LIKE '%${key}%'
  LIMIT ${(curPage-1)*pageSize},${pageSize}`),
  query('SELECT COUNT(*) AS total FROM Pub_Role')]).then( (val) => {
    res.json({
      roleList:val[0],
      total:val[1][0].total
    })
  })
})

//新增角色
router.post('/role',function(req,res,next){
  let reData = req.body
  // console.log(reData)
  query(`INSERT INTO Pub_Role(RoleName,Directions) VALUES('${reData.roleName}','${reData.direction}')`).then( (r) => {
    res.send({
      errorCode:100013,
      message:'角色添加成功!'
    })
  },error =>{
    res.status(500).send({
      errorCode:100014,
      message:'角色添加失败!'
    })
  })
})

//编辑角色
router.put('/role',function(req,res,next){
  let reData = req.body
  query(`UPDATE Pub_Role SET RoleName='${reData.roleName}',Directions='${reData.direction}' WHERE RoleId=${reData.id}`).then( (r) => {
    res.send({
      errorCode:100015,
      message:'角色更新成功!'
    })
  },error =>{
    res.status(500).send({
      errorCode:100016,
      message:'角色更新失败!'
    })
  })
})

//删除角色
router.delete('/role',function(req,res,next){
  let reData = req.body
  //三联表删除
  query(`DELETE t1,t2,t3 FROM Pub_Role AS t1 LEFT JOIN Pub_Role_Menu AS t2 ON t1.RoleId = t2.RoleId LEFT JOIN Pub_Role_Moudule AS t3 ON t1.RoleId  = t3.RoleId WHERE t1.RoleId = ${reData.id}`).then( (r) => {
    res.send({
      errorCode:100017,
      message:'角色删除成功!'
    })
  },error =>{
    res.status(500).send({
      errorCode:100018,
      message:'角色删除失败!'
    })
  })
})

//分配角色
router.put('/assignRole',function(req,res,next){
  let reData = req.body
  query(`UPDATE Pub_User SET RoleId=${reData.roleId} WHERE UserId='${reData.userId}'`).then( (r) => {
    res.send({
      errorCode:100021,
      message:'角色分配成功!'
    })
  },error =>{
    res.status(500).send({
      errorCode:100022,
      message:'角色分配失败!'
    })
  })
})


//新增模块
router.post('/module',function(req,res,next){
  let reData = req.body
  query(`INSERT INTO Pub_Module(ModuleName,Directions) VALUES('${reData.moduleName}','${reData.direction}')`).then( (r) => {
    res.send({
      errorCode:100025,
      message:'新增模块成功!'
    })
  },error =>{
    res.status(500).send({
      errorCode:100026,
      message:'新增模块失败!'
    })
  })
})

//查询模块
router.get('/module',function(req,res,next){
  let key = req.query.key || ''
  let curPage = Number(req.query.currentPage) || 1
  let pageSize = Number(req.query.pageSize) || 10000000
  Promise.all([query(`SELECT * FROM Pub_Module WHERE CONCAT(ModuleName,Directions) LIKE '%${key}%'
  LIMIT ${(curPage-1)*pageSize},${pageSize}`),
  query('SELECT COUNT(*) AS total FROM Pub_Module')]).then( (val) => {
    res.json({
      moduleList:val[0],
      total:val[1][0].total
    })
  })
})

//编辑模块
router.put('/module',function(req,res,next){
  let reData = req.body
  query(`UPDATE Pub_Module SET ModuleName='${reData.moduleName}',Directions='${reData.direction}' WHERE ModuleId=${reData.id}`).then( (r) => {
    res.send({
      errorCode:100027,
      message:'编辑模块成功!'
    })
  },error =>{
    res.status(500).send({
      errorCode:100028,
      message:'编辑模块失败!'
    })
  })
})

//删除模块
router.delete('/module',function(req,res,next){
  let reData = req.body
  //连表删除
  query(`DELETE t1,t2 FROM Pub_Module AS t1 LEFT JOIN Pub_Role_Moudule AS t2 ON t1.ModuleId = t2.ModuleId WHERE t1.ModuleId = ${reData.id} `).then( (r) => {
    res.send({
      errorCode:100029,
      message:'删除模块成功!'
    })
  },error =>{
    res.status(500).send({
      errorCode:100030,
      message:'删除模块失败!'
    })
  })
})

// 权限模块查询
router.get('/authModule',function(req,res,next){
  let roleId = req.query.roleId
  let isAdmin = req.query.isAdmin
  let str = ''
  if(isAdmin){
    str = `SELECT Pub_Module.ModuleId,Pub_Module.ModuleName,Pub_Module.Directions,t.selected FROM Pub_Module  LEFT JOIN (SELECT Pub_Role_Moudule.RoleId AS selected ,Pub_Role_Moudule.ModuleId FROM Pub_Role_Moudule WHERE Pub_Role_Moudule.RoleId = ${roleId}) AS t ON t.ModuleId =  Pub_Module.ModuleId`
  }else{
    str = `SELECT Pub_Module.ModuleId,Pub_Module.ModuleName,Pub_Module.Directions FROM Pub_Module ,Pub_Role_Moudule WHERE Pub_Role_Moudule.ModuleId =  Pub_Module.ModuleId AND Pub_Role_Moudule.RoleId = ${roleId}`
  }
  query(str).then( (r) => {
    res.send({
      muduleList:r
    })
  })
})

//权限模块配置
router.put('/authModule',function(req,res,next){
  let str = req.body.str
  let roleId = Number(req.body.roleId)
  query(`DELETE FROM Pub_Role_Moudule WHERE RoleId = ${roleId}`).then( () => {
    if(!str){
      res.json({
        errorCode:100034,
        message:'模块权限配置成功!'
      })
    }else{
      query(`INSERT INTO Pub_Role_Moudule(RoleId,ModuleId) VALUES${str}`).then( () => {
        res.json({
          errorCode:100034,
          message:'模块权限配置成功!'
        })
      },error => {
        res.status(500).json({
          errorCode:100035,
          message:'模块权限配置失败!'
        })
      })
    }
  })
})








module.exports = router;

