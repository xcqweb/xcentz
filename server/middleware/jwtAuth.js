// jwt.js,token中间件
const expressJwt = require("express-jwt");
var {secretOrPrivateKey} = require('../database/config')
// express-jwt中间件帮我们自动做了token的验证以及错误处理，所以一般情况下我们按照格式书写就没问题，其中unless放的就是你想要不检验token的api。
const jwtAuth = expressJwt({
    secret: secretOrPrivateKey,
}).unless({path: [
    "/api/xcentz/v1/users/login", 
    "/api/xcentz/v1/users/register",
    "/api/xcentz/v1/users/getCode",
    "/api/xcentz/v1/users/getEmailCode",
    "/api/xcentz/v1/users/checkUser",
    "/api/xcentz/v1/users/checkCode",
    "/api/xcentz/v1/users/checkEmailCode",
]}); 




module.exports = jwtAuth;

