var CommpressionPlugin = require('compression-webpack-plugin');
const path = require('path');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');


function resolve (dir) {
    return path.join(__dirname, dir)
}

const cdn = {
	js: [
		'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
		'https://cdn.bootcss.com/vue-router/3.0.6/vue-router.min.js',
		'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
		'https://cdn.bootcss.com/echarts/4.2.1/echarts.min.js',
		'https://cdn.bootcss.com/Chart.js/2.8.0/Chart.min.js',
		'https://cdn.bootcss.com/xlsx/0.14.3/xlsx.full.min.js',
	]
}



module.exports = {
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
					target:"http://localhost",
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
						args[0].cdn = process.env.NODE_ENV !== 'development'?cdn:{js:[]}
						return args
					})

				config.when(process.env.NODE_ENV !== 'development',
        config => {

					config.externals({
						'xlsx':'XLS',
						'vue': 'Vue',
						'axios': 'axios',
						'vue-router': 'VueRouter',
						'echarts':'echarts',
						'chart.js':'Chart'
					})

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
						 new ParallelUglifyPlugin({
							test:/.js$/g,
							exclude: /[\\/]node_modules[\\/]/,
							cacheDir:'cache',
							uglifyES:{
								output: {
									/*
									 是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，
									 可以设置为false
									*/
									beautify: false,
									/*
									 是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
									*/
									comments: false
								},
								compress: {
									/*
									 是否在UglifyJS删除没有用到的代码时输出警告信息，默认为输出，可以设置为false关闭这些作用
									 不大的警告
									*/
									warnings: false,
				
									/*
									 是否删除代码中所有的console语句，默认为不删除，开启后，会删除所有的console语句
									*/
									drop_console: true,
				
									/*
									 是否内嵌虽然已经定义了，但是只用到一次的变量，比如将 var x = 1; y = x, 转换成 y = 5, 默认为不
									 转换，为了达到更好的压缩效果，可以设置为false
									*/
									collapse_vars: true,
				
									/*
									 是否提取出现了多次但是没有定义成变量去引用的静态值，比如将 x = 'xxx'; y = 'xxx'  转换成
									 var a = 'xxxx'; x = a; y = a; 默认为不转换，为了达到更好的压缩效果，可以设置为false
									*/
									reduce_vars: true
								}
							}
						 })
						// new BundleAnalyzerPlugin(),
					 )
			}
		},	
};
