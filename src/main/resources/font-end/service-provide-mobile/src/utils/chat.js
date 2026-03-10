
import { formatTime, formatDate } from '@/utils/index.js'

export const MessageType = {
  br: 'BR', // 换行
  text: 'text',
  image: 'image',
  video: 'video', //
  system: 'system', //
  mixed: 'mixed' // 混合类型，即有文本，又有图片，
}

/**根据会话条目 获得最后一条消息
 * @param {Object} content 会话内容
 */
export function getLastMsg(content) {
  try {
    const lastMsg = content[0]
    if (lastMsg.type == MessageType.text) {
      return lastMsg.text
    } else if (lastMsg.type == MessageType.image) {
      return '图片'
    } else if (lastMsg.type == MessageType.video) {
      return '视频'
    } else {
      return ' '
    }
  } catch (e) {
    return ' '
  }
}



/**根据会话条目 获得时间
 * @param {Object} time 
 */
export function getLastTime(time) {
  
  // 创建日期对象, 标准写法，兼容IOS 系统
  let dateStr = time
	if(typeof time === 'string'){
    // 修改旧苹果手机中，时间字符串的要求，如：2025-10-25 10:00:00 改为 2025-10-25T10:00:00
    // 注意：不要添加 'Z' 后缀，因为原始时间是本地时间，不是UTC时间
		dateStr  = time.replace(' ', 'T');
	}

  const date = new Date(dateStr)
  const now = new Date()

  // 判断是否是今天
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  if (isToday) {
    // 如果是今天，返回 小时:分钟
    return formatTime(date)
  } else {
    // 如果不是今天，返回 几月几日
    return formatDate(date)
  }
}