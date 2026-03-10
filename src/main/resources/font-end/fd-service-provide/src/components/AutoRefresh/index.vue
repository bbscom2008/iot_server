<template>
  <div class="auto-refresh">
    <span class="label">自动刷新</span>
    <el-switch v-model="enabled" @change="handleToggle" />
    <el-select
      v-model="minutes"
      :disabled="!enabled"
      size="mini"
      class="duration-select"
      placeholder="时长"
      @change="handleMinutesChange"
    >
      <el-option v-for="m in minuteOptions" :key="m" :label="`${m} 分钟`" :value="m" />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'AutoRefresh',
  data() {
    return {
      downloadUrl:
        'https://pub-a4de62c620034eb68b03d5063c3ef430.r2.dev/docs/autoEnablePlaySound.doc',
      enabled: false,
      minutes: 3,
      minuteOptions: [1, 3, 5, 7, 10],
      timerId: null
    }
  },
  mounted() {
    this.loadFromStorage()
    if (this.enabled) {
      this.restartTimer()
    }

    this.checkAutoplay()
  },
  methods: {
    // 使用方法：
    async checkAutoplay() {
      let result = 'disallowed'

      try {
        result = await this.detectWebAudioAutoplayPolicy()
      } catch (e) {
        console.error('检测自动播放策略时发生错误', e)
      }

      console.log('--checkAutoplay- :', result)

      switch (result) {
        case 'allowed':
          this.$message.success('可以直接自动播放声音')
          break

        case 'disallowed':
          console.log('❌ 不能自动播放，等待用户点击后再初始化音频')
        //   this.$message.warning('❌ 不能自动播放，等待用户点击后再初始化音频')
        // 显示弹框，提示用户下载 文档，设置浏览器允许自动播放
          this.$confirm(
            '当前浏览器禁止自动播放声音，是否查看解决方案？',
            '提示',
            {
              confirmButtonText: '查看文档',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              window.open(this.downloadUrl, '_blank')
            })
            .catch(() => {
              // 用户取消了
            })
          break
      }
    },
    /**
     * 检测当前浏览器环境是否允许 Web Audio 自动播放声音
     * @returns {Promise<string>} 返回 'allowed' 或 'disallowed'
     */
    async detectWebAudioAutoplayPolicy() {
      // 1. 优先使用标准 API 检测（针对 AudioContext）
      if (navigator.getAutoplayPolicy) {
        try {
          // 检测针对 AudioContext 类型的全局策略 [citation:1][citation:4]
          const policy = navigator.getAutoplayPolicy('audiocontext')
          console.log(`[标准API检测] Web Audio 自动播放策略: ${policy}`)
          return policy
        } catch (e) {
          console.warn('标准 API 检测失败，降级使用尝试播放法', e)
        }
      }

      try {
        // 2. 标准 API 不可用时的备用检测方案：尝试创建并启动 AudioContext
        console.log('[备用方案] 尝试创建 AudioContext 进行检测...')

        // 创建一个静音的 AudioContext 进行测试 [citation:1][citation:7]
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (!AudioContext) {
          console.warn('当前浏览器不支持 Web Audio API')
          return 'disallowed'
        }

        const testContext = new AudioContext()

        // 如果上下文已经是运行状态，说明可能允许自动播放
        if (testContext.state === 'running') {
          await testContext.close()
          return 'allowed'
        }

        // 如果上下文是 suspended 状态，尝试恢复它
        // if (testContext.state === 'suspended') {
        //   try {
        //     await testContext.resume()
        //     // 成功恢复，说明允许自动播放
        //     await testContext.close()
        //     return 'allowed'
        //   } catch (error) {
        //     // 恢复失败，说明不允许自动播放
        //     await testContext.close()

        //     // 判断是否是因为需要用户交互而失败 [citation:1][citation:8]
        //     if (error.name === 'NotAllowedError' || error.message?.includes('user gesture')) {
        //       console.log('Web Audio 自动播放被阻止，需要用户交互')
        //       return 'disallowed'
        //     }
        //     return 'disallowed'
        //   } finally {
        //     console.warn(' Web Audio 禁止自动播放策略')
        //   }
        // }

        await testContext.close()
        return 'disallowed'
      } catch (e) {
        console.error('检测 Web Audio 自动播放策略时发生错误', e)
        return 'disallowed'
      }
    },
    handleToggle(val) {
      if (val) {
        this.restartTimer()
      } else {
        this.clearTimer()
      }
      this.saveToStorage()
    },
    handleMinutesChange() {
      if (this.enabled) {
        this.restartTimer()
      }
      this.saveToStorage()
    },
    restartTimer() {
      this.clearTimer()
      const interval = this.minutes * 60 * 1000
      this.timerId = setInterval(() => {
        window.location.reload()
      }, interval)
    },
    clearTimer() {
      if (this.timerId) {
        clearInterval(this.timerId)
        this.timerId = null
      }
    },
    loadFromStorage() {
      try {
        const raw = localStorage.getItem('autoRefreshSettings')
        if (!raw) return
        const data = JSON.parse(raw)
        if (typeof data.enabled == 'number') {
          this.enabled = data.enabled
        }

        if (typeof data.minutes === 'number' && this.minuteOptions.includes(data.minutes)) {
          this.minutes = data.minutes
        }
      } catch (e) {
        console.warn('autoRefreshSettings parse error', e)
      }
    },
    saveToStorage() {
      const payload = {
        enabled: this.enabled,
        minutes: this.minutes
      }
      localStorage.setItem('autoRefreshSettings', JSON.stringify(payload))
    }
  },
  beforeDestroy() {
    this.clearTimer()
  }
}
</script>

<style scoped lang="scss">
.auto-refresh {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  .label {
    font-size: 12px;
    color: #606266;
  }
  .duration-select {
    width: 90px;
  }
}
</style>
