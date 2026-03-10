import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css
import '@/assets/custom-theme/dark.css'
import '@/assets/custom-theme/my_dark.scss'

import {isMobile} from '@/utils'

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

// 全局注册 MyDialog 并覆盖 el-dialog
import MyDialog from '@/components/MyDialog/MyDialog.vue'

Vue.component('el-dialog', MyDialog) // 关键：覆盖 el-dialog

// 注册全局指令
Vue.directive('number-input', {
  bind(el, binding) {
    const input = el.querySelector('input') || el
    input.addEventListener('input', function(e) {
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

import { myRules } from '@/utils/form-rules'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.prototype.showLoading = function(txt) {
  store.commit('app/show_loading', txt)
}

Vue.prototype.hideLoading = function() {
  store.commit('app/hide_loading')
}

import MyTable from './components/MyTable/my-table.vue'
import MyTableColumn from './components/MyTable/my-table-column.vue'
import MySwitch from './components/MySwitch/MySwitch.vue'
import MyButton from './components/MyButton/MyButton.vue'

import { formatDateTime } from '@/utils/index'

import MyDateTimePicker from '@/components/MyDateTimePicker/MyDateTimePicker.vue'

// 全局替换原组件
Vue.component('el-date-picker', MyDateTimePicker)

Vue.component('my-table', MyTable)
Vue.component('my-switch', MySwitch)
// Vue.component('my-switch', MySwitch)
Vue.component('el-switch', MySwitch)
Vue.component('el-button', MyButton)
Vue.component('my-table-column', MyTableColumn)

Vue.mixin({
  data() {
    return {
      isMobile: isMobile(),
      isShowUi: true,
      // 全局变量
      myRules: myRules,
      // tenantId:store.state.user.tenantId|| localStorage.getItem('tenantId'),
      // 只能选三天内，或者，三天前的
      myPickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              store.state.order.startTime == 0

              const now = new Date()
              const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
              const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59) //  23:59:59
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              store.state.order.startTime == 0

              const now = new Date()
              const today_start = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                0,
                0,
                0
              )
              const today_end = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59
              )

              const start = new Date(today_start.getTime() - 3600 * 1000 * 24 * 1)
              const end = new Date(today_end.getTime() - 3600 * 1000 * 24 * 1)

              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近3天',
            onClick(picker) {
              store.state.order.startTime == 0

              const now = new Date()
              const today_start = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                0,
                0,
                0
              )
              const today_end = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59
              )

              const start = new Date(today_start.getTime() - 3600 * 1000 * 24 * 2)

              picker.$emit('pick', [start, today_end])
            }
          },
          {
            text: '4-7天',
            onClick(picker) {
              store.state.order.startTime == 0

              const now = new Date()
              const today_start = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                0,
                0,
                0
              )
              const today_end = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59
              )

              const start = new Date(today_start.getTime() - 3600 * 1000 * 24 * 6)
              const end = new Date(today_end.getTime() - 3600 * 1000 * 24 * 3)

              picker.$emit('pick', [start, end])
            }
          }
        ],
        onPick: ({ minDate, maxDate }) => {
          console.log('选择的时间范围', minDate, maxDate)
          if (minDate && !maxDate) {
            // 选了第一个时间
            store.commit('order/setStartTime', minDate)
          }
          if (maxDate) {
            // 选了第二个时间, 清空之前的时间
            store.commit('order/setStartTime', 0)
          }
          if (minDate && maxDate) {
            // console.log('选择的时间范围',formatDateTime(minDate), formatDateTime(maxDate))
            // const now = new Date()
            // const today_start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0) // 今天凌晨
            // const middle = new Date(today_start.getTime() - 3600 * 1000 * 24 * 2  - 500  ) // 前天 凌晨 - 500 毫秒
            // if(minDate.getTime() < middle && maxDate.getTime() > middle){ // 选择的时间范围在前天到今天
            //   console.log('选择的时间范围在前天到今天')
            //   this.$message({
            //     message: `时间范围不能包含${formatDateTime(middle)}`,
            //     type: 'error'
            //   })
            // }
          }
        },
        disabledDate: (time) => {
          const now = new Date()
          const today_end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59) // 今天凌晨

          if (time.getTime() > today_end.getTime()) {
            // 选择的时间范围在前天到今天
            return true
          }

          if (store.state.order.startTime == 0) {
            return false
          }

          const today_start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0) // 今天凌晨
          const middle = new Date(today_start.getTime() - 3600 * 1000 * 24 * 2 - 500)

          const firstTime = new Date(store.state.order.startTime)

          if (firstTime.getTime() < middle.getTime()) {
            // 在中间时间之前

            // 3天之前的禁用
            // if(time.getTime() < firstTime.getTime() - 3600 * 1000 * 24 * 2){
            //   return true
            // }

            // if(time.getTime() > middle.getTime()  || time.getTime() >  firstTime.getTime() + 3600 * 1000 * 24 * 2){ // 选择的时间范围在前天到今天
            //   return true
            // }

            if (time.getTime() > middle.getTime()) {
              // 选择的时间范围在前天到今天
              return true
            }

            return false
          } else {
            // 在中间时间之后, 今天之后的 禁用
            if (time.getTime() < middle.getTime()) {
              // 选择的时间范围在前天到今天
              return true
            }

            return false
          }

          // 只允许选择今天之前的日期
          // return time.getTime() > store.state.order.startTime + 3600 * 1000 * 24 * 3
          // || time.getTime() < store.state.order.startTime - 3600 * 1000 * 24 * 3
        }
      },

      // 只能选择同一天
      myPickerOptionsOneDay: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              store.state.order.startTimeOneDay == 0

              const now = new Date()
              const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
              const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59) //  23:59:59
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              store.state.order.startTimeOneDay == 0

              const now = new Date()
              const today_start = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                0,
                0,
                0
              )
              const today_end = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59
              )

              const start = new Date(today_start.getTime() - 3600 * 1000 * 24 * 1)
              const end = new Date(today_end.getTime() - 3600 * 1000 * 24 * 1)

              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '前天',
            onClick(picker) {
              store.state.order.startTimeOneDay == 0

              const now = new Date()
              const today_start = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                0,
                0,
                0
              )
              const today_end = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59
              )

              const start = new Date(today_start.getTime() - 3600 * 1000 * 24 * 2)
              const end = new Date(today_end.getTime() - 3600 * 1000 * 24 * 2)

              picker.$emit('pick', [start, end])
            }
          }
        ],
        onPick: ({ minDate, maxDate }) => {
          // console.log('选择的时间范围', minDate, maxDate)
          if (minDate && !maxDate) {
            // 选了第一个时间
            store.commit('order/setStartTimeOneDay', minDate)
          }
          if (maxDate) {
            // 选了第二个时间, 清空之前的时间
            store.commit('order/setStartTimeOneDay', 0)
          }
        },
        disabledDate: (time) => {
          if (store.state.order.startTimeOneDay == 0) {
            return false
          } else {
            /**
             * 只允许选择 同一天
             */
            const firstTime = new Date(store.state.order.startTimeOneDay)
            if (time.getTime() != firstTime.getTime()) {
              // 选择的时间范围在前天到今天
              return true
            } else {
              return false
            }
          }
        }
      },
      // 可以选择所有日期
      myPickerOptionsAll: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              store.state.order.startTime == 0

              const now = new Date()
              const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
              const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59) //  23:59:59
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              store.state.order.startTime == 0

              const now = new Date()
              const today_start = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                0,
                0,
                0
              )
              const today_end = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59
              )

              const start = new Date(today_start.getTime() - 3600 * 1000 * 24 * 1)
              const end = new Date(today_end.getTime() - 3600 * 1000 * 24 * 1)

              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近3天',
            onClick(picker) {
              store.state.order.startTime == 0

              const now = new Date()
              const today_start = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                0,
                0,
                0
              )
              const today_end = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59
              )

              const start = new Date(today_start.getTime() - 3600 * 1000 * 24 * 2)

              picker.$emit('pick', [start, today_end])
            }
          },
          {
            text: '4-7天',
            onClick(picker) {
              store.state.order.startTime == 0

              const now = new Date()
              const today_start = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                0,
                0,
                0
              )
              const today_end = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59
              )

              const start = new Date(today_start.getTime() - 3600 * 1000 * 24 * 6)
              const end = new Date(today_end.getTime() - 3600 * 1000 * 24 * 3)

              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate: (time) => {
          return false
        }
      },
      shengchengPickerOptions: {
        disabledDate(time) {
          const now = new Date()
          const today_start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0) // 今天凌晨
          return time.getTime() >= today_start.getTime()
        }
      }
    }
  },
  computed: {
    tenantId() {
      return store.state.user.tenantId || localStorage.getItem('tenantId')
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
