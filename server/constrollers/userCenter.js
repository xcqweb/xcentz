var {query} = require('../database'),

    queryUser =  (req,res) => {
        let userId = req.query.userId
        query(`SELECT Pub_User.UserId,
        Pub_User.UserName AS user,
        Pub_User.Email AS email,
        Pub_User.Cname AS cname,
        Pub_User.RoleId,
        Pub_User.Phone AS phone,
        Pub_Role.Directions AS role,
        Pub_Role.RoleId
        FROM 
        Pub_Role,
        Pub_User WHERE Pub_Role.RoleId=Pub_User.RoleId AND Pub_User.UserId='${userId}'`).then( (r) => {
            res.send({
                userInfo:r[0]
            })
        })
    },

    editPassword = (req,res) => {
        let user = JSON.parse(req.body.user)
        let userId = req.body.userId
        console.log(user.code,req.session['verifyEmail'].verifyEmailCode)
        if(req.session['verifyEmail'].verifyEmailCode === user.code){
            query(`SELECT PassWord FROM Pub_User WHERE UserId='${userId}'`).then( (re) => {
                if(user.old_password === re[0].PassWord){
                    query(`UPDATE Pub_User SET PassWord='${user.confirmPsw}' WHERE UserId='${userId}'`).then( (r) => {
                        res.send({
                            errorCode:100038
                        })
                    },error => {
                        res.status(500).send({
                            errorCode:100039
                        })
                    })
                }else{
                    res.status(500).send({
                        errorCode:100040
                    })
                }
            })
        }else{
            res.status(500).json({
                errorCode:10000
            })
        }
    },

    edituserInfo = (req,res) => {
        let user = req.body
        query(`UPDATE Pub_User SET Phone='${user.phone}',Cname='${user.cname}' WHERE UserId='${user.userId}'`).then( (r) => {
            res.send({
                errorCode:100041
            })
        },error => {
            res.status(500).send({
                errorCode:100042
            })
        })
    }


module.exports = {
    queryUser,
    editPassword,
    edituserInfo
}