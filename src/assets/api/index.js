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

//校验用户
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

//校验登录验证码
export function checkCode(params){
    return request({
        url:'/users/checkCode',
        method:'get',
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

//校验邮箱验证码
export function checkEmailCode(params){
    return request({
        url:'/users/checkEmailCode',
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
        url:'/users/user',
        method:'get',
        params
    })
}

//新增系统用户
export function addUser(params){
    return request({
        url:'/users/user',
        method:'post',
        data:params
    })
}

//删除系统用户
export function delUser(params){
    return request({
        url:'/users/user',
        method:'delete',
        data:params
    })
}

//查询菜单
export function queryMenu(params){
    return request({
        url:'/users/menu',
        method:'get',
        params
    })
}

//查询权限菜单
export function queryAuthMenu(params){
    return request({
        url:'/users/menuAuth',
        method:'get',
        params
    })
}

//更新权限菜单
export function updateAuthMenu(params){
    return request({
        url:'/users/menuAuth',
        method:'put',
        data:params
    })
}

//新增菜单
export function addMenu(params){
    return request({
        url:'/users/menu',
        method:'post',
        data:params
    })
}

//删除菜单
export function removeMenu(params){
    return request({
        url:'/users/menu',
        method:'delete',
        data:params
    })
}

//编辑菜单
export function editMenu(params){
    return request({
        url:'/users/menu',
        method:'put',
        data:params
    })
}

//新增角色
export function addRole(params){
    return request({
        url:'/users/role',
        method:'post',
        data:params
    })
}

//修改角色
export function editRole(params){
    return request({
        url:'/users/role',
        method:'put',
        data:params
    })
}

//删除角色
export function delRole(params){
    return request({
        url:'/users/role',
        method:'delete',
        data:params
    })
}

//获取角色列表
export function roleList(params){
    return request({
        url:'/users/role',
        method:'get',
        params
    })
}

//分配角色
export function assignRole(params){
    return request({
        url:'/users/assignRole',
        method:'put',
        data:params
    })
}

//新增模块
export function addModule(params){
    return request({
        url:'/users/module',
        method:'post',
        data:params
    })
}

//查询模块
export function queryModule(params){
    return request({
        url:'/users/module',
        method:'get',
        params
    })
}

//修改模块
export function editModule(params){
    return request({
        url:'/users/module',
        method:'put',
        data:params
    })
}

//删除模块
export function delModule(params){
    return request({
        url:'/users/module',
        method:'delete',
        data:params
    })
}