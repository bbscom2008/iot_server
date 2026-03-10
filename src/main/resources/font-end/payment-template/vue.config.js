'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// 是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  // publicPath: '/mypath/',
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    // 关闭热更新
    // hot: false,
    // 同时关闭热更新的客户端注入（可选，进一步确保关闭）
    // hotOnly: false,
    overlay: {
      warnings: false,
      errors: true
    },
    // 配置代理 以 apis 开头的 转发给 http://192.168.12.117:17003/ 并将 apis 去掉
    proxy: {
      
      // '/wxapi': { 
      //   target: 'https://8fa93aeaae89.firstcheckoutcounter.xyz', //  18.143.77.174:8086     
      //   changeOrigin: true, 
      //   pathRewrite: { 
      //     '^/wxapi': '' 
      //   }
      // },

      
      '/wxapi': { 
        target: 'https://855d58068116.dezoux.cn', //    https://890ad2b717ea.wphme.cn   
        changeOrigin: true,
      },

      // '/wxapi': { 
      //   target: 'http://192.168.1.199:8001', //       
      //   changeOrigin: true, 
      //   pathRewrite: { 
      //     '^/wxapi': '' 
      //   }
      // },

      // '/wxapi': { 
      //   target: 'http://127.0.0.1:8090', // 反向代理的地址 
      //   changeOrigin: true, 
      //   pathRewrite: { 
      //     '^/wxapi': '' 
      //   }
      // },




      // '/wxapi': { 
      //   // target: 'https://8fa93aeaae89.firstcheckoutcounter.xyz', //       
      //   target: 'http://485813ef.r7.vip.cpolar.cn', //       
      //   changeOrigin: true, 
      //   pathRewrite: {
      //     '^/wxapi': ''
      //   }
      // },
  
      // '/chatapi': {
      //   target: 'ws://18.136.207.197:8001', //       
      //   ws: true,
      //   changeOrigin: true, // 开发模式，默认的origin是真实的 origin:localhost:9528 代理服务会把origin修改为目标URL
      //   pathRewrite: {
      //     // 重写路径 去掉路径中开头的'/apis'
      //     '^/chatapi': '' // 正则匹配(.*)  替换成 /apis 去掉
      //   }
      // }

      // '/chatapi': {
      //   target: 'ws://18.143.77.174:8086', //       
      //   ws: true,
      //   changeOrigin: true, // https://8fa93aeaae89.firstcheckoutcounter.xyz
      // }
      '/chatapi': {
        target: 'ws://801b2582.firstcheckout.cc', //      
        // target: 'ws://127.0.0.1:8090', //      
        changeOrigin: true, 
        ws: true,
        // pathRewrite: {
        //   '^/chatapi': ''
        // },
      }


    }

    // before: require('./mock/mock-server.js')
  },
  configureWebpack: config => {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.name = name
    config.resolve = {
      alias: {
        '@': resolve('src')
      }
    }

    // 生产环境配置
    if (isProduction) {
      // gzip 压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240, // 只处理大于10kb的文件
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 不删除源文件
        })
      )

      // 性能优化
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 50000000,
        maxAssetSize: 30000000
      }

      // 代码分割
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            libs: {
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              chunks: 'initial'
            },
            commons: {
              name: 'chunk-commons',
              test: resolve('src/components'),
              minChunks: 3,
              priority: 5,
              reuseExistingChunk: true
            }
          }
        }
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // ⭐ 字体文件优化 - 提升加载速度
    config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
      .use('url-loader')
      .loader('url-loader')
      .tap(options => ({
        ...options,
        limit: 8192, // 小于8KB的字体内联为base64
        esModule: false,
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'static/fonts/[name].[hash:8].[ext]',
            esModule: false
          }
        }
      }))
    
    // 图片压缩和优化
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { 
        limit: 10240, // 小于10kb的图片转为base64
        name: 'static/img/[name].[hash:8].[ext]',
        esModule: false
      }))

    // 生产环境图片压缩 - 暂时禁用，避免 Windows 环境下的二进制工具问题
    if (isProduction) {
      config.module
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          mozjpeg: { progressive: true, quality: 65 },
          optipng: { enabled: true },
          pngquant: { quality: [0.65, 0.90], speed: 4 },
          gifsicle: { interlaced: false }
        })
    }

    // set svg-sprite-loader
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

    // 生产环境优化
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')

          // 添加文件名hash，利用浏览器缓存
          config.output.filename('static/js/[name].[contenthash:8].js')
          config.output.chunkFilename('static/js/[name].[contenthash:8].js')
          
          // 配置 html-webpack-plugin，传递环境变量
          config.plugin('html').tap(args => {
            args[0].isProduction = true
            return args
          })
        }
      )
  }
}
