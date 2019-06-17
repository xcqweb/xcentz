const path = require('path');
const webpack = require('webpack')
const CommpressionPlugin = require('compression-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const envs = require('./src/env')
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
		'https://cdn.bootcss.com/xlsx/0.14.3/xlsx.full.min.js'
	]
}

module.exports = {
    publicPath:'/',
    lintOnSave: false,
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
                target:"https://localhost",
                changeOrigin:true,
            }
        },
        quiet: true, 
        watchOptions: {
            poll: true,
        }
    },
    css:{
        sourceMap:false
    },
    productionSourceMap:false,
    
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@api',resolve('src/assets/api'))
            .set('@@', resolve('src/components'))

        // config.plugin('provide')
        //     .use(webpack.ProvidePlugin, [{
        //         _debounce:['lodash','debounce'],
        //         _throttle:['lodash','throttle'],
        //     }]);

        config.plugin('html')
            .tap(args => {
                args[0].cdn = process.env.NODE_ENV !== 'development'?cdn:{js:[]}
                return args
            })

            config.plugin('define').tap(args => {
                let keys = envs[process.env.USER_ENV]
                for (let i in keys) {
                    args[0]['process.env'][i] = `"${keys[i]}"`
                }
                return args
            })
    
        config.when(process.env.NODE_ENV !== 'development',config => {

            config.externals({
                'xlsx':'XLS',
                'vue': 'Vue',
                'axios': 'axios',
                'vue-router': 'VueRouter',
                'echarts':'echarts',
                'chart.js':'Chart'
            })

            config.optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                    libs: {
                        name: 'chunk-libs',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial'
                    },
                    iview: {
                        name: 'chunk-iview',
                        priority: 20, 
                        test: /[\\/]node_modules[\\/]_?iview(.*)/
                    },
                    commons: {
                        name: 'chunk-commons',
                        test: resolve('src/components'),
                        minChunks: 3,
                        priority: 5,
                        reuseExistingChunk: true
                    }
                }
            })
                
            config.optimization.runtimeChunk('single')
        })
    },

    //gzip压缩
    configureWebpack: config => {
        if(process.env.NODE_ENV!=='development'){
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
                            beautify: false,
                            comments: false
                        },
                        compress: {
                            warnings: false,
                            drop_console: true,
                            collapse_vars: true,
                            reduce_vars: true
                        }
                    }
                })
            )
            
            if(process.env.report){
                config.plugins.push(
                    new BundleAnalyzerPlugin(),
                )
            }
        }
    },	
};
