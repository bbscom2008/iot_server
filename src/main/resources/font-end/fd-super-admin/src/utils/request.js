import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getTokenHead } from '@/utils/auth'
import JSONbig from 'json-bigint'

const JSONbigString = JSONbig({ storeAsString: true })

import router from '@/router'

let messageHandler = null

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: process.env.VUE_APP_BASE_API+'/vue-element-admin',
  // baseURL: '/nginxapi',
  // baseURL: '/myserver',
  // baseURL: 'http://127.0.0.1:8090',
  // baseURL: '/',
  // baseURL: '/testapi',
  baseURL: '/wxapi',
  // baseURL: 'http://192.168.1.197:8001', 
  // baseURL: '/nginxapi', // 开发环境
  // baseURL: '/testapi', // 测试环境
  // baseURL: 'http://18.138.228.73:8001', // 开发服务器地址
  // baseURL: 'http://192.168.12.188:8001', // 的电脑地址
  timeout: 60000, // request timeout
  transformResponse: [
    data => {
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
  config => {
    // 显示全局加载框
    store.commit('app/show_loading')

    if (getToken()) {
      config.headers['Authorization'] = getTokenHead() + getToken()
    }

    return config
  },
  error => {
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
  response => {
    store.commit('app/hide_loading')
    // 如果是文件,直接返回
    if (response.config.responseType === 'blob') {
      return response.data
    }

    const res = response.data
    // 隐藏全局加载框
    // setTimeout(() => {
    // }, 500);

    console.log(res)
    console.log(res.code, 'res.code ')
    if (res.code == '00000') {
      return res
    } else {
      // 状态码 200 ， 响应码不是  00000 时： 业务逻辑异常, 不应该出现的事，
      // Message({
      //   message: res.code + ' Error -- 业务逻辑异常, 不应该出现的事',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  error => {
    store.commit('app/hide_loading')
    console.log('---interceptors.response-----')
    console.log(error) // for debug

    if (error.code === 'ECONNABORTED') {
      // 处理超时错误
      // Message({
      //   message: '请求超时，请稍后重试！',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      store.commit('app/show_loading')
    } else {
      // 这里可以添加更多的处理逻辑，比如提示用户等

      if (error.response) {
        const { status, data } = error.response

        const errorCode = data.code
        const errorMessage = data.message

        if (status === 401) {
          // 处理状态码为 401 的错误  token 失效,或者,密码错误3次.
          if (messageHandler) {
            messageHandler.close()
          }

          messageHandler = Message({
            message: '登录超时, 请重新登录！',
            type: 'error',
            duration: 5 * 1000
          })
          store.dispatch('user/logout')
        }

        if (status === 404) {
          // 处理状态码为 400 的错误
          if (messageHandler) {
            messageHandler.close()
          }

          messageHandler = Message({
            message: '404, 请求地址不存在！请检查',
            type: 'error',
            duration: 5 * 1000
          })
        }

        // 业务逻辑异常
        if (status === 400) {
          // 处理状态码为 400 的错误

          console.log('登录失败，错误码:', errorCode)
          console.log('错误信息:', errorMessage)

          if (messageHandler) {
            messageHandler.close()
          }

          messageHandler = Message({
            message: errorMessage,
            type: 'error',
            duration: 5 * 1000
          })
        }
        // 业务逻辑异常
        if (String(status).startsWith('5')) {
          // 处理状态码为 400 的错误

          console.log('登录失败，错误码:', errorCode)
          console.log('错误信息:', errorMessage)

          // Message({
          //   message: '服务器异常，请稍后重试！',
          //   type: 'error',
          //   duration: 5 * 1000
          // })
          store.commit('app/show_loading')
        }
        if (errorMessage == '交易密码未设置') {
          store.state.user.SecurityCenterFlag = true
        }
      }
    }

    return Promise.reject(error)
  }
)

export default service
