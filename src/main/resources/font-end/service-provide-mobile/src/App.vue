<script>

import {startWebSocket} from '@/utils/notifySocket'
import {
	webSocketService
} from '@/utils/websocket.js'


// import {checkApkVersion} from '@/utils/checkApkVersion'

export default {
  onLaunch: function () {
    console.log('App Launch')
    // 初始化路由历史
    if (!uni.getStorageSync('page_history')) {
      uni.setStorageSync('page_history', [])
    }

    // 拦截路由方法
    this.overrideRouterMethods()

    // nofityBox 中会获得通知信息，同时会触发获取租户配置
    // this.$store.dispatch('getTenantConfig')
  },
  onShow: function () {
    console.log('AppShow')
    uni.$emit('app-show')
    this.reloadWebSocket()

    // 检查apk版本
    // checkApkVersion();
  },
  onHide: function () {
    console.log('App Hide')
  },
  methods: {
    reloadWebSocket(){
      startWebSocket() // 订单通知的 websocket
      webSocketService.connentIfy() // 聊天的 websocket
    },
    overrideRouterMethods() {
      const originalNavigateTo = uni.navigateTo
      uni.navigateTo = (options) => {
        this.addToHistory()
        originalNavigateTo(options)
      }

      const originalNavigateBack = uni.navigateBack
      uni.navigateBack = (options) => {
        this.removeFromHistory()
        originalNavigateBack(options)
      }
    },
    addToHistory() {
      const pages = getCurrentPages()
      if (pages.length > 0) {
        const history = uni.getStorageSync('page_history') || []
        history.push(pages[pages.length - 1].route)
        uni.setStorageSync('page_history', history)
      }
    },
    removeFromHistory() {
      const history = uni.getStorageSync('page_history') || []
      history.pop()
      uni.setStorageSync('page_history', history)
    }
  }
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import 'uview-ui/index.scss';

/*每个页面公共css */
@import '@/uni_modules/uni-scss/index.scss';
@import '@/static/customicons.css';

@import './global.scss';
@import './global-ui.scss';


// 设置整个项目的背景色
</style>
