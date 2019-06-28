# 系统介绍
    1. 系统使用菜单和模块权限动态配置,用户注册账号成功,管理员会给用户分配一个,角色有相对应菜单权限和模块全限;
    2. 登录模块采用token和验证码的方式 ,用户通过账号密码和随机图片验证码的方式进行;
    3. 登录成功后每次带上token进行数据请求,token有效期暂定一小时,可以有效方式crsf,其中每个账户在同一时间任何地点只能有一个账号在线,后者登录会覆盖前者的登录;
    4. 项目采用http2.0 基于https 提高请求速度和安全性;
    5. 后台采用pm2 进行进程管理 和nginx代理服务器;
    6. 采用redis和mysql结合的方式提高查询效率;
    7. 可以时间邮件的发送功能;
    8. 采用session和redis解决多台服务器session不共享的问题,多进程连接多条数据库;

## 登录页面

![登录界面](https://raw.githubusercontent.com/xcqweb/xcentz/master/remade/login.PNG)

## 主页面

![主界面](https://raw.githubusercontent.com/xcqweb/xcentz/master/remade/home.PNG)

## 其他页面

![其他页面](https://raw.githubusercontent.com/xcqweb/xcentz/master/remade/03.PNG)
![其他页面](https://raw.githubusercontent.com/xcqweb/xcentz/master/remade/04.PNG)
![其他页面](https://raw.githubusercontent.com/xcqweb/xcentz/master/remade/05.PNG)
![其他页面](https://raw.githubusercontent.com/xcqweb/xcentz/master/remade/06.PNG)
![其他页面](https://raw.githubusercontent.com/xcqweb/xcentz/master/remade/07.PNG)
![其他页面](https://raw.githubusercontent.com/xcqweb/xcentz/master/remade/08.PNG)
![其他页面](https://raw.githubusercontent.com/xcqweb/xcentz/master/remade/09.PNG)

## client 浏览器端

- vue + iview + webpack + less + vue-cli3 + axios

## server 服务端

- express + express-router + mysql + ejs + redis + pm2 + nginx + http2.0

## start 运行方式

- 启动 pm2 start server.js 或 pm2 start server.js -i max (详细参见pm2文档)
- 重启 pm2 restart all 或 pm2 restart id(进程id) 
- 杀死进程 delete all 或 delete id(进程id)
- 查看进程运行参数 pm2 monit
- 查看日志 pm2 logs

## [redis window 下载地址](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2FMSOpenTech%2Fredis%2Freleases%2Fdownload%2Fwin-3.2.100%2FRedis-x64-3.2.100.msi)

```
npm i  //安装依赖  如果没有翻墙设置代理 网速比较慢的情况下一直未安装成功 需要换cnpm淘宝镜像源

alias cnpm="npm --registry=https://registry.npm.taobao.org \
--cache=$HOME/.npm/.cache/cnpm \
--disturl=https://npm.taobao.org/dist \
--userconfig=$HOME/.cnpmrc"

cnpm i //执行完上面的语句后  从淘宝镜像下载依赖.


open in http://localhost:8008/


目录结构:
│  .gitignore
│  .tgitconfig
│  babel.config.js
│  copy.js //拷贝文件或目录方法
│  deploy.yaml //pm2部署文件
│  package-lock.json
│  package.json
│  README.md
│  vue.config.js //vue-cli3 配置文件
│
├─dist //打包上线项目文件
├─public
├─remade //markdown images
├─server //服务端目录
│  │  app.js //主入口文件1
│  │  app2.js //主入口文件2
│  │  auto.js //node 并发测试
│  │  babelrc
│  │  package-lock.json
│  │  package.json
│  │  server.js //入口文件支持同时进行多个主入口文件运行
│  │
│  ├─common //工具库
│  ├─constrollers //接口数据库操作
│  ├─database //数据库操作
│  ├─keys //https 证书
│  ├─middleware //中间件
│  ├─nginx //nginx 代理服务器
│  ├─routes //路由
│  ├─upload //上传文件目录
│  └─views //视图模板
├─src //前端主目录
│  │  App.vue
│  │  env.js //环境参数
│  │  main.js
│  │
│  ├─assets //主资源库
│  │  ├─api //接口文件
│  │  ├─images //图片
│  │  ├─js // js工具库
│  │  └─styles //样式表
│  ├─components //组件库
│  ├─router //路由
│  │  │  index.js //主路由
│  │  │
│  │  └─modules // 模块权限路由(根据后台返回的菜单动态生成路由)
│  │          authRoute.js
│  │
│  └─views //视图
│      ├─errorPage //错误页面(401,404)
│      ├─home //主页(包括系统设置,用户中心)
│      ├─layout //前端路由渲染模板
│      └─user //用户登录注册页面
└─static //静态资源库





