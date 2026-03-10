<template>
  <i
    :class="['fa fa-refresh', { 'fa-spin': isRefreshing }]"
    class="el-icon-refresh"
    @click="startRefresh"
  ></i>
</template>

<script>
import { payeeAccountInfoIsAvailable,updateIsAvailable } from '@/api/service-income-info'

export default {
  props: {
    isAvailable: {
      type: Number,
      default: 0
    },
    payeeAccountId: {
      type: Number | String,
      default: ''
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
        let res = await updateIsAvailable(this.payeeAccountId)
        let newAvailable = res.data?1:0
        if(newAvailable != this.isAvailable){
          // 状态改变，刷新整个页面
          this.$emit('availableChange')
        }
        this.$emit('update:isAvailable', newAvailable)
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
