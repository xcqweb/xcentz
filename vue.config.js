var CommpressionPlugin = require('compression-webpack-plugin')
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

function resolve (dir) {
    return path.join(__dirname, dir)
}

const cdn = {
	js: ['https://cdn.bootcss.com/xlsx/0.14.3/cpexcel.js']
}



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

				config.plugin('html')
				.tap(args => {
					args[0].cdn = cdn
					return args
				})

				config.when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                iview: {
                  name: 'chunk-iview', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?iview(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
		},

		//gzip压缩
		configureWebpack: config => {
			if(process.env.NODE_ENV==='production'){
				var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
					 config.plugins.push(
						 new CommpressionPlugin({
							 test:/\.js$|\.html$|\.css/,
							 threshold:10240,
							 deleteOriginalAssets: false
						 }),
						new BundleAnalyzerPlugin(),
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