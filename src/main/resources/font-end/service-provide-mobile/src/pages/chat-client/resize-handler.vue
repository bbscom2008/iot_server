<template>
	<view class="resize-handler">
		
	</view>
</template>

<script>
// 在页面或组件中
export default {
	mounted() {
		// 监听窗口大小变化
		this.onWindowResize()
	},

	onUnload() {
		// 移除监听
		this.offWindowResize()
	},

	methods: {
		onWindowResize() {
			if (uni.onWindowResize) {
				uni.onWindowResize((res) => {
					// console.log('窗口大小变化:', res)
					this.handleResize(res)
				})
			} else {
				// 兼容性处理
				window.addEventListener('resize', this.handleWindowResize)
			}
		},

		offWindowResize() {
			if (uni.offWindowResize) {
				uni.offWindowResize()
			} else {
				window.removeEventListener('resize', this.handleWindowResize)
			}
		},

		handleResize(res) {
			const { windowWidth, windowHeight } = res.size
			// console.log('新窗口尺寸:', `宽:${windowWidth}, 高:${windowHeight}`)
			
			this.$store.commit('setWindowsSize', { width:windowWidth, height:windowHeight })
			
			// 判断是否是键盘弹出引起的
			// if (windowHeight < this.originalHeight) {
			// 	console.log('键盘弹出')
			// 	this.handleKeyboardShow(windowHeight)
			// } else {
			// 	console.log('键盘收起')
			// 	this.handleKeyboardHide()
			// }
		},

		handleWindowResize() {
			// 传统resize事件处理
			const width = window.innerWidth
			const height = window.innerHeight
			console.log('传统resize:', `宽:${width}, 高:${height}`)
		}
	}
}
</script>

<style></style>
