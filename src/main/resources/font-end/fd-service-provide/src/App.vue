<template>
  <div id="app">
    <div
      class="big-title"
      :style="{ height: isShowNotify ? '100px' : '0px' }"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
      v-if="isLeave"
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
import { webSocketService } from '@/utils/websocket.js'

export default {
  name: 'App',
  data() {
    return {
      isLeave: true, //是否存活
      isClose: true,
      isPaused: true,
      content: '',
    }
  },
  computed: {
    speed() {
      return this.content.length / 10 + 10
    },
    isShowNotify() {
      let ret =  this.$store.state.user.token && !this.isClose && this.content.length > 1
      return ret
    },
  },
  methods: {
    closeNotify() {
      this.isClose = true
      setTimeout(() => {
        this.isLeave = false
      }, 2000);
    }
  },
  async created() {
    if (this.isShowUi) {
      document.documentElement.classList.add('showui')
      document.documentElement.classList.remove('nui')
    } else {
      document.documentElement.classList.remove('showui')
      document.documentElement.classList.add('nui')
    }

    webSocketService.connentIfy()

    this.content = await this.$store.dispatch('tenant/platformNotify')

    setTimeout(() => {
      this.isClose = false
      this.isPaused = false
    }, 2000);
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
