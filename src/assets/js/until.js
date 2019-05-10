

export  function flatten(arr) {  
    return arr.reduce((result, item)=> {
        return result.concat(Array.isArray(item.children) ? flatten(item.children) : item);
    }, []);
  }