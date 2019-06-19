
//扁平化数组
export  function flatten(arr) {  
    return arr.reduce((result, item)=> {
        return result.concat(Array.isArray(item.children) ? flatten(item.children) : item);
    }, []);
  }


export function transformName(key){
    switch(key){
        case 'projectName':
        return '项目名称'

        case 'product':
        return '品类'

        case 'productChild':
        return '子品类'

        case 'supplier':
        return '供应商'

        case 'sellStatu':
        return '项目立项'

        case 'pack':
        return '包装'

        case 'color':
        return '颜色'

        case 'lineLength':
        return '线材长度'

        case 'outMaterial':
        return '外被材质'

        case 'portMaterial':
        return '端子材质'

        case 'port':
        return '口数'

        case 'charge':
        return '充电技术'

        case 'battery':
        return '电池容量(mAh)'

        // case 'remarks':
        // return '口数'
    }

}

export function transformStatus(status){
    switch(status){
        case 1:
        return '已完成'

        case 2:
        return '进行中'

        case 3:
        return '已取消'
    }
}