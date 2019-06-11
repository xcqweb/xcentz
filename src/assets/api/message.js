import request from '@/assets/js/request'

//查询消息
export function queryMsg(params){
    return request({
        url:'/systemMsg/msg',
        method:'get',
        params
    })
}

//标记消息已读
export function readMsg(params){
    return request({
        url:'/systemMsg/msg',
        method:'put',
        data:params
    })
}