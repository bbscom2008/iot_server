import store from '@/store'

// utils/audioManager.js
class AudioManager {
	constructor() {
		this.audioContext = null
		this.isAudioInitialized = false
		this.pendingPlaybacks = []
	}

	// 在用户交互时初始化音频
	initializeOnUserInteraction() {
		if (this.isAudioInitialized) return

		try {
			// 创建音频上下文
			this.audioContext = uni.createInnerAudioContext()
			this.audioContext.obeyMuteSwitch = false
			this.audioContext.src = '/static/audio/dingdong.mp3'
			// this.audioContext.volume = 0.6 // 第一次小声播放
			this.activeAudio()
		} catch (er) {
			console.log(er);
			console.log('==========3344==============');
			store.commit("CHANGE_NofitySound", false)
		}

		// 设置事件监听
		this.audioContext.onCanplay(() => {
			console.log('音频可以播放了===onCanplay===')
			this.isAudioInitialized = true
			this.processPendingPlaybacks()
		})

		this.audioContext.onError((err) => {
			console.error('音频错误:', err)
		})
	}

	// 处理等待中的播放请求
	processPendingPlaybacks() {
		if (this.pendingPlaybacks.length > 0 && this.isAudioInitialized) {
			this.pendingPlaybacks.forEach((ele) => {
				this.playNotificationSound(ele.volume)
			})
			this.pendingPlaybacks = []
		}
	}

	activeAudio() {
		// const systemInfo = uni.getSystemInfoSync() // 同步获取系统信息
		// if (systemInfo.platform === 'ios') {
		// 	console.log('当前设备是苹果手机 (iOS)')
		// } else {
		// 	console.log('当前设备不是苹果手机=====')
		// 	return
		// }

		setTimeout(() => {
			console.log('===激活播放===')
			try {
				this.audioContext.volume = 0.2
				this.audioContext.play()
			} catch (e) {
				console.log('======激活播放失败===', e);
				store.commit("CHANGE_NofitySound", false)
			}
		}, 100)
	}

	// 播放通知声音
	playNotificationSound(volume) {
		if (!this.isAudioInitialized) {
			console.warn('音频未初始化，加入等待队列')
			this.pendingPlaybacks.push({
				volume
			})
			return
		}

		try {
			// 停止当前播放（如果有）
			this.audioContext.stop()

			// 重新播放
			if (volume) {
				this.audioContext.volume = volume
			} else {
				this.audioContext.volume = 0.6
			}

			setTimeout(() => {
				this.audioContext.play()
				console.log('WebSocket通知声音播放')
			}, 100)
		} catch (error) {
			console.error('播放失败:', error)
		}
	}

	// 销毁资源
	destroy() {
		if (this.audioContext) {
			this.audioContext.destroy()
			this.audioContext = null
		}
		this.isAudioInitialized = false
		this.pendingPlaybacks = []
	}
}

export const audioManager = new AudioManager()