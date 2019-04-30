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
    let email = req.body.email
      query(`SELECT * FROM Pub_User WHERE (UserName='${username}' OR Email='${username}') AND PassWord='${password}'`).then( (r) => {
        //console.log(r.length<1)
        if(r.length<=0){
          res.status(500).json({
            message:'用户名或密码错误！',
            errorCode:10001
          })
        }else{
          let re = r[0]
          delete re.PassWord
          
            // 这是加密的key（密钥) 
            let token = jwt.sign({username:username,password:password,now:nowDate}, secretOrPrivateKey, {
              expiresIn: 60*60*1  // 1小时过期
            });
            
            //更新登录时间
            //query(`update Pub_User set LoatLoginTime='${}' WHERE (UserName='${username}' OR Email='${username}')`)

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

//退出登录
router.get('/loginOut',function(req, res, next){
  let username = req.query.username
  
})

//查询用户
router.get('/checkUser',function(req, res, next){
  let username = req.query.username
  query(`SELECT * FROM Pub_User WHERE (UserName='${username}' OR Email='${username}')`).then( (r) => {
    console.log(r)
    // if(r.length>0){
    //   res.status(500).send({
    //     message:'用户名或邮箱已注册!'
    //   })
    // }else{
      res.json({
        user:r
      })
    // }
  })
  
})

//注册账号
router.post('/register', function(req, res, next) {
  console.log(req.session['verifyEmail'])
  let content ={name:req.body.username}; // 要生成token的主题信息
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
    res.status(200).json({
      message:'注册成功！',
      errorCode:100004
    })
  }
  
});

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

//获取邮箱验证码
router.get('/getEmailCode', function(req, res, next) {
  let toEmail = req.query.email
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
  console.log(req.session)
  // NB! No need to recreate the transporter object. You can use
  // the same transporter object for all e-mails

  // setup e-mail data with unicode symbols

  var mailOptions = {
      from: 'xuchangqian@yulong.com', // 发件地址
      to: toEmail, // 收件列表
      subject: 'xcentz 运营管理系统注册验证', // 标题
      //text和html两者只支持一种
      text: `xcentz 运营系统注册码：${verifyEmail} 一小时内有效`, // 标题
      html: `<b>xcentz 运营系统注册码：<em style='font-weight:100;text-decoration:underline;'>${verifyEmail}<em> 一小时内有效</b> <br />
            <p style='text-align:right;font-size:12px;'>xcentz</p>
            <p style='text-align:right;font-size:12px;'>${new Date().toLocaleDateString().replace(/\//g, "-") + " " + new Date().toTimeString().substr(0, 8)}</p>
      ` // html 内容
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      res.send({
        message:'验证码发送成功！',
        errorCode:10003
      })

  });
});


//获取用户列表
router.get('/userList',function(req,res,next){
  query(`SELECT
    Pub_User.UserId,
    Pub_User.UserName,
    Pub_User.Email,
    Pub_User.Cname,
    Pub_User.RoleId,
    Pub_User.Phone,
    Pub_User.CreateTime,
    Pub_User.LoatLoginTime
    FROM Pub_User`
    ).then( (r) => {
        // console.log(res)
        res.json({
          userLists:r
        })
  })
})


//查询菜单
router.get('/queryMenu',function(req,res,next){
  query(`SELECT
  Pub_Menu.MenuId as id,
  Pub_Menu.MenuName as title,
  Pub_Menu.ParentId as parent_id
  FROM
  Pub_Menu
  `).then( (r) => {
        res.json({
          menuList:buildTree(r)
        })
  })
})

//新增菜单
router.post('/addMenu',function(req,res,next){
  let reData = req.body
  // let MenuId = req.body.
  console.log(uuid.v1().replace(/\-/g,''))
  query(`INSERT INTO Pub_Menu(MenuId,MenuName,ParentId) VALUES(${uuid.v1()},'${reData.menuName}',${reData.parentId})`).then( (r) => {
      // console.log(getTree(r))
        
      res.json({
        errorCode:10008
      })
  }, error => {
    res.status(500).json({
      errorCode:10009
    })
  })
})

//删除菜单
router.post('/removeMenu',function(req,res,next){
  let ids = req.body.ids

  query(`DELETE FROM Pub_Menu WHERE ${ids}`).then( (r) => {
      res.json({
        errorCode:10006
      })
  }, error => {
    res.status(500).json({
      errorCode:10007
    })
  })
})

module.exports = router;

