// jwt.js,token中间件
let expressJwt = require("express-jwt"),
    {secretOrPrivateKey} = require('../database/config'),
    // express-jwt中间件帮我们自动做了token的验证以及错误处理，所以一般情况下我们按照格式书写就没问题，其中unless放的就是你想要不检验token的api。
    jwtAuth = expressJwt({
        secret: secretOrPrivateKey,
        getToken: function fromHeaderOrQuerystring (req) {
            if (req.headers.authorization && req.headers.authorization.split('__')[0] === 'Bearer') {
                return req.headers.authorization.split('__')[1];
            } else if (req.query && req.query.token) {
              return req.query.token;
            }
            return null;
          }
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

