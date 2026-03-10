import store from '@/store/index.js'
import { getToken, getTokenHead, removeToken } from '@/utils/auth'
import { replaceBigNumbers } from '@/utils/index.js'

import { logout } from '@/api/user.js'

import JSONbig from 'json-bigint'

const JSONbigString = JSONbig({
  storeAsString: true
})

// $http.baseUrl = 'http://13.212.178.152:8099'
export const BaseUrl = '/wxapi'
// export const BaseUrl = 'http://localhost:8090'
// export const BaseUrl = 'http://192.168.1.200:8090'
// export const BaseUrl = 'http://192.168.1.200:12001'

class Request {
  constructor(options = {}) {
    // 请求的根路径
    this.baseUrl = options.baseUrl || ''
    // 请求的 url 地址
    this.url = options.url || ''
    // 请求方式
    this.method = 'GET'
    // 请求的参数对象
    this.data = null
    // header 请求头
    this.header = options.header || {}
    this.beforeRequest = null
    this.afterRequest = null
  }

  _() {
    // 清空 header 对象
    // this.header = {}
    // 请求之前做一些事
    this.beforeRequest &&
      typeof this.beforeRequest === 'function' &&
      this.beforeRequest(this)
    try {
      // 发起请求
      return new Promise((resolve, reject) => {
        let weixin = wx
        // 适配 uniapp
        if ('undefined' !== typeof uni) {
          weixin = uni
        }
        try{
          weixin.request({
          url: this.url,
          method: this.method,
          data: this.data,
          header: this.header,
          dataType: 'String',
          success: (res) => {
            // console.log('请求成功--result--', res)

            if (res.statusCode == 200) {
              const result = JSONbigString.parse(res.data)
              // console.log(result);
              resolve(result)

              // const jsonstr = replaceBigNumbers(res.data)
              // const result = JSON.parse(jsonstr)
              // console.log(result);
              // resolve(result)
              return
            } else if (res.statusCode == 401) {
              uni.showToast({
                title: '登录已过期, 请重新登录',
                icon: 'error',
                duration: 2000
              })
							// 退出登陆，
							// logout()
							store.dispatch('logout_clean')
							uni.reLaunch({
							  url: '/pages/login/login'
							})
							
            } else if (res.statusCode == 404) {
              uni.showToast({
                title: '路径错误, 联系技术人员！',
                icon: 'none',
                duration: 2000
              })

              
              
            } else if (res.statusCode == 400) {
              const result = JSON.parse(replaceBigNumbers(res.data))

              if ('交易密码未设置' == result.message) {
                uni.showModal({
                  title: '提示',
                  content: '还没设置交易密码，是否立刻设置？',
                  cancelText: '取消',
                  confirmText: '确定',
                  success: () => {
                    console.log('--- ok--')
                    uni.navigateTo({
                      url: '/pages/login/changeTradePassword'
                    })
                  },
                  fail: () => {
                    console.log('---fail--')
                  }
                })
              } else {
                uni.showToast({
                  title: result.message,
                  icon: 'none',
                  duration: 3000
                })
              }

              return reject(result)
            } else {
              uni.showToast({
                title: '请求失败, 稍后再试！',
                icon: 'error',
                duration: 2000
              })
            }

            reject(res)
          },
          fail: (err) => {
            console.log('-----fail----', err)
            uni.showToast({
              title: '网络错误, 请稍后重试',
              icon: 'none',
              duration: 2000
            })
            reject(err)
          },
          complete: (res) => {
            // res = JSON.parse(res)
            // console.log('---request---complete----', res)

            if (res.statusCode == 401) {
              // uni.showToast({
              //   title: '登录已过期, 请重新登录',
              //   icon: 'none',
              //   duration: 2000
              // })
              // // 清空 TOKEN
              // removeToken()
              // uni.reLaunch({
              //   url: '/pages/login/login'
              // })
            } else if (res.statusCode == 404) {
              uni.showToast({
                title: '请求失败, 稍后再试！',
                icon: 'none',
                duration: 2000
              })
            }

            // 请求完成以后做一些事情
            this.afterRequest &&
              typeof this.afterRequest === 'function' &&
              this.afterRequest(res)
          }
        })
        }catch(e){
          console.log('==catch==', e);
          
        }
      })
    } catch (e) {
      console.log('request -- catch ', e)
    }
  }
}

const $http = new Request()

// $http.baseUrl = 'http://192.168.12.125:8090'
// $http.baseUrl = 'http://13.212.178.152:8099'
// $http.baseUrl = 'http://127.0.0.1:8090'
// $http.baseUrl = 'http://13.212.178.152:8088/nginxapi'
// $http.baseUrl = '/nginxapi'
$http.baseUrl = BaseUrl
// $http.baseUrl = '/myserver'

// '/nginxapi': { // 匹配所有以 '/apis'开头的请求路径
//         target: 'http://18.138.228.73:8001'

const loadingConfig = {
  count: 0
}

// 请求拦截器
$http.beforeRequest = function (config) {
  loadingConfig.count++

  if (store.state.loadingEnable) {
    uni.showLoading({
      title: '数据加载中...'
    })

    store.state.isLoading = true
  }
  if (getToken()) {
    // console.log('--getTokenHead()-', getTokenHead())
    // console.log('--getToken()-', getToken())

    config.header['Authorization'] = getTokenHead() + getToken()
  }
}

// 响应拦截器
$http.afterRequest = function () {
  loadingConfig.count--
  if (loadingConfig.count == 0) {
    uni.hideLoading()
    // store.state.isLoading = false
    store.commit('setLoading', false)
  }
}

export default function ({ url, method = 'get', headers, data, params }) {
  $http.method = method
  $http.url = $http.baseUrl + url

  if (headers) {
    $http.header = {
      ...$http.header,
      ...headers
    }
  }
  if (method && 'get' == method.toLocaleLowerCase()) {
    $http.data = params
  } else {
    $http.data = data
  }
  return $http._()
}
