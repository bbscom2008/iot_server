import axios from 'axios'
import Message from '@/utils/message'
import store from '@/store'
// import { getToken, getTokenHead } from '@/utils/auth'
import JSONbig from 'json-bigint'

import EncryptUtils from '@/utils/EncryptUtils.js'


const JSONbigString = JSONbig({ storeAsString: true })

import router from '@/router'

// create an axios instance
const service = axios.create({
 
  baseURL: '/wxapi', // 不许再用 127.0.0.1:8090
  timeout: 60000, // request timeout
  transformResponse: [
    (data) => {
      try {
        // 自动将大数字转为 BigInt
        return JSONbigString.parse(data)
      } catch (e) {
        return data
      }
    }
  ]
})

service.interceptors.request.use(
  (config) => {
    // 显示全局加载框
    store.commit('app/show_loading')

    // if (getToken()) {
    //   config.headers['Authorization'] = getTokenHead() + getToken()
    // config.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyTmFtZSI6ImdseTAwMyIsInBlcm1pc3Npb25MaXN0IjpbXSwidGVuYW50SWQiOjAsInVzZXJJZCI6IjE4NTkzNzE5MDM5MDMwNDc2OCIsInVzZXJUeXBlIjowLCJpYXQiOjE3NDk0Mzg0MDcsImV4cCI6MTc0OTUyNDgwN30.miIa6ZykPwlt-L5wXblT0wUk8i5cAqtgfyLY8xMQFj8TdJR_YVgsnb5beqXtoJqPFUti-hAunV5_xDJo1ANh7g'
    // }

    return config
  },
  (error) => {
    // do something with request error
    console.log('---interceptors.request-----')

    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    store.commit('app/hide_loading')
    // 如果是文件,直接返回
    if (response.config.responseType === 'blob') {
      return response.data
    }

    // 如果是加密的，先解密, 响应头中有 encrypt-key 字段，就说明是加密的
    const encryptKey = response.headers['encrypt-key']
    // console.log('--------encryptKey----', encryptKey);

    let decryptData = ''
    let res = ''
    if (encryptKey) {
      // 解密
      try{
        decryptData = EncryptUtils.rsaDecrypt(encryptKey)
        decryptData = EncryptUtils.base64Decode(decryptData)


        console.log('-----response.data--decryptData----');
        // console.log(decryptData)
        console.log(response.data);
        res = EncryptUtils.sm4Decrypt(response.data, decryptData)
        res = JSONbigString.parse(res)
      }catch(e){
        console.log('----catch------');
        console.log(e);
      }
    }else{
      res = response.data
    }

    // 隐藏全局加载框
    // setTimeout(() => {
    // }, 500);

    
    console.log('------res----------');
    console.log(res)
    console.log(JSON.stringify(res));
    
    
    // console.log(res.code ,'res.code ')
    if (res.code == '00000') {
      return res
    } else {
      // 状态码 200 ， 响应码不是  00000 时： 业务逻辑异常, 不应该出现的事，
      // Message({
      //   message: res.code + ' Error -- 业务逻辑异常, 不应该出现的事',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      return Promise.reject(new Error(res.message))
    }
  },
  (error) => {
    store.commit('app/hide_loading')
    console.log('---interceptors.response-----')
    console.log(error) // for debug

    // 处理网络连接错误
    if (error.code === 'ECONNABORTED') {
      // 处理超时错误
      Message({
        message: '请求超时，请稍后重试！',
        type: 'error',
        duration: 3 * 1000
      })
    } else if (error.code === 'ECONNRESET') {
      // 处理连接被重置错误
      console.warn('连接被重置，可能是服务器关闭了连接')
      // 不显示错误消息，避免频繁提示
      // 这种错误通常是暂时的，可以静默处理
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      // 处理网络错误或无响应的情况
      console.warn('网络错误或服务器无响应:', error.code)
      Message({
        message: '网络连接失败，请检查网络或稍后重试！',
        type: 'warning',
        duration: 3 * 1000
      })
    } else {

      // 这里可以添加更多的处理逻辑，比如提示用户等

      if (error.response) {
        const { status, data } = error.response

        const errorCode = data.code
        const errorMessage = data.message

        if (status === 401) {
          // 处理状态码为 401 的错误  token 失效,或者,密码错误3次.
          Message({
            message: '登录超时, 请重新登录！',
            type: 'error',
            duration: 3 * 1000
          })
          store.dispatch('user/resetToken')
          router.push('/login')
        }

        if (status === 404) {
          Message({
            message: '404, 请求地址不存在！请检查',
            type: 'error',
            duration: 3 * 1000
          })
        }

        // 业务逻辑异常
        if (status === 400) {
          // 处理状态码为 400 的错误
         
          console.log('服务器异常，错误码:', errorCode)
          console.log('错误信息:', errorMessage)

          if(errorMessage == '聊天室已关闭'){
            store.commit('chat/set_chat_close', true)
            // 停止WebSocket重连
            const { webSocketService } = require('@/utils/websocket')
            webSocketService.stopReconnect()
          }


          Message({
            message: errorMessage,
            type: 'error',
            duration: 3 * 1000
          })
       
        }
        // 业务逻辑异常
        if (String(status).startsWith('5')) {
          // 处理状态码为 400 的错误
         
          console.log('服务器异常，错误码:', errorCode)
          console.log('错误信息:', errorMessage)

          Message({
            message: '服务器异常，请稍后重试！',
            type: 'error',
            duration: 3 * 1000
          })
       
        }
      }
    }

    return Promise.reject(error)
  }
)

export default service
