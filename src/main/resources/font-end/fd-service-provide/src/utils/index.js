
import { checkTradePassword } from '@/api/user.js'

import clipboard from '@/utils/clipboard'


/**
 * 可控并发执行异步任务（支持分段暂停，避免阻塞）
 * @param {Array} tasks - 异步任务列表（每项为返回 Promise 的函数）
 * @param {number} limit - 最大并发数
 * @param {number} batchSize - 每批执行数量（如50）
 * @param {number} batchDelay - 每批执行完暂停的毫秒数（如200）
 * @returns {Promise<Array>} 所有任务的执行结果（按原顺序）
 */
export async function promisePool(
  tasks,
  limit,
  batchSize = 50,
  batchDelay = 500,
  callback = null
) {
  const results = [];
  let currentIndex = 0;
  let completedCount = 0;
  
  // 执行一批任务
  async function runBatch() {
    const batchTasks = [];
    const batchIndexes = [];
    
    // 收集一批任务
    while (batchTasks.length < limit && currentIndex < tasks.length) {
      const index = currentIndex++;
      batchIndexes.push(index);
      batchTasks.push(
        tasks[index]().then(
          result => ({ index, status: 'fulfilled', value: result }),
          error => ({ index, status: 'rejected', reason: error })
        )
      );
    }
    
    if (batchTasks.length === 0) return false;
    
    // 并发执行这一批
    const batchResults = await Promise.all(batchTasks);
    
    // 按原顺序存储结果
    batchResults.forEach(({ index, ...result }) => {
      results[index] = result;
    });
    
    completedCount += batchTasks.length;
    if (callback) callback(completedCount, tasks.length);
    
    return true;
  }
  
  // 主循环：分批执行
  while (currentIndex < tasks.length) {
    const startCount = completedCount;
    
    // 执行一个批次（batchSize个任务，但分成多个limit大小的子批）
    for (let i = 0; i < batchSize && currentIndex < tasks.length; i += limit) {
      await runBatch();
    }
    
    // 如果这一批有执行任务，并且不是最后一批，则暂停
    if (completedCount > startCount && currentIndex < tasks.length) {
      console.log(`已完成${completedCount}个请求，暂停${batchDelay}ms`);
      await new Promise(resolve => setTimeout(resolve, batchDelay));
    }
  }
  
  return results;
}



export function copyInfo(e, info) {

  clipboard(info, e)
}

export  async function checkPassword(that) {
  try {
    // 使用 h 函数创建 VNode
    const messageVNode = that.$createElement('span', null, [
      '请输入交易密码,如果没有, ',
      that.$createElement('span', {
        style: {
          color: '#409EFF',
          cursor: 'pointer',
          textDecoration: 'underline'
        },
        on: {
          click: () => {
            that.$store.commit('user/SET_SECURITY_CENTER_FLAG', true)
          }
        }
      }, '请到安全中心设置')
    ])
    
    let { value } = await that.$prompt(messageVNode, '校验', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputType: 'password',
      inputPattern: /^.{1,20}$/,
      inputErrorMessage: '请输入交易密码',
      customClass: 'password-check-dialog'
    })

    return await checkTradePassword(value)
  } catch (err) {
    console.log('checkPassword err-444--' + err)
    return Promise.reject(err)
  }
}


export function randomHeadIcon() {
  let headIcon = localStorage.getItem("headIcon");
  if (headIcon == null) {
    headIcon = Math.floor(Math.random() * 11);
    localStorage.setItem("headIcon", headIcon);
  }
  return headIcon
}

/**
 * 生成自用的 唯一 ID
 * @returns
 */
export function generateUniqueId() {
  // 1. 获取当前时间戳（毫秒）并转换为36进制字符串，更短
  const timestamp = Date.now().toString(36);

  // 2. 生成一个随机数并转换为36进制字符串，并截取掉前面的 '0.'
  const randomStr = Math.random().toString(36).substring(2);

  // 3. 拼接两者，得到一个几乎不可能重复的ID
  return `${timestamp}-${randomStr}`;
}


/**
 * base64 转 blob
 * @param {*} base64
 * @returns
 */
export function base64ToBlob(base64) {
  // 分割 base64 字符串获取内容类型和纯数据部分
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);

  // 转换为 Uint8Array
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // 创建 File 对象
  return new File(
    [u8arr],
    "img_" + generateUniqueId() + "." + mime.split("/")[1],
    { type: mime }
  );
}


export function parseNow() {
  return parseTime(new Date())
}



