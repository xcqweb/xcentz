            
            
    let buildTree = function(list){
        let trees = []
        let temp = {};
        let tree = {};
        for(let i in list){
            temp[list[i].id] = list[i];
        }
        for(let i in temp){
            if(Object.prototype.toString.call(temp[i].checked) === '[object Null]'){
                temp[i].checked = false
            }else{
                temp[i].checked = true
            }
            if(temp[i].parent_id) {
                if(temp[temp[i].parent_id]){
                    if(!temp[temp[i].parent_id].children) {
                        temp[temp[i].parent_id].children = [];
                    }
                    
                    temp[temp[i].parent_id].children.push(temp[i]);
                }
            } else {
                tree[temp[i].id] =  temp[i];
            }
        }

            for(let key in tree){
                let item = tree[key]
                if(item.id === 0){
                    item.children = []
                    trees.push(item)
                }else{
                    trees[0].children.push(item)
                }
            }
        return trees;
    }

module.exports = {buildTree}