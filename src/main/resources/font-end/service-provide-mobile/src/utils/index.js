
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

  // 手机端，只检查开始时间，是否是 3 天前
  if (start.getTime() < middle.getTime()) {
    return true
  } else {
    return false
  }

  // if (start.getTime() < middle.getTime() && end.getTime() < middle.getTime()) {
  //   return true
  // } else if (start.getTime() > middle.getTime() && end.getTime() > middle.getTime()) {
  //   return false
  // } else {
  //   throw new Error('时间范围错误')
  // }
}



export function openExternal(url) {
  window.location.href = url;
}


export function copyInfo(info) {
  uni.setClipboardData({
    data: info,
    success: () => {
      uni.showToast({
        title: '复制成功 : ' + info,
        icon: 'none'
      })
    }
  })
}




// px 转换为 rpx 
export function pxToRpx(px) {
  // 获取屏幕信息进行动态换算
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth;

  return px * (750 / screenWidth);
}

// rpx 转换为 px 
export function rpxToPx(rpx) {
  // 获取屏幕信息进行动态换算
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth;

  return rpx * (screenWidth / 750);
}




export function parseNow() {
  return parseTime(new Date())
}

/**
 * base64 转 blob
 * @param {*} base64 
 * @returns 
 */
export function base64ToBlob(base64) {
  // 分割 base64 字符串获取内容类型和纯数据部分
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);

  // 转换为 Uint8Array
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // 创建 File 对象
  return new File([u8arr], 'img_' + generateUniqueId() + '.' + mime.split('/')[1], {
    type: mime
  });

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
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
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


export function isEmpty(value) {
  if (value === null || value === undefined || value === '') {
    return true
  } else {
    return false
  }
}

export function replaceBigNumbers(jsonStr) {
  // 匹配JSON中的数字（排除字符串内的数字）
  const regex = /"[^"]*"|(\d+)/g;

  return jsonStr.replace(regex, (match, number) => {
    if (number) { // 如果是数字部分
      return BigInt(number) > Number.MAX_SAFE_INTEGER ? `"${number}"` : number;
    }
    return match; // 如果是字符串部分，直接返回
  });
}
// export function replaceBigNumbers(jsonStr) {
//   try {
//     // 第一次解析获取原始数据
//     const rawData = JSON.parse(jsonStr);

//     // 保存需要保持原样的字段值
//     const preservedValues = {};
//     if (rawData?.data?.list) {
//       rawData.data.list.forEach((item, index) => {
//         if (item.collectInfoContent) {
//           preservedValues[`list_${index}_collectInfoContent`] = item.collectInfoContent;
//         }
//       });
//     }

//     // 使用 reviver 函数处理 JSON 解析
//     const parsedData = JSON.parse(jsonStr, (key, value) => {
//       // 跳过需要保持原样的字段
//       for (const preservedKey in preservedValues) {
//         const [type, index, field] = preservedKey.split('_');
//         if (type === 'list' && key === field) {
//           return preservedValues[preservedKey];
//         }
//       }

//       // 处理数字类型
//       if (typeof value === 'number' && Number.isInteger(value)) {
//         const strValue = String(value);
//         try {
//           if (BigInt(strValue) > BigInt(Number.MAX_SAFE_INTEGER)) {
//             return strValue;
//           }
//         } catch (e) {
//           // BigInt 转换失败则保持原样
//         }
//       }
//       return value;
//     });

//     // 恢复保持原样的字段
//     if (parsedData?.data?.list) {
//       parsedData.data.list.forEach((item, index) => {
//         const preservedKey = `list_${index}_collectInfoContent`;
//         if (preservedValues[preservedKey]) {
//           item.collectInfoContent = preservedValues[preservedKey];
//         }
//       });
//     }

//     return parsedData;
//   } catch (error) {
//     console.error('JSON 处理失败:', error);
//     // 返回原始数据或抛出错误，根据需求调整
//     try {
//       return JSON.parse(jsonStr);
//     } catch (e) {
//       throw new Error('无效的 JSON 数据');
//     }
//   }
// }




/**
 * 防抖函数
 * @param {Function} func 要执行的函数
 * @param {number} wait 等待时间(毫秒)
 * @return {Function} 返回防抖处理后的函数
 */
export function debounce(func, wait = 500) {
  let timeout = null;

  return function () {
    const context = this;
    const args = arguments;

    // 清除之前设置的定时器
    if (timeout) clearTimeout(timeout);
    // 延迟执行
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
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


export function isAndroidApp() {
  const userAgent = navigator.userAgent
  console.log("userAgent==", userAgent);

  // 包装的安卓APP
  if (/provide-mobile-app/i.test(userAgent)) {
    return true
  }

  return false

}