/**
 * 下载文件
 * @param {*} link 
 */
export function downloadFile(link, fileName) {
  fetch(link)
  .then(res => res.blob())
  .then(blob => {
    let a_link = document.createElement('a');
    a_link.href = URL.createObjectURL(blob);
    a_link.download = fileName; // 设置下载后的文件名
    document.body.appendChild(a_link);
    a_link.click();
  });
}




/**
 * 判断二个时间,都是在 3 天之前的,
 * @param {*} startTime
 * @param {*} endTime
 * @returns
 */
export function isThreeDaysBefore(startTime, endTime) {
  const now = new Date()
  const today_start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0) // 今天凌晨
  const middle = new Date(today_start.getTime() - 3600 * 1000 * 24 * 2 - 500)

  const start = new Date(startTime)
  const end = new Date(endTime)

  if (start.getTime() < middle.getTime() && end.getTime() < middle.getTime()) {
    return true
  } else if (start.getTime() > middle.getTime() && end.getTime() > middle.getTime()) {
    return false
  } else {
    throw new Error('时间范围错误')
  }
}

export function isEmpty(value) {
  if (value === null || value === undefined || value === '') {
    return true
  } else {
    return false
  }
}

/**
 * 去掉字符串中所有的空格，并将所有的中文逗号 改为 英文 逗号
 * @param {*} str
 * @returns
 */
export function processFixAmountString(str) {
  // 去掉所有空格
  let newStr = str.replace(/\s/g, '')
  // 将中文逗号替换为英文逗号
  newStr = newStr.replace(/，/g, ',')
  return newStr
}

export function formatDateTime(date) {
  // return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
export function formatDateDate(date) {
  // return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}




/**
 * 格式化时间为 小时:分钟
 * @param {Date} date - 日期对象
 * @returns {string} 格式化的时间字符串
 */
export function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 格式化日期为 几月几日
 * @param {Date} date - 日期对象
 * @returns {string} 格式化的日期字符串
 */
export function formatDate(date) {
  const month = date.getMonth() + 1; // 月份从0开始，需要+1
  const day = date.getDate();
  return `${month}月${day}日`;
}


/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
// export function formatTime(time, option) {
//   if (('' + time).length === 10) {
//     time = parseInt(time) * 1000
//   } else {
//     time = +time
//   }
//   const d = new Date(time)
//   const now = Date.now()

//   const diff = (now - d) / 1000

//   if (diff < 30) {
//     return '刚刚'
//   } else if (diff < 3600) {
//     // less 1 hour
//     return Math.ceil(diff / 60) + '分钟前'
//   } else if (diff < 3600 * 24) {
//     return Math.ceil(diff / 3600) + '小时前'
//   } else if (diff < 3600 * 24 * 2) {
//     return '1天前'
//   }
//   if (option) {
//     return parseTime(time, option)
//   } else {
//     return (
//       d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
//     )
//   }
// }

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xdc00 && code <= 0xdfff) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach((v) => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * 判断设备类型
 * @returns {number} 设备类型代码：
 * - 0：未知
 * - 1：Windows
 * - 2：macOS
 * - 3：Linux
 * - 4：iPhone
 * - 5：iPad
 * - 6：Android
 */
export function getDeviceType() {
  const userAgent = navigator.userAgent

  // 检测iPhone
  if (/iPhone/i.test(userAgent) && !/iPad/i.test(userAgent)) {
    return 4
  }
  // 检测iPad
  if (
    /iPad/i.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ) {
    return 5
  }

  // 检测Android
  if (/Android/i.test(userAgent)) {
    return 6
  }

  // 检测Windows
  if (/Win/i.test(userAgent)) {
    return 1
  }

  // 检测macOS
  if (/Mac/i.test(userAgent)) {
    return 2
  }

  // 检测Linux
  if (/Linux/i.test(userAgent)) {
    return 3
  }

  // 未知设备
  return 0
}
///判断是不是只传了系统订单号||商户订单号，或者俩都传了
export function hasOnlyTwoValues(obj) {
  const keys = Object.keys(obj)
  const systemOrderNoFlag = keys.includes('systemOrderNo')
  const merchantOrderNoFlag = keys.includes('merchantOrderNo')
  if (keys.length == 1 && (systemOrderNoFlag || merchantOrderNoFlag)) {
    return true
  } else if (keys.length == 2 && systemOrderNoFlag && merchantOrderNoFlag) {
    return true
  }
  return false
}
