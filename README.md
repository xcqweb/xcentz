# [系统使用介绍 Introduction](https://www.jugetaozi.com/react-admin-ssr/)

- 系统介绍(gitbook): https://www.jugetaozi.com/react-admin-ssr/

## 登录页面

![登录界面](https://github.com/xcqweb/xcentz/tree/master/remade/home.PNG)

## 主页面

![主界面](https://github.com/xcqweb/xcentz/tree/master/remade/home.png)

## client 浏览器端

- vue + iview + webpack + less + vue-cli3

## server 服务端

- express + express-router + mysql + ejs + redis 模板引擎

## start 启动方式

```
npm i  //安装依赖  如果没有翻墙设置代理 网速比较慢的情况下一直未安装成功 需要换cnpm淘宝镜像源

alias cnpm="npm --registry=https://registry.npm.taobao.org \
--cache=$HOME/.npm/.cache/cnpm \
--disturl=https://npm.taobao.org/dist \
--userconfig=$HOME/.cnpmrc"

cnpm i //执行完上面的语句后  从淘宝镜像下载依赖.

npm run dev //启动服务侧 客户侧 打开浏览器

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
|___vue.config
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
│  ├─database
│  │
│  ├─middleware
│  │
│  ├─nginx
│  │
│  ├─routes
│  │
│  ├─upload
│  │
│  ├─common
│  │
│  └─views
│
└─src //前端react+antd项目目录
    │
    │
    ├─assets-------------¬
    │                    |
    ├─components         |___api
    │                    |___js
    ├─router             |___images
    │                    |___styles
    ├─views
    │
    ├─pages
    │
    |_router
