# 系统介绍
    1. 系统使用菜单和模块权限动态配置,用户注册账号成功,管理员会给用户分配一个,角色有相对应菜单权限和模块全限;
    2. 登录模块采用token和验证码的方式 ,用户通过账号密码和随机图片验证码的方式进行;
    3. 登录成功后每次带上token进行数据请求,token有效期暂定一小时,可以有效方式crsf,其中每个账户在同一时间任何地点只能有一个账号在线,后者登录会覆盖前者的登录;
    4. 项目采用http2.0 基于https 提高请求速度和安全性;
    5. 后台采用pm2 进行进程管理 和nginx代理服务器;
    6. 采用redis和mysql结合的方式提高查询效率;
    7. 可以时间邮件的发送功能;
    8. 采用session和redis解决多台服务器session不共享的问题;

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

- 启动 pm2 start server.js 或 pm2 start server.js -i max 
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
│  .babelrc //babel配置
│  .gitignore
│  package-lock.json
│  package.json
│  README.md
│  copy.js //拷贝文件目录

│－static   //webpack前端静态资源打包输出目录
│
|── vue.config
│      
│
├─server  // node服务侧目录
│  │  app.js
│  │  app2.js
│  │  server.js //启动多个进程服务
│  │
│  ├─bin
│  │
│  ├─public 
│  │
│  ├─database //数据库
│  │
│  ├─middleware //中间件
│  │
|  ├─upload //文件上传目录
|  |
│  ├─nginx //代理服务器
│  │
│  ├─routes //路由接口
│  │
│  ├─common //工具库
|  |
|  ├─controllers 
│  │
│  └─views //视图模板
│
└─src //前端项目目录
    │
    │
    ├──────────────────────────────────────────assets
    │                                            |
    ├───components//组件库                        |───api
    │                                            |───js
    ├─router─────────|                           |───images
    │                |──module //权限路由         |───styles  
    │                |                               
    |                |──index  //基础路由             
    │
    └─views //视图





