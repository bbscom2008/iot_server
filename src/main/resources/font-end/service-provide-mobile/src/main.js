import Vue from 'vue'
import App from './App'
import store from './store'

import '@/utils/request.js'



// import '@/utils/websocket.js'

import CustomNavBar from '@/components/custom-nav-bar/index.vue'
Vue.component('CustomNavBar', CustomNavBar)

// import pagination from '@/components/pagination/pagination.vue'
// Vue.component('pagination', pagination)

import MySelect from '@/components/my-select/my-select.vue'
Vue.component('MySelect', MySelect)

// main.js
import uView from 'uview-ui'
Vue.use(uView)

// import './global-ui.scss'
import MyImage from '@/components/my-image/my-image.vue'
Vue.component('MyImage', MyImage)

import MySwitch from '@/components/MySwitch/MySwitch.vue'
Vue.component('MySwitch', MySwitch)

import SvgIcon from '@/components/SvgIcon.vue'
Vue.component('SvgIcon', SvgIcon)


Vue.prototype.$store = store

Vue.prototype.$message = {
  success: function(title, duration = 1500) {
    setTimeout(() => {
      uni.showToast({
        title,
        duration,
        icon: 'success'
      })
    }, 200)
  },
  error: function(title, duration = 1500) {
    setTimeout(() => {
      uni.showToast({
        title,
        duration,
        icon: 'none'
      })
    }, 200)
  }
}

// 注册全局指令
Vue.directive('number-input', {
  bind(el, binding) {
    const input = el.querySelector('input') || el
    input.addEventListener('input',function(e) {
      let value = e.target.value

      // console.log('---处理前----', value)

      value = value
        .replace(/^\./g, '') // 不允许以 . 开头
        .replace(/[^0-9.-]/g, '') // 保留数字、负号和小数点
        .replace(/(?!^)-/g, '') // 只允许第一个负号，且必须在开头
        .replace(/(\..*)\./g, '$1') // 只允许一个小数点

      // 允许 0.25 等带小数的数字，不允许  01255 或 00255 等
      if (value.startsWith('0') && value.length > 1) {
        if (value[1] !== '.') {
          value = value.replace(/^0+/, '')
        }
      }

      // 允许 -0.25 等带小数的数字，不允许  -01255 或 -00255 等
      if (value.startsWith('-0') && value.length > 2) {
        if (value[2] !== '.') {
          value = value.replace(/^-0+/, '-')
        }
      }

      // console.log('---处理后----', value)
      // 更新值并触发v-model
      if (value !== e.target.value) {
        e.target.value = value
        e.target.dispatchEvent(new Event('input'))
      }
    })
  }
})
// 正整数，可以有小数点
Vue.directive('number-input-positive', {
  bind(el, binding) {
    const input = el.querySelector('input') || el
    input.addEventListener('input', function(e) {
      let value = e.target.value

      value = value
        .replace(/^\./g, '') // 不允许以 . 开头
        .replace(/[^0-9.]/g, '') // 保留数字和小数点
        .replace(/(\..*)\./g, '$1') // 只允许一个小数点

      // 允许 0.25 等带小数的数字，不允许  01255 或 00255 等
      if (value.startsWith('0') && value.length > 1) {
        if (value[1] !== '.') {
          value = value.replace(/^0+/, '')
        }
      }

      // 更新值并触发v-model
      if (value !== e.target.value) {
        e.target.value = value
        e.target.dispatchEvent(new Event('input'))
      }
    })
  }
})

// 只能是正整数，不能有小数点
Vue.directive('input-int-positive', {
  bind(el, binding) {
    const input = el.querySelector('input') || el
    input.addEventListener('input', function(e) {
      let value = e.target.value

      value = value
        .replace(/[^0-9]/g, '') // 只保留数字
        .replace(/^0/g, '') // 不允许以0开头

      // 更新值并触发v-model
      if (value !== e.target.value) {
        e.target.value = value
        e.target.dispatchEvent(new Event('input'))
      }
    })
  }
})

// 封装弹框的方法
uni.$showMsg = function(
  title = '数据请求成功！',
  icon = 'success',
  duration = 1500
) {
  uni.showToast({
    title,
    duration,
    icon: icon
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

import VConsole from 'vconsole';

const testUI = process.env.VUE_APP_CURR_MODE === 'test' // 测试
// const testUI = true // 生产

console.log('=======VUE_APP_CURR_MODE========', process.env);
console.log('=======testUI========', testUI);

if (testUI) {
  //  new VConsole();
}

// const testUI = false  // 生产


Vue.mixin({
  data() {
    return {
      // testUI: false, // 生产环境为 false 
      testUI: testUI, // 测试为 true
      isShowUi: true,
    }
  }
})
const app = new Vue({
  store,
  ...App
})
app.$mount()