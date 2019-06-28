  var {query} = require('../database')          
    //生成树状结构
    var buildTree = function(list=[]){
        var temp = {};
        var trees = [];
        for(let i in list){
            temp[list[i].id] = list[i];
        }
        
        for(let i in temp){
            if(isNull(temp[i].checked)){
                temp[i].checked = false
            }else{
                temp[i].checked = true
            }
            if(!isNull(temp[i].parent_id)) {
                if(temp[temp[i].parent_id]){
                    if(!temp[temp[i].parent_id].children) {
                        temp[temp[i].parent_id].children = [];
                    }
                    
                    temp[temp[i].parent_id].children.push(temp[i]);
                }
            } else {
                trees.push(temp[i]);
            }
        }
        return trees;
    },

    isNull = function(obj){
        return Object.prototype.toString.call(obj) === '[object Null]' || obj==='null'
    },

    //clear redis key 
    clearRedis = function(key,fix){
        return new Promise((reslove,reject) => {
            let str = ''
            if(fix){
                redis.del(`${key}${fix}`)
            }else{
               for(let i=0 ;i<30; i++){
                    redis.del(`${key}${i?i:''}`)
                } 
            }
            reslove()
        })
    },

    //更新用户列表redis
    updateUserList = function(){
        query('select * from Pub_User').then( (r) => {
            redis.set('userList',JSON.stringify(r))
        })
    };



module.exports = {buildTree,isNull,clearRedis,updateUserList}