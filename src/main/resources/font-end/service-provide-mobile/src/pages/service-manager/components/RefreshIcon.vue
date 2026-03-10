<template>
  <uni-icons
    :class="['fa fa-refresh', { 'fa-spin': isRefreshing }]"
    @click="startRefresh"
    type="refreshempty"
    :color="color"
    size="22"
  ></uni-icons>
</template>

<script>
import { payeeAccountInfoIsAvailable } from '@/api/service-income-info'

export default {
  props: {
    isAvailable: {
      type: Number,
      default: 0
    },
    payeeAccountId: {
      type: Number | String,
      default: ''
    },
    color: {
      type: String,
      default: '#000' 
    }
  },
  data() {
    return {
      isRefreshing: false
    }
  },
  methods: {
    async startRefresh() {
      this.isRefreshing = true
      try {
        let res = await payeeAccountInfoIsAvailable(this.payeeAccountId)
        
        uni.showToast({
          title:res.data.unavailableReason,
          icon: 'none'
        })
        
        this.$emit('update:isAvailable', res.data.isAvailable)
      } catch (error) {
        console.error('网络请求出错:', error)
      } finally {
        // 无论请求成功或失败，都停止旋转
        this.isRefreshing = false
      }
    }
  }
}
</script>

<style scoped>
.fa-refresh {
  cursor: pointer;
  font-size: 18px;
}
.fa-spin {
  -webkit-animation: fa-spin 1s infinite linear;
  animation: fa-spin 1s infinite linear;
}

@-webkit-keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
