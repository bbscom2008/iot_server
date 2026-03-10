// directives/watermark.js


import store from '@/store'

let lastWatermarkDiv = null

function checkPermission(el, binding) {
  const { text, font, color, isDarkTheme } = binding.value || {}

  console.log('==store.state.tenant.tenantInfo.isWatermark==', store.state.tenant.tenantInfo.isWatermark);
  
  if (!store.state.tenant.tenantInfo.isWatermark) { // 如果没有启用，直接退出
    // 如果之前有，那要去掉背景
    if (lastWatermarkDiv != null) {
      lastWatermarkDiv.style.backgroundImage = ''
    }

    return
  }

  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 150
  const ctx = canvas.getContext('2d')

  ctx.font = font || '14px Arial'
  if (store.state.app.isDarkTheme) {

    ctx.fillStyle = color || 'rgba(100, 200, 200, 0.5)'
  } else {
    ctx.fillStyle = color || 'rgba(150, 150, 150, 0.7)'
  }
  ctx.rotate(-20 * Math.PI / 180)
  ctx.fillText(text || '万象支付', 10, 100)

  let watermarkDiv = null

  if (lastWatermarkDiv == null) {
    watermarkDiv = document.createElement('div')
    watermarkDiv.style.position = 'fixed'
    watermarkDiv.style.top = '0'
    watermarkDiv.style.zIndex = '9999'
    watermarkDiv.style.left = '0'
    watermarkDiv.style.width = '100%'
    watermarkDiv.style.height = '100%'
    watermarkDiv.style.pointerEvents = 'none'
    watermarkDiv.style.backgroundRepeat = 'repeat'

    el.style.position = 'relative'

    el.appendChild(watermarkDiv)
    lastWatermarkDiv = watermarkDiv
  } else {
    watermarkDiv = lastWatermarkDiv
  }

  watermarkDiv.style.backgroundImage = `url(${canvas.toDataURL()})`

}


export default {
  inserted(el, binding) {
    checkPermission(el, binding);
  },
  update(el, binding) {
    checkPermission(el, binding);
  },
  // componentUpdated(el, binding) {
  //   checkPermission(el, binding);
  // }
}