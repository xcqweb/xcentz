var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');
var userCenterRouter = require('./routes/userCenter');
var jwtAuth = require('./middleware/jwtAuth');
var session = require("express-session");
var history = require('connect-history-api-fallback'); 
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(history({index: 'index.html'}));  
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));

/* 创建session中间件 */
app.use(session({
  name:'xcentz',       //..这里的name指的是cookie的name，默认cookie的name是：connect.sid
  secret:'sdso7sash734u347dd34',   //  加密key 可以随意书写
  cookie:{maxAge:2*60*60*1000},   //  两次请求的时间差，即超过这个时间再去访问session会失效
  resave:true,
  saveUninitialized:false
}))

app.use(jwtAuth);

// app.use('/',function(req, res, next) {
//   console.log(req.path)
//   let path = req.path
//   let unLessPath = [
//     "/api/xcentz/v1/users/login", 
//     "/api/xcentz/v1/users/register",
//     "/api/xcentz/v1/users/getCode",
//     "/api/xcentz/v1/users/getEmailCode",
//     "/api/xcentz/v1/users/checkUser",
//     "/api/xcentz/v1/users/checkCode",
//     "/api/xcentz/v1/users/checkEmailCode",
// ]
//   if(unLessPath.includes(path)){
//     res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
//     res.append('Cache-Control', 'no-cache');
//     next();
//   }else{
//     if(req.session['token']){
//       next();
//     }else{
//       next(createError(401));
//     }
//   }
// });



app.use('/api/xcentz/v1/users', usersRouter);
app.use('/api/xcentz/v1/upload', uploadRouter);
app.use('/api/xcentz/v1/userCenter', userCenterRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}).listen(8081,()=>{
  console.log('server is on 8081 .......')
});

module.exports = app;
