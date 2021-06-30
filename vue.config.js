const UglifyJsPlugin = require('uglifyjs-webpack-plugin')  // 去除console.log打印以及注释
const isProduction = process.env.NODE_ENV === 'production'; // 去除console.log打印以及注释
const CompressionWebpackPlugin = require('compression-webpack-plugin') // 图片压缩
const { HashedModuleIdsPlugin } = require('webpack'); // 打包过后每次请求到最新的js
const PrerenderSPAPlugin = require('prerender-spa-plugin'); // 预渲染
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer; // 预渲染


const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
const title = "杰叼管理系统"
const port = 8080
const externals = {
    vue: "Vue",
    'vue-router': 'VueRouter',
    axios: 'axios',
    lodash: "lodash",
    echarts: 'echarts',
    nprogress: 'nprogress',
    'vue-quill-editor': 'VueQuillEditor'
}
module.exports = {
    publicPath: "/", // baseurl
    outputDir: 'dist', // 输出文件夹
    assetsDir: 'static', // 静态资源目录
    lintOnSave: process.env.NODE_ENV === 'development',
    //去除生产环境的productionSourceMap
    // map文件的作用在于：项目打包后，代码都是经过压缩加密的
    // 如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错
    // 有了map就可以像没加密代码一样，准确的输出是哪一行那一列有错。
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            //  当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
            warnings: false,
            errors: true
        },
        // proxy: {
        //     // './': {
        //     //     // apiPort
        //     //     target: `http://10.88.41.13:${9527}/api`,
        //     //     changeOrigin: true,
        //     //     pathRewrite: {
        //     //         ['^' + process.env.VUE_APP_API]: ''
        //     //     }
        //     // }
        // },

    },

    // 对象形式
    configureWebpack: config => {
        config.name = title
        const plugins = [];
        if (isProduction) {
            // 去掉注释 移掉console
            plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        output: {
                            comments: false, // 去掉注释
                        },
                        warnings: false,
                        compress: {
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log']//移除console
                        }
                    }
                }),

            )
            // 服务器也要相应开启gzip
            plugins.push(
                new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    test: /\.(js|css)$/,// 匹配文件名
                    threshold: 10000, // 对超过10k的数据压缩
                    deleteOriginalAssets: false, // 不删除源文件
                    minRatio: 0.8 // 压缩比
                })
            )
            // 用于根据模块的相对路径生成 hash 作为模块 id, 一般用于生产环境
            plugins.push(
                new HashedModuleIdsPlugin()
            )
            // 开启分离js
            config.optimization = {
                runtimeChunk: 'single',
                splitChunks: {
                    chunks: 'all',
                    maxInitialRequests: Infinity,
                    minSize: 1000 * 60,
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                // 排除node_modules 然后吧 @ 替换为空 ,考虑到服务器的兼容
                                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                                return `npm.${packageName.replace('@', '')}`
                            }
                        }
                    }
                }
            };

            // 取消webpack警告的性能提示
            config.performance = {
                hints: 'warning',
                //入口起点的最大体积
                maxEntrypointSize: 1000 * 500,
                //生成文件的最大体积
                maxAssetSize: 1000 * 1000,
                //只给出 js 文件的性能提示
                assetFilter: function (assetFilename) {
                    return assetFilename.endsWith('.js');
                }
            }

            //预渲染 一般需要为history模式
            plugins.push(
                new PrerenderSPAPlugin({
                    //要求-给的WebPack-输出应用程序的路径预渲染。
                    staticDir: path.join(__dirname, 'dist'),
                    //必需，要渲染的路线。
                    // 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
                    routes: ['/home', '/login'],
                    //必须，要使用的实际渲染器，没有则不能预编译
                    renderer: new Renderer({
                        inject: {
                            foo: 'bar'
                        },
                        headless: false, //渲染时显示浏览器窗口。对调试很有用。  
                        //等待渲染，直到检测到指定元素。
                        //例如，在项目入口使用`document.dispatchEvent(new Event('custom-render-trigger'))` 
                        // 不去掉会报错 [prerender-spa-plugin] Unable to prerender all routes!，不能使用路由懒加载
                        // renderAfterDocumentEvent: 'render-event', 
                        renderAfterTime: 5000 //renderAfer 多中条件选一个
                    })
                })
            )

        }
        return { plugins }
    },
    // 链式
    chainWebpack: config => {

        // 设置别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('api', resolve('src/api'))
            .set('config', resolve('src/config'))
            .set('components', resolve('src/components'))

        /**
         * 修改开发模式和发布模式两个不同的入口
         * main-dev.js main-prod.js
         */
        config.when(process.env.NODE_ENV === 'production',
            config => {
                config.entry('app').clear().add('./src/main-prod.js')

                config.plugins.delete('preload') //  强制使用路由懒加载配置
                config.plugins.delete('prefetch') //  强制使用路由懒加载配置

                // 配置externals cdn, public index.html中要cdn引入
                config.set("externals", externals)

                // 自定义首页标题和加载cdn
                config.plugin("html").tap(args => {
                    args[0].isProd = true
                    return args
                })
                config.module
                    .rule('svg')
                    .exclude.add(resolve('src/icons'))
                    .end()
                config.module
                    .rule('icons')
                    .test(/\.svg$/)
                    .include.add(resolve('src/icons'))
                    .end()
                    .use('svg-sprite-loader')
                    .loader('svg-sprite-loader')
                    .options({
                        symbolId: 'icon-[name]'
                    })
                    .end()
                config.module
                    .rule('vue')
                    .use('vue-loader')
                    .loader('vue-loader')
                    .tap(options => {
                        options.compilerOptions.preserveWhitespace = true
                        return options
                    })
                    .end()
                // 分析报告
                // config
                //     .plugin('webpack-bundle-analyzer')
                //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
                // 使用splitChunks
                config
                    .optimization.splitChunks({
                        chunks: 'all',
                        cacheGroups: {
                            // 第三方
                            libs: {
                                name: 'chunk-libs', // 打包的chunks名
                                test: /[\\/]node_modules[\\/]/, //匹配
                                priority: 10,// 缓存组打包的优先级，越大越优先
                                chunks: 'initial' // 只打包最初依赖的第三方
                            },
                            // 第三方
                            elementUI: {
                                name: 'chunk-elementUI', // split elementUI into a single package
                                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                            },
                            commons: {  // 公用模块抽离
                                name: 'chunk-commons',
                                test: resolve('src/components'), // can customize your rules
                                minChunks: 3, // 在分割之前，这个代码块最小应该被引用的次数
                                priority: 5,
                                reuseExistingChunk: true
                            }
                        }
                    })
                // // 压缩图片
                // config.module
                //     .rule('images')
                //     .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
                //     .use('image-webpack-loader')
                //     .loader('image-webpack-loader')
                //     .options({ bypassOnDebug: true })
                // // 压缩图片
                // config.module
                //     .rule('images')
                //     .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
                //     .use('url-loader')
                //     .loader('url-loader')

                // runtimeChunk作用是为了线上更新版本时，充分利用浏览器缓存，使用户感知的影响到最低。
                config.optimization.runtimeChunk('single')
            })

        // 开发模式入口
        config.when(process.env.NODE_ENV === 'development',
            config => {
                config.entry('app').clear().add('./src/main-dev.js')
            })
        config.plugin("html").tap(args => {
            args[0].isProd = false
            return args
        })
    }

}