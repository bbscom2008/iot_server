module.exports = {
  devServer: {

    proxy: {
      
      '/wxapi': { 
        target: 'https://test0010bc6f19b8d-mobile.fykknn.xyz',        
        changeOrigin: true, 
      },

      // '/wxapi': { 
      //   target: 'http://192.168.1.200:8001',        
      //   changeOrigin: true, 
      //   pathRewrite: {
      //     '^/wxapi': ''
      //   }
      // },


      '/chatapi': {
        target: 'ws://test0010bc6f19b8d-sup.fykknn.xyz',        
        ws: true,
        changeOrigin: true, 
      },

      '/websapi': {
        target: 'ws://test0010bc6f19b8d-sup.fykknn.xyz', 
        ws: true,
        changeOrigin: true,
      },

      // '/wxapi': { 
      //   target: 'https://test0010bc6f19b8d-mobile.fykknn.xyz', //       
      //   changeOrigin: true, 
      //   // pathRewrite: {
      //   //   '^/wxapi': ''
      //   // }
      // },
     
      // '/websapi': {
      //   // target: 'ws://18.143.77.174:8087', //       
      //   target: 'ws://test0010bc6f19b8d-mobile.fykknn.xyz', //       
      //   ws: true,
      //   changeOrigin: true, // 开发模式，默认的origin是真实的 origin:localhost:9528 代理服务会把origin修改为目标URL
      //   // pathRewrite: {
      //   //   '^/websapi': '' // 正则匹配(.*)  替换成 /apis 去掉
      //   // }
      // },
     
      
      // '/chatapi': {
      //   target: 'ws://test0010bc6f19b8d-mobile.fykknn.xyz', //       
      //   ws: true,
      //   changeOrigin: true, // 开发模式，默认的origin是真实的 origin:localhost:9528 代理服务会把origin修改为目标URL
      //   // pathRewrite: {
      //   //   '^/chatapi': '' 
      //   // }
      // },
      
      

    }
  }
}