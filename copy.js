var fs = require( 'fs' ),
    stat = fs.stat;
//拷贝文件
function copy( src, dst ){
	// 读取目录中的所有文件/目录
	fs.readdir( src, function( err, paths ){
			if( err ){
                throw err;
			}

			paths.forEach(function( path ){
                var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;      

                stat( _src, function( err, st ){
                        if( err ){
                            throw err;
                        }
                        // 判断是否为文件
                        if( st.isFile() ){
                            // 创建读取流
                            readable = fs.createReadStream( _src );
                                    // 创建写入流
                                writable = fs.createWriteStream( _dst ); 	
                            // 通过管道来传输流
                            readable.pipe( writable );
                        }
                        // 如果是目录则递归调用自身
                        else if( st.isDirectory() ){
                            exists( _src, _dst, copy );
                        }
                });
			});
	});
};

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
function exists( src, dst, callback ){
	fs.exists( dst, function( exists ){
			// 已存在
			if( exists ){
                callback( src, dst );
			}
			// 不存在
			else{
					fs.mkdir( dst, function(){
                        callback( src, dst );
					});
			}
	});
};


function emptyDir(fileUrl){   
    var files = fs.readdirSync(fileUrl);//读取该文件夹
		files.forEach(function(file){
                var stats = fs.statSync(fileUrl+'/'+file);
                if(stats.isDirectory()){
                emptyDir(fileUrl+'/'+file);
			}else{
                fs.unlinkSync(fileUrl+'/'+file); 
                console.log("删除文件"+fileUrl+'/'+file+"成功");
			}        
		});   
}

emptyDir('./server/public')
exists('./dist','./server/public',copy)