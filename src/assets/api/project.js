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

// 查询角色用户
export function queryUserById(params){
    return request({
        url:'/project/queryUserById',
        method:'get',
        params
    })
}

// 编辑项目
export function editProject(params){
    return request({
        url:'/project/editProject',
        method:'put',
        data:params
    })
}

// 审批项目
export function approvalProject(params){
    return request({
        url:'/project/approvalProject',
        method:'put',
        data:params
    })
}

// 审批不通过
export function rejectApproval(params){
    return request({
        url:'/project/rejectApproval',
        method:'put',
        data:params
    })
}

// 通知审批
export function notifyApproval(params){
    return request({
        url:'/project/notifyApproval',
        method:'get',
        params
    })
}

// 校验项目名称是否存在
export function validateName(params){
    return request({
        url:'/project/validateName',
        method:'get',
        params
    })
}
