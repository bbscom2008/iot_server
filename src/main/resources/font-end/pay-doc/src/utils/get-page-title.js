import defaultSettings from '@/settings'

const title = defaultSettings.title || '使用文档'

export default function getPageTitle(pageTitle) {
  // if (pageTitle) {
  //   return `${pageTitle} - ${title}`
  // }
  return `${title}`
}
