let {query} = require('../database'),
    jwt = require('jsonwebtoken'),  //用来生成token
    captchapng = require('captchapng'),//生成图片
    {secretOrPrivateKey} = require('../database/config'),
    nodemailer = require('nodemailer'),//邮件发送模块
    stringRandom = require('string-random'),//生成随机字符串
    CryptoJS = require("crypto-js"),//加密库
    uuid = require('node-uuid'), //生成唯一id
    {buildTree,isNull,clearRedis,updateUserList} = require('../common/untl'),
    moment = require('moment'),//时间工具函数

    login = (req,res) => {
        let username = req.body.username,
            password = req.body.password,
            verifyCode = req.session['captcha'],
            nowDate = +new Date();
        console.log(username,password,verifyCode)
        if(parseInt(req.body.code)!==verifyCode){
            res.status(500).send({
                message:'验证码错误！',
                errorCode:'10000'
            })
        }else{
          redis.exists('userList',  (err, resdata) => {
            if(resdata){
                redis.get('userList',  (err, result) => {
                    let users = JSON.parse(result)
                    let index
                    let r = users.find( (item,i) => {
                        if(((item.UserName === username) || (item.Email === username) ) && item.PassWord === password){
                            index = i
                        }
                        return (item.UserName === username || item.Email === username ) && item.PassWord === password
                    })
                    if(!r){
                        res.status(500).json({
                            message:'用户名或密码错误！',
                            errorCode:10001
                        })
                    }else{
                        
                        console.log('========================redis')
                        // 这是加密的key（密钥) 
                        let token = jwt.sign({username:username,password:password,now:nowDate}, secretOrPrivateKey, {
                            expiresIn: '1h', // 2小时过期
                            
                        });
                        
                        users[index].LoatLoginTime = moment().format('YYYY-MM-DD HH:mm:ss')
                        users[index].Token = token
                        redis.set('userList',JSON.stringify(users))
                        delete r.PassWord
                        delete r.Token
                        //更新登录时间
                        query(`update Pub_User set LoatLoginTime='${ moment().format('YYYY-MM-DD HH:mm:ss')}',Token='${token}' WHERE (UserName='${username}' OR Email='${username}')`)
                        res.status(200).json({
                            message:'登录成功！',
                            token:token,
                            user:r,
                            errorCode:10005
                        }) 
                    }
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
                    console.log('========================')
                    // 这是加密的key（密钥) 
                    let token = jwt.sign({username:username,password:password,now:nowDate}, secretOrPrivateKey, {
                        expiresIn: '1h', // 2小时过期
                        
                    });
                    console.log(token)
                    //更新登录时间
                    query(`update Pub_User set LoatLoginTime='${ moment().format('YYYY-MM-DD HH:mm:ss')}',Token='${token}' WHERE (UserName='${username}' OR Email='${username}')`)
                    query('select * from Pub_User').then( (r) => {
                        redis.set('userList',JSON.stringify(r))
                    })
                        res.status(200).json({
                            message:'登录成功！',
                            token:token,
                            user:re,
                            errorCode:10005
                        })
                    }
                },error => {
                    console.log(error && error.code)// === 'PROTOCOL_SEQUENCE_TIMEOUT',
                    res.status(500).send({
                        errorCode:100043
                    })
                })
            }
          })
            
        }
    },
    resetPassword = (req,res) => {
        let userId = req.query.userId
        let toEmail = req.query.email
        let newPsw = stringRandom()
        query(`UPDATE Pub_User SET PassWord = '${newPsw}',Token='' WHERE UserId ='${userId}'`).then( (r) => {
            let transporter = nodemailer.createTransport({
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
        
            let mailOptions = {
                from: 'xuchangqian@yulong.com', // 发件地址
                to: toEmail, // 收件列表
                subject: 'xcentz 运营管理系统重置密码', // 标题
                //text和html两者只支持一种
                text: `${toEmail} 用户的新密码为：${newPsw}`, // 标题
                html: `<b>${toEmail} 用户的新密码为：<em style='font-weight:100;text-decoration:underline;'>${newPsw} <br />
                    <p style='text-align:right;font-size:12px;'>xcentz</p>
                    <p style='text-align:right;font-size:12px;'>${moment().format('YYYY-MM-DD HH:mm:ss')}</p>
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
                    updateUserList()
                        res.send({
                            errorCode:100037,
                            message:"重置密码成功!"
                        })
                    }
            });
        },error =>{
      
        })
    },
    loginOut = (req,res) => {
        req.session['token'] = ''
        res.send({
            isLogin:true
        })
    },
    checkUser = (req,res) => {
        let username = req.query.username
        query(`SELECT * FROM Pub_User WHERE (UserName='${username}' OR Email='${username}')`).then( (r) => {
            res.json({
                user:r
            })
        })
    },
    register = (req,res) => {
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
          query(`INSERT INTO Pub_User(UserId,UserName,Email,Cname,PassWord,RoleId,Phone,CreateTime) VALUES('${uuid.v1().replace(/\-/g,'')}','${reData.username}','${reData.email}','${reData.cname}','${reData.password}',21,${reData.phone},'${ moment().format('YYYY-MM-DD HH:mm:ss')}')`).then( (r) => {
            
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
                      <p style='text-align:right;font-size:12px;'>${moment().format('YYYY-MM-DD HH:mm:ss')}</p>
                ` // html 内容
            };
          
            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                  
                }else{
                    updateUserList()
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
    },
    checkAuth = (req,res) => {
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
    },
    getCode = (req,res) => {
        // console.log(req)
        // return
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


    },
    checkCode = (req,res) => {
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
    },
    getEmailCode = (req,res) => {
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
                    <p style='text-align:right;font-size:12px;'>${moment().format('YYYY-MM-DD HH:mm:ss')}</p>
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
    },
    checkEmailCode = (req,res) => {
        if(req.session['verifyEmail'].verifyEmailCode == req.query.code){
            res.json({
              valid:true
            })
          }else{
            res.json({
              valid:false
            })
          }
    },
    user_get = (req,res) => {
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
    },
    user_post = (req,res) => {
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
                    <p style='text-align:right;font-size:12px;'>${moment().format('YYYY-MM-DD HH:mm:ss')}</p>` // html 内容
          };
        
          // send mail with defined transport object
          transporter.sendMail(mailOptions, function(error, info){
              if(error){
                
              }else{
                updateUserList()
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
    },
    user_delete = (req,res) => {
        let userId = req.body.userId
        query(`DELETE FROM Pub_User WHERE UserId='${userId}'`).then( (r) => {
          updateUserList()//跟新redis缓存
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
    },
    menu_get = (req,res) => {
      let roleId = req.query.roleId
      let isAdmin = req.query.isAdmin
      let str = ''
          if(isAdmin){
            str = `SELECT Pub_Menu.MenuId as id ,1 as expand, MenuName as title,ParentId as parent_id,MenuIconUrl as icon,MenuUrl as route FROM Pub_Menu`
          }else{
            str = `SELECT Pub_Menu.MenuId as id ,1 as expand, MenuName as title,ParentId as parent_id,MenuIconUrl as icon,MenuUrl as route FROM Pub_Menu, Pub_Role_Menu WHERE Pub_Role_Menu.MenuId = Pub_Menu.MenuId AND Pub_Role_Menu.RoleId = ${roleId}`
          }
          query(str).then( (r) => {
              let trees = buildTree(r)
            query(`SELECT MAX(MenuId) as maxId FROM Pub_Menu`).then( (response) => {
              res.json({
                maxId:response[0].maxId,
                menuList:trees
              })
            })
          })
        
    },
    
    menu_post = (req,res) => {
        let reData = req.body
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
    },
    menu_put = (req,res) => {
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
    },
    menu_delete = (req,res) => {
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
    },
    menuAuth_get = (req,res) => {
        let roleId = req.query.roleId
        query(`SELECT Pub_Menu.MenuId as id ,1 as expand, MenuName as title,ParentId as parent_id,MenuIconUrl as icon,MenuUrl as route, t.checked FROM Pub_Menu LEFT JOIN (SELECT Pub_Role_Menu.RoleId AS checked, Pub_Role_Menu.MenuId FROM Pub_Role_Menu WHERE Pub_Role_Menu.RoleId = ${roleId}) AS t ON t.MenuId = Pub_Menu.MenuId`).then( (r) => {
            res.json({
                menuList:buildTree(r)
            })
        })
    },
    menuAuth_put = (req,res) => {
        let str = req.body.str
        let roleId = Number(req.body.roleId)
        query(`DELETE FROM Pub_Role_Menu WHERE RoleId = ${roleId}`).then( (r) => {
            if(!str){
                query(`UPDATE Pub_User SET Token='' WHERE RoleId=${roleId}`).then( () => {
                    res.json({
                        errorCode:100031,
                        message:'菜单权限配置成功!'
                    })
                })
            }else{
                query(` INSERT INTO Pub_Role_Menu(RoleId,MenuId) VALUES${str}`).then( () => {
                    query(`UPDATE Pub_User SET Token='' WHERE RoleId=${roleId}`).then( () => {
                        res.json({
                            errorCode:100031,
                            message:'菜单权限配置成功!'
                        })
                    })
                },error => {
                    res.status(500).json({
                        errorCode:100032,
                        message:'菜单权限配置失败!'
                    })
                })
            }
        })
    },
    role_get = (req,res) => {
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
    },
    role_post = (req,res) => {
        let reData = req.body
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
    },
    role_delete = (req,res) => {
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
    },
    role_put = (req,res) => {
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
    },
    assignRole = (req,res) => {
        let reData = req.body
        query(`UPDATE Pub_User SET RoleId=${reData.roleId},Token='' WHERE UserId='${reData.userId}'`).then( (r) => {
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
    },
    module_post = (req,res) => {
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
    },
    module_get = (req,res) => {
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
    },
    module_put = (req,res) => {
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
    },
    module_delete = (req,res) => {
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
    },
    authModule_get = (req,res) => {
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
    },
    authModule_put = (req,res) => {
      let str = req.body.str
      let roleId = Number(req.body.roleId)
      query(`DELETE FROM Pub_Role_Moudule WHERE RoleId = ${roleId}`).then( () => {
        if(!str){
          query(`UPDATE Pub_User SET Token='' WHERE RoleId=${roleId}`).then( () => {
            res.json({
              errorCode:100034,
              message:'模块权限配置成功!'
            })
          })
        }else{
          query(`INSERT INTO Pub_Role_Moudule(RoleId,ModuleId) VALUES${str}`).then( () => {
            query(`UPDATE Pub_User SET Token='' WHERE RoleId=${roleId}`).then( () => {
              res.json({
                errorCode:100034,
                message:'模块权限配置成功!'
              })
            })
            
          },error => {
            res.status(500).json({
              errorCode:100035,
              message:'模块权限配置失败!'
            })
          })
        }
      })
    };
    


























module.exports = {
    login,
    resetPassword,
    loginOut,
    checkUser,
    register,
    checkAuth,
    getCode,
    checkCode,
    getEmailCode,
    checkEmailCode,
    user_get,
    user_post,
    user_delete,
    menu_get,
    menu_post,
    menu_put,
    menu_delete,
    menuAuth_get,
    menuAuth_put,
    role_get,
    role_post,
    role_put,
    role_delete,
    module_get,
    module_post,
    module_put,
    module_delete,
    assignRole,
    authModule_get,
    authModule_put,
    
}