import request from '@/assets/js/request'

//登录
export function login(params){
    return request({
        url:'/users/login',
        method:'post',
        data:params
    })
}

//退出登录
export function loginOut(params){
    return request({
        url:'/users/loginOut',
        method:'get',
        params
    })
}

//查询用户
export function checkUser(params){
    return request({
        url:'/users/checkUser',
        method:'get',
        params
    })
}

//权限验证
export function checkAuth(params){
    return request({
        url:'/users/checkAuth',
        method:'get',
        params
    })
}

//获取登录验证码
export function getCode(params){
    return request({
        url:'/users/getCode',
        method:'get',
        responseType:'blob',
        params
    })
}

//获取邮箱验证码
export function getEmailCode(params){
    return request({
        url:'/users/getEmailCode',
        method:'get',
        params
    })
}

//注册
export function register(params){
    return request({
        url:'/users/register',
        method:'post',
        data:params
    })
}

//下载
export function downloadExcle(params){
    return request({
        url:'/upload/downloadExcle',
        method:'get',
        responseType:'blob',
        params
    })
}


//系统用户列表
export function getUserList(params){
    return request({
        url:'/users/userList',
        method:'get',
        params
    })
}

//查询菜单
export function queryMenu(params){
    return request({
        url:'/users/queryMenu',
        method:'get',
        params
    })
}

//新增菜单
export function addMenu(params){
    return request({
        url:'/users/addMenu',
        method:'post',
        data:params
    })
}

//删除菜单
export function removeMenu(params){
    return request({
        url:'/users/removeMenu',
        method:'post',
        data:params
    })
}