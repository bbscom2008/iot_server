// 简单的对话框工具，替代 element-ui 的 MessageBox
let dialogContainer = null

function createDialogContainer() {
  if (dialogContainer) return dialogContainer
  
  dialogContainer = document.createElement('div')
  dialogContainer.className = 'custom-dialog-container'
  dialogContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  `
  document.body.appendChild(dialogContainer)
  return dialogContainer
}

function showDialog(options) {
  return new Promise((resolve, reject) => {
    const container = createDialogContainer()
    const dialogEl = document.createElement('div')
    
    const title = options.title || '提示'
    const message = options.message || ''
    const type = options.type || 'confirm' // confirm, alert, prompt
    const inputValue = options.inputValue || ''
    const inputPlaceholder = options.inputPlaceholder || ''
    
    dialogEl.className = 'custom-dialog'
    dialogEl.style.cssText = `
      background: white;
      border-radius: 4px;
      padding: 20px;
      min-width: 300px;
      max-width: 90%;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    `
    
    let inputHtml = ''
    if (type === 'prompt') {
      inputHtml = `
        <div style="margin: 15px 0;">
          <input type="text" class="custom-dialog-input" 
            value="${inputValue}" 
            placeholder="${inputPlaceholder}"
            style="width: 100%; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; box-sizing: border-box;">
        </div>
      `
    }
    
    dialogEl.innerHTML = `
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">${title}</div>
      <div style="margin-bottom: 20px; color: #606266;">${message}</div>
      ${inputHtml}
      <div style="text-align: right; margin-top: 20px;">
        ${type === 'confirm' || type === 'prompt' ? `
          <button class="custom-dialog-btn custom-dialog-btn-cancel" style="margin-right: 10px;">取消</button>
        ` : ''}
        <button class="custom-dialog-btn custom-dialog-btn-confirm">确定</button>
      </div>
    `
    
    container.appendChild(dialogEl)
    
    const input = dialogEl.querySelector('.custom-dialog-input')
    const confirmBtn = dialogEl.querySelector('.custom-dialog-btn-confirm')
    const cancelBtn = dialogEl.querySelector('.custom-dialog-btn-cancel')
    
    // 按钮样式
    const btnStyle = `
      padding: 9px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `
    confirmBtn.style.cssText = btnStyle + 'background: #409eff; color: white;'
    if (cancelBtn) {
      cancelBtn.style.cssText = btnStyle + 'background: #fff; color: #606266; border: 1px solid #dcdfe6;'
    }
    
    const close = () => {
      container.style.opacity = '0'
      setTimeout(() => {
        if (dialogEl.parentNode) {
          dialogEl.parentNode.removeChild(dialogEl)
        }
        if (container.parentNode && container.children.length === 0) {
          container.parentNode.removeChild(container)
          dialogContainer = null
        }
      }, 200)
    }
    
    confirmBtn.onclick = () => {
      if (type === 'prompt') {
        resolve({ value: input.value, action: 'confirm' })
      } else {
        resolve('confirm')
      }
      close()
    }
    
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        reject('cancel')
        close()
      }
    }
    
    // 点击遮罩层关闭（仅 alert）
    if (type === 'alert') {
      container.onclick = (e) => {
        if (e.target === container) {
          resolve('confirm')
          close()
        }
      }
    }
    
    // prompt 时聚焦输入框
    if (input) {
      setTimeout(() => input.focus(), 100)
      input.onkeydown = (e) => {
        if (e.key === 'Enter') {
          confirmBtn.click()
        }
      }
    }
    
    container.style.opacity = '0'
    setTimeout(() => {
      container.style.transition = 'opacity 0.2s'
      container.style.opacity = '1'
    }, 10)
  })
}

const MessageBox = {
  confirm(options) {
    return showDialog({ ...options, type: 'confirm' })
  },
  alert(options) {
    return showDialog({ ...options, type: 'alert' })
  },
  prompt(options) {
    return showDialog({ ...options, type: 'prompt' })
  }
}

export default MessageBox

