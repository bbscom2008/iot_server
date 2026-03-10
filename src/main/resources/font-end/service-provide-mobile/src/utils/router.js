// 在公共工具文件 common/router.js 中



export const navBack = () =>{

	const pages = getCurrentPages()
	const history = routerHistory.getHistory()

	if (pages.length > 1) {
		// 正常返回
		uni.navigateBack()
		routerHistory.pop()
	} else if (history.length > 0) {
		// 使用历史记录返回
		const lastPage = history[history.length - 1]
		uni.redirectTo({
			url: `/${lastPage}`
		})
		routerHistory.pop()
	} else {
		// 返回首页
		uni.reLaunch({
			url: '/pages/index/index'
		})
	}

}




export const routerHistory = {
    getHistory() {
      const history = uni.getStorageSync('page_history') || []
      return history
    },
    push(path) {
      const history = this.getHistory()
      history.push(path)
      uni.setStorageSync('page_history', history)
    },
    pop() {
      const history = this.getHistory()
      history.pop()
      uni.setStorageSync('page_history', history)
    },
    getLast() {
      const history = this.getHistory()
      return history.length > 0 ? history[history.length - 1] : null
    }
  }
  
  // 封装路由跳转方法
 export  const customNavigateTo = (options) => {
    const pages = getCurrentPages()
    if (pages.length > 0) {
      routerHistory.push(pages[pages.length - 1].route)
    }
    uni.navigateTo(options)
  }
  
  // export { routerHistory, customNavigateTo, handeBack }