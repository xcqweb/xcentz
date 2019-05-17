import request from '@/assets/js/request'

//查询用户信息
export function queryUser(params){
    return request({
        url:'/userCenter/queryUser',
        method:'get',
        params
    })
}

//用户修改密码
export function editPassword(params){
    return request({
        url:'/userCenter/editPassword',
        method:'put',
        data:params
    })
}

//用户修改个人信息
export function edituserInfo(params){
    return request({
        url:'/userCenter/edituserInfo',
        method:'put',
        data:params
    })
}