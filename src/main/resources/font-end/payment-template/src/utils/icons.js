// 简单的图标映射，替代 element-ui 的图标
// 使用 Unicode 字符或简单的 CSS 图标
export const iconMap = {
  'el-icon-document-copy': '📋',
  'el-icon-plus': '+',
  'el-icon-loading': '⟳',
  'el-icon-circle-plus-outline': '+',
  'el-icon-success': '✓',
  'el-icon-warning': '⚠',
  'el-icon-error': '✗',
  'el-icon-info': 'ℹ'
}

// 获取图标内容
export function getIcon(iconClass) {
  return iconMap[iconClass] || ''
}

// 检查是否是图标类名
export function isIconClass(className) {
  return className && className.startsWith('el-icon-')
}

export default iconMap

