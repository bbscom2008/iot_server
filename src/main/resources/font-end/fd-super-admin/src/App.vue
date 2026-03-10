<template>
  <div id="app">
    <div
      class="big-title"
      :style="{ height: isShowNotify ? '100px' : '0px' }"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
    >
      <div class="notify-box">
        <div
          class="notify-txt"
          :style="`
           animation: marquee ${speed}s linear infinite;
        animation-play-state: ${isPaused ? 'paused' : 'running'}`"
        >
          {{ content }}
        </div>
      </div>
      <i class="el-icon-close close" @click="closeNotify()"></i>
    </div>
    <router-view />
  </div>
</template>

<script>
import { getSystemConfigPage } from '@/api/system-manager'

export default {
  name: 'App',
  data() {
    return {
      isClose: false,
      isPaused: false,
      content: ''
    }
  },
  computed: {
    speed() {
      return this.content.length / 10 + 10
    },
    isShowNotify() {
      // userId 表示已登陆
      return this.$store.state.user.userId && !this.isClose && this.content.length > 1
    }
  },
  methods: {
    closeNotify() {
      this.isClose = true
    },
    async getSystemConfigPage() {
      let res = await getSystemConfigPage({
        pageNum: 1,
        pageSize: 100
      })

      res.data.list.forEach((item) => {
        if (item.configKey === 'AllPlatformNotification') {
          this.content = item.configValue
        }
      })
    }
  },
  mounted() {
    setTimeout(() => {
      this.getSystemConfigPage()
    }, 2000)
  },
  created() {
    if (this.isShowUi) {
      document.documentElement.classList.add('showui')
      document.documentElement.classList.remove('nui')
    } else {
      document.documentElement.classList.remove('showui')
      document.documentElement.classList.add('nui')
    }

    if (this.isMobile) {
      document.documentElement.classList.add('isMobile')
    } else {
      document.documentElement.classList.remove('isMobile')
    }
  }
}
</script>

<style lang="scss" scoped>
.big-title {
  overflow: hidden;
  padding-left: 100px;
  margin-left: 200px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-image: url('./assets/img/notify-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: -30px;
  background-color: #f56c6c;
  color: #fff;
  text-align: center;
  transition: all 0.5s;
}
.big-title {
  font-size: 32px;
  .notify-box {
    flex: 1;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
  }
  .notify-txt {
    display: inline-block;
    color: #f7ed73;
    text-shadow: 1px 1px 2px #000;
    position: relative;
    padding-left: 100%; /* 确保从右侧开始 */
  }
}
.big-title .close {
  padding: 0 20px;
  font-size: 30px;
  cursor: pointer;
}

</style>

<style>

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>