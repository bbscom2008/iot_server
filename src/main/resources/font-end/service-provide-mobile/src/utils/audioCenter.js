
// 定义消息类型对应的音频文件
const audioMap = {
  ORDER_NOTIFY: '/static/audio/dingdong.mp3',
  MESSAGE_NOTIFY: '/static/audio/new-notification.mp3',
  default: '/static/audio/new-notification.mp3'
}

class AudioCenter {

  constructor() {
    this.audioContexts = {} // 存储不同消息类型的音频上下文
    this.audioSources = {} // 存储音频源，用于控制播放

    this.initAudio()
  }

  // 初始化音频资源
  initAudio() {

    // 创建音频上下文
    Object.keys(audioMap).forEach((type) => {
      // #ifdef APP-PLUS
      this.audioContexts[type] = plus.audio.createPlayer(audioMap[type])
      // #endif

      // #ifdef H5
      this.audioContexts[type] = new Audio(audioMap[type])
      // #endif
    })
  }

  // 根据消息类型播放声音
  playSound(messageType) {
    const audioContext =
      this.audioContexts[messageType] || this.audioContexts['default']

    if (!audioContext) {
      console.warn(`未找到消息类型 ${messageType} 对应的音频文件`)
      return
    }

    // 停止当前可能正在播放的音频
    this.stopCurrentAudio()

    try {
      // #ifdef APP-PLUS
      audioContext.play(() => {
        console.log(`播放声音: ${messageType}`)
      })
      // #endif

      // #ifdef H5
      audioContext.currentTime = 0 // 重置播放位置
      audioContext
        .play()
        .then(() => {
          console.log(`播放声音: ${messageType}`)
        })
        .catch((error) => {
          console.error('播放失败:', error)
        })
      // #endif

      // 记录当前播放的音频源
      this.audioSources[messageType] = audioContext
    } catch (error) {
      console.error(`播放声音失败 (${messageType}):`, error)
    }
  }

  // 停止当前播放的音频
  stopCurrentAudio() {
    Object.values(this.audioSources).forEach((audio) => {
      try {
        // #ifdef APP-PLUS
        audio.stop()
        // #endif

        // #ifdef H5
        audio.pause()
        audio.currentTime = 0
        // #endif
      } catch (error) {
        console.error('停止音频失败:', error)
      }
    })
    this.audioSources = {}
  }


  // 销毁音频资源
  destroyAudio() {
    this.stopCurrentAudio()
    Object.values(this.audioContexts).forEach((audio) => {
      try {
        // #ifdef APP-PLUS
        audio.destroy()
        // #endif
      } catch (error) {
        console.error('销毁音频失败:', error)
      }
    })
    this.audioContexts = {}
  }

}

export default new AudioCenter()
