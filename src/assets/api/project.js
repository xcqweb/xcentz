import request from '@/assets/js/request'

// 查询项目
export function queryProject(params){
    return request({
        url:'/project/queryProject',
        method:'get',
        params
    })
}

// 新增项目
export function addProject(params){
    return request({
        url:'/project/addProject',
        method:'post',
        data:params
    })
}

// 查询角色用户
export function queryRoleUser(params){
    return request({
        url:'/project/queryRoleUser',
        method:'get',
        params
    })
}
