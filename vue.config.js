var CommpressionPlugin = require('compression-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');


function resolve (dir) {
    return path.join(__dirname, dir)
}

const cdn = {
	js: [
		'https://cdn.bootcss.com/xlsx/0.14.3/xlsx.full.min.js',
		'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
		'https://cdn.bootcss.com/vue-router/3.0.6/vue-router.min.js',
		'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
		'https://cdn.bootcss.com/echarts/4.2.1/echarts.min.js',
		'https://cdn.bootcss.com/Chart.js/2.8.0/Chart.min.js'
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
						// new BundleAnalyzerPlugin(),
					 )
			}
		},	
};
