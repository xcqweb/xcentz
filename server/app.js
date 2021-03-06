let createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),//日志模块
    app = express(),
    usersRouter = require('./routes/users'),
    uploadRouter = require('./routes/upload'),
    userCenterRouter = require('./routes/userCenter'),
    projectRouter = require('./routes/project'),
    msgRouter = require('./routes/message'),
    jwtAuth = require('./middleware/jwtAuth'),//权限认证
    session = require("express-session"),//session
    history = require('connect-history-api-fallback'),//404 
    compression = require('compression'), //gzip压缩模块
    {query} = require('./database'),//数据库
    {isNull} = require('./common/untl'),
    RedisStore = require('connect-redis')(session), //redis
    fs = require('fs'),
    Redis = require('redis'),
    schedule = require('./common/scheduleTask'),
    spdy = require('spdy');

    global.redis = Redis.createClient()

    redis.on('error', function (err) {
        console.log('Error :', err)
    })

    redis.on('connect', function () {
        console.log('Redis连接成功.')
    })
   
app.set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')

    .use(history({
      rewrites: [
        {
            from: /^\/api\/.*$/, //api/路劲下的按路由方式走 无需404
            to: function(context) {
                return context.parsedUrl.pathname;
            }
        },
      ]
    }))
    .use(logger('dev'))
    // app.use(logger('combined'));//日志
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(cookieParser())
    .use(express.static(path.join(__dirname, '../dist')))
    .use(compression())
    /* 创建session中间件 */
    .use(session({
        name:'xcentz',       //..这里的name指的是cookie的name，默认cookie的name是：connect.sid
        secret:'sdso7sash734u347dd34',   //  加密key 可以随意书写
        cookie:{maxAge:60*60*1000},   //  两次请求的时间差，即超过这个时间再去访问session会失效
        httpOnly: true,
        resave:true,
        saveUninitialized:true,
        store: new RedisStore({host:'localhost',port:6379,maxAge : 60*60*1000}) //redis解决多进程session不能共享的问题
    }))

    .use(jwtAuth)

    .use('/',function(req, res, next) {
        let path = req.path
        let unLessPath = [
            "/api/xcentz/v1/users/login", 
            "/api/xcentz/v1/users/register",
            "/api/xcentz/v1/users/getCode",
            "/api/xcentz/v1/users/getEmailCode",
            "/api/xcentz/v1/users/checkUser",
            "/api/xcentz/v1/users/checkCode",
            "/api/xcentz/v1/users/checkEmailCode",
        ]
        if(unLessPath.includes(path)){//无需权限认证路径
            next();
        }else{//验证同一时间,不同地点一个账号只允许登录一次 新登录会挤掉上一次登录
            let token = req.headers.authorization ? req.headers.authorization.split('__')[1] : req.query.token
            redis.exists('userList',(err,result) => {
                if(result){
                    redis.get('userList',(err,result) => {
                        let users = JSON.parse(result)
                        let r = users.find( (item) => {
                            return item.Token === token
                        })
                        if(r){
                            next();
                        }else{
                            next(createError(401));
                        }
                    })
                }else{
                    query(`SELECT Token FROM Pub_User WHERE Token='${token}'`).then( (r) => {
                        if(r.length){
                            next();
                        }else{
                            next(createError(401));
                        }
                    })
                }
            })
        }
    })

    .use('/api/xcentz/v1/users', usersRouter)
    .use('/api/xcentz/v1/upload', uploadRouter)
    .use('/api/xcentz/v1/userCenter', userCenterRouter)
    .use('/api/xcentz/v1/project', projectRouter)
    .use('/api/xcentz/v1/systemMsg', msgRouter)

    .use(function(req, res, next) {
        next(createError(404));
    })

    .use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        res.status(err.status || 500);
        res.render('error');
    });
    //http2.0
    var options = {
        key: fs.readFileSync(__dirname + '/keys/server.key'),
        cert: fs.readFileSync(__dirname + '/keys/server.crt'),
        spdy: {
            protocals: ['h2', 'spdy/3.1', 'http1.1'],
            plain: false,
            'x-forwarded-for': true,
            connection: {
                windowSize: 1024*1024,
                autoSpdy31: false
            }
        }
    };

    var server =  spdy.createServer(options, app);

    server.listen(8081,()=>{
        console.log('server is on 8081 .......')
    });

    schedule()//初始化定时任务

module.exports = app;
