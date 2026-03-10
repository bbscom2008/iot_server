// Loading 指令和工具，替代 element-ui 的 v-loading 和 $loading
import Vue from 'vue'

let loadingInstance = null

function createLoading(options = {}) {
  // 直接使用 DOM 创建 loading 元素，避免使用模板字符串
  const mask = document.createElement('div')
  const spinner = document.createElement('div')
  const circular = document.createElement('svg')
  const circle = document.createElement('circle')
  
  const text = options.text || ''
  const fullscreen = options.fullscreen !== false
  
  // 设置样式类
  mask.className = 'custom-loading-mask' + (fullscreen ? ' is-fullscreen' : '')
  spinner.className = 'custom-loading-spinner'
  circular.className = 'circular'
  circular.setAttribute('viewBox', '0 0 50 50')
  circle.className = 'path'
  circle.setAttribute('cx', '25')
  circle.setAttribute('cy', '25')
  circle.setAttribute('r', '20')
  circle.setAttribute('fill', 'none')
  
  // 组装 DOM 结构
  circular.appendChild(circle)
  spinner.appendChild(circular)
  
  if (text) {
    const textEl = document.createElement('p')
    textEl.className = 'custom-loading-text'
    textEl.textContent = text
    spinner.appendChild(textEl)
  }
  
  mask.appendChild(spinner)
  
  // 添加到目标元素或 body
  if (options.target) {
    options.target.style.position = 'relative'
    options.target.appendChild(mask)
  } else {
    document.body.appendChild(mask)
  }
  
  return {
    close() {
      // 立即设置 z-index 为 -1，避免遮挡页面
      mask.style.zIndex = '-1'
      mask.style.opacity = '0'
      setTimeout(() => {
        // 动画结束后设置为 display: none，确保完全隐藏
        mask.style.display = 'none'
        if (mask.parentNode) {
          mask.parentNode.removeChild(mask)
        }
      }, 300)
    }
  }
}

// 指令
const loadingDirective = {
  inserted(el, binding) {
    if (!binding.value && !binding.modifiers.fullscreen) return
    
    const target = binding.modifiers.fullscreen ? null : el
    const instance = createLoading({
      target: target,
      text: typeof binding.value === 'string' ? binding.value : '',
      fullscreen: binding.modifiers.fullscreen
    })
    el.instance = instance
  },
  update(el, binding) {
    if (binding.value !== binding.oldValue) {
      if (el.instance) {
        el.instance.close()
        el.instance = null
      }
      if (binding.value || binding.modifiers.fullscreen) {
        const target = binding.modifiers.fullscreen ? null : el
        const instance = createLoading({
          target: target,
          text: typeof binding.value === 'string' ? binding.value : '',
          fullscreen: binding.modifiers.fullscreen
        })
        el.instance = instance
      }
    }
  },
  unbind(el) {
    if (el.instance) {
      el.instance.close()
      el.instance = null
    }
  }
}

// 全局方法
Vue.prototype.$loading = function(options) {
  return createLoading(options)
}

// 注册指令
Vue.directive('loading', loadingDirective)

export default loadingDirective
