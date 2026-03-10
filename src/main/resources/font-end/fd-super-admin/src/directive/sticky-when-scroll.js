// sticky-clone-animate.js
const StickyCloneAnimate = {
  bind(el, binding) {
    const childSelector = binding.value
    if (!childSelector) {
      console.warn('v-sticky-clone-animate 需要传入子元素选择器参数')
      return
    }

    // 查找子元素
    const childEl = el.querySelector(childSelector)
    if (!childEl) {
      console.warn(`未找到子元素: ${childSelector}`)
      return
    }

    // 存储相关数据
    el._stickyCloneData = {
      childEl,
      cloneEl: null,
      isFixed: false,
      originalRect: null,
      scrollHandler: null,
      resizeHandler: null
    }

    initStickyClone(el)
  },

  update(el, binding) {
    const newChildSelector = binding.value
    const oldChildSelector = binding.oldValue
    
    if (newChildSelector !== oldChildSelector) {
      StickyCloneAnimate.unbind(el)
      StickyCloneAnimate.bind(el, binding)
    }
  },

  unbind(el) {
    const data = el._stickyCloneData
    if (data) {
      // 清理事件监听
      if (data.scrollHandler) {
        window.removeEventListener('scroll', data.scrollHandler)
        window.removeEventListener('resize', data.resizeHandler)
      }
      
      // 移除克隆元素
      if (data.cloneEl && data.cloneEl.parentNode) {
        data.cloneEl.parentNode.removeChild(data.cloneEl)
      }
    }
  }
}

function initStickyClone(el) {
  const data = el._stickyCloneData
  const childEl = data.childEl
  
  // 保存原始位置信息
  data.originalRect = childEl.getBoundingClientRect()
  
  // 创建克隆元素（初始隐藏）
  data.cloneEl = createCloneElement(childEl, data.originalRect)
  document.body.appendChild(data.cloneEl)
  
  // 创建事件处理函数
  data.scrollHandler = () => handleScrollWithClone(el)
  data.resizeHandler = () => handleResizeWithClone(el)
  
  // 监听事件
  window.addEventListener('scroll', data.scrollHandler, { passive: true })
  window.addEventListener('resize', data.resizeHandler, { passive: true })
  
  // 初始检查
  setTimeout(() => handleScrollWithClone(el), 100)
}

function createCloneElement(originalEl, originalRect) {
  // 克隆元素（包括子元素）
  const cloneEl = originalEl.cloneNode(true)
  
  // 设置克隆元素的基础样式
  Object.assign(cloneEl.style, {
    position: 'fixed',
    top: '-100%', // 初始在屏幕上方cloneNode
    left: originalRect.left + 'px',
    width: originalRect.width + 'px',
    fontSize: '12px',
    zIndex: '1000',
    background: '#f1f2fe',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    visibility: 'hidden',
    pointerEvents: 'auto'
  })
  
  // 添加自定义类名用于样式控制
  cloneEl.classList.add('sticky-clone-element')
  cloneEl.classList.add('sticky-hidden')
  
  return cloneEl
}

function handleScrollWithClone(el) {
  const data = el._stickyCloneData
  const childEl = data.childEl
  const cloneEl = data.cloneEl
  const childRect = childEl.getBoundingClientRect()
  
  // 更新原始元素位置信息（用于resize时重新定位）
  data.originalRect = childEl.getBoundingClientRect()
  
  // 判断是否离开屏幕可视区域
  if (childRect.top < 0 && !data.isFixed) {
    showCloneElement(el)
  } else if (childRect.top >= 0 && data.isFixed) {
    hideCloneElement(el)
  }
}

function handleResizeWithClone(el) {
  const data = el._stickyCloneData
  // 更新克隆元素的位置和尺寸
  if (data.isFixed && data.cloneEl) {
    const originalRect = data.childEl.getBoundingClientRect()
    data.cloneEl.style.left = originalRect.left + 'px'
    data.cloneEl.style.width = originalRect.width + 'px'
  }
}

function showCloneElement(el) {
  const data = el._stickyCloneData
  const cloneEl = data.cloneEl
  
  if (!cloneEl) return
  
  // 更新克隆元素内容（确保与原始元素同步）
  updateCloneContent(data.childEl, cloneEl)
  
  // 设置初始位置（屏幕顶部上方）
  cloneEl.style.left = data.originalRect.left + 'px'
  cloneEl.style.width = data.originalRect.width + 'px'
  cloneEl.style.visibility = 'visible'
  cloneEl.classList.remove('sticky-hidden')
  
  // 触发重绘
  cloneEl.offsetHeight
  
  // 执行滑入动画
  requestAnimationFrame(() => {
    cloneEl.style.top = '0px'
    cloneEl.classList.add('sticky-visible')
    cloneEl.classList.remove('sticky-hidden')
  })
  
  data.isFixed = true
}

function hideCloneElement(el) {
  const data = el._stickyCloneData
  const cloneEl = data.cloneEl
  
  if (!cloneEl) return
  
  // 执行滑出动画
  cloneEl.style.top = '-100%'
  cloneEl.classList.add('sticky-hidden')
  cloneEl.classList.remove('sticky-visible')
  
  // 动画结束后隐藏
  setTimeout(() => {
    cloneEl.style.visibility = 'hidden'
    data.isFixed = false
  }, 400)
}

function updateCloneContent(originalEl, cloneEl) {
  // 简单的内容同步（可根据需要增强）
  cloneEl.innerHTML = originalEl.innerHTML
  
  // 同步类名（除了动画相关类名）
  const classesToKeep = ['sticky-clone-element', 'sticky-hidden', 'sticky-visible']
  const currentClasses = Array.from(cloneEl.classList)
    .filter(className => !classesToKeep.includes(className))
  
  // 移除旧类名
  currentClasses.forEach(className => cloneEl.classList.remove(className))
  
  // 添加新类名（除了动画相关类名）
  Array.from(originalEl.classList)
    .filter(className => !className.startsWith('sticky-'))
    .forEach(className => cloneEl.classList.add(className))
}

// 注册指令
export default {
  install(Vue) {
    Vue.directive('sticky-clone-animate', StickyCloneAnimate)
  }
}