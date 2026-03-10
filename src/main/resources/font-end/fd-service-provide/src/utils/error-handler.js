// utils/error-handler.js - 全局错误处理
export class GlobalErrorHandler {
  constructor() {
    this.init()
  }

  init() {
    // 捕获未处理的 Promise 错误
    window.addEventListener('unhandledrejection', (event) => {
      console.error('未处理的 Promise 错误:', event.reason)
      event.preventDefault() // 阻止默认的错误处理
    })

    // 捕获全局 JavaScript 错误
    window.addEventListener('error', (event) => {
      console.error('全局 JavaScript 错误:', event.error)
      event.preventDefault() // 阻止默认的错误处理
    })

    // 捕获网络错误
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        console.error('资源加载错误:', event.target.src || event.target.href, event.error)
      }
    }, true)

    // 捕获 WebSocket 错误
    this.handleWebSocketErrors()
  }

  handleWebSocketErrors() {
    // 重写 WebSocket 构造函数，添加错误处理
    const OriginalWebSocket = window.WebSocket
    const self = this

    window.WebSocket = function(url, protocols) {
      const ws = new OriginalWebSocket(url, protocols)
      
      // 添加错误处理
      const originalOnError = ws.onerror
      ws.onerror = function(event) {
        console.error('WebSocket 错误:', event)
        if (originalOnError) {
          originalOnError.call(this, event)
        }
        // 阻止错误冒泡
        event.stopPropagation()
      }

      // 添加关闭处理
      const originalOnClose = ws.onclose
      ws.onclose = function(event) {
        console.log('WebSocket 关闭:', event.code, event.reason)
        if (originalOnClose) {
          originalOnClose.call(this, event)
        }
      }

      return ws
    }

    // 保持原型链
    window.WebSocket.prototype = OriginalWebSocket.prototype
    window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING
    window.WebSocket.OPEN = OriginalWebSocket.OPEN
    window.WebSocket.CLOSING = OriginalWebSocket.CLOSING
    window.WebSocket.CLOSED = OriginalWebSocket.CLOSED
  }

  // 处理网络状态变化
  handleNetworkChange() {
    window.addEventListener('online', () => {
      console.log('网络已连接')
    })

    window.addEventListener('offline', () => {
      console.log('网络已断开')
    })
  }
}

// 创建全局错误处理实例
export const globalErrorHandler = new GlobalErrorHandler()


