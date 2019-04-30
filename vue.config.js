var CommpressionPlugin = require('compression-webpack-plugin')
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve (dir) {
    return path.join(__dirname, dir)
}


console.log(process.env.NODE_ENV)

module.exports = {
	
	//多页面配置
	//  pages: {
	// 	index: {
	// 	  // page 的入口
	// 	  entry: 'src/main.js',
	// 	  // 模板来源
	// 	  template: 'public/index.html',
	// 	  // 在 dist/index.html 的输出
	// 	  filename: 'index.html',
	// 	  // 当使用 title 选项时，
	// 	  // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
	// 	  title: 'xcentz',
	// 	  // 在这个页面中包含的块，默认情况下会包含
	// 	  // 提取出来的通用 chunk 和 vendor chunk。
	// 	  chunks: ['chunk-vendors', 'chunk-common', 'index']
	// 	}
	//  },
	 //关闭eslint
	  lintOnSave: false,
	  //服务配置
	  devServer: {
	  	clientLogLevel: 'warning',
	  	historyApiFallback: true,
	  	hot: true,
	  	compress: true,
	  	host: '0.0.0.0',
	  	port: 8008,
	  	open: false,
	  	overlay: {
	  		warnings: false,
	  		errors: true,
	  	},
	  	proxy: {
				'/api':{
					target:"http://localhost:8081",
					changeOrigin:true,
				}
			},
	  	quiet: true, // necessary for FriendlyErrorsPlugin
	  	watchOptions: {
	  		poll: true,
	  	}
	  },
		css:{
			sourceMap:false
		},
		//js sourceMap
		productionSourceMap:false,
		
		//别名
		chainWebpack: config => {
			config.resolve.alias
				.set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
				.set('@api',resolve('src/assets/api'))
				.set('@@', resolve('src/components'))
		},

		//gzip压缩
		
		configureWebpack: config => {
			if(process.env.NODE_ENV==='production'){
					 config.plugins.push(
						 new CommpressionPlugin({
							 test:/\.js$|\.html$|\.css/,
							 threshold:10240,
							 deleteOriginalAssets: false
						 })
					 )
			}else{
				
				console.log('development')
				config.plugins.push(
					new CopyWebpackPlugin([{
						from: './static/particles',
						to: './public/static/particles',
						// ignore: ['.*']
					}])
				)
			}
		},
		
		
};