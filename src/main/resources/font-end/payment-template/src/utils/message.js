// 简单的消息提示工具，替代 element-ui 的 Message
let messageContainer = null

function createMessageContainer() {
  if (messageContainer) return messageContainer
  
  messageContainer = document.createElement('div')
  messageContainer.className = 'custom-message-container'
  messageContainer.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    width: 100rem;
    transform: translateX(-50%);
    z-index: 9999;
    text-align: center;
    pointer-events: none;
  `
  document.body.appendChild(messageContainer)
  return messageContainer
}

function showMessage(options) {
  const container = createMessageContainer()
  const messageEl = document.createElement('div')
  
  const type = options.type || 'info'
  const message = typeof options === 'string' ? options : (options.message || '')
  const duration = options.duration || 1500
  
  messageEl.className = `custom-message custom-message-${type}`
  messageEl.style.cssText = `
    background: ${type === 'error' ? '#f56c6c' : type === 'success' ? '#67c23a' : type === 'warning' ? '#e6a23c' : '#909399'};
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    pointer-events: auto;
    animation: messageSlideIn 0.3s ease-out;
    max-width: 100rem; 
    word-wrap: break-word;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 500;
  `
  
  messageEl.textContent = message
  container.appendChild(messageEl)
  
  // 添加动画样式
  if (!document.getElementById('custom-message-styles')) {
    const style = document.createElement('style')
    style.id = 'custom-message-styles'
    style.textContent = `
      @keyframes messageSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes messageSlideOut {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-20px);
        }
      }
    `
    document.head.appendChild(style)
  }
  
  setTimeout(() => {
    messageEl.style.animation = 'messageSlideOut 0.1s ease-out'
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl)
      }
    }, 100)
  }, duration)
  
  return messageEl
}

function normalizeOptions(options, defaultType = 'info') {
  if (typeof options === 'string') {
    return {
      message: options,
      type: defaultType
    }
  }
  return {
    ...(options || {}),
    type: options && options.type ? options.type : defaultType
  }
}

function Message(options) {
  return showMessage(normalizeOptions(options))
}

Message.success = function success(options) {
  return showMessage(normalizeOptions(options, 'success'))
}

Message.error = function error(options) {
  return showMessage(normalizeOptions(options, 'error'))
}

Message.warning = function warning(options) {
  return showMessage(normalizeOptions(options, 'warning'))
}

Message.info = function info(options) {
  return showMessage(normalizeOptions(options, 'info'))
}

export default Message

