<template>
  <!-- <view> -->
    <view
      class="big-title"
      :style="{ height: isShowNotify ? '50px' : '0px' }"
      @tap="isPaused = !isPaused"
      v-if="isLeave"
    >
      <view class="notify-box">
        <view
          class="notify-txt"
          :style="`
          animation: marquee ${speed}s linear infinite;
        animation-play-state: ${isPaused ? 'paused' : 'running'}`"
        >
          {{ content }}
        </view>
      </view>
      <i class="el-icon-close close" @click="closeNotify()">X</i>
    </view>
  <!-- </view> -->
</template>

<script>
export default {
  name: 'NotifyBox',
  data() {
    return {
      isLeave: true, //是否存活
      isClose: true,
      isPaused: true,
      content: ''
    }
  },
  computed: {
    speed() {
      return this.content.length / 10 + 5
    },
    isShowNotify() {
      let ret =
        this.$store.state.token && !this.isClose && this.content.length > 1
      return ret
    }
  },
  methods: {
    closeNotify() {
      this.isClose = true
      setTimeout(() => {
        this.isLeave = false
      }, 2000)
    }
  },
  async created() {
    this.content = await this.$store.dispatch('platformNotify')

    setTimeout(() => {
      this.isClose = false
      this.isPaused = false
    }, 2000)
  }
}
</script>


<style lang="scss" scoped>
.big-title {
  overflow: hidden;
//   padding-left: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-image: url('@/static/imgs/notify-bg-m.png');
  background-repeat: no-repeat;
  background-size: auto;
//   background-position-y: -30px;
  background-color: #f56c6c;
  color: #fff;
//   text-align: center;
  transition: all 0.5s;
}
.big-title {
  font-size: 18px;
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
  padding: 0 10px;
  font-size: 14px;
  font-style: normal;
  cursor: pointer;
}


</style>